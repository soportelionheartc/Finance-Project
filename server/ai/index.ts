import { AnthropicProvider } from "./providers/anthropic";
import { GroqProvider } from "./providers/groq";
import { OpenAIProvider } from "./providers/openai";
import { AIProvider } from "./types";

const providers: Record<string, () => AIProvider> = {
  openai: () => new OpenAIProvider(),
  anthropic: () => new AnthropicProvider(),
  groq: () => new GroqProvider(),
};

const activeProvider = process.env.AI_PROVIDER || "openai";

export const ai: AIProvider =
  providers[activeProvider]?.() ?? new OpenAIProvider();
export type { AIMessage, AIOptions, AIProvider } from "./types";
