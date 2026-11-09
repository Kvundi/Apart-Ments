"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, Wallet, Info } from "lucide-react";
import { formatKsh } from "@/lib/listing";
import {
  RATE_PRESETS, DEFAULTS, UPFRONT_DEFAULTS,
  monthlyPayment, maxLoanFor, yearlyBalances,
} from "@/lib/mortgage";

const num = (v: string) => {
  const n = Number(v.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const fmtInput = (n: number) => (n ? Math.round(n).toLocaleString("en-KE") : "");

export default function MortgageCalculator({ initialPrice }: { initialPrice?: number }) {
  const [mode, setMode] = useState<"repayment" | "afford">("repayment");

  // Shared loan terms
  const [rate, setRate] = useState(DEFAULTS.rate);
  const [years, setYears] = useState(DEFAULTS.years);

  // Repayment mode
  const [price, setPrice] = useState(initialPrice && initialPrice > 0 ? initialPrice : 8_500_000);
  const [depositPct, setDepositPct] = useState(DEFAULTS.depositPct);
  const [urban, setUrban] = useState(true);

  // Affordability mode
  const [income, setIncome] = useState(250_000);
  const [debts, setDebts] = useState(0);
  const [sharePct, setSharePct] = useState(35);
  const [savings, setSavings] = useState(1_500_000);

  const r = useMemo(() => {
    const deposit = (price * depositPct) / 100;
    const loan = Math.max(0, price - deposit);
    const monthly = monthlyPayment(loan, rate, years);
    const totalPaid = monthly * years * 12;
    const stampDuty = (price * (urban ? UPFRONT_DEFAULTS.stampDutyUrbanPct : UPFRONT_DEFAULTS.stampDutyRuralPct)) / 100;
    const legal = (price * UPFRONT_DEFAULTS.legalFeesPct) / 100;
    const valuation = (price * UPFRONT_DEFAULTS.valuationFeePct) / 100;
    const arrangement = (loan * UPFRONT_DEFAULTS.arrangementFeePct) / 100;
    return {
      deposit, loan, monthly, totalPaid, totalInterest: totalPaid - loan,
      stampDuty, legal, valuation, arrangement,
      cashNeeded: deposit + stampDuty + legal + valuation + arrangement,
      schedule: yearlyBalances(loan, rate, years),
    };
  }, [price, depositPct, rate, years, urban]);

  const a = useMemo(() => {
    const budget = Math.max(0, (income * sharePct) / 100 - debts);
    const maxLoan = maxLoanFor(budget, rate, years);
    // Price P needs: savings ≥ deposit + costs, deposit ≥ minimum %, and loan = P − deposit ≤ maxLoan.
    // Putting all spare savings into the deposit gives P ≤ (maxLoan + savings) / (1 + c);
    // the minimum-deposit rule gives P ≤ savings / (d + c).
    const c = (UPFRONT_DEFAULTS.stampDutyUrbanPct + UPFRONT_DEFAULTS.legalFeesPct + UPFRONT_DEFAULTS.valuationFeePct) / 100;
    const d = DEFAULTS.depositPct / 100;
    const byIncome = (maxLoan + savings) / (1 + c);
    const bySavings = savings / (d + c);
    const maxPrice = Math.max(0, Math.min(byIncome, bySavings));
    return { budget, maxLoan, maxPrice, limitedBy: bySavings < byIncome ? "savings" : "income" };
  }, [income, debts, sharePct, savings, rate, years]);

  const maxBalance = r.schedule[0] ? r.loan : 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Inputs */}
      <div className="lg:col-span-2 space-y-6">
        <div className="inline-flex rounded-2xl border border-[#e6e2d8] p-1 bg-[#f7f5ef] w-full" role="tablist">
          {([["repayment", "Monthly repayment", Calculator], ["afford", "What can I afford?", Wallet]] as const).map(([m, label, Icon]) => (
            <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${mode === m ? "bg-white shadow-sm text-emerald-700" : "text-[#6b6358] hover:text-[#1a2420]"}`}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-[#e6e2d8] p-6 space-y-5 bg-white">
          {mode === "repayment" ? (
            <>
              <MoneyField label="Property price" value={price} onChange={setPrice} />
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span>Deposit</span>
                  <span className="text-[#6b6358]">{depositPct}% · {formatKsh(r.deposit)}</span>
                </div>
                <input type="range" min={0} max={60} step={5} value={depositPct} onChange={(e) => setDepositPct(Number(e.target.value))} className="w-full accent-emerald-600" aria-label="Deposit percentage" />
                <p className="text-xs text-[#9c948a] mt-1">Most Kenyan lenders ask for 10–20%. Some affordable-housing loans accept less.</p>
              </div>
              <label className="flex items-center justify-between gap-3 text-sm">
                <span>
                  <span className="font-medium">Within a municipality</span>
                  <span className="block text-xs text-[#9c948a]">Stamp duty is 4% in towns and cities, 2% elsewhere</span>
                </span>
                <input type="checkbox" checked={urban} onChange={(e) => setUrban(e.target.checked)} className="w-5 h-5 accent-emerald-600" />
              </label>
            </>
          ) : (
            <>
              <MoneyField label="Your net monthly income (household)" value={income} onChange={setIncome} />
              <MoneyField label="Existing monthly loan repayments" value={debts} onChange={setDebts} />
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span>Share of income for the mortgage</span>
                  <span className="text-[#6b6358]">{sharePct}%</span>
                </div>
                <input type="range" min={20} max={50} step={5} value={sharePct} onChange={(e) => setSharePct(Number(e.target.value))} className="w-full accent-emerald-600" aria-label="Share of income" />
                <p className="text-xs text-[#9c948a] mt-1">Lenders cap total loan repayments at a share of your income — a third is a common, comfortable target.</p>
              </div>
              <MoneyField label="Savings for deposit and costs" value={savings} onChange={setSavings} />
            </>
          )}

          <div className="pt-5 border-t border-[#e6e2d8] space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="rate">Interest rate (% a year)</label>
              <input id="rate" type="number" min={0} max={30} step={0.1} value={rate} onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-[#e6e2d8] outline-none focus:border-emerald-500" />
              <div className="flex flex-wrap gap-2 mt-2">
                {RATE_PRESETS.map((p) => (
                  <button key={p.label} type="button" onClick={() => setRate(p.rate)} title={p.note}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${rate === p.rate ? "bg-emerald-600 border-emerald-600 text-white" : "border-[#e6e2d8] hover:border-emerald-400"}`}>
                    {p.label} · {p.rate}%
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="years">Loan term</label>
              <select id="years" value={years} onChange={(e) => setYears(Number(e.target.value))}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-[#e6e2d8] outline-none focus:border-emerald-500 bg-white">
                {[5, 10, 15, 20, 25].map((y) => <option key={y} value={y}>{y} years</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-3 space-y-6">
        {mode === "repayment" ? (
          <>
            <div className="rounded-3xl bg-[#10201a] text-white p-7">
              <p className="text-sm text-emerald-200">Estimated monthly repayment</p>
              <p className="text-4xl md:text-5xl font-bold mt-1">{formatKsh(r.monthly)}</p>
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10 text-sm">
                <Stat label="Loan amount" value={formatKsh(r.loan)} />
                <Stat label="Total interest" value={formatKsh(r.totalInterest)} />
                <Stat label="Total repaid" value={formatKsh(r.totalPaid)} />
              </div>
            </div>

            <div className="rounded-3xl border border-[#e6e2d8] p-6">
              <h3 className="font-bold text-lg mb-1">Cash you&apos;ll need upfront</h3>
              <p className="text-sm text-[#6b6358] mb-4">Typical one-off costs — confirm exact figures with your lender and advocate.</p>
              <dl className="divide-y divide-[#e6e2d8] text-sm">
                <Row label={`Deposit (${depositPct}%)`} value={r.deposit} />
                <Row label={`Stamp duty (${urban ? UPFRONT_DEFAULTS.stampDutyUrbanPct : UPFRONT_DEFAULTS.stampDutyRuralPct}%)`} value={r.stampDuty} />
                <Row label={`Legal fees (~${UPFRONT_DEFAULTS.legalFeesPct}%)`} value={r.legal} />
                <Row label={`Valuation (~${UPFRONT_DEFAULTS.valuationFeePct}%)`} value={r.valuation} />
                <Row label={`Bank arrangement fee (~${UPFRONT_DEFAULTS.arrangementFeePct}% of loan)`} value={r.arrangement} />
                <div className="flex justify-between py-3 font-bold text-base">
                  <dt>Total cash needed</dt><dd>{formatKsh(r.cashNeeded)}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl border border-[#e6e2d8] p-6">
              <h3 className="font-bold text-lg mb-4">How your balance falls</h3>
              <div className="flex items-end gap-[3px] h-40" role="img" aria-label="Loan balance at the end of each year">
                {r.schedule.map((s) => (
                  <div key={s.year} className="flex-1 group relative">
                    <div className="w-full rounded-t bg-emerald-500/80 group-hover:bg-emerald-600 transition-colors" style={{ height: `${Math.max(2, (s.balance / maxBalance) * 160)}px` }} />
                    <div className="pointer-events-none absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1a2420] text-white text-[11px] px-2 py-1 opacity-0 group-hover:opacity-100">
                      Year {s.year}: {formatKsh(s.balance)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-[#9c948a] mt-2"><span>Year 1</span><span>Year {years}</span></div>
              <p className="text-sm text-[#6b6358] mt-4">
                In year 1, {formatKsh(r.schedule[0]?.interestPaid ?? 0)} of your repayments goes to interest and {formatKsh(r.schedule[0]?.principalPaid ?? 0)} reduces the loan.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-3xl bg-[#10201a] text-white p-7">
              <p className="text-sm text-emerald-200">You could afford a home up to about</p>
              <p className="text-4xl md:text-5xl font-bold mt-1">{formatKsh(a.maxPrice)}</p>
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10 text-sm">
                <Stat label="Monthly budget" value={formatKsh(a.budget)} />
                <Stat label="Maximum loan" value={formatKsh(a.maxLoan)} />
              </div>
            </div>
            <div className="rounded-3xl border border-[#e6e2d8] p-6 text-sm text-[#3d3830] space-y-3">
              <p className="flex gap-2"><Info size={18} className="text-emerald-600 shrink-0" />
                {a.limitedBy === "savings"
                  ? "Your savings are the limit: they need to cover the deposit plus stamp duty, legal and valuation fees. Saving more, or an affordable-housing loan with a lower deposit, would raise this."
                  : "Your income is the limit: it caps the monthly repayment a lender will accept. A longer term or a lower rate (e.g. a KMRC-backed loan) would raise this."}
              </p>
              <p>Assumes a {DEFAULTS.depositPct}% deposit and about 6% in buying costs.</p>
            </div>
            <Link href={`/properties?type=sale&max=${Math.round(a.maxPrice)}`}
              className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-2xl">
              See homes up to {formatKsh(a.maxPrice)}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function MoneyField({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1 flex items-center rounded-xl border border-[#e6e2d8] focus-within:border-emerald-500 bg-white">
        <span className="pl-4 text-sm text-[#9c948a]">KSh</span>
        <input inputMode="numeric" value={fmtInput(value)} onChange={(e) => onChange(num(e.target.value))}
          className="flex-1 px-3 py-3 outline-none bg-transparent rounded-xl" />
      </div>
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-emerald-200/80 text-xs">{label}</p>
      <p className="font-semibold mt-0.5">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between py-3">
      <dt className="text-[#6b6358]">{label}</dt>
      <dd className="font-medium">{formatKsh(value)}</dd>
    </div>
  );
}
