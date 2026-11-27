// app/api/pay/status/route.ts
// The pay page polls this while the payer completes M-Pesa or checkout.
// Re-checks pending payments with IntaSend, then returns the invoice state.
// GET /api/pay/status?token=<pay-link token>

import { adminConfigured, createAdminClient } from "@/lib/admin";
import { balance, displayStatus, loadInvoiceByToken, reconcileInvoice } from "@/lib/payments";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (!adminConfigured()) return Response.json({ ok: false }, { status: 503 });
  const db = createAdminClient();
  const first = await loadInvoiceByToken(db, token);
  if (!first) return Response.json({ ok: false }, { status: 404 });

  if (first.status === "pending") await reconcileInvoice(db, first.id);
  const invoice = (await loadInvoiceByToken(db, token)) ?? first;

  const { data: last } = await db
    .from("payments")
    .select("status, failure_reason")
    .eq("invoice_id", invoice.id)
    .in("method", ["mpesa_stk", "intasend_checkout"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return Response.json(
    {
      ok: true,
      status: displayStatus(invoice),
      paid: invoice.amount_paid,
      balance: balance(invoice),
      lastAttempt: last ? { status: last.status, failed: last.status === "failed" } : null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
