import { visit } from "unist-util-visit";
import type { Root } from "hast";
import { resolveLink, transformAssetSrc } from "./content-links";

/** Rehype plugin to transform HTML links and image src to Knowledge Garden URLs */
export function rehypeTransformLinks() {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "a" && node.properties?.href) {
        const href = node.properties.href as string;
        const resolved = resolveLink(href);
        if (resolved) {
          node.properties.href = resolved;
        }
        // External links open in new tab
        if (href.startsWith("http://") || href.startsWith("https://")) {
          node.properties.target = "_blank";
          node.properties.rel = "noopener noreferrer";
        }
      }
      if (node.tagName === "img" && node.properties?.src) {
        const src = node.properties.src as string;
        const transformed = transformAssetSrc(src);
        if (transformed !== src) {
          node.properties.src = transformed;
        }
      }
    });
  };
}
