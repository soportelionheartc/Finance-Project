import OpenAI from 'openai';
import { AIMessage, AIOptions, AIProvider } from '../types';

export class GroqProvider implements AIProvider {
  private client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  async chat(messages: AIMessage[], options?: AIOptions): Promise<string> {
    console.log("Sending messages to Groq:", messages);
    const res = await this.client.responses.create({
      model: 'openai/gpt-oss-20b',
      input: messages,
    });
    console.log({res_output_text: res.output_text});
    return res.output_text ?? '';
  }
}
