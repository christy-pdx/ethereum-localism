import Link from "next/link";
import { POPULAR_CATEGORIES } from "@/lib/kg-landing";
import { SearchTrigger } from "@/components/SearchTrigger";

interface KgSidebarProps {
  /** When true, highlights Knowledge Home as the current page */
  isKnowledgeHome?: boolean;
}

export function KgSidebar({ isKnowledgeHome = false }: KgSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-teal-950/10 px-6 py-8 dark:border-teal-100/10 lg:block">
      <div className="sticky top-24 space-y-8">
        <div className="relative">
          <SearchTrigger />
        </div>

        <nav className="space-y-1">
          <Link
            href="/knowledge-garden"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              isKnowledgeHome
                ? "bg-teal-50 text-teal-800 dark:bg-stone-800 dark:text-teal-200"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-teal-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Knowledge Home
          </Link>
          <Link
            href="/knowledge-garden#knowledge-graph"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-teal-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            Knowledge Graph
          </Link>
        </nav>

        <div>
          <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Popular Categories
          </h3>
          <ul className="mt-2 space-y-0.5">
            {POPULAR_CATEGORIES.map((cat) => (
              <li key={cat.href}>
                <Link
                  href={cat.href}
                  className="block rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-teal-100"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Contribute
          </h3>
          <ul className="mt-2 space-y-0.5">
            <Link
              href="/knowledge-garden/new-note"
              className="block rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-teal-100"
            >
              + New Note
            </Link>
            <Link
              href="/knowledge-garden/contribution-guide"
              className="block rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-teal-100"
            >
              Contribution Guide
            </Link>
          </ul>
        </div>
      </div>
    </aside>
  );
}
