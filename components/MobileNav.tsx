"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusSquare, List, User } from "lucide-react";

const TABS = [
  { label: "Home",     href: "/",            icon: Home       },
  { label: "Search",   href: "/properties",  icon: Search     },
  { label: "Post",     href: "/add",         icon: PlusSquare },
  { label: "Listings", href: "/my-listings", icon: List       },
  { label: "Profile",  href: "/profile",     icon: User       },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e6e2d8]">
      <div className="flex items-stretch">
        {TABS.map(({ label, href, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors relative ${isActive ? "text-emerald-600" : "text-[#9c948a] hover:text-[#1a2420]"}`}
            >
              {isActive && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-600 rounded-full" />}
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`text-[10px] font-medium leading-none ${isActive ? "text-emerald-600" : "text-[#9c948a]"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}