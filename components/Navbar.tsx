"use client";

import Link from "next/link";
import { Home as HomeIcon, PlusCircle, Search, List } from "lucide-react";
import AuthButtons from "./AuthButtons";

export default function Navbar() {
  return (
    <nav className="bg-[#0a1410] border-b border-[#2a3d35] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-3xl">K</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Keja Yangu</h1>
        </div>

        <div className="flex items-center gap-9 text-lg">
          <Link href="/" className="hover:text-emerald-400 transition flex items-center gap-2">
            <HomeIcon size={20} /> Home
          </Link>
          <Link href="/properties" className="hover:text-emerald-400 transition flex items-center gap-2">
            <Search size={20} /> Browse
          </Link>
          <Link href="/add" className="hover:text-emerald-400 transition flex items-center gap-2">
            <PlusCircle size={20} /> List Property
          </Link>
          <Link href="/my-listings" className="hover:text-emerald-400 transition flex items-center gap-2">
            <List size={20} /> My Listings
          </Link>
        </div>

        <AuthButtons />
      </div>
    </nav>
  );
}































































