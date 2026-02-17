"use client";

import dynamic from "next/dynamic";
import type { MapLocation } from "@/lib/map-locations";

const InteractiveMap = dynamic(
  () => import("./InteractiveMap").then((m) => m.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] w-full items-center justify-center rounded-lg border border-teal-950/10 bg-teal-50/30 dark:border-teal-100/10 dark:bg-stone-900/30">
        <span className="text-stone-500">Loading map…</span>
      </div>
    ),
  }
);

export function InteractiveMapClient({ locations }: { locations: MapLocation[] }) {
  return <InteractiveMap locations={locations} />;
}
