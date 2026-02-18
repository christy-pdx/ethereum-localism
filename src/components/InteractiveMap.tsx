"use client";

import "leaflet/dist/leaflet.css";
import "./InteractiveMap.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import type { MapLocation } from "@/lib/map-locations";

// Reset view control - must be a child of MapContainer to use useMap
function MapResetControl({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  return (
    <button
      type="button"
      onClick={() => map.flyTo(center, zoom, { duration: 0.5 })}
      className="absolute bottom-4 right-4 z-[1000] rounded-md border border-teal-700/30 bg-white/95 px-3 py-2 text-sm font-medium text-stone-800 shadow-md transition hover:bg-white hover:border-teal-700/50 dark:border-teal-400/30 dark:bg-stone-900/95 dark:text-teal-50 dark:hover:bg-stone-800 dark:hover:border-teal-400/50"
      aria-label="Reset map view"
    >
      Reset View
    </button>
  );
}

// Custom teal marker with gentle pulse behind each node
const markerIcon = L.divIcon({
  className: "custom-marker",
  html: `
    <div style="position: relative; width: 48px; height: 48px; margin-left: -24px; margin-top: -24px;">
      <div class="marker-dot" style="
        position: absolute;
        top: 50%;
        left: 50%;
        width: 24px;
        height: 24px;
        margin-left: -12px;
        margin-top: -12px;
        background: #0d9488;
        border: 2px solid #f5f5f4;
        border-radius: 50%;
      "></div>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
});

function MapContent({ locations }: { locations: MapLocation[] }) {
  const center: [number, number] =
    locations.length === 1
      ? [locations[0].lat, locations[0].lng]
      : [25, 10]; // Global view for distributed markers
  const zoom = locations.length <= 2 ? 4 : 2;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full rounded-lg z-0"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <MapResetControl center={center} zoom={zoom} />
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={markerIcon}>
          <Popup>
            <div className="min-w-[220px] max-w-[320px] p-1">
              <h3 className="font-semibold text-stone-900">{loc.name}</h3>
              <p className="text-sm text-stone-600 mt-1">
                {loc.location} — {loc.description}
              </p>
              {loc.contact && loc.contact.length > 0 && (
                <p className="text-xs text-stone-500 mt-2">
                  <span className="font-medium text-stone-700">Contact:</span>{" "}
                  {loc.contact.map((c, i) => (
                    <span key={c.href}>
                      {c.href.startsWith("http") || c.href.startsWith("mailto:") ? (
                        <a
                          href={c.href}
                          target={c.href.startsWith("http") ? "_blank" : undefined}
                          rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="text-teal-700 hover:text-teal-800 hover:underline"
                        >
                          {c.label}
                        </a>
                      ) : (
                        <Link href={c.href} className="text-teal-700 hover:text-teal-800 hover:underline">
                          {c.label}
                        </Link>
                      )}
                      {i < loc.contact!.length - 1 ? " · " : ""}
                    </span>
                  ))}
                </p>
              )}
              {loc.more && loc.more.length > 0 && (
                <p className="text-xs text-stone-500 mt-1">
                  <span className="font-medium text-stone-700">More:</span>{" "}
                  {loc.more.map((m, i) => (
                    <span key={m.href}>
                      {m.href.startsWith("http") ? (
                        <a
                          href={m.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-700 hover:text-teal-800 hover:underline"
                        >
                          {m.label}
                        </a>
                      ) : (
                        <Link href={m.href} className="text-teal-700 hover:text-teal-800 hover:underline">
                          {m.label}
                        </Link>
                      )}
                      {i < loc.more!.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              )}
              <p className="mt-3 pt-2 border-t border-stone-200">
                <Link
                  href="/knowledge-garden/resources/Ethereum-Localism-Registry"
                  className="text-sm font-medium text-teal-700 hover:text-teal-800"
                >
                  View in Registry →
                </Link>
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export function InteractiveMap({ locations }: { locations: MapLocation[] }) {
  if (locations.length === 0) return null;

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg border border-teal-950/10 dark:border-teal-100/10">
      <MapContent locations={locations} />
    </div>
  );
}
