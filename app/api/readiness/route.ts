import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readinessAgent } from "@/agents/readinessAgent";
import { buildAgentContext } from "@/lib/ai/context";
import { saveUserProfile } from "@/lib/db/firestore";
import { toErrorMessage } from "@/lib/errors";

export const runtime = "nodejs";

const requestSchema = z.object({
  query: z.string().default("Calculate my civic readiness"),
  profile: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    age: z.number(),
    location: z.string(),
    language: z.string().optional(),
    voterStatus: z.enum(["registered", "not_registered", "unsure"]),
    preferences: z.array(z.string()).default([]),
    readinessScore: z.number().optional(),
  }),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string(),
        timestamp: z.string().optional(),
      }),
    )
    .optional(),
  settings: z
    .object({
      language: z.string().optional(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = requestSchema.parse(await request.json());
    const result = await readinessAgent({
      query: body.query,
      context: buildAgentContext({
        profile: body.profile,
        history: body.history,
        settings: body.settings,
      }),
    });

    await saveUserProfile({
      ...body.profile,
      readinessScore: result.data.score,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: toErrorMessage(error) }, { status: 500 });
  }
}
