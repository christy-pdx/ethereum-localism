"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const NAVIGATION_DELAY_MS = 1100;

interface ExploratoryLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function ExploratoryLink({ href, children, className = "" }: ExploratoryLinkProps) {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) {
        return;
      }
      e.preventDefault();
      if (isAnimating) return;
      setIsAnimating(true);
      // Double RAF ensures the animation classes are applied before we navigate
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => router.push(href), NAVIGATION_DELAY_MS);
        });
      });
    },
    [href, isAnimating, router]
  );

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`exploratory-link inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium ${isAnimating ? "exploratory-link--shimmer exploratory-link--fade-out cursor-default" : ""} ${className}`}
    >
      {children}
    </Link>
  );
}
