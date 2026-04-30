"use server";

import { saveUserProfile } from "@/lib/db/firestore";
import type { UserProfile } from "@/types";

export async function saveProfileAction(profile: UserProfile) {
  return saveUserProfile(profile);
}
