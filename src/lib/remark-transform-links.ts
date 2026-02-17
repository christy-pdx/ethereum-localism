import { visit } from "unist-util-visit";
import type { Root } from "mdast";

import { resolveLink, transformAssetSrc } from "./content-links";

/** Remark plugin to transform internal links and image src to Knowledge Garden URLs.
 * @param options.baseSlug - Slug of the document containing the links (for resolving relative paths)
 */
export function remarkTransformLinks(options?: { baseSlug?: string }) {
  const baseSlug = options?.baseSlug ?? "";
  return (tree: Root) => {
    if (!tree || typeof tree !== "object") return;
    try {
      visit(tree, (node: unknown) => {
        if (!node || typeof node !== "object" || !("type" in node)) return;
        const n = node as { type: string; url?: string };
        if (n.type !== "link" && n.type !== "image") return;
        if (!n.url) return;
        if (n.type === "link") {
          const resolved = resolveLink(n.url, baseSlug);
          if (resolved) n.url = resolved;
        } else {
          const transformed = transformAssetSrc(n.url);
          if (transformed !== n.url) n.url = transformed;
        }
      });
    } catch {
      // Skip transform if tree has unexpected structure
    }
  };
}
