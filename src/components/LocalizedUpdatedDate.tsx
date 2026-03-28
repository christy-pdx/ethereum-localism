"use client";

import { useEffect, useState } from "react";

const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

function formatEn(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", options);
}

/** Renders an absolute date in the visitor's locale after hydration; en-US on first paint to match SSR. */
export function LocalizedUpdatedDate({ iso }: { iso: string }) {
  const [label, setLabel] = useState(() => formatEn(iso));

  useEffect(() => {
    setLabel(new Date(iso).toLocaleDateString(undefined, options));
  }, [iso]);

  return (
    <time dateTime={iso} className="tabular-nums">
      {label}
    </time>
  );
}
