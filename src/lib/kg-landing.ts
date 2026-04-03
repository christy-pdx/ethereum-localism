import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import {
  getAllContentPaths,
  getContentByPath,
  getMetaDescription,
  pathToSlug,
  slugToUrl,
  type ContentMeta,
} from "./content";

export interface RecentNote {
  title: string;
  slug: string;
  url: string;
  excerpt: string;
  tags: string[];
  updatedAt: Date;
  /** ISO 8601 for <time> and client-side locale formatting. */
  updatedAtIso: string;
}

export interface PopularTag {
  tag: string;
  count: number;
  url: string;
}

// Exclude these from Recent Notes (index, meta pages, etc.)
const EXCLUDE_SLUGS = new Set([
  "",
  "index",
  "tag-index",
  "featured-resources-readme",
]);

/** Strip HTML for plain-text previews; keeps text that was inside tags. */
function stripHtmlTags(raw: string): string {
  return raw
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function truncatePlain(text: string, maxLength: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= maxLength) return t;
  return t.slice(0, maxLength).trim() + "…";
}

/** Plain excerpt from note body (after frontmatter): markdown + raw HTML normalized. */
function getExcerptFromBody(body: string, maxLength = 120): string {
  const plain = stripHtmlTags(body)
    .replace(/^#+\s*/gm, "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // strip image syntax e.g. ![](assets/library.png)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // strip link syntax, keep link text
    .replace(/[#*_`]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  return truncatePlain(plain, maxLength);
}

/** Card/list excerpt: prefer frontmatter description, else first chars of body. */
function resolveExcerpt(meta: ContentMeta | undefined, body: string, maxLength = 120): string {
  const fromMeta = meta ? getMetaDescription(meta) : undefined;
  if (fromMeta) return truncatePlain(fromMeta, maxLength);
  return getExcerptFromBody(body, maxLength);
}

/** Get last commit date for a file from git history. Stable across CI rebuilds. */
function getGitLastModified(filePath: string): Date | null {
  try {
    const relativePath = path.relative(process.cwd(), filePath);
    const output = execFileSync("git", ["log", "-1", "--format=%cI", "--", relativePath], {
      encoding: "utf-8",
      maxBuffer: 1024,
    }).trim();
    if (!output) return null;
    const date = new Date(output);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/** Resolve updatedAt: frontmatter date > git log > mtime (fallback for untracked files). */
function resolveUpdatedAt(filePath: string, dateStr: string | undefined): Date {
  if (dateStr) {
    const fromMeta = new Date(dateStr);
    if (!isNaN(fromMeta.getTime())) return fromMeta;
  }
  const fromGit = getGitLastModified(filePath);
  if (fromGit) return fromGit;
  return fs.statSync(filePath).mtime;
}

export function getRecentNotes(limit = 6): RecentNote[] {
  const paths = getAllContentPaths();
  const notes: RecentNote[] = [];

  for (const filePath of paths) {
    const content = getContentByPath(filePath);
    if (!content) continue;

    const slug = pathToSlug(filePath);
    const slugKey = slug.replace(/\//g, "-");
    if (EXCLUDE_SLUGS.has(slugKey) || EXCLUDE_SLUGS.has(slug)) continue;

    const meta = content.meta;
    const title = (meta?.title as string) ?? slug.split("/").pop() ?? "Untitled";
    const tags = Array.isArray(meta?.tags) ? meta.tags : [];
    const updatedAt = resolveUpdatedAt(filePath, meta?.date as string | undefined);

    notes.push({
      title,
      slug,
      url: slugToUrl(slug),
      excerpt: resolveExcerpt(content.meta as ContentMeta | undefined, content.body),
      tags,
      updatedAt,
      updatedAtIso: updatedAt.toISOString(),
    });
  }

  notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  return notes.slice(0, limit);
}

export function getPopularTags(limit = 12): PopularTag[] {
  const paths = getAllContentPaths();
  const tagCounts = new Map<string, number>();

  for (const filePath of paths) {
    const content = getContentByPath(filePath);
    if (!content) continue;

    const slug = pathToSlug(filePath);
    const slugKey = slug.replace(/\//g, "-");
    if (EXCLUDE_SLUGS.has(slugKey) || EXCLUDE_SLUGS.has(slug)) continue;

    const tags = Array.isArray(content.meta?.tags) ? content.meta.tags : [];
    for (const tag of tags) {
      if (typeof tag === "string" && tag.trim()) {
        const t = tag.trim();
        tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
      }
    }
  }

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({
      tag,
      count,
      url: `/knowledge-garden/tag/${tag}`,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/** Get all notes that have a given tag */
export function getNotesByTag(tag: string): RecentNote[] {
  const paths = getAllContentPaths();
  const notes: RecentNote[] = [];

  for (const filePath of paths) {
    const content = getContentByPath(filePath);
    if (!content) continue;

    const slug = pathToSlug(filePath);
    const slugKey = slug.replace(/\//g, "-");
    if (EXCLUDE_SLUGS.has(slugKey) || EXCLUDE_SLUGS.has(slug)) continue;

    const tags = Array.isArray(content.meta?.tags) ? content.meta.tags : [];
    if (!tags.some((t) => typeof t === "string" && t.trim() === tag)) continue;

    const meta = content.meta;
    const title = (meta?.title as string) ?? slug.split("/").pop() ?? "Untitled";
    const updatedAt = resolveUpdatedAt(filePath, meta?.date as string | undefined);

    notes.push({
      title,
      slug,
      url: slugToUrl(slug),
      excerpt: resolveExcerpt(content.meta as ContentMeta | undefined, content.body),
      tags,
      updatedAt,
      updatedAtIso: updatedAt.toISOString(),
    });
  }

  notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  return notes;
}

/** Get all unique tags for static generation */
export function getAllTags(): string[] {
  const paths = getAllContentPaths();
  const tagSet = new Set<string>();

  for (const filePath of paths) {
    const content = getContentByPath(filePath);
    if (!content) continue;

    const slug = pathToSlug(filePath);
    const slugKey = slug.replace(/\//g, "-");
    if (EXCLUDE_SLUGS.has(slugKey) || EXCLUDE_SLUGS.has(slug)) continue;

    const tags = Array.isArray(content.meta?.tags) ? content.meta.tags : [];
    for (const tag of tags) {
      if (typeof tag === "string" && tag.trim()) {
        tagSet.add(tag.trim());
      }
    }
  }

  return Array.from(tagSet);
}

export const POPULAR_CATEGORIES = [
  { label: "Home", href: "/knowledge-garden" },
  { label: "Introduction", href: "/knowledge-garden/introduction" },
  { label: "Library", href: "/knowledge-garden/library" },
  { label: "Resources", href: "/knowledge-garden/resources" },
  { label: "Shared Definitions", href: "/knowledge-garden/library/Shared-Definitions" },
  {
    label: "Implementation Guides",
    href: "/knowledge-garden/library/Implementation-Guides",
  },
  { label: "Field Reports", href: "/knowledge-garden/library/Field-Reports" },
  { label: "GFEL", href: "/knowledge-garden/library/GFEL" },
];

/** Contribute links shown as pills on mobile (sidebar is hidden there) */
export const CONTRIBUTE_LINKS = [
  { label: "Contribution Guide", href: "/knowledge-garden/contribution-guide" },
];
