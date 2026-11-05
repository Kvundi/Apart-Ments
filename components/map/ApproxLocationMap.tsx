"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Circle } from "react-leaflet";

/**
 * Shows the general area, not the exact pin — protects owners/tenants
 * (Kenyan listings rarely want a precise public address before a viewing).
 * The circle is offset deterministically so the true point isn't simply its centre.
 */
export default function ApproxLocationMap({ coords, seed }: { coords: [number, number]; seed: string }) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const angle = ((h % 360) * Math.PI) / 180;
  const offsetDeg = 0.0012; // ~130 m
  const centre: [number, number] = [coords[0] + offsetDeg * Math.sin(angle), coords[1] + offsetDeg * Math.cos(angle)];

  return (
    <div className="h-64 rounded-2xl overflow-hidden border border-[#e6e2d8]">
      <MapContainer center={centre} zoom={15} scrollWheelZoom={false} className="w-full h-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle center={centre} radius={300} pathOptions={{ color: "#059669", fillColor: "#10b981", fillOpacity: 0.2, weight: 2 }} />
      </MapContainer>
    </div>
  );
}
