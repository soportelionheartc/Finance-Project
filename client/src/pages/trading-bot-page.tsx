import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Bot, Send, BookOpen, LineChart, BarChart2, ArrowDownUp, Settings, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function TradingBotPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("chatbot");
  const [message, setMessage] = useState("");
  const [riskLevel, setRiskLevel] = useState(50);
  const [autoTrading, setAutoTrading] = useState(false);
  
  // Datos de ejemplo - Historial de mensajes
  const [chatHistory, setChatHistory] = useState([
    { 
      role: "user", 
      content: "¿Cómo se está comportando el mercado de criptomonedas hoy?",
      timestamp: new Date(Date.now() - 3600000).toISOString() 
    },
    { 
      role: "bot", 
      content: "El mercado de criptomonedas ha mostrado una tendencia alcista en las últimas 24 horas. Bitcoin ha aumentado un 3.2%, mientras que Ethereum ha subido un 4.5%. El volumen general del mercado ha crecido un 15% respecto a ayer. Los indicadores técnicos sugieren que esta tendencia podría continuar a corto plazo.",
      timestamp: new Date(Date.now() - 3590000).toISOString() 
    },
    { 
      role: "user", 
      content: "¿Qué estrategia recomiendas para Bitcoin en este momento?",
      timestamp: new Date(Date.now() - 2400000).toISOString() 
    },
    { 
      role: "bot", 
      content: "Basado en los indicadores actuales, Bitcoin está mostrando un RSI de 62, lo que indica que aún no ha entrado en territorio de sobrecompra. El MACD también muestra una señal positiva y el volumen está aumentando. Una estrategia prudente sería considerar una posición de compra con un stop loss del 5% por debajo del precio actual y un objetivo de beneficio inicial del 10%. Sin embargo, recomendaría monitorear de cerca los niveles de resistencia alrededor de los $68,500 ya que podría haber cierta resistencia en ese punto.",
      timestamp: new Date(Date.now() - 2390000).toISOString() 
    }
  ]);

  // Ejemplo de estrategias predefinidas
  const strategies = [
    {
      id: 1,
      name: "Momentum Media Móvil",
      description: "Estrategia basada en el cruce de medias móviles de 50 y 200 períodos",
      risk: "Medio",
      timeframe: "Diario",
      assets: ["BTC", "ETH", "S&P 500"],
      active: true,
      performance: {
        month: "+8.2%",
        year: "+32.5%"
      }
    },
    {
      id: 2,
      name: "RSI Sobrecompra/Sobreventa",
      description: "Opera sobre condiciones extremas del RSI",
      risk: "Alto",
      timeframe: "4 horas",
      assets: ["BTC", "ETH", "SOL", "DOT"],
      active: false,
      performance: {
        month: "+12.4%",
        year: "+45.1%"
      }
    },
    {
      id: 3,
      name: "Escalonamiento de Fibonacci",
      description: "Usa retrocesos de Fibonacci para determinar niveles de entrada y salida",
      risk: "Bajo",
      timeframe: "Semanal",
      assets: ["S&P 500", "NASDAQ", "DJI", "BTC"],
      active: true,
      performance: {
        month: "+4.7%",
        year: "+18.3%"
      }
    }
  ];

  // Ejemplo de señales recientes
  const signals = [
    {
      id: 1,
      asset: "BTC/USD",
      type: "COMPRA",
      price: 65432.18,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      strategy: "Momentum Media Móvil",
      status: "ejecutada",
      result: "ganancia"
    },
    {
      id: 2,
      asset: "ETH/USD",
      type: "COMPRA",
      price: 3276.45,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      strategy: "Momentum Media Móvil",
      status: "ejecutada",
      result: "ganancia"
    },
    {
      id: 3,
      asset: "SOL/USD",
      type: "VENTA",
      price: 142.87,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      strategy: "RSI Sobrecompra/Sobreventa",
      status: "ejecutada",
      result: "pérdida"
    },
    {
      id: 4,
      asset: "SPY",
      type: "COMPRA",
      price: 528.92,
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      strategy: "Escalonamiento de Fibonacci",
      status: "ejecutada",
      result: "ganancia"
    },
    {
      id: 5,
      asset: "ADA/USD",
      type: "COMPRA",
      price: 0.57,
      timestamp: new Date().toISOString(),
      strategy: "RSI Sobrecompra/Sobreventa",
      status: "pendiente",
      result: null
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Agregar mensaje del usuario al historial
      setChatHistory([
        ...chatHistory,
        {
          role: "user",
          content: message,
          timestamp: new Date().toISOString()
        }
      ]);
      
      // En producción, aquí se enviaría la solicitud a la API de OpenAI
      // Simulamos una respuesta después de 1 segundo
      setTimeout(() => {
        setChatHistory(prev => [
          ...prev,
          {
            role: "bot",
            content: "Esta es una respuesta de ejemplo del chatbot de trading. En producción, este mensaje sería generado por OpenAI basándose en tu consulta y datos del mercado en tiempo real. La respuesta incluiría análisis de mercado, recomendaciones y posibles estrategias de trading personalizadas a tu perfil de riesgo.",
            timestamp: new Date().toISOString()
          }
        ]);
      }, 1000);
      
      // Limpiar el campo de mensaje
      setMessage("");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Trading Bot & Asistente IA
          </h1>
          <p className="text-muted-foreground">
            Recibe recomendaciones de trading personalizadas y automatiza tus operaciones
          </p>
        </div>

        <Tabs defaultValue="chatbot" value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="chatbot">Chatbot IA</TabsTrigger>
            <TabsTrigger value="strategies">Estrategias</TabsTrigger>
            <TabsTrigger value="signals">Señales</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chatbot">
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-zinc-900 border-zinc-800 h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bot className="mr-2 h-5 w-5 text-primary" />
                    Asistente de Trading IA
                  </CardTitle>
                  <CardDescription>
                    Hazme preguntas sobre el mercado, análisis técnico o estrategias de trading
                  </CardDescription>
                </CardHeader>
                <CardContent className="grow overflow-y-auto space-y-4 pr-2">
                  {chatHistory.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === 'user' 
                            ? 'bg-primary/30 text-white' 
                            : 'bg-gray-800 text-white border border-zinc-700'
                        }`}
                      >
                        <p className="text-sm mb-1">{msg.content}</p>
                        <p className="text-xs text-gray-400 text-right">{formatDate(msg.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t border-zinc-800 pt-4">
                  <div className="flex w-full items-center space-x-2">
                    <Input
                      placeholder="Escribe tu pregunta sobre trading..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="border-zinc-700 bg-zinc-800"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-primary hover:bg-primary/90 text-black"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="strategies">
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="mr-2 h-5 w-5 text-primary" />
                    Estrategias Automatizadas
                  </CardTitle>
                  <CardDescription>
                    Configura y activa estrategias de trading automatizadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {strategies.map((strategy) => (
                    <div 
                      key={strategy.id} 
                      className="border border-zinc-800 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-primary">{strategy.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{strategy.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {strategy.active ? "Activa" : "Inactiva"}
                          </span>
                          <Switch checked={strategy.active} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Riesgo</p>
                          <p className="font-medium">{strategy.risk}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Timeframe</p>
                          <p className="font-medium">{strategy.timeframe}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rendimiento (Mes)</p>
                          <p className={`font-medium ${
                            strategy.performance.month.startsWith('+') 
                              ? 'text-green-500' 
                              : 'text-red-500'
                          }`}>
                            {strategy.performance.month}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rendimiento (Año)</p>
                          <p className={`font-medium ${
                            strategy.performance.year.startsWith('+') 
                              ? 'text-green-500' 
                              : 'text-red-500'
                          }`}>
                            {strategy.performance.year}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Activos</p>
                        <div className="flex flex-wrap gap-2">
                          {strategy.assets.map((asset) => (
                            <span 
                              key={asset} 
                              className="px-2 py-1 text-xs bg-zinc-800 text-primary rounded"
                            >
                              {asset}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button 
                          className="bg-primary hover:bg-primary/90 text-black" 
                          size="sm"
                        >
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t border-zinc-800 pt-4 flex justify-between">
                  <Button variant="outline">
                    Importar Estrategia
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90 text-black">
                    Crear Nueva Estrategia
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="signals">
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ArrowDownUp className="mr-2 h-5 w-5 text-primary" />
                    Señales de Trading
                  </CardTitle>
                  <CardDescription>
                    Señales generadas por tus estrategias automatizadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="">
                  <div className="rounded-md border border-zinc-800">
                    <div className="grid grid-cols-7 gap-4 p-4 font-medium border-b border-zinc-800 text-muted-foreground">
                      <div>Activo</div>
                      <div>Tipo</div>
                      <div>Precio</div>
                      <div>Fecha</div>
                      <div>Estrategia</div>
                      <div>Estado</div>
                      <div>Resultado</div>
                    </div>
                    {signals.map((signal) => (
                      <div 
                        key={signal.id} 
                        className="grid grid-cols-7 gap-4 p-4 border-b border-zinc-800 items-center text-sm"
                      >
                        <div className="font-medium">{signal.asset}</div>
                        <div className={`font-medium ${
                          signal.type === 'COMPRA' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {signal.type}
                        </div>
                        <div>{signal.price.toLocaleString('es-CO', {maximumFractionDigits: 2})}</div>
                        <div>{new Date(signal.timestamp).toLocaleDateString('es-CO')}</div>
                        <div>{signal.strategy}</div>
                        <div>
                          {signal.status === 'ejecutada' ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-500">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Ejecutada
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-500">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Pendiente
                            </span>
                          )}
                        </div>
                        <div>
                          {signal.result ? (
                            signal.result === 'ganancia' ? (
                              <span className="text-green-500 font-medium">Ganancia</span>
                            ) : (
                              <span className="text-red-500 font-medium">Pérdida</span>
                            )
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-zinc-800 pt-4">
                  <Button variant="outline">
                    Ver historial completo
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5 text-primary" />
                    Configuración General
                  </CardTitle>
                  <CardDescription>
                    Ajusta la configuración de tu trading bot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autotrading">Trading Automático</Label>
                      <Switch 
                        id="autotrading" 
                        checked={autoTrading} 
                        onCheckedChange={setAutoTrading} 
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Habilita o deshabilita la ejecución automática de operaciones
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="risk-level">Nivel de Riesgo</Label>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm">Conservador</p>
                      <Slider 
                        id="risk-level"
                        value={[riskLevel]} 
                        min={0} 
                        max={100} 
                        step={1} 
                        onValueChange={(vals) => setRiskLevel(vals[0])} 
                        className="flex-1"
                      />
                      <p className="text-sm">Agresivo</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Define cuánto riesgo estás dispuesto a asumir
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="market-select">Mercados</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="market-select">
                        <SelectValue placeholder="Seleccionar mercados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los mercados</SelectItem>
                        <SelectItem value="crypto">Solo criptomonedas</SelectItem>
                        <SelectItem value="stocks">Solo acciones</SelectItem>
                        <SelectItem value="forex">Solo Forex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="account-size">Tamaño de posición (% de la cuenta)</Label>
                    <Select defaultValue="5">
                      <SelectTrigger id="account-size">
                        <SelectValue placeholder="Seleccionar tamaño" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1% por operación</SelectItem>
                        <SelectItem value="2">2% por operación</SelectItem>
                        <SelectItem value="5">5% por operación</SelectItem>
                        <SelectItem value="10">10% por operación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-trades">Operaciones simultáneas máximas</Label>
                    <Select defaultValue="5">
                      <SelectTrigger id="max-trades">
                        <SelectValue placeholder="Seleccionar máximo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 operaciones</SelectItem>
                        <SelectItem value="5">5 operaciones</SelectItem>
                        <SelectItem value="10">10 operaciones</SelectItem>
                        <SelectItem value="unlimited">Sin límite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-zinc-800 pt-4 flex justify-between">
                  <Button variant="outline">
                    Restablecer valores
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90 text-black">
                    Guardar cambios
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bot className="mr-2 h-5 w-5 text-primary" />
                    Configuración del Asistente IA
                  </CardTitle>
                  <CardDescription>
                    Personaliza el comportamiento del asistente de trading
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ai-personality">Personalidad del Asistente</Label>
                    <Select defaultValue="balanced">
                      <SelectTrigger id="ai-personality">
                        <SelectValue placeholder="Seleccionar personalidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservadora</SelectItem>
                        <SelectItem value="balanced">Equilibrada</SelectItem>
                        <SelectItem value="aggressive">Agresiva</SelectItem>
                        <SelectItem value="technical">Centrada en análisis técnico</SelectItem>
                        <SelectItem value="fundamental">Centrada en análisis fundamental</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Define el enfoque general que tomará el asistente en sus recomendaciones
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ai-language">Idioma preferido</Label>
                    <Select defaultValue="es">
                      <SelectTrigger id="ai-language">
                        <SelectValue placeholder="Seleccionar idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">Inglés</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ai-notifications">Notificaciones del Asistente</Label>
                      <Switch id="ai-notifications" defaultChecked />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recibe notificaciones cuando el asistente detecte oportunidades de mercado
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ai-suggestions">Sugerencias Proactivas</Label>
                      <Switch id="ai-suggestions" defaultChecked />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Permite que el asistente envíe sugerencias sin que las solicites
                    </p>
                  </div>
                  
                  <div className="border-t border-zinc-800 pt-4">
                    <h4 className="text-sm font-medium mb-2">Fuentes de Datos</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="data-technicals">Indicadores Técnicos</Label>
                        <Switch id="data-technicals" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="data-news">Noticias Financieras</Label>
                        <Switch id="data-news" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="data-social">Sentimiento Social</Label>
                        <Switch id="data-social" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="data-macro">Datos Macroeconómicos</Label>
                        <Switch id="data-macro" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-zinc-800 pt-4 flex justify-between">
                  <Button variant="outline">
                    Restablecer valores
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90 text-black">
                    Guardar cambios
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}