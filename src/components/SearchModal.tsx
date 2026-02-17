"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSearch } from "@/contexts/SearchContext";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  url: string;
  excerpt: string;
  tags: string[];
  searchText?: string;
}

function searchNotes(index: SearchResult[], query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  return index.filter((item) => item.searchText?.includes(q) ?? false);
}

export function SearchModal() {
  const { isOpen, closeSearch } = useSearch();
  const [index, setIndex] = useState<SearchResult[] | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load index on first open
  useEffect(() => {
    if (!isOpen) return;
    if (index === null) {
      fetch("/search-index.json")
        .then((res) => res.json())
        .then((data) => {
          setIndex(data);
        })
        .catch(() => setIndex([]));
    }
    /* eslint-disable react-hooks/set-state-in-effect -- reset search state when modal opens */
    setQuery("");
    setResults([]);
    setHighlightedIndex(0);
    /* eslint-enable react-hooks/set-state-in-effect */
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen, index]);

  // Search when query changes (debounced)
  useEffect(() => {
    if (!index) return;
    const trimmed = query.trim();
    if (!trimmed) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect -- clear results when query is empty */
      setResults([]);
      return;
    }
    const matches = searchNotes(index, query);
    setResults(matches.slice(0, 12));
    setHighlightedIndex(0);
  }, [query, index]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (!listRef.current || results.length === 0) return;
    const item = listRef.current.children[highlightedIndex] as HTMLElement;
    item?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [highlightedIndex, results.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSearch();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, results.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter" && results[highlightedIndex]) {
        e.preventDefault();
        window.location.href = results[highlightedIndex].url;
      }
    },
    [closeSearch, results, highlightedIndex]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 pt-[15vh] px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search Knowledge Garden"
      onClick={closeSearch}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xl dark:border-stone-700 dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-stone-200 px-4 py-3 dark:border-stone-700">
          <svg
            className="h-5 w-5 shrink-0 text-stone-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" strokeWidth={2} />
            <path d="m21 21-4.3-4.3" strokeWidth={2} />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search notes…"
            className="flex-1 bg-transparent text-stone-900 placeholder-stone-400 outline-none dark:text-teal-50 dark:placeholder-stone-500"
            autoComplete="off"
            aria-label="Search input"
          />
          <kbd className="hidden rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-500 dark:bg-stone-800 dark:text-stone-400 sm:inline">
            ESC
          </kbd>
        </div>

        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto py-2"
          role="listbox"
          aria-label="Search results"
        >
          {index === null && (
            <div className="px-4 py-8 text-center text-sm text-stone-500 dark:text-stone-400">
              Loading…
            </div>
          )}
          {index && index.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-stone-500 dark:text-stone-400">
              No search index available.
            </div>
          )}
          {index && index.length > 0 && query.trim() === "" && (
            <div className="px-4 py-8 text-center text-sm text-stone-500 dark:text-stone-400">
              Type to search {index.length} notes
            </div>
          )}
          {index && index.length > 0 && query.trim() !== "" && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-stone-500 dark:text-stone-400">
              No results for &quot;{query}&quot;
            </div>
          )}
          {results.map((item, i) => (
            <Link
              key={item.id}
              href={item.url}
              onClick={closeSearch}
              role="option"
              aria-selected={i === highlightedIndex}
              className={`block border-l-2 px-4 py-3 transition ${
                i === highlightedIndex
                  ? "border-teal-500 bg-teal-50/50 dark:border-teal-400 dark:bg-teal-950/30"
                  : "border-transparent hover:bg-stone-50 dark:hover:bg-stone-800/50"
              }`}
            >
              <div className="font-medium text-stone-900 dark:text-teal-50">
                {item.title}
              </div>
              {item.excerpt && (
                <div className="mt-0.5 line-clamp-1 text-sm text-stone-500 dark:text-stone-400">
                  {item.excerpt}
                </div>
              )}
              {item.tags.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-stone-100 px-1.5 py-0.5 text-xs text-stone-600 dark:bg-stone-700 dark:text-stone-400"
                    >
                      {tag.split("/").pop() ?? tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>

        {index && index.length > 0 && (
          <div className="border-t border-stone-200 px-4 py-2 text-xs text-stone-500 dark:border-stone-700 dark:text-stone-400">
            ↑↓ to navigate • Enter to open • <kbd className="rounded bg-stone-100 px-1 dark:bg-stone-800">⌘K</kbd> to
            toggle
          </div>
        )}
      </div>
    </div>
  );
}
