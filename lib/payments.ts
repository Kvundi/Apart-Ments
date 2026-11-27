// lib/payments.ts
// Commission invoices and payments. Server-only (service-role database client, secrets).
//
// Collection switch: invoices can only be created, and the pay page only takes money,
// once BOTH of these are set on the server (Vercel → Settings → Environment Variables):
//   EARB_REG_NO              28Homes' Estate Agents Registration Board registration number
//   EARB_PRACTISING_CERT_NO  this year's practising certificate number
// The Estate Agents Act (Cap 533) only lets registered agents charge commission, so
// until then everything else works (calculator, deal tracking) but nobody can be billed.
//
// Optional, shown on the pay page for manual payment:
//   BANK_NAME, BANK_ACCOUNT_NAME, BANK_ACCOUNT_NUMBER, BANK_BRANCH, BANK_SWIFT
//   MPESA_PAYBILL, MPESA_PAYBILL_ACCOUNT  (if the account is empty, the invoice number is used)
//   INVOICE_DUE_DAYS                      default 7

import type { SupabaseClient } from "@supabase/supabase-js";
import { getStatus, intasendConfigured, type IntaSendInvoice } from "@/lib/intasend";
import { alertKen } from "@/lib/notify";
import { formatKsh } from "@/lib/listing";
import { SITE } from "@/lib/site";

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const env = (k: string) => (process.env[k] ?? "").trim();

/** 28Homes' EARB numbers, or null while not registered (collection switched off). */
export function earbRegistration(): { regNo: string; certNo: string } | null {
  const regNo = env("EARB_REG_NO");
  const certNo = env("EARB_PRACTISING_CERT_NO");
  return regNo && certNo ? { regNo, certNo } : null;
}

export function collectionEnabled(): boolean {
  return earbRegistration() !== null;
}

/** M-Pesa prompt and card/bank checkout through IntaSend. */
export function onlinePaymentsReady(): boolean {
  return collectionEnabled() && intasendConfigured();
}

export type BankDetails = { bank: string; accountName: string; accountNumber: string; branch: string; swift: string };

export function bankDetails(): BankDetails | null {
  const d = {
    bank: env("BANK_NAME"),
    accountName: env("BANK_ACCOUNT_NAME"),
    accountNumber: env("BANK_ACCOUNT_NUMBER"),
    branch: env("BANK_BRANCH"),
    swift: env("BANK_SWIFT"),
  };
  return d.bank && d.accountName && d.accountNumber ? d : null;
}

export function mpesaPaybill(invoiceNumber: string): { paybill: string; account: string } | null {
  const paybill = env("MPESA_PAYBILL");
  return paybill ? { paybill, account: env("MPESA_PAYBILL_ACCOUNT") || invoiceNumber } : null;
}

export function invoiceDueDays(): number {
  const n = Number(env("INVOICE_DUE_DAYS"));
  return Number.isInteger(n) && n >= 1 && n <= 90 ? n : 7;
}

/** Today's date in Nairobi as YYYY-MM-DD (UTC+3, no daylight saving). */
export function todayNairobi(): string {
  return new Date(Date.now() + 3 * 3600_000).toISOString().slice(0, 10);
}

export function addDaysNairobi(days: number): string {
  return new Date(Date.now() + 3 * 3600_000 + days * 86400_000).toISOString().slice(0, 10);
}

export type InvoiceRow = {
  id: string;
  number: string;
  pay_token: string;
  deal_id: string | null;
  property_id: string | null;
  property_title: string | null;
  payer_name: string | null;
  payer_phone: string | null;
  deal_type: "sale" | "rent";
  deal_price: number;
  rate_label: string;
  subtotal: number;
  vat: number;
  amount: number;
  amount_paid: number;
  status: "pending" | "paid" | "cancelled";
  due_date: string;
  notes: string | null;
  created_at: string;
  paid_at: string | null;
  reminded_at: string | null;
};

export type PaymentRow = {
  id: string;
  invoice_id: string;
  method: "mpesa_stk" | "intasend_checkout" | "bank_transfer" | "mpesa_manual";
  amount: number;
  status: "pending" | "complete" | "failed";
  provider_ref: string | null;
  checkout_id: string | null;
  reference: string | null;
  provider: string | null;
  failure_reason: string | null;
  created_at: string;
  completed_at: string | null;
};

export const METHOD_LABELS: Record<PaymentRow["method"], string> = {
  mpesa_stk: "M-Pesa (prompt)",
  intasend_checkout: "Card / bank (IntaSend)",
  bank_transfer: "Bank transfer",
  mpesa_manual: "M-Pesa (manual)",
};

export const INVOICE_COLUMNS =
  "id, number, pay_token, deal_id, property_id, property_title, payer_name, payer_phone, deal_type, deal_price, " +
  "rate_label, subtotal, vat, amount, amount_paid, status, due_date, notes, created_at, paid_at, reminded_at";

export function toInvoice(r: Record<string, unknown>): InvoiceRow {
  const n = (k: string) => Number(r[k] ?? 0);
  return { ...(r as unknown as InvoiceRow), deal_price: n("deal_price"), subtotal: n("subtotal"), vat: n("vat"), amount: n("amount"), amount_paid: n("amount_paid") };
}

export type DisplayStatus = "Paid" | "Pending" | "Overdue" | "Cancelled";

