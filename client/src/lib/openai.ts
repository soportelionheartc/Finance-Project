// En el cliente no importamos OpenAI directamente
import { apiRequest } from "./queryClient";

// El modelo más reciente de OpenAI es "gpt-4o" publicado el 13 de mayo de 2024. No cambiar a menos que el usuario lo solicite explícitamente
export const OPENAI_MODEL = "gpt-4o";

// Esta configuración se utiliza en el servidor para crear la instancia de OpenAI
// En el cliente no usamos una instancia directa de OpenAI
export const openai = { apiKey: "cliente-no-accede-directamente" };

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Función para enviar conversación con historial al servidor
export async function sendChatMessages(
  messages: ChatMessage[],
): Promise<string> {
  try {
    const response = await apiRequest("POST", "/api/ai/financial-advice", {
      messages,
    });

    if (!response.ok) {
      throw new Error("Error al obtener el consejo financiero");
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error al obtener el consejo financiero:", error);
    throw error;
  }
}

/**
 * Función para obtener consejos financieros desde el servidor (legacy)
 * @deprecated Esta función es obsoleta. Usa sendChatMessages con formato de mensajes para mantener el contexto de la conversación.
 */
export async function getFinancialAdvice(message: string): Promise<string> {
  return sendChatMessages([{ role: "user", content: message }]);
}

// Función para analizar el riesgo del portafolio
export async function analyzePortfolioRisk(assets: any[]): Promise<string> {
  try {
    const response = await apiRequest("POST", "/api/ai/analyze-portfolio", {
      assets,
    });

    if (!response.ok) {
      throw new Error("Error al analizar el portafolio");
    }

    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error("Error al analizar el portafolio:", error);
    throw error;
  }
}
