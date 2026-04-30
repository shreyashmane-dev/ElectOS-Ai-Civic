"use client";

import { useState, useTransition } from "react";

export function ChatComposer({
  onSend,
  loading,
}: {
  onSend: (query: string) => Promise<void>;
  loading: boolean;
}) {
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const query = value.trim();

        if (!query) {
          return;
        }

        startTransition(async () => {
          await onSend(query);
          setValue("");
        });
      }}
    >
      <div className="group relative">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/20 via-transparent to-purple-500/20 opacity-0 blur-xl transition-opacity duration-500 group-focus-within:opacity-100" />
        <div className="glass-panel relative flex items-end gap-3 rounded-2xl p-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            AI
          </div>
          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            rows={3}
            placeholder="e.g., Explain voter registration, check a civic claim, or ask a what-if scenario..."
            className="min-h-[88px] w-full resize-none bg-transparent px-2 py-4 text-lg text-on-surface outline-none placeholder:text-on-surface-variant/40"
          />
          <button
            type="submit"
            disabled={loading || isPending}
            className="mb-2 mr-2 flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#002022] shadow-glow transition-all hover:scale-[1.02] disabled:opacity-60"
          >
            {loading || isPending ? "Thinking..." : "Generate"}
          </button>
        </div>
      </div>
    </form>
  );
}
