import type { MetadataRoute } from "next";
import { getKnowledgeGardenSitemapEntries } from "@/lib/kg-sitemap-paths";
import { getSiteUrl } from "@/lib/site-url";

const STATIC: {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[0]["changeFrequency"]>;
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/introduction", changeFrequency: "monthly", priority: 0.9 },
  { path: "/action-kit", changeFrequency: "monthly", priority: 0.9 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl().replace(/\/$/, "");
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const r of STATIC) {
    entries.push({
      url: `${base}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    });
  }

  for (const { path: p, lastModified } of getKnowledgeGardenSitemapEntries()) {
    entries.push({
      url: `${base}${p}`,
      lastModified,
      changeFrequency: "weekly",
      priority: p === "/knowledge-garden" ? 0.95 : 0.75,
    });
  }

  return entries;
}
