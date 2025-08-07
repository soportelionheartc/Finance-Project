import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Wallet,
  BarChart3,
  LineChart,
  Layers,
  CandlestickChart,
  PieChart,
  Coins,
  ChevronRight,
  RefreshCcw,
  Zap,
  TrendingUp,
  Sparkles,
  BrainCircuit,
  MessageSquare,
  Users,
  Rocket,
  Send,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Calculator,
  Bot,
  CircleDollarSign
} from "lucide-react";
import {
  SiSolana,
  SiEthereum,
  SiJupyter,
  SiBitcoin
} from "react-icons/si";

// Tipos simulados para los activos de blockchain
type BlockchainAsset = {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  balance: number;
  price: number;
  value: number;
  change24h: number;
  chain: 'solana' | 'ethereum' | 'bitcoin';
  lastUpdated: string;
  apy?: number;
  protocol?: string;
};

type WalletType = 'phantom' | 'metamask' | 'none';
type TabType = 'overview' | 'assets' | 'analytics' | 'ai' | 'chat';

export default function BlockchainPortfolioPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState<TabType>('overview');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<WalletType>('none');
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
  const [portfolioChange, setPortfolioChange] = useState(0);
  const [chatMessage, setChatMessage] = useState('');
  const [showAiInsights, setShowAiInsights] = useState(false);
  
  // Datos de ejemplo para activos blockchain
  const [assets, setAssets] = useState<BlockchainAsset[]>([
    {
      id: '1',
      name: 'Solana',
      symbol: 'SOL',
      logo: 'solana',
      balance: 12.5,
      price: 178.45,
      value: 2230.63,
      change24h: 5.2,
      chain: 'solana',
      lastUpdated: new Date().toISOString(),
      apy: 6.8,
      protocol: 'Marinade'
    },
    {
      id: '2',
      name: 'Ethereum',
      symbol: 'ETH',
      logo: 'ethereum',
      balance: 0.85,
      price: 3547.12,
      value: 3015.05,
      change24h: 2.1,
      chain: 'ethereum',
      lastUpdated: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Bitcoin',
      symbol: 'BTC',
      logo: 'bitcoin',
      balance: 0.035,
      price: 67890.32,
      value: 2376.16,
      change24h: -1.3,
      chain: 'bitcoin',
      lastUpdated: new Date().toISOString()
    },
    {
      id: '4',
      name: 'USDC',
      symbol: 'USDC',
      logo: 'solana',
      balance: 1250,
      price: 1,
      value: 1250,
      change24h: 0,
      chain: 'solana',
      lastUpdated: new Date().toISOString(),
      apy: 4.2,
      protocol: 'Jupiter'
    },
    {
      id: '5',
      name: 'Raydium',
      symbol: 'RAY',
      logo: 'solana',
      balance: 325,
      price: 2.15,
      value: 698.75,
      change24h: 12.4,
      chain: 'solana',
      lastUpdated: new Date().toISOString()
    },
    {
      id: '6',
      name: 'Chainlink',
      symbol: 'LINK',
      logo: 'ethereum',
      balance: 25,
      price: 15.67,
      value: 391.75,
      change24h: 4.8,
      chain: 'ethereum',
      lastUpdated: new Date().toISOString()
    }
  ]);

  // Historial de chat
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      role: 'system',
      content: 'Bienvenido al chat descentralizado de Lion Heart Capital. Discute sobre blockchain, inversiones y criptomonedas con otros usuarios y nuestro asistente IA.'
    },
    {
      id: 2,
      role: 'assistant',
      content: 'Hola, soy el asistente IA de Lion Heart. Puedo ayudarte con análisis de mercado, estrategias de inversión y responder preguntas sobre blockchain.',
      sender: 'AI Assistant'
    },
    {
      id: 3,
      role: 'user',
      content: '¿Cómo se ve el mercado de Solana hoy?',
      sender: 'Carlos R.'
    },
    {
      id: 4,
      role: 'assistant',
      content: 'Solana ha mostrado un incremento del 5.2% en las últimas 24 horas. El sentimiento es positivo con el aumento en la actividad de desarrollo y nuevos protocolos DeFi lanzados en su ecosistema.',
      sender: 'AI Assistant'
    }
  ]);

  // Actualizar el valor total del portafolio cuando cambian los activos
  useEffect(() => {
    // Calcular el valor total
    const total = assets.reduce((sum, asset) => sum + asset.value, 0);
    setTotalPortfolioValue(total);
    
    // Calcular el cambio porcentual ponderado
    const weightedChange = assets.reduce((sum, asset) => {
      const weight = asset.value / total;
      return sum + (asset.change24h * weight);
    }, 0);
    
    setPortfolioChange(parseFloat(weightedChange.toFixed(2)));
  }, [assets]);

  // Función para conectar wallet
  const connectWallet = async (walletType: WalletType) => {
    setIsLoading(true);
    
    // Simular una conexión de wallet (en producción esto llamaría a las APIs reales de wallet)
    setTimeout(() => {
      setIsWalletConnected(true);
      setConnectedWallet(walletType);
      
      // Dirección de wallet simulada
      const address = walletType === 'phantom' 
        ? 'GkVazF5UWAjqXY7SZRsD9W7N5Ur9RUeHiTaF7c2dTTA2'
        : '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
      
      setWalletAddress(address);
      
      toast({
        title: "Wallet conectada",
        description: `${walletType === 'phantom' ? 'Phantom' : 'MetaMask'} conectada correctamente`,
      });
      
      setIsLoading(false);
    }, 1500);
  };

  // Función para desconectar wallet
  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setConnectedWallet('none');
    setWalletAddress('');
    
    toast({
      title: "Wallet desconectada",
      description: "Tu wallet ha sido desconectada correctamente",
    });
  };

  // Función para actualizar datos (simulado)
  const refreshData = () => {
    setIsLoading(true);
    
    // Simulación de actualización de datos
    setTimeout(() => {
      // Actualizar precios y cambios con pequeñas variaciones aleatorias
      const updatedAssets = assets.map(asset => {
        const priceChange = asset.price * (Math.random() * 0.02 - 0.01); // -1% a +1%
        const newPrice = asset.price + priceChange;
        const changeVariation = Math.random() * 2 - 1; // -1% a +1% 
        
        return {
          ...asset,
          price: parseFloat(newPrice.toFixed(2)),
          value: parseFloat((asset.balance * newPrice).toFixed(2)),
          change24h: parseFloat((asset.change24h + changeVariation).toFixed(2)),
          lastUpdated: new Date().toISOString()
        };
      });
      
      setAssets(updatedAssets);
      setIsLoading(false);
      
      toast({
        title: "Datos actualizados",
        description: "Los precios y saldos han sido actualizados",
      });
    }, 1500);
  };

  // Función para enviar mensaje al chat
  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;
    
    // Añadir mensaje del usuario
    const newUserMessage = {
      id: chatHistory.length + 1,
      role: 'user',
      content: chatMessage,
      sender: user?.name || user?.username || 'Usuario'
    };
    
    setChatHistory([...chatHistory, newUserMessage]);
    setChatMessage('');
    
    // Simular respuesta de IA
    setTimeout(() => {
      let aiResponse;
      
      // Respuestas simuladas basadas en palabras clave
      if (chatMessage.toLowerCase().includes('solana')) {
        aiResponse = "Solana continúa siendo una de las blockchains más rápidas del mercado con 65,000 TPS. Su ecosistema DeFi ha crecido un 24% en 2025 hasta la fecha.";
      } else if (chatMessage.toLowerCase().includes('bitcoin') || chatMessage.toLowerCase().includes('btc')) {
        aiResponse = "Bitcoin mantiene su posición como el activo digital principal. La adopción institucional sigue aumentando, especialmente tras la aprobación de los ETFs de Bitcoin en 2023.";
      } else if (chatMessage.toLowerCase().includes('portafolio') || chatMessage.toLowerCase().includes('portfolio')) {
        aiResponse = "Basado en el análisis de tu portafolio actual, la diversificación entre Ethereum, Solana y Bitcoin proporciona un buen equilibrio. Consideraría aumentar la exposición a stablecoins dado el actual entorno de mercado volátil.";
      } else if (chatMessage.toLowerCase().includes('predict') || chatMessage.toLowerCase().includes('predi')) {
        aiResponse = "Aunque no puedo predecir precios exactos, los indicadores fundamentales para Ethereum indican un potencial alcista a largo plazo debido a la transición a PoS y las mejoras de escalabilidad.";
      } else {
        aiResponse = "Gracias por tu mensaje. El mercado crypto ha mostrado volatilidad reciente, pero los fundamentales siguen fuertes para proyectos con utilidad real y adopción creciente.";
      }
      
      const newAiMessage = {
        id: chatHistory.length + 2,
        role: 'assistant',
        content: aiResponse,
        sender: 'AI Assistant'
      };
      
      setChatHistory(prevHistory => [...prevHistory, newAiMessage]);
    }, 1000);
  };

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Obtener logo para activos
  const getAssetLogo = (asset: BlockchainAsset) => {
    switch (asset.chain) {
      case 'solana':
        return <SiSolana className="h-6 w-6 text-purple-500" />;
      case 'ethereum':
        return <SiEthereum className="h-6 w-6 text-blue-500" />;
      case 'bitcoin':
        return <SiBitcoin className="h-6 w-6 text-orange-500" />;
      default:
        return <Coins className="h-6 w-6 text-primary" />;
    }
  };

  // Determinar qué usuario tiene permitido ver esta página
  const isAuthorizedUser = user?.username === 'jplhc' || user?.username === 'juanpablo13' || isWalletConnected;
  
  // Función para manejar el botón de Blockchain
  const handleBlockchainButton = () => {
    // Mostrar toast indicando que se está conectando
    toast({
      title: "Conectando a Blockchain",
      description: "Iniciando conexión con la cadena de bloques...",
    });
    
    // Simular proceso de conexión con un pequeño retraso
    setTimeout(() => {
      // Mostrar toast de éxito
      toast({
        title: "Blockchain Conectada",
        description: "Conexión establecida correctamente con la red blockchain.",
      });
      
      // Establecer la conexión
      setIsWalletConnected(true);
      setConnectedWallet('phantom');
      setWalletAddress('GkVazF5UWAjqXY7SZRsD9W7N5Ur9RUeHiTaF7c2dTTA2');
    }, 1500);
  };

  if (!isAuthorizedUser) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="w-full max-w-3xl bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border-zinc-800 shadow-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl text-primary">Portafolio Blockchain Avanzado</CardTitle>
              <CardDescription>
                Conecta tu wallet para acceder al análisis avanzado con IA
              </CardDescription>
            </CardHeader>
            <CardContent className="py-8 px-4 sm:px-8">
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Wallet className="h-12 w-12 text-primary" />
                </div>
                <p className="text-center max-w-lg text-muted-foreground">
                  Conecta tu wallet para ver tu portafolio en tiempo real, analizar tu rendimiento 
                  con inteligencia artificial, y acceder al chat descentralizado exclusivo.
                </p>
              </div>
              
              {/* Botón Blockchain prominente */}
              <div className="mb-6">
                <Button 
                  onClick={handleBlockchainButton} 
                  disabled={isLoading}
                  className="w-full h-20 text-xl font-bold flex items-center justify-center bg-gradient-to-br from-yellow-500 to-yellow-600 border-none text-black shadow-lg shadow-yellow-900/20 hover:shadow-yellow-900/30 hover:from-yellow-600 hover:to-yellow-700 transition-all"
                >
                  <Coins className="h-7 w-7 mr-3" />
                  BLOCKCHAIN
                </Button>
              </div>
              
              {/* Botones Wallets */}
              <div className="grid grid-cols-1 gap-3">
                <p className="text-center text-sm text-muted-foreground mb-1">O conecta usando:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button 
                    onClick={() => connectWallet('phantom')} 
                    disabled={isLoading}
                    variant="outline"
                    className="h-14 text-base flex items-center justify-center"
                  >
                    <Wallet className="h-5 w-5 mr-2" />
                    <span>Phantom</span>
                  </Button>
                  
                  <Button 
                    onClick={() => connectWallet('metamask')} 
                    disabled={isLoading}
                    variant="outline"
                    className="h-14 text-base flex items-center justify-center"
                  >
                    <Wallet className="h-5 w-5 mr-2" />
                    <span>MetaMask</span>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-zinc-800 pt-4">
              <p className="text-sm text-muted-foreground text-center">
                Análisis avanzado exclusivo para usuarios de Lion Heart Capital
              </p>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Encabezado */}
        <div className="flex flex-col space-y-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Portafolio Blockchain
              </h1>
              <p className="text-muted-foreground mb-4 md:mb-0">
                Análisis avanzado y gestión con IA
              </p>
            </div>
            
            {/* Botón de Blockchain siempre visible */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleBlockchainButton}
                disabled={isLoading}
                className="flex items-center justify-center bg-gradient-to-br from-yellow-500 to-yellow-600 border-none h-12 text-black font-bold shadow-lg shadow-yellow-900/20 hover:shadow-yellow-900/30 hover:from-yellow-600 hover:to-yellow-700 transition-all"
                size="lg"
              >
                <Coins className="h-6 w-6 mr-2" />
                <span className="font-medium">BLOCKCHAIN</span>
              </Button>
              
              {isWalletConnected ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="text-sm bg-zinc-900 px-3 py-2 rounded border border-zinc-800 mb-2 sm:mb-0">
                    <div className="font-medium">
                      {connectedWallet === 'phantom' ? 'Phantom' : 'MetaMask'}
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {walletAddress}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={refreshData}
                      disabled={isLoading}
                      className="h-10"
                    >
                      <RefreshCcw className="h-4 w-4 mr-1" />
                      <span>Actualizar</span>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={disconnectWallet}
                      disabled={isLoading}
                      className="h-10"
                    >
                      <span>Desconectar</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={() => connectWallet('phantom')} 
                    disabled={isLoading}
                    className="flex items-center justify-center h-10"
                    variant="outline"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    <span>Phantom</span>
                  </Button>
                  <Button 
                    onClick={() => connectWallet('metamask')} 
                    disabled={isLoading}
                    className="flex items-center justify-center h-10"
                    variant="outline"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    <span>MetaMask</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {isLoading && (
          <div className="w-full mb-6">
            <p className="text-sm mb-2 text-center">Actualizando datos...</p>
            <Progress value={45} className="h-1" />
          </div>
        )}
        
        <Tabs defaultValue="overview" className="space-y-6" onValueChange={(v) => setSelectedTab(v as TabType)}>
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 md:w-[600px]">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="assets">Activos</TabsTrigger>
            <TabsTrigger value="analytics">Análisis</TabsTrigger>
            <TabsTrigger value="ai">IA Insights</TabsTrigger>
            <TabsTrigger value="chat">Chat <span className="ml-1 text-xs rounded-full bg-primary/20 px-1.5">4</span></TabsTrigger>
          </TabsList>
          
          {/* Tab Resumen */}
          <TabsContent value="overview" className="space-y-6">
            {/* Panel de valor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800 md:col-span-2">
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">Valor Total del Portafolio</CardTitle>
                    <SiJupyter className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-bold text-primary">
                      {formatCurrency(totalPortfolioValue)}
                    </div>
                    <Badge className={`ml-2 ${portfolioChange >= 0 ? 
                      "bg-green-500/10 text-green-500 border-green-500/20" : 
                      "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                      <div className="flex items-center gap-1">
                        {portfolioChange >= 0 ? "+" : ""}{portfolioChange}%
                        {portfolioChange >= 0 ? 
                          <ArrowUp className="h-3 w-3 text-green-500" /> : 
                          <ArrowDown className="h-3 w-3 text-red-500" />
                        }
                      </div>
                    </Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Solana</p>
                      <p className="text-sm font-medium">
                        {formatCurrency(assets.filter(a => a.chain === 'solana').reduce((sum, asset) => sum + asset.value, 0))}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Ethereum</p>
                      <p className="text-sm font-medium">
                        {formatCurrency(assets.filter(a => a.chain === 'ethereum').reduce((sum, asset) => sum + asset.value, 0))}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Bitcoin</p>
                      <p className="text-sm font-medium">
                        {formatCurrency(assets.filter(a => a.chain === 'bitcoin').reduce((sum, asset) => sum + asset.value, 0))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-1">
                  <CardTitle className="text-base font-medium">Rendimiento</CardTitle>
                </CardHeader>
                <CardContent className="pt-1 grid gap-2">
                  <div className="flex justify-between items-baseline">
                    <div className="text-sm">Hoy</div>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${portfolioChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {portfolioChange >= 0 ? "+" : ""}{portfolioChange}%
                      </span>
                      {portfolioChange >= 0 ? 
                        <ArrowUp className="h-3 w-3 text-green-500 ml-1" /> : 
                        <ArrowDown className="h-3 w-3 text-red-500 ml-1" />
                      }
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <div className="text-sm">7 días</div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-green-500">+3.4%</span>
                      <ArrowUp className="h-3 w-3 text-green-500 ml-1" />
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <div className="text-sm">30 días</div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-green-500">+12.7%</span>
                      <ArrowUp className="h-3 w-3 text-green-500 ml-1" />
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <div className="text-sm">Total 2025</div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-green-500">+27.8%</span>
                      <ArrowUp className="h-3 w-3 text-green-500 ml-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Activos principales */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Activos Principales</CardTitle>
                  <Coins className="h-4 w-4 text-primary" />
                </div>
                <CardDescription>
                  Top activos por valor en el portafolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assets.sort((a, b) => b.value - a.value).slice(0, 3).map(asset => (
                    <div key={asset.id} className="flex items-start justify-between p-2 rounded-md bg-black/40">
                      <div className="flex items-center gap-3">
                        {getAssetLogo(asset)}
                        <div>
                          <p className="font-medium">{asset.symbol}</p>
                          <p className="text-xs text-muted-foreground">{asset.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(asset.value)}</p>
                        <div className="flex items-center justify-end mt-1">
                          <span 
                            className={`text-xs ${
                              asset.change24h > 0 ? 'text-green-500' : 
                              asset.change24h < 0 ? 'text-red-500' : 'text-gray-500'
                            }`}
                          >
                            {asset.change24h > 0 ? '+' : ''}{asset.change24h}%
                          </span>
                          {asset.change24h > 0 ? 
                            <ArrowUp className="h-3 w-3 text-green-500 ml-1" /> : 
                            asset.change24h < 0 ? 
                            <ArrowDown className="h-3 w-3 text-red-500 ml-1" /> :
                            <ArrowRight className="h-3 w-3 text-gray-500 ml-1" />
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setSelectedTab('assets')}>
                  Ver todos los activos
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* Insights IA */}
            <Card className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Insights de IA</CardTitle>
                  <BrainCircuit className="h-4 w-4 text-primary" />
                </div>
                <CardDescription>
                  Análisis inteligente de tu portafolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="bg-primary/10 border-primary/20">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <AlertDescription className="mt-2">
                    <p className="font-medium text-sm mb-1">Tu portafolio está bien diversificado entre las principales blockchains</p>
                    <p className="text-xs text-muted-foreground">
                      El 42% en Solana, 33% en Ethereum y 25% en Bitcoin proporciona una buena exposición a diferentes ecosistemas.
                    </p>
                  </AlertDescription>
                </Alert>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3 p-2 rounded-md bg-black/40">
                    <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">SOL muestra un potencial alcista significativo</p>
                      <p className="text-xs text-muted-foreground">
                        Con un aumento del 5.2% hoy, la tendencia técnica es positiva.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-2 rounded-md bg-black/40">
                    <Zap className="h-4 w-4 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Oportunidad de staking detectada</p>
                      <p className="text-xs text-muted-foreground">
                        Podrías ganar un 6.8% APY adicional con tu balance de SOL.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => setSelectedTab('ai')}>
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Ver análisis completo de IA
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Tab Activos */}
          <TabsContent value="assets" className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Todos los Activos</CardTitle>
                  <Layers className="h-4 w-4 text-primary" />
                </div>
                <CardDescription>
                  Desglose completo de tu portafolio blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assets.sort((a, b) => b.value - a.value).map(asset => (
                    <div key={asset.id} className="flex items-start justify-between p-3 rounded-md bg-black/40">
                      <div className="flex items-center gap-3">
                        {getAssetLogo(asset)}
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium">{asset.symbol}</p>
                            {asset.apy && (
                              <div className="ml-2 px-1.5 py-0.5 bg-primary/10 rounded text-xs text-primary">
                                +{asset.apy}% APY
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{asset.name}</p>
                          {asset.protocol && (
                            <p className="text-xs text-primary">{asset.protocol}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(asset.value)}</p>
                        <p className="text-xs text-muted-foreground">{asset.balance} {asset.symbol}</p>
                        <div className="flex items-center justify-end mt-1">
                          <span 
                            className={`text-xs ${
                              asset.change24h > 0 ? 'text-green-500' : 
                              asset.change24h < 0 ? 'text-red-500' : 'text-gray-500'
                            }`}
                          >
                            {asset.change24h > 0 ? '+' : ''}{asset.change24h}%
                          </span>
                          {asset.change24h > 0 ? 
                            <ArrowUp className="h-3 w-3 text-green-500 ml-1" /> : 
                            asset.change24h < 0 ? 
                            <ArrowDown className="h-3 w-3 text-red-500 ml-1" /> :
                            <ArrowRight className="h-3 w-3 text-gray-500 ml-1" />
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Distribución por Blockchain</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[250px] flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="h-16 w-16 mx-auto text-primary opacity-50" />
                      <p className="text-sm mt-4 text-muted-foreground">
                        Gráfica de distribución por blockchain
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="flex flex-col items-center p-2 rounded bg-black/40">
                      <SiSolana className="h-5 w-5 text-purple-500 mb-1" />
                      <span className="text-xs font-medium">Solana</span>
                      <span className="text-xs text-primary">42%</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded bg-black/40">
                      <SiEthereum className="h-5 w-5 text-blue-500 mb-1" />
                      <span className="text-xs font-medium">Ethereum</span>
                      <span className="text-xs text-primary">33%</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded bg-black/40">
                      <SiBitcoin className="h-5 w-5 text-orange-500 mb-1" />
                      <span className="text-xs font-medium">Bitcoin</span>
                      <span className="text-xs text-primary">25%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Rendimiento vs Mercado</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[250px] flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="h-16 w-16 mx-auto text-primary opacity-50" />
                      <p className="text-sm mt-4 text-muted-foreground">
                        Gráfica de rendimiento comparativo
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground pt-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                      <span>Tu portafolio</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                      <span>BTC</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span>ETH</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Tab Análisis */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-base font-medium">Análisis de Rendimiento</CardTitle>
                <CardDescription>
                  Evolución histórica de tu portafolio
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 mx-auto text-primary opacity-50" />
                    <p className="text-sm mt-4 text-muted-foreground">
                      Gráfica de evolución temporal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Correlación de Activos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] flex items-center justify-center">
                    <div className="text-center">
                      <CandlestickChart className="h-16 w-16 mx-auto text-primary opacity-50" />
                      <p className="text-sm mt-4 text-muted-foreground">
                        Matriz de correlación entre activos
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Volatilidad vs Retorno</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="h-16 w-16 mx-auto text-primary opacity-50" />
                      <p className="text-sm mt-4 text-muted-foreground">
                        Análisis de riesgo vs rendimiento
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Proyección de Crecimiento</CardTitle>
                <CardDescription>
                  Simulación de Monte Carlo a 12 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-16 w-16 mx-auto text-primary opacity-50" />
                    <p className="text-sm mt-4 text-muted-foreground">
                      Proyección probabilística de escenarios
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center p-2 rounded-md bg-black/40">
                    <span className="text-sm font-medium">Escenario Optimista</span>
                    <span className="text-green-500 font-medium">+62%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-md bg-black/40">
                    <span className="text-sm font-medium">Escenario Base</span>
                    <span className="text-primary font-medium">+38%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-md bg-black/40">
                    <span className="text-sm font-medium">Escenario Conservador</span>
                    <span className="text-amber-500 font-medium">+12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab IA Insights */}
          <TabsContent value="ai" className="space-y-6">
            <Card className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-medium">Análisis IA de tu Portafolio</CardTitle>
                  <BrainCircuit className="h-5 w-5 text-primary" />
                </div>
                <CardDescription>
                  Insights avanzados generados por inteligencia artificial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2 text-primary">Resumen Ejecutivo</h3>
                  <p className="text-sm text-muted-foreground">
                    Tu portafolio blockchain está bien diversificado con una asignación estratégica entre Solana (42%), 
                    Ethereum (33%) y Bitcoin (25%). Esta distribución proporciona tanto exposición a activos establecidos 
                    como a ecosistemas con alto potencial de crecimiento.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium mb-1 text-primary">Fortalezas</h3>
                  
                  <div className="flex items-start gap-3 p-3 rounded-md bg-black/40">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Diversificación óptima entre cadenas</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        La distribución actual reduce el riesgo específico de una sola blockchain. 
                        Tu portafolio tiene mayor resistencia a eventos adversos en ecosistemas individuales.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-md bg-black/40">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Posición fuerte en Solana (SOL)</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Solana ha mostrado un crecimiento sostenido con un aumento del 5.2% en las últimas 24h.
                        El ecosistema Solana continúa expandiéndose con nuevos protocolos DeFi y NFT.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium mb-1 text-primary">Oportunidades</h3>
                  
                  <div className="flex items-start gap-3 p-3 rounded-md bg-black/40">
                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <Zap className="h-3.5 w-3.5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Oportunidad de staking de Solana</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Podrías obtener un rendimiento adicional del 6.8% APY depositando tu SOL 
                        en Marinade Finance. Esto representaría aproximadamente {formatCurrency(2230.63 * 0.068)} anuales.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-md bg-black/40">
                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <CircleDollarSign className="h-3.5 w-3.5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Diversificación en DeFi</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Considera asignar una parte de tus USDC a protocolos como Jupiter para 
                        obtener rendimientos pasivos del 4.2% APY con bajo riesgo.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button
                  className="w-full"
                  onClick={() => setShowAiInsights(!showAiInsights)}
                >
                  {showAiInsights ? 'Ocultar análisis completo' : 'Ver análisis completo'}
                </Button>
                
                {showAiInsights && (
                  <div className="space-y-4 mt-2 pt-4 border-t border-zinc-800">
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-primary">Proyección de Mercado</h3>
                      <p className="text-sm text-muted-foreground">
                        El mercado de criptomonedas está mostrando señales alcistas a mediano plazo, con Bitcoin 
                        recuperándose después de la última corrección. Los indicadores fundamentales para Ethereum 
                        son positivos debido a la implementación de mejoras de escalabilidad. Solana continúa 
                        creciendo en adopción, especialmente en el espacio DeFi.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-primary">Recomendaciones</h3>
                      <div className="space-y-3">
                        <div className="p-3 rounded-md bg-black/40">
                          <p className="text-sm font-medium text-primary">Corto plazo (1-3 meses)</p>
                          <ul className="mt-1 space-y-1 pl-4 text-xs text-muted-foreground list-disc">
                            <li>Implementa staking de SOL para obtener rendimientos pasivos</li>
                            <li>Mantén liquidez en USDC para aprovechar oportunidades de compra</li>
                          </ul>
                        </div>
                        
                        <div className="p-3 rounded-md bg-black/40">
                          <p className="text-sm font-medium text-primary">Mediano plazo (3-6 meses)</p>
                          <ul className="mt-1 space-y-1 pl-4 text-xs text-muted-foreground list-disc">
                            <li>Considera aumentar tu exposición en ETH si el precio rompe la resistencia de $3,800</li>
                            <li>Explora tokens del ecosistema Solana con fundamentales sólidos</li>
                          </ul>
                        </div>
                        
                        <div className="p-3 rounded-md bg-black/40">
                          <p className="text-sm font-medium text-primary">Largo plazo (6-12 meses)</p>
                          <ul className="mt-1 space-y-1 pl-4 text-xs text-muted-foreground list-disc">
                            <li>Mantén una estrategia de DCA (Dollar Cost Averaging) para BTC</li>
                            <li>Revisa tu diversificación entre blockchains trimestralmente</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-primary">Riesgos y Mitigación</h3>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-zinc-800">
                            <th className="text-left pb-2">Riesgo</th>
                            <th className="text-left pb-2">Impacto</th>
                            <th className="text-left pb-2">Mitigación</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          <tr className="border-b border-zinc-800/50">
                            <td className="py-2">Volatilidad del mercado</td>
                            <td className="py-2">Alto</td>
                            <td className="py-2">Diversificación entre clases de activos</td>
                          </tr>
                          <tr className="border-b border-zinc-800/50">
                            <td className="py-2">Riesgos regulatorios</td>
                            <td className="py-2">Medio</td>
                            <td className="py-2">Mantener un % en stablecoins</td>
                          </tr>
                          <tr>
                            <td className="py-2">Fallos técnicos</td>
                            <td className="py-2">Bajo</td>
                            <td className="py-2">Uso de wallets seguras como Phantom</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <Separator />
              
              <CardFooter className="flex flex-col items-stretch pt-4">
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button variant="outline" className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Optimizar Portafolio
                  </Button>
                  <Button className="w-full">
                    <Bot className="h-4 w-4 mr-2" />
                    Consultar al Asistente
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Tab Chat */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-medium">Chat Descentralizado</CardTitle>
                    <CardDescription>
                      Discusiones sobre blockchain, criptomonedas e inversiones
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">24 online</span>
                  </div>
                </div>
              </CardHeader>
              
              <ScrollArea className="h-[400px] px-4">
                <div className="space-y-4 pb-4">
                  {chatHistory.map((message) => {
                    if (message.role === 'system') {
                      return (
                        <div key={message.id} className="bg-primary/10 text-xs text-center p-2 rounded-md text-primary">
                          {message.content}
                        </div>
                      );
                    } else if (message.role === 'assistant') {
                      return (
                        <div key={message.id} className="flex items-start gap-2">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                              AI
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-black/40 rounded-md p-3 w-full">
                            <div className="text-xs text-primary font-medium">{message.sender}</div>
                            <div className="text-sm mt-1">{message.content}</div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={message.id} className="flex items-start gap-2 flex-row-reverse">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="bg-zinc-800 text-primary text-xs">
                              {message.sender?.substring(0, 2).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-primary/10 rounded-md p-3 w-full">
                            <div className="text-xs text-primary font-medium">{message.sender}</div>
                            <div className="text-sm mt-1">{message.content}</div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </ScrollArea>
              
              <CardFooter className="pt-2 pb-4 px-4">
                <div className="flex w-full gap-2">
                  <Input
                    placeholder="Escribe un mensaje..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendChatMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendChatMessage}
                    disabled={!chatMessage.trim()}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="w-full mt-4">
                  <p className="text-xs text-muted-foreground text-center">
                    Este chat está diseñado para discusiones relacionadas con blockchain e inversiones. 
                    Los asistentes IA pueden proporcionar información general, pero no consejos financieros personalizados.
                  </p>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}