import { InvestorQuestionnaire } from "@/components/finance/investor-questionnaire";
import { Header } from "@/components/layout/header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";

export default function InvestorQuestionnairePage() {
  const { toast } = useToast();

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
      const response = await apiRequest(method, "/api/investor-profile", {
        answers,
      });
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
    },
    onError: (error: any) => {
      console.error("Error submitting investor profile:", error);
      toast({
        title: "Error al guardar perfil",
        description:
          error.message ||
          "Hubo un problema al guardar tu perfil. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />

      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Page Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              {isRetaking
                ? "Actualizar Perfil de Inversor"
                : "Perfil de Inversor"}
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              {isRetaking
                ? "Completa el cuestionario nuevamente para actualizar tu perfil de riesgo."
                : "Responde estas preguntas para ayudarnos a entender tu perfil de inversión y personalizar tu experiencia."}
            </p>
          </div>

          {/* Retaking alert */}
          {isRetaking && (
            <Alert className="flex items-center">
              <Info />
              <AlertDescription>
                Estás re-tomando el cuestionario. Tus respuestas anteriores
                serán reemplazadas.
              </AlertDescription>
            </Alert>
          )}

          {/* Questionnaire Component */}
          <Card>
            <CardContent className="pt-6">
              {isLoadingProfile ? (
                <div className="py-12 text-center">
                  <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2"></div>
                  <p className="text-muted-foreground mt-4">Cargando...</p>
                </div>
              ) : (
                <InvestorQuestionnaire
                  onComplete={submitMutation.mutate}
                  isLoading={submitMutation.isPending}
                  onClose={() => {}}
                />
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="text-muted-foreground text-center text-sm">
            <p>
              Este cuestionario nos ayuda a recomendarte inversiones adecuadas
              para tu perfil. Puedes volver a tomarlo en cualquier momento desde
              Configuración.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
