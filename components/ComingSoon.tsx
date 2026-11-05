import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      <Navbar />
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-3">Coming soon</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        <p className="text-[#6b6358] text-lg mb-10">{description}</p>
        <Link
          href="/properties"
          className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-3 rounded-2xl transition-colors"
        >
          Browse properties
        </Link>
      </section>
      <footer className="bg-[#f7f5ef] py-10 border-t border-[#e6e2d8]">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-[#9c948a]">
          © 2026 Keja Yangu Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
