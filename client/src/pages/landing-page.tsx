import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, DollarSign, BarChart, Zap, Send, MessageCircle, Newspaper } from "lucide-react";
import { Link } from "wouter";
import { LionLogo } from "@/components/ui/lion-logo";
import { useIsMobile } from "@/hooks/use-mobile";
import { SiKickstarter } from "react-icons/si";
import FinancialNewsFeed from "@/components/finance/financial-news-feed";
import { MarketOverview } from "@/components/finance/market-overview";

export default function LandingPage() {
  const isMobile = useIsMobile();
  const [chatMessage, setChatMessage] = useState("");
  const [showChatAlert, setShowChatAlert] = useState(false);

  // Datos de mercados globales
  const usaMarketData = [
    { name: 'S&P 500', value: '4.779,05', change: '+0.71%', isPositive: true },
    { name: 'Dow Jones', value: '38.635,06', change: '+0.54%', isPositive: true },
    { name: 'Nasdaq', value: '16.201,83', change: '+0.93%', isPositive: true },
    { name: 'Russell 2000', value: '2.051,14', change: '+0.61%', isPositive: true },
  ];

  const bvcMarketData = [
    { name: 'COLCAP', value: '1.095,43', change: '+0.62%', isPositive: true },
    { name: 'Ecopetrol', value: '2.845,00', change: '+1.2%', isPositive: true },
    { name: 'Bancolombia', value: '34.200,00', change: '+0.85%', isPositive: true },
    { name: 'Grupo Aval', value: '671,00', change: '-0.3%', isPositive: false },
  ];

  const cryptoMarketData = [
    { name: 'BTC/USD', value: '42.406,66', change: '+2.08%', isPositive: true },
    { name: 'ETH/USD', value: '2.591,31', change: '+1.40%', isPositive: true },
    { name: 'SOL/USD', value: '163,85', change: '+3.27%', isPositive: true },
    { name: 'XRP/USD', value: '0,5081', change: '-0.92%', isPositive: false },
  ];

  const forexData = [
    { name: 'EUR/USD', value: '1,0916', change: '-0.36%', isPositive: false },
    { name: 'USD/COP', value: '3.876,42', change: '-0.52%', isPositive: false },
    { name: 'GBP/USD', value: '1,2703', change: '+0.14%', isPositive: true },
    { name: 'USD/JPY', value: '147,93', change: '+0.28%', isPositive: true },
  ];

  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-gradient-to-r from-primary/20 to-black p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LionLogo className="h-10 w-10" />
            <div>
              <h1 className="font-bold text-lg text-gradient bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                FINANCE 360°
              </h1>
              <p>Zupi Fintech</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-primary text-primary"
            size="sm"
            onClick={() => (window.location.href = "/auth")}
          >
            Acceder
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 space-y-8">
        {/* Hero Section */}
        <section className="grid gap-8 items-center py-6">
          <div className="space-y-4 flex flex-col items-center text-center bg-gradient-to-br from-primary/20 to-transparent rounded-xl shadow-[0_2px_16px_0_rgba(255,215,0,0.10)] px-8 py-10">
            <h2 className="text-4xl font-bold text-primary">FINANCE 360°</h2>
            <h3 className="text-xl text-white mb-2">
              FINANZAS E INVERSIONES DE ALTO IMPACTO
            </h3>
            <p className="text-gray-300 text-lg mb-6">
              Soluciones financieras inteligentes impulsadas por IA para
              optimizar tus inversiones y estrategias de trading.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="/servicios">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary"
                >
                  Explorar Servicios
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Mercados Globales con datos en tiempo real */}
        <section className="space-y-6">
          <h3 className="font-bold text-xl text-primary uppercase">
            Mercados Globales
          </h3>
          <MarketOverview />
        </section>

        {/* Financial News Section */}
        <section className="space-y-6">
          <h3 className="font-bold text-xl text-primary uppercase flex items-center">
            <Newspaper className="mr-2 h-5 w-5" />
            Noticias Financieras
          </h3>
          <FinancialNewsFeed />
        </section>

        {/*{/* Premium Features 
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-primary uppercase">Servicios Financieros Premium</h3>
            <Button
              variant="outline"
              className="text-primary border-primary"
              onClick={() => window.location.href = "/auth"}
            >
              Acceder <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-zinc-900 border border-zinc-700">
              <CardContent className="p-4 space-y-3">
                <div className="bg-primary/30 p-2 rounded-full w-fit">
                  <BarChart className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-medium text-white">Análisis de Portafolios</h4>
                <p className="text-sm text-gray-400">
                  Analiza el rendimiento de tus inversiones y recibe recomendaciones personalizadas basadas en IA.
                </p>
                <Button
                  variant="ghost"
                  className="mt-2 text-primary p-0 h-auto"
                  onClick={() => window.location.href = "/auth"}
                >
                  Iniciar Sesión para Acceder
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border border-zinc-700">
              <CardContent className="p-4 space-y-3">
                <div className="bg-primary/30 p-2 rounded-full w-fit">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-medium text-white">Trading Automatizado</h4>
                <p className="text-sm text-gray-400">
                  Aprovecha estrategias algorítmicas basadas en medias móviles y la potencia de la IA.
                </p>
                <Button
                  variant="ghost"
                  className="mt-2 text-primary p-0 h-auto"
                  onClick={() => window.location.href = "/auth"}
                >
                  Iniciar Sesión para Acceder
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border border-zinc-700">
              <CardContent className="p-4 space-y-3">
                <div className="bg-primary/30 p-2 rounded-full w-fit">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-medium text-white">Integración Blockchain</h4>
                <p className="text-sm text-gray-400">
                  Conecta tu wallet de Ethereum, Solana, Bitcoin para gestionar tus activos digitales y criptomonedas.
                </p>
                <Button
                  variant="ghost"
                  className="mt-2 text-primary p-0 h-auto"
                  onClick={() => window.location.href = "/auth"}
                >
                  Iniciar Sesión para Acceder
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* AI Chat (Free) 
        <section className="space-y-4">
          <h3 className="font-bold text-xl text-primary uppercase">Asesoría Financiera IA</h3>
          <Card className="bg-zinc-900 border border-zinc-700">
            <CardContent className="p-4 space-y-3">
              <p className="text-sm text-gray-400">
                Resuelve tus dudas sobre inversiones, finanzas personales, mercados y más con nuestro asistente de IA especializado.
              </p>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Pregunta sobre finanzas e inversiones..."
                  className="w-full p-3 pr-12 rounded-md bg-black/50 border border-zinc-700 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
                <Button
                  size="icon"
                  className="absolute right-1 top-1 bottom-1 bg-black border border-primary text-primary"
                  onClick={() => {
                    setShowChatAlert(true);
                    setChatMessage("");
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
                {showChatAlert && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-yellow-600 rounded-xl p-6 shadow-lg max-w-sm w-full text-center animate-fade-in">
                      <h4 className="text-lg font-bold text-yellow-500 mb-2">Acceso requerido</h4>
                      <p className="text-gray-300 mb-4">Para disfrutar de la experiencia completa del Chat IA, por favor inicia sesión.</p>
                      <Button className="bg-yellow-500 text-black font-semibold px-6 mt-2" onClick={() => window.location.href = "/auth"}>
                        Ir a iniciar sesión
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>*/}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 p-6 text-center text-sm text-gray-400">
        <div className="container mx-auto">
          <div className="text-center">
            <p className="font-medium text-primary">Zupi Fintech S.A.S.</p>
            <p className="mt-2">Contacto: lionheartcapital1303@gmail.com</p>
          </div>

          <div className="mt-8">
            <p>¡Próximamente en App Store y Google Play!</p>
            <p className="text-xs mt-1">
              Descarga nuestra aplicación móvil para acceder a todas las
              funcionalidades desde tu dispositivo.
            </p>
          </div>

          <div className="mt-4">
            © {new Date().getFullYear()} Zupi Fintech. Todos los derechos
            reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}