import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePhantomWallet } from "@/lib/auth/wallet-providers";
import { useEthereumWallet } from "@/lib/auth/wallet-providers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { SendHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Type de los mensajes descentralizados
interface DecentralizedMessage {
  id: number;
  timestamp: Date | null;
  walletId: number | null;
  senderAddress: string;
  content: string;
  topic: string | null;
  transactionHash: string | null;
  chainId: string;
  isEncrypted: boolean | null;
}

// Lista de temas disponibles para el chat
const TOPICS = [
  { value: "general", label: "General" },
  { value: "ethereum", label: "Ethereum" },
  { value: "solana", label: "Solana" },
  { value: "bitcoin", label: "Bitcoin" },
  { value: "trading", label: "Trading" },
  { value: "defi", label: "DeFi" },
  { value: "nft", label: "NFTs" },
  { value: "colombia", label: "Colombia" },
];

// Función para acortar direcciones de wallet
function shortenAddress(address: string): string {
  if (!address) return "";
  return `${address.substring(0, 5)}...${address.substring(address.length - 4)}`;
}

// Componente principal del chat descentralizado
export function DecentralizedChat() {
  const { user } = useAuth();
  const { walletAddress: phantomAddress } = usePhantomWallet();
  const { walletAddress: ethereumAddress } = useEthereumWallet();
  const [message, setMessage] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("general");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Obtener la dirección de wallet activa
  const activeWalletAddress = phantomAddress || ethereumAddress;
  const walletType = phantomAddress ? "solana" : "ethereum";

  // Consulta para obtener los mensajes del tema seleccionado
  const {
    data: messages,
    isLoading,
    refetch,
  } = useQuery<DecentralizedMessage[]>({
    queryKey: ["/api/decentralized-messages", selectedTopic],
    queryFn: async () => {
      const response = await fetch(
        `/api/decentralized-messages?topic=${selectedTopic}`,
      );
      if (!response.ok) {
        throw new Error("Error al cargar los mensajes");
      }
      return response.json();
    },
    refetchInterval: 5000, // Actualizar cada 5 segundos
  });

  // Mutación para enviar mensajes
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: {
      senderAddress: string;
      content: string;
      topic: string;
      chainId: string;
    }) => {
      const res = await apiRequest(
        "POST",
        "/api/decentralized-messages",
        messageData,
      );
      return await res.json();
    },
    onSuccess: () => {
      // Actualizar la lista de mensajes
      queryClient.invalidateQueries({
        queryKey: ["/api/decentralized-messages", selectedTopic],
      });

      // Limpiar el campo de mensaje
      setMessage("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error al enviar el mensaje",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Función para enviar un mensaje
  const handleSendMessage = useCallback(() => {
    if (!message.trim()) return;
    if (!user) {
      toast({
        title: "Debes iniciar sesión",
        description: "Necesitas iniciar sesión para enviar mensajes",
        variant: "destructive",
      });
      return;
    }

    if (!activeWalletAddress) {
      toast({
        title: "Conecta tu wallet",
        description: "Necesitas conectar una wallet para enviar mensajes",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate({
      senderAddress: activeWalletAddress,
      content: message,
      topic: selectedTopic,
      chainId: walletType === "solana" ? "1" : "1", // Mainnets (Solana: 1, Ethereum: 1)
    });
  }, [
    message,
    user,
    activeWalletAddress,
    selectedTopic,
    walletType,
    sendMessageMutation,
    toast,
  ]);

  // Manejar envío con Enter
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Card className="border-zinc-800 bg-zinc-900 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Chat Blockchain</CardTitle>
        <CardDescription>
          Habla con otros usuarios sobre temas financieros y blockchain
        </CardDescription>
        <div className="mt-2 flex">
          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecciona un tema" />
            </SelectTrigger>
            <SelectContent>
              {TOPICS.map((topic) => (
                <SelectItem key={topic.value} value={topic.value}>
                  {topic.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-4 h-[300px] space-y-4 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-400">Cargando mensajes...</p>
            </div>
          ) : messages && messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.senderAddress === activeWalletAddress
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {msg.senderAddress !== activeWalletAddress && (
                  <Avatar className="h-8 w-8 border border-zinc-700">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {msg.senderAddress.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`flex max-w-[75%] flex-col ${
                    msg.senderAddress === activeWalletAddress
                      ? "items-end"
                      : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      msg.senderAddress === activeWalletAddress
                        ? "bg-primary text-primary-foreground"
                        : "bg-zinc-800 text-zinc-100"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <div className="mt-1 flex gap-2 text-xs text-gray-400">
                    <span>{shortenAddress(msg.senderAddress)}</span>
                    <span>•</span>
                    <span>
                      {msg.timestamp
                        ? format(new Date(msg.timestamp), "HH:mm", {
                            locale: es,
                          })
                        : ""}
                    </span>
                  </div>
                </div>
                {msg.senderAddress === activeWalletAddress && (
                  <Avatar className="h-8 w-8 border border-zinc-700">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {msg.senderAddress.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-400">
                No hay mensajes en este canal. ¡Sé el primero en enviar uno!
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="relative w-full">
          <Input
            placeholder="Escribe un mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={
              !user || !activeWalletAddress || sendMessageMutation.isPending
            }
            className="border-zinc-700 bg-zinc-950 pr-10"
          />
          <Button
            size="sm"
            variant="ghost"
            className="text-primary hover:bg-primary/10 absolute top-0 right-0 h-full px-2"
            onClick={handleSendMessage}
            disabled={
              !message.trim() ||
              !user ||
              !activeWalletAddress ||
              sendMessageMutation.isPending
            }
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
