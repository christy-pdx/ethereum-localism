"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { useCallback } from "react";
import { fireConfetti } from "@/lib/confetti";

const NAVIGATION_DELAY_MS = 300;

function getOriginFromClick(e: React.MouseEvent<HTMLAnchorElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  return {
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: (rect.top + rect.height / 2) / window.innerHeight,
  };
}

type ConfettiLinkProps = ComponentProps<typeof Link>;

export function ConfettiLink({ children, href, onClick, ...props }: ConfettiLinkProps) {
  const router = useRouter();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const targetHref = typeof href === "string" ? href : href.pathname ?? "/";
      if (targetHref.startsWith("http") || targetHref.startsWith("mailto:") || targetHref.startsWith("#")) {
        return; // Allow default for external links, mailto, anchors
      }
      e.preventDefault();
      fireConfetti(getOriginFromClick(e));
      onClick?.(e);
      setTimeout(() => {
        router.push(targetHref);
      }, NAVIGATION_DELAY_MS);
    },
    [href, onClick, router]
  );

  return (
    <Link {...props} href={href} onClick={handleClick}>
      {children}
    </Link>
  );
}
