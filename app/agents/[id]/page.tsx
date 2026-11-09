import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Building2, MessageCircle, Phone, BadgeCheck, Home } from "lucide-react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import PropertyCard from "@/components/PropertyCard";
import { Breadcrumbs } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { toCardData } from "@/lib/listing";
import { toE164, formatPhone, toWhatsAppNumber } from "@/lib/phone";
import { initials, firstName } from "@/lib/people";

type Props = { params: Promise<{ id: string }> };

async function load(id: string) {
  const userId = decodeURIComponent(id);
  const supabase = await createClient();
  const [{ data: profile }, { data: rows }] = await Promise.all([
    supabase.from("profiles")
      .select("user_id, display_name, full_name, agency_name, location, bio, avatar_url, phone, is_agent, created_at")
      .eq("user_id", userId).maybeSingle(),
    supabase.from("properties").select("*").eq("user_id", userId).eq("status", "Available")
      .order("created_at", { ascending: false }).limit(60),
  ]);
  return { userId, profile, listings: (rows ?? []).map((r) => toCardData(r)) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { profile, listings } = await load(id);
  const name = profile?.display_name || profile?.full_name;
  if (!name) return { title: listings.length ? "Listings by a Apart Ments member" : "Profile not found", robots: { index: false } };
  return {
    title: `${name}${profile?.agency_name ? ` — ${profile.agency_name}` : ""}`,
    description: profile?.bio?.slice(0, 160) || `Homes listed by ${name} on Apart Ments.`,
    alternates: { canonical: `/agents/${encodeURIComponent(id)}` },
  };
}

export default async function AgentProfilePage({ params }: Props) {
  const { id } = await params;
  const { profile, listings } = await load(id);
  if (!profile && listings.length === 0) notFound();

  const name = profile?.display_name || profile?.full_name || "Apart Ments member";
  const phone = toE164(profile?.phone);
  const forSale = listings.filter((l) => l.listing_type === "Sale").length;
  const forRent = listings.filter((l) => l.listing_type === "Rent").length;
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-KE", { month: "long", year: "numeric" })
    : null;

  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      <Navbar />
      <section className="bg-gradient-to-b from-emerald-50/70 to-white border-b border-[#e6e2d8]">
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-10">
          <Breadcrumbs items={[{ label: "Agents", href: "/agents" }, { label: name }]} />
          <div className="mt-8 flex flex-col md:flex-row md:items-center gap-6">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- user avatar URL
              <img src={profile.avatar_url} alt="" className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md" />
            ) : (
              <span className="w-28 h-28 rounded-full bg-emerald-600 text-white text-3xl font-bold flex items-center justify-center border-4 border-white shadow-md">{initials(name)}</span>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
                {profile?.is_agent && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#1a2420] text-white px-2.5 py-1 rounded-full">
                    <BadgeCheck size={13} /> Agent
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-[#6b6358]">
                {profile?.agency_name && <span className="flex items-center gap-1.5"><Building2 size={16} />{profile.agency_name}</span>}
                {profile?.location && <span className="flex items-center gap-1.5"><MapPin size={16} />{profile.location}</span>}
                {memberSince && <span>On Apart Ments since {memberSince}</span>}
              </div>
            </div>
            {phone && (
              <div className="flex gap-2">
                <a href={`https://wa.me/${toWhatsAppNumber(phone)}?text=${encodeURIComponent(`Hi ${firstName(name)}, I found your profile on Apart Ments.`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5c] text-white font-semibold px-5 py-3 rounded-2xl">
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <a href={`tel:${phone}`} className="inline-flex items-center gap-2 border border-[#e6e2d8] hover:border-emerald-300 font-semibold px-5 py-3 rounded-2xl bg-white">
                  <Phone size={18} /> {formatPhone(phone)}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="space-y-6">
          <div className="rounded-2xl border border-[#e6e2d8] p-5 grid grid-cols-3 lg:grid-cols-1 gap-4 text-center lg:text-left">
            <Stat label="Active listings" value={listings.length} />
            <Stat label="For sale" value={forSale} />
            <Stat label="For rent" value={forRent} />
          </div>
          {profile?.bio && (
            <div>
              <h2 className="font-bold mb-2">About</h2>
              <p className="text-sm text-[#5c554a] leading-relaxed whitespace-pre-line">{profile.bio}</p>
            </div>
          )}
          <p className="text-xs text-[#9c948a]">Apart Ments doesn&apos;t verify agent registration yet. Ask any agent for their EARB registration before working with them.</p>
        </aside>
        <section className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-6">Listings by {firstName(name) || name}</h2>
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((p) => <PropertyCard key={p.id} p={p} />)}
            </div>
          ) : (
            <div className="text-center py-16 rounded-3xl border border-[#e6e2d8] bg-[#f7f5ef]">
              <Home size={36} className="mx-auto text-emerald-700 mb-3" />
              <p className="text-[#6b6358]">No active listings right now.</p>
              <Link href="/properties" className="inline-block mt-4 text-emerald-700 font-semibold hover:underline">Browse all properties</Link>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-[#6b6358]">{label}</p>
    </div>
  );
}
