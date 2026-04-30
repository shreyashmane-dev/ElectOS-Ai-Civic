import { z } from "zod";
import type {
  AgentResult,
  GuideWalkthrough,
  MisinfoAssessment,
  ReadinessBreakdown,
  RouterDecision,
  ScenarioAnalysis,
} from "@/types";

const normalizedString = z
  .string()
  .trim()
  .transform((value) => value.replace(/\s+/g, " "))
  .pipe(z.string().min(1));

const stringList = z.array(normalizedString).min(1);

const optionalStringList = z
  .union([normalizedString, z.array(normalizedString)])
  .optional()
  .transform((value) => {
    if (!value) {
      return undefined;
    }

    return typeof value === "string" ? [value] : value;
  });

const confidenceValue = z
  .union([z.number(), normalizedString])
  .optional()
  .transform((value) => {
    if (typeof value === "number") {
      return value;
    }

    if (!value) {
      return undefined;
    }

    const numericValue = Number(value);
    if (Number.isFinite(numericValue)) {
      return numericValue;
    }

    switch (value.toLowerCase()) {
      case "high":
        return 0.85;
      case "medium":
        return 0.6;
      case "low":
        return 0.35;
      default:
        return undefined;
    }
  });

const cardSchema = z.object({
  title: normalizedString,
  summary: normalizedString,
  bullets: stringList,
  cta: normalizedString.optional(),
  confidence: confidenceValue,
  sources: optionalStringList,
});

const stepSchema = z.union([
  normalizedString,
  z.object({
    action: normalizedString,
  }),
]);

const guideDataSchema = z.object({
  steps: z
    .array(stepSchema)
    .min(1)
    .transform((steps) => steps.map((step) => (typeof step === "string" ? step : step.action))),
  deadlineTips: stringList,
  checklist: stringList,
});

const followUpSchema = z
  .union([normalizedString, z.array(normalizedString)])
  .optional()
  .transform((value) => {
    if (!value) {
      return undefined;
    }

    return typeof value === "string" ? [value] : value;
  });

export const guideResultSchema = z.object({
  card: cardSchema,
  data: guideDataSchema,
  followUp: followUpSchema,
}) as z.ZodType<GuideResultPayload, z.ZodTypeDef, unknown>;

export const misinfoResultSchema = z.object({
  card: cardSchema,
  data: z.object({
    verdict: z.enum(["likely_true", "uncertain", "likely_false"]),
    explanation: normalizedString,
    checks: stringList,
    saferFraming: normalizedString,
  }),
  followUp: followUpSchema,
}) as z.ZodType<MisinfoResultPayload, z.ZodTypeDef, unknown>;

export const readinessResultSchema = z.object({
  card: cardSchema,
  data: z.object({
    score: z.number().min(0).max(100),
    status: z.enum(["low", "medium", "high"]),
    factors: z.array(
      z.object({
        label: normalizedString,
        value: z.number(),
        explanation: normalizedString,
      }),
    ),
    recommendations: stringList,
  }),
  followUp: followUpSchema,
}) as z.ZodType<ReadinessResultPayload, z.ZodTypeDef, unknown>;

export const scenarioResultSchema = z.object({
  card: cardSchema,
  data: z.object({
    scenario: normalizedString,
    impact: normalizedString,
    actions: stringList,
    caveats: stringList,
  }),
  followUp: followUpSchema,
}) as z.ZodType<ScenarioResultPayload, z.ZodTypeDef, unknown>;

export const routerDecisionSchema = z.object({
  intent: z.enum(["guide", "misinfo", "readiness", "scenario", "unknown"]),
  rationale: normalizedString,
  needsProfile: z.boolean(),
});

export function normalizeAgentResult<T>(
  value: unknown,
  schema: z.ZodType<Omit<AgentResult<T>, "agent" | "intent">, z.ZodTypeDef, unknown>,
  fallback: Omit<AgentResult<T>, "agent" | "intent">,
) {
  const parsed = schema.safeParse(value);
  return parsed.success ? parsed.data : fallback;
}

export function normalizeRouterDecision(value: unknown, fallback: RouterDecision) {
  const parsed = routerDecisionSchema.safeParse(value);
  return parsed.success ? parsed.data : fallback;
}

export type GuideResultPayload = Omit<AgentResult<GuideWalkthrough>, "agent" | "intent">;
export type MisinfoResultPayload = Omit<AgentResult<MisinfoAssessment>, "agent" | "intent">;
export type ReadinessResultPayload = Omit<AgentResult<ReadinessBreakdown>, "agent" | "intent">;
export type ScenarioResultPayload = Omit<AgentResult<ScenarioAnalysis>, "agent" | "intent">;
