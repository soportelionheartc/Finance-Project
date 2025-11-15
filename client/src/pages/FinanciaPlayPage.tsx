import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { useEffect, useState } from "react";

export default function FinanciaPlayPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/assets/data/financiaPlay.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Error cargando FinanciaPlay:", err));
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              Educación Financiera 💡
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!data ? (
              <p className="text-center text-muted-foreground">
                Cargando contenido...
              </p>
            ) : (
              <div className="space-y-6">
                <p className="text-center font-medium">
                  Plataforma: {data.meta.product} | Versión {data.meta.version}
                </p>

                <div className="grid gap-4">
                  {data.levels.map((lvl: any) => (
                    <Card key={lvl.id} className="p-4">
                      <CardTitle>{lvl.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-2">
                        {lvl.description}
                      </p>
                      <p className="text-sm">
                        🔓 Requiere {lvl.pointsToUnlock} puntos
                      </p>
                      <Button className="mt-3 w-full">
                        Jugar Nivel {lvl.id}
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
