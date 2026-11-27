// lib/contact.ts
// Where client enquiries go. All listing contact buttons route to 28Homes' own number
// (SITE.contactPhone), never to the lister, so 28Homes sees every lead.

import { SITE } from "@/lib/site";
import { toE164, toWhatsAppNumber } from "@/lib/phone";

export type RoutedContact = { phone: string; whatsapp: string; name: string } | null;

/** 28Homes' contact numbers, or null if NEXT_PUBLIC_CONTACT_PHONE isn't set. */
export function companyContact(): RoutedContact {
  const phone = toE164(SITE.contactPhone);
  const whatsapp = toE164(SITE.contactWhatsApp) ?? phone;
  if (!phone || !whatsapp) return null;
  return { phone, whatsapp, name: SITE.name };
}

/** wa.me link to 28Homes with a pre-filled message that identifies the listing. */
export function whatsappLink(whatsappE164: string, message: string): string {
  return `https://wa.me/${toWhatsAppNumber(whatsappE164)}?text=${encodeURIComponent(message)}`;
}

/** Short reference shown in messages so Ken knows which listing a client means. */
export function listingRef(id: string): string {
  return id.slice(0, 8).toUpperCase();
}
