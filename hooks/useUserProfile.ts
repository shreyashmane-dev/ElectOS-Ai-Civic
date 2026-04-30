"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { parseJson } from "@/utils/api";
import type { UserProfile } from "@/types";

const defaultProfile = {
  age: 18,
  location: "",
  voterStatus: "unsure",
  preferences: [],
} satisfies Partial<UserProfile>;

function buildFallbackProfile(user: ReturnType<typeof useAuth>["user"]): Partial<UserProfile> | undefined {
  if (!user) {
    return undefined;
  }

  return {
    ...defaultProfile,
    id: user.uid,
    name: user.displayName ?? "",
    email: user.email ?? "",
  };
}

export function useUserProfile() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Partial<UserProfile>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fallbackProfile = useMemo(() => buildFallbackProfile(user), [user]);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (authLoading) {
        return;
      }

      if (!user) {
        setProfile(undefined);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/user/profile?id=${encodeURIComponent(user.uid)}`);

        if (response.status === 404) {
          if (!cancelled) {
            setProfile(fallbackProfile);
          }
          return;
        }

        const saved = await parseJson<UserProfile | null>(response);

        if (!cancelled) {
          setProfile(saved ?? fallbackProfile);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load profile.");
          setProfile(fallbackProfile);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [authLoading, fallbackProfile, user]);

  return {
    profile,
    setProfile,
    loading,
    error,
    isComplete: Boolean(
      profile?.id &&
        profile?.name &&
        profile?.email &&
        profile?.location &&
        typeof profile?.age === "number" &&
        profile?.preferences,
    ),
  };
}
