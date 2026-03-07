import { InvestorQuestionnaire } from "@/components/finance/investor-questionnaire";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function InvestorQuestionnairePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Check if user already has a profile
  const { data: existingProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["/api/investor-profile"],
    retry: false,
  });
  
  const isRetaking = !!existingProfile;
  
  // Mutation for creating or updating profile
  const submitMutation = useMutation({
    mutationFn: async (answers: Record<number, number>) => {
      const method = isRetaking ? "PUT" : "POST";
      const response = await apiRequest(method, "/api/investor-profile", { answers });
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate profile query to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/investor-profile"] });
      
      toast({ 
        title: isRetaking ? "¡Perfil actualizado!" : "¡Perfil completado!",
        description: isRetaking 
          ? "Tu perfil de inversor ha sido actualizado exitosamente."
          : "Tu perfil de inversor ha sido creado exitosamente. Ahora podemos personalizar tu experiencia.",
      });
      
      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1500);
    },
    onError: (error: any) => {
      console.error("Error submitting investor profile:", error);
      toast({ 
        title: "Error al guardar perfil", 
        description: error.message || "Hubo un problema al guardar tu perfil. Por favor, intenta nuevamente.",
        variant: "destructive" 
      });
    }
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              {isRetaking ? "Actualizar Perfil de Inversor" : "Perfil de Inversor"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isRetaking 
                ? "Completa el cuestionario nuevamente para actualizar tu perfil de riesgo."
                : "Responde estas preguntas para ayudarnos a entender tu perfil de inversión y personalizar tu experiencia."}
            </p>
          </div>

          {/* Retaking alert */}
          {isRetaking && (
            <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Estás re-tomando el cuestionario. Tus respuestas anteriores serán reemplazadas.
              </AlertDescription>
            </Alert>
          )}

          {/* Questionnaire Component */}
          <Card>
            <CardContent className="pt-6">
              {isLoadingProfile ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Cargando...</p>
                </div>
              ) : (
                <InvestorQuestionnaire 
                  onComplete={submitMutation.mutate}
                  isLoading={submitMutation.isPending}
                />
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Este cuestionario nos ayuda a recomendarte inversiones adecuadas para tu perfil.
              Puedes volver a tomarlo en cualquier momento desde Configuración.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
