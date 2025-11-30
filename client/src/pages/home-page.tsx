import { Header } from "@/components/layout/header";
import { MarketOverview } from "@/components/finance/market-overview";
import { NewsFeed } from "@/components/finance/news-feed";
import { useAuth } from "@/hooks/use-auth";
import { MessageCircle, Linkedin, Instagram, Facebook, Globe } from "lucide-react";
import { SiKickstarter, SiTiktok, SiTwitch } from "react-icons/si";
import { useState } from "react";
import { useLocation } from "wouter";
import BasicForum from "@/components/basic-forum";
import { Button } from "@/components/ui/button";


const consejosFinancieros = [
  "Diversifica tus inversiones para reducir riesgos.",
  "Establece un fondo de emergencia antes de invertir.",
  "No inviertas dinero que puedas necesitar a corto plazo.",
  "Revisa y ajusta tu portafolio periódicamente.",
  "Evita tomar decisiones impulsivas por emociones.",
  "Infórmate sobre los productos financieros antes de invertir.",
  "Aprovecha el interés compuesto invirtiendo a largo plazo.",
  "No pongas todos tus recursos en un solo activo.",
  "Consulta fuentes confiables y asesores certificados.",
  "Ten claros tus objetivos financieros y plazos."
];

function CarruselConsejos() {
  const [index, setIndex] = useState(0);
  return (
    <div className="relative w-full mx-auto p-4 my-6 flex items-center justify-center min-h-[100px] overflow-hidden">
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-yellow-500 text-black rounded-full p-2 shadow hover:bg-yellow-400 z-10"
        onClick={() => setIndex((prev) => (prev - 1 + consejosFinancieros.length) % consejosFinancieros.length)}
        aria-label="Anterior"
      >
        &larr;
      </button>
      <span className="text-yellow-50 text-center px-8 block max-w-[80%] break-words mx-auto">
        {consejosFinancieros[index]}
      </span>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-500 text-black rounded-full p-2 shadow hover:bg-yellow-400 z-10"
        onClick={() => setIndex((prev) => (prev + 1) % consejosFinancieros.length)}
        aria-label="Siguiente"
      >
        &rarr;
      </button>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(true);
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/5 backdrop-blur-xs">
          <div className="bg-zinc-900 border border-yellow-600 rounded-xl p-6 shadow-lg max-w-sm w-full text-center animate-fade-in relative">
            <button
              className="absolute top-2 right-2 text-yellow-500 bg-transparent text-xl font-bold hover:text-yellow-400 mr-3"
              onClick={() => setShowModal(false)}
              aria-label="Cerrar"
            >
              x
            </button>
            <h4 className="text-lg font-bold text-yellow-500 mb-2">Hola, {user?.name}</h4>
            <p className="text-gray-300 mb-4">Antes de disfrutar de las funcionalidades de la app te queremos dejar algunos consejos financieros</p>
            <CarruselConsejos />
          </div>
        </div>
      )}

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
  <Button
    className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-semibold"
    onClick={() => setLocation('/portafolio')}
  >
    Mis Portafolios
  </Button>

  <Button
    className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-semibold"
    onClick={() => setLocation('/asistente-financiero')}
  >
    Asistente Financiero
  </Button>

  <Button
    className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-semibold"
    onClick={() => setLocation('/educacion-financiera')}
  >
    🎮 Educación Financiera
  </Button>
</div>

        <div className="flex flex-col items-center justify-center space-y-2 mb-6">
          <h1 className="text-4xl font-bold text-primary text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent tracking-tight">
            Hola, {user?.name || user?.username || 'Inversionista'}
          </h1>
          <p className="text-muted-foreground text-center">
            Bienvenido a tu dashboard financiero con IA de Zupi Fintech
          </p>
        </div>
        <CarruselConsejos />

        <div >

          {/* Segunda columna */}
          <div className="space-y-6">
            <MarketOverview />
            <NewsFeed />
          </div>

          <div>
            <BasicForum />
          </div>
        </div>
        
      </main>

      <footer className="border-t py-6 text-sm text-muted-foreground">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
            <div className="w-full md:w-1/2 flex flex-col items-center p-6 rounded-lg shadow-sm">
              <p className="font-semibold text-primary mb-2 text-center">Integración Blockchain</p>
              <p className="text-xs max-w-md text-center text-muted-foreground mb-3">
                Conecta tu wallet de Ethereum para gestionar tus activos digitales y criptomonedas.
              </p>
              <button className="mt-2 px-6 w-[150px] py-2 bg-yellow-500 break-words hover:bg-yellow-400 text-black text-sm font-semibold rounded-lg shadow transition-all">Iniciar Sesión con Blockchain</button>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <h3 className="font-medium text-primary mb-3">Síguenos</h3>
              <div className="flex flex-wrap gap-3 mb-3">
              
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
                  href="https://tiktok.com/@lionheartcapital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="TikTok"
                >
                  <SiTiktok className="h-4 w-4" />
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