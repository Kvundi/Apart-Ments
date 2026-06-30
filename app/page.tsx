import Link from "next/link";
import { PlusCircle, MapPin, Search } from "lucide-react";
import AuthButtons from "@/components/AuthButtons";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: properties } = await supabase
    .from("properties")
    .select("id, title, price, location, property_type, bedrooms, images")
    .eq("status", "Available")
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <div className="min-h-screen bg-[#0f1a17] text-[#f1ede6]">
      {/* Navbar - Zillow style */}
<nav className="bg-[#0a1410] border-b border-[#2a3d35] sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    <Link href="/" className="flex items-center gap-3">
      <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl">🏠</div>
      <span className="text-3xl font-bold tracking-tight">Keja Yangu</span>
    </Link>

    <div className="hidden md:flex items-center gap-8 text-base">
      <Link href="/properties?type=sale" className="hover:text-emerald-400 transition">Buy</Link>
      <Link href="/properties?type=rent" className="hover:text-emerald-400 transition">Rent</Link>
      <Link href="/add" className="hover:text-emerald-400 transition">Sell</Link>
      <Link href="#" className="hover:text-emerald-400 transition">Find an Agent</Link>
      <Link href="#" className="hover:text-emerald-400 transition">Manage Rentals</Link>
      <Link href="#" className="hover:text-emerald-400 transition">Advertise</Link>
      <Link href="#" className="hover:text-emerald-400 transition">Get Help</Link>
    </div>

    <div className="flex items-center gap-4">
      <AuthButtons />
    </div>
  </div>
</nav>

      {/* Hero - Zillow style */}
      <section className="relative min-h-[620px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#1a3a6e]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56b08')] bg-cover bg-center opacity-25" />
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            Find homes you'll love in Kenya
          </h1>
          <p className="text-2xl text-[#c8b8a8] mb-10">Over 24,000 verified properties across Nairobi, Mombasa, Kisumu and beyond.</p>

          {/* Search Bar - Zillow style */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-2">
              <div className="flex flex-col md:flex-row bg-[#1c2a25] rounded-3xl overflow-hidden">
                <div className="flex-1 flex items-center px-6 py-5 text-lg">
                  <Search className="text-emerald-400 mr-4" />
                  <input 
                    type="text" 
                    placeholder="Search by county, estate, or neighborhood (e.g. Kilimani, Westlands)" 
                    className="bg-transparent flex-1 outline-none text-white placeholder:text-[#c8b8a8]" 
                  />
                </div>
                <Link 
                  href="/properties" 
                  className="bg-emerald-600 hover:bg-emerald-500 px-14 py-5 md:py-0 flex items-center justify-center font-semibold text-lg rounded-3xl md:rounded-r-3xl transition"
                >
                  Search Homes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-[#1c2a25] py-8 border-b border-[#2a3d35]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-y-8 text-center">
          <div><div className="text-4xl font-bold text-emerald-400">24,300+</div><div className="text-sm text-[#c8b8a8]">Active Listings</div></div>
          <div><div className="text-4xl font-bold text-emerald-400">1,200+</div><div className="text-sm text-[#c8b8a8]">Verified Homeowners</div></div>
          <div><div className="text-4xl font-bold text-emerald-400">47</div><div className="text-sm text-[#c8b8a8]">Counties Covered</div></div>
          <div><div className="text-4xl font-bold text-emerald-400">98%</div><div className="text-sm text-[#c8b8a8]">Satisfaction Rate</div></div>
        </div>
      </div>

      {/* Featured Listings - Zillow style grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold">Featured Homes</h2>
          <Link href="/properties" className="text-emerald-400 hover:underline text-lg">See all listings →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {properties?.map((p: any) => (
            <Link key={p.id} href={`/properties/${p.id}`} className="group rounded-3xl overflow-hidden bg-[#1c2a25] hover:bg-[#22342f] transition">
              <div className="h-56 bg-zinc-800 relative">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl opacity-30">🏡</div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg line-clamp-2 mb-1">{p.title}</h3>
                <p className="text-emerald-400 text-2xl font-bold">KSh {p.price?.toLocaleString()}</p>
                <p className="text-[#c8b8a8] mt-1 flex items-center gap-1"><MapPin size={18} /> {p.location}</p>
                <p className="text-sm text-gray-400 mt-3">{p.property_type} • {p.bedrooms} beds</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Explore by City - Zillow style */}
      <section className="bg-[#1c2a25] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-10">Explore by City</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika"].map((city) => (
              <Link key={city} href={`/properties?location=${city}`} 
                    className="h-40 rounded-3xl bg-gradient-to-br from-emerald-900 to-[#1a3a6e] flex items-end p-6 text-2xl font-semibold hover:scale-[1.02] transition cursor-pointer">
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Strong CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center bg-gradient-to-r from-emerald-900 to-[#0a1410] rounded-3xl mx-6 my-12">
        <h2 className="text-4xl font-bold mb-4">Own a property in Kenya?</h2>
        <p className="text-xl text-[#c8b8a8] mb-8 max-w-md mx-auto">List it on Keja Yangu and reach thousands of serious buyers and tenants every day.</p>
        <Link href="/add" className="inline-block bg-white text-black font-semibold px-14 py-4 rounded-2xl text-lg hover:bg-gray-100 transition">
          List Your Property for Free
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-[#0a1410] py-12 border-t border-[#2a3d35]">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-[#c8b8a8]">
          © 2026 Keja Yangu Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}