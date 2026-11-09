"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { formatKsh } from "@/lib/listing";

// From the research notes: KMRC-backed loans are for residential homes up to KSh 10.5M,
// for Kenyan citizens with verifiable income. Income caps differ by lender/source
// (KSh 100K–200K a month), so above 100K we say "check with the lender".
const PRICE_CAP = 10_500_000;
const INCOME_SAFE = 100_000;
const INCOME_MAX_REPORTED = 200_000;

export default function KmrcChecker() {
  const [price, setPrice] = useState(6_000_000);
  const [income, setIncome] = useState(90_000);
  const [citizen, setCitizen] = useState(true);
  const [residential, setResidential] = useState(true);
  const [verifiable, setVerifiable] = useState(true);

  const checks: { ok: boolean | null; label: string }[] = [
    { ok: price <= PRICE_CAP, label: `Home price up to ${formatKsh(PRICE_CAP)}` },
    { ok: citizen, label: "Kenyan citizen" },
    { ok: residential, label: "Buying a home to live in (residential)" },
    { ok: verifiable, label: "Income you can prove (payslips or statements)" },
    {
      ok: income <= INCOME_SAFE ? true : income <= INCOME_MAX_REPORTED ? null : false,
      label: income <= INCOME_SAFE
        ? "Income within the usual cap"
        : income <= INCOME_MAX_REPORTED
          ? "Income cap varies by lender (KSh 100K–200K) — check"
          : "Income above the caps lenders report",
    },
  ];
  const fails = checks.filter((c) => c.ok === false).length;
  const unsure = checks.filter((c) => c.ok === null).length;

  return (
    <div className="rounded-3xl border border-[#e6e2d8] overflow-hidden">
      <div className="p-6 space-y-4 bg-white">
        <h3 className="text-lg font-bold">Quick check: could a KMRC-backed loan work for you?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Money label="Home price" value={price} onChange={setPrice} />
          <Money label="Net monthly income" value={income} onChange={setIncome} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <Toggle label="Kenyan citizen" checked={citizen} onChange={setCitizen} />
          <Toggle label="Home to live in" checked={residential} onChange={setResidential} />
          <Toggle label="Provable income" checked={verifiable} onChange={setVerifiable} />
        </div>
      </div>
      <div className={`p-6 border-t ${fails ? "bg-rose-50 border-rose-200" : unsure ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
        <p className="font-semibold mb-3">
          {fails ? "This probably doesn't qualify." : unsure ? "You may qualify — confirm the income cap with a lender." : "You look likely to qualify — talk to a KMRC partner lender."}
        </p>
        <ul className="space-y-1.5 text-sm">
          {checks.map((c) => (
            <li key={c.label} className="flex items-center gap-2">
              {c.ok === true ? <CheckCircle2 size={16} className="text-emerald-600" /> : c.ok === false ? <XCircle size={16} className="text-rose-600" /> : <HelpCircle size={16} className="text-amber-600" />}
              {c.label}
            </li>
          ))}
        </ul>
        <p className="text-xs text-[#6b6358] mt-4">A guide only. Each lender applies its own criteria and the limits change — the lender&apos;s offer is what counts.</p>
      </div>
    </div>
  );
}

function Money({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      <div className="mt-1 flex items-center rounded-xl border border-[#e6e2d8] focus-within:border-emerald-500">
        <span className="pl-3 text-[#9c948a]">KSh</span>
        <input inputMode="numeric" value={value ? value.toLocaleString("en-KE") : ""}
          onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")) || 0)}
          className="flex-1 px-3 py-2.5 outline-none bg-transparent" />
      </div>
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (b: boolean) => void }) {
  return (
    <label className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer ${checked ? "border-emerald-400 bg-emerald-50" : "border-[#e6e2d8]"}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-emerald-600 w-4 h-4" />
      {label}
    </label>
  );
}
