"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import { SORT_OPTIONS, type SortKey } from "@/lib/listing";

export default function SortSelect({ value }: { value: SortKey }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <label className="flex items-center gap-2 text-sm text-[#6b6358]">
      <ArrowUpDown size={15} className="text-emerald-600" />
      <span className="sr-only sm:not-sr-only">Sort:</span>
      <select
        value={value}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          if (e.target.value === "newest") params.delete("sort");
          else params.set("sort", e.target.value);
          const qs = params.toString();
          router.push(qs ? `/properties?${qs}` : "/properties");
        }}
        className="px-3 py-2 rounded-xl border border-[#e6e2d8] bg-white text-[#1a2420] font-medium outline-none focus:border-emerald-400"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
