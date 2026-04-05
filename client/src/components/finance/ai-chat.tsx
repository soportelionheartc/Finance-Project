import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import {
  sendChatMessages,
  type ChatMessage as APIChatMessage,
} from "@/lib/openai";
import { apiRequest } from "@/lib/queryClient";
import { Brain, Send, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

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

interface DisplayMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const STORAGE_KEY_PREFIX = "ai-chat-history";

function getStorageKey(userId: number | undefined): string {
  return `${STORAGE_KEY_PREFIX}-${userId ?? "anon"}`;
}

function loadMessages(userId: number | undefined): DisplayMessage[] {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMessages(
  userId: number | undefined,
  msgs: DisplayMessage[],
): void {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(msgs));
}

export const AiChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openAiAvailable, setOpenAiAvailable] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check API key and load persisted messages
  useEffect(() => {
    checkSecret("OPENAI_API_KEY").then(setOpenAiAvailable);
    setMessages(loadMessages(user?.id));
  }, [user?.id]);

  // Persist messages on change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(user?.id, messages);
    }
  }, [messages, user?.id]);

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

  const handleClearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(getStorageKey(user?.id));
  }, [user?.id]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;

    const userMsg: DisplayMessage = {
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    // Si OpenAI no está disponible, usamos respuestas predefinidas
    if (!openAiAvailable) {
      setTimeout(() => {
        const fallbackReply: DisplayMessage = {
          role: "assistant",
          content:
            "La funcionalidad completa de IA estará disponible próximamente. Por favor, intenta con otra pregunta o contacta a nuestro equipo de soporte.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, fallbackReply]);
        setIsLoading(false);
      }, 1500);
      return;
    }

    try {
      // Build conversation history for the API
      const apiMessages: APIChatMessage[] = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const aiResponse = await sendChatMessages(apiMessages);

      const assistantMsg: DisplayMessage = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Error fetching AI response:", error);

      const errorMsg: DisplayMessage = {
        role: "assistant",
        content:
          "Lo siento, ha ocurrido un error al procesar tu pregunta. Por favor, intenta nuevamente más tarde.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
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
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-400"
                      onClick={handleClearHistory}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Borrar historial</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
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
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-0">
        <ScrollArea
          className="max-h-150 min-h-75 flex-1 overflow-auto p-4"
          ref={scrollRef}
        >
          <div className="space-y-4">
            <div className="chat-container">
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                  <Brain className="mb-3 h-10 w-10 text-gray-600" />
                  <p className="text-sm">
                    Pregunta sobre finanzas, inversiones o estrategias de
                    portafolio.
                  </p>
                </div>
              )}
              {messages.map((msg, index) => (
                <div key={index} className="chat-message">
                  <div className="clearfix">
                    <div
                      className={
                        msg.role === "user" ? "message-user" : "message-bot"
                      }
                    >
                      <span className="wrap-break-word whitespace-pre-line">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </span>
                      <div className="message-time">
                        {formatDate(msg.timestamp)}
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
