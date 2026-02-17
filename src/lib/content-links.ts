/**
 * Client-safe link resolution utilities.
 * No Node.js imports - safe to use in remark/rehype plugins that run in the browser.
 */

const KG_BASE = "/knowledge-garden";

/** Resolve a link path (from markdown) to a Knowledge Garden URL */
export function resolveLink(href: string): string | null {
  if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) {
    return null; // external or anchor - don't transform
  }

  // Already a full KG URL - don't double-prefix
  if (href.startsWith(KG_BASE + "/") || href === KG_BASE) {
    return null;
  }

  const normalized = href
    .replace(/^\//, "")
    .replace(/\.md$/i, "")
    .replace(/\s+/g, "-");

  if (!normalized) return KG_BASE;
  return `${KG_BASE}/${normalized}`;
}

/** Transform image src from content-relative to public URL */
export function transformAssetSrc(src: string): string {
  if (!src || src.startsWith("http") || src.startsWith("/")) return src;
  if (src.startsWith("assets/")) {
    return `/knowledge-garden/assets/${src.slice(7)}`;
  }
  return `/knowledge-garden/assets/${src}`;
}
