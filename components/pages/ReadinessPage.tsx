"use client";

import { useMemo, useState } from "react";
import { ConsoleShell } from "@/components/layout/ConsoleShell";
import { ResponseCard } from "@/components/ui/ResponseCard";
import { ProfileForm } from "@/components/ui/ProfileForm";
import { useUserProfile } from "@/hooks/useUserProfile";
import { parseJson } from "@/utils/api";
import type { AgentResult, ReadinessBreakdown, UserProfile } from "@/types";

export function ReadinessPage() {
  const { profile, setProfile, loading: profileLoading, isComplete } = useUserProfile();
  const [result, setResult] = useState<AgentResult<ReadinessBreakdown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readinessScore = useMemo(() => {
    if (result?.data.score !== undefined) {
      return result.data.score;
    }

    return profile?.readinessScore;
  }, [profile?.readinessScore, result]);

  function handleProfileSaved(nextProfile: UserProfile) {
    setProfile(nextProfile);
  }

  async function handleAnalyze() {
    if (!profile?.id || !profile?.name || !profile?.email || !profile?.location || !profile?.age) {
      setError("Complete the profile first so ElectOS can calculate a reliable readiness score.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextResult = await parseJson<AgentResult<ReadinessBreakdown>>(
        await fetch("/api/readiness", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: "Calculate my civic readiness using my saved profile and recommend next actions.",
            profile,
            history: [
              {
                role: "user",
                content: "Calculate my civic readiness using my saved profile and recommend next actions.",
              },
            ],
          }),
        }),
      );

      setResult(nextResult);
      setProfile((current) =>
        current
          ? {
              ...current,
              readinessScore: nextResult.data.score,
            }
          : current,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to calculate readiness.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ConsoleShell
      title="Readiness"
      subtitle="Turn your saved profile into a real readiness score, missing-step audit, and next action plan."
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[0.75fr_1.25fr]">
            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Live Readiness Score</p>
              <h2 className="mt-4 text-5xl font-bold text-primary-container sm:text-6xl">
                {typeof readinessScore === "number" ? `${readinessScore}%` : "--"}
              </h2>
              <p className="mt-4 text-sm leading-7 text-on-surface-variant">
                {isComplete
                  ? "Your profile is loaded and ready for a real AI readiness analysis."
                  : "Complete the profile on this page to unlock a profile-aware readiness result."}
              </p>
              <button
                type="button"
                onClick={() => void handleAnalyze()}
                disabled={loading || profileLoading}
                className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#002022] shadow-glow transition-all hover:scale-[1.01] disabled:opacity-60"
              >
                {loading ? "Analyzing readiness..." : "Run readiness analysis"}
              </button>
            </div>

            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <h3 className="text-2xl font-semibold text-on-surface">What ElectOS checks</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  "Registration confidence and missing confirmation steps",
                  "Location and election-planning completeness",
                  "Deadline awareness based on the profile context",
                  "Practical next actions to improve readiness quickly",
                ].map((item, index) => (
                  <div key={item} className="rounded-xl border border-white/8 bg-surface-container-lowest/50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-sm text-cyan-300">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <p className="text-sm leading-6 text-on-surface-variant">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {error ? <p className="text-sm text-error">{error}</p> : null}
          {result ? <ResponseCard result={result} /> : null}
        </section>

        <aside className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Profile Context</p>
            <h3 className="mt-2 text-2xl font-semibold text-on-surface">Saved citizen profile</h3>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant">
              ElectOS uses your profile to personalize readiness analysis instead of giving a generic score.
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            <ProfileForm initialProfile={profile} onSaved={handleProfileSaved} />
          </div>
        </aside>
      </div>
    </ConsoleShell>
  );
}
