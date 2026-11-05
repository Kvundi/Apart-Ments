"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

const PROPERTY_TYPES = ["Apartment", "House", "Maisonette", "Villa", "Land", "Commercial"];
const BED_OPTIONS = [{ label: "Any", value: "any" }, { label: "1+", value: "1" }, { label: "2+", value: "2" }, { label: "3+", value: "3" }, { label: "4+", value: "4" }, { label: "5+", value: "5" }];
const PRICE_PRESETS_SALE = [
  { label: "Under 5M",   min: "",         max: "5000000"  },
  { label: "5M – 15M",  min: "5000000",  max: "15000000" },
  { label: "15M – 30M", min: "15000000", max: "30000000" },
  { label: "30M – 60M", min: "30000000", max: "60000000" },
  { label: "60M+",       min: "60000000", max: ""         },
];
const PRICE_PRESETS_RENT = [
  { label: "Under 30K",   min: "",       max: "30000"  },
  { label: "30K – 60K",  min: "30000",  max: "60000"  },
  { label: "60K – 120K", min: "60000",  max: "120000" },
  { label: "120K – 250K",min: "120000", max: "250000" },
  { label: "250K+",       min: "250000", max: ""       },
];

export default function PropertiesFilter({ currentParams }: { currentParams: Record<string, string> }) {
  const router = useRouter();
  const [listingType,   setListingType]   = useState(currentParams.type     || "");
  const [propertyType,  setPropertyType]  = useState(currentParams.property || "");
  const [minPrice,      setMinPrice]      = useState(currentParams.min      || "");
  const [maxPrice,      setMaxPrice]      = useState(currentParams.max      || "");
  const [beds,          setBeds]          = useState(currentParams.beds     || "any");
  const [location,      setLocation]      = useState(currentParams.location || "");
  const [showPresets,   setShowPresets]   = useState(false);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (listingType)            params.set("type",     listingType);
    if (propertyType)           params.set("property", propertyType);
    if (minPrice)               params.set("min",      minPrice);
    if (maxPrice)               params.set("max",      maxPrice);
    if (beds && beds !== "any") params.set("beds",     beds);
    if (location)               params.set("location", location);
    if (currentParams.q)        params.set("q",        currentParams.q);
    if (currentParams.amenity)  params.set("amenity",  currentParams.amenity);
    router.push(`/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    setListingType(""); setPropertyType(""); setMinPrice("");
    setMaxPrice(""); setBeds("any"); setLocation("");
    router.push("/properties");
  };

  const pricePresets = listingType === "rent" ? PRICE_PRESETS_RENT : PRICE_PRESETS_SALE;

  return (
    <div className="bg-white border border-[#e6e2d8] rounded-3xl p-6 space-y-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-[#1a2420]">
          <SlidersHorizontal size={18} className="text-emerald-600" />Filters
        </div>
        <button onClick={clearFilters} className="text-xs text-emerald-600 hover:underline">Clear all</button>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#6b6358] uppercase tracking-wider mb-2">Listing Type</label>
        <div className="flex gap-2">
          {[{ label: "All", value: "" }, { label: "Buy", value: "sale" }, { label: "Rent", value: "rent" }].map((opt) => (
            <button key={opt.value} onClick={() => setListingType(opt.value)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${listingType === opt.value ? "bg-emerald-600 text-white" : "bg-[#f7f5ef] text-[#1a2420] hover:bg-[#eceae4]"}`}>{opt.label}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#6b6358] uppercase tracking-wider mb-2">Location</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Westlands, Mombasa…" className="w-full px-4 py-3 rounded-xl border border-[#e6e2d8] text-sm outline-none focus:border-emerald-400 transition-colors" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#6b6358] uppercase tracking-wider mb-2">Property Type</label>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_TYPES.map((type) => (
            <button key={type} onClick={() => setPropertyType(propertyType === type ? "" : type)} className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-colors text-left ${propertyType === type ? "bg-emerald-600 text-white" : "bg-[#f7f5ef] text-[#1a2420] hover:bg-[#eceae4]"}`}>{type}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#6b6358] uppercase tracking-wider mb-2">Bedrooms</label>
        <div className="flex gap-2 flex-wrap">
          {BED_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => setBeds(opt.value)} className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${beds === opt.value ? "bg-emerald-600 text-white" : "bg-[#f7f5ef] text-[#1a2420] hover:bg-[#eceae4]"}`}>{opt.label}</button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold text-[#6b6358] uppercase tracking-wider">Price Range (KSh)</label>
          <button onClick={() => setShowPresets(!showPresets)} className="text-emerald-600">{showPresets ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
        </div>
        {showPresets && (
          <div className="grid grid-cols-1 gap-1.5 mb-3">
            {pricePresets.map((preset) => (
              <button key={preset.label} onClick={() => { setMinPrice(preset.min); setMaxPrice(preset.max); setShowPresets(false); }} className="text-left text-sm px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">{preset.label}</button>
            ))}
          </div>
        )}
        <div className="flex gap-2 items-center">
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" className="flex-1 px-3 py-2.5 rounded-xl border border-[#e6e2d8] text-sm outline-none focus:border-emerald-400" />
          <span className="text-[#9c948a] text-sm shrink-0">to</span>
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" className="flex-1 px-3 py-2.5 rounded-xl border border-[#e6e2d8] text-sm outline-none focus:border-emerald-400" />
        </div>
      </div>

      <button onClick={applyFilters} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-2xl transition-colors text-sm">Apply Filters</button>
    </div>
  );
}