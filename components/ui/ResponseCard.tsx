import { Card } from "@/components/ui/Card";
import type { AgentResult } from "@/types";

export function ResponseCard({ result }: { result: AgentResult<any> }) {
  const confidenceValue =
    typeof result.card.confidence === "number"
      ? result.card.confidence
      : Number(result.card.confidence ?? 0);

  const confidenceLabel = Number.isFinite(confidenceValue) ? confidenceValue.toFixed(2) : "0.00";

  return (
    <Card className="space-y-8 rounded-2xl p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-md border border-purple-400/20 bg-purple-500/12 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-purple-200">
              {result.intent} agent
            </span>
            <span className="text-xs text-on-surface-variant">Structured civic response</span>
          </div>
          <h3 className="font-display text-3xl font-semibold tracking-tight text-primary">{result.card.title}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-on-surface-variant">{result.card.summary}</p>
        </div>
        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
          Confidence {confidenceLabel}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {result.card.bullets.map((bullet, index) => (
          <div
            key={bullet}
            className="rounded-xl border border-white/8 bg-surface-container-lowest/50 p-5 transition-colors hover:bg-surface-container-lowest/70"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-sm text-cyan-300">
                {String(index + 1).padStart(2, "0")}
              </div>
              <p className="text-sm leading-7 text-on-surface-variant">{bullet}</p>
            </div>
          </div>
        ))}
      </div>

      {result.card.sources?.length ? (
        <div className="flex flex-wrap gap-2 border-t border-white/5 pt-4">
          {result.card.sources.map((source) => (
            <span
              key={source}
              className="rounded-md border border-white/10 bg-surface-container-low px-3 py-1 text-xs text-on-surface"
            >
              {source}
            </span>
          ))}
        </div>
      ) : null}

      {result.followUp?.length ? (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Suggested follow-up</p>
          <div className="flex flex-wrap gap-2">
            {result.followUp.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-surface-container-low/60 px-3 py-1 text-xs text-on-surface-variant"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </Card>
  );
}
