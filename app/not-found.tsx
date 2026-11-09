import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-[#1a2420] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-xl mx-auto px-6 py-24 text-center">
        <SearchX size={56} className="mx-auto text-emerald-600 mb-6" />
        <h1 className="text-3xl md:text-4xl font-bold mb-3">We couldn&apos;t find that page</h1>
        <p className="text-[#6b6358] text-lg mb-10">
          The listing may have been let, sold or removed, or the link may be mistyped.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/properties" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-2xl">
            Browse properties
          </Link>
          <Link href="/" className="border border-[#e6e2d8] hover:border-emerald-300 font-semibold px-8 py-3 rounded-2xl">
            Go home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
