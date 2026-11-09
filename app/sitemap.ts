import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { SITE } from "@/lib/site";

// Regenerate at most once an hour.
export const revalidate = 3600;

const STATIC_PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/properties", priority: 0.9, changeFrequency: "hourly" },
  { path: "/properties?type=sale", priority: 0.8, changeFrequency: "daily" },
  { path: "/properties?type=rent", priority: 0.8, changeFrequency: "daily" },
  { path: "/agents", priority: 0.6, changeFrequency: "weekly" },
  { path: "/valuation", priority: 0.6, changeFrequency: "weekly" },
  { path: "/loans", priority: 0.6, changeFrequency: "monthly" },
  { path: "/loans/calculator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/loans/government", priority: 0.6, changeFrequency: "monthly" },
  { path: "/guides/buy", priority: 0.6, changeFrequency: "monthly" },
  { path: "/guides/sell", priority: 0.6, changeFrequency: "monthly" },
  { path: "/guides/rent", priority: 0.6, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${SITE.url}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  // Public (anon) client: RLS only returns approved, available listings.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return entries;
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const [{ data: listings }, { data: agents }] = await Promise.all([
    supabase.from("properties").select("id, created_at").eq("status", "Available").order("created_at", { ascending: false }).limit(5000),
    supabase.from("profiles").select("user_id, updated_at").eq("is_agent", true).not("user_id", "is", null).limit(1000),
  ]);

  for (const l of listings ?? []) {
    entries.push({ url: `${SITE.url}/properties/${l.id}`, lastModified: l.created_at ? new Date(l.created_at) : now, changeFrequency: "weekly", priority: 0.8 });
  }
  for (const a of agents ?? []) {
    entries.push({ url: `${SITE.url}/agents/${encodeURIComponent(a.user_id)}`, lastModified: a.updated_at ? new Date(a.updated_at) : now, changeFrequency: "weekly", priority: 0.5 });
  }
  return entries;
}
