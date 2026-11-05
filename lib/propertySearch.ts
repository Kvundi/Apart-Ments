// lib/propertySearch.ts
// One definition of "what does this search match", shared by the /properties
// page and the saved-search alerts job, so an alert never disagrees with the page.

import type { SupabaseClient } from "@supabase/supabase-js";
import { isSortKey, type SortKey } from "@/lib/listing";

export type SearchFilters = {
  type: string;      // "sale" | "rent" | ""
  property: string;  // property_type
  location: string;
  q: string;
  min: string;
  max: string;
  beds: string;
  amenity: string;
  sort: SortKey;
};

const FILTER_KEYS = ["type", "property", "location", "q", "min", "max", "beds", "amenity"] as const;

/** Read filters from URL search params (page props or a stored query string). */
export function parseFilters(
  input: Record<string, string | string[] | undefined> | URLSearchParams | string
): SearchFilters {
  const get = (k: string): string => {
    if (typeof input === "string") return new URLSearchParams(input).get(k) ?? "";
    if (input instanceof URLSearchParams) return input.get(k) ?? "";
    const v = input[k];
    return (Array.isArray(v) ? v[0] : v) ?? "";
  };
  const sort = get("sort");
  return {
    type: get("type"),
    property: get("property"),
    location: get("location"),
    q: get("q"),
    min: get("min"),
    max: get("max"),
    beds: get("beds") === "any" ? "" : get("beds"),
    amenity: get("amenity"),
    sort: isSortKey(sort) ? sort : "newest",
  };
}

/** Only the filters that are set, as a plain object (sort omitted when default). */
export function activeParams(f: SearchFilters, { includeSort = true } = {}): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of FILTER_KEYS) if (f[k]) out[k] = f[k];
  if (includeSort && f.sort !== "newest") out.sort = f.sort;
  return out;
}

/** Canonical query string for a search (stable key order, no sort) — used to dedupe saved searches. */
export function searchKey(f: SearchFilters): string {
  return new URLSearchParams(activeParams(f, { includeSort: false })).toString();
}

/** Human label, e.g. "For Rent · Apartment · Kilimani · 2+ beds · Under KSh 60,000". */
export function describeFilters(f: SearchFilters): string {
  const ksh = (v: string) => `KSh ${Number(v).toLocaleString("en-KE")}`;
  const parts = [
    f.type === "sale" ? "For Sale" : f.type === "rent" ? "For Rent" : "",
    f.property,
    f.location,
    f.q ? `"${f.q}"` : "",
    f.beds ? `${f.beds}+ beds` : "",
    f.min && f.max ? `${ksh(f.min)}–${ksh(f.max)}` : f.min ? `From ${ksh(f.min)}` : f.max ? `Under ${ksh(f.max)}` : "",
    f.amenity,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "All properties";
}

/** Strip characters that break PostgREST filter syntax. */
const safe = (s: string) => s.replace(/[,()*%]/g, " ").trim();

/**
 * Build the properties query for a search.
 * `since` limits to listings created after that time (used by alerts).
 */
export function buildPropertyQuery(
  supabase: SupabaseClient,
  f: SearchFilters,
  { since, limit = 48 }: { since?: string; limit?: number } = {}
) {
  // `*` (not a column list) so the page keeps working while new columns are being migrated.
  let query = supabase.from("properties").select("*").eq("status", "Available");

  if (f.type === "sale") query = query.eq("listing_type", "Sale");
  else if (f.type === "rent") query = query.eq("listing_type", "Rent");
  if (f.property) query = query.eq("property_type", f.property);
  if (safe(f.location)) query = query.ilike("location", `%${safe(f.location)}%`);
  if (safe(f.q)) query = query.or(`title.ilike.%${safe(f.q)}%,location.ilike.%${safe(f.q)}%`);
  if (f.min && !isNaN(Number(f.min))) query = query.gte("price", Number(f.min));
  if (f.max && !isNaN(Number(f.max))) query = query.lte("price", Number(f.max));
  if (f.beds && !isNaN(Number(f.beds))) query = query.gte("bedrooms", Number(f.beds));
  if (f.amenity) query = query.contains("amenities", [f.amenity]);
  if (since) query = query.gt("created_at", since);

  switch (f.sort) {
    case "price_asc":  query = query.order("price",    { ascending: true }); break;
    case "price_desc": query = query.order("price",    { ascending: false }); break;
    case "beds":       query = query.order("bedrooms", { ascending: false, nullsFirst: false }); break;
    case "size":       query = query.order("size_sqm", { ascending: false, nullsFirst: false }); break;
  }
  // Newest first as the default and as a tie-breaker.
  return query.order("created_at", { ascending: false }).limit(limit);
}
