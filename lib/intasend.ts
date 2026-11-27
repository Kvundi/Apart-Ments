// lib/intasend.ts
// Minimal IntaSend client (M-Pesa STK push, hosted checkout for card/bank, status check).
// Server-only: uses the secret key. Docs: https://developers.intasend.com
//
// Environment variables (Vercel → Settings → Environment Variables):
//   INTASEND_PUBLISHABLE_KEY   ISPubKey_...   (IntaSend dashboard → Settings → API Keys)
//   INTASEND_SECRET_KEY        ISSecretKey_...
//   INTASEND_TEST              "true" while using sandbox keys; remove for live
//   INTASEND_WEBHOOK_CHALLENGE the "challenge" text you set on the webhook in the dashboard
//
// We never trust what a browser or webhook tells us about money: every payment is
// confirmed by asking IntaSend for the status ourselves (getStatus).

export type IntaSendState = "PENDING" | "PROCESSING" | "COMPLETE" | "FAILED" | "RETRY" | string;

export type IntaSendInvoice = {
  invoiceId: string;
  state: IntaSendState;
  value: number | null;
  currency: string | null;
  apiRef: string | null;
  provider: string | null;
  mpesaReference: string | null;
  failedReason: string | null;
};

function baseUrl(): string {
  return process.env.INTASEND_TEST === "true" ? "https://sandbox.intasend.com" : "https://payment.intasend.com";
}

export function intasendConfigured(): boolean {
  return Boolean(process.env.INTASEND_SECRET_KEY && process.env.INTASEND_PUBLISHABLE_KEY);
}

async function post(path: string, body: Record<string, unknown>, auth: boolean): Promise<Record<string, unknown>> {
  const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
  if (auth) headers.Authorization = `Bearer ${process.env.INTASEND_SECRET_KEY ?? ""}`;
  const res = await fetch(`${baseUrl()}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  const text = await res.text();
  let json: Record<string, unknown> = {};
  try {
    json = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    // fall through with the raw text in the error below
  }
  if (!res.ok) {
    const detail = typeof json.detail === "string" ? json.detail : text.slice(0, 200);
    throw new Error(`IntaSend ${res.status}: ${detail}`);
  }
  return json;
}

function readInvoice(json: Record<string, unknown>): IntaSendInvoice | null {
  const inv = (json.invoice && typeof json.invoice === "object" ? json.invoice : json) as Record<string, unknown>;
  const id = inv.invoice_id ?? inv.id;
  if (typeof id !== "string" || !id) return null;
  const s = (k: string) => (typeof inv[k] === "string" && inv[k] ? (inv[k] as string) : null);
  const value = inv.value == null ? null : Number(inv.value);
  return {
    invoiceId: id,
    state: s("state") ?? "PENDING",
    value: Number.isFinite(value) ? value : null,
    currency: s("currency"),
    apiRef: s("api_ref"),
    provider: s("provider"),
    mpesaReference: s("mpesa_reference"),
    failedReason: s("failed_reason"),
  };
}

/** Sends an M-Pesa PIN prompt to the payer's phone. phone: 2547XXXXXXXX (digits only). */
export async function stkPush(input: { phone: string; amount: number; apiRef: string; narrative: string }): Promise<IntaSendInvoice> {
  const json = await post(
    "/api/v1/payment/mpesa-stk-push/",
    { phone_number: input.phone, amount: input.amount, api_ref: input.apiRef, narrative: input.narrative.slice(0, 40) },
    true,
  );
  const inv = readInvoice(json);
  if (!inv) throw new Error("IntaSend did not return an invoice id");
  return inv;
}

/** Creates a hosted checkout page (card, bank, M-Pesa). Returns the URL to send the payer to. */
export async function createCheckout(input: {
  amount: number;
  apiRef: string;
  email?: string | null;
  host: string;
  redirectUrl: string;
}): Promise<{ url: string; checkoutId: string | null }> {
  const json = await post(
    "/api/v1/checkout/",
    {
      public_key: process.env.INTASEND_PUBLISHABLE_KEY,
      amount: input.amount,
      currency: "KES",
      api_ref: input.apiRef,
      host: input.host,
      redirect_url: input.redirectUrl,
      ...(input.email ? { email: input.email } : {}),
    },
    false,
  );
  const url = typeof json.url === "string" ? json.url : null;
  if (!url || !/^https:\/\//.test(url)) throw new Error("IntaSend did not return a checkout URL");
  return { url, checkoutId: typeof json.id === "string" ? json.id : null };
}

/** Asks IntaSend for the real state of a payment. The only thing we trust. */
export async function getStatus(invoiceId: string): Promise<IntaSendInvoice> {
  const json = await post("/api/v1/payment/status/", { invoice_id: invoiceId }, true);
  const inv = readInvoice(json);
  if (!inv) throw new Error("IntaSend status had no invoice");
  return inv;
}
