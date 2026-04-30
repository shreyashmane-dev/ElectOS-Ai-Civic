"use client";

import { useEffect, useState } from "react";
import { languageOptions } from "@/context/AppSettingsContext";
import { useAuth } from "@/context/AuthContext";
import { parseJson } from "@/utils/api";
import type { UserProfile } from "@/types";

const defaultProfile: UserProfile = {
  id: "",
  name: "",
  email: "",
  age: 18,
  location: "",
  language: "en",
  voterStatus: "unsure",
  preferences: [],
};

export function ProfileForm({
  initialProfile,
  onSaved,
}: {
  initialProfile?: Partial<UserProfile>;
  onSaved: (profile: UserProfile) => void;
}) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    ...defaultProfile,
    id: user?.uid ?? defaultProfile.id,
    name: user?.displayName ?? defaultProfile.name,
    email: user?.email ?? defaultProfile.email,
    ...initialProfile,
    preferences: initialProfile?.preferences ?? [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setProfile({
      ...defaultProfile,
      id: user?.uid ?? defaultProfile.id,
      name: user?.displayName ?? defaultProfile.name,
      email: user?.email ?? defaultProfile.email,
      ...initialProfile,
      preferences: initialProfile?.preferences ?? [],
    });
  }, [initialProfile, user?.displayName, user?.email, user?.uid]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...profile,
        id: profile.id || user?.uid || profile.email || crypto.randomUUID(),
      };

      const saved = await parseJson<UserProfile>(
        await fetch("/api/user/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );

      onSaved(saved);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
      <input type="hidden" value={profile.id} readOnly />
      <input
        required
        placeholder="Name"
        value={profile.name}
        onChange={(event) => setProfile({ ...profile, name: event.target.value })}
        className="rounded-lg border-b border-outline-variant bg-surface-container-low px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary-container focus:bg-surface-container"
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={profile.email}
        onChange={(event) => setProfile({ ...profile, email: event.target.value })}
        className="rounded-lg border-b border-outline-variant bg-surface-container-low px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary-container focus:bg-surface-container"
      />
      <input
        required
        type="number"
        min={16}
        max={120}
        placeholder="Age"
        value={profile.age}
        onChange={(event) => setProfile({ ...profile, age: Number(event.target.value) })}
        className="rounded-lg border-b border-outline-variant bg-surface-container-low px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary-container focus:bg-surface-container"
      />
      <input
        required
        placeholder="Location"
        value={profile.location}
        onChange={(event) => setProfile({ ...profile, location: event.target.value })}
        className="rounded-lg border-b border-outline-variant bg-surface-container-low px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary-container focus:bg-surface-container"
      />
      <select
        value={profile.language ?? "en"}
        onChange={(event) => setProfile({ ...profile, language: event.target.value })}
        className="rounded-lg border-b border-outline-variant bg-surface-container-low px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary-container focus:bg-surface-container"
      >
        {languageOptions.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
      <select
        value={profile.voterStatus}
        onChange={(event) =>
          setProfile({
            ...profile,
            voterStatus: event.target.value as UserProfile["voterStatus"],
          })
        }
        className="rounded-lg border-b border-outline-variant bg-surface-container-low px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary-container focus:bg-surface-container"
      >
        <option value="registered">Registered</option>
        <option value="not_registered">Not registered</option>
        <option value="unsure">Unsure</option>
      </select>
      <input
        placeholder="Preferences (comma separated)"
        value={profile.preferences.join(", ")}
        onChange={(event) =>
          setProfile({
            ...profile,
            preferences: event.target.value
              .split(",")
              .map((value) => value.trim())
              .filter(Boolean),
          })
        }
        className="rounded-lg border-b border-outline-variant bg-surface-container-low px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary-container focus:bg-surface-container md:col-span-2"
      />
      <button
        type="submit"
        disabled={saving}
        className="md:col-span-2 rounded-lg bg-gradient-to-r from-primary-container to-secondary-container px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-on-primary-container"
      >
        {saving ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
