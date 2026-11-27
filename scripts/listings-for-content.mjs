// scripts/listings-for-content.mjs
// Lists live 28Homes listings for the social-growth agent: what to feature, with ready
// tracked links. Read-only. Run from the project root:
//   node --env-file=.env.local scripts/listings-for-content.mjs
// Needs NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SITE_URL.
// Never prints lister phone numbers or emails (they are private; clients contact 28Homes).

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://28homes-ke.vercel.app").replace(/\/$/, "");
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (run with --env-file=.env.local).");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });
const since = new Date(Date.now() - 30 * 86_400_000).toISOString();

const [{ data: listings, error }, { data: taps }] = await Promise.all([
  db
    .from("properties")
    .select("id, title, listing_type, property_type, bedrooms, location, landmark, price, size_sqm, images, videos, amenities, verification_level, created_at, description")
    .eq("verification_status", "approved")
    .eq("status", "Available")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false }),
  db.from("contact_events").select("property_id").gte("created_at", since),
]);
if (error) {
  console.error("Query failed:", error.message);
  process.exit(1);
}

const leads = new Map();
for (const t of taps ?? []) leads.set(t.property_id, (leads.get(t.property_id) || 0) + 1);
const ksh = (n) => `KSh ${Math.round(Number(n)).toLocaleString("en-KE")}`;
const LEVEL = ["not verified", "phone confirmed", "owner verified", "visited by 28Homes"];

console.log(`LIVE LISTINGS FOR CONTENT — ${listings.length} total. Fewest leads first (they need promotion most).`);
console.log("Badge rule: only say 'verified' for level 2+, and 'visited' for level 3.\n");
for (const l of [...listings].sort((a, b) => (leads.get(a.id) || 0) - (leads.get(b.id) || 0))) {
  const ref = l.id.slice(0, 8).toUpperCase();
  console.log(`■ ${l.title}  [ref ${ref}]`);
  console.log(`  ${l.listing_type} · ${l.property_type} · ${l.bedrooms ?? "?"} bd · ${l.size_sqm ? `${l.size_sqm} m² · ` : ""}${l.location}${l.landmark ? ` (near ${l.landmark})` : ""}`);
  console.log(`  Price ${ksh(l.price)} · ${(l.images || []).length} photos · ${(l.videos || []).length} videos · trust: ${LEVEL[l.verification_level ?? 0]} · leads (30d): ${leads.get(l.id) || 0}`);
  console.log(`  Amenities: ${(l.amenities || []).join(", ") || "—"}`);
  console.log(`  Description: ${(l.description || "").replace(/\s+/g, " ").slice(0, 280)}`);
  console.log(`  Link template: ${site}/properties/${l.id}?src=<code>\n`);
}
