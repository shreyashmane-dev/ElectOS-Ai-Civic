import type { ChatMessage, UserProfile } from "@/types";

export function buildAgentContext(input: {
  history?: ChatMessage[];
  profile?: Partial<UserProfile>;
}) {
  const sections: string[] = [];
  const now = new Date().toISOString();

  sections.push(`Current timestamp:\n${now}`);

  if (input.profile) {
    sections.push(`Profile:\n${JSON.stringify(input.profile, null, 2)}`);
  }

  if (input.history?.length) {
    const transcript = input.history
      .slice(-12)
      .map((message) =>
        `${message.timestamp ? `[${message.timestamp}] ` : ""}${message.role}: ${message.content}`,
      )
      .join("\n");

    sections.push(`Recent conversation:\n${transcript}`);
  }

  return sections.join("\n\n") || "No additional context provided.";
}
