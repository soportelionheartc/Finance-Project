export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIOptions {
  temperature?: number;
  maxTokens?: number;
}

export interface AIProvider {
  chat: (messages: AIMessage[], options?: AIOptions) => Promise<string>;
}
