"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator } from "lucide-react";
import { formatKsh } from "@/lib/listing";

// Rough Kenyan defaults (late 2025): commercial mortgage rates ~13–15%, KMRC-backed
// affordable loans ~9.5–10%, typical deposit 10–20%, terms up to 20–25 years.
// The user can change every input — this is an estimate, not an offer.
const DEFAULT_RATE = 13.5;
const DEFAULT_TERM = 20;
const DEFAULT_DEPOSIT_PCT = 10;

function monthlyRepayment(principal: number, annualRatePct: number, years: number) {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (principal <= 0 || n <= 0) return 0;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

/**
 * Zillow's "Est. payment" box, adapted for Kenya:
 * - For sale: monthly mortgage repayment with editable deposit / rate / term.
 * - For rent: upfront move-in cost (first month + deposit), the number Kenyan renters actually budget for.
 */
export default function PaymentEstimate({ price, isRent }: { price: number; isRent: boolean }) {
  const [depositPct, setDepositPct] = useState(DEFAULT_DEPOSIT_PCT);
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [years, setYears] = useState(DEFAULT_TERM);
  const [depositMonths, setDepositMonths] = useState(2);

  if (!price || price <= 0) return null;

  if (isRent) {
    const deposit = price * depositMonths;
    return (
      <div className="border border-[#e6e2d8] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Calculator size={18} className="text-emerald-600" />
          <h2 className="text-lg font-bold">Estimated move-in cost</h2>
        </div>
        <p className="text-3xl font-bold text-[#1a2420] mt-2">{formatKsh(price + deposit)}</p>
        <p className="text-sm text-[#6b6358] mt-1">
          First month ({formatKsh(price)}) + deposit ({formatKsh(deposit)})
        </p>
        <div className="mt-4">
          <label className="text-xs font-semibold text-[#6b6358] uppercase tracking-wider">Deposit</label>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setDepositMonths(m)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${depositMonths === m ? "bg-emerald-600 text-white" : "bg-[#f7f5ef] hover:bg-[#eceae4]"}`}
              >
                {m} month{m > 1 ? "s" : ""}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-[#9c948a] mt-4">
          Excludes water/electricity deposits and any agent fees. Confirm the exact amounts with the owner — and never pay before viewing.
        </p>
      </div>
    );
  }

  const deposit = (price * depositPct) / 100;
  const loan = price - deposit;
  const monthly = monthlyRepayment(loan, rate, years);

  return (
    <div className="border border-[#e6e2d8] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-1">
        <Calculator size={18} className="text-emerald-600" />
        <h2 className="text-lg font-bold">Estimated monthly payment</h2>
      </div>
      <p className="text-3xl font-bold text-[#1a2420] mt-2">
        {formatKsh(monthly)}<span className="text-base font-normal text-[#6b6358]"> /month</span>
      </p>
      <p className="text-sm text-[#6b6358] mt-1">
        Loan of {formatKsh(loan)} after a {formatKsh(deposit)} deposit
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
        <label className="block">
          <span className="text-xs font-semibold text-[#6b6358] uppercase tracking-wider">Deposit: {depositPct}%</span>
          <input type="range" min={0} max={50} step={5} value={depositPct} onChange={(e) => setDepositPct(Number(e.target.value))} className="w-full mt-2 accent-emerald-600" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-[#6b6358] uppercase tracking-wider">Interest rate (%)</span>
          <input type="number" min={0} max={30} step={0.25} value={rate} onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))} className="w-full mt-1 px-3 py-2 rounded-xl border border-[#e6e2d8] text-sm outline-none focus:border-emerald-400" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-[#6b6358] uppercase tracking-wider">Term (years)</span>
          <select value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full mt-1 px-3 py-2 rounded-xl border border-[#e6e2d8] text-sm outline-none focus:border-emerald-400 bg-white">
            {[5, 10, 15, 20, 25].map((y) => <option key={y} value={y}>{y} years</option>)}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
        <p className="text-xs text-[#9c948a]">
          Estimate only. Excludes stamp duty (4% in municipalities), legal and valuation fees, and insurance.
        </p>
        <Link href="/loans" className="text-sm font-semibold text-emerald-600 hover:underline">
          Compare mortgage rates →
        </Link>
      </div>
    </div>
  );
}
