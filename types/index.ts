export type AgentIntent =
  | "guide"
  | "misinfo"
  | "readiness"
  | "scenario"
  | "unknown";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  location: string;
  language?: string;
  voterStatus: "registered" | "not_registered" | "unsure";
  preferences: string[];
  readinessScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

export interface AgentCard {
  title: string;
  summary: string;
  bullets: string[];
  cta?: string;
  confidence?: number;
  sources?: string[];
}

export interface AgentResult<T = Record<string, unknown>> {
  agent: AgentIntent | string;
  intent: AgentIntent;
  card: AgentCard;
  data: T;
  followUp?: string[];
}

export interface RouterDecision {
  intent: AgentIntent;
  rationale: string;
  needsProfile: boolean;
}

export interface QueryRequest {
  query: string;
  history?: ChatMessage[];
  profile?: Partial<UserProfile>;
  settings?: {
    language?: string;
  };
}

export interface ReadinessBreakdown {
  score: number;
  status: "low" | "medium" | "high";
  factors: Array<{
    label: string;
    value: number;
    explanation: string;
  }>;
  recommendations: string[];
}

export interface MisinfoAssessment {
  verdict: "likely_true" | "uncertain" | "likely_false";
  explanation: string;
  checks: string[];
  saferFraming: string;
}

export interface ScenarioAnalysis {
  scenario: string;
  impact: string;
  actions: string[];
  caveats: string[];
}

export interface GuideWalkthrough {
  steps: string[];
  deadlineTips: string[];
  checklist: string[];
}
