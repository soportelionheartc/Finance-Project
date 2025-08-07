// En el cliente no importamos OpenAI directamente
import { apiRequest } from "./queryClient";

// El modelo más reciente de OpenAI es "gpt-4o" publicado el 13 de mayo de 2024. No cambiar a menos que el usuario lo solicite explícitamente
export const OPENAI_MODEL = "gpt-4o";

// Esta configuración se utiliza en el servidor para crear la instancia de OpenAI
// En el cliente no usamos una instancia directa de OpenAI
export const openai = { apiKey: 'cliente-no-accede-directamente' };

// Función para obtener consejos financieros desde el servidor
export async function getFinancialAdvice(message: string): Promise<string> {
  try {
    const response = await apiRequest("POST", "/api/ai/financial-advice", { message });
    
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

// Función para analizar el riesgo del portafolio
export async function analyzePortfolioRisk(assets: any[]): Promise<string> {
  try {
    const response = await apiRequest("POST", "/api/ai/analyze-portfolio", { assets });
    
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