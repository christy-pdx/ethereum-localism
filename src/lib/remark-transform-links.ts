import { visit } from "unist-util-visit";
import type { Root } from "mdast";

import { resolveLink, transformAssetSrc } from "./content-links";

/** Remark plugin to transform internal links and image src to Knowledge Garden URLs */
export function remarkTransformLinks() {
  return (tree: Root) => {
    visit(tree, ["link", "image"], (node) => {
      if (node.type === "link" && node.url) {
        const resolved = resolveLink(node.url);
        if (resolved) {
          node.url = resolved;
        }
      }
      if (node.type === "image" && node.url) {
        const transformed = transformAssetSrc(node.url);
        if (transformed !== node.url) {
          node.url = transformed;
        }
      }
    });
  };
}