export function displayStatus(inv: Pick<InvoiceRow, "status" | "due_date">): DisplayStatus {
  if (inv.status === "paid") return "Paid";
  if (inv.status === "cancelled") return "Cancelled";
  return inv.due_date < todayNairobi() ? "Overdue" : "Pending";
}

export function balance(inv: Pick<InvoiceRow, "amount" | "amount_paid">): number {
  return Math.max(0, Math.round(inv.amount - inv.amount_paid));
}

export function payLink(token: string): string {
  return `${SITE.url}/pay/${token}`;
}

export async function loadInvoiceByToken(db: SupabaseClient, token: string): Promise<InvoiceRow | null> {
  if (!UUID_RE.test(token)) return null;
  const { data, error } = await db.from("invoices").select(INVOICE_COLUMNS).eq("pay_token", token).maybeSingle();
  if (error) throw new Error(`Could not load invoice: ${error.message}`);
  return data ? toInvoice(data as unknown as Record<string, unknown>) : null;
}

/** Recalculates the invoice from its completed payments. Returns the new status. */
export async function refreshInvoice(db: SupabaseClient, invoiceId: string): Promise<string | null> {
  const { data, error } = await db.rpc("refresh_invoice_status", { p_invoice: invoiceId });
  if (error) throw new Error(`Could not update invoice: ${error.message}`);
  return (data as string | null) ?? null;
}

async function alertPaid(db: SupabaseClient, invoiceId: string, payment: { amount: number; method: PaymentRow["method"]; reference: string | null }) {
  const { data } = await db.from("invoices").select(INVOICE_COLUMNS).eq("id", invoiceId).maybeSingle();
  if (!data) return;
  const inv = toInvoice(data as unknown as Record<string, unknown>);
  const left = balance(inv);
  const state = inv.status === "paid" ? "PAID IN FULL" : `balance ${formatKsh(left)}`;
  await alertKen(db, {
    kind: "payment",
    propertyId: inv.property_id,
    subject: `Payment received: ${formatKsh(payment.amount)} for ${inv.number}`,
    text: [
      `${formatKsh(payment.amount)} received for invoice ${inv.number} (${state}).`,
      `Listing: ${inv.property_title ?? "—"}`,
      `Payer: ${inv.payer_name ?? "—"} ${inv.payer_phone ?? ""}`,
      `Method: ${METHOD_LABELS[payment.method]}${payment.reference ? ` · ref ${payment.reference}` : ""}`,
      ``,
      `Payments: ${SITE.url}/admin/payments`,
    ].join("\n"),
    sms: `28Homes: ${formatKsh(payment.amount)} paid on ${inv.number} (${state}).`,
  });
}

/**
 * Applies IntaSend's answer to one of our payment rows. Only a COMPLETE state from
 * IntaSend's own status API marks money as received. Returns true if this call is the
 * one that marked it complete (so the alert is sent once).
 */
export async function applyProviderStatus(db: SupabaseClient, payment: PaymentRow, st: IntaSendInvoice): Promise<boolean> {
  if (st.apiRef && st.apiRef !== payment.id) throw new Error("IntaSend api_ref does not match this payment");

  if (st.state === "COMPLETE") {
    if (st.currency && st.currency !== "KES") {
      await db.from("payments").update({ failure_reason: `Unexpected currency ${st.currency}` }).eq("id", payment.id);
      return false;
    }
    const value = st.value != null && st.value > 0 ? Math.round(st.value * 100) / 100 : payment.amount;
    const { data, error } = await db
      .from("payments")
      .update({
        status: "complete",
        amount: value,
        completed_at: new Date().toISOString(),
        provider_ref: st.invoiceId,
        provider: st.provider,
        reference: st.mpesaReference ?? payment.reference,
        failure_reason: null,
      })
      .eq("id", payment.id)
      .in("status", ["pending", "failed"])
      .select("id")
      .maybeSingle();
    if (error) throw new Error(`Could not save payment: ${error.message}`);
    if (!data) return false; // already complete: another request got here first
    await refreshInvoice(db, payment.invoice_id);
    await alertPaid(db, payment.invoice_id, { amount: value, method: payment.method, reference: st.mpesaReference ?? payment.reference });
    return true;
  }

  if (st.state === "FAILED") {
    await db
      .from("payments")
      .update({ status: "failed", provider_ref: st.invoiceId, failure_reason: (st.failedReason ?? "Failed").slice(0, 300) })
      .eq("id", payment.id)
      .eq("status", "pending");
    return false;
  }

  if (!payment.provider_ref) await db.from("payments").update({ provider_ref: st.invoiceId }).eq("id", payment.id);
  return false;
}

/** Re-checks an invoice's recent online payments with IntaSend (used by the pay page while waiting). */
export async function reconcileInvoice(db: SupabaseClient, invoiceId: string): Promise<void> {
  if (!intasendConfigured()) return;
  const since = new Date(Date.now() - 24 * 3600_000).toISOString();
  const { data } = await db
    .from("payments")
    .select("*")
    .eq("invoice_id", invoiceId)
    .eq("status", "pending")
    .not("provider_ref", "is", null)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(3);
  for (const p of (data ?? []) as PaymentRow[]) {
    try {
      await applyProviderStatus(db, p, await getStatus(p.provider_ref as string));
    } catch (e) {
      console.error("reconcile failed:", e);
    }
  }
}
