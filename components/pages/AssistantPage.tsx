"use client";

import { ConsoleShell } from "@/components/layout/ConsoleShell";
import { ChatComposer } from "@/components/ui/ChatComposer";
import { ProfileForm } from "@/components/ui/ProfileForm";
import { ResponseCard } from "@/components/ui/ResponseCard";
import { useChat } from "@/hooks/useChat";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { UserProfile } from "@/types";

const shortcuts = [
  "How do I register to vote if I just turned 18?",
  "Is this polling place message fake?",
  "What if I moved right before Election Day?",
  "Calculate my readiness to participate.",
];

export function AssistantPage() {
  const { profile, setProfile, loading: profileLoading, isComplete } = useUserProfile();
  const { messages, lastResult, loading, error, sendMessage, clearConversation } = useChat(profile);

  function handleProfileSaved(nextProfile: UserProfile) {
    setProfile(nextProfile);
  }

  return (
    <ConsoleShell
      title="Civic Intelligence Interface"
      subtitle="Ask the assistant anything about registration, misinformation, deadlines, and voting scenarios with profile-aware context."
    >
      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.35fr)_380px]">
        <section className="min-w-0 space-y-6">
          <div className="glass-panel rounded-3xl p-4 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Advanced Vertex Session</p>
                <h3 className="text-2xl font-semibold text-on-surface sm:text-3xl">Profile-aware AI assistant</h3>
                <p className="max-w-3xl text-sm leading-7 text-on-surface-variant">
                  This assistant now uses your saved profile and recent message history so follow-up questions do not restart from zero.
                </p>
              </div>
              <button
                type="button"
                onClick={clearConversation}
                className="rounded-xl border border-white/10 bg-surface-container-low/50 px-4 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
              >
                Clear conversation
              </button>
            </div>

            <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
              {shortcuts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendMessage(prompt)}
                  className="whitespace-nowrap rounded-full border border-outline-variant/40 bg-surface-container-low/50 px-4 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <ChatComposer onSend={sendMessage} loading={loading} />
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Conversation Memory</p>
                <h3 className="mt-1 text-xl font-semibold text-on-surface">Recent thread</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-surface-container-low/50 px-3 py-1 text-xs text-on-surface-variant">
                {messages.length} messages
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {messages.length ? (
                messages.slice(-10).map((message, index) => (
                  <div
                    key={`${message.role}-${index}-${message.timestamp ?? ""}`}
                    className={
                      message.role === "user"
                        ? "ml-auto max-w-full rounded-2xl rounded-br-md bg-cyan-400 px-4 py-4 text-sm leading-7 text-[#002022] sm:max-w-[82%]"
                        : "max-w-full rounded-2xl rounded-bl-md border border-white/8 bg-surface-container-lowest/60 px-4 py-4 text-sm leading-7 text-on-surface sm:max-w-[86%]"
                    }
                  >
                    {message.content}
                  </div>
                ))
              ) : (
                <p className="text-sm leading-7 text-on-surface-variant">
                  Start the conversation and ElectOS will keep your recent context available for follow-up questions.
                </p>
              )}

              {loading ? (
                <div className="max-w-[86%] rounded-2xl rounded-bl-md border border-white/8 bg-surface-container-lowest/60 px-4 py-4 text-sm text-on-surface">
                  Thinking through your profile, history, and latest question...
                </div>
              ) : null}
            </div>
          </div>

          {error ? <p className="text-sm text-error">{error}</p> : null}
          {lastResult ? <ResponseCard result={lastResult} /> : null}
        </section>

        <aside className="min-w-0 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Session State</p>
            <h3 className="mt-2 text-2xl font-semibold text-on-surface">Assistant grounding</h3>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-white/8 bg-surface-container-lowest/50 p-4">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
                  Profile
                </span>
                <p className="mt-2 text-sm leading-7 text-on-surface">
                  {isComplete ? "Loaded and ready for personalized answers." : "Incomplete. Save more details for stronger answers."}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-surface-container-lowest/50 p-4">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
                  Conversation memory
                </span>
                <p className="mt-2 text-sm leading-7 text-on-surface">
                  The assistant reads recent message history and uses it during follow-up questions.
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-surface-container-lowest/50 p-4">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
                  Model
                </span>
                <p className="mt-2 text-sm leading-7 text-on-surface">
                  Vertex AI with stricter response normalization and better tab-specific prompts.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Citizen Profile</p>
            <h3 className="mt-2 text-2xl font-semibold text-on-surface">Save your context</h3>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant">
              Add your location, status, and preferences so the assistant can answer more like the version you had in the studio.
            </p>
            {profileLoading ? <p className="mt-4 text-sm text-on-surface-variant">Loading profile...</p> : null}
            <div className="mt-5">
              <ProfileForm initialProfile={profile} onSaved={handleProfileSaved} />
            </div>
          </div>
        </aside>
      </div>
    </ConsoleShell>
  );
}
