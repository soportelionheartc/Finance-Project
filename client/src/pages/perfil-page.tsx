
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { InvestorProfile } from "@shared/schema";

const profileConfig = {
  conservative: { label: "Conservador", color: "bg-green-500", icon: "🛡️", description: "Prefieres inversiones seguras y estables con bajo riesgo" },
  moderate: { label: "Moderado", color: "bg-yellow-500", icon: "⚖️", description: "Equilibras riesgo y retorno en tus inversiones" },
  aggressive: { label: "Arriesgado", color: "bg-red-500", icon: "🚀", description: "Buscas altos retornos asumiendo mayores riesgos" }
} as const;

export default function PerfilPage() {
    const { user } = useAuth();
    
    const { data: investorProfile, isLoading: isLoadingProfile } = useQuery<InvestorProfile>({
      queryKey: ["/api/investor-profile"],
      retry: false,
    });
    
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center text-2xl">Perfil de Usuario</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <span className="font-semibold">Nombre:</span> {user?.name || user?.username}
                                </div>
                                <div>
                                    <span className="font-semibold">Correo:</span> {user?.email}
                                </div>
                                <div>
                                    <span className="font-semibold">Rol:</span> {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {isLoadingProfile ? (
                      <Card>
                        <CardContent className="flex justify-center items-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </CardContent>
                      </Card>
                    ) : investorProfile ? (
                      <Card>
                        <CardHeader>
                          <CardTitle>Perfil de Inversor</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="text-4xl">{profileConfig[investorProfile.riskProfile as keyof typeof profileConfig].icon}</span>
                            <div className="flex-1">
                              <Badge className={`${profileConfig[investorProfile.riskProfile as keyof typeof profileConfig].color} text-white px-3 py-1`}>
                                {profileConfig[investorProfile.riskProfile as keyof typeof profileConfig].label}
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-2">
                                {profileConfig[investorProfile.riskProfile as keyof typeof profileConfig].description}
                              </p>
                            </div>
                          </div>
                          <div className="border-t pt-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold">Puntuación Total:</span>
                              <span className="text-lg font-bold text-primary">{investorProfile.totalScore} puntos</span>
                            </div>
                            {investorProfile.createdAt && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Completado el {new Date(investorProfile.createdAt).toLocaleDateString('es-ES', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                          <p>No has completado tu perfil de inversor aún.</p>
                          <p className="text-sm mt-2">Completa el cuestionario para obtener recomendaciones personalizadas.</p>
                        </CardContent>
                      </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
