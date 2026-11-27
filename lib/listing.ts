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
 * How much the 28Homes team has checked a listing (docs/specs/verification.md).
 * `verification_status` only says whether a listing is live; the trust level is separate.
 *   0 = not verified · 1 = phone confirmed · 2 = owner verified · 3 = property visited
 */
export type VerificationLevel = 0 | 1 | 2 | 3;

/**
 * Columns the public (anonymous) site may read. Lister contact details, admin notes and
 * reviewer ids are NOT here: the database only lets anonymous visitors read these
 * columns (migration 20261127150000_lock_contact_columns.sql). If you add a public
 * column to `properties`, add it here AND grant it to anon in a new migration.
 */
// One literal string (not concatenated) so supabase-js can type the result.
export const PUBLIC_PROPERTY_COLUMNS =
  "id, created_at, title, description, price, currency, property_type, bedrooms, bathrooms, location, address, size_sqm, images, user_id, status, latitude, longitude, amenities, listing_type, verification_status, videos, preferred_contact, contact_name, deposit_months, service_charge, water_sources, power_meter, landmark, title_type, expires_at, verification_level, verified_at";

/** The "Verified" search filter and the green badge start at this level. */
export const VERIFIED_MIN_LEVEL = 2;

export function toVerificationLevel(value: unknown): VerificationLevel {
  const n = Number(value);
  return n === 1 || n === 2 || n === 3 ? n : 0;
}

export function isVerifiedListing(level: unknown): boolean {
  return toVerificationLevel(level) >= VERIFIED_MIN_LEVEL;
}

/** Public badge text for a level, or null when there is nothing to claim. */
export function verificationBadge(level: unknown): { label: string; detail: string; strong: boolean } | null {
  switch (toVerificationLevel(level)) {
    case 3:
      return { label: "Verified · visited", detail: "28Homes checked the owner and confirmed the property exists and matches the photos.", strong: true };
    case 2:
      return { label: "Verified owner", detail: "28Homes checked the identity of the owner or agent.", strong: true };
    case 1:
      return { label: "Phone confirmed", detail: "28Homes confirmed the contact phone reaches the owner or agent.", strong: false };
    default:
      return null;
  }
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
  verificationLevel?: VerificationLevel;
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
    verified: isVerifiedListing(row.verification_level),
    verificationLevel: toVerificationLevel(row.verification_level),
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
