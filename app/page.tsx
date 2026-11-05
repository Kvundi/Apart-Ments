import Link from "next/link";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import HomeSearch from "@/components/HomeSearch";
import { createClient } from "@/lib/supabase/server";

type Property = {
  id: number | string;
  title: string;
  price: number;
  location: string;
  property_type: string;
  listing_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  size_sqm: number | null;
  images: string[] | null;
  is_new?: boolean;
};

export default async function HomePage() {
  const supabase = await createClient();

  const { data: dbProperties } = await supabase
    .from("properties")
    .select("id, title, price, location, property_type, listing_type, bedrooms, bathrooms, size_sqm, images")
    .eq("status", "Available")
    .order("created_at", { ascending: false })
    .limit(8);

  const properties: Property[] = (dbProperties as Property[]) || [];

  const featured = properties.slice(0, 4);
  const recent   = properties.slice(4, 8);

  const cities = [
    { name: "Nairobi", count: "14,820", bg: "from-emerald-100 to-white" },
    { name: "Mombasa", count: "3,410",  bg: "from-cyan-100 to-white"   },
    { name: "Kisumu",  count: "1,640",  bg: "from-amber-100 to-white"  },
    { name: "Nakuru",  count: "980",    bg: "from-violet-100 to-white" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[560px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#1a3a6e] to-[#0f2d55]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.18]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80')" }}
        />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-sm text-white/90">
            <ShieldCheck size={16} className="text-emerald-300" />
            Kenya&apos;s most trusted property marketplace
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.05] text-white">
            Find homes you&apos;ll <span className="text-emerald-300">love</span> in Kenya
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto">
            Verified properties from real homeowners and agents — across all 47 counties.
          </p>
          <HomeSearch />
        </div>
      </section>

      {/* Stats */}
      <div className="bg-[#f7f5ef] py-8 border-b border-[#e6e2d8]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["24,300+", "Active Listings"],
            ["1,200+",  "Verified Homeowners"],
            ["47",      "Counties Covered"],
            ["98%",     "Satisfaction Rate"],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="text-3xl md:text-4xl font-bold text-emerald-600">{v}</div>
              <div className="text-sm text-[#6b6358] mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Properties */}
      {properties.length > 0 ? (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <SectionHeader eyebrow="Hand-picked" title="Featured Properties" href="/properties" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} highlightBadge />
            ))}
          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#1a2420]">Be the first to list</h2>
          <p className="text-[#6b6358] mb-8 text-lg">
            No properties yet — add the first listing and it will appear here.
          </p>
          <Link
            href="/add"
            className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-10 py-4 rounded-2xl transition-colors"
          >
            Post a Listing
          </Link>
        </section>
      )}

      {/* Explore by City */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <SectionHeader eyebrow="Nationwide coverage" title="Explore by City" href="/properties" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cities.map((city) => (
            <Link
              key={city.name}
              href={`/properties?location=${encodeURIComponent(city.name)}`}
              className={`group relative h-40 rounded-2xl bg-gradient-to-br ${city.bg} border border-[#e6e2d8] hover:border-emerald-400 transition-all duration-300 hover:-translate-y-1 flex items-end p-5`}
            >
              <div>
                <p className="text-xl font-bold text-[#1a2420]">{city.name}</p>
                <p className="text-sm text-[#6b6358]">{city.count} listings</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently Added */}
      {recent.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <SectionHeader eyebrow="Just listed" title="Recently Added" href="/properties" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recent.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}

      {/* Trust cards */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <ShieldCheck className="text-emerald-600" size={26} />, title: "Verified listings",   desc: "Every property is checked before it goes live, so you only browse real, available homes." },
            { icon: <TrendingUp  className="text-emerald-600" size={26} />, title: "Fair market pricing", desc: "We surface up-to-date pricing trends so you know if a listing is a good deal." },
            { icon: <Users       className="text-emerald-600" size={26} />, title: "Direct contact",      desc: "Message homeowners and agents directly — no unnecessary middlemen or hidden fees." },
          ].map((c) => (
            <div key={c.title} className="bg-white border border-[#e6e2d8] rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">{c.icon}</div>
              <h3 className="font-semibold text-lg mb-2 text-[#1a2420]">{c.title}</h3>
              <p className="text-sm text-[#6b6358] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="relative overflow-hidden text-center bg-gradient-to-r from-emerald-50 to-[#f4f1e8] rounded-3xl px-6 py-16 border border-emerald-200">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a2420]">Own a property in Kenya?</h2>
            <p className="text-lg md:text-xl text-[#6b6358] mb-8 max-w-md mx-auto">
              List your property and reach thousands of serious buyers and tenants every day.
            </p>
            <Link
              href="/add"
              className="inline-block bg-[#1a2420] text-white font-semibold px-10 md:px-14 py-4 rounded-2xl text-lg hover:bg-[#2a352f] transition-colors"
            >
              List Your Property for Free
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#f7f5ef] py-12 border-t border-[#e6e2d8]">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-[#9c948a]">
          © 2026 Keja Yangu Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ eyebrow, title, href }: { eyebrow: string; title: string; href: string }) {
  return (
    <div className="flex justify-between items-end mb-10">
      <div>
        <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-2">{eyebrow}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a2420]">{title}</h2>
      </div>
      <Link href={href} className="text-emerald-600 hover:text-emerald-700 hover:underline text-base font-medium shrink-0">
        See all →
      </Link>
    </div>
  );
}

function PropertyCard({ property: p, highlightBadge = false }: { property: Property; highlightBadge?: boolean }) {
  const isRent = p.listing_type === "Rent";
  const formattedPrice = typeof p.price === "number" ? p.price.toLocaleString() : "Price on request";
  return (
    <Link
      href={`/properties/${p.id}`}
      className="group rounded-3xl overflow-hidden bg-white border border-[#e6e2d8] hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
    >
      <div className="h-56 bg-[#f7f5ef] relative flex items-center justify-center overflow-hidden">
        {p.images?.[0] ? (
          <img
            src={p.images[0]}
            alt={p.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="text-center">
            <div className="text-7xl opacity-20">🏠</div>
            <span className="text-sm text-[#b3aca0]">No image yet</span>
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isRent || highlightBadge ? "bg-emerald-600 text-white" : "bg-[#1a2420] text-white"}`}>
            {p.property_type}
          </span>
          {p.is_new && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white text-[#1a2420] border border-[#e6e2d8]">
              New
            </span>
          )}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2 text-[#1a2420] group-hover:text-emerald-600 transition-colors">
          {p.title}
        </h3>
        <p className="text-emerald-600 text-2xl font-bold">
          KSh {formattedPrice}
          {isRent && <span className="text-base font-normal text-[#6b6358]"> /mo</span>}
        </p>
        <p className="text-[#6b6358] mt-2 flex items-center gap-1.5 text-sm">
          <MapPin size={16} className="shrink-0" />{p.location}
        </p>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#e6e2d8] text-sm text-[#6b6358]">
          {p.bedrooms !== null && (
            <span className="flex items-center gap-1.5">
              <BedDouble size={16} className="text-emerald-600/70" />{p.bedrooms === 0 ? "Studio" : `${p.bedrooms} beds`}
            </span>
          )}
          {p.bathrooms !== null && (
            <span className="flex items-center gap-1.5">
              <Bath size={16} className="text-emerald-600/70" />{p.bathrooms} baths
            </span>
          )}
          {p.size_sqm !== null && (
            <span className="flex items-center gap-1.5">
              <Maximize size={16} className="text-emerald-600/70" />{p.size_sqm} m²
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}