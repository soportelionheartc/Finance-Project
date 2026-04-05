import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Brain } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getFinancialAdvice } from "@/lib/openai";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";

// Función para verificar si la clave de OpenAI está disponible
async function checkSecret(secretKey: string): Promise<boolean> {
  try {
    const response = await apiRequest(
      "GET",
      `/api/check-secret?key=${secretKey}`,
    );
    const data = await response.json();
    return data.available;
  } catch (error) {
    console.error(`Error checking ${secretKey} availability:`, error);
    return false;
  }
}

interface ChatMessage {
  id: number;
  userId: number;
  message: string;
  response: string;
  timestamp: string;
}

export const AiChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openAiAvailable, setOpenAiAvailable] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Comprueba si la API Key de OpenAI está disponible
  useEffect(() => {
    const checkOpenAiKey = async () => {
      const isAvailable = await checkSecret("OPENAI_API_KEY");
      setOpenAiAvailable(isAvailable);
    };

    checkOpenAiKey();

    // Cargar mensajes de historial (ejemplo para ahora)
    setMessages([
      {
        id: 1,
        userId: user?.id || 1,
        message:
          "¿Cómo puedo diversificar mi portafolio para reducir el riesgo?",
        response:
          "La diversificación es una estrategia clave para gestionar el riesgo. Te recomendaría distribuir tus inversiones entre diferentes clases de activos (acciones, bonos, efectivo, bienes raíces), diferentes sectores industriales, y diferentes regiones geográficas. Para tu perfil específico, consideraría una asignación de 60% en acciones, 30% en bonos, y 10% en otros activos como materias primas o bienes raíces. ¿Te gustaría que profundice en alguna categoría específica?",
        timestamp: "2025-03-31T14:30:00.000Z",
      },
      {
        id: 2,
        userId: user?.id || 1,
        message:
          "¿Cuál es la diferencia entre invertir en ETFs y acciones individuales?",
        response:
          "Los ETFs (Fondos Cotizados en Bolsa) y las acciones individuales tienen diferencias importantes:\n\n1. Diversificación: Los ETFs contienen múltiples activos, ofreciendo diversificación instantánea, mientras que las acciones individuales representan una única empresa.\n\n2. Riesgo: Las acciones individuales generalmente conllevan mayor riesgo, pero también mayor potencial de retorno.\n\n3. Gestión: Los ETFs son gestionados profesionalmente y requieren menos investigación que seleccionar acciones individuales.\n\n4. Costos: Los ETFs tienen comisiones de gestión, pero suelen ser más bajas que los fondos mutuos tradicionales.\n\nPara inversores nuevos o con menos tiempo para análisis, los ETFs suelen ser una opción más segura y conveniente.",
        timestamp: "2025-04-01T09:15:00.000Z",
      },
    ]);
  }, [user]);

  // Scroll al final cuando se añaden nuevos mensajes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;

    setIsLoading(true);

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      userId: user?.id || 1,
      message: inputValue,
      response: "...",
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Si OpenAI no está disponible, usamos respuestas predefinidas
    if (!openAiAvailable) {
      setTimeout(() => {
        const updatedMessages = [
          ...messages,
          {
            ...newMessage,
            response:
              "La funcionalidad completa de IA estará disponible próximamente. Por favor, intenta con otra pregunta o contacta a nuestro equipo de soporte para obtener ayuda sobre temas financieros específicos.",
          },
        ];
        setMessages(updatedMessages);
        setIsLoading(false);
      }, 1500);
      return;
    }

    try {
      // Si OpenAI está disponible, usamos la API
      const aiResponse = await getFinancialAdvice(inputValue);

      const updatedMessages = [
        ...messages,
        {
          ...newMessage,
          response: aiResponse,
        },
      ];

      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error fetching AI response:", error);

      const updatedMessages = [
        ...messages,
        {
          ...newMessage,
          response:
            "Lo siento, ha ocurrido un error al procesar tu pregunta. Por favor, intenta nuevamente más tarde.",
        },
      ];

      setMessages(updatedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="flex flex-col border-gray-800 bg-black">
      <CardHeader className="border-b border-gray-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-yellow-500" />
              Asistente Financiero
            </CardTitle>
            <CardDescription>Tu consultor IA personalizado</CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="bg-yellow-500 hover:bg-yellow-600">
                  AI Powered
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Potenciado por IA especializada en finanzas</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-0">
        <ScrollArea
          className="max-h-150 min-h-75 flex-1 overflow-auto p-4"
          ref={scrollRef}
        >
          <div className="space-y-4">
            <div className="chat-container">
              {messages.map((msg) => (
                <div key={msg.id} className="chat-message">
                  <div className="clearfix">
                    <div className="message-user">
                      <span className="wrap-break-word whitespace-pre-line">
                        {msg.message}
                      </span>
                      <div className="message-time">
                        {formatDate(msg.timestamp)}
                      </div>
                    </div>
                  </div>

                  <div className="clearfix mt-8">
                    <div className="message-bot">
                      <div className="wrap-break-word whitespace-pre-line">
                        {msg.response}
                      </div>
                      <div className="message-time">
                        {formatDate(
                          new Date(
                            new Date(msg.timestamp).getTime() + 1000,
                          ).toISOString(),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-yellow-500 [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-yellow-500 [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-yellow-500"></div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex items-center space-x-2">
            <Textarea
              placeholder="Haz una pregunta sobre finanzas o inversiones..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-1 resize-none"
            />
            <Button
              size="icon"
              className="shrink-0 bg-yellow-500 hover:bg-yellow-600"
              onClick={handleSendMessage}
              disabled={isLoading || inputValue.trim() === ""}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {!openAiAvailable && (
            <div className="mt-2 flex w-full flex-col gap-2 text-center text-xs text-yellow-400 sm:flex-row sm:items-center sm:justify-between">
              <span className="block sm:w-auto">
                Nota: La funcionalidad completa de IA no está activa.
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() =>
                  window.open("https://platform.openai.com/api-keys", "_blank")
                }
              >
                Obtener API Key
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
