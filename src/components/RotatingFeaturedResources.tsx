"use client";

import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface FeaturedResource {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

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

interface RotatingFeaturedResourcesProps {
  resources: FeaturedResource[];
  intervalSeconds?: number;
}

export function RotatingFeaturedResources({
  resources,
  intervalSeconds = 6,
}: RotatingFeaturedResourcesProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + resources.length) % resources.length);
    },
    [resources.length]
  );

  const next = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const prev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    if (resources.length <= 1) return;
    const id = setInterval(next, intervalSeconds * 1000);
    return () => clearInterval(id);
  }, [activeIndex, resources.length, intervalSeconds, next]);

  if (resources.length === 0) return null;

  const resource = resources[activeIndex];
  const youtubeId = getYouTubeEmbedId(resource.ctaHref);

  return (
    <div className="relative">
      <div
        key={activeIndex}
        className="animate-fade-in"
        role="tabpanel"
        aria-roledescription="slide"
        aria-label={`Featured resource ${activeIndex + 1} of ${resources.length}`}
      >
        <h3 className="font-serif text-xl font-light text-stone-900 dark:text-teal-50">
          {resource.title}
        </h3>
        {youtubeId && (
          <div className="mt-4 aspect-video w-full max-w-2xl overflow-hidden rounded-lg">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={resource.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        )}
        <div className="mt-3 max-w-2xl text-stone-600 dark:text-stone-400">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children, ...props }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-700 underline hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200"
                  {...props}
                >
                  {children}
                </a>
              ),
            }}
          >
            {resource.description}
          </ReactMarkdown>
        </div>
        <a
          href={resource.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-medium text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200"
        >
          {resource.ctaLabel} →
        </a>
      </div>

      {resources.length > 1 && (
        <div className="mt-8 flex items-center gap-4">
          <div className="flex gap-2" role="tablist" aria-label="Featured resources">
            {resources.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="h-2.5 w-2.5 rounded-full transition-colors"
                style={{
                  backgroundColor:
                    i === activeIndex
                      ? "rgb(20 184 166)"
                      : "rgb(214 211 209)",
                }}
                aria-label={`Go to resource ${i + 1}`}
                aria-selected={i === activeIndex}
                role="tab"
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              aria-label="Previous resource"
              className="rounded-full p-1.5 text-stone-500 transition hover:bg-stone-200 hover:text-stone-700 dark:hover:bg-stone-700 dark:hover:text-stone-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next resource"
              className="rounded-full p-1.5 text-stone-500 transition hover:bg-stone-200 hover:text-stone-700 dark:hover:bg-stone-700 dark:hover:text-stone-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
