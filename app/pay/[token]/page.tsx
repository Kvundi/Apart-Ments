import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheck, Landmark, Receipt, Smartphone } from "lucide-react";
import Navbar from "@/components/Navbar";
import PayOptions from "@/components/PayOptions";
import { Callout } from "@/components/ui";
import { adminConfigured, createAdminClient } from "@/lib/admin";
import { formatKsh } from "@/lib/listing";
import {
  balance,
  bankDetails,
  displayStatus,
  earbRegistration,
  loadInvoiceByToken,
  mpesaPaybill,
  onlinePaymentsReady,
} from "@/lib/payments";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

// Pay links are private: keep them out of search engines and don't leak them in referrers.
export const metadata: Metadata = {
  title: "Pay invoice",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const STATUS_STYLES = {
  Paid: "bg-emerald-100 text-emerald-800",
  Pending: "bg-amber-100 text-amber-800",
  Overdue: "bg-red-100 text-red-800",
  Cancelled: "bg-[#f0ede6] text-[#6b6358]",
} as const;

function formatDay(iso: string) {
  return new Date(`${iso.slice(0, 10)}T12:00:00+03:00`).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });
}

export default async function PayPage({ params, searchParams }: Props) {
  const { token } = await params;
  const sp = await searchParams;
  if (!adminConfigured()) notFound();
  const invoice = await loadInvoiceByToken(createAdminClient(), token);
  if (!invoice) notFound();

  const status = displayStatus(invoice);
  const due = balance(invoice);
  const earb = earbRegistration();
  const open = status === "Pending" || status === "Overdue";
  const collecting = open && earb !== null;
  const bank = collecting ? bankDetails() : null;
  const paybill = collecting ? mpesaPaybill(invoice.number) : null;
  const online = collecting && onlinePaymentsReady();

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#1a2420]">
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-8 space-y-5">
        <section className="rounded-3xl bg-white border border-[#e6e2d8] p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-[#6b6358]">
                <Receipt size={16} /> Invoice {invoice.number}
              </p>
              <h1 className="text-xl font-bold mt-1">{invoice.property_title ?? "28Homes commission"}</h1>
              {invoice.payer_name && <p className="text-sm text-[#6b6358] mt-0.5">Billed to {invoice.payer_name}</p>}
            </div>
            <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[status]}`}>{status}</span>
          </div>

          <dl className="mt-5 space-y-2 text-sm">
            <Row label={invoice.deal_type === "rent" ? "Monthly rent" : "Final sale price"} value={formatKsh(invoice.deal_price)} />
            <Row label={`Commission (${invoice.rate_label})`} value={formatKsh(invoice.subtotal)} />
            {invoice.vat > 0 && <Row label="VAT" value={formatKsh(invoice.vat)} />}
            <Row label="Total" value={formatKsh(invoice.amount)} strong />
            {invoice.amount_paid > 0 && <Row label="Paid so far" value={formatKsh(invoice.amount_paid)} />}
            {open && <Row label="Due date" value={formatDay(invoice.due_date)} />}
          </dl>

          {open && (
            <div className="mt-5 rounded-2xl bg-[#0c2a20] text-white px-5 py-4 flex items-center justify-between">
              <span className="text-sm text-emerald-100">Amount to pay</span>
              <span className="text-2xl font-bold">{formatKsh(due)}</span>
            </div>
          )}
        </section>

        {status === "Paid" && (
          <Callout tone="success" title="Paid in full">
            Thank you. 28Homes received {formatKsh(invoice.amount_paid)}
            {invoice.paid_at ? ` on ${formatDay(invoice.paid_at)}` : ""}. Keep this page as your receipt.
          </Callout>
        )}
        {status === "Cancelled" && (
          <Callout tone="info" title="This invoice was cancelled">
            Nothing is owed on it. If you have questions, contact 28Homes.
          </Callout>
        )}
        {open && !earb && (
          <Callout tone="info" title="Payment isn't open yet">
            28Homes isn&apos;t taking commission payments yet. Nothing is due on this invoice for now.
          </Callout>
        )}

        {collecting && (
          <section className="rounded-3xl bg-white border border-[#e6e2d8] p-6 space-y-5">
            <h2 className="font-bold text-lg">How would you like to pay?</h2>
            <PayOptions token={invoice.pay_token} balance={due} online={online} checkOnLoad={sp.checking === "1"} />
            {!online && !bank && !paybill && (
              <p className="text-sm text-[#6b6358]">
                Payment details will be shared by 28Homes. Reply to the message that brought you this link.
              </p>
            )}

            {paybill && (
              <div className="rounded-2xl border border-[#e6e2d8] p-5 text-sm space-y-1">
                <p className="flex items-center gap-2 font-semibold text-base mb-2">
                  <Smartphone size={18} className="text-emerald-600" /> M-Pesa Paybill
                </p>
                <Row label="Paybill number" value={paybill.paybill} strong />
                <Row label="Account number" value={paybill.account} strong />
                <Row label="Amount" value={formatKsh(due)} />
              </div>
            )}

            {bank && (
              <div className="rounded-2xl border border-[#e6e2d8] p-5 text-sm space-y-1">
                <p className="flex items-center gap-2 font-semibold text-base mb-2">
                  <Landmark size={18} className="text-emerald-600" /> Bank transfer
                </p>
                <Row label="Bank" value={bank.bank} />
                {bank.branch && <Row label="Branch" value={bank.branch} />}
                <Row label="Account name" value={bank.accountName} />
                <Row label="Account number" value={bank.accountNumber} strong />
                {bank.swift && <Row label="SWIFT" value={bank.swift} />}
                <Row label="Reference" value={invoice.number} strong />
                <p className="text-xs text-[#6b6358] pt-2">
                  Use the invoice number as the reference. Bank and Paybill payments are confirmed by 28Homes within one
                  working day.
                </p>
              </div>
            )}
          </section>
        )}

        <footer className="text-xs text-[#9c948a] text-center space-y-1 pb-6">
          {earb && (
            <p className="flex items-center justify-center gap-1">
              <BadgeCheck size={14} /> {SITE.name} · EARB reg. {earb.regNo} · Practising cert. {earb.certNo}
            </p>
          )}
          <p>28Homes will never ask you to pay to a personal number. Only pay using the details on this page.</p>
        </footer>
      </main>
    </div>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[#6b6358]">{label}</dt>
      <dd className={strong ? "font-bold" : "font-medium"}>{value}</dd>
    </div>
  );
}
