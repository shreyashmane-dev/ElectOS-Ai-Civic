"use client";

import { useState } from "react";
import { ConsoleShell } from "@/components/layout/ConsoleShell";
import { ResponseCard } from "@/components/ui/ResponseCard";
import { useUserProfile } from "@/hooks/useUserProfile";
import { parseJson } from "@/utils/api";
import type { AgentResult, ChatMessage, ScenarioAnalysis } from "@/types";

const presets = [
  "What if my name is missing from the voter roll when I arrive?",
  "What if I moved right before Election Day?",
  "What if my mail ballot never arrives?",
  "What if my ID still shows my old address?",
];

export function ScenarioPage() {
  const { profile } = useUserProfile();
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [result, setResult] = useState<AgentResult<ScenarioAnalysis> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runScenario(text: string) {
    if (!text.trim()) {
      return;
    }

    const nextHistory: ChatMessage[] = [
      ...history,
      {
        role: "user",
        content: text.trim(),
        timestamp: new Date().toISOString(),
      },
    ];

    setHistory(nextHistory);
    setLoading(true);
    setError(null);
    setQuery("");

    try {
      const nextResult = await parseJson<AgentResult<ScenarioAnalysis>>(
        await fetch("/api/scenario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: text.trim(),
            history: nextHistory,
            profile,
          }),
        }),
      );

      setResult(nextResult);
      setHistory((current) => [
        ...current,
        {
          role: "assistant",
          content: nextResult.card.summary,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to analyze the scenario.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ConsoleShell
      title="Scenario Navigator"
      subtitle="Run real what-if checks with your profile and recent conversation context included."
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-semibold text-on-surface">Describe your scenario</h3>
              <p className="text-sm leading-7 text-on-surface-variant">
                ElectOS will map the likely impact, next actions, and local-rule caveats.
              </p>
              <textarea
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                rows={5}
                placeholder="Example: I moved counties 10 days before Election Day and my registration still shows my old address."
                className="w-full resize-none rounded-2xl border border-outline-variant/30 bg-surface-container-low/40 p-5 text-on-surface outline-none transition-colors focus:border-primary"
              />
              <button
                type="button"
                onClick={() => void runScenario(query)}
                disabled={loading}
                className="w-full rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#002022] shadow-glow transition-all hover:scale-[1.01] disabled:opacity-60 sm:w-fit"
              >
                {loading ? "Mapping scenario..." : "Analyze scenario"}
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {presets.map((scenario) => (
              <button
                key={scenario}
                type="button"
                onClick={() => void runScenario(scenario)}
                className="glass-panel rounded-2xl p-6 text-left transition-colors hover:bg-surface-container-low/40"
              >
                <h4 className="text-xl font-semibold text-on-surface">{scenario}</h4>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                  Generate a concrete action path, fallback steps, and risk notes.
                </p>
              </button>
            ))}
          </div>

          {error ? <p className="text-sm text-error">{error}</p> : null}
          {result ? <ResponseCard result={result} /> : null}
        </section>

        <aside className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Context Used</p>
            <h3 className="mt-2 text-2xl font-semibold text-on-surface">Profile and memory</h3>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant">
              This tool includes your saved profile plus recent scenario history so follow-up questions build on prior answers.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-on-surface-variant">Recent thread</h4>
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
                  No scenario history yet. Run a scenario and the assistant will keep the thread in context.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </ConsoleShell>
  );
}
