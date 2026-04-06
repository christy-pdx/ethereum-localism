import Link from "next/link";
import {
  CONTRIBUTE_LINKS,
  POPULAR_CATEGORIES,
  QUICK_LINKS,
} from "@/lib/kg-landing";

const pillClass =
  "rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-700 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-300";

const contributePillClass =
  "rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-800 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-200";

const sectionLabelClass =
  "mb-3 text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400";

/**
 * Mobile-only browse nav (sidebar is hidden below lg).
 */
export function KgMobileBrowseNav() {
  return (
    <div className="mb-6 lg:hidden">
      <p className={sectionLabelClass}>Quick Links</p>
      <div className="mb-5 flex flex-wrap gap-2">
        {QUICK_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={pillClass}>
            {link.label}
          </Link>
        ))}
      </div>
      <p className={sectionLabelClass}>Browse the Knowledge Garden</p>
      <div className="flex flex-wrap gap-2">
        {POPULAR_CATEGORIES.slice(0, 4).map((cat) => (
          <Link key={cat.href} href={cat.href} className={pillClass}>
            {cat.label}
          </Link>
        ))}
        {CONTRIBUTE_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={contributePillClass}>
            {link.label}
          </Link>
        ))}
      </div>
      <div className="mt-6 border-t border-stone-200 pt-6 dark:border-stone-700" />
    </div>
  );
}
