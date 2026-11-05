"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { List, Map as MapIcon } from "lucide-react";

/** List / Map switch for the results page (stored in the URL as ?view=map). */
export default function ViewToggle({ view }: { view: "list" | "map" }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const go = (next: "list" | "map") => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "map") params.set("view", "map");
    else params.delete("view");
    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : "/properties", { scroll: false });
  };

  const btn = (active: boolean) =>
    `inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-emerald-600 text-white" : "bg-white text-[#1a2420] hover:bg-[#f7f5ef]"}`;

  return (
    <div className="inline-flex rounded-xl border border-[#e6e2d8] overflow-hidden" role="group" aria-label="Results view">
      <button type="button" onClick={() => go("list")} aria-pressed={view === "list"} className={btn(view === "list")}>
        <List size={15} /> List
      </button>
      <button type="button" onClick={() => go("map")} aria-pressed={view === "map"} className={btn(view === "map")}>
        <MapIcon size={15} /> Map
      </button>
    </div>
  );
}
