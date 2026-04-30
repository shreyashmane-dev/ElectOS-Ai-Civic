import { z } from "zod";

const aiEnvSchema = z.object({
  PROJECT_ID: z.string().min(1, "PROJECT_ID is required"),
  LOCATION: z.string().min(1, "LOCATION is required"),
  GEMINI_MODEL: z.string().min(1).default("gemini-1.5-flash"),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),
});

const firestoreEnvSchema = z.object({
  FIREBASE_API_KEY: z.string().optional(),
  FIREBASE_AUTH_DOMAIN: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().min(1, "FIREBASE_PROJECT_ID is required"),
});

export type AiEnv = z.infer<typeof aiEnvSchema>;
export type FirestoreEnv = z.infer<typeof firestoreEnvSchema>;

let cachedAiEnv: AiEnv | null = null;
let cachedFirestoreEnv: FirestoreEnv | null = null;

export function getAiEnv(): AiEnv {
  if (cachedAiEnv) {
    return cachedAiEnv;
  }

  cachedAiEnv = aiEnvSchema.parse({
    PROJECT_ID: process.env.PROJECT_ID,
    LOCATION: process.env.LOCATION,
    GEMINI_MODEL: process.env.GEMINI_MODEL,
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });

  return cachedAiEnv;
}

export function getFirestoreEnv(): FirestoreEnv {
  if (cachedFirestoreEnv) {
    return cachedFirestoreEnv;
  }

  cachedFirestoreEnv = firestoreEnvSchema.parse({
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  });

  return cachedFirestoreEnv;
}
