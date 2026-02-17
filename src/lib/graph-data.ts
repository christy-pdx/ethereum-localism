import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import {
  getAllContentPaths,
  getContentByPath,
  getSlugToPathMap,
  pathToSlug,
  slugToUrl,
} from "./content";

const CONTENT_DIR = path.join(process.cwd(), "content");
const KG_BASE = "/knowledge-garden";

export interface GraphNode {
  id: string;
  name: string;
  slug: string;
  url: string;
  group?: string; // e.g. "library", "resources" for coloring
  val?: number; // node size hint
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const EXCLUDE_SLUGS = new Set([
  "",
  "index",
  "tag-index",
  "featured-resources-readme",
]);

/** Resolve link href to a content slug, or null if external/unknown */
function hrefToSlug(href: string, slugMap: Map<string, string>): string | null {
  if (!href || typeof href !== "string") return null;
  const h = href.trim();
  if (h.startsWith("http") || h.startsWith("mailto:") || h.startsWith("#")) {
    return null;
  }

  let slug = h
    .replace(/\.md$/i, "")
    .replace(/^\//, "")
    .replace(/\s+/g, "-");
  if (slug.startsWith("knowledge-garden/")) {
    slug = slug.slice("knowledge-garden/".length);
  }
  if (!slug) return ""; // KG root

  if (slugMap.has(slug)) return slug;
  if (slugMap.has(`${slug}/index`)) return slug;
  // Try with index for folder
  const withSpaces = slug.replace(/-/g, " ");
  if (slugMap.has(withSpaces)) return slug;

  return null;
}

/** Extract internal link hrefs from markdown content */
function extractLinkHrefs(markdown: string): string[] {
  const hrefs: string[] = [];
  try {
    const tree = unified().use(remarkParse).parse(markdown) as Root;
    visit(tree, "link", (node: { url?: string }) => {
      if (node.url) hrefs.push(node.url);
    });
  } catch {
    // Fallback: simple regex for [text](url)
    const regex = /\]\(([^)]+)\)/g;
    let m;
    while ((m = regex.exec(markdown)) !== null) {
      hrefs.push(m[1]);
    }
  }
  return hrefs;
}

/** Build graph data from all content - nodes and edges from internal links */
export function buildGraphData(): GraphData {
  const paths = getAllContentPaths();
  const slugMap = getSlugToPathMap();
  const nodeMap = new Map<string, GraphNode>();
  const linkSet = new Set<string>();

  // Add all content as nodes
  for (const filePath of paths) {
    const content = getContentByPath(filePath);
    if (!content) continue;

    const slug = pathToSlug(filePath);
    const slugKey = slug.replace(/\//g, "-");
    if (EXCLUDE_SLUGS.has(slugKey) || EXCLUDE_SLUGS.has(slug)) continue;

    const title = (content.meta?.title as string) ?? slug.split("/").pop() ?? "Untitled";
    const group = slug.split("/")[0] || "root";

    nodeMap.set(slug, {
      id: slug,
      name: title,
      slug,
      url: slugToUrl(slug),
      group,
      val: 1,
    });
  }

  // Extract links and add edges
  for (const filePath of paths) {
    const content = getContentByPath(filePath);
    if (!content) continue;

    const sourceSlug = pathToSlug(filePath);
    const sourceSlugKey = sourceSlug.replace(/\//g, "-");
    if (EXCLUDE_SLUGS.has(sourceSlugKey) || EXCLUDE_SLUGS.has(sourceSlug)) continue;
    if (!nodeMap.has(sourceSlug)) continue;

    const hrefs = extractLinkHrefs(content.body);
    for (const href of hrefs) {
      const targetSlug = hrefToSlug(href, slugMap);
      if (targetSlug === null) continue;
      if (targetSlug === sourceSlug) continue; // no self-loops
      if (!nodeMap.has(targetSlug)) continue; // target not in our content

      const edgeKey = `${sourceSlug}->${targetSlug}`;
      if (!linkSet.has(edgeKey)) {
        linkSet.add(edgeKey);
      }
    }
  }

  const nodes = Array.from(nodeMap.values());
  const links = Array.from(linkSet).map((edgeKey) => {
    const [source, target] = edgeKey.split("->");
    return { source, target };
  });

  return { nodes, links };
}
