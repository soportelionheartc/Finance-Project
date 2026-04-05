import OpenAI from "openai";
import type { AIMessage, AIOptions, AIProvider } from "../types";

export class OpenAIProvider implements AIProvider {
  private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  async chat(messages: AIMessage[], options?: AIOptions): Promise<string> {
    const res = await this.client.chat.completions.create({
      model: "gpt-5.4",
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1000,
    });
    console.log(res.choices[0].message.content);
    return res.choices[0].message.content ?? "";
  }
}
