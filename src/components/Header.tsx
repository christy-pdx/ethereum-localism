"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearch } from "@/contexts/SearchContext";

const navLinks = [
  { href: "/introduction", label: "Introduction" },
  { href: "/knowledge-garden", label: "Knowledge" },
  { href: "/action-kit", label: "Action Kit" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openSearch } = useSearch();

  return (
    <header className="sticky top-0 z-50 border-b border-teal-950/10 bg-teal-50/95 backdrop-blur supports-[backdrop-filter]:bg-teal-50/80 dark:border-teal-100/10 dark:bg-stone-950/95 dark:supports-[backdrop-filter]:dark:bg-stone-950/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-stone-900 dark:text-teal-50 hover:text-teal-800 dark:hover:text-teal-200"
        >
          Ethereum Localism
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-teal-100"
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={openSearch}
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-teal-200"
            aria-label="Search"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth={2} />
              <path d="m21 21-4.3-4.3" strokeWidth={2} />
            </svg>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="flex flex-col gap-1.5 p-2 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-stone-700 transition dark:bg-stone-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-stone-700 transition dark:bg-stone-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-stone-700 transition dark:bg-stone-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-teal-950/10 px-4 py-4 md:hidden dark:border-teal-100/10">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-teal-100"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openSearch();
              }}
              className="flex items-center gap-2 py-2 text-left text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-teal-100"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" strokeWidth={2} />
                <path d="m21 21-4.3-4.3" strokeWidth={2} />
              </svg>
              Search
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
