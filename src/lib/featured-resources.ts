import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { pathToSlug, slugToUrl } from "./content";

export interface FeaturedResource {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");
const FEATURED_DIR = path.join(CONTENT_DIR, "featured-resources");

/** Parse a markdown file into FeaturedResource, or null if invalid */
function parseFeaturedFile(filePath: string): FeaturedResource | null {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  const title = data.title;
  const description = data.description;
  const ctaLabel = data.ctaLabel;
  const ctaHref = data.ctaHref;

  if (
    !title ||
    !description ||
    !ctaLabel ||
    !ctaHref ||
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof ctaLabel !== "string" ||
    typeof ctaHref !== "string"
  ) {
    return null;
  }

  return {
    title: title.trim(),
    description: String(description).trim(),
    ctaLabel: ctaLabel.trim(),
    ctaHref: ctaHref.trim(),
  };
}

/**
 * Get featured resources from:
 * 1. content/featured-resources/*.md - dedicated featured entries
 * 2. Any content file with featured: true in frontmatter (Knowledge Garden pages)
 */
export function getFeaturedResources(): FeaturedResource[] {
  const results: (FeaturedResource & { order: number })[] = [];

  // 1. Dedicated featured-resources directory
  if (fs.existsSync(FEATURED_DIR)) {
    const files = fs.readdirSync(FEATURED_DIR);
    for (const name of files) {
      if (!name.endsWith(".md")) continue;
      const filePath = path.join(FEATURED_DIR, name);
      const resource = parseFeaturedFile(filePath);
      if (resource) {
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(raw);
        results.push({
          ...resource,
          order: typeof data.order === "number" ? data.order : 99,
        });
      }
    }
  }

  // 2. Scan all content for featured: true
  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // Skip featured-resources (already processed) and node_modules etc
        if (entry.name === "featured-resources") continue;
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        const raw = fs.readFileSync(fullPath, "utf-8");
        const { data, content } = matter(raw);
        if (data.featured === true) {
          const slug = pathToSlug(fullPath);
          const url = slugToUrl(slug);
          const title = data.title ?? slug;
          const description =
            data.featuredDescription ??
            data.description ??
            content.split("\n\n")[0]?.replace(/#+\s*/g, "").trim() ??
            "";
          const ctaLabel = data.featuredCta ?? "Read more";
          const ctaHref = data.featuredCtaHref ?? url;

          if (title && description) {
            results.push({
              title: String(title),
              description: String(description),
              ctaLabel: String(ctaLabel),
              ctaHref: String(ctaHref),
              order: typeof data.featuredOrder === "number" ? data.featuredOrder : 99,
            });
          }
        }
      }
    }
  }

  walk(CONTENT_DIR);

  results.sort((a, b) => a.order - b.order);

  return results.map(({ order: _, ...r }) => r);
}
