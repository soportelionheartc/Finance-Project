import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { useLocation } from "wouter";

export function VerificationBanner() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isDismissed, setIsDismissed] = useState(false);

  // Leer estado de dismissal desde localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem("verificationBannerDismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    }
  }, []);

  // Solo mostrar el banner si:
  // 1. El usuario está autenticado
  // 2. El correo NO está verificado
  // 3. El banner NO ha sido dismissed
  const shouldShowBanner = user && !user.isEmailVerified && !isDismissed;

  if (!shouldShowBanner) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("verificationBannerDismissed", "true");
  };

  const handleVerify = () => {
    setLocation("/verify-email");
  };

  return (
    <Alert className="bg-primary/20 border-primary/50 relative mb-4">
      <AlertTriangle className="text-primary h-5 w-5" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1 pr-8">
          <p className="font-medium text-white">
            Por favor verifica tu correo electrónico
          </p>
          <p className="mt-1 text-sm text-gray-300">
            Revisa tu bandeja de entrada y confirma tu cuenta para acceder a
            todas las funciones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleVerify}
            size="sm"
            className="bg-primary hover:bg-primary/90 font-semibold text-black"
          >
            Verificar ahora
          </Button>
          <Button
            onClick={handleDismiss}
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-gray-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
