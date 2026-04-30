"use client";

import { useState } from "react";
import { ConsoleShell } from "@/components/layout/ConsoleShell";
import { ResponseCard } from "@/components/ui/ResponseCard";
import { useUserProfile } from "@/hooks/useUserProfile";
import { parseJson } from "@/utils/api";
import type { AgentResult, ChatMessage, MisinfoAssessment } from "@/types";

export function FactCheckerPage() {
  const { profile } = useUserProfile();
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AgentResult<MisinfoAssessment> | null>(null);

  async function handleAnalyze() {
    if (!query.trim()) {
      return;
    }

    const nextHistory = [
      ...history,
      {
        role: "user" as const,
        content: query.trim(),
        timestamp: new Date().toISOString(),
      },
    ];

    setLoading(true);
    setError(null);

    try {
      const nextResult = await parseJson<AgentResult<MisinfoAssessment>>(
        await fetch("/api/misinfo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: query.trim(),
            history: nextHistory,
            profile,
          }),
        }),
      );

      setHistory([
        ...nextHistory,
        {
          role: "assistant",
          content: nextResult.card.summary,
          timestamp: new Date().toISOString(),
        },
      ]);
      setResult(nextResult);
      setQuery("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to analyze the claim.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ConsoleShell
      title="Analyze Authenticity"
      subtitle="Paste a civic claim, URL, or message and let ElectOS produce a real evidence-oriented misinformation review."
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Fact Check Input</p>
                <h3 className="mt-2 text-2xl font-semibold text-on-surface">Run a claim review</h3>
              </div>
              <textarea
                className="min-h-40 w-full resize-none rounded-2xl border border-outline-variant/30 bg-surface-container-low/40 p-5 text-on-surface placeholder:text-outline-variant/50 outline-none transition-colors focus:border-primary"
                placeholder="Paste the claim, social post, message, or headline you want checked..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs italic text-on-surface-variant">
                  The AI uses your profile and recent claim history when it helps with local election context.
                </p>
                <button
                  type="button"
                  onClick={() => void handleAnalyze()}
                  disabled={loading}
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#002022] shadow-glow transition-all hover:scale-[1.01] disabled:opacity-60"
                >
                  {loading ? "Analyzing claim..." : "Analyze claim"}
                </button>
              </div>
            </div>
          </div>

          {error ? <p className="text-sm text-error">{error}</p> : null}
          {result ? <ResponseCard result={result} /> : null}
        </section>

        <aside className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">What It Checks</p>
            <div className="mt-4 space-y-4">
              {[
                "Whether the claim depends on a date, county, or voting method.",
                "What official verification steps still need to happen.",
                "Safer framing you can use before sharing uncertain information.",
              ].map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/8 bg-surface-container-lowest/50 p-4">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
                    Check {index + 1}
                  </span>
                  <p className="mt-2 text-sm leading-7 text-on-surface-variant">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-on-surface-variant">Recent claims</h4>
            <div className="mt-4 space-y-3">
              {history.length ? (
                history.slice(-6).map((message, index) => (
                  <div
                    key={`${message.role}-${index}-${message.timestamp ?? ""}`}
                    className="rounded-xl border border-white/8 bg-surface-container-lowest/50 p-4 text-sm leading-6 text-on-surface-variant"
                  >
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
                      {message.role}
                    </span>
                    {message.content}
                  </div>
                ))
              ) : (
                <p className="text-sm leading-7 text-on-surface-variant">
                  No claim history yet. ElectOS will keep the latest checks in memory during this session.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </ConsoleShell>
  );
}
