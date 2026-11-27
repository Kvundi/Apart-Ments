// app/api/intasend/webhook/route.ts
// IntaSend calls this when a payment changes state. Set it up in the IntaSend dashboard:
//   URL:       https://<your-domain>/api/intasend/webhook
//   Challenge: any long random text; put the same text in INTASEND_WEBHOOK_CHALLENGE
//
// The body is only a hint: we check the challenge, find our payment by api_ref, then ask
// IntaSend's status API for the real state before recording any money.

import { timingSafeEqual } from "node:crypto";
import { adminConfigured, createAdminClient } from "@/lib/admin";
import { getStatus } from "@/lib/intasend";
import { applyProviderStatus, UUID_RE, type PaymentRow } from "@/lib/payments";

function sameSecret(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function POST(request: Request) {
  const expected = process.env.INTASEND_WEBHOOK_CHALLENGE ?? "";
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const challenge = typeof body.challenge === "string" ? body.challenge : "";
  if (!expected || !challenge || !sameSecret(challenge, expected)) return Response.json({ ok: false }, { status: 401 });
  if (!adminConfigured()) return Response.json({ ok: false }, { status: 503 });

  const invoiceId = typeof body.invoice_id === "string" ? body.invoice_id : "";
  const apiRef = typeof body.api_ref === "string" ? body.api_ref : "";
  if (!invoiceId) return Response.json({ ok: true, ignored: "no invoice_id" });

  const db = createAdminClient();
  let query = db.from("payments").select("*");
  query = UUID_RE.test(apiRef) ? query.eq("id", apiRef) : query.eq("provider_ref", invoiceId);
  const { data } = await query.maybeSingle();
  // Not one of ours (e.g. a payment made from the IntaSend dashboard): acknowledge and ignore.
  if (!data) return Response.json({ ok: true, ignored: "unknown payment" });

  try {
    const changed = await applyProviderStatus(db, data as PaymentRow, await getStatus(invoiceId));
    return Response.json({ ok: true, changed });
  } catch (e) {
    console.error("IntaSend webhook failed:", e);
    // 500 so IntaSend retries later.
    return Response.json({ ok: false }, { status: 500 });
  }
}
