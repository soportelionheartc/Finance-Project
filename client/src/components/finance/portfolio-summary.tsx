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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Resumen de Portafolios</CardTitle>
          <CardDescription>Visión general de tus inversiones</CardDescription>
        </div>
        <Button size="sm" className="bg-[#FFC107] hover:bg-[#FFD54F] text-black">
          <PlusCircle className="h-4 w-4 mr-2" />
          Nuevo
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ${totalPortfolioValue.toLocaleString('es-CO')}
        </div>
        
        <div className="flex items-center mt-1 mb-3">
          <div className={`flex items-center ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
            {isPositiveChange ? 
              <TrendingUp className="h-4 w-4 mr-1" /> : 
              <TrendingDown className="h-4 w-4 mr-1" />
            }
            <span className="text-sm font-medium">
              {isPositiveChange ? '+' : ''}{monthlyChange}% este mes
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{portfolio.name}</div>
                <div className="text-sm font-medium">
                  ${portfolio.totalValue.toLocaleString('es-CO')}
                </div>
              </div>
              <Progress 
                value={(portfolio.totalValue / totalPortfolioValue) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};