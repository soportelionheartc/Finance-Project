import Anthropic from "@anthropic-ai/sdk";
import { MessageParam } from "@anthropic-ai/sdk/resources";
import { AIMessage, AIOptions, AIProvider } from "../types";

export class AnthropicProvider implements AIProvider {
  private client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  async chat(messages: AIMessage[], options?: AIOptions): Promise<string> {
    const system = messages.find((m) => m.role === "system")?.content ?? "";
    const userAssistantMessages: MessageParam[] = messages
      .filter((m) => m.role !== "system")
      .map(
        (m) =>
          ({
            content: m.content,
            role: m.role == "user" ? "user" : "assistant",
          }) satisfies MessageParam,
      );

    const res = await this.client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: options?.maxTokens ?? 1000,
      system,
      messages: userAssistantMessages,
    });
    return res.content[0].type == "text"
      ? res.content[0].text
      : JSON.stringify(res.content[0]); //TODO: handle non-text content properly
  }
}
