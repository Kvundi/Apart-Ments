import { Heart, BellRing, PlusCircle, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";

/** Two-column frame around Clerk's sign-in / sign-up widgets. */
export default function AuthShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#1a2420]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <section className="hidden lg:block">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{title}</h1>
          <p className="text-lg text-[#5c554a] mb-8 max-w-md">One free account for everything you do on Apart Ments.</p>
          <ul className="space-y-5">
            {[
              { icon: Heart, t: "Save homes on every device", d: "Your hearts follow you from phone to laptop." },
              { icon: BellRing, t: "Get alerts for new listings", d: "Save a search and we'll email you new matches." },
              { icon: PlusCircle, t: "List your property free", d: "Post, edit and track your listings in one place." },
              { icon: ShieldCheck, t: "No spam, no viewing fees", d: "We never sell your data or charge you to view." },
            ].map((x) => (
              <li key={x.t} className="flex gap-4">
                <span className="w-11 h-11 rounded-xl bg-white border border-[#e6e2d8] text-emerald-700 flex items-center justify-center shrink-0"><x.icon size={20} /></span>
                <span>
                  <span className="block font-semibold">{x.t}</span>
                  <span className="block text-sm text-[#6b6358]">{x.d}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className="flex justify-center">{children}</section>
      </main>
    </div>
  );
}
