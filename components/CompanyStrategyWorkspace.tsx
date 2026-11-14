"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import { ArrowUp, Check, Compass, Lightbulb, RotateCcw, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const STARTERS = [
  "What should be our most important goal for the next 90 days?",
  "Help me identify our biggest business bottleneck.",
  "Design a low-cost experiment to attract more property listings.",
];

export default function CompanyStrategyWorkspace() {
  const { isLoaded, isSignedIn } = useUser();
  const [companyContext, setCompanyContext] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (event?: FormEvent<HTMLFormElement>, suggestedPrompt?: string) => {
    event?.preventDefault();
    const content = (suggestedPrompt ?? input).trim();
    if (!content || loading || content.length > 2_000) return;

    const nextMessages = [...messages, { role: "user" as const, content }].slice(-10);
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/company-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, companyContext }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        const message = isRecord(result) && typeof result.error === "string"
          ? result.error
          : "The strategy assistant could not complete that request.";
        throw new Error(message);
      }
      const answer = isRecord(result) ? result.answer : null;
      if (typeof answer !== "string" || !answer.trim()) {
        throw new Error("The strategy assistant returned an invalid response.");
      }
      setMessages((current) => [...current, { role: "assistant" as const, content: answer }].slice(-10));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetConversation = () => {
    setMessages([]);
    setError(null);
  };

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>;
  }
  if (!isSignedIn) return <RedirectToSignIn />;

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#1a2420]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700 mb-3">
              <Compass size={17} /> PRIVATE COMPANY WORKSPACE
            </p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Company Strategy Partner</h1>
            <p className="text-[#6b6358] mt-3 max-w-2xl leading-relaxed">
              Think clearly about what to build next, test ideas quickly, and turn priorities into measurable plans for Apart Ments.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 self-start md:self-auto rounded-full bg-white border border-[#e6e2d8] px-4 py-2 text-sm font-medium">
            <Check size={16} className="text-emerald-700" /> You review every draft
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
          <section className="bg-white border border-[#e6e2d8] rounded-3xl overflow-hidden">
            <div className="flex items-center justify-between gap-3 p-5 md:px-7 border-b border-[#e6e2d8]">
              <div>
                <h2 className="font-bold text-lg">Strategy conversation</h2>
                <p className="text-xs text-[#6b6358] mt-1">First principles · measurable goals · fast experiments</p>
              </div>
              {messages.length > 0 && (
                <button type="button" onClick={resetConversation} className="inline-flex items-center gap-1.5 text-sm text-[#6b6358] hover:text-emerald-700">
                  <RotateCcw size={15} /> New chat
                </button>
              )}
            </div>

            <div className="min-h-[320px] max-h-[58vh] overflow-y-auto p-5 md:p-7 space-y-5" aria-live="polite">
              {messages.length === 0 ? (
                <div className="py-4">
                  <span className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4"><Lightbulb size={22} /></span>
                  <h3 className="text-xl font-bold mb-2">Start with the real problem.</h3>
                  <p className="text-sm text-[#6b6358] max-w-lg leading-relaxed">
                    Share a decision or a challenge. You’ll get direct reasoning, clear assumptions, and practical next steps—not decisions made for you.
                  </p>
                  <div className="grid gap-2 mt-6">
                    {STARTERS.map((prompt) => (
                      <button key={prompt} type="button" onClick={() => void sendMessage(undefined, prompt)} disabled={loading}
                        className="text-left border border-[#e6e2d8] hover:border-emerald-300 hover:bg-emerald-50/50 rounded-xl px-4 py-3 text-sm transition-colors disabled:opacity-50">
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={`${index}-${message.role}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${message.role === "user" ? "bg-[#0c2a20] text-white" : "bg-[#f7f5ef] text-[#1a2420]"}`}>
                      {message.content}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex items-center gap-2 text-sm text-[#6b6358]" role="status">
                  <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  Thinking through the problem…
                </div>
              )}
              {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            </div>

            <form onSubmit={(event) => void sendMessage(event)} className="border-t border-[#e6e2d8] p-4 md:p-5">
              <label htmlFor="strategy-prompt" className="sr-only">Ask a business strategy question</label>
              <div className="flex items-end gap-3 rounded-2xl border border-[#e6e2d8] p-2 focus-within:border-emerald-400">
                <textarea id="strategy-prompt" value={input} onChange={(event) => setInput(event.target.value)} maxLength={2_000} rows={2}
                  placeholder="What decision or challenge are you working through?" disabled={loading}
                  className="flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-[#9c948a] disabled:opacity-60" />
                <button type="submit" disabled={loading || !input.trim() || input.length > 2_000}
                  className="w-10 h-10 shrink-0 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:bg-[#e6e2d8] text-white flex items-center justify-center transition-colors" aria-label="Send message">
                  <ArrowUp size={19} />
                </button>
              </div>
              <p className="text-[11px] text-[#9c948a] mt-2 px-1">Up to 2,000 characters per message. This conversation isn’t saved in your account.</p>
            </form>
          </section>

          <aside className="space-y-5">
            <section className="bg-white border border-[#e6e2d8] rounded-3xl p-5">
              <label htmlFor="company-context" className="flex items-center gap-2 font-bold mb-2"><Target size={18} className="text-emerald-700" /> Company context</label>
              <p className="text-xs text-[#6b6358] leading-relaxed mb-4">
                Add your current goal, constraints, or business numbers so recommendations fit your situation.
              </p>
              <textarea id="company-context" value={companyContext} onChange={(event) => setCompanyContext(event.target.value)} maxLength={2_000} rows={7}
                placeholder={"Example:\n• 90-day goal: ...\n• Current challenge: ...\n• Budget/team constraints: ...\n• What we have tried: ..."}
                className="w-full rounded-xl border border-[#e6e2d8] p-3 text-sm leading-relaxed outline-none focus:border-emerald-400 resize-y" />
              <p className="text-[11px] text-[#9c948a] mt-2">{companyContext.length}/2,000 characters · Not saved between visits</p>
            </section>

            <section className="rounded-3xl bg-[#10201a] text-white p-5">
              <h2 className="font-bold mb-3">How it works</h2>
              <ul className="space-y-3 text-sm text-white/75 leading-relaxed">
                <li>Start from customer needs and first principles.</li>
                <li>Separate evidence from assumptions; never invent metrics.</li>
                <li>Keep plans focused, testable, and measurable.</li>
                <li>Drafts only—nothing is sent, published, or changed for you.</li>
              </ul>
            </section>

            <p className="text-xs text-[#6b6358] leading-relaxed px-1">
              Responses use OpenAI and are for planning support, not legal, tax, or investment advice. Prompts are processed by OpenAI; don’t include customer personal data, credentials, or confidential information.
              Set <code className="rounded bg-white px-1 py-0.5">COMPANY_AGENT_USER_ID</code> and <code className="rounded bg-white px-1 py-0.5">OPENAI_API_KEY</code> on the server to enable access.
            </p>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
