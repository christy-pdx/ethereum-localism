"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useCallback } from "react";
import { fireConfetti } from "@/lib/confetti";

function fireConfettiFromClick(e: React.MouseEvent<HTMLAnchorElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;
  fireConfetti({ x, y });
}

type ConfettiLinkProps = ComponentProps<typeof Link>;

export function ConfettiLink({ children, onClick, ...props }: ConfettiLinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      fireConfettiFromClick(e);
      onClick?.(e);
    },
    [onClick]
  );
  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}
