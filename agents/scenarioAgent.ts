import { callGeminiJson } from "@/lib/ai/gemini";
import { promptTemplates, systemPrompts } from "@/lib/ai/prompts";
import { normalizeAgentResult, scenarioResultSchema } from "@/lib/ai/resultSchemas";
import type { AgentResult, ScenarioAnalysis } from "@/types";

const fallback: AgentResult<ScenarioAnalysis> = {
  agent: "scenario",
  intent: "scenario",
  card: {
    title: "Scenario Analysis",
    summary: "Here is a cautious scenario response based on general civic best practices.",
    bullets: [
      "Local rules can change the outcome.",
      "Deadlines and documentation matter.",
      "Official local guidance should confirm next steps.",
    ],
    cta: "Verify the scenario against your local election authority.",
    confidence: 0.46,
    sources: [],
  },
  data: {
    scenario: "General civic what-if scenario",
    impact: "The result depends on local deadlines, registration status, and ballot rules.",
    actions: [
      "Check local election deadlines immediately.",
      "Confirm whether a provisional or updated ballot path exists.",
      "Document any instructions from the election office.",
    ],
    caveats: ["Local law and county procedures may vary significantly."],
  },
  followUp: ["Do you want this broken down for your specific state or county?"],
};

export async function scenarioAgent(input: { query: string; context: string }) {
  const fallbackPayload = {
    card: fallback.card,
    data: fallback.data,
    followUp: fallback.followUp,
  } satisfies Omit<AgentResult<ScenarioAnalysis>, "agent" | "intent">;

  const rawResult = await callGeminiJson<Omit<AgentResult<ScenarioAnalysis>, "agent" | "intent">>({
    systemInstruction: systemPrompts.scenario,
    prompt: promptTemplates.scenario(input.query, input.context),
    schemaName: "ScenarioAnalysis",
    fallback: fallbackPayload,
  });

  const result = normalizeAgentResult(rawResult, scenarioResultSchema, fallbackPayload);

  return {
    agent: "scenario",
    intent: "scenario",
    ...result,
  } satisfies AgentResult<ScenarioAnalysis>;
}
