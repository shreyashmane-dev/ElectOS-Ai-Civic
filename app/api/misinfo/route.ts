import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { misinfoAgent } from "@/agents/misinfoAgent";
import { buildAgentContext } from "@/lib/ai/context";
import { toErrorMessage } from "@/lib/errors";

export const runtime = "nodejs";

const requestSchema = z.object({
  query: z.string().min(5),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string(),
      }),
    )
    .optional(),
  profile: z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
      email: z.string().optional(),
      age: z.number().optional(),
      location: z.string().optional(),
      language: z.string().optional(),
      voterStatus: z.enum(["registered", "not_registered", "unsure"]).optional(),
      preferences: z.array(z.string()).optional(),
      readinessScore: z.number().optional(),
    })
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
    const result = await misinfoAgent({
      query: body.query,
      context: buildAgentContext({ history: body.history, profile: body.profile, settings: body.settings }),
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: toErrorMessage(error) }, { status: 500 });
  }
}
