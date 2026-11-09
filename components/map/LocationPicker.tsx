"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { LocateFixed, X } from "lucide-react";
import { NAIROBI } from "@/lib/listing";

// Leaflet's default marker images don't resolve under bundlers; use a CSS pin instead.
const pinIcon = L.divIcon({
  className: "",
  html: '<div class="kv-drop-pin"></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

type Props = {
  value: [number, number] | null;
  onChange: (coords: [number, number] | null) => void;
};

function ClickToPlace({ onChange }: { onChange: Props["onChange"] }) {
  useMapEvents({
    click(e) {
      onChange([round(e.latlng.lat), round(e.latlng.lng)]);
    },
  });
  return null;
}

function Recenter({ to }: { to: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (to) map.setView(to, Math.max(map.getZoom(), 15));
  }, [map, to]);
  return null;
}

const round = (n: number) => Math.round(n * 1e6) / 1e6;

/** Tap the map (or use GPS) to drop the listing's pin; drag to adjust. */
export default function LocationPicker({ value, onChange }: Props) {
  const [locating, setLocating] = useState(false);
  const [recenterTo, setRecenterTo] = useState<[number, number] | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Your browser can't share location.");
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c: [number, number] = [round(pos.coords.latitude), round(pos.coords.longitude)];
        onChange(c);
        setRecenterTo(c);
        setLocating(false);
      },
      () => {
        setGeoError("Couldn't get your location. Tap the map instead.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="h-72 rounded-2xl overflow-hidden border border-[#e6e2d8]">
        <MapContainer center={value ?? NAIROBI} zoom={value ? 15 : 11} scrollWheelZoom className="w-full h-full z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickToPlace onChange={onChange} />
          <Recenter to={recenterTo} />
          {value && (
            <Marker
              position={value}
              icon={pinIcon}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const ll = (e.target as L.Marker).getLatLng();
                  onChange([round(ll.lat), round(ll.lng)]);
                },
              }}
            />
          )}
        </MapContainer>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#e6e2d8] hover:border-emerald-400 disabled:opacity-60"
        >
          <LocateFixed size={16} /> {locating ? "Locating…" : "Use my current location"}
        </button>
        {value && (
          <>
            <span className="text-[#6b6358]">Pin: {value[0].toFixed(5)}, {value[1].toFixed(5)}</span>
            <button type="button" onClick={() => onChange(null)} className="inline-flex items-center gap-1 text-[#6b6358] hover:text-[#1a2420]">
              <X size={14} /> Remove pin
            </button>
          </>
        )}
        {geoError && <span className="text-amber-700">{geoError}</span>}
      </div>
    </div>
  );
}
