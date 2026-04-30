import { guideAgent } from "@/agents/guideAgent";
import { misinfoAgent } from "@/agents/misinfoAgent";
import { readinessAgent } from "@/agents/readinessAgent";
import { routerAgent } from "@/agents/routerAgent";
import { scenarioAgent } from "@/agents/scenarioAgent";
import { saveQueryAnalytics } from "@/lib/db/firestore";
import { buildAgentContext } from "@/lib/ai/context";
import type {
  AgentResult,
  GuideWalkthrough,
  MisinfoAssessment,
  QueryRequest,
  ReadinessBreakdown,
  ScenarioAnalysis,
} from "@/types";

type ElectOSResultData =
  | GuideWalkthrough
  | MisinfoAssessment
  | ReadinessBreakdown
  | ScenarioAnalysis;

export async function runElectOSQuery(input: QueryRequest): Promise<AgentResult<ElectOSResultData>> {
  const decision = await routerAgent({
    query: input.query,
    profile: input.profile,
  });

  const context = buildAgentContext({
    history: input.history,
    profile: input.profile,
  });

  let result: AgentResult<ElectOSResultData>;

  switch (decision.intent) {
    case "guide":
      result = await guideAgent({ query: input.query, context });
      break;
    case "misinfo":
      result = await misinfoAgent({ query: input.query, context });
      break;
    case "readiness":
      result = await readinessAgent({ query: input.query, context });
      break;
    case "scenario":
      result = await scenarioAgent({ query: input.query, context });
      break;
    default:
      result = await guideAgent({
        query: `Help the user with this civic request: ${input.query}`,
        context,
      });
      break;
  }

  try {
    await saveQueryAnalytics({
      query: input.query,
      intent: decision.intent,
      profileId: input.profile?.id,
      history: input.history,
    });
  } catch {
    // Analytics should not block user-facing responses.
  }

  return result;
}
