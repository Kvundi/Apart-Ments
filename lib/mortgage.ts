// lib/mortgage.ts — mortgage maths shared by the calculator page and listing estimates.

/** Rate presets, from the research notes (CBK / KMRC, late 2025). Users can type any rate. */
export const RATE_PRESETS = [
  { label: "Bank average", rate: 13.5, note: "Average Kenyan mortgage rate, Dec 2025 (CBK)" },
  { label: "KMRC-backed", rate: 9.9, note: "Affordable-housing loans refinanced by KMRC: about 9.5–9.9% fixed" },
] as const;

export const DEFAULTS = {
  rate: 13.5,
  years: 20,
  depositPct: 10,
};

/** Monthly repayment for an amortising loan. */
export function monthlyPayment(principal: number, annualRatePct: number, years: number): number {
  const n = Math.round(years * 12);
  if (principal <= 0 || n <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

/** Largest loan a given monthly repayment can service. */
export function maxLoanFor(monthly: number, annualRatePct: number, years: number): number {
  const n = Math.round(years * 12);
  if (monthly <= 0 || n <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return monthly * n;
  return (monthly * (1 - Math.pow(1 + r, -n))) / r;
}

/** Remaining balance at the end of each year (index 0 = after year 1). */
export function yearlyBalances(principal: number, annualRatePct: number, years: number): { year: number; balance: number; interestPaid: number; principalPaid: number }[] {
  const r = annualRatePct / 100 / 12;
  const pay = monthlyPayment(principal, annualRatePct, years);
  let balance = principal;
  const out = [];
  for (let y = 1; y <= years; y++) {
    let interestPaid = 0;
    let principalPaid = 0;
    for (let m = 0; m < 12 && balance > 0.005; m++) {
      const interest = balance * r;
      const princ = Math.min(pay - interest, balance);
      interestPaid += interest;
      principalPaid += princ;
      balance -= princ;
    }
    out.push({ year: y, balance: Math.max(0, balance), interestPaid, principalPaid });
  }
  return out;
}

/**
 * Typical one-off costs of buying with a mortgage in Kenya (estimates — users can edit).
 * Stamp duty: 4% of value in municipalities, 2% elsewhere (Stamp Duty Act).
 */
export const UPFRONT_DEFAULTS = {
  stampDutyUrbanPct: 4,
  stampDutyRuralPct: 2,
  legalFeesPct: 1.5,     // conveyancing + charge registration, roughly 1–2% of price
  valuationFeePct: 0.5,  // bank-instructed valuation
  arrangementFeePct: 1,  // bank arrangement / processing fee on the loan
};
