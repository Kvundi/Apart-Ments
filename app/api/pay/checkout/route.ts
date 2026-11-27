// app/api/pay/checkout/route.ts
// Creates an IntaSend hosted checkout (card, bank, M-Pesa) for the balance on an invoice
// and returns its URL. Body: { token: <pay-link token> }

import { createCheckout } from "@/lib/intasend";
import { payableInvoice, readJson } from "@/lib/payRoutes";
import { SITE } from "@/lib/site";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return Response.json({ ok: false, error: "Bad request." }, { status: 400 });

  const payable = await payableInvoice(body.token, "intasend_checkout");
  if (payable instanceof Response) return payable;
  const { db, invoice, due } = payable;

  const { data: payment, error } = await db
    .from("payments")
    .insert({ invoice_id: invoice.id, method: "intasend_checkout", amount: due })
    .select("id")
    .single();
  if (error || !payment) return Response.json({ ok: false, error: "Couldn't start the payment." }, { status: 500 });

  try {
    const { url, checkoutId } = await createCheckout({
      amount: due,
      apiRef: payment.id,
      host: SITE.url,
      redirectUrl: `${SITE.url}/pay/${invoice.pay_token}?checking=1`,
    });
    if (checkoutId) await db.from("payments").update({ checkout_id: checkoutId }).eq("id", payment.id);
    return Response.json({ ok: true, url });
  } catch (e) {
    console.error("Checkout failed:", e);
    await db.from("payments").update({ status: "failed", failure_reason: String(e).slice(0, 300) }).eq("id", payment.id);
    return Response.json({ ok: false, error: "The card/bank page couldn't be opened. Try again or use M-Pesa." }, { status: 502 });
  }
}
