"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const languageOptions = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "ar", label: "Arabic" },
  { code: "bn", label: "Bengali" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "ur", label: "Urdu" },
] as const;

export type SupportedLanguage = (typeof languageOptions)[number]["code"];

export interface AppSettings {
  language: SupportedLanguage;
  speechInputEnabled: boolean;
  aiTranslationMode: "profile" | "app";
}

interface AppSettingsContextValue {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

const STORAGE_KEY = "electos-app-settings";

const defaultSettings: AppSettings = {
  language: "en",
  speechInputEnabled: true,
  aiTranslationMode: "profile",
};

const AppSettingsContext = createContext<AppSettingsContextValue | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as Partial<AppSettings>;
      setSettings((current) => ({
        ...current,
        ...parsed,
      }));
    } catch {
      setSettings(defaultSettings);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    document.documentElement.lang = settings.language;
  }, [settings]);

  const value = useMemo<AppSettingsContextValue>(
    () => ({
      settings,
      updateSettings: (updates) => {
        setSettings((current) => ({
          ...current,
          ...updates,
        }));
      },
    }),
    [settings],
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error("useAppSettings must be used within AppSettingsProvider");
  }

  return context;
}
