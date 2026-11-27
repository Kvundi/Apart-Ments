import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MessageCircle, Receipt } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Callout } from "@/components/ui";
import { adminConfigured, createAdminClient, getAdminUserId } from "@/lib/admin";
import { calculateCommission, toDealType } from "@/lib/commission";
import { whatsappLink } from "@/lib/contact";
import { formatKsh } from "@/lib/listing";
import {
  balance,
  collectionEnabled,
  displayStatus,
  INVOICE_COLUMNS,
  METHOD_LABELS,
  onlinePaymentsReady,
  payLink,
  toInvoice,
  type DisplayStatus,
  type InvoiceRow,
  type PaymentRow,
} from "@/lib/payments";
import { cancelInvoice, createInvoice, markReminded, recordPayment } from "./actions";

export const metadata: Metadata = { title: "Payments · Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

type DealRow = { id: string; property_id: string; listing_status: string | null; deal_price: number | null; commission: number | null; decided_at: string | null };
type ListingRow = { id: string; title: string | null; listing_type: string | null; price: number | null; contact_name: string | null; contact_phone: string | null };

const inputCls = "w-full px-3 py-2.5 rounded-xl border border-[#e6e2d8] text-sm";
const BADGE: Record<DisplayStatus, string> = {
  Paid: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-800",
  Overdue: "bg-red-50 text-red-700",
  Cancelled: "bg-[#f7f5ef] text-[#6b6358]",
};

function day(iso: string | null) {
  if (!iso) return "—";
  return new Date(`${iso.slice(0, 10)}T12:00:00+03:00`).toLocaleDateString("en-KE", { day: "numeric", month: "short" });
}

function reminderText(inv: InvoiceRow, status: DisplayStatus): string {
  const name = inv.payer_name ? `Hi ${inv.payer_name.split(" ")[0]}, ` : "Hi, ";
  const what = inv.property_title ? ` for ${inv.property_title}` : "";
  return status === "Overdue"
    ? `${name}a reminder from 28Homes: invoice ${inv.number}${what} (${formatKsh(balance(inv))}) was due on ${day(inv.due_date)}. You can pay by M-Pesa, card or bank here: ${payLink(inv.pay_token)}`
    : `${name}congratulations on closing${what}! Here is 28Homes' commission invoice ${inv.number} for ${formatKsh(balance(inv))}, due ${day(inv.due_date)}. Pay by M-Pesa, card or bank: ${payLink(inv.pay_token)}`;
}

export default async function AdminPaymentsPage({ searchParams }: PageProps) {
  const { userId, isAdmin } = await getAdminUserId();
  if (!userId) redirect("/sign-in?redirect_url=%2Fadmin%2Fpayments");
  if (!isAdmin) notFound();
  const sp = await searchParams;
  const notice = typeof sp.notice === "string" ? sp.notice.slice(0, 200) : "";

  if (!adminConfigured()) {
    return (
      <Shell>
        <Callout tone="warn" title="Admin isn't configured yet">
          Add <code>SUPABASE_SERVICE_ROLE_KEY</code> to the server environment, then reload.
        </Callout>
      </Shell>
    );
  }

  const db = createAdminClient();
  const [{ data: dealData }, { data: invoiceData, error: invoiceError }, { data: paymentData }] = await Promise.all([
    db.from("deals").select("id, property_id, listing_status, deal_price, commission, decided_at").eq("status", "confirmed").order("decided_at", { ascending: false }).limit(500),
    db.from("invoices").select(INVOICE_COLUMNS).order("created_at", { ascending: false }).limit(500),
    db.from("payments").select("*").order("created_at", { ascending: false }).limit(50),
  ]);

  if (invoiceError) {
    return (
      <Shell>
        <Callout tone="warn" title="Run the payments migration first">
          Apply <code>supabase/migrations/20261127170000_commission_payments.sql</code>, then reload. ({invoiceError.message})
        </Callout>
      </Shell>
    );
  }

  const deals = (dealData ?? []) as DealRow[];
  const invoices = ((invoiceData ?? []) as unknown as Record<string, unknown>[]).map(toInvoice);
  const payments = ((paymentData ?? []) as PaymentRow[]).map((p) => ({ ...p, amount: Number(p.amount) }));
  const invoiceById = new Map(invoices.map((i) => [i.id, i]));

  const listingIds = [...new Set(deals.map((d) => d.property_id))];
  const { data: listingData } = listingIds.length
    ? await db.from("properties").select("id, title, listing_type, price, contact_name, contact_phone").in("id", listingIds)
    : { data: [] };
  const listings = new Map(((listingData ?? []) as ListingRow[]).map((l) => [l.id, l]));

  const invoicedDeals = new Set(invoices.filter((i) => i.status !== "cancelled").map((i) => i.deal_id));
  const awaiting = deals.filter((d) => !invoicedDeals.has(d.id));
  const withStatus = invoices.map((inv) => ({ inv, status: displayStatus(inv) }));
  const open = withStatus.filter((x) => x.status === "Pending" || x.status === "Overdue");
  const outstanding = open.reduce((n, x) => n + balance(x.inv), 0);
  const overdue = open.filter((x) => x.status === "Overdue");
  const collected = invoices.reduce((n, i) => n + i.amount_paid, 0);
  const enabled = collectionEnabled();

  return (
    <Shell>
      {notice && (
        <div className="mb-5">
          <Callout tone="success">{notice}</Callout>
        </div>
      )}
      {!enabled && (
        <div className="mb-5">
          <Callout tone="warn" title="Commission collection is switched off">
            You can&apos;t bill listers until 28Homes is registered with EARB. Once you have your numbers, add{" "}
            <code>EARB_REG_NO</code> and <code>EARB_PRACTISING_CERT_NO</code> in Vercel → Settings → Environment Variables
            and redeploy. The calculator and deal tracking already work.
          </Callout>
        </div>
      )}
      {enabled && !onlinePaymentsReady() && (
        <div className="mb-5">
          <Callout tone="info" title="Online payment isn't connected">
            Add <code>INTASEND_PUBLISHABLE_KEY</code> and <code>INTASEND_SECRET_KEY</code> to turn on M-Pesa prompts and
            card payments. Until then pay links show your bank and Paybill details only.
          </Callout>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Stat label="Outstanding" value={formatKsh(outstanding)} />
        <Stat label="Overdue" value={String(overdue.length)} />
        <Stat label="Collected" value={formatKsh(collected)} />
      </div>

      <section className="mb-8">
        <h2 className="font-bold mb-3">Ready to invoice ({awaiting.length})</h2>
        {awaiting.length === 0 ? (
          <Empty text="No confirmed deals waiting for an invoice. Confirm deals on the Deals tab first." />
        ) : (
          <div className="space-y-4">
            {awaiting.map((d) => {
              const l = listings.get(d.property_id);
              const type = d.listing_status === "Rented" ? "rent" : toDealType(l?.listing_type);
              const price = d.deal_price != null ? Number(d.deal_price) : l?.price != null ? Number(l.price) : null;
              const calc = calculateCommission(type, price);
              const suggested = d.commission != null && Number(d.commission) > 0 ? Number(d.commission) : calc?.subtotal;
              return (
                <form key={d.id} action={createInvoice} className="border border-[#e6e2d8] rounded-2xl p-4 bg-white space-y-2">
                  <input type="hidden" name="deal_id" value={d.id} />
                  <p className="font-semibold">{l?.title ?? "Deleted listing"}</p>
                  <p className="text-xs text-[#6b6358]">
                    {d.listing_status} {day(d.decided_at)} · lister {l?.contact_name ?? "—"} {l?.contact_phone ?? ""}
                    {calc ? ` · standard commission ${formatKsh(calc.subtotal)} (${calc.rateLabel})` : ""}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <label className="block">
                      <span className="block text-xs font-semibold text-[#6b6358] mb-1">Deal</span>
                      <select name="deal_type" defaultValue={type} className={`${inputCls} bg-white`}>
                        <option value="sale">Sale</option>
                        <option value="rent">Rent</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="block text-xs font-semibold text-[#6b6358] mb-1">{type === "rent" ? "Monthly rent" : "Final price"}</span>
                      <input name="deal_price" inputMode="numeric" defaultValue={price != null ? String(price) : ""} className={inputCls} />
                    </label>
                    <label className="block">
                      <span className="block text-xs font-semibold text-[#6b6358] mb-1">Commission (KSh)</span>
                      <input name="amount" inputMode="numeric" defaultValue={suggested != null ? String(suggested) : ""} className={inputCls} />
                    </label>
                  </div>
                  <input name="notes" maxLength={1000} placeholder="Note on the invoice (optional)" className={inputCls} />
                  <button disabled={!enabled} className="w-full bg-emerald-600 disabled:bg-[#d6d1c4] text-white font-semibold py-3 rounded-xl">
                    {enabled ? "Create invoice" : "Create invoice (needs EARB registration)"}
                  </button>
                </form>
              );
            })}
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="font-bold mb-3">Invoices ({invoices.length})</h2>
        {invoices.length === 0 ? (
          <Empty text="No invoices yet." />
        ) : (
          <div className="space-y-3">
            {withStatus.map(({ inv, status }) => (
              <article key={inv.id} className="border border-[#e6e2d8] rounded-2xl p-4 bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-semibold">
                      <Receipt size={15} className="text-emerald-600 shrink-0" /> {inv.number}
                    </p>
                    <p className="text-sm truncate">{inv.property_title ?? "—"}</p>
                    <p className="text-xs text-[#6b6358] mt-0.5">
                      {inv.payer_name ?? "—"} {inv.payer_phone ?? ""} · {formatKsh(inv.amount)} · due {day(inv.due_date)}
                      {inv.amount_paid > 0 && status !== "Paid" ? ` · paid ${formatKsh(inv.amount_paid)}` : ""}
                      {inv.reminded_at ? ` · reminded ${day(inv.reminded_at)}` : ""}
                    </p>
                  </div>
                  <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${BADGE[status]}`}>{status}</span>
                </div>

                {(status === "Pending" || status === "Overdue") && (
                  <div className="mt-3 space-y-2">
                    <input readOnly value={payLink(inv.pay_token)} aria-label="Pay link" className={`${inputCls} bg-[#f7f5ef] font-mono text-xs`} />
                    <div className="flex gap-2">
                      {inv.payer_phone && (
                        <a
                          href={whatsappLink(inv.payer_phone, reminderText(inv, status))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#25D366] text-white text-sm font-semibold py-2.5 rounded-xl"
                        >
                          <MessageCircle size={15} /> {status === "Overdue" ? "WhatsApp reminder" : "Send on WhatsApp"}
                        </a>
                      )}
                      <form action={markReminded}>
                        <input type="hidden" name="invoice_id" value={inv.id} />
                        <button className="h-full px-3 border border-[#e6e2d8] rounded-xl text-sm text-[#6b6358]">Mark sent</button>
                      </form>
                    </div>
                    <details className="rounded-xl border border-[#e6e2d8] p-3">
                      <summary className="text-sm font-semibold cursor-pointer">Record a bank or M-Pesa payment</summary>
                      <form action={recordPayment} className="grid grid-cols-2 gap-2 mt-3">
                        <input type="hidden" name="invoice_id" value={inv.id} />
                        <select name="method" className={`${inputCls} bg-white`} defaultValue="bank_transfer">
                          <option value="bank_transfer">Bank transfer</option>
                          <option value="mpesa_manual">M-Pesa (Paybill/till)</option>
                        </select>
                        <input name="amount" inputMode="numeric" required defaultValue={String(balance(inv))} className={inputCls} aria-label="Amount" />
                        <input name="reference" required maxLength={80} placeholder="Bank ref / M-Pesa code" className={`${inputCls} col-span-2`} />
                        <button className="col-span-2 bg-emerald-600 text-white font-semibold py-2.5 rounded-xl text-sm">Record payment</button>
                      </form>
                    </details>
                    {inv.amount_paid === 0 && (
                      <form action={cancelInvoice}>
                        <input type="hidden" name="invoice_id" value={inv.id} />
                        <button className="w-full text-xs text-[#6b6358] underline py-1">Cancel this invoice</button>
                      </form>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {payments.length > 0 && (
        <section>
          <h2 className="font-bold mb-3">Recent payments</h2>
          <ul className="divide-y divide-[#e6e2d8] border border-[#e6e2d8] rounded-2xl bg-white">
            {payments.map((p) => (
              <li key={p.id} className="px-4 py-2.5 text-sm flex items-center justify-between gap-3">
                <span className="min-w-0 truncate">
                  {invoiceById.get(p.invoice_id)?.number ?? "—"} · {METHOD_LABELS[p.method]}
                  {p.reference ? ` · ${p.reference}` : ""} · {day(p.created_at)}
                </span>
                <span
                  className={`shrink-0 font-semibold ${
                    p.status === "complete" ? "text-emerald-700" : p.status === "failed" ? "text-red-600" : "text-[#6b6358]"
                  }`}
                >
                  {p.status === "complete" ? `+ ${formatKsh(p.amount)}` : p.status === "failed" ? "Failed" : "Waiting"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <p className="text-sm mb-2">
          <Link href="/admin/listings" className="text-emerald-700 underline">
            ← Review listings
          </Link>
        </p>
        <h1 className="text-2xl font-bold mb-1">Commission payments</h1>
        <p className="text-sm text-[#6b6358] mb-5">Private to the 28Homes team. Invoices, pay links and payments received.</p>
        {children}
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f7f5ef] p-4">
      <p className="text-xs font-semibold text-[#6b6358] uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-center text-[#6b6358] py-12 border border-dashed border-[#e6e2d8] rounded-2xl">{text}</p>;
}
