// lib/listing.ts
// Small helpers shared by listing cards, the detail page and the saved-homes page.

/** Parse the `images` column safely — it may be an array, a JSON string, or junk. */
export function parseImages(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
    } catch {
      return value.startsWith("http") ? [value] : [];
    }
  }
  return [];
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days since the listing was created (0 = today). */
export function daysOnSite(createdAt: string | null | undefined): number | null {
  if (!createdAt) return null;
  const t = new Date(createdAt).getTime();
  if (Number.isNaN(t)) return null;
  return Math.max(0, Math.floor((Date.now() - t) / DAY_MS));
}

/** Listings this many days old or newer get a "New" badge (Zillow-style). */
export const NEW_LISTING_DAYS = 7;

export function formatKsh(n: number): string {
  return `KSh ${Math.round(n).toLocaleString("en-KE")}`;
}

/** Compact price for cards/badges: 12.5M, 85K. */
export function formatKshShort(n: number): string {
  if (n >= 1_000_000) return `KSh ${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `KSh ${Math.round(n / 1_000)}K`;
  return `KSh ${n}`;
}

/**
 * Listings the Keja Yangu team has checked. `verification_status` is set during
 * review; "verified" and "approved" both count so either naming works.
 */
export function isVerifiedListing(status: string | null | undefined): boolean {
  return status === "verified" || status === "approved";
}

/** Coordinates if the listing has a valid map pin. */
export function getCoords(row: { latitude?: unknown; longitude?: unknown }): [number, number] | null {
  const lat = typeof row.latitude === "number" ? row.latitude : Number(row.latitude);
  const lng = typeof row.longitude === "number" ? row.longitude : Number(row.longitude);
  if (row.latitude == null || row.longitude == null || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return [lat, lng];
}

/** Everything a listing card / map pin / alert email needs. */
export type PropertyCardData = {
  id: string;
  title: string;
  price: number;
  location: string;
  property_type: string;
  listing_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  size_sqm: number | null;
  images: string[];
  created_at?: string | null;
  verified?: boolean;
  coords?: [number, number] | null;
};

/** Turn a `properties` row (select "*" or a column list) into card data. */
export function toCardData(row: Record<string, unknown>): PropertyCardData {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    price: Number(row.price ?? 0),
    location: String(row.location ?? ""),
    property_type: String(row.property_type ?? ""),
    listing_type: String(row.listing_type ?? ""),
    bedrooms: row.bedrooms == null ? null : Number(row.bedrooms),
    bathrooms: row.bathrooms == null ? null : Number(row.bathrooms),
    size_sqm: row.size_sqm == null ? null : Number(row.size_sqm),
    images: parseImages(row.images),
    created_at: (row.created_at as string | null) ?? null,
    verified: isVerifiedListing(row.verification_status as string | null),
    coords: getCoords(row),
  };
}

/** Map centre when nothing else is known: Nairobi CBD. */
export const NAIROBI: [number, number] = [-1.2864, 36.8172];

export type SortKey = "newest" | "price_asc" | "price_desc" | "beds" | "size";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest",     label: "Newest" },
  { value: "price_asc",  label: "Price (low to high)" },
  { value: "price_desc", label: "Price (high to low)" },
  { value: "beds",       label: "Bedrooms" },
  { value: "size",       label: "Size (m²)" },
];

export function isSortKey(v: string): v is SortKey {
  return SORT_OPTIONS.some((o) => o.value === v);
}
