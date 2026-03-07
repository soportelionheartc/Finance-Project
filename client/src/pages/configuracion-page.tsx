import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
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
    const { data: profile, isLoading: isLoadingProfile } = useQuery<InvestorProfileResponse>({
        queryKey: ["/api/investor-profile"],
        retry: false,
    });

    const profileData = profile ? INVESTOR_PROFILES[profile.riskProfile] : null;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl mx-auto space-y-6">
                    {/* Page Title */}
                    <h1 className="text-3xl font-bold text-center">Configuración</h1>

                    {/* Investor Profile Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <UserCircle className="h-5 w-5 text-primary" />
                                <CardTitle>Perfil de Inversor</CardTitle>
                            </div>
                            <CardDescription>
                                Gestiona tu perfil de riesgo y preferencias de inversión
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoadingProfile ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                    <p className="mt-2 text-sm text-muted-foreground">Cargando perfil...</p>
                                </div>
                            ) : profile && profileData ? (
                                <>
                                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Tu perfil actual:</p>
                                            <div className="flex items-center gap-2">
                                                <Badge 
                                                    style={{ 
                                                        backgroundColor: profileData.color,
                                                        color: '#000'
                                                    }}
                                                    className="text-base px-3 py-1"
                                                >
                                                    {profileData.label}
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    • {profileData.description}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="text-sm text-muted-foreground">
                                        Última actualización: {new Date(profile.updatedAt).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
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
                                    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                                        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                                No has completado tu perfil de inversor
                                            </p>
                                            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                                Completa el cuestionario para recibir recomendaciones personalizadas de inversión.
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
                                <p className="text-sm text-muted-foreground">
                                    Próximamente: Configuración de notificaciones, idioma, tema, y más.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
