"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useTheme } from "@/contexts/ThemeContext";
import type { GraphData } from "@/lib/graph-data";

/** Ref methods for pan boundary and engine control */
interface ForceGraphRef {
  pauseAnimation: () => void;
  getGraphBbox: (nodeFilter?: (node: object) => boolean) => { x: [number, number]; y: [number, number] } | null;
  zoom: (scale?: number, durationMs?: number) => number | void;
  zoomToFit: (durationMs?: number, padding?: number, nodeFilter?: (node: object) => boolean) => void;
}

// Dynamic import to avoid SSR - ForceGraph2D uses canvas/browser APIs.
const ForceGraph2D = dynamic(
  () => import("react-force-graph-2d").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[240px] items-center justify-center text-stone-500">
        Loading graph…
      </div>
    ),
  }
);

const MAX_GRAPH_WIDTH = 1152; // max-w-6xl

interface KnowledgeGraphProps {
  data: GraphData;
  height?: number;
  className?: string;
}

/** Group colors for node coloring */
const GROUP_COLORS: Record<string, string> = {
  library: "#0d9488", // teal-600
  resources: "#0f766e", // teal-700
  introduction: "#14b8a6", // teal-500
  root: "#64748b", // stone-500
};

function getNodeColor(group?: string): string {
  return GROUP_COLORS[group ?? "root"] ?? "#64748b";
}

/** Padding multiplier: view center must stay within graph bbox expanded by this factor */
const PAN_BOUNDARY_PADDING = 2.5;

const MOBILE_BREAKPOINT = 1024; // lg

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

