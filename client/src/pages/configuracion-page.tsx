import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCircle, AlertCircle } from "lucide-react";
import { INVESTOR_PROFILES } from "@/lib/investor-questions";
import type { InvestorProfileType } from "@/lib/investor-questions";

interface InvestorProfileResponse {
  id: number;
  userId: number;
  riskProfile: InvestorProfileType;
  totalScore: number;
  answers: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export default function ConfiguracionPage() {
  // Fetch investor profile
  const { data: profile, isLoading: isLoadingProfile } =
    useQuery<InvestorProfileResponse>({
      queryKey: ["/api/investor-profile"],
      retry: false,
    });

  const profileData = profile ? INVESTOR_PROFILES[profile.riskProfile] : null;

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          {/* Page Title */}
          <h1 className="text-center text-3xl font-bold">Configuración</h1>

          {/* Investor Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserCircle className="text-primary h-5 w-5" />
                <CardTitle>Perfil de Inversor</CardTitle>
              </div>
              <CardDescription>
                Gestiona tu perfil de riesgo y preferencias de inversión
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingProfile ? (
                <div className="py-4 text-center">
                  <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Cargando perfil...
                  </p>
                </div>
              ) : profile && profileData ? (
                <>
                  <div className="bg-muted/50 flex items-center justify-between rounded-lg p-4">
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm">
                        Tu perfil actual:
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          style={{
                            backgroundColor: profileData.color,
                            color: "#000",
                          }}
                          className="px-3 py-1 text-base"
                        >
                          {profileData.label}
                        </Badge>
                        <span className="text-muted-foreground text-sm">
                          • {profileData.description}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-muted-foreground text-sm">
                    Última actualización:{" "}
                    {new Date(profile.updatedAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  <Link href="/investor-questionnaire">
                    <Button variant="outline" className="w-full">
                      Re-tomar Cuestionario de Perfil
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                        No has completado tu perfil de inversor
                      </p>
                      <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                        Completa el cuestionario para recibir recomendaciones
                        personalizadas de inversión.
                      </p>
                    </div>
                  </div>

                  <Link href="/investor-questionnaire">
                    <Button className="w-full">
                      Completar Perfil de Inversor
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>

          {/* User Preferences Card */}
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de usuario</CardTitle>
              <CardDescription>
                Aquí podrás modificar tus preferencias y ajustes personales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Próximamente: Configuración de notificaciones, idioma, tema, y
                  más.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
