import Link from "next/link";
import type { BookNav } from "@/lib/ethereum-localism-book";

interface BookNavLinksProps {
  bookNav: BookNav;
  /** "top" = border-b, "bottom" = border-t */
  position: "top" | "bottom";
}

const linkBase =
  "text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-teal-200";
const tocLink =
  "text-sm font-medium text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200";

export function BookNavLinks({ bookNav, position }: BookNavLinksProps) {
  const borderClass =
    position === "top"
      ? "border-b border-stone-200 pb-6 dark:border-stone-700"
      : "mt-10 border-t border-stone-200 pt-6 dark:border-stone-700";

  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${borderClass}`}
      aria-label="Book navigation"
    >
      <span className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
        Book
      </span>
      <Link href={bookNav.toc.url} className={tocLink} title={bookNav.toc.title}>
        ← Table of Contents
      </Link>
      {bookNav.prev && (
        <Link
          href={bookNav.prev.url}
          className={linkBase}
          title={bookNav.prev.title}
        >
          ← {bookNav.prev.title}
        </Link>
      )}
      {bookNav.next && (
        <Link
          href={bookNav.next.url}
          className={linkBase}
          title={bookNav.next.title}
        >
          {bookNav.next.title} →
        </Link>
      )}
    </div>
  );
}
