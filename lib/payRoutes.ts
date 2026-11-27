// lib/payRoutes.ts
// Shared checks for the public pay endpoints (/api/pay/*). Server-only.

import type { SupabaseClient } from "@supabase/supabase-js";
import { adminConfigured, createAdminClient } from "@/lib/admin";
import { balance, loadInvoiceByToken, onlinePaymentsReady, type InvoiceRow, type PaymentRow } from "@/lib/payments";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 3;

export type Payable = { db: SupabaseClient; invoice: InvoiceRow; due: number };

/** Loads a payable invoice for a pay-link token, or returns the error response to send. */
export async function payableInvoice(token: unknown, method: PaymentRow["method"]): Promise<Payable | Response> {
  if (!adminConfigured() || !onlinePaymentsReady()) {
    return Response.json({ ok: false, error: "Online payment isn't available yet." }, { status: 503 });
  }
  const db = createAdminClient();
  const invoice = typeof token === "string" ? await loadInvoiceByToken(db, token) : null;
  if (!invoice) return Response.json({ ok: false, error: "Invoice not found." }, { status: 404 });
  if (invoice.status !== "pending") {
    return Response.json({ ok: false, error: invoice.status === "paid" ? "This invoice is already paid." : "This invoice was cancelled." }, { status: 409 });
  }
  const due = balance(invoice);
  if (due < 1) return Response.json({ ok: false, error: "Nothing left to pay." }, { status: 409 });

  // Stops a pay link being used to spam someone's phone with M-Pesa prompts.
  const { count } = await db
    .from("payments")
    .select("id", { count: "exact", head: true })
    .eq("invoice_id", invoice.id)
    .eq("method", method)
    .gte("created_at", new Date(Date.now() - WINDOW_MS).toISOString());
  if ((count ?? 0) >= MAX_ATTEMPTS) {
    return Response.json({ ok: false, error: "Too many attempts. Wait 10 minutes and try again." }, { status: 429 });
  }
  return { db, invoice, due };
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
