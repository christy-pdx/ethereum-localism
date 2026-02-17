"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { remarkTransformLinks } from "@/lib/remark-transform-links";
import { rehypeTransformLinks } from "@/lib/rehype-transform-links";
import { transformAssetSrc } from "@/lib/content-links";
import type { Components } from "react-markdown";

/** Extract YouTube video ID from watch or youtu.be URLs */
function getYouTubeEmbedId(src: string | undefined): string | null {
  if (!src) return null;
  try {
    const url = new URL(src);
    if (url.hostname.includes("youtube.com") && url.searchParams.get("v")) {
      return url.searchParams.get("v");
    }
    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1).split("?")[0] || null;
    }
  } catch {
    return null;
  }
  return null;
}

/** Check if href points to an external URL */
function isExternalLink(href: string | undefined): boolean {
  if (!href || typeof href !== "string") return false;
  return href.startsWith("http://") || href.startsWith("https://");
}

/** Resolve href to absolute KG URL. Handles paths the remark/rehype plugins may have missed. */
function resolveHref(href: string | undefined, baseSlug?: string): string | undefined {
  if (!href || typeof href !== "string") return href;
  if (href.startsWith("/") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#"))
    return href;
  // Content-root paths: library/..., resources/...
  if (href.startsWith("library/") || href.startsWith("resources/"))
    return `/knowledge-garden/${href.replace(/\.md$/i, "")}`;
  // Single-segment relative links (e.g. ethereum-localism-book-01-introduction.md) - resolve from baseSlug
  const normalized = href.replace(/\.md$/i, "").replace(/\s+/g, "-");
  if (baseSlug && !normalized.includes("/")) {
    const baseDir = baseSlug.includes("/") ? baseSlug.split("/").slice(0, -1).join("/") : "";
    const resolved = baseDir ? `${baseDir}/${normalized}` : normalized;
    return `/knowledge-garden/${resolved}`;
  }
  return href;
}

function createComponents(baseSlug?: string): Components {
  return {
    a: ({ href, children, ...props }) => (
    <a
      href={resolveHref(href, baseSlug)}
      className="text-teal-700 underline hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200"
      target={isExternalLink(href) ? "_blank" : undefined}
      rel={isExternalLink(href) ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  img: ({ src, alt, ...props }) => {
    const videoId = typeof src === "string" ? getYouTubeEmbedId(src) : null;
    if (videoId) {
      return (
        <div className="my-6 aspect-video w-full max-w-2xl overflow-hidden rounded-lg">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={alt ?? "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      );
    }
    const resolvedSrc = typeof src === "string" ? transformAssetSrc(src) : src;
    return (
      <img
        src={resolvedSrc}
        alt={alt ?? ""}
        className="max-w-full h-auto rounded-lg my-4"
        {...props}
      />
    );
  },
  h1: ({ children }) => (
    <h1 className="mb-4 mt-8 font-serif text-3xl font-light text-stone-900 dark:text-teal-50">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-8 border-b border-stone-200 pb-2 font-serif text-2xl font-light text-stone-900 dark:border-stone-700 dark:text-teal-50">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-6 font-semibold text-stone-900 dark:text-teal-50">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-2 mt-4 font-medium text-stone-800 dark:text-stone-200">
      {children}
    </h4>
  ),
  hr: () => (
    <hr className="my-8 border-0 border-t border-stone-200 dark:border-stone-700" />
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-teal-500 py-2 pl-4 italic text-stone-600 dark:text-stone-400">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="my-4 list-inside list-disc space-y-1 text-stone-600 dark:text-stone-400">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 list-inside list-decimal space-y-1 text-stone-600 dark:text-stone-400">
      {children}
    </ol>
  ),
  p: ({ children }) => (
    <p className="my-3 leading-relaxed text-stone-600 dark:text-stone-400">
      {children}
    </p>
  ),
  };
}

interface MarkdownContentProps {
  content: string;
  /** Slug of the source document (for resolving relative links) */
  baseSlug?: string;
}

export function MarkdownContent({ content, baseSlug }: MarkdownContentProps) {
  return (
    <article className="prose-kg">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkTransformLinks({ baseSlug })]}
        rehypePlugins={[rehypeRaw, rehypeTransformLinks({ baseSlug })]}
        components={createComponents(baseSlug)}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
