import { Header } from "@/components/layout/header";
import { MarketOverview } from "@/components/finance/market-overview";
import { NewsFeed } from "@/components/finance/news-feed";
import { useAuth } from "@/hooks/use-auth";
import {
  MessageCircle,
  Linkedin,
  Instagram,
  Facebook,
  Globe,
} from "lucide-react";
import { SiKickstarter, SiTiktok, SiTwitch } from "react-icons/si";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import BasicForum from "@/components/basic-forum";
import { Button } from "@/components/ui/button";
import { VerificationBanner } from "@/components/auth/verification-banner";
import { InvestorProfileModal } from "@/components/investor-profile-modal";
import { useQuery } from "@tanstack/react-query";

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
  "Ten claros tus objetivos financieros y plazos.",
];

function CarruselConsejos() {
  const [index, setIndex] = useState(0);
  return (
    <div className="relative mx-auto my-6 flex min-h-[100px] w-full items-center justify-center overflow-hidden p-4">
      <button
        className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-yellow-500 p-2 text-black shadow-sm hover:bg-yellow-400"
        onClick={() =>
          setIndex(
            (prev) =>
              (prev - 1 + consejosFinancieros.length) %
              consejosFinancieros.length,
          )
        }
        aria-label="Anterior"
      >
        &larr;
      </button>
      <span className="mx-auto block max-w-[80%] px-8 text-center wrap-break-word text-yellow-50">
        {consejosFinancieros[index]}
      </span>
      <button
        className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-yellow-500 p-2 text-black shadow-sm hover:bg-yellow-400"
        onClick={() =>
          setIndex((prev) => (prev + 1) % consejosFinancieros.length)
        }
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

  // Check if user has completed investor profile
  const { data: investorProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["/api/investor-profile"],
    retry: false,
    enabled: !!user,
  });

  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    // Show profile modal if user is authenticated, email verified, loading complete, and no profile exists
    if (user && user.isEmailVerified && !isLoadingProfile && !investorProfile) {
      setShowProfileModal(true);
    }
  }, [user, investorProfile, isLoadingProfile]);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />

      {/* Verification Banner for unverified users */}
      <div className="container mx-auto px-4 pt-4">
        <VerificationBanner />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/5 backdrop-blur-xs">
          <div className="animate-fade-in relative w-full max-w-sm rounded-xl border border-yellow-600 bg-zinc-900 p-6 text-center shadow-lg">
            <button
              className="absolute top-2 right-2 mr-3 bg-transparent text-xl font-bold text-yellow-500 hover:text-yellow-400"
              onClick={() => setShowModal(false)}
              aria-label="Cerrar"
            >
              x
            </button>
            <h4 className="mb-2 text-lg font-bold text-yellow-500">
              Hola, {user?.name}
            </h4>
            <p className="mb-4 text-gray-300">
              Antes de disfrutar de las funcionalidades de la app te queremos
              dejar algunos consejos financieros
            </p>
            <CarruselConsejos />
          </div>
        </div>
      )}

      <main className="container mx-auto flex-1 px-4 py-6">
        <div className="mt-4 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
          <Button
            className="w-full rounded-xl border border-yellow-500 bg-black font-semibold text-yellow-500 shadow-md transition-all duration-200 hover:bg-yellow-600 hover:text-black"
            onClick={() => setLocation("/portafolio")}
          >
            💼 Mis Portafolios
          </Button>

          <Button
            className="w-full rounded-xl border border-yellow-500 bg-black font-semibold text-yellow-500 shadow-md transition-all duration-200 hover:bg-yellow-600 hover:text-black"
            onClick={() => setLocation("/asistente-financiero")}
          >
            🤖 Asistente Financiero
          </Button>

          <Button
            className="w-full rounded-xl border border-yellow-500 bg-black font-semibold text-yellow-500 shadow-md transition-all duration-200 hover:bg-yellow-600 hover:text-black"
            onClick={() => setLocation("/financiaplay")}
          >
            🎮 FinanciaPlay
          </Button>
        </div>

        <div className="mb-6 flex flex-col items-center justify-center space-y-2">
          <h1 className="bg-linear-to-r from-yellow-400 to-yellow-600 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent">
            Hola, {user?.name || user?.username || "Inversionista"}
          </h1>
          <p className="text-muted-foreground text-center">
            Bienvenido a tu dashboard financiero con IA de Zupi Fintech
          </p>
        </div>
        <CarruselConsejos />

        <div>
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

      <footer className="text-muted-foreground border-t py-6 text-sm">
        <div className="container mx-auto">
          <div className="mb-4 flex flex-col items-center justify-center">
            <h3 className="text-primary mb-3 font-medium">Síguenos</h3>
            <div className="mb-3 flex flex-wrap gap-3">
              <a
                href="https://linkedin.com/company/lionheartcapital"
                target="_blank"
                rel="noopener noreferrer"
                className="border-primary/30 text-primary hover:bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full border bg-black transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://tiktok.com/@lionheartcapital"
                target="_blank"
                rel="noopener noreferrer"
                className="border-primary/30 text-primary hover:bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full border bg-black transition-all"
                aria-label="TikTok"
              >
                <SiTiktok size={4} />
              </a>
              <a
                href="https://instagram.com/lionheartcapital"
                target="_blank"
                rel="noopener noreferrer"
                className="border-primary/30 text-primary hover:bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full border bg-black transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com/lionheartcapital"
                target="_blank"
                rel="noopener noreferrer"
                className="border-primary/30 text-primary hover:bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full border bg-black transition-all"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://lionheartcapital.com"
                target="_blank"
                rel="noopener noreferrer"
                className="border-primary/30 text-primary hover:bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full border bg-black transition-all"
                aria-label="Website"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-4 text-center">
            © {new Date().getFullYear()} Zupi Fintech Todos los derechos
            reservados.
          </div>
        </div>
      </footer>

      {/* Investor Profile Modal */}
      <InvestorProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
}