export function KnowledgeGraph({ data, height = 400, className = "" }: KnowledgeGraphProps) {
  const router = useRouter();
  const { isDark } = useTheme();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ForceGraphRef | null>(null);
  const isCorrectingRef = useRef(false);
  const [dimensions, setDimensions] = useState({ width: 640, height: height || 400 });
  const [selectedNode, setSelectedNode] = useState<{
    id: string;
    name: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      if (el) {
        const w = Math.min(el.offsetWidth, MAX_GRAPH_WIDTH);
        setDimensions({ width: Math.max(320, w), height: height || 400 });
      }
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [height]);

  const handleEngineStop = useCallback(() => {
    graphRef.current?.pauseAnimation();
    if (isMobile) {
      setTimeout(() => {
        graphRef.current?.zoomToFit(200, 16);
      }, 50);
    }
  }, [isMobile]);

  const handleNodeClick = useCallback(
    (node: object) => {
      const n = node as { id?: string; name?: string; url?: string };
      if (!n.url) return;
      if (isMobile) {
        if (selectedNode?.id === n.id) {
          router.push(n.url);
        } else {
          setSelectedNode({
            id: n.id ?? "",
            name: n.name ?? n.id ?? "Note",
            url: n.url,
          });
        }
      } else {
        router.push(n.url);
      }
    },
    [router, isMobile, selectedNode]
  );

  /** Enforce pan boundary: snap back if view center has left the padded graph area.
   * Uses onZoom (during drag) so the limit is felt immediately, not just on release.
   * Note: ev.x, ev.y from force-graph are graph coords of view center (from centerAt merge). */
  const handleZoom = useCallback(
    (ev: { k: number; x: number; y: number }) => {
      if (isCorrectingRef.current) return; // avoid re-entrancy when zoomToFit emits zoom events
      const fg = graphRef.current;
      if (!fg?.getGraphBbox) return;

      const bbox = fg.getGraphBbox();
      if (!bbox) return;

      const [xMin, xMax] = bbox.x;
      const [yMin, yMax] = bbox.y;
      if (
        !Number.isFinite(xMin) ||
        !Number.isFinite(xMax) ||
        !Number.isFinite(yMin) ||
        !Number.isFinite(yMax)
      )
        return;
      const rangeX = Math.max(xMax - xMin, 100);
      const rangeY = Math.max(yMax - yMin, 100);
      const padX = rangeX * PAN_BOUNDARY_PADDING;
      const padY = rangeY * PAN_BOUNDARY_PADDING;
      const paddedMinX = xMin - padX;
      const paddedMaxX = xMax + padX;
      const paddedMinY = yMin - padY;
      const paddedMaxY = yMax + padY;

      // ev.x, ev.y = graph coords of view center (force-graph merges centerAt into callback)
      const centerX = ev.x;
      const centerY = ev.y;
      if (!Number.isFinite(centerX) || !Number.isFinite(centerY)) return;

      const outsideBounds =
        centerX < paddedMinX ||
        centerX > paddedMaxX ||
        centerY < paddedMinY ||
        centerY > paddedMaxY;

      if (outsideBounds) {
        isCorrectingRef.current = true;
        fg.zoomToFit(200, 40);
        setTimeout(() => {
          isCorrectingRef.current = false;
        }, 250); // slightly longer than zoomToFit(200) transition
      }
    },
    []
  );

  const handleResetView = useCallback(() => {
    graphRef.current?.zoomToFit(300, isMobile ? 16 : 40);
  }, [isMobile]);

  const handleGoToSelected = useCallback(() => {
    if (selectedNode) {
      router.push(selectedNode.url);
    }
  }, [router, selectedNode]);

  const ZOOM_FACTOR = 1.4;
  const handleZoomIn = useCallback(() => {
    const fg = graphRef.current;
    if (!fg?.zoom) return;
    const current = fg.zoom();
    if (typeof current === "number") {
      fg.zoom(current * ZOOM_FACTOR, 150);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    const fg = graphRef.current;
    if (!fg?.zoom) return;
    const current = fg.zoom();
    if (typeof current === "number") {
      fg.zoom(Math.max(0.15, current / ZOOM_FACTOR), 150);
    }
  }, []);

  if (!data || data.nodes.length === 0) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border-2 border-dashed border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-900/50 ${className}`}
        style={{ minHeight: height }}
      >
        <p className="text-stone-500 dark:text-stone-400">
          No connections to display yet. Add internal links between notes to build the graph.
        </p>
      </div>
    );
  }

  const btnClass =
    "rounded-md border border-stone-200 bg-white/90 p-1.5 text-stone-600 shadow-sm transition hover:bg-stone-50 dark:border-stone-600 dark:bg-stone-900/90 dark:text-stone-400 dark:hover:bg-stone-800";

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-full overflow-hidden rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900 ${className}`}
      style={{ minHeight: height, maxWidth: MAX_GRAPH_WIDTH }}
    >
      {isMobile && selectedNode && (
        <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between gap-3 border-t border-stone-200 bg-white/95 px-4 py-3 dark:border-stone-700 dark:bg-stone-900/95">
          <span className="min-w-0 truncate text-sm font-medium text-stone-800 dark:text-stone-200">
            {selectedNode.name}
          </span>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              className="text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
              aria-label="Dismiss"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGoToSelected}
              className="rounded-md bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
            >
              Go →
            </button>
          </div>
        </div>
      )}
      <div className="absolute right-2 top-2 z-10 flex items-center gap-1">
        <button
          type="button"
          onClick={handleZoomOut}
          className={btnClass}
          title="Zoom out"
          aria-label="Zoom out"
        >
          <span className="text-sm font-medium leading-none">−</span>
        </button>
        <button
          type="button"
          onClick={handleZoomIn}
          className={btnClass}
          title="Zoom in"
          aria-label="Zoom in"
        >
          <span className="text-sm font-medium leading-none">+</span>
        </button>
        <button
          type="button"
          onClick={handleResetView}
          className="rounded-md border border-stone-200 bg-white/90 px-2 py-1 text-xs text-stone-600 shadow-sm transition hover:bg-stone-50 dark:border-stone-600 dark:bg-stone-900/90 dark:text-stone-400 dark:hover:bg-stone-800"
          title="Reset view"
        >
          Reset view
        </button>
      </div>
      <ForceGraph2D
        key={isDark ? "dark" : "light"}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- react-force-graph-2d ref types are stricter than our usage
        ref={graphRef as any}
        graphData={data}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor={isDark ? "#1c1917" : "#ffffff"}
        nodeId="id"
        nodeLabel={(node) => (node as { name?: string }).name ?? (node as { id?: string }).id ?? ""}
        nodeColor={(node) => getNodeColor((node as { group?: string }).group)}
        nodeRelSize={6}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const n = node as { x?: number; y?: number; name?: string; id?: string };
          const label = n.name ?? n.id ?? "";
          const color = getNodeColor((node as { group?: string }).group);
          const nodeRadius = isMobile ? 8 : 6;
          ctx.beginPath();
          ctx.arc(n.x ?? 0, n.y ?? 0, nodeRadius, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = isDark ? "#475569" : "#e2e8f0";
          ctx.lineWidth = 1 / globalScale;
          ctx.stroke();
          const showLabel = label && (isMobile || globalScale > 1.2);
          if (showLabel) {
            const fontSize = isMobile ? 11 : 10 / globalScale;
            ctx.font = `${Math.max(8, fontSize)}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = isDark ? "#e2e8f0" : "#334155";
            ctx.fillText(label, n.x ?? 0, (n.y ?? 0) + nodeRadius + 8);
          }
        }}
        nodeCanvasObjectMode="replace"
        nodePointerAreaPaint={(node, paintColor, ctx) => {
          const n = node as { x?: number; y?: number };
          const r = isMobile ? 16 : 10;
          ctx.fillStyle = paintColor;
          ctx.beginPath();
          ctx.arc(n.x ?? 0, n.y ?? 0, r, 0, 2 * Math.PI);
          ctx.fill();
        }}
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        linkColor={isDark ? "#94a3b8" : "#cbd5e1"}
        onNodeClick={handleNodeClick}
        onBackgroundClick={
          isMobile && selectedNode
            ? () => setSelectedNode(null)
            : undefined
        }
        onEngineStop={handleEngineStop}
        onZoom={handleZoom}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        enablePointerInteraction={true}
        d3AlphaMin={0.4}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        cooldownTicks={50}
        minZoom={0.15}
      />
    </div>
  );
}
