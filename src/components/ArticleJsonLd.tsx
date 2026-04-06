import type { ContentItem } from "@/lib/content";
import { getMetaDescription } from "@/lib/content";
import { getOgDescription } from "@/lib/kg-landing";
import { getSiteUrl } from "@/lib/site-url";

function isoDate(d: Date): string {
  return d.toISOString().split("T")[0] ?? d.toISOString();
}

export function ArticleJsonLd({ content }: { content: ContentItem }) {
  const siteOrigin = getSiteUrl().replace(/\/$/, "");
  const url = `${siteOrigin}${content.url}`;
  const description =
    getMetaDescription(content.meta) ?? getOgDescription(content.meta, content.body, 300);

  const published =
    typeof content.meta.date === "string" && content.meta.date.trim()
      ? new Date(content.meta.date)
      : null;
  const modified = content.meta.updated
    ? new Date(content.meta.updated)
    : typeof content.meta.date === "string" && content.meta.date.trim()
      ? new Date(content.meta.date)
      : null;

  const headline =
    (typeof content.meta.title === "string" && content.meta.title) ||
    content.slug.split("/").pop()?.replace(/-/g, " ") ||
    "Ethereum Localism";

  const article: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url,
    image: `${siteOrigin}/hero-graphic.png`,
    isPartOf: {
      "@type": "WebSite",
      name: "Ethereum Localism",
      url: siteOrigin,
    },
    publisher: {
      "@type": "Organization",
      name: "Ethereum Localism",
      url: siteOrigin,
    },
  };

  if (published && !isNaN(published.getTime())) {
    article.datePublished = isoDate(published);
  }
  if (modified && !isNaN(modified.getTime())) {
    article.dateModified = isoDate(modified);
  } else if (published && !isNaN(published.getTime())) {
    article.dateModified = isoDate(published);
  }

  if (typeof content.meta.author === "string" && content.meta.author.trim()) {
    article.author = {
      "@type": "Person",
      name: content.meta.author.trim(),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
    />
  );
}
