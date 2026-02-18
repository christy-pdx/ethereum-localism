"use client";

import { useCallback, type ComponentProps } from "react";
import { fireConfetti } from "@/lib/confetti";

function fireConfettiFromElement(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;
  fireConfetti({ x, y });
}

type ConfettiTriggerProps = ComponentProps<"span">;

export function ConfettiTrigger({
  children,
  onClick,
  className = "",
  ...props
}: ConfettiTriggerProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      e.preventDefault();
      fireConfettiFromElement(e.currentTarget);
      onClick?.(e);
    },
    [onClick]
  );
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fireConfettiFromElement(e.currentTarget);
      }
    },
    []
  );
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`cursor-pointer hover:underline focus:outline-none focus:underline ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
