// lib/contactEvents.ts
// Records one row in `contact_events` each time a visitor taps WhatsApp, Call or
// Copy number on a listing. This is how we count enquiries (the main traction number).
//
// The tap goes to /api/lead, which saves it and alerts Ken (email/SMS). If that route
// isn't available (e.g. server keys not set), we fall back to inserting directly so
// the count is never lost.
//
// Logged anonymously (visitor_user_id stays null): we only need the count per listing,
// and collecting less personal data keeps us in line with the Data Protection Act.

import { createClient } from "@/lib/supabase/client";
import { currentSource } from "@/lib/source";

export type ContactChannel = "whatsapp" | "call" | "copy_number";

function insertDirectly(propertyId: string, channel: ContactChannel): void {
  createClient()
    .from("contact_events")
    .insert({ property_id: propertyId, channel })
    .then(({ error }) => {
      if (error) console.warn("Could not log contact tap:", error.message);
    });
}

/** Fire-and-forget: a failed log must never stop someone contacting the lister. */
export function logContactTap(propertyId: string, channel: ContactChannel): void {
  fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ propertyId, channel, source: currentSource() }),
    keepalive: true, // survives the page opening WhatsApp or the dialer
  })
    .then((res) => {
      if (res.status === 503 || res.status >= 500) insertDirectly(propertyId, channel);
    })
    .catch(() => insertDirectly(propertyId, channel));
}
