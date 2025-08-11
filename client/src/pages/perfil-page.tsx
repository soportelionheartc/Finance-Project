
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";

export default function PerfilPage() {
    const { user } = useAuth();
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center">
                <Card className="w-full max-w-md mx-auto">
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
            </main>
        </div>
    );
}
