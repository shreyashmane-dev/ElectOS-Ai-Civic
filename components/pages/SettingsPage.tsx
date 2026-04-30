"use client";

import { ConsoleShell } from "@/components/layout/ConsoleShell";
import { languageOptions, useAppSettings } from "@/context/AppSettingsContext";

export function SettingsPage() {
  const { settings, updateSettings } = useAppSettings();

  return (
    <ConsoleShell
      title="Settings"
      subtitle="Choose the language ElectOS should use for AI replies and control whether microphone input is available."
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <section className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">AI Language</p>
            <h3 className="mt-2 text-2xl font-semibold text-on-surface">Assistant response language</h3>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant">
              ElectOS will answer in this language across the AI assistant, readiness checks, fact checking, and scenario analysis.
            </p>
            <select
              value={settings.language}
              onChange={(event) => updateSettings({ language: event.target.value as typeof settings.language })}
              className="mt-5 w-full rounded-2xl border border-outline-variant/30 bg-surface-container-low px-4 py-4 text-on-surface outline-none transition-colors focus:border-primary"
            >
              {languageOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Voice Input</p>
            <h3 className="mt-2 text-2xl font-semibold text-on-surface">Microphone access</h3>
            <div className="mt-5 flex items-center justify-between gap-6 rounded-2xl border border-white/8 bg-surface-container-lowest/50 p-5">
              <div>
                <p className="text-sm font-semibold text-on-surface">Enable microphone in the AI composer</p>
                <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                  Uses your selected app language when browser speech recognition is available.
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateSettings({ speechInputEnabled: !settings.speechInputEnabled })}
                className={`relative h-8 w-16 rounded-full transition-colors ${
                  settings.speechInputEnabled ? "bg-cyan-400" : "bg-surface-container-highest"
                }`}
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${
                    settings.speechInputEnabled ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Priority</p>
            <h3 className="mt-2 text-2xl font-semibold text-on-surface">Language source</h3>
            <div className="mt-5 space-y-3">
              {[
                {
                  id: "profile",
                  title: "Use profile language first",
                  description: "If the saved citizen profile has a language, the AI will prefer that.",
                },
                {
                  id: "app",
                  title: "Use app setting first",
                  description: "Force the assistant to answer in the app-wide language setting.",
                },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => updateSettings({ aiTranslationMode: option.id as typeof settings.aiTranslationMode })}
                  className={`w-full rounded-2xl border p-5 text-left transition-colors ${
                    settings.aiTranslationMode === option.id
                      ? "border-cyan-400/40 bg-cyan-400/10"
                      : "border-white/8 bg-surface-container-lowest/50 hover:bg-surface-container-low/40"
                  }`}
                >
                  <p className="text-sm font-semibold text-on-surface">{option.title}</p>
                  <p className="mt-2 text-sm leading-7 text-on-surface-variant">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </ConsoleShell>
  );
}
