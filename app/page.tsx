import Link from "next/link";
import {
  ShieldCheck, MessageCircle, Flag, Home, KeyRound, HandCoins, Calculator,
  Percent, ArrowRight, MapPin, BadgeCheck, Search,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import HomeSearch from "@/components/HomeSearch";
import PropertyCard from "@/components/PropertyCard";
import RecentlyViewed from "@/components/RecentlyViewed";
import { createClient } from "@/lib/supabase/server";
import { toCardData } from "@/lib/listing";
import { areaOf, POPULAR_AREAS } from "@/lib/areas";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: rows }, { count: agentCount }] = await Promise.all([
    supabase.from("properties").select("*").eq("status", "Available").order("created_at", { ascending: false }).limit(500),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_agent", true),
  ]);

  const all = (rows ?? []).map((r) => toCardData(r));
  const latest = all.slice(0, 8);
  const forSale = all.filter((p) => p.listing_type === "Sale").length;
  const forRent = all.filter((p) => p.listing_type === "Rent").length;

  // Real area counts from live listings, topped up with well-known areas.
  const counts = new Map<string, number>();
  for (const p of all) {
    const a = areaOf(p.location);
    if (a) counts.set(a, (counts.get(a) ?? 0) + 1);
  }
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
  const areas = [...new Set([...ranked, ...POPULAR_AREAS.map((a) => a.name)])].slice(0, 8);
  const chips = [...new Set([...ranked, ...POPULAR_AREAS.map((a) => a.name)])].slice(0, 6);

  const stats = [
    { value: all.length.toLocaleString("en-KE"), label: "Live listings" },
    { value: forSale.toLocaleString("en-KE"), label: "For sale" },
    { value: forRent.toLocaleString("en-KE"), label: "For rent" },
    (agentCount ?? 0) >= 5
      ? { value: (agentCount ?? 0).toLocaleString("en-KE"), label: "Agents" }
      : { value: counts.size.toLocaleString("en-KE"), label: counts.size === 1 ? "Area" : "Areas" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0c2a20]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c2a20]/40 via-[#0c2a20]/60 to-[#0c2a20]" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
          <p className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-sm text-white/90">
            <ShieldCheck size={16} className="text-emerald-300" />
            Every listing reviewed by our team · No viewing fees
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05] text-white">
            Find a home you&apos;ll <span className="text-emerald-300">love</span> in Kenya
          </h1>
          <p className="text-lg md:text-xl text-white/75 mb-10 max-w-2xl mx-auto">
            Homes, apartments and land for sale and rent — straight from owners and agents, on WhatsApp.
          </p>
          <HomeSearch chips={chips} />
        </div>
      </section>

      {/* Live stats */}
      <div className="border-b border-[#e6e2d8] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl md:text-3xl font-bold text-[#1a2420]">{s.value}</div>
              <div className="text-xs uppercase tracking-wider text-[#6b6358] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Buy / Rent / Sell — Zillow-style entry points */}
      <section className="max-w-7xl mx-auto px-6 pt-10 md:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[
            { icon: Home, title: "Buy a home", body: "Browse houses, apartments and land, then estimate your monthly repayment on every listing.", cta: "Browse homes", href: "/properties?type=sale" },
            { icon: KeyRound, title: "Rent a home", body: "See the full move-in cost upfront and message the owner directly — never pay to view.", cta: "Find rentals", href: "/properties?type=rent" },
            { icon: HandCoins, title: "Sell or let", body: "List for free, reach serious buyers and tenants, and get a price estimate from comparable listings.", cta: "Post a listing", href: "/add" },
          ].map((c) => (
            <Link key={c.title} href={c.href} className="group rounded-3xl border border-[#e6e2d8] p-5 md:p-7 hover:border-emerald-300 hover:shadow-lg transition-all bg-white">
              <span className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 md:mb-5"><c.icon size={22} /></span>
              <h2 className="text-xl font-bold mb-2">{c.title}</h2>
              <p className="text-[#6b6358] text-sm leading-relaxed mb-3 md:mb-5">{c.body}</p>
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-sm group-hover:gap-2.5 transition-all">
                {c.cta} <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <RecentlyViewed />

      {/* Latest listings */}
      <section className="max-w-7xl mx-auto px-6 pt-20">
        <SectionHeader eyebrow="Just listed" title="Newest homes on Apart Ments" href="/properties" />
        {latest.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latest.map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl border border-[#e6e2d8] bg-[#f7f5ef]">
            <h3 className="text-xl font-bold mb-2">Be the first to list</h3>
            <p className="text-[#6b6358] mb-6">New listings appear here as soon as our team approves them.</p>
            <Link href="/add" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-2xl">Post a listing</Link>
          </div>
        )}
      </section>

      {/* Explore by area */}
      <section className="max-w-7xl mx-auto px-6 pt-20">
        <SectionHeader eyebrow="Explore" title="Popular areas" href="/properties" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {areas.map((name, i) => {
            const n = counts.get(name) ?? 0;
            const meta = POPULAR_AREAS.find((a) => a.name === name);
            return (
              <Link
                key={name}
                href={`/properties?location=${encodeURIComponent(name)}`}
                className={`group relative h-36 rounded-2xl overflow-hidden border border-[#e6e2d8] hover:border-emerald-400 transition-all hover:-translate-y-0.5 p-5 flex flex-col justify-end ${AREA_TINTS[i % AREA_TINTS.length]}`}
              >
                <MapPin size={20} className="absolute top-4 right-4 text-emerald-700/40" />
                <p className="text-lg font-bold text-[#1a2420]">{name}</p>
                <p className="text-sm text-[#6b6358]">
                  {n > 0 ? `${n} listing${n === 1 ? "" : "s"}` : meta?.region ?? "Explore homes"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Tools */}
      <section className="max-w-7xl mx-auto px-6 pt-20">
        <SectionHeader eyebrow="Plan with confidence" title="Tools for every step" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Calculator, title: "Mortgage calculator", body: "Monthly repayment, upfront costs and how much you can borrow.", href: "/loans/calculator" },
            { icon: Search, title: "Home value estimate", body: "Price or rent range from comparable listings in your area.", href: "/valuation" },
            { icon: Percent, title: "Affordable housing", body: "Boma Yangu, the Housing Levy and KMRC-backed loans explained.", href: "/loans/government" },
            { icon: ShieldCheck, title: "Renter safety guide", body: "Spot viewing-fee scams and check a landlord before you pay.", href: "/guides/rent" },
          ].map((t) => (
            <Link key={t.title} href={t.href} className="group rounded-2xl bg-[#f7f5ef] border border-[#e6e2d8] p-6 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all">
              <t.icon size={26} className="text-emerald-700 mb-4" />
              <h3 className="font-semibold mb-1.5">{t.title}</h3>
              <p className="text-sm text-[#6b6358] leading-relaxed">{t.body}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="max-w-7xl mx-auto px-6 pt-20">
        <div className="rounded-3xl bg-[#10201a] text-white p-8 md:p-12">
          <p className="text-emerald-300 text-sm font-semibold uppercase tracking-wider mb-3">Why Apart Ments</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-10 max-w-2xl">Built so you only deal with real homes and real owners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BadgeCheck, title: "Reviewed before it goes live", body: "Our team checks every listing before it's published, and anything reported is reviewed again." },
              { icon: MessageCircle, title: "Talk to the owner directly", body: "Message or call the person who listed the home on WhatsApp — no sign-up needed to make contact." },
              { icon: Flag, title: "Report anything suspicious", body: "Asked for a viewing fee or a deposit before viewing? Report the listing in two taps." },
            ].map((c) => (
              <div key={c.title}>
                <c.icon size={28} className="text-emerald-300 mb-4" />
                <h3 className="font-semibold text-lg mb-2">{c.title}</h3>
                <p className="text-sm text-[#b8c6be] leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pt-20">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-[#f4f1e8] px-8 py-14 md:px-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Own a property in Kenya?</h2>
            <p className="text-lg text-[#5c554a] max-w-lg">List it free in a few minutes. Add photos, a map pin and your WhatsApp number — we&apos;ll review it and put it in front of serious buyers and tenants.</p>
          </div>
          <Link href="/add" className="shrink-0 inline-flex items-center gap-2 bg-[#1a2420] hover:bg-[#2a352f] text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-colors">
            List your property <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

const AREA_TINTS = [
  "bg-gradient-to-br from-emerald-100 to-white",
  "bg-gradient-to-br from-amber-100 to-white",
  "bg-gradient-to-br from-sky-100 to-white",
  "bg-gradient-to-br from-rose-100 to-white",
];

function SectionHeader({ eyebrow, title, href }: { eyebrow: string; title: string; href?: string }) {
  return (
    <div className="flex justify-between items-end mb-8 gap-4">
      <div>
        <p className="text-emerald-700 text-sm font-semibold uppercase tracking-wider mb-2">{eyebrow}</p>
        <h2 className="text-2xl md:text-4xl font-bold text-[#1a2420]">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="text-emerald-700 hover:underline font-semibold shrink-0 inline-flex items-center gap-1">
          See all <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
