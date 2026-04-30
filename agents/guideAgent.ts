import { callGeminiJson } from "@/lib/ai/gemini";
import { promptTemplates, systemPrompts } from "@/lib/ai/prompts";
import { guideResultSchema, normalizeAgentResult } from "@/lib/ai/resultSchemas";
import type { AgentResult, GuideWalkthrough } from "@/types";

const fallback: AgentResult<GuideWalkthrough> = {
  agent: "guide",
  intent: "guide",
  card: {
    title: "Election Guidance",
    summary: "We could not generate tailored guidance, so here is a basic fallback.",
    bullets: [
      "Confirm your registration status.",
      "Review local deadlines and voting options.",
      "Bring required identification if applicable.",
    ],
    cta: "Check your state or local election office website.",
    confidence: 0.45,
    sources: [],
  },
  data: {
    steps: [
      "Check your voter registration.",
      "Review ballot options and deadlines.",
      "Make a plan for when and how to vote.",
    ],
    deadlineTips: ["Verify dates early in case local rules have changed."],
    checklist: ["Registration confirmed", "Voting method chosen", "Required documents ready"],
  },
  followUp: ["Do you want a registration checklist or a mail-voting walkthrough?"],
};

export async function guideAgent(input: { query: string; context: string }) {
  const fallbackPayload = {
    card: fallback.card,
    data: fallback.data,
    followUp: fallback.followUp,
  } satisfies Omit<AgentResult<GuideWalkthrough>, "agent" | "intent">;

  const rawResult = await callGeminiJson<Omit<AgentResult<GuideWalkthrough>, "agent" | "intent">>({
    systemInstruction: systemPrompts.guide,
    prompt: promptTemplates.guide(input.query, input.context),
    schemaName: "GuideWalkthrough",
    fallback: fallbackPayload,
  });

  const result = normalizeAgentResult(rawResult, guideResultSchema, fallbackPayload);

  return {
    agent: "guide",
    intent: "guide",
    ...result,
  } satisfies AgentResult<GuideWalkthrough>;
}
