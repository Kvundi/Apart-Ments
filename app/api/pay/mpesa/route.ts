// app/api/pay/mpesa/route.ts
// Sends an M-Pesa PIN prompt (STK push via IntaSend) for the balance on an invoice.
// Body: { token: <pay-link token>, phone: "07XX XXX XXX" }

import { toE164 } from "@/lib/phone";
import { stkPush } from "@/lib/intasend";
import { payableInvoice, readJson } from "@/lib/payRoutes";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return Response.json({ ok: false, error: "Bad request." }, { status: 400 });

  const e164 = toE164(typeof body.phone === "string" ? body.phone : "");
  // Safaricom numbers: +2547XXXXXXXX or +2541XXXXXXXX
  if (!e164 || !/^\+254[17]\d{8}$/.test(e164)) {
    return Response.json({ ok: false, error: "Enter a Safaricom number, e.g. 0712 345 678." }, { status: 400 });
  }

  const payable = await payableInvoice(body.token, "mpesa_stk");
  if (payable instanceof Response) return payable;
  const { db, invoice, due } = payable;

  const { data: payment, error } = await db
    .from("payments")
    .insert({ invoice_id: invoice.id, method: "mpesa_stk", amount: due })
    .select("id")
    .single();
  if (error || !payment) return Response.json({ ok: false, error: "Couldn't start the payment." }, { status: 500 });

  try {
    const res = await stkPush({ phone: e164.slice(1), amount: due, apiRef: payment.id, narrative: `28Homes ${invoice.number}` });
    await db.from("payments").update({ provider_ref: res.invoiceId }).eq("id", payment.id);
    return Response.json({ ok: true, paymentId: payment.id, amount: due });
  } catch (e) {
    console.error("STK push failed:", e);
    await db.from("payments").update({ status: "failed", failure_reason: String(e).slice(0, 300) }).eq("id", payment.id);
    return Response.json({ ok: false, error: "M-Pesa didn't accept the request. Check the number and try again." }, { status: 502 });
  }
}
