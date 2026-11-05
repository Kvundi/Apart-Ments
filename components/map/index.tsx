"use client";

// Leaflet touches `window` on import, so every map is loaded client-side only.
// (`ssr: false` must live in a Client Component — see Next docs, lazy-loading.)
import dynamic from "next/dynamic";

const Loading = ({ className = "h-64" }: { className?: string }) => (
  <div className={`${className} rounded-2xl bg-[#e6e2d8] animate-pulse flex items-center justify-center text-sm text-[#9c948a]`}>
    Loading map…
  </div>
);

export const ListingsMap = dynamic(() => import("./ListingsMap"), {
  ssr: false,
  loading: () => <Loading className="h-[70vh]" />,
});

export const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
  loading: () => <Loading className="h-72" />,
});

export const ApproxLocationMap = dynamic(() => import("./ApproxLocationMap"), {
  ssr: false,
  loading: () => <Loading className="h-64" />,
});
