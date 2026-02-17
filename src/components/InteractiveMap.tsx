"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import type { MapLocation } from "@/lib/map-locations";

// Custom teal marker matching site aesthetic (avoids default icon 404 in Next.js)
const markerIcon = L.divIcon({
  className: "custom-marker",
  html: `
    <div style="
      width: 24px;
      height: 24px;
      background: #0d9488;
      border: 2px solid #f5f5f4;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      transform: translate(-50%, -50%);
    "></div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
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
