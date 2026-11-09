"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu, X, ChevronDown, User, Heart, Home, Trees, Building2, KeyRound, Sofa,
  ShieldCheck, PlusCircle, Calculator, BookOpen, Landmark, Percent, HandCoins, LayoutList,
  type LucideIcon,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useSavedHomes } from "@/lib/savedHomes";
import Logo from "@/components/Logo";

type DropItem = { label: string; href: string; icon: LucideIcon; sub: string };
type NavItem = { label: string; href: string; dropdown?: DropItem[] };

const NAV_ITEMS: NavItem[] = [
  {
    label: "Buy", href: "/properties?type=sale",
    dropdown: [
      { label: "Homes for sale",      href: "/properties?type=sale",                   icon: Home,      sub: "Houses, apartments and maisonettes" },
      { label: "Land & plots",        href: "/properties?type=sale&property=Land",     icon: Trees,     sub: "Plots and acreage across Kenya" },
      { label: "Commercial property", href: "/properties?property=Commercial",         icon: Building2, sub: "Offices, shops and warehouses" },
      { label: "Buyer's guide",       href: "/guides/buy",                             icon: BookOpen,  sub: "Title checks, costs and steps" },
    ],
  },
  {
    label: "Rent", href: "/properties?type=rent",
    dropdown: [
      { label: "Homes for rent",      href: "/properties?type=rent",                   icon: KeyRound,    sub: "Studios to family homes" },
      { label: "Furnished rentals",   href: "/properties?type=rent&amenity=Furnished", icon: Sofa,        sub: "Move in with your suitcase" },
      { label: "Renter safety guide", href: "/guides/rent",                            icon: ShieldCheck, sub: "Avoid viewing-fee scams" },
    ],
  },
  {
    label: "Sell", href: "/add",
    dropdown: [
      { label: "Post a listing",      href: "/add",         icon: PlusCircle, sub: "Free for owners and agents" },
      { label: "Home value estimate", href: "/valuation",   icon: HandCoins,  sub: "Based on comparable listings" },
      { label: "Seller's guide",      href: "/guides/sell", icon: BookOpen,   sub: "Documents, taxes and fees" },
    ],
  },
  {
    label: "Home Loans", href: "/loans",
    dropdown: [
      { label: "Mortgages in Kenya",  href: "/loans",            icon: Landmark,   sub: "How they work and who lends" },
      { label: "Mortgage calculator", href: "/loans/calculator", icon: Calculator, sub: "Repayments and affordability" },
      { label: "Affordable housing",  href: "/loans/government", icon: Percent,    sub: "Boma Yangu and KMRC loans" },
    ],
  },
  { label: "Find an Agent", href: "/agents" },
];

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();
  const savedCount = useSavedHomes().length;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);

  // Close menus on navigation and on Escape.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
    setOpenDropdown(null);
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpenDropdown(null); setMobileOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (item: NavItem) => {
    const base = item.href.split("?")[0];
    return base !== "/properties" && pathname.startsWith(base);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-[#e6e2d8] sticky top-0 z-[500]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop links */}
          <div className="hidden lg:flex items-stretch h-16">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative flex items-stretch">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      aria-expanded={openDropdown === item.label}
                      className={`flex items-center gap-1 px-4 text-sm font-medium hover:text-emerald-700 border-b-2 transition-colors ${isActive(item) ? "border-emerald-600 text-emerald-700" : "border-transparent text-[#1a2420]"}`}
                    >
                      {item.label}
                      <ChevronDown size={14} className={`transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`} />
                    </button>
                    {openDropdown === item.label && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                        <div className="absolute top-full left-0 z-20 w-80 bg-white border border-[#e6e2d8] rounded-2xl shadow-xl p-2 mt-1">
                          {item.dropdown.map((d) => (
                            <Link key={d.label} href={d.href} onClick={() => setOpenDropdown(null)} className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-emerald-50 transition-colors">
                              <span className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                                <d.icon size={18} />
                              </span>
                              <span>
                                <span className="block text-sm font-semibold text-[#1a2420]">{d.label}</span>
                                <span className="block text-xs text-[#6b6358] mt-0.5">{d.sub}</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <Link href={item.href} className={`flex items-center px-4 text-sm font-medium hover:text-emerald-700 border-b-2 transition-colors ${isActive(item) ? "border-emerald-600 text-emerald-700" : "border-transparent text-[#1a2420]"}`}>
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
            <Link href="/saved" aria-label="Saved homes" title="Saved homes" className="relative p-2.5 rounded-xl hover:bg-[#f7f5ef] transition-colors">
              <Heart size={20} className={savedCount > 0 ? "text-rose-500 fill-rose-500" : "text-[#1a2420]"} />
              {savedCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </Link>
            {isSignedIn ? (
              <>
                <Link href="/my-listings" className="px-3 py-2 text-sm font-medium text-[#1a2420] hover:text-emerald-700 rounded-xl hover:bg-[#f7f5ef]">
                  My listings
                </Link>
                <Link href="/profile" className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[#f7f5ef] transition-colors" aria-label="Your profile">
                  {user?.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- Clerk avatar URL
                    <img src={user.imageUrl} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-[#e6e2d8]" />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"><User size={16} className="text-emerald-700" /></span>
                  )}
                </Link>
              </>
            ) : (
              <Link href="/sign-in" className="px-4 py-2 text-sm font-medium text-[#1a2420] hover:text-emerald-700 rounded-xl hover:bg-[#f7f5ef]">Sign in</Link>
            )}
            <Link href="/add" className="ml-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors">
              Post a listing
            </Link>
          </div>

          {/* Mobile: saved + hamburger */}
          <div className="flex items-center gap-1 lg:hidden">
            <Link href="/saved" aria-label="Saved homes" className="relative p-2 rounded-lg hover:bg-[#f7f5ef]">
              <Heart size={22} className={savedCount > 0 ? "text-rose-500 fill-rose-500" : "text-[#1a2420]"} />
              {savedCount > 0 && (
                <span className="absolute top-0 right-0 min-w-[16px] h-[16px] px-1 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">{savedCount}</span>
              )}
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-[#f7f5ef]" aria-label="Toggle menu" aria-expanded={mobileOpen}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#e6e2d8] overflow-y-auto max-h-[80vh]">
          {isSignedIn && (
            <Link href="/profile" className="flex items-center gap-3 px-6 py-4 border-b border-[#e6e2d8] bg-[#f7f5ef]">
              {user?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- Clerk avatar URL
                <img src={user.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
              ) : (
                <span className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center"><User size={18} className="text-emerald-700" /></span>
              )}
              <div>
                <p className="text-sm font-semibold text-[#1a2420]">{user?.fullName || user?.firstName || "My Profile"}</p>
                <p className="text-xs text-[#6b6358]">View & edit profile →</p>
              </div>
            </Link>
          )}

          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="border-b border-[#e6e2d8]">
              {item.dropdown ? (
                <>
                  <button onClick={() => setOpenMobileAccordion(openMobileAccordion === item.label ? null : item.label)} className="w-full flex items-center justify-between px-6 py-4 text-base font-semibold text-[#1a2420]">
                    {item.label}
                    <ChevronDown size={16} className={`text-[#6b6358] transition-transform ${openMobileAccordion === item.label ? "rotate-180" : ""}`} />
                  </button>
                  {openMobileAccordion === item.label && (
                    <div className="bg-[#f7f5ef] pb-2">
                      {item.dropdown.map((d) => (
                        <Link key={d.label} href={d.href} className="flex items-center gap-3 px-8 py-3 text-sm text-[#1a2420] hover:text-emerald-700">
                          <d.icon size={16} className="text-emerald-700" />{d.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.href} className="block px-6 py-4 text-base font-semibold text-[#1a2420] hover:text-emerald-700">{item.label}</Link>
              )}
            </div>
          ))}

          <Link href="/saved" className="flex items-center gap-2 px-6 py-4 border-b border-[#e6e2d8] text-base font-semibold text-[#1a2420] hover:text-emerald-700">
            <Heart size={18} className="text-rose-500" /> Saved{savedCount > 0 ? ` (${savedCount})` : ""}
          </Link>
          {isSignedIn && (
            <Link href="/my-listings" className="flex items-center gap-2 px-6 py-4 border-b border-[#e6e2d8] text-base font-semibold text-[#1a2420] hover:text-emerald-700">
              <LayoutList size={18} className="text-emerald-700" /> My listings
            </Link>
          )}

          <div className="px-6 py-4 flex flex-col gap-3">
            <Link href="/add" className="py-3 text-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold">Post a listing</Link>
            {!isSignedIn && (
              <Link href="/sign-in" className="py-3 text-center border border-[#e6e2d8] rounded-xl text-[#1a2420] font-medium">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
