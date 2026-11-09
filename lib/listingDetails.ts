// lib/listingDetails.ts — Kenyan listing details (deposit, service charge, water, power, landmark, title).
// Columns come from supabase/migrations/20261106090000_kenyan_listing_details.sql.
// Everything here is optional and degrades gracefully if the migration hasn't been applied.

export const WATER_SOURCES = ["County supply", "Borehole", "Storage tank", "Rainwater harvesting"] as const;

export const POWER_METER_LABELS: Record<string, string> = {
  prepaid_own: "Own prepaid KPLC meter",
  shared: "Shared meter",
  included: "Electricity included in rent",
};

export const TITLE_TYPE_LABELS: Record<string, string> = {
  freehold: "Freehold title",
  leasehold: "Leasehold title",
  sectional: "Sectional title",
  share_certificate: "Share certificate",
  other: "Other",
};

export type ListingDetails = {
  deposit_months: number | null;
  service_charge: number | null;
  water_sources: string[];
  power_meter: string | null;
  landmark: string | null;
  title_type: string | null;
};

export function readDetails(row: Record<string, unknown>): ListingDetails {
  const num = (v: unknown) => (v === null || v === undefined || v === "" || !Number.isFinite(Number(v)) ? null : Number(v));
  return {
    deposit_months: num(row.deposit_months),
    service_charge: num(row.service_charge),
    water_sources: Array.isArray(row.water_sources) ? (row.water_sources as unknown[]).filter((x): x is string => typeof x === "string") : [],
    power_meter: typeof row.power_meter === "string" ? row.power_meter : null,
    landmark: typeof row.landmark === "string" && row.landmark.trim() ? row.landmark.trim() : null,
    title_type: typeof row.title_type === "string" ? row.title_type : null,
  };
}

export function hasAnyDetails(d: ListingDetails): boolean {
  return d.deposit_months !== null || d.service_charge !== null || d.water_sources.length > 0 || !!d.power_meter || !!d.landmark || !!d.title_type;
}
