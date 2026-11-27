// lib/notify.ts
// Sends Ken an alert by email (Resend) and SMS (Africa's Talking) when a client
// contacts a lister or a deal may have closed. Server-only: reads secret keys.
//
// Environment variables (Vercel → Settings → Environment Variables; .env.local locally):
//   RESEND_API_KEY      https://resend.com → API Keys                      (email)
//   ALERTS_FROM_EMAIL   optional; default "28Homes <onboarding@resend.dev>"  (email)
//   KEN_ALERT_EMAIL     where alerts go, e.g. your Gmail                    (email)
//   AT_USERNAME         Africa's Talking app username                       (SMS)
//   AT_API_KEY          Africa's Talking API key                             (SMS)
//   KEN_ALERT_PHONE     e.g. +2547XXXXXXXX                                   (SMS)
//   SMS_DAILY_CAP       optional; max alert SMS per day, default 30          (SMS)
// A channel whose variables are missing is skipped, so email can work without SMS.
//
// Guards against spam and surprise SMS bills (contact taps come from anonymous visitors):
//   - at most one LEAD alert per listing every 10 minutes
//   - at most SMS_DAILY_CAP alert SMS per day (deals always email even past the cap)

import type { SupabaseClient } from "@supabase/supabase-js";

export type AlertKind = "lead" | "deal" | "payment";

const LEAD_COOLDOWN_MS = 10 * 60 * 1000;
const DEFAULT_SMS_CAP = 30;

type AlertInput = {
  kind: AlertKind;
  /** Null for payments on an invoice whose listing was deleted. */
  propertyId: string | null;
  subject: string;
  /** Plain text: used for the email body and (shortened) for the SMS. */
  text: string;
  /** Short SMS version, max ~160 characters. */
  sms: string;
};

export type AlertResult = { email: "sent" | "skipped" | "failed"; sms: "sent" | "skipped" | "failed"; reason?: string };

function startOfTodayNairobiISO(): string {
  // Nairobi is UTC+3 all year: midnight Nairobi = 21:00 UTC the day before.
  const now = new Date();
  const nairobi = new Date(now.getTime() + 3 * 3600_000);
  const midnightNairobiAsUtc = Date.UTC(nairobi.getUTCFullYear(), nairobi.getUTCMonth(), nairobi.getUTCDate()) - 3 * 3600_000;
  return new Date(midnightNairobiAsUtc).toISOString();
}

async function log(db: SupabaseClient, kind: AlertKind, channel: "email" | "sms", propertyId: string | null, ok: boolean, detail?: string) {
  await db.from("alert_log").insert({ kind, channel, property_id: propertyId, ok, detail: detail?.slice(0, 500) ?? null });
}

async function sendEmail(subject: string, text: string): Promise<{ ok: boolean; detail?: string } | null> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.KEN_ALERT_EMAIL;
  if (!key || !to) return null;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ALERTS_FROM_EMAIL || "28Homes <onboarding@resend.dev>",
      to: [to],
      subject,
      text,
    }),
    signal: AbortSignal.timeout(8000),
  }).catch((e: unknown) => ({ ok: false, status: 0, text: async () => String(e) }) as const);
  if (res.ok) return { ok: true };
  return { ok: false, detail: `email ${res.status}: ${(await res.text()).slice(0, 200)}` };
}

async function sendSms(message: string): Promise<{ ok: boolean; detail?: string } | null> {
  const username = process.env.AT_USERNAME;
  const apiKey = process.env.AT_API_KEY;
  const to = process.env.KEN_ALERT_PHONE;
  if (!username || !apiKey || !to) return null;
  const host = username === "sandbox" ? "api.sandbox.africastalking.com" : "api.africastalking.com";
  const res = await fetch(`https://${host}/version1/messaging`, {
    method: "POST",
    headers: { apiKey, Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username, to, message: message.slice(0, 160) }),
    signal: AbortSignal.timeout(8000),
  }).catch((e: unknown) => ({ ok: false, status: 0, text: async () => String(e) }) as const);
  const body = await res.text();
  // Africa's Talking returns 201 with per-recipient status "Success" when accepted.
  if (res.ok && /"status"\s*:\s*"Success"/.test(body)) return { ok: true };
  return { ok: false, detail: `sms ${res.status}: ${body.slice(0, 200)}` };
}

/** Sends a lead or deal alert to Ken, respecting the cooldown and SMS cap. Never throws. */
export async function alertKen(db: SupabaseClient, input: AlertInput): Promise<AlertResult> {
  try {
    if (input.kind === "lead" && input.propertyId) {
      const since = new Date(Date.now() - LEAD_COOLDOWN_MS).toISOString();
      const { count } = await db
        .from("alert_log")
        .select("id", { count: "exact", head: true })
        .eq("property_id", input.propertyId)
        .eq("kind", "lead")
        .eq("ok", true)
        .gte("created_at", since);
      if ((count ?? 0) > 0) return { email: "skipped", sms: "skipped", reason: "cooldown" };
    }

    const result: AlertResult = { email: "skipped", sms: "skipped" };

    const email = await sendEmail(input.subject, input.text);
    if (email) {
      result.email = email.ok ? "sent" : "failed";
      await log(db, input.kind, "email", input.propertyId, email.ok, email.detail);
    }

    const cap = Number(process.env.SMS_DAILY_CAP) > 0 ? Number(process.env.SMS_DAILY_CAP) : DEFAULT_SMS_CAP;
    const { count: smsToday } = await db
      .from("alert_log")
      .select("id", { count: "exact", head: true })
      .eq("channel", "sms")
      .eq("ok", true)
      .gte("created_at", startOfTodayNairobiISO());
    if ((smsToday ?? 0) >= cap) {
      result.reason = "sms daily cap reached";
    } else {
      const sms = await sendSms(input.sms);
      if (sms) {
        result.sms = sms.ok ? "sent" : "failed";
        await log(db, input.kind, "sms", input.propertyId, sms.ok, sms.detail);
      }
    }
    return result;
  } catch (e) {
    console.error("alertKen failed:", e);
    return { email: "failed", sms: "failed", reason: "error" };
  }
}
