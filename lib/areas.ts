// lib/areas.ts — Kenyan estates/towns people search by.
// Kenyans search by estate name (Kilimani, Ruaka…), not by street address,
// so these power the homepage area tiles, search chips and the valuation tool.

export const POPULAR_AREAS: { name: string; region: string }[] = [
  { name: "Westlands",  region: "Nairobi" },
  { name: "Kilimani",   region: "Nairobi" },
  { name: "Kileleshwa", region: "Nairobi" },
  { name: "Lavington",  region: "Nairobi" },
  { name: "Karen",      region: "Nairobi" },
  { name: "Ruaka",      region: "Kiambu" },
  { name: "Syokimau",   region: "Machakos" },
  { name: "Kitengela",  region: "Kajiado" },
  { name: "Nyali",      region: "Mombasa" },
  { name: "Kisumu",     region: "Kisumu County" },
  { name: "Nakuru",     region: "Nakuru County" },
  { name: "Thika",      region: "Kiambu" },
];

/** "Kilimani, Nairobi" -> "Kilimani". Normalises case so counts group correctly. */
export function areaOf(location: string | null | undefined): string | null {
  const first = (location ?? "").split(",")[0].trim();
  if (!first) return null;
  return first
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
