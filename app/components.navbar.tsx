"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import AuthButtons from "@/components/AuthButtons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/properties?type=sale", label: "Buy" },
    { href: "/properties?type=rent", label: "Rent" },
    { href: "/add", label: "Sell" },
    { href: "/my-listings", label: "My Listings" },
    { href: "#", label: "Get Help" },
  ];

  return (
    <nav className="bg-[#0a1410] border-b border-[#2a3d35] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-2xl">
              🏠
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#f1ede6]">Keja Yangu</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-base text-[#d8cfc2]">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-emerald-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side - Auth + Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <AuthButtons />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-[#f1ede6]"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0a1410] border-t border-[#2a3d35]">
          <div className="px-6 py-4 flex flex-col gap-4 text-base">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="py-2 hover:text-emerald-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-[#2a3d35]">
              <AuthButtons />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}