import Link from "next/link";
import { PlusCircle, Search, MapPin } from "lucide-react";
import AuthButtons from "@/components/AuthButtons";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch latest active properties
  const { data: properties } = await supabase
    .from("properties")
    .select("id, title, price, location, property_type, bedrooms, images")
    .eq("status", "Available")
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <div className="min-h-screen bg-[#0f1a17] text-[#f1ede6]">
      {/* Navbar */}
      <nav className="bg-[#0a1410] border-b border-[#2a3d35] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-3xl">KY</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Keja Yangu</h1>
          </div>

          <div className="flex items-center gap-9 text-lg">
            <Link href="/" className="hover:text-emerald-400 transition">Home</Link>
            <Link href="/properties" className="hover:text-emerald-400 transition">Browse</Link>
            <Link href="/add" className="hover:text-emerald-400 transition flex items-center gap-2">
              <PlusCircle size={20} /> List Property
            </Link>
            <Link href="/my-listings" className="hover:text-emerald-400 transition">
              My Listings
            </Link>
            <AuthButtons />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <h2 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6 text-white">
          Find Your Perfect Home<br />in <span className="text-emerald-400">Kenya</span>
        </h2>
        <p className="text-xl text-[#c8b8a8] mb-10 max-w-2xl mx-auto">
          Verified properties from real homeowners across Kenya
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <Link 
            href="/properties" 
            className="flex items-center bg-[#1c2a25] border border-[#2a3d35] rounded-3xl px-6 py-4 hover:border-emerald-500 transition"
          >
            <Search className="text-[#c8b8a8] mr-4" />
            <span className="text-[#c8b8a8] flex-1 text-left">Search properties in Nairobi, Mombasa, Kisumu...</span>
            <button className="bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-2xl font-medium">
              Browse All
            </button>
          </Link>
        </div>
      </div>

      {/* Featured Listings */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-semibold">Recent Listings</h3>
          <Link href="/properties" className="text-emerald-400 hover:underline flex items-center gap-2">
            View all properties →
          </Link>
        </div>

        {properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link 
                key={property.id} 
                href={`/properties/${property.id}`}
                className="card rounded-3xl overflow-hidden group hover:shadow-xl transition"
              >
                <div className="h-56 bg-zinc-800 relative">
                  {property.images?.[0] ? (
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-7xl opacity-20">🏠</div>
                  )}
                </div>

                <div className="p-6">
                  <h4 className="font-semibold text-xl line-clamp-2 mb-2">{property.title}</h4>
                  
                  <p className="text-emerald-400 text-2xl font-bold mb-3">
                    KSh {property.price?.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-2 text-[#c8b8a8] mb-4">
                    <MapPin size={18} />
                    <span>{property.location}</span>
                  </div>

                  <div className="flex gap-4 text-sm text-gray-400">
                    {property.property_type && <span>{property.property_type}</span>}
                    {property.bedrooms && <span>• {property.bedrooms} beds</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#c8b8a8]">
            No properties available yet.
          </div>
        )}
      </div>
    </div>
  );
}