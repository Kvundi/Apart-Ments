// lib/site.ts — single source of truth for site-wide names, URLs and navigation.

export const SITE = {
  name: "28Homes",
  tagline: "Find your home in Kenya",
  description:
    "Search verified homes, apartments and land for sale and rent across Kenya. Message 28Homes on WhatsApp and we connect you with the owner or agent — no viewing fees.",
  /** Public URL, used for canonical links, sitemaps, share previews and emails. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_KE",
  /**
   * Support inbox shown on Contact / Privacy pages. Leave empty until you have
   * one — pages then hide the email line instead of showing a placeholder.
   */
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "",
  /**
   * 28Homes' own phone/WhatsApp number (E.164, e.g. +2547XXXXXXXX). Every "Call" and
   * "WhatsApp" button on the site goes here, not to the lister: clients reach 28Homes
   * first and Ken connects them to the lister, so every lead is ours.
   */
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
  /** Launch offer: this many listings are free (homepage counter). */
  freeListingLimit: 100,
  /** Optional separate WhatsApp number; defaults to contactPhone. */
  contactWhatsApp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
};

export const FOOTER_LINKS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Buy",
    links: [
      { label: "Homes for sale", href: "/properties?type=sale" },
      { label: "Land & plots", href: "/properties?type=sale&property=Land" },
      { label: "Buyer's guide", href: "/guides/buy" },
      { label: "Mortgage calculator", href: "/loans/calculator" },
    ],
  },
  {
    heading: "Rent",
    links: [
      { label: "Homes for rent", href: "/properties?type=rent" },
      { label: "Furnished rentals", href: "/properties?type=rent&amenity=Furnished" },
      { label: "Renter safety guide", href: "/guides/rent" },
      { label: "Rent estimates", href: "/valuation?type=rent" },
    ],
  },
  {
    heading: "Sell & list",
    links: [
      { label: "Post a listing", href: "/add" },
      { label: "Home value estimate", href: "/valuation" },
      { label: "Commission calculator", href: "/commission" },
      { label: "Seller's guide", href: "/guides/sell" },
      { label: "Find an agent", href: "/agents" },
    ],
  },
  {
    heading: "28Homes",
    links: [
      { label: "Home loans", href: "/loans" },
      { label: "Affordable housing", href: "/loans/government" },
      { label: "Terms of use", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
    ],
  },
];
