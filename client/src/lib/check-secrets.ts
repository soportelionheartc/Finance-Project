import { apiRequest } from "./queryClient";

// Función para verificar si un secreto está disponible
export async function check_secrets(secretKey: string): Promise<boolean> {
  try {
    const response = await apiRequest("GET", `/api/check-secret?key=${secretKey}`);
    if (response.ok) {
      const data = await response.json();
      return data.available;
    }
    return false;
  } catch (error) {
    console.error(`Error checking ${secretKey} availability:`, error);
    return false;
  }
}