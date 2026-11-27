"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { calculateCommission, COMMISSION, type DealType } from "@/lib/commission";

const fmt = (n: number) => `KSh ${Math.round(n).toLocaleString("en-KE")}`;

/** Lets a lister see exactly what 28Homes' commission would be on a sale or letting. */
export default function CommissionCalculator({
  initialType = "sale",
  initialPrice,
}: {
  initialType?: DealType;
  initialPrice?: number;
}) {
  const [type, setType] = useState<DealType>(initialType);
  const [price, setPrice] = useState(initialPrice ? String(initialPrice) : "");
  const value = Number(price.replace(/[,\s]/g, ""));
  const result = calculateCommission(type, Number.isFinite(value) ? value : null);

  return (
    <div className="grid gap-6 md:grid-cols-2 rounded-3xl border border-[#e6e2d8] bg-white p-6 md:p-8 shadow-sm">
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold mb-2">Type of deal</p>
          <div className="flex gap-2" role="group" aria-label="Type of deal">
            {(["sale", "rent"] as const).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={type === t}
                onClick={() => setType(t)}
                className={`flex-1 py-3 rounded-2xl font-medium transition ${
                  type === t ? "bg-emerald-600 text-white" : "bg-white border border-[#e6e2d8] hover:border-emerald-400"
                }`}
              >
                {t === "sale" ? "Sale" : "Rental"}
              </button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="block text-sm font-semibold mb-2">
            {type === "sale" ? "Final sale price (KSh)" : "Monthly rent (KSh)"}
          </span>
          <input
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^\d,\s]/g, ""))}
            placeholder={type === "sale" ? "e.g. 8,500,000" : "e.g. 45,000"}
            className="input w-full px-5 py-4 rounded-2xl text-lg"
          />
        </label>
        <p className="text-sm text-[#6b6358]">
          {type === "sale"
            ? `${COMMISSION.saleRate * 100}% of the price the buyer actually pays, not the asking price.`
            : `${COMMISSION.rentMonths} month's rent, once, when the tenant signs. Nothing monthly after that.`}
        </p>
      </div>

      <div className="rounded-2xl bg-[#0c2a20] text-white p-6 flex flex-col justify-center" aria-live="polite">
        <p className="flex items-center gap-2 text-emerald-200 text-sm font-semibold uppercase tracking-wider">
          <Calculator size={16} /> You would pay 28Homes
        </p>
        <p className="text-4xl md:text-5xl font-bold mt-3">{result ? fmt(result.total) : "KSh —"}</p>
        {result && (
          <dl className="mt-5 space-y-1.5 text-sm text-emerald-50/90">
            <div className="flex justify-between gap-4">
              <dt>Commission ({result.rateLabel})</dt>
              <dd>{fmt(result.subtotal)}</dd>
            </div>
            {result.vat > 0 && (
              <div className="flex justify-between gap-4">
                <dt>VAT ({Math.round(COMMISSION.vatRate * 100)}%)</dt>
                <dd>{fmt(result.vat)}</dd>
              </div>
            )}
            {type === "sale" && (
              <div className="flex justify-between gap-4 border-t border-white/15 pt-2 mt-2">
                <dt>You keep from the sale</dt>
                <dd>{fmt(result.price - result.total)}</dd>
              </div>
            )}
          </dl>
        )}
        <p className="mt-5 text-xs text-emerald-100/70">
          Only due if the buyer or tenant came through 28Homes and the deal closes. Listing is free.
        </p>
      </div>
    </div>
  );
}
