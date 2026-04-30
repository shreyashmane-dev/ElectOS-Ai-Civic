import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { runElectOSQuery } from "@/lib/ai/orchestrator";
import { AppError, toErrorMessage } from "@/lib/errors";

export const runtime = "nodejs";

const requestSchema = z.object({
  query: z.string().min(3),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().min(1),
        timestamp: z.string().optional(),
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
    const result = await runElectOSQuery(body);

    return NextResponse.json(result);
  } catch (error) {
    const status =
      error instanceof AppError ? error.statusCode : error instanceof ZodError ? 400 : 500;

    return NextResponse.json(
      { error: toErrorMessage(error) },
      { status },
    );
  }
}
