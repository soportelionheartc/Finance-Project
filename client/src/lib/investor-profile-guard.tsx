import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface InvestorProfileGuardProps {
  children: React.ReactNode;
}

export function InvestorProfileGuard({ children }: InvestorProfileGuardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/investor-profile"],
    retry: false,
  });
  
  useEffect(() => {
    if (!isLoading && !profile) {
      toast({
        title: "Perfil de inversor requerido",
        description: "Completa tu perfil para acceder a esta funcionalidad",
        variant: "destructive",
      });
      setLocation("/investor-questionnaire");
    }
  }, [isLoading, profile, setLocation, toast]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando perfil...</p>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return null; // Will redirect via useEffect
  }
  
  return <>{children}</>;
}
