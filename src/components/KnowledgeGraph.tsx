"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
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

export function KnowledgeGraph({ data, height = 400, className = "" }: KnowledgeGraphProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ForceGraphRef | null>(null);
  const isCorrectingRef = useRef(false);
  const [dimensions, setDimensions] = useState({ width: 640, height: height || 400 });

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
  }, []);

  const handleNodeClick = useCallback(
    (node: object) => {
      const n = node as { url?: string };
      if (n.url) {
        router.push(n.url);
      }
    },
    [router]
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
    graphRef.current?.zoomToFit(300, 40);
  }, []);

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- react-force-graph-2d ref types are stricter than our usage
        ref={graphRef as any}
        graphData={data}
        width={dimensions.width}
        height={dimensions.height}
        nodeId="id"
        nodeLabel={(node) => (node as { name?: string }).name ?? (node as { id?: string }).id ?? ""}
        nodeColor={(node) => getNodeColor((node as { group?: string }).group)}
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        linkColor="#cbd5e1"
        onNodeClick={handleNodeClick}
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
