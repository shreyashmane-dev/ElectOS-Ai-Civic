import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserProfile, saveUserProfile } from "@/lib/db/firestore";
import { toErrorMessage } from "@/lib/errors";

export const runtime = "nodejs";

const userProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().min(16).max(120),
  location: z.string().min(2),
  voterStatus: z.enum(["registered", "not_registered", "unsure"]),
  preferences: z.array(z.string()).default([]),
  readinessScore: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = userProfileSchema.parse(await request.json());
    const saved = await saveUserProfile(body);
    return NextResponse.json(saved);
  } catch (error) {
    return NextResponse.json({ error: toErrorMessage(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const profile = await getUserProfile(id);
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: toErrorMessage(error) }, { status: 500 });
  }
}
