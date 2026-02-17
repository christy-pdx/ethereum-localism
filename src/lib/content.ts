import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");
const KG_BASE = "/knowledge-garden";

/** Normalize path for consistent slugs (always use /) */
function normalizePath(p: string): string {
  return p.split(path.sep).join("/");
}

/** Convert file path to URL slug (Quartz-style: spaces → hyphens, no .md) */
export function pathToSlug(filePath: string): string {
  const relative = normalizePath(path.relative(CONTENT_DIR, filePath));
  const withoutExt = relative.replace(/\.md$/, "");
  return withoutExt.replace(/\s+/g, "-");
}

/** Convert slug to full Knowledge Garden URL */
export function slugToUrl(slug: string): string {
  if (!slug) return KG_BASE;
  return `${KG_BASE}/${slug}`;
}

/** Get all markdown files recursively */
export function getAllContentPaths(): string[] {
  const files: string[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(fullPath);
      }
    }
  }

  walk(CONTENT_DIR);
  return files;
}

/** Build a map of possible link targets for resolution */
export function getSlugToPathMap(): Map<string, string> {
  const map = new Map<string, string>();
  const paths = getAllContentPaths();

  for (const filePath of paths) {
    const slug = pathToSlug(filePath);
    const relative = normalizePath(path.relative(CONTENT_DIR, filePath)).replace(/\.md$/, "");
    const slugForm = relative.replace(/\s+/g, "-");

    map.set(slug, filePath);
    map.set(slugForm, filePath);
    map.set(relative, filePath);

    // Slug without trailing ? (e.g. What-is-Ethereum-For vs What-is-Ethereum-For?)
    if (slug.endsWith("?")) {
      map.set(slug.slice(0, -1), filePath);
    }
    // " - " variants: pathToSlug gives "---", links often use "--" or "-"
    if (slug.includes("---")) {
      map.set(slug.replace(/---/g, "--"), filePath);
      map.set(slug.replace(/---/g, "-"), filePath); // e.g. GFEL-Boulder-2025-Video-Recap
    }
    // "&" in filename: add variant without & (e.g. GFEL-Coloring-Activity-Book)
    if (slug.includes("&")) {
      map.set(slug.replace(/&/g, ""), filePath);
    }

    // "path/index" format and parent path for index.md files
    if (relative.endsWith("/index") || relative === "index") {
      const parentSlug = relative === "index" ? "" : slugForm.replace(/\/index$/, "");
      if (parentSlug) {
        map.set(parentSlug + "/index", filePath);
        map.set(parentSlug, filePath); // library/Ethereum-Localism/ethereum-localism-book
      }
    }
  }

  return map;
}

export interface ContentMeta {
  title?: string;
  date?: string;
  author?: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface ContentItem {
  slug: string;
  url: string;
  meta: ContentMeta;
  body: string;
  filePath: string;
}

/** Get content by file path */
export function getContentByPath(filePath: string): ContentItem | null {
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const slug = pathToSlug(filePath);
  const url = slug ? `${KG_BASE}/${slug}` : KG_BASE;

  return {
    slug,
    url,
    meta: data as ContentMeta,
    body: content,
    filePath,
  };
}

/** Get content by slug (resolves from content dir) */
export function getContentBySlug(slug: string): ContentItem | null {
  const map = getSlugToPathMap();
  // Try exact slug
  let filePath = map.get(slug);
  if (filePath) return getContentByPath(filePath);

  // Try with spaces instead of hyphens
  const withSpaces = slug.replace(/-/g, " ");
  filePath = map.get(withSpaces);
  if (filePath) return getContentByPath(filePath);

  // Try index fallback: "library/Field-Reports" -> "library/Field-Reports/index"
  const indexSlug = `${slug}/index`;
  filePath = map.get(indexSlug);
  if (filePath) return getContentByPath(filePath);

  // Try index file on filesystem (handles "library/Field-Reports" -> "library/Field Reports/index.md")
  const indexWithSpaces = path.join(CONTENT_DIR, ...withSpaces.split("/"), "index.md");
  if (fs.existsSync(indexWithSpaces)) return getContentByPath(indexWithSpaces);

  const indexWithHyphens = path.join(CONTENT_DIR, ...slug.split("/"), "index.md");
  if (fs.existsSync(indexWithHyphens)) return getContentByPath(indexWithHyphens);

  // Try building path from slug (single file)
  const possiblePath = path.join(CONTENT_DIR, slug.replace(/-/g, " ") + ".md");
  if (fs.existsSync(possiblePath)) return getContentByPath(possiblePath);

  const possiblePath2 = path.join(CONTENT_DIR, slug + ".md");
  if (fs.existsSync(possiblePath2)) return getContentByPath(possiblePath2);

  return null;
}

/** Get the index/content for Knowledge Garden home */
export function getKgIndex(): ContentItem | null {
  const indexPath = path.join(CONTENT_DIR, "index.md");
  if (fs.existsSync(indexPath)) return getContentByPath(indexPath);
  return null;
}
