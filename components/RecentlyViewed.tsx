"use client";

import { useEffect, useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import { createClient } from "@/lib/supabase/client";
import { toCardData, type PropertyCardData } from "@/lib/listing";
import { recordView, useRecentlyViewed } from "@/lib/recentlyViewed";

/** Drop on a property page to remember the view. Renders nothing. */
export function RecordView({ id }: { id: string }) {
  useEffect(() => { recordView(id); }, [id]);
  return null;
}

/** "Recently viewed" row for the homepage; hidden until the visitor has viewed a home. */
export default function RecentlyViewed() {
  const ids = useRecentlyViewed();
  const [homes, setHomes] = useState<PropertyCardData[]>([]);
  const key = ids.slice(0, 4).join(",");

  useEffect(() => {
    const wanted = key ? key.split(",") : [];
    if (!wanted.length) return;
    let cancelled = false;
    createClient().from("properties").select("*").in("id", wanted).then(({ data }) => {
      if (cancelled) return;
      const byId = new Map((data ?? []).map((r) => [String(r.id), toCardData(r)]));
      setHomes(wanted.map((id) => byId.get(id)).filter((h): h is PropertyCardData => !!h));
    });
    return () => { cancelled = true; };
  }, [key]);

  if (!key || homes.length === 0) return null;
  return (
    <section className="max-w-7xl mx-auto px-6 pt-16">
      <p className="text-emerald-700 text-sm font-semibold uppercase tracking-wider mb-2">Pick up where you left off</p>
      <h2 className="text-2xl md:text-4xl font-bold text-[#1a2420] mb-8">Recently viewed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {homes.map((p) => <PropertyCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}
