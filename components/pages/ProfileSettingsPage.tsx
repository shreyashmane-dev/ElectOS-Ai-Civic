"use client";

import { ConsoleShell } from "@/components/layout/ConsoleShell";
import { ProfileForm } from "@/components/ui/ProfileForm";
import { languageOptions, useAppSettings } from "@/context/AppSettingsContext";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRouter } from "next/navigation";
import type { UserProfile } from "@/types";

export function ProfileSettingsPage() {
  const { user, logout } = useAuth();
  const { settings, updateSettings } = useAppSettings();
  const { profile, setProfile, loading } = useUserProfile();
  const router = useRouter();

  const userInitials = profile?.name
    ? profile.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
    : user?.email
      ? user.email[0].toUpperCase()
      : "U";

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  function handleProfileSaved(nextProfile: UserProfile) {
    setProfile(nextProfile);
  }

  return (
    <ConsoleShell title="My Profile" subtitle="Manage your saved citizen profile and app-wide AI language settings.">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <aside className="space-y-6">
          <div className="glass-panel rounded-3xl p-8 text-center">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-3xl font-black text-white shadow-xl">
              {userInitials}
            </div>
            <h3 className="mt-5 text-3xl font-black text-on-surface">{profile?.name || user?.displayName || "Citizen"}</h3>
            <p className="mt-2 text-on-surface-variant">{profile?.email || user?.email}</p>
            <div className="mt-6 space-y-3 text-left">
              <div className="rounded-2xl border border-white/8 bg-surface-container-lowest/50 p-4">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
                  Location
                </span>
                <p className="mt-2 text-sm text-on-surface">{profile?.location || "Not saved yet"}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-surface-container-lowest/50 p-4">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
                  Profile language
                </span>
                <p className="mt-2 text-sm text-on-surface">
                  {languageOptions.find((option) => option.code === profile?.language)?.label ?? "English"}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <h4 className="text-xl font-semibold text-on-surface">App language</h4>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant">
              This controls the default language ElectOS uses when answering across the app.
            </p>
            <select
              value={settings.language}
              onChange={(event) => updateSettings({ language: event.target.value as typeof settings.language })}
              className="mt-4 w-full rounded-2xl border border-outline-variant/30 bg-surface-container-low px-4 py-4 text-on-surface outline-none focus:border-primary"
            >
              {languageOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <h4 className="text-2xl font-semibold text-on-surface">Citizen profile</h4>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant">
              Save your profile once, including your preferred language, and the AI can use it in the assistant, readiness, scenario, and fact-check tabs.
            </p>
            {loading ? <p className="mt-4 text-sm text-on-surface-variant">Loading profile...</p> : null}
            <div className="mt-5">
              <ProfileForm initialProfile={profile} onSaved={handleProfileSaved} />
            </div>
          </div>

          <button
            onClick={() => void handleLogout()}
            className="w-full rounded-2xl border border-error/30 bg-error/10 py-4 text-sm font-bold uppercase tracking-widest text-error transition-colors hover:bg-error/20"
          >
            Log Out
          </button>
        </section>
      </div>
    </ConsoleShell>
  );
}
