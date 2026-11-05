"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown, User } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const NAV_ITEMS = [
  {
    label: "Buy", href: "/properties?type=sale",
    dropdown: [
      { label: "Homes for sale",      href: "/properties?type=sale",       icon: "🏡", sub: "Search all properties on market" },
      { label: "New developments",    href: "/properties?type=new",        icon: "🏘️", sub: "Off-plan and newly built homes" },
      { label: "Land & plots",        href: "/properties?type=sale&property=Land", icon: "🌳", sub: "Titled land across all 47 counties" },
      { label: "Commercial property", href: "/properties?property=Commercial", icon: "🏢", sub: "Offices, retail, warehouses" },
    ],
  },
  {
    label: "Rent", href: "/properties?type=rent",
    dropdown: [
      { label: "Apartments & flats", href: "/properties?type=rent&property=Apartment", icon: "🛏️", sub: "Studio to 4+ bed units" },
      { label: "Houses to let",      href: "/properties?type=rent&property=House", icon: "🏠", sub: "Whole houses and maisonettes" },
      { label: "Furnished rentals",  href: "/properties?type=rent&amenity=Furnished", icon: "✨", sub: "Move in immediately" },
      { label: "Short-term stays",   href: "/properties?type=rent", icon: "📅", sub: "Weekly and monthly lets" },
    ],
  },
  {
    label: "Sell", href: "/add",
    dropdown: [
      { label: "Post a listing",  href: "/add",         icon: "📋", sub: "List your property for free" },
      { label: "Get a valuation", href: "/valuation",   icon: "💰", sub: "Free estimate from local agents" },
      { label: "Seller's guide",  href: "/guides/sell", icon: "📊", sub: "How to sell faster in Kenya" },
    ],
  },
  {
    label: "Home Loans", href: "#",
    dropdown: [
      { label: "Compare mortgage rates",  href: "/loans",            icon: "🏦", sub: "KCB, Equity, Co-op Bank & more" },
      { label: "Mortgage calculator",     href: "/loans/calculator", icon: "🧮", sub: "Estimate monthly repayments" },
      { label: "Affordable Housing Fund", href: "/loans/government", icon: "📜", sub: "Government-backed schemes" },
    ],
  },
  { label: "Find an Agent",  href: "/agents"      },
  { label: "Manage Rentals", href: "/my-listings" },
];

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const [mobileOpen,           setMobileOpen]           = useState(false);
  const [openDropdown,         setOpenDropdown]         = useState<string | null>(null);
  const [openMobileAccordion,  setOpenMobileAccordion]  = useState<string | null>(null);

  const toggleDropdown        = (l: string) => setOpenDropdown(openDropdown === l ? null : l);
  const toggleMobileAccordion = (l: string) => setOpenMobileAccordion(openMobileAccordion === l ? null : l);

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-[#e6e2d8] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-xl shadow-md group-hover:bg-emerald-500 transition-colors">🏠</div>
            <span className="text-xl font-bold tracking-tight text-[#1a2420]">Keja Yangu</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-stretch h-full">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative flex items-stretch">
                {item.dropdown ? (
                  <>
                    <button onClick={() => toggleDropdown(item.label)} className="flex items-center gap-1 px-4 text-sm font-medium text-[#1a2420] hover:text-emerald-600 border-b-2 border-transparent hover:border-emerald-600 transition-all">
                      {item.label}
                      <ChevronDown size={14} className={`transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`} />
                    </button>
                    {openDropdown === item.label && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                        <div className="absolute top-full left-0 z-20 w-72 bg-white border border-[#e6e2d8] rounded-b-xl shadow-xl py-2">
                          {item.dropdown.map((d) => (
                            <Link key={d.label} href={d.href} onClick={() => setOpenDropdown(null)} className="flex items-start gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors">
                              <span className="text-xl w-8 text-center flex-shrink-0">{d.icon}</span>
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
                  <Link href={item.href} className="flex items-center px-4 text-sm font-medium text-[#1a2420] hover:text-emerald-600 border-b-2 border-transparent hover:border-emerald-600 transition-all">
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {isSignedIn ? (
              <>
                <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#f7f5ef] transition-colors">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt={user.firstName || "Profile"} className="w-8 h-8 rounded-full object-cover border-2 border-[#e6e2d8]" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"><User size={16} className="text-emerald-600" /></div>
                  )}
                  <span className="text-sm font-medium text-[#1a2420]">{user?.firstName || "Profile"}</span>
                </Link>
                <Link href="/add" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors">Post a listing</Link>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="px-4 py-2 text-sm font-medium text-[#1a2420] hover:text-emerald-600 rounded-lg hover:bg-[#f7f5ef]">Sign in</Link>
                <Link href="/sign-up" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors">Sign up</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-[#f7f5ef]" aria-label="Toggle menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#e6e2d8] overflow-y-auto max-h-[80vh]">
          {isSignedIn && (
            <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-6 py-4 border-b border-[#e6e2d8] bg-[#f7f5ef]">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt={user.firstName || ""} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center"><User size={18} className="text-emerald-600" /></div>
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
                  <button onClick={() => toggleMobileAccordion(item.label)} className="w-full flex items-center justify-between px-6 py-4 text-base font-semibold text-[#1a2420]">
                    {item.label}
                    <ChevronDown size={16} className={`text-[#6b6358] transition-transform ${openMobileAccordion === item.label ? "rotate-180" : ""}`} />
                  </button>
                  {openMobileAccordion === item.label && (
                    <div className="bg-[#f7f5ef] pb-2">
                      {item.dropdown.map((d) => (
                        <Link key={d.label} href={d.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-8 py-3 text-sm text-[#1a2420] hover:text-emerald-600">
                          <span>{d.icon}</span>{d.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.href} onClick={() => setMobileOpen(false)} className="block px-6 py-4 text-base font-semibold text-[#1a2420] hover:text-emerald-600">{item.label}</Link>
              )}
            </div>
          ))}

          <div className="px-6 py-4 flex flex-col gap-3">
            {isSignedIn ? (
              <Link href="/add" onClick={() => setMobileOpen(false)} className="py-3 text-center bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold">Post a listing</Link>
            ) : (
              <>
                <Link href="/sign-in" onClick={() => setMobileOpen(false)} className="py-3 text-center border border-[#e6e2d8] rounded-xl text-[#1a2420] font-medium">Sign in</Link>
                <Link href="/sign-up" onClick={() => setMobileOpen(false)} className="py-3 text-center bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}