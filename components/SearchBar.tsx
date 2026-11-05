"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl p-2 shadow-2xl shadow-black/30">
        <div className="flex flex-col md:flex-row bg-[#f7f5ef] rounded-3xl overflow-hidden">
          <div className="flex-1 flex items-center px-6 py-5">
            <Search className="text-emerald-600 mr-4 shrink-0" size={22} />
            <input
              type="text"
              placeholder="Search by county, estate or neighbourhood..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  window.location.href = `/properties?q=${encodeURIComponent(query)}`;
                }
              }}
              className="bg-transparent flex-1 outline-none text-lg text-[#1a2420] placeholder:text-[#9c948a]"
            />
          </div>
          <Link
            href={`/properties?q=${encodeURIComponent(query)}`}
            className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] px-10 md:px-14 py-5 flex items-center justify-center font-semibold text-lg text-white rounded-3xl md:rounded-r-3xl md:rounded-l-none transition-all"
          >
            Search Homes
          </Link>
        </div>
      </div>

      {/* Quick suggestion chips */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {["Westlands", "Karen", "Kilimani", "Runda", "Nyali"].map((place) => (
          <Link
            key={place}
            href={`/properties?location=${encodeURIComponent(place)}`}
            className="text-sm text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-4 py-1.5 transition-colors"
          >
            {place}
          </Link>
        ))}
      </div>
    </div>
  );
}