import {
  GenerateContentResult,
  HarmBlockThreshold,
  HarmCategory,
  VertexAI,
} from "@google-cloud/vertexai";
import { DEFAULT_MODEL_TEMPERATURE } from "@/lib/constants";
import { AppError, toErrorMessage } from "@/lib/errors";
import { getAiEnv } from "@/utils/env";

export interface GeminiCallOptions<T> {
  systemInstruction: string;
  prompt: string;
  schemaName: string;
  fallback: T;
  temperature?: number;
}

const ELECTOS_SYSTEM_PROMPT = `
You are ElectOS, an AI civic copilot.

You MUST guide users interactively and efficiently.

RULES:
- No long paragraphs
- No generic explanations
- Use steps and decision logic
- Move fast and give next action

FORMAT:
Step:
- action

Options:
- If YES -> ...
- If NO -> ...

Next step:
- one clear instruction
`.trim();

let vertexClient: VertexAI | null = null;

function getVertexClient() {
  if (!vertexClient) {
    const env = getAiEnv();
    vertexClient = new VertexAI({
      project: env.PROJECT_ID,
      location: env.LOCATION,
    });
  }

  return vertexClient;
}

function extractText(result: GenerateContentResult) {
  const parts = result.response.candidates?.[0]?.content?.parts ?? [];

  return parts
    .map((part) => ("text" in part && part.text ? part.text : ""))
    .join("")
    .trim();
}

function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return fallback;
  }
}

export async function callGeminiJson<T>({
  systemInstruction,
  prompt,
  schemaName,
  fallback,
  temperature = DEFAULT_MODEL_TEMPERATURE,
}: GeminiCallOptions<T>): Promise<T> {
  try {
    const env = getAiEnv();
    const model = getVertexClient().getGenerativeModel({
      model: env.GEMINI_MODEL,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
      generationConfig: {
        temperature,
        responseMimeType: "application/json",
      },
      systemInstruction: {
        role: "system",
        parts: [{ text: `${ELECTOS_SYSTEM_PROMPT}\n\n${systemInstruction}` }],
      },
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = extractText(result);

    if (!text) {
      throw new AppError(`Gemini returned an empty response for ${schemaName}`, 502);
    }

    return safeJsonParse(text, fallback);
  } catch (error) {
    throw new AppError(`Gemini request failed: ${toErrorMessage(error)}`, 502);
  }
}

export async function askAI(message: string) {
  try {
    const env = getAiEnv();
    const model = getVertexClient().getGenerativeModel({
      model: env.GEMINI_MODEL,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
      generationConfig: {
        temperature: DEFAULT_MODEL_TEMPERATURE,
      },
      systemInstruction: {
        role: "system",
        parts: [{ text: ELECTOS_SYSTEM_PROMPT }],
      },
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
    });

    const text = extractText(result);

    if (!text) {
      throw new AppError(`Gemini returned an empty response for model ${env.GEMINI_MODEL}`, 502);
    }

    return text;
  } catch (error) {
    throw new AppError(`Gemini request failed: ${toErrorMessage(error)}`, 502);
  }
}
