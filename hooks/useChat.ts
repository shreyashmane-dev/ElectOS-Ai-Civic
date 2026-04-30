"use client";

import { useEffect, useMemo, useState } from "react";
import { parseJson } from "@/utils/api";
import type { AgentResult, ChatMessage, UserProfile } from "@/types";

export function useChat(profile?: Partial<UserProfile>, language?: string) {
  const storageKey = useMemo(
    () => `electos-chat:${profile?.id ?? profile?.email ?? "guest"}`,
    [profile?.email, profile?.id],
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastResult, setLastResult] = useState<AgentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const saved = window.sessionStorage.getItem(storageKey);
    if (!saved) {
      setMessages([]);
      setLastResult(null);
      return;
    }

    try {
      const parsed = JSON.parse(saved) as {
        messages?: ChatMessage[];
        lastResult?: AgentResult | null;
      };

      setMessages(parsed.messages ?? []);
      setLastResult(parsed.lastResult ?? null);
    } catch {
      setMessages([]);
      setLastResult(null);
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        messages,
        lastResult,
      }),
    );
  }, [lastResult, messages, storageKey]);

  async function sendMessage(query: string) {
    const nextUserMessage: ChatMessage = {
      role: "user",
      content: query,
      timestamp: new Date().toISOString(),
    };

    const nextMessages = [...messages, nextUserMessage];
    setMessages(nextMessages);
    setLoading(true);
    setError(null);

    try {
      const result = await parseJson<AgentResult>(
        await fetch("/api/ai/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            history: nextMessages,
            profile,
            settings: {
              language,
            },
          }),
        }),
      );

      setLastResult(result);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: [result.card.summary, ...result.card.bullets].join(" "),
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setMessages(messages);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to process request. Check your Vertex AI environment settings.",
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    messages,
    lastResult,
    loading,
    error,
    sendMessage,
    clearConversation: () => {
      setMessages([]);
      setLastResult(null);
      setError(null);
    },
  };
}
