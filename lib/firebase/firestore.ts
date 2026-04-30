import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  location: string;
  votingStatus: string;
  district: string;
  onboardingCompleted: boolean;
  updatedAt: number;
}

export async function createUserProfile(uid: string, profile: Partial<UserProfile>) {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    uid,
    ...profile,
    updatedAt: Date.now()
  }, { merge: true });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: Date.now()
  });
}
