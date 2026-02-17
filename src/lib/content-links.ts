/**
 * Client-safe link resolution utilities.
 * No Node.js imports - safe to use in remark/rehype plugins that run in the browser.
 */

const KG_BASE = "/knowledge-garden";

/** Resolve a relative path segment (.. or .) against a base dir; returns final slug segments */
function resolveRelativeToDir(baseDirSegments: string[], linkSegments: string[]): string[] {
  const result = [...baseDirSegments];
  for (const seg of linkSegments) {
    if (seg === "..") {
      result.pop();
    } else if (seg !== "." && seg !== "") {
      result.push(seg);
    }
  }
  return result;
}

/** Resolve a link path (from markdown) to a Knowledge Garden URL.
 * @param href - Link target from markdown (e.g. "ethereum-localism-book-01-introduction.md" or "library/..."
 * @param sourceSlug - Full slug of the document containing the link (for resolving relative paths)
 */
export function resolveLink(href: string, sourceSlug?: string): string | null {
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

  // Paths like "library/..." or "resources/..." are content-root-absolute. Always return a
  // root-absolute URL (leading /) so the browser never resolves them relative to the current path.
  // e.g. on /knowledge-garden/library, href="library/..." would otherwise become /knowledge-garden/library/library/...
  const isContentRootPath = normalized.startsWith("library/") || normalized.startsWith("resources/");

  // Resolve relative paths when we know the source document (single-segment or ./ or ../)
  const isRelative =
    sourceSlug &&
    !isContentRootPath &&
    (normalized.startsWith("./") ||
      normalized.startsWith("../") ||
      !normalized.includes("/"));

  if (isRelative && sourceSlug) {
    const baseDirSegments = sourceSlug.includes("/")
      ? sourceSlug.split("/").slice(0, -1)
      : [];
    const linkSegments = normalized.split("/").filter(Boolean);
    const resolvedSegments = resolveRelativeToDir(baseDirSegments, linkSegments);
    const resolvedSlug = resolvedSegments.join("/");
    return resolvedSlug ? `${KG_BASE}/${resolvedSlug}` : KG_BASE;
  }

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
