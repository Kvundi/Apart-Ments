// scripts/leads-report.mjs
// Prints a plain-text report of leads (contact taps) and deals for the lead-tracker agent.
// Read-only. Run from the project root:
//   node --env-file=.env.local scripts/leads-report.mjs          (last 7 days)
//   node --env-file=.env.local scripts/leads-report.mjs 30       (last 30 days)
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.

import { createClient } from "@supabase/supabase-js";

const days = Math.max(1, Math.min(365, Number(process.argv[2]) || 7));
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (run with --env-file=.env.local).");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });
const since = new Date(Date.now() - days * 86_400_000).toISOString();
const ksh = (n) => (n == null ? "—" : `KSh ${Math.round(Number(n)).toLocaleString("en-KE")}`);

const [{ data: taps, error: e1 }, { data: deals, error: e2 }, { data: listings, error: e3 }] = await Promise.all([
  db.from("contact_events").select("property_id, channel, created_at").gte("created_at", since),
  db.from("deals").select("property_id, status, listing_status, deal_price, commission, reported_at, decided_at"),
  db.from("properties").select("id, title, location, price, status, verification_status, verification_level, contact_name, created_at"),
]);
if (e1 || e2 || e3) {
  console.error("Query failed:", (e1 || e2 || e3).message);
  process.exit(1);
}

const byId = new Map(listings.map((l) => [l.id, l]));
const perListing = new Map();
for (const t of taps) perListing.set(t.property_id, (perListing.get(t.property_id) || 0) + 1);

console.log(`28HOMES LEADS REPORT — last ${days} day(s), generated ${new Date().toISOString()}`);
console.log(`\nLeads (WhatsApp/Call/Copy taps): ${taps.length}`);
const channels = {};
for (const t of taps) channels[t.channel] = (channels[t.channel] || 0) + 1;
console.log(`By channel: ${Object.entries(channels).map(([c, n]) => `${c} ${n}`).join(", ") || "none"}`);

console.log("\nLeads by listing (most first):");
const ranked = [...perListing.entries()].sort((a, b) => b[1] - a[1]);
if (!ranked.length) console.log("  none");
for (const [id, n] of ranked) {
  const l = byId.get(id);
  console.log(`  ${n.toString().padStart(3)}  ${l?.title ?? id} (${l?.location ?? "?"}, ${ksh(l?.price)}, ${l?.status ?? "?"}, verified level ${l?.verification_level ?? 0})`);
}

const live = listings.filter((l) => l.verification_status === "approved" && l.status === "Available");
const silent = live.filter((l) => !perListing.has(l.id));
console.log(`\nLive listings with NO leads in this period: ${silent.length} of ${live.length}`);
for (const l of silent) console.log(`  - ${l.title} (${l.location}, ${ksh(l.price)})`);

const open = deals.filter((d) => d.status === "possible");
const confirmed = deals.filter((d) => d.status === "confirmed");
console.log(`\nDeals waiting for Ken to confirm: ${open.length}`);
for (const d of open) console.log(`  - ${byId.get(d.property_id)?.title ?? d.property_id}: marked ${d.listing_status} on ${d.reported_at.slice(0, 10)}`);
const earned = confirmed.reduce((n, d) => n + (Number(d.commission) || 0), 0);
console.log(`Confirmed deals (all time): ${confirmed.length}, commission ${ksh(earned)}`);
