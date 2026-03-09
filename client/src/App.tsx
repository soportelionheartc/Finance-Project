import { Switch, Route, useLocation } from "wouter";
import PerfilPage from "@/pages/perfil-page";
import ConfiguracionPage from "@/pages/configuracion-page";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Coins } from "lucide-react";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import FinancialAssistantPage from "@/pages/financial-assistant-page";
import AuthPage from "@/pages/auth-page";
import ServicesPage from "@/pages/services-page";
import PortfolioPage from "@/pages/portafolio-page";
import AboutPage from "@/pages/about-page";
import ContactPage from "@/pages/contact-page";
import LandingPage from "@/pages/landing-page";
import WalletPage from "@/pages/wallet-page";
import NoticiasPage from "@/pages/noticias-page";
import FinanzasPersonalesPage from "@/pages/finanzas-personales-page";
import TradingBotPage from "@/pages/trading-bot-page";
import ChatDescentralizadoPage from "@/pages/chat-descentralizado-page";
import BlockchainPortfolioPage from "@/pages/blockchain-portfolio-page";
import AdminPage from "@/pages/admin-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AdminRoute } from "./lib/admin-route";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import FinanciaPlayPage from "@/pages/FinanciaPlayPage";
import EducacionFinancieraPage from "@/pages/educacion-financiera-page";
import VerifyEmailPage from "@/pages/verify-email-page";


function RouterContent() {
  const [location, setLocation] = useLocation();
  const [showButton, setShowButton] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Solo mostrar el botón si:
    // 1. El usuario está autenticado y es uno de los usuarios especiales (juanpablo13 o jplhc)
    // 2. No estamos en la página de blockchain

    const isBlockchainPage = location.includes('blockchain-portfolio');
    const isSpecialUser = user && (user.username === 'juanpablo13' || user.username === 'jplhc');

    setShowButton(isSpecialUser ? !isBlockchainPage : false);
  }, [location, user]);

  // Manejador para el botón de blockchain
  const handleBlockchainClick = () => {
    setLocation("/blockchain-portfolio");
  };

  return (
    <>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/verify-email" component={VerifyEmailPage} />
        <ProtectedRoute path="/dashboard" component={HomePage} />
        <ProtectedRoute path="/asistente-financiero" component={FinancialAssistantPage} />
        <ProtectedRoute path="/educacion-financiera" component={EducacionFinancieraPage} />
        <ProtectedRoute path="/finanzas-personales" component={FinanzasPersonalesPage} />
        <ProtectedRoute path="/educacion-financiera" component={FinanciaPlayPage} />
        <ProtectedRoute path="/portafolio" component={PortfolioPage} />
        <ProtectedRoute path="/trading-bot" component={TradingBotPage} />
        <ProtectedRoute path="/wallet" component={WalletPage} />
        <ProtectedRoute path="/chat-descentralizado" component={ChatDescentralizadoPage} />
        <ProtectedRoute path="/blockchain-portfolio" component={BlockchainPortfolioPage} />
        <AdminRoute path="/admin" component={AdminPage} />
        <ProtectedRoute path="/perfil" component={PerfilPage} />
        <ProtectedRoute path="/configuracion" component={ConfiguracionPage} />
        <Route path="/servicios" component={ServicesPage} />
        <Route path="/noticias" component={NoticiasPage} />
        <Route path="/nosotros" component={AboutPage} />
        <Route path="/contacto" component={ContactPage} />
        <Route component={NotFound} />
      </Switch>

      {/* Se comenta el botón de blockchain para ser removido en un futuro */}
      {/* {showButton && (
        <button className="blockchain-button" onClick={handleBlockchainClick}>
          <Coins className="h-6 w-6" />
          BLOCKCHAIN
        </button>
      )} */}
    </>
  );
}

function Router() {
  return (
    <AuthProvider>
      <RouterContent />
    </AuthProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
