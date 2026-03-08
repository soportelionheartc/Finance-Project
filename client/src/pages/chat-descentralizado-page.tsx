import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Users, TrendingUp, DollarSign, Layers } from "lucide-react";

interface Message {
  id: number;
  senderAddress: string;
  senderName?: string;
  content: string;
  timestamp: string;
  topic: string;
  chainId: string;
}

export default function ChatDescentralizadoPage() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar mensajes (simulado)
  useEffect(() => {
    // En producción, esto se haría con una llamada a la API
    const mockMessages: Message[] = [
      {
        id: 1,
        senderAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        senderName: "Trader_Eth",
        content: "¿Cuál es su opinión sobre la tendencia actual de ETH? El análisis técnico muestra un patrón de bandera alcista que podría impulsar los precios a nuevos máximos.",
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        topic: "crypto",
        chainId: "ethereum"
      },
      {
        id: 2,
        senderAddress: "0x6cA529E1D1D727Fa30dA03c11c82f6e7249CEb67",
        senderName: "InversorCrypto123",
        content: "He notado que hay varias noticias positivas sobre la adopción institucional de BTC. ¿Alguien más está siguiendo estos desarrollos?",
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        topic: "crypto",
        chainId: "ethereum"
      },
      {
        id: 3,
        senderAddress: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        senderName: "SolanaTrader",
        content: "Buenos días a todos. ¿Qué opinan de las acciones de tecnología en Colombia? ¿Hay alguna empresa que esté en su radar para inversión?",
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        topic: "stocks",
        chainId: "solana"
      },
      {
        id: 4,
        senderAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        senderName: "Trader_Eth",
        content: "He estado analizando algunas estrategias de DeFi y creo que hay oportunidades interesantes en protocolos de préstamo con tasas superiores al 8% APY.",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        topic: "defi",
        chainId: "ethereum"
      },
      {
        id: 5,
        senderAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        senderName: "BTCHodler",
        content: "¿Alguien tiene experiencia con el mercado bursátil colombiano? Estoy interesado en diversificar mi portafolio más allá de las criptomonedas.",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        topic: "general",
        chainId: "bitcoin"
      },
      {
        id: 6,
        senderAddress: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        senderName: "SolanaTrader",
        content: "Buenos días comunidad, he estado siguiendo las noticias sobre la regulación de criptomonedas en Colombia. Parece que estamos en un momento crucial para la adopción.",
        timestamp: new Date().toISOString(),
        topic: "general",
        chainId: "solana"
      }
    ];

    setMessages(mockMessages);

    // Simular carga de wallets
    const mockWallets = [
      {
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        type: "ethereum",
        label: "Mi Wallet ETH",
      },
      {
        address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        type: "solana",
        label: "Mi Wallet Solana",
      }
    ];
    
    setWallets(mockWallets);
    if (mockWallets.length > 0) {
      setSelectedWallet(mockWallets[0].address);
    }
  }, []);

  // Manejar envío de mensajes
  const handleSendMessage = () => {
    if (message.trim() && selectedWallet) {
      setIsLoading(true);
      
      // Simular envío de mensaje
      setTimeout(() => {
        const newMessage: Message = {
          id: messages.length + 1,
          senderAddress: selectedWallet,
          senderName: user?.username || "Usuario",
          content: message,
          timestamp: new Date().toISOString(),
          topic,
          chainId: wallets.find(w => w.address === selectedWallet)?.type || "ethereum"
        };
        
        setMessages([...messages, newMessage]);
        setMessage("");
        setIsLoading(false);
      }, 1000);
    }
  };

  // Formatear dirección de wallet para mostrarla
  const formatAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener color para la cadena
  const getChainColor = (chainId: string) => {
    switch (chainId) {
      case 'ethereum':
        return 'bg-blue-500/20 text-blue-500';
      case 'solana':
        return 'bg-purple-500/20 text-purple-500';
      case 'bitcoin':
        return 'bg-yellow-500/20 text-yellow-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  // Filtrar mensajes por tema
  const getFilteredMessages = (currentTopic: string) => {
    if (currentTopic === 'all') return messages;
    return messages.filter(msg => msg.topic === currentTopic);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Chat Descentralizado
          </h1>
          <p className="text-muted-foreground">
            Conecta con otros traders y discute sobre blockchain, finanzas e inversiones
          </p>
        </div>

        <Tabs defaultValue="general" className="mt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4 space-y-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Temas</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <TabsList className="w-full grid grid-cols-1 h-auto px-2 py-1 bg-transparent">
                    <TabsTrigger value="all" className="justify-start w-full mb-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Todos los temas
                    </TabsTrigger>
                    <TabsTrigger value="general" className="justify-start w-full mb-1">
                      <Users className="h-4 w-4 mr-2" />
                      General
                    </TabsTrigger>
                    <TabsTrigger value="crypto" className="justify-start w-full mb-1">
                      <Layers className="h-4 w-4 mr-2" />
                      Criptomonedas
                    </TabsTrigger>
                    <TabsTrigger value="stocks" className="justify-start w-full mb-1">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Acciones
                    </TabsTrigger>
                    <TabsTrigger value="defi" className="justify-start w-full">
                      <DollarSign className="h-4 w-4 mr-2" />
                      DeFi
                    </TabsTrigger>
                  </TabsList>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tu Identidad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Selecciona una wallet</p>
                    <Select 
                      value={selectedWallet || ""} 
                      onValueChange={setSelectedWallet}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar wallet" />
                      </SelectTrigger>
                      <SelectContent>
                        {wallets.map((wallet) => (
                          <SelectItem key={wallet.address} value={wallet.address}>
                            {wallet.label} ({formatAddress(wallet.address)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedWallet && (
                    <div className="rounded-lg border border-zinc-800 p-3">
                      <h4 className="text-sm font-medium mb-1">Conectado como:</h4>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {user?.username?.slice(0, 2).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user?.username || "Usuario"}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatAddress(selectedWallet)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-blue-500/20 text-blue-500">TE</AvatarFallback>
                      </Avatar>
                      <p className="text-sm">Trader_Eth</p>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">ETH</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-yellow-500/20 text-yellow-500">BH</AvatarFallback>
                      </Avatar>
                      <p className="text-sm">BTCHodler</p>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">BTC</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-purple-500/20 text-purple-500">ST</AvatarFallback>
                      </Avatar>
                      <p className="text-sm">SolanaTrader</p>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-500 hover:bg-purple-500/30">SOL</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-blue-500/20 text-blue-500">IC</AvatarFallback>
                      </Avatar>
                      <p className="text-sm">InversorCrypto123</p>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">ETH</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:w-3/4">
              <Card className="bg-zinc-900 border-zinc-800 h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle>Chat Descentralizado</CardTitle>
                  <CardDescription>
                    Todo mensaje es almacenado de forma descentralizada en la blockchain seleccionada
                  </CardDescription>
                </CardHeader>
                
                <TabsContent value="all" className="grow p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {getFilteredMessages('all').map((msg) => (
                      <div key={msg.id} className="flex flex-col space-y-1">
                        <div className="flex items-start space-x-2">
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className={`${getChainColor(msg.chainId).split(' ')[0]}`}>
                              {msg.senderName?.slice(0, 2).toUpperCase() || msg.senderAddress.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-zinc-800 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center">
                                <h4 className="text-sm font-medium mr-2">{msg.senderName || formatAddress(msg.senderAddress)}</h4>
                                <Badge className={`${getChainColor(msg.chainId)} text-xs`}>
                                  {msg.chainId.toUpperCase()}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">{formatDate(msg.timestamp)}</span>
                            </div>
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="general" className="grow p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {getFilteredMessages('general').map((msg) => (
                      <div key={msg.id} className="flex flex-col space-y-1">
                        <div className="flex items-start space-x-2">
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className={`${getChainColor(msg.chainId).split(' ')[0]}`}>
                              {msg.senderName?.slice(0, 2).toUpperCase() || msg.senderAddress.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-zinc-800 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center">
                                <h4 className="text-sm font-medium mr-2">{msg.senderName || formatAddress(msg.senderAddress)}</h4>
                                <Badge className={`${getChainColor(msg.chainId)} text-xs`}>
                                  {msg.chainId.toUpperCase()}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">{formatDate(msg.timestamp)}</span>
                            </div>
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="crypto" className="grow p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {getFilteredMessages('crypto').map((msg) => (
                      <div key={msg.id} className="flex flex-col space-y-1">
                        <div className="flex items-start space-x-2">
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className={`${getChainColor(msg.chainId).split(' ')[0]}`}>
                              {msg.senderName?.slice(0, 2).toUpperCase() || msg.senderAddress.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-zinc-800 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center">
                                <h4 className="text-sm font-medium mr-2">{msg.senderName || formatAddress(msg.senderAddress)}</h4>
                                <Badge className={`${getChainColor(msg.chainId)} text-xs`}>
                                  {msg.chainId.toUpperCase()}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">{formatDate(msg.timestamp)}</span>
                            </div>
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="stocks" className="grow p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {getFilteredMessages('stocks').map((msg) => (
                      <div key={msg.id} className="flex flex-col space-y-1">
                        <div className="flex items-start space-x-2">
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className={`${getChainColor(msg.chainId).split(' ')[0]}`}>
                              {msg.senderName?.slice(0, 2).toUpperCase() || msg.senderAddress.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-zinc-800 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center">
                                <h4 className="text-sm font-medium mr-2">{msg.senderName || formatAddress(msg.senderAddress)}</h4>
                                <Badge className={`${getChainColor(msg.chainId)} text-xs`}>
                                  {msg.chainId.toUpperCase()}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">{formatDate(msg.timestamp)}</span>
                            </div>
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="defi" className="grow p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {getFilteredMessages('defi').map((msg) => (
                      <div key={msg.id} className="flex flex-col space-y-1">
                        <div className="flex items-start space-x-2">
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className={`${getChainColor(msg.chainId).split(' ')[0]}`}>
                              {msg.senderName?.slice(0, 2).toUpperCase() || msg.senderAddress.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-zinc-800 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center">
                                <h4 className="text-sm font-medium mr-2">{msg.senderName || formatAddress(msg.senderAddress)}</h4>
                                <Badge className={`${getChainColor(msg.chainId)} text-xs`}>
                                  {msg.chainId.toUpperCase()}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">{formatDate(msg.timestamp)}</span>
                            </div>
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <CardFooter className="border-t border-zinc-800 pt-4">
                  <div className="grid grid-cols-12 gap-2 w-full">
                    <div className="col-span-3">
                      <Select 
                        value={topic} 
                        onValueChange={setTopic}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tema" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="crypto">Criptomonedas</SelectItem>
                          <SelectItem value="stocks">Acciones</SelectItem>
                          <SelectItem value="defi">DeFi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-7">
                      <Input
                        placeholder={selectedWallet ? "Escribe tu mensaje..." : "Conecta una wallet para enviar mensajes"}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        disabled={!selectedWallet || isLoading}
                        className="border-zinc-700 bg-zinc-800"
                      />
                    </div>
                    <div className="col-span-2">
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!selectedWallet || isLoading || !message.trim()}
                        className="w-full bg-primary hover:bg-primary/90 text-black"
                      >
                        {isLoading ? "Enviando..." : "Enviar"}
                        {!isLoading && <Send className="ml-2 h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  );
}