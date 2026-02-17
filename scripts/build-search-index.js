/**
 * Builds a static search index from content/*.md files.
 * Run during `npm run build`. Output: public/search-index.json
 */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const CONTENT_DIR = path.join(process.cwd(), "content");
const OUTPUT_PATH = path.join(process.cwd(), "public", "search-index.json");

const EXCLUDE_SLUGS = new Set([
  "",
  "index",
  "tag-index",
  "featured-resources-readme",
  "new-note",
]);

function getExcerpt(body, maxLength = 150) {
  const plain = body
    .replace(/^#+\s*/gm, "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_`]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).trim() + "…";
}

function pathToSlug(filePath) {
  const relative = path.relative(CONTENT_DIR, filePath).replace(/\.md$/i, "");
  return relative.split(path.sep).join("/").replace(/\s+/g, "-");
}

function slugToUrl(slug) {
  return slug ? `/knowledge-garden/${slug}` : "/knowledge-garden";
}

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

function buildSearchIndex() {
  const files = walk(CONTENT_DIR);
  const index = [];

  for (const filePath of files) {
    const slug = pathToSlug(filePath);
    const slugKey = slug.replace(/\//g, "-");
    if (EXCLUDE_SLUGS.has(slugKey) || EXCLUDE_SLUGS.has(slug)) continue;

    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    const title = (data?.title ?? slug.split("/").pop() ?? "Untitled")
      .replace(/\s+/g, " ")
      .trim();
    const tags = Array.isArray(data?.tags) ? data.tags : [];
    const excerpt = getExcerpt(content);

    index.push({
      id: slug,
      title,
      slug,
      url: slugToUrl(slug),
      excerpt,
      tags,
      searchText: [title, excerpt, ...tags].filter(Boolean).join(" ").toLowerCase(),
    });
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(index), "utf-8");
  console.log(`Built search index: ${index.length} notes -> ${OUTPUT_PATH}`);
}

buildSearchIndex();
