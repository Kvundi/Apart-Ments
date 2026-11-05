// lib/dummyContacts.ts
// Placeholder owners for listings that don't have contact details yet.
//
// They only appear when placeholderContactsEnabled() is true:
//   - SHOW_PLACEHOLDER_CONTACTS=true|false in the environment wins, otherwise
//   - on in development (`npm run dev`), OFF in production builds.
// So a production deploy never shows fake numbers unless you opt in.
// Delete this file once every listing has a real contact_name and contact_phone.
//
// Numbers use the +254 700 000 0XX pattern so they're obviously fake.

const DUMMY_CONTACTS = [
  { name: "Jane Wanjiku",    phone: "+254700000001" },
  { name: "Brian Otieno",    phone: "+254700000002" },
  { name: "Grace Muthoni",   phone: "+254700000003" },
  { name: "Kevin Kiprotich", phone: "+254700000004" },
  { name: "Faith Achieng",   phone: "+254700000005" },
  { name: "David Mwangi",    phone: "+254700000006" },
  { name: "Mercy Njeri",     phone: "+254700000007" },
  { name: "Samuel Kamau",    phone: "+254700000008" },
] as const;

export function placeholderContactsEnabled(): boolean {
  const flag = process.env.SHOW_PLACEHOLDER_CONTACTS;
  if (flag === "true") return true;
  if (flag === "false") return false;
  return process.env.NODE_ENV !== "production";
}

/** Picks the same placeholder contact for a given property every time. */
export function getDummyContact(propertyId: string) {
  let hash = 0;
  for (const ch of propertyId) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return DUMMY_CONTACTS[hash % DUMMY_CONTACTS.length];
}
