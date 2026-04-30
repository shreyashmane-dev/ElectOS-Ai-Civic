import { callGeminiJson } from "@/lib/ai/gemini";
import { promptTemplates, systemPrompts } from "@/lib/ai/prompts";
import { misinfoResultSchema, normalizeAgentResult } from "@/lib/ai/resultSchemas";
import type { AgentResult, MisinfoAssessment } from "@/types";

const fallback: AgentResult<MisinfoAssessment> = {
  agent: "misinfo",
  intent: "misinfo",
  card: {
    title: "Claim Review",
    summary: "The claim needs manual verification with authoritative election sources.",
    bullets: [
      "Treat unverified claims cautiously.",
      "Check your state election office or county board.",
      "Look for primary documents before sharing.",
    ],
    cta: "Compare the claim against official election guidance.",
    confidence: 0.42,
    sources: [],
  },
  data: {
    verdict: "uncertain",
    explanation: "The automated system could not verify the claim confidently.",
    checks: ["Confirm dates", "Confirm location", "Check official election authority"],
    saferFraming: "This claim needs confirmation from official local election sources.",
  },
  followUp: ["Paste the full claim and where you saw it for a deeper analysis."],
};

export async function misinfoAgent(input: { query: string; context: string }) {
  const fallbackPayload = {
    card: fallback.card,
    data: fallback.data,
    followUp: fallback.followUp,
  } satisfies Omit<AgentResult<MisinfoAssessment>, "agent" | "intent">;

  const rawResult = await callGeminiJson<Omit<AgentResult<MisinfoAssessment>, "agent" | "intent">>({
    systemInstruction: systemPrompts.misinfo,
    prompt: promptTemplates.misinfo(input.query, input.context),
    schemaName: "MisinfoAssessment",
    fallback: fallbackPayload,
  });

  const result = normalizeAgentResult(rawResult, misinfoResultSchema, fallbackPayload);

  return {
    agent: "misinfo",
    intent: "misinfo",
    ...result,
  } satisfies AgentResult<MisinfoAssessment>;
}
