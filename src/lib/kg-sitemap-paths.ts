import path from "path";
import { getAllContentPaths, getContentByPath, type ContentMeta } from "./content";
import { getAllTags, getContentUpdatedDate, getNotesByTag } from "./kg-landing";

const CONTENT_DIR = path.join(process.cwd(), "content");
const KG = "/knowledge-garden";

function canonicalKgPathForRelative(relativeNoExt: string): string {
  const slugParts = relativeNoExt.replace(/[\s,]+/g, "-").split("/");
  if (relativeNoExt === "index") return KG;
  if (slugParts.length >= 2 && slugParts[slugParts.length - 1] === "index") {
    return `${KG}/${slugParts.slice(0, -1).join("/")}`;
  }
  return `${KG}/${slugParts.join("/")}`;
}

/** One entry per canonical KG URL with a conservative lastModified for sitemaps. */
export function getKnowledgeGardenSitemapEntries(): { path: string; lastModified: Date }[] {
  const paths = getAllContentPaths();
  const byPath = new Map<string, Date>();

  for (const filePath of paths) {
    const item = getContentByPath(filePath);
    if (!item) continue;

    const relative = path
      .relative(CONTENT_DIR, filePath)
      .split(path.sep)
      .join("/")
      .replace(/\.md$/, "");
    const urlPath = canonicalKgPathForRelative(relative);
    const updated = getContentUpdatedDate(filePath, item.meta as ContentMeta | undefined);

    const prev = byPath.get(urlPath);
    if (!prev || updated.getTime() > prev.getTime()) {
      byPath.set(urlPath, updated);
    }
  }

  for (const tag of getAllTags()) {
    const notes = getNotesByTag(tag);
    const last =
      notes.length > 0
        ? notes.reduce((max, n) => (n.updatedAt > max ? n.updatedAt : max), notes[0]!.updatedAt)
        : new Date();
    byPath.set(`${KG}/tag/${tag.split("/").join("/")}`, last);
  }

  return Array.from(byPath.entries())
    .map(([p, lastModified]) => ({ path: p, lastModified }))
    .sort((a, b) => a.path.localeCompare(b.path));
}
