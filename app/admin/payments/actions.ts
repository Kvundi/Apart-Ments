"use server";

// Admin actions for commission invoices and payments. Every function checks the caller
// is an admin first: Server Actions can be called by a direct POST, not just from the page.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient, requireAdmin } from "@/lib/admin";
import { calculateCommission, COMMISSION, toDealType } from "@/lib/commission";
import { toE164 } from "@/lib/phone";
import { addDaysNairobi, collectionEnabled, invoiceDueDays, refreshInvoice, UUID_RE } from "@/lib/payments";

function str(formData: FormData, key: string, max = 500): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function money(formData: FormData, key: string): number | null {
  const raw = str(formData, key, 20).replace(/[,\s]/g, "");
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : NaN;
}

function back(notice: string): never {
  redirect(`/admin/payments?${new URLSearchParams({ notice }).toString()}`);
}

/** Bill the lister for a confirmed deal. Only possible once the EARB numbers are set. */
export async function createInvoice(formData: FormData) {
  const actor = await requireAdmin();
  if (!collectionEnabled()) back("Commission collection is off until EARB_REG_NO and EARB_PRACTISING_CERT_NO are set.");
  const dealId = str(formData, "deal_id", 36);
  if (!UUID_RE.test(dealId)) throw new Error("Invalid deal id");

  const db = createAdminClient();
  const { data: deal } = await db.from("deals").select("id, property_id, status, deal_price, listing_status").eq("id", dealId).maybeSingle();
  if (!deal || deal.status !== "confirmed") back("Only confirmed deals can be invoiced.");
  const { data: listing } = await db
    .from("properties")
    .select("id, title, listing_type, user_id, contact_name, contact_phone")
    .eq("id", deal.property_id)
    .maybeSingle();

  const dealType = toDealType(str(formData, "deal_type", 10) || (deal.listing_status === "Rented" ? "rent" : listing?.listing_type));
  const price = money(formData, "deal_price") ?? (deal.deal_price != null ? Number(deal.deal_price) : null);
  if (price == null || Number.isNaN(price)) back("Enter the final price (or monthly rent) in KSh.");
  const calc = calculateCommission(dealType, price);
  if (!calc) back("Enter a valid price.");

  // Ken can bill a different, agreed amount (e.g. a discount); VAT follows the same rate.
  const agreed = money(formData, "amount");
  if (Number.isNaN(agreed)) back("The commission must be a number in KSh.");
  const subtotal = agreed ?? calc.subtotal;
  const vat = Math.round(subtotal * COMMISSION.vatRate);

  const { error } = await db.from("invoices").insert({
    deal_id: deal.id,
    property_id: listing?.id ?? null,
    property_title: listing?.title?.slice(0, 200) ?? null,
    payer_user_id: listing?.user_id ?? null,
    payer_name: (str(formData, "payer_name", 120) || listing?.contact_name || null)?.slice(0, 120) ?? null,
    payer_phone: toE164(str(formData, "payer_phone", 20) || listing?.contact_phone) ?? null,
    deal_type: dealType,
    deal_price: price,
    rate_label: subtotal === calc.subtotal ? calc.rateLabel : "agreed amount",
    subtotal,
    vat,
    amount: subtotal + vat,
    due_date: addDaysNairobi(invoiceDueDays()),
    notes: str(formData, "notes", 1000) || null,
    created_by: actor,
  });
  if (error) {
    if (error.code === "23505") back("That deal already has an invoice.");
    throw new Error(`Invoice failed: ${error.message}`);
  }
  revalidatePath("/admin/payments");
  back("Invoice created. Send the pay link to the lister on WhatsApp.");
}

const MANUAL_METHODS = new Set(["bank_transfer", "mpesa_manual"]);

/** Record money that arrived outside IntaSend (bank transfer, Paybill, M-Pesa to the till). */
export async function recordPayment(formData: FormData) {
  const actor = await requireAdmin();
  const invoiceId = str(formData, "invoice_id", 36);
  const method = str(formData, "method", 20);
  const reference = str(formData, "reference", 80).toUpperCase();
  const amount = money(formData, "amount");
  if (!UUID_RE.test(invoiceId) || !MANUAL_METHODS.has(method)) throw new Error("Invalid payment");
  if (amount == null || Number.isNaN(amount)) back("Enter the amount received in KSh.");
  if (!reference) back("Enter the bank reference or M-Pesa code so the payment can be traced.");

  const db = createAdminClient();
  const { data: invoice } = await db.from("invoices").select("id, status").eq("id", invoiceId).maybeSingle();
  if (!invoice || invoice.status === "cancelled") back("That invoice is cancelled or missing.");

  const { error } = await db.from("payments").insert({
    invoice_id: invoiceId,
    method,
    amount,
    reference,
    status: "complete",
    completed_at: new Date().toISOString(),
    recorded_by: actor,
  });
  if (error) {
    if (error.code === "23505") back(`Reference ${reference} has already been recorded.`);
    throw new Error(`Payment failed: ${error.message}`);
  }
  const status = await refreshInvoice(db, invoiceId);
  revalidatePath("/admin/payments");
  back(status === "paid" ? "Payment recorded. Invoice is paid in full." : "Payment recorded. A balance is still due.");
}

/** Cancel an unpaid invoice (wrong amount, deal reversed). The deal can then be invoiced again. */
export async function cancelInvoice(formData: FormData) {
  await requireAdmin();
  const invoiceId = str(formData, "invoice_id", 36);
  if (!UUID_RE.test(invoiceId)) throw new Error("Invalid invoice id");
  const db = createAdminClient();
  const { data, error } = await db
    .from("invoices")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
    .eq("id", invoiceId)
    .eq("status", "pending")
    .eq("amount_paid", 0)
    .select("id")
    .maybeSingle();
  if (error) throw new Error(`Cancel failed: ${error.message}`);
  revalidatePath("/admin/payments");
  back(data ? "Invoice cancelled." : "Only unpaid invoices with no payments can be cancelled.");
}

/** Notes that Ken sent a reminder (the WhatsApp message itself is sent from his phone). */
export async function markReminded(formData: FormData) {
  await requireAdmin();
  const invoiceId = str(formData, "invoice_id", 36);
  if (!UUID_RE.test(invoiceId)) throw new Error("Invalid invoice id");
  await createAdminClient().from("invoices").update({ reminded_at: new Date().toISOString() }).eq("id", invoiceId);
  revalidatePath("/admin/payments");
  back("Reminder noted.");
}
