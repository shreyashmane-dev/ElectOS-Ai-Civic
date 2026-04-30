import { callGeminiJson } from "@/lib/ai/gemini";
import { promptTemplates, systemPrompts } from "@/lib/ai/prompts";
import { normalizeAgentResult, readinessResultSchema } from "@/lib/ai/resultSchemas";
import type { AgentResult, ReadinessBreakdown } from "@/types";

const fallback: AgentResult<ReadinessBreakdown> = {
  agent: "readiness",
  intent: "readiness",
  card: {
    title: "Civic Readiness",
    summary: "This is a baseline readiness estimate using limited profile data.",
    bullets: [
      "Registration status has the largest impact.",
      "Local planning improves participation readiness.",
      "Saving key deadlines reduces friction.",
    ],
    cta: "Complete your profile for a more precise readiness score.",
    confidence: 0.5,
    sources: [],
  },
  data: {
    score: 52,
    status: "medium",
    factors: [
      { label: "Registration", value: 20, explanation: "Registration is not fully confirmed." },
      { label: "Planning", value: 18, explanation: "Voting plan details are incomplete." },
      { label: "Awareness", value: 14, explanation: "Civic preference data is limited." },
    ],
    recommendations: [
      "Confirm registration status.",
      "Set a voting plan with date, location, or mail ballot timeline.",
      "Add policy interests to personalize reminders.",
    ],
  },
  followUp: ["Would you like a personalized action plan to raise your readiness score?"],
};

export async function readinessAgent(input: { query: string; context: string }) {
  const fallbackPayload = {
    card: fallback.card,
    data: fallback.data,
    followUp: fallback.followUp,
  } satisfies Omit<AgentResult<ReadinessBreakdown>, "agent" | "intent">;

  const rawResult = await callGeminiJson<Omit<AgentResult<ReadinessBreakdown>, "agent" | "intent">>({
    systemInstruction: systemPrompts.readiness,
    prompt: promptTemplates.readiness(input.query, input.context),
    schemaName: "ReadinessBreakdown",
    fallback: fallbackPayload,
  });

  const result = normalizeAgentResult(rawResult, readinessResultSchema, fallbackPayload);

  return {
    agent: "readiness",
    intent: "readiness",
    ...result,
  } satisfies AgentResult<ReadinessBreakdown>;
}
