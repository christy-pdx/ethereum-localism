"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, string>) => void;
    };
  }
}

/** Client component that attaches Umami event tracking listeners.
 * - Outbound links: tracks "Outbound Link" with url
 * - Resource links: tracks "Resource Click" with name (when data-track="resource")
 * - Garden navigation: tracks "Garden Navigation" with path (internal KG/intro links)
 */
export function UmamiTracking() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    function handleClick(e: MouseEvent) {
      const link = (e.target as HTMLElement).closest("a");
      if (!link?.href) return;

      if (!window.umami?.track) return;

      const isExternal = link.hostname !== window.location.hostname;

      if (link.getAttribute("data-track") === "resource") {
        window.umami.track("Resource Click", {
          name: link.dataset.resourceName || link.href,
          ...(isExternal && { url: link.href }),
        });
        return;
      }

      if (isExternal) {
        window.umami.track("Outbound Link", { url: link.href });
        return;
      }

      const path = new URL(link.href, window.location.origin).pathname;
      const isGardenNav =
        path.startsWith("/knowledge-garden") || path.startsWith("/introduction");
      if (isGardenNav && path !== window.location.pathname) {
        window.umami.track("Garden Navigation", { path });
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
