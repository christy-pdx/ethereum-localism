import { visit } from "unist-util-visit";
import type { Root } from "hast";
import { resolveLink, transformAssetSrc } from "./content-links";

/** Rehype plugin to transform HTML links and image src to Knowledge Garden URLs.
 * @param options.baseSlug - Slug of the document containing the links (for resolving relative paths)
 */
export function rehypeTransformLinks(options?: { baseSlug?: string }) {
  const baseSlug = options?.baseSlug ?? "";
  return (tree: Root) => {
    if (!tree || typeof tree !== "object") return;
    try {
      visit(
        tree,
        (node: unknown) => {
          if (!node || typeof node !== "object" || !("tagName" in node))
            return false;
          const n = node as { tagName: string };
          return n.tagName === "a" || n.tagName === "img";
        },
        (node) => {
          const n = node as {
            tagName: string;
            properties?: Record<string, unknown>;
          };
          if (n.tagName === "a" && n.properties?.href) {
            const href = n.properties.href as string;
            const resolved = resolveLink(href, baseSlug);
            if (resolved) n.properties.href = resolved;
            if (href.startsWith("http://") || href.startsWith("https://")) {
              n.properties.target = "_blank";
              n.properties.rel = "noopener noreferrer";
            }
          }
          if (n.tagName === "img" && n.properties?.src) {
            const src = n.properties.src as string;
            const transformed = transformAssetSrc(src);
            if (transformed !== src) n.properties.src = transformed;
          }
        }
      );
    } catch {
      // Skip transform if tree has unexpected structure
    }
  };
}
