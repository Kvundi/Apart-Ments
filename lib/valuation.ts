// lib/valuation.ts — comparable-listing estimate (Kenya has no public sale-price records,
// so this estimates ASKING prices/rents from live listings and says so).

import type { PropertyCardData } from "@/lib/listing";
import { areaOf } from "@/lib/areas";

export type ValuationInput = {
  type: "sale" | "rent";
  area: string;
  propertyType: string; // "" = any
  beds: number | null;
  size: number | null; // m²
};

export type ValuationResult = {
  comps: PropertyCardData[];
  /** Which filters had to be relaxed to find enough comparables. */
  relaxed: string[];
  low: number;
  mid: number;
  high: number;
  method: "per_sqm" | "price";
  medianPerSqm: number | null;
} | null;

function quantile(sorted: number[], q: number): number {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

const MIN_COMPS = 3;

export function estimate(all: PropertyCardData[], input: ValuationInput): ValuationResult {
  const listingType = input.type === "rent" ? "Rent" : "Sale";
  const area = input.area.trim().toLowerCase();
  const pool = all.filter((p) => p.listing_type === listingType && p.price > 0);

  const sameArea = (p: PropertyCardData) =>
    !area || p.location.toLowerCase().includes(area) || (areaOf(p.location) ?? "").toLowerCase() === area;
  const sameType = (p: PropertyCardData) => !input.propertyType || p.property_type === input.propertyType;
  const bedsWithin = (n: number) => (p: PropertyCardData) =>
    input.beds === null || (p.bedrooms !== null && Math.abs(p.bedrooms - input.beds) <= n);

  // Progressively relax: exact beds -> ±1 bed -> any beds -> any type -> any area.
  const steps: { relaxed: string[]; test: (p: PropertyCardData) => boolean }[] = [
    { relaxed: [], test: (p) => sameArea(p) && sameType(p) && bedsWithin(0)(p) },
    { relaxed: ["bedrooms ±1"], test: (p) => sameArea(p) && sameType(p) && bedsWithin(1)(p) },
    { relaxed: ["any bedrooms"], test: (p) => sameArea(p) && sameType(p) },
    { relaxed: ["any bedrooms", "any property type"], test: (p) => sameArea(p) },
  ];

  for (const step of steps) {
    const comps = pool.filter(step.test);
    if (comps.length < MIN_COMPS) continue;

    const withSize = comps.filter((c) => c.size_sqm && c.size_sqm > 0);
    if (input.size && input.size > 0 && withSize.length >= MIN_COMPS) {
      const perSqm = withSize.map((c) => c.price / (c.size_sqm as number)).sort((a, b) => a - b);
      const m = quantile(perSqm, 0.5);
      return {
        comps: rankComps(comps, input), relaxed: step.relaxed, method: "per_sqm", medianPerSqm: m,
        low: quantile(perSqm, 0.25) * input.size, mid: m * input.size, high: quantile(perSqm, 0.75) * input.size,
      };
    }
    const prices = comps.map((c) => c.price).sort((a, b) => a - b);
    const perSqm = withSize.map((c) => c.price / (c.size_sqm as number)).sort((a, b) => a - b);
    return {
      comps: rankComps(comps, input), relaxed: step.relaxed, method: "price",
      medianPerSqm: perSqm.length ? quantile(perSqm, 0.5) : null,
      low: quantile(prices, 0.25), mid: quantile(prices, 0.5), high: quantile(prices, 0.75),
    };
  }
  return null;
}

function rankComps(comps: PropertyCardData[], input: ValuationInput) {
  return [...comps]
    .sort((a, b) => score(b, input) - score(a, input))
    .slice(0, 6);
}

function score(p: PropertyCardData, input: ValuationInput) {
  let s = 0;
  if (input.propertyType && p.property_type === input.propertyType) s += 2;
  if (input.beds !== null && p.bedrooms !== null) s -= Math.abs(p.bedrooms - input.beds);
  if (input.size && p.size_sqm) s -= Math.abs(p.size_sqm - input.size) / input.size;
  return s;
}
