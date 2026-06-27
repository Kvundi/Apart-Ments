"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useMemo } from "react";
import { MapPin, Bed, Bath, Square, Search as SearchIcon } from "lucide-react";

type Property = {
  id: string;
  title: string;
  price: number;
  location: string;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  size_sqm?: number;
  images?: string[];
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [maxPrice, setMaxPrice] = useState(100000000);
  const [minBedrooms, setMinBedrooms] = useState(0);

  useEffect(() => {
    async function fetchProperties() {
      const supabase = createClient();
      const { data } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      setProperties(data || []);
      setLoading(false);
    }

    fetchProperties();
  }, []);

  // Filtered Properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchesSearch = 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === "All" || p.property_type === selectedType;
      const matchesPrice = p.price <= maxPrice;
      const matchesBedrooms = !minBedrooms || (p.bedrooms && p.bedrooms >= minBedrooms);

      return matchesSearch && matchesType && matchesPrice && matchesBedrooms;
    });
  }, [properties, searchTerm, selectedType, maxPrice, minBedrooms]);

  return (
    <div className="min-h-screen bg-[#0f1a17] text-[#f1ede6] pb-12">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-2">Available Properties</h1>
        <p className="text-[#c8b8a8] mb-8">Find your perfect home</p>

        {/* Filters */}
        <div className="card p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm mb-2 text-[#c8b8a8]">Search</label>
              <div className="relative">
                <SearchIcon className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Location or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input w-full pl-11 py-3 rounded-2xl"
                />
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm mb-2 text-[#c8b8a8]">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input w-full py-3 rounded-2xl"
              >
                <option value="All">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Maisonette">Maisonette</option>
                <option value="Villa">Villa</option>
                <option value="Land">Land</option>
              </select>
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm mb-2 text-[#c8b8a8]">Max Price (KSh)</label>
              <input
                type="range"
                min={1000000}
                max={200000000}
                step={1000000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <p className="text-right text-sm mt-1">KSh {maxPrice.toLocaleString()}</p>
            </div>

            {/* Min Bedrooms */}
            <div>
              <label className="block text-sm mb-2 text-[#c8b8a8]">Min Bedrooms</label>
              <select
                value={minBedrooms}
                onChange={(e) => setMinBedrooms(Number(e.target.value))}
                className="input w-full py-3 rounded-2xl"
              >
                <option value={0}>Any</option>
                <option value={1}>1+</option>
                <option value={2}>2+</option>
                <option value={3}>3+</option>
                <option value={4}>4+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <p className="mb-6 text-[#c8b8a8]">{filteredProperties.length} properties found</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((p) => (
            <a 
              key={p.id} 
              href={`/properties/${p.id}`}
              className="card group rounded-3xl overflow-hidden hover:scale-[1.03] transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-64 bg-zinc-800 overflow-hidden">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">🏡</div>
                )}
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-xl line-clamp-2">{p.title}</h3>
                <p className="text-3xl font-bold text-emerald-400 mt-3">KSh {p.price.toLocaleString()}</p>
                <p className="text-[#c8b8a8] mt-2 flex items-center gap-1.5"><MapPin size={18} /> {p.location}</p>

                <div className="flex gap-6 mt-6 text-sm border-t border-[#2a3d35] pt-5">
                  {p.bedrooms && <div className="flex items-center gap-2"><Bed size={20} className="text-emerald-400" /> {p.bedrooms}</div>}
                  {p.bathrooms && <div className="flex items-center gap-2"><Bath size={20} className="text-emerald-400" /> {p.bathrooms}</div>}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}