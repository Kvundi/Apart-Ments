"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { formatKshShort, NAIROBI, type PropertyCardData } from "@/lib/listing";

type Pinned = PropertyCardData & { coords: [number, number] };

/** Zillow-style price "pill" marker. Built from numbers only, so no HTML-injection risk. */
function priceIcon(price: number, isRent: boolean) {
  const label = formatKshShort(price).replace("KSh ", "") + (isRent ? "/mo" : "");
  return L.divIcon({
    className: "",
    html: `<div class="kv-price-pin ${isRent ? "kv-rent" : "kv-sale"}">${label}</div>`,
    iconSize: undefined,
    iconAnchor: [28, 14],
  });
}

function FitToPins({ pins }: { pins: Pinned[] }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length === 0) return;
    if (pins.length === 1) {
      map.setView(pins[0].coords, 14);
      return;
    }
    map.fitBounds(L.latLngBounds(pins.map((p) => p.coords)), { padding: [40, 40], maxZoom: 15 });
  }, [map, pins]);
  return null;
}

export default function ListingsMap({ listings, className = "" }: { listings: PropertyCardData[]; className?: string }) {
  const pins = useMemo(() => listings.filter((l): l is Pinned => !!l.coords), [listings]);

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-[#e6e2d8] ${className}`}>
      <MapContainer center={NAIROBI} zoom={11} scrollWheelZoom className="w-full h-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToPins pins={pins} />
        {pins.map((p) => (
          <Marker key={p.id} position={p.coords} icon={priceIcon(p.price, p.listing_type === "Rent")}>
            <Popup minWidth={220}>
              <Link href={`/properties/${p.id}`} className="block w-[220px] !text-[#1a2420] no-underline">
                {p.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element -- remote Supabase URLs
                  <img src={p.images[0]} alt={p.title} className="w-full h-28 object-cover rounded-lg mb-2" referrerPolicy="no-referrer" />
                )}
                <span className="block font-bold text-emerald-700 text-base">
                  KSh {p.price.toLocaleString("en-KE")}{p.listing_type === "Rent" ? " /mo" : ""}
                </span>
                <span className="block text-xs text-[#6b6358]">
                  {[p.bedrooms !== null ? (p.bedrooms === 0 ? "Studio" : `${p.bedrooms} bd`) : null, p.bathrooms !== null ? `${p.bathrooms} ba` : null, p.property_type].filter(Boolean).join(" · ")}
                </span>
                <span className="block text-sm font-medium mt-1 line-clamp-1">{p.title}</span>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {pins.length < listings.length && (
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 text-xs text-[#6b6358] px-3 py-1.5 rounded-lg shadow">
          {listings.length - pins.length} of {listings.length} listings have no map pin yet
        </div>
      )}
    </div>
  );
}
