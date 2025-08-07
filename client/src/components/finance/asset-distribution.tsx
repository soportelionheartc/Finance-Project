import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface AssetCategory {
  type: string;
  percentage: number;
  color: string;
}

export const AssetDistribution = () => {
  // Datos de ejemplo para el gráfico de distribución
  const assetData: AssetCategory[] = [
    { type: "Acciones", percentage: 40, color: "#FFB547" },
    { type: "Bonos", percentage: 20, color: "#FF7847" },
    { type: "Fondos", percentage: 15, color: "#4777FF" },
    { type: "Criptomonedas", percentage: 15, color: "#47DAFF" },
    { type: "Efectivo", percentage: 10, color: "#47FF9D" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Activos</CardTitle>
        <CardDescription>Análisis porcentual de tu portafolio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={assetData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percentage }) => `${type}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="percentage"
              >
                {assetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${value}%`}
                labelFormatter={(name) => `Categoría`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};