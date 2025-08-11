
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";

export default function ConfiguracionPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl">Configuración</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <span className="font-semibold">Preferencias de usuario</span>
                                <p className="text-sm text-muted-foreground">Aquí podrás modificar tus preferencias y ajustes personales.</p>
                            </div>
                            {/* Agrega aquí los campos de configuración que desees */}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
