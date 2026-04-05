import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { InvestorProfile } from "@shared/schema";

const profileConfig = {
  conservative: {
    label: "Conservador",
    color: "bg-green-500",
    icon: "🛡️",
    description: "Prefieres inversiones seguras y estables con bajo riesgo",
  },
  moderate: {
    label: "Moderado",
    color: "bg-yellow-500",
    icon: "⚖️",
    description: "Equilibras riesgo y retorno en tus inversiones",
  },
  aggressive: {
    label: "Arriesgado",
    color: "bg-red-500",
    icon: "🚀",
    description: "Buscas altos retornos asumiendo mayores riesgos",
  },
} as const;

export default function PerfilPage() {
  const { user } = useAuth();

  const { data: investorProfile, isLoading: isLoadingProfile } =
    useQuery<InvestorProfile>({
      queryKey: ["/api/investor-profile"],
      retry: false,
    });

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Perfil de Usuario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Nombre:</span>{" "}
                  {user?.name || user?.username}
                </div>
                <div>
                  <span className="font-semibold">Correo:</span> {user?.email}
                </div>
                <div>
                  <span className="font-semibold">Rol:</span>{" "}
                  {user?.role === "admin" ? "Administrador" : "Usuario"}
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoadingProfile ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <Loader2 className="text-primary h-6 w-6 animate-spin" />
              </CardContent>
            </Card>
          ) : investorProfile ? (
            <Card>
              <CardHeader>
                <CardTitle>Perfil de Inversor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">
                    {
                      profileConfig[
                        investorProfile.riskProfile as keyof typeof profileConfig
                      ].icon
                    }
                  </span>
                  <div className="flex-1">
                    <Badge
                      className={`${profileConfig[investorProfile.riskProfile as keyof typeof profileConfig].color} px-3 py-1 text-white`}
                    >
                      {
                        profileConfig[
                          investorProfile.riskProfile as keyof typeof profileConfig
                        ].label
                      }
                    </Badge>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {
                        profileConfig[
                          investorProfile.riskProfile as keyof typeof profileConfig
                        ].description
                      }
                    </p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      Puntuación Total:
                    </span>
                    <span className="text-primary text-lg font-bold">
                      {investorProfile.totalScore} puntos
                    </span>
                  </div>
                  {investorProfile.createdAt && (
                    <p className="text-muted-foreground mt-2 text-xs">
                      Completado el{" "}
                      {new Date(investorProfile.createdAt).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-muted-foreground py-8 text-center">
                <p>No has completado tu perfil de inversor aún.</p>
                <p className="mt-2 text-sm">
                  Completa el cuestionario para obtener recomendaciones
                  personalizadas.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
