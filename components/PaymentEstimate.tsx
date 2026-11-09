"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator } from "lucide-react";
import { formatKsh } from "@/lib/listing";
import { DEFAULTS, monthlyPayment } from "@/lib/mortgage";

// Defaults and maths shared with the full calculator (lib/mortgage.ts).
const DEFAULT_RATE = DEFAULTS.rate;
const DEFAULT_TERM = DEFAULTS.years;
const DEFAULT_DEPOSIT_PCT = DEFAULTS.depositPct;
const monthlyRepayment = monthlyPayment;

/**
 * Zillow's "Est. payment" box, adapted for Kenya:
 * - For sale: monthly mortgage repayment with editable deposit / rate / term.
 * - For rent: upfront move-in cost (first month + deposit), the number Kenyan renters actually budget for.
 */
export default function PaymentEstimate({
  price, isRent, depositMonths = null, serviceCharge = null,
}: {
  price: number; isRent: boolean; depositMonths?: number | null; serviceCharge?: number | null;
}) {
  const [depositPct, setDepositPct] = useState(DEFAULT_DEPOSIT_PCT);
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [years, setYears] = useState(DEFAULT_TERM);
  const [depMonths, setDepMonths] = useState(depositMonths ?? 2);

  if (!price || price <= 0) return null;

  if (isRent) {
    const deposit = price * depMonths;
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
        {serviceCharge ? (
          <p className="text-sm text-[#6b6358] mt-1">Plus a service charge of {formatKsh(serviceCharge)} a month.</p>
        ) : null}
        <div className="mt-4">
          <label className="text-xs font-semibold text-[#6b6358] uppercase tracking-wider">
            Deposit{depositMonths !== null ? ` · owner asks for ${depositMonths} month${depositMonths === 1 ? "" : "s"}` : ""}
          </label>
          <div className="flex gap-2 mt-2">
            {[...new Set([1, 2, 3, ...(depositMonths && depositMonths > 0 ? [depositMonths] : [])])].sort((a, b) => a - b).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setDepMonths(m)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${depMonths === m ? "bg-emerald-600 text-white" : "bg-[#f7f5ef] hover:bg-[#eceae4]"}`}
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
      {serviceCharge ? (
        <p className="text-sm text-[#6b6358] mt-1">
          {formatKsh(monthly + serviceCharge)} a month including the {formatKsh(serviceCharge)} service charge.
        </p>
      ) : null}
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
        <Link href={`/loans/calculator?price=${Math.round(price)}`} className="text-sm font-semibold text-emerald-700 hover:underline">
          Full breakdown and upfront costs →
        </Link>
      </div>
    </div>
  );
}
