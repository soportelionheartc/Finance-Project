import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useState, useEffect } from "react";

type AssetCategory = {
  type: string;
  percentage: number;
  color: string;
};

const ASSET_LABELS: Record<string, string> = {
  crypto: "Cripto",
  stock: "Acción",
  etf: "ETF-Fondos",
  bond: "RentaFija",
  cash: "Efectivo",
};

// Colores para cada tipo de activo
const ASSET_COLORS: Record<string, string> = {
  crypto: "#47DAFF",
  stock: "#b829ceff",
  etf: "#FF7847",
  bond: "#14389bff",
  cash: "#0fc52dff",
}

export const AssetDistribution = () => {
  const [assetData, setAssetData] = useState<AssetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    async function fetchAssets() {
      try {
        // 1. Obtener todos los portafolios del usuario
        const portfoliosRes = await fetch("/api/portfolios");
        if (!portfoliosRes.ok) throw new Error("Error al obtener portafolios");
        const portfolios = await portfoliosRes.json();

        // 2. Obtener los activos de cada portafolio
        let allAssets: any[] = [];
        for (const portfolio of portfolios) {
          const assetsRes = await fetch(`/api/portfolios/${portfolio.id}/assets`);
          if (assetsRes.ok) {
            const assets = await assetsRes.json();
            allAssets = allAssets.concat(assets);
          }
        }

        // 3. Agrupar por tipo y calcular porcentajes
        const totalValue = allAssets.reduce((sum, asset) => sum + (asset.value || 0), 0);
        const grouped: Record<string, number> = {};
        for (const asset of allAssets) {
          // Asume que asset.type existe, si no, clasifica como "Otro"
          const type = asset.type || "Otro";
          grouped[type] = (grouped[type] || 0) + (asset.value || 0);
        }
        const data: AssetCategory[] = Object.entries(grouped).map(([type, value]) => ({
          type,
          percentage: totalValue ? Math.round((value / totalValue) * 100) : 0,
          color: ASSET_COLORS[type] || ASSET_COLORS["Otro"]
        }));
        setAssetData(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchAssets();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center w-full">Distribución de Activos</CardTitle>
        <CardDescription className="text-center w-full">Análisis porcentual de tu portafolio</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center">Cargando datos...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
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
                    value: ASSET_LABELS[item.type] || item.type.charAt(0).toUpperCase() + item.type.slice(1),
                    color: item.color
                  }))}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        <br />
        <Button size="sm" className="bg-[#ffd700] hover:bg-[#ffe066] text-[#1a1400] flex justify-center font-semibold shadow mx-auto" onClick={() => setShowInfo((v) => !v)}>
          {showInfo ? 'Ver menos' : 'Ver más'}
        </Button>
        {showInfo && (
          <>
            <div className="w-full flex flex-col items-center gap-8">
              <h2 className="text-center mt-3">Más gráficos</h2>
              {/* Gráfico de barras: Rendimiento individual por activo */}
              {assetData.length > 0 && (
                <div className="mx-auto max-w-[350px] w-[350px] mr-4">
                  <BarChart width={300} height={300} data={assetData.map(a => ({
                    activo: ASSET_LABELS[a.type] || a.type,
                    rendimiento: a.percentage
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="activo" angle={70} textAnchor="start" interval={0} height={80} tick={{ fontSize: 15 }} />
                    <YAxis />
                    <Bar dataKey="rendimiento">
                      {assetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-center mt-3 mb-4">Portafolio Archivos</h2>
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
}