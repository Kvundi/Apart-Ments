// app/api/alerts/route.ts
// Saved-search alerts: emails each user the new listings that match their saved searches.
//
// Called once a day by Vercel Cron (see vercel.json), which sends
// `Authorization: Bearer $CRON_SECRET`. You can also trigger it by hand:
//   curl -H "Authorization: Bearer $CRON_SECRET" "https://<site>/api/alerts?dry=1"
// `?dry=1` reports what would be sent without emailing or updating anything.
//
// Required environment variables (server-only — never prefix with NEXT_PUBLIC_):
//   CRON_SECRET                 any long random string
//   SUPABASE_SERVICE_ROLE_KEY   Supabase → Project Settings → API → service_role (bypasses RLS)
//   RESEND_API_KEY              https://resend.com → API Keys
//   ALERTS_FROM_EMAIL           e.g. "Keja Yangu <alerts@your-domain.co.ke>" (domain verified in Resend)
//   NEXT_PUBLIC_SITE_URL        e.g. "https://kejayangu.co.ke" (used for links in the email)

import { createClient } from "@supabase/supabase-js";
import { parseFilters, buildPropertyQuery } from "@/lib/propertySearch";
import { toCardData, type PropertyCardData } from "@/lib/listing";

const HOUR = 60 * 60 * 1000;
const DUE_AFTER: Record<string, number> = {
  instant: 1 * HOUR, // treated like hourly if you schedule the cron more often
  daily: 23 * HOUR,
  weekly: 7 * 24 * HOUR - HOUR,
};
const MAX_SEARCHES_PER_RUN = 500;
const MAX_LISTINGS_PER_EMAIL = 10;

type SavedSearchRow = {
  id: string;
  user_id: string;
  email: string | null;
  label: string;
  query: string;
  frequency: string;
  last_checked_at: string;
};

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return Response.json({ error: "CRON_SECRET is not set" }, { status: 500 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dry = new URL(request.url).searchParams.get("dry") === "1";
  const missing = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "NEXT_PUBLIC_SITE_URL"]
    .concat(dry ? [] : ["RESEND_API_KEY", "ALERTS_FROM_EMAIL"])
    .filter((k) => !process.env[k]);
  if (missing.length) return Response.json({ error: `Missing env: ${missing.join(", ")}` }, { status: 500 });

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
  const site = process.env.NEXT_PUBLIC_SITE_URL!.replace(/\/$/, "");
  const runStartedAt = new Date();

  const { data: searches, error } = await supabase
    .from("saved_searches")
    .select("id, user_id, email, label, query, frequency, last_checked_at")
    .neq("frequency", "off")
    .order("last_checked_at", { ascending: true })
    .limit(MAX_SEARCHES_PER_RUN);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const summary = { checked: 0, emailed: 0, skippedNotDue: 0, noNewListings: 0, failed: 0, dry, preview: [] as unknown[] };

  for (const s of (searches ?? []) as SavedSearchRow[]) {
    const dueAfter = DUE_AFTER[s.frequency] ?? DUE_AFTER.daily;
    if (runStartedAt.getTime() - new Date(s.last_checked_at).getTime() < dueAfter) {
      summary.skippedNotDue++;
      continue;
    }
    summary.checked++;

    const filters = { ...parseFilters(s.query), sort: "newest" as const };
    const { data: rows, error: qErr } = await buildPropertyQuery(supabase, filters, {
      since: s.last_checked_at,
      limit: MAX_LISTINGS_PER_EMAIL,
    });
    if (qErr) {
      summary.failed++;
      continue;
    }
    const listings = (rows ?? []).map((r) => toCardData(r));

    if (dry) {
      summary.preview.push({ search: s.label, email: s.email, newListings: listings.map((l) => l.title) });
      continue;
    }

    let sent = false;
    if (listings.length && s.email) {
      sent = await sendAlertEmail({ to: s.email, search: s, listings, site });
      if (!sent) {
        summary.failed++;
        continue; // leave last_checked_at alone so these listings are retried next run
      }
      summary.emailed++;
    } else {
      summary.noNewListings++;
    }

    await supabase
      .from("saved_searches")
      .update({
        last_checked_at: runStartedAt.toISOString(),
        ...(sent ? { last_notified_at: runStartedAt.toISOString() } : {}),
      })
      .eq("id", s.id);
  }

  return Response.json(summary);
}

async function sendAlertEmail({ to, search, listings, site }: {
  to: string; search: SavedSearchRow; listings: PropertyCardData[]; site: string;
}): Promise<boolean> {
  const searchUrl = `${site}/properties${search.query ? `?${search.query}` : ""}`;
  const manageUrl = `${site}/saved?tab=searches`;
  const n = listings.length;
  const subject = `${n} new home${n === 1 ? "" : "s"} for "${search.label}"`;

  const rows = listings.map((l) => {
    const price = `KSh ${l.price.toLocaleString("en-KE")}${l.listing_type === "Rent" ? " /mo" : ""}`;
    const facts = [
      l.bedrooms !== null ? (l.bedrooms === 0 ? "Studio" : `${l.bedrooms} bd`) : null,
      l.bathrooms !== null ? `${l.bathrooms} ba` : null,
      l.property_type,
    ].filter(Boolean).join(" · ");
    const img = l.images[0]
      ? `<img src="${esc(l.images[0])}" alt="" width="160" height="110" style="display:block;width:160px;height:110px;object-fit:cover;border-radius:8px" />`
      : "";
    return `
      <tr><td style="padding:12px 0;border-bottom:1px solid #e6e2d8">
        <a href="${site}/properties/${esc(l.id)}" style="text-decoration:none;color:#1a2420">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:12px;vertical-align:top">${img}</td>
            <td style="vertical-align:top;font-family:Arial,sans-serif">
              <div style="font-size:18px;font-weight:bold;color:#059669">${esc(price)}</div>
              <div style="font-size:13px;color:#6b6358;margin-top:2px">${esc(facts)}</div>
              <div style="font-size:14px;margin-top:6px">${esc(l.title)}</div>
              <div style="font-size:13px;color:#6b6358;margin-top:2px">${esc(l.location)}</div>
            </td>
          </tr></table>
        </a>
      </td></tr>`;
  }).join("");

  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#1a2420">
      <h1 style="font-size:22px">New homes for your search</h1>
      <p style="color:#6b6358">${esc(search.label)}</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
      <p style="margin-top:20px"><a href="${esc(searchUrl)}" style="background:#059669;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:bold">See all matches</a></p>
      <p style="font-size:12px;color:#9c948a;margin-top:28px">
        Never pay a viewing fee or deposit before you have seen a property in person.<br/>
        <a href="${esc(manageUrl)}" style="color:#9c948a">Change how often you get these emails, or turn them off</a>.
      </p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.ALERTS_FROM_EMAIL,
        to: [to],
        subject,
        html,
        headers: { "List-Unsubscribe": `<${manageUrl}>` },
      }),
    });
    if (!res.ok) console.error("Resend error", res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error("Resend request failed", e);
    return false;
  }
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
