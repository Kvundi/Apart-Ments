"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const DEFAULT_CHIPS = ["Westlands", "Kilimani", "Kileleshwa", "Ruaka", "Syokimau", "Nyali"];

const TABS = [
  { label: "Buy",  type: "sale" },
  { label: "Rent", type: "rent" },
];

export default function HomeSearch({ chips = DEFAULT_CHIPS }: { chips?: string[] }) {
  const router = useRouter();
  const [query,     setQuery]     = useState("");
  const [activeTab, setActiveTab] = useState("sale");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("type", activeTab);
    if (query.trim()) params.set("q", query.trim());
    router.push(`/properties?${params.toString()}`);
  };

  const handleChip = (place: string) => {
    const params = new URLSearchParams();
    params.set("type",     activeTab);
    params.set("location", place);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="max-w-3xl mx-auto w-full">

      {/* Tabs */}
      <div className="flex gap-2 justify-center mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.type}
            type="button"
            aria-pressed={activeTab === tab.type}
            onClick={() => setActiveTab(tab.type)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === tab.type
                ? "bg-white text-emerald-700 shadow-sm"
                : "bg-white/15 text-white/80 hover:bg-white/25"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch}>
        <div className="bg-white rounded-3xl p-2 shadow-2xl shadow-black/30">
          <div className="flex flex-col md:flex-row bg-[#f7f5ef] rounded-3xl overflow-hidden">
            <div className="flex-1 flex items-center px-6 py-5">
              <Search className="text-emerald-600 mr-4 shrink-0" size={22} />
              <input
                type="text"
                aria-label="Search location"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Estate, town or county — e.g. Kilimani"
                className="bg-transparent flex-1 outline-none text-lg text-[#1a2420] placeholder:text-[#9c948a]"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                  className="ml-2 text-[#9c948a] hover:text-[#1a2420] text-xl leading-none"
                >
                  ×
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] px-10 md:px-14 py-5 flex items-center justify-center font-semibold text-lg text-white rounded-3xl md:rounded-r-3xl md:rounded-l-none transition-all"
            >
              Search Homes
            </button>
          </div>
        </div>
      </form>

      {/* Location chips */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {chips.map((place) => (
          <button
            key={place}
            type="button"
            onClick={() => handleChip(place)}
            className="text-sm text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-4 py-1.5 transition-colors"
          >
            {place}
          </button>
        ))}
      </div>
    </div>
  );
}