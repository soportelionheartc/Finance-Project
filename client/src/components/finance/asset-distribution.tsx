import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useState } from "react";

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
  const [showInfo, setShowInfo] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center w-full">Distribución de Activos</CardTitle>
        <CardDescription className="text-center w-full">Análisis porcentual de tu portafolio</CardDescription>
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
                outerRadius={70}
                fill="#8884d8"
                dataKey="percentage"
              >
                {assetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string, props: any) => {
                  const { payload } = props;
                  return [`${value}%`, payload.type];
                }}
                labelFormatter={(name, payload) => {
                  if (payload && payload.length > 0) {
                    return payload[0].payload.type;
                  }
                  return '';
                }}
              />
              <Legend
                payload={assetData.map((item, index) => ({
                  id: item.type,
                  type: "square",
                  value: item.type,
                  color: item.color
                }))}
              />
            </PieChart>
          </ResponsiveContainer>
          
        </div>
        <br />
        <Button size="sm" className="bg-[#ffd700] hover:bg-[#ffe066] text-[#1a1400] flex justify-center font-semibold shadow mx-auto" onClick={() => setShowInfo((v) => !v)}>
          {showInfo ? 'Ver menos' : 'Ver más'}
        </Button>
        {showInfo && (
          <>
            <div className="w-[350px] h-[1000px] break-words">
              <h2 className="text-center mt-3">
                Mas graficos
              </h2>
            </div>
            <div>
              <h2 className="text-center mt-3 mb-4">
              Portafolio Archivos
              </h2>
              <form className="flex flex-col items-center gap-4 w-full">
              <input
                type="file"
                className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
              />
              <button type="submit" className="bg-yellow-500 text-black px-4 py-2 rounded font-semibold">
                Subir archivo
              </button>
            </form>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};