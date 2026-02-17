"use client";

import { useSearch } from "@/contexts/SearchContext";

/** Button/input that opens the search modal. Used in KgSidebar. */
export function SearchTrigger() {
  const { openSearch } = useSearch();

  return (
    <button
      type="button"
      onClick={openSearch}
      className="relative flex w-full items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 py-2 pl-9 pr-3 text-left text-sm text-stone-500 transition hover:border-stone-300 hover:bg-stone-100 hover:text-stone-700 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-stone-500 dark:hover:bg-stone-800 dark:hover:text-teal-200"
      aria-label="Search knowledge"
    >
      <span className="pointer-events-none absolute left-3 flex items-center text-stone-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <span>Search knowledge…</span>
      <kbd className="ml-auto hidden rounded bg-stone-200 px-1.5 py-0.5 text-xs text-stone-600 dark:bg-stone-700 dark:text-stone-400 sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
