import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Portfolio {
  id: number;
  name: string;
  totalValue: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export const PortfolioSummary = () => {
  // Datos de ejemplo para la visualización de portfolios
  const portfolios: Portfolio[] = [
    {
      id: 1,
      name: "Portafolio Principal",
      totalValue: 45000,
      userId: 1,
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-03-30T00:00:00.000Z"
    },
    {
      id: 2,
      name: "Inversiones a Largo Plazo",
      totalValue: 75000,
      userId: 1,
      createdAt: "2025-01-15T00:00:00.000Z",
      updatedAt: "2025-03-25T00:00:00.000Z"
    }
  ];

  const totalPortfolioValue = portfolios.reduce((total, p) => total + p.totalValue, 0);
  const monthlyChange = 3.45; // Ejemplo de cambio mensual en porcentaje
  const isPositiveChange = monthlyChange >= 0;

  return (
    <Card className="bg-[#1a1400] text-[#ffd700] rounded-xl shadow-lg max-w-md mx-auto p-6">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-1">
          <CardTitle className="text-center w-full mb-4">Resumen de Portafolios</CardTitle>
          <CardDescription className="text-center w-full">Visión general de tus inversiones</CardDescription>
        </div>
        <Button size="sm" className="bg-[#ffd700] hover:bg-[#ffe066] text-[#1a1400] rounded-lg px-4 py-2 font-semibold shadow">
          <PlusCircle className="h-4 w-4 mr-2" />
          Nuevo
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-3 mb-4">
          <span className="text-3xl font-extrabold">${totalPortfolioValue.toLocaleString('es-CO')}</span>
          <span className={`flex items-center text-base font-semibold ${isPositiveChange ? 'text-green-400' : 'text-red-400'}`}>
            {isPositiveChange ? <TrendingUp className="h-5 w-5 mr-1" /> : <TrendingDown className="h-5 w-5 mr-1" />}
            {isPositiveChange ? '+' : ''}{monthlyChange}% este mes
          </span>
        </div>
        <div className="flex flex-col gap-6">
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">{portfolio.name}</span>
                <span className="text-base font-bold">${portfolio.totalValue.toLocaleString('es-CO')}</span>
              </div>
              <Progress
                value={(portfolio.totalValue / totalPortfolioValue) * 100}
                className="h-3 rounded-full bg-[#333] [&>div]:bg-[#ffd700] transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};