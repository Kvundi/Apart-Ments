// lib/commission.ts
// 28Homes' commission rules in one place. Safe to import from client components:
// no secrets here. The calculator, the /add form, the admin and invoices all use it,
// so the number a lister sees is the number they are invoiced.
//
// Who pays: the lister (owner or agent), and only when the buyer or tenant came
// through 28Homes. Buyers and tenants never pay 28Homes anything.

export type DealType = "sale" | "rent";

export const COMMISSION = {
  /** Share of the final sale price. */
  saleRate: 0.03,
  /** Months of rent for a letting. */
  rentMonths: 1,
  /**
   * VAT on the commission. 0 until 28Homes is VAT-registered (required once turnover
   * passes KSh 5M a year); then set NEXT_PUBLIC_COMMISSION_VAT_RATE=0.16.
   */
  vatRate: Math.max(0, Math.min(0.5, Number(process.env.NEXT_PUBLIC_COMMISSION_VAT_RATE) || 0)),
} as const;

export type CommissionBreakdown = {
  dealType: DealType;
  /** Final sale price, or monthly rent. */
  price: number;
  rateLabel: string;
  subtotal: number;
  vat: number;
  total: number;
};

/** Accepts "Sale"/"Rent" (listing_type) or "sale"/"rent". */
export function toDealType(value: unknown): DealType {
  return String(value ?? "").toLowerCase() === "rent" ? "rent" : "sale";
}

export function rateLabel(dealType: DealType): string {
  return dealType === "rent"
    ? `${COMMISSION.rentMonths} month's rent`
    : `${+(COMMISSION.saleRate * 100).toFixed(2)}% of sale price`;
}

/** Whole shillings, rounded to the nearest KSh. Returns null for a missing or invalid price. */
export function calculateCommission(dealType: DealType, price: number | null | undefined): CommissionBreakdown | null {
  if (price == null || !Number.isFinite(price) || price <= 0) return null;
  const subtotal = Math.round(dealType === "rent" ? price * COMMISSION.rentMonths : price * COMMISSION.saleRate);
  const vat = Math.round(subtotal * COMMISSION.vatRate);
  return { dealType, price, rateLabel: rateLabel(dealType), subtotal, vat, total: subtotal + vat };
}
