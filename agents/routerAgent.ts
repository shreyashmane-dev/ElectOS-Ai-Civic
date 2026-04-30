import { callGeminiJson } from "@/lib/ai/gemini";
import { promptTemplates, systemPrompts } from "@/lib/ai/prompts";
import { normalizeRouterDecision } from "@/lib/ai/resultSchemas";
import type { RouterDecision, UserProfile } from "@/types";

const fallbackDecision: RouterDecision = {
  intent: "unknown",
  rationale: "Fallback route used because classification failed.",
  needsProfile: false,
};

export async function routerAgent(input: {
  query: string;
  profile?: Partial<UserProfile>;
}) {
  const profileSummary = input.profile
    ? JSON.stringify(input.profile, null, 2)
    : undefined;

  const result = await callGeminiJson<RouterDecision>({
    systemInstruction: systemPrompts.router,
    prompt: promptTemplates.router(input.query, profileSummary),
    schemaName: "RouterDecision",
    fallback: fallbackDecision,
  });

  return normalizeRouterDecision(result, fallbackDecision);
}
