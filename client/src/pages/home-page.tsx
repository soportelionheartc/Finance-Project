import { Header } from "@/components/layout/header";
import { AssetDistribution } from "@/components/finance/asset-distribution";
import { PortfolioSummary } from "@/components/finance/portfolio-summary";
import { MarketOverview } from "@/components/finance/market-overview";
import { NewsFeed } from "@/components/finance/news-feed";
import { AiChat } from "@/components/finance/ai-chat";
import { AssetList } from "@/components/finance/asset-list";
import { useAuth } from "@/hooks/use-auth";
import { MessageCircle, Linkedin, Instagram, Facebook, Globe } from "lucide-react";
import { SiKickstarter, SiTiktok, SiTwitch } from "react-icons/si";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Hola, {user?.name || user?.username || 'Inversionista'}
          </h1>
          <p className="text-muted-foreground">
            Bienvenido a tu dashboard financiero con IA de Lion Heart Capital
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Primera columna */}
          <div className="space-y-6">
            <PortfolioSummary />
            <AssetDistribution />
          </div>

          {/* Segunda columna */}
          <div className="space-y-6">
            <MarketOverview />
            <NewsFeed />
          </div>

          {/* Tercera columna */}
          <div className="space-y-6">
            <AiChat />
            <AssetList />
          </div>
        </div>
      </main>

      <footer className="border-t py-6 text-sm text-muted-foreground">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
            <div>
              <p className="font-medium text-primary mb-2">Integración Blockchain</p>
              <p className="text-xs max-w-md">
                Conecta tu wallet de Ethereum para gestionar tus activos digitales y criptomonedas.
              </p>
              <button className="mt-2 px-4 py-2 bg-yellow-500 text-black text-xs font-medium rounded">Iniciar Sesión para Acceder</button>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <h3 className="font-medium text-primary mb-3">Síguenos</h3>
              <div className="flex flex-wrap gap-3 mb-3">
                <a 
                  href="https://wa.me/+573000000000" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
                <a 
                  href="https://linkedin.com/company/lionheartcapital" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a 
                  href="https://kick.com/lionheartcapital" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="Kick"
                >
                  <SiKickstarter className="h-4 w-4" />
                </a>
                <a 
                  href="https://tiktok.com/@lionheartcapital" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="TikTok"
                >
                  <SiTiktok className="h-4 w-4" />
                </a>
                <a 
                  href="https://twitch.tv/lionheartcapital" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="Twitch"
                >
                  <SiTwitch className="h-4 w-4" />
                </a>
                <a 
                  href="https://instagram.com/lionheartcapital" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a 
                  href="https://facebook.com/lionheartcapital" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a 
                  href="https://lionheartcapital.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="Website"
                >
                  <Globe className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          <div className="text-center border-t border-gray-800 pt-4">
            © {new Date().getFullYear()} Lion Heart Capital S.A.S. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}