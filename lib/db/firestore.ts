import { Firestore } from "@google-cloud/firestore";
import { COLLECTIONS } from "@/lib/constants";
import { getFirestoreEnv } from "@/utils/env";
import { isoNow } from "@/utils/date";
import type { ChatMessage, UserProfile } from "@/types";

let firestore: Firestore | null = null;

export function getFirestore() {
  if (!firestore) {
    const env = getFirestoreEnv();
    firestore = new Firestore({
      projectId: env.FIREBASE_PROJECT_ID,
    });
  }

  return firestore;
}

export async function saveUserProfile(profile: UserProfile) {
  const db = getFirestore();
  const timestamp = isoNow();
  const nextProfile = {
    ...profile,
    updatedAt: timestamp,
    createdAt: profile.createdAt ?? timestamp,
  };

  await db.collection(COLLECTIONS.users).doc(profile.id).set(nextProfile, {
    merge: true,
  });

  return nextProfile;
}

export async function getUserProfile(id: string) {
  const db = getFirestore();
  const snapshot = await db.collection(COLLECTIONS.users).doc(id).get();

  return snapshot.exists ? (snapshot.data() as UserProfile) : null;
}

export async function saveQueryAnalytics(input: {
  query: string;
  intent: string;
  profileId?: string;
  history?: ChatMessage[];
}) {
  const db = getFirestore();

  await db.collection(COLLECTIONS.queries).add({
    ...input,
    createdAt: isoNow(),
  });
}
