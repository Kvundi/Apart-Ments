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
      {/* Navbar */}
      <nav className="bg-[#0a1410] border-b border-[#2a3d35] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl">🏠</div>
            <span className="text-3xl font-bold tracking-tight">Keja<span className="text-emerald-400">Yangu</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-base">
            <Link href="/properties?type=sale" className="hover:text-emerald-400">Buy</Link>
            <Link href="/properties?type=rent" className="hover:text-emerald-400">Rent</Link>
            <Link href="/add" className="hover:text-emerald-400">Sell</Link>
            <Link href="#" className="hover:text-emerald-400">Find an Agent</Link>
            <Link href="#" className="hover:text-emerald-400">Manage Rentals</Link>
            <Link href="#" className="hover:text-emerald-400">Advertise</Link>
            <Link href="#" className="hover:text-emerald-400">Get Help</Link>
          </div>

          <AuthButtons />
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[560px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#1a3a6e]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64')] bg-cover opacity-20" />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            Find your next home <em className="text-emerald-400">in Kenya</em>
          </h1>
          <p className="text-xl text-[#c8b8a8] mb-10">Over 24,000 properties across Nairobi, Mombasa, Kisumu, and beyond.</p>

          <div className="search-box mx-auto max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex p-2">
              <input className="flex-1 px-8 py-6 outline-none text-black text-lg" placeholder="Search by area, neighbourhood, or estate…" />
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 font-semibold rounded-3xl">Search</button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-[#1c2a25] py-8 border-b border-[#2a3d35]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div><div className="text-4xl font-bold text-emerald-400">24,300+</div><div className="text-sm text-[#c8b8a8]">Active listings</div></div>
          <div><div className="text-4xl font-bold text-emerald-400">1,200+</div><div className="text-sm text-[#c8b8a8]">Verified agents</div></div>
          <div><div className="text-4xl font-bold text-emerald-400">47</div><div className="text-sm text-[#c8b8a8]">Counties covered</div></div>
          <div><div className="text-4xl font-bold text-emerald-400">98%</div><div className="text-sm text-[#c8b8a8]">Satisfaction rate</div></div>
        </div>
      </div>

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between mb-10">
          <h2 className="text-4xl font-bold">Featured Properties</h2>
          <Link href="/properties" className="text-emerald-400 hover:underline">See all listings →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {properties?.map((p: any) => (
            <Link key={p.id} href={`/properties/${p.id}`} className="rounded-3xl overflow-hidden bg-[#1c2a25] hover:bg-[#22342f] transition group">
              <div className="h-56 bg-zinc-800 relative">
                {p.images?.[0] ? <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition" /> : <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">🏡</div>}
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg line-clamp-2">{p.title}</h3>
                <p className="text-emerald-400 text-2xl font-bold mt-3">KSh {p.price?.toLocaleString()}</p>
                <p className="text-[#c8b8a8] mt-1 flex items-center gap-1"><MapPin size={18} /> {p.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Explore Cities */}
      <section className="max-w-7xl mx-auto px-6 py-16 bg-[#1c2a25]">
        <h2 className="text-4xl font-bold mb-10">Explore by City</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika"].map(city => (
            <Link key={city} href={`/properties?location=${city}`} className="h-40 rounded-3xl bg-gradient-to-br from-[#1e3a6e] to-emerald-800 flex items-end p-6 text-2xl font-semibold hover:scale-105 transition">
              {city}
            </Link>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">How Keja Yangu works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-emerald-900/50 rounded-2xl flex items-center justify-center text-4xl mb-6">🔍</div>
            <h3 className="text-2xl font-semibold mb-3">Search & Filter</h3>
            <p className="text-[#c8b8a8]">Browse thousands of verified listings across Kenya.</p>
          </div>
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-emerald-900/50 rounded-2xl flex items-center justify-center text-4xl mb-6">📞</div>
            <h3 className="text-2xl font-semibold mb-3">Connect Directly</h3>
            <p className="text-[#c8b8a8]">Message or call homeowners and agents with no middlemen.</p>
          </div>
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-emerald-900/50 rounded-2xl flex items-center justify-center text-4xl mb-6">🔑</div>
            <h3 className="text-2xl font-semibold mb-3">Move with Confidence</h3>
            <p className="text-[#c8b8a8]">Verified listings and secure process from offer to keys.</p>
          </div>
        </div>
      </section>

      {/* Agent CTA */}
      <div className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-r from-emerald-900 to-[#0a1410] rounded-3xl mx-6 my-12 text-center">
        <h2 className="text-4xl font-bold mb-4">Are you a real estate agent or landlord?</h2>
        <p className="text-xl text-[#c8b8a8] mb-8">List your properties on Keja Yangu and reach thousands of verified buyers and tenants every day.</p>
        <Link href="/add" className="inline-block bg-white text-black font-semibold px-12 py-4 rounded-2xl text-lg hover:bg-gray-100">List Your Property Now</Link>
      </div>

      {/* Footer */}
      <footer className="bg-[#0a1410] py-16 border-t border-[#2a3d35]">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-[#c8b8a8]">
          © 2026 Keja Yangu Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}