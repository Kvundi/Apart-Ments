"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function TestSupabase() {
  const [status, setStatus] = useState("Testing connection to Supabase...");
  const [error, setError] = useState("");

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from("properties")
          .select("count")
          .limit(1);

        if (error) {
          setError(error.message);
          setStatus("❌ Connection Failed");
        } else {
          setStatus("✅ Supabase Connected Successfully!");
        }
      } catch (err: any) {
        setError(err.message);
        setStatus("❌ Connection Error");
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-emerald-700">
          Keja Yangu
        </h1>
        
        <div className="text-center">
          <div className="text-xl font-medium p-6 rounded-2xl border">
            {status}
          </div>

          {error && (
            <div className="mt-6 text-red-600 text-sm bg-red-50 p-4 rounded-2xl">
              Error: {error}
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-10">
          If you see the green "✅ Supabase Connected Successfully!", we can continue building.
        </p>
      </div>
    </div>
  );
}