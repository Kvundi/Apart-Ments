import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Building2, Search, UserPlus } from "lucide-react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { PageHero, Callout } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { initials } from "@/lib/people";

export const metadata: Metadata = {
  title: "Find a real estate agent in Kenya",
  description: "Browse property agents on Apart Ments, see their current listings and contact them directly.",
  alternates: { canonical: "/agents" },
};

type AgentRow = {
  user_id: string;
  display_name: string | null;
  full_name: string | null;
  agency_name: string | null;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
};

export default async function AgentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = ((Array.isArray(sp.q) ? sp.q[0] : sp.q) ?? "").trim();
  const safe = q.replace(/[,()*%]/g, " ").trim();

  const supabase = await createClient();
  let query = supabase
    .from("profiles")
    .select("user_id, display_name, full_name, agency_name, location, bio, avatar_url")
    .eq("is_agent", true)
    .not("user_id", "is", null)
    .order("display_name", { ascending: true })
    .limit(200);
  if (safe) query = query.or(`display_name.ilike.%${safe}%,agency_name.ilike.%${safe}%,location.ilike.%${safe}%`);

  const [{ data: agents }, { data: listings }] = await Promise.all([
    query,
    supabase.from("properties").select("user_id").eq("status", "Available").limit(2000),
  ]);

  const counts = new Map<string, number>();
  for (const l of listings ?? []) if (l.user_id) counts.set(l.user_id, (counts.get(l.user_id) ?? 0) + 1);
  const rows = ((agents ?? []) as AgentRow[]).sort((a, b) => (counts.get(b.user_id) ?? 0) - (counts.get(a.user_id) ?? 0));

  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      <Navbar />
      <PageHero
        crumbs={[{ label: "Find an agent" }]}
        eyebrow="Agents"
        title="Find a property agent"
        description="Browse agents listing on Apart Ments, see what they're selling and letting, and contact them directly."
      >
        <form method="GET" action="/agents" className="flex max-w-xl bg-white border border-[#e6e2d8] rounded-2xl p-1.5 shadow-sm">
          <div className="flex items-center gap-2 flex-1 px-3">
            <Search size={18} className="text-emerald-600 shrink-0" />
            <input name="q" defaultValue={q} placeholder="Name, agency or area" aria-label="Search agents" className="flex-1 min-w-0 outline-none bg-transparent py-2" />
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl">Search</button>
        </form>
      </PageHero>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          {rows.length > 0 && <h2 className="text-xl font-bold">{rows.length} agent{rows.length === 1 ? "" : "s"}{q ? ` matching “${q}”` : ""}</h2>}
          {q && <Link href="/agents" className="text-sm text-emerald-700 hover:underline">Clear search</Link>}
        </div>

        {rows.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-[#e6e2d8] bg-[#f7f5ef]">
            <UserPlus size={40} className="mx-auto text-emerald-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">{q ? "No agents match that search" : "Agents are joining soon"}</h3>
            <p className="text-[#6b6358] mb-6 max-w-md mx-auto">Are you an agent? Turn on &ldquo;I am a real estate agent&rdquo; in your profile to appear here with your listings.</p>
            <Link href="/profile" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-2xl">Set up your agent profile</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rows.map((a) => {
              const name = a.display_name || a.full_name || "Agent";
              const n = counts.get(a.user_id) ?? 0;
              return (
                <Link key={a.user_id} href={`/agents/${encodeURIComponent(a.user_id)}`} className="group rounded-3xl border border-[#e6e2d8] p-6 hover:border-emerald-300 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    {a.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element -- user avatar URL
                      <img src={a.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover border border-[#e6e2d8]" />
                    ) : (
                      <span className="w-16 h-16 rounded-full bg-emerald-600 text-white text-xl font-bold flex items-center justify-center">{initials(name)}</span>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-lg truncate group-hover:text-emerald-700">{name}</p>
                      {a.agency_name && <p className="text-sm text-[#6b6358] flex items-center gap-1 truncate"><Building2 size={14} />{a.agency_name}</p>}
                      {a.location && <p className="text-sm text-[#6b6358] flex items-center gap-1 truncate"><MapPin size={14} />{a.location}</p>}
                    </div>
                  </div>
                  {a.bio && <p className="text-sm text-[#5c554a] mt-4 line-clamp-3">{a.bio}</p>}
                  <p className="mt-4 pt-4 border-t border-[#e6e2d8] text-sm font-semibold text-emerald-700">
                    {n > 0 ? `${n} active listing${n === 1 ? "" : "s"}` : "No active listings"} →
                  </p>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-12 max-w-3xl">
          <Callout tone="info" title="Working with an agent">
            Estate agents in Kenya must be registered with the Estate Agents Registration Board (EARB). Ask to see their registration,
            agree fees in writing before any viewing, and never pay a viewing fee.
          </Callout>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
