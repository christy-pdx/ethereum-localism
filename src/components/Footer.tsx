import Link from "next/link";
import Image from "next/image";

const socialLinks = [
  { href: "https://t.me/+5Enk4J4d98MyMDkx", label: "Telegram" },
  { href: "https://github.com/Clinamenic/GFEL", label: "GitHub" },
];

const pageLinks = [
  { href: "/", label: "Home" },
  { href: "/introduction", label: "Introduction" },
  { href: "/knowledge-garden", label: "Knowledge Garden" },
  { href: "/action-kit", label: "Action Kit" },
];

const getInvolvedLinks = [
  { href: "/action-kit", label: "Action Kit" },
  { href: "/knowledge-garden/contribution-guide", label: "Contribute to Knowledge" },
  { href: "https://t.me/+5Enk4J4d98MyMDkx", label: "Contact", external: true },
];

export function Footer() {
  return (
    <footer className="border-t border-teal-950/10 bg-stone-100 dark:border-teal-100/10 dark:bg-stone-900/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 text-lg font-semibold text-stone-900 dark:text-teal-50"
            >
              <Image
                src="/logo-mark-bw.png"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 shrink-0 invert dark:invert-0"
                aria-hidden
              />
              Ethereum Localism
            </Link>
            <div className="mt-4 flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-teal-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Pages
            </h3>
            <ul className="mt-4 space-y-2">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-teal-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Get Involved
            </h3>
            <ul className="mt-4 space-y-2">
              {getInvolvedLinks.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-teal-100"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-teal-100"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-teal-950/10 pt-8 text-center text-sm text-stone-500 dark:border-teal-100/10 dark:text-stone-400">
          © {new Date().getFullYear()} Ethereum Localism. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
