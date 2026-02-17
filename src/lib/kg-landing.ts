import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  getAllContentPaths,
  getContentByPath,
  pathToSlug,
  slugToUrl,
} from "./content";

export interface RecentNote {
  title: string;
  slug: string;
  url: string;
  excerpt: string;
  tags: string[];
  updatedAt: Date;
  updatedAtLabel: string;
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

function getExcerpt(body: string, maxLength = 120): string {
  const plain = body
    .replace(/^#+\s*/gm, "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // strip image syntax e.g. ![](assets/library.png)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // strip link syntax, keep link text
    .replace(/[#*_`]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).trim() + "…";
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return "1 month ago";
  return `${Math.floor(diffDays / 30)} months ago`;
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
    const dateStr = meta?.date as string | undefined;
    let updatedAt: Date;

    if (dateStr) {
      updatedAt = new Date(dateStr);
      if (isNaN(updatedAt.getTime())) {
        const stat = fs.statSync(filePath);
        updatedAt = stat.mtime;
      }
    } else {
      const stat = fs.statSync(filePath);
      updatedAt = stat.mtime;
    }

    notes.push({
      title,
      slug,
      url: slugToUrl(slug),
      excerpt: getExcerpt(content.body),
      tags,
      updatedAt,
      updatedAtLabel: formatRelativeDate(updatedAt),
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
    const dateStr = meta?.date as string | undefined;
    let updatedAt: Date;

    if (dateStr) {
      updatedAt = new Date(dateStr);
      if (isNaN(updatedAt.getTime())) {
        const stat = fs.statSync(filePath);
        updatedAt = stat.mtime;
      }
    } else {
      const stat = fs.statSync(filePath);
      updatedAt = stat.mtime;
    }

    notes.push({
      title,
      slug,
      url: slugToUrl(slug),
      excerpt: getExcerpt(content.body),
      tags,
      updatedAt,
      updatedAtLabel: formatRelativeDate(updatedAt),
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
  { label: "+ New Note", href: "/knowledge-garden/new-note" },
  { label: "Contribution Guide", href: "/knowledge-garden/contribution-guide" },
];
