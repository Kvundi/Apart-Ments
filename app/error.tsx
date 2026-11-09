"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <AlertTriangle size={48} className="mx-auto text-amber-500 mb-5" />
        <h1 className="text-2xl md:text-3xl font-bold mb-3">Something went wrong</h1>
        <p className="text-[#6b6358] mb-8">
          This is on our side, not yours. Please try again — if it keeps happening, come back in a few minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-2xl">
            Try again
          </button>
          <Link href="/" className="border border-[#e6e2d8] hover:border-emerald-300 font-semibold px-8 py-3 rounded-2xl">
            Go home
          </Link>
        </div>
        {error.digest && <p className="text-xs text-[#9c948a] mt-6">Reference: {error.digest}</p>}
      </div>
    </div>
  );
}
