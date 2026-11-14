// lib/contactEvents.ts
// Records one row in `contact_events` each time a visitor taps WhatsApp, Call or
// Copy number on a listing. This is how we count enquiries (the main traction number).
//
// Logged anonymously (visitor_user_id stays null): we only need the count per listing,
// and collecting less personal data keeps us in line with the Data Protection Act.
// RLS allows anyone to insert; only the listing's owner can read its rows.

import { createClient } from "@/lib/supabase/client";

export type ContactChannel = "whatsapp" | "call" | "copy_number";

/** Fire-and-forget: a failed log must never stop someone contacting the lister. */
export function logContactTap(propertyId: string, channel: ContactChannel): void {
  createClient()
    .from("contact_events")
    .insert({ property_id: propertyId, channel })
    .then(({ error }) => {
      if (error) console.warn("Could not log contact tap:", error.message);
    });
}
