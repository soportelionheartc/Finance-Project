import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { use } from "passport";
import { Plus } from "lucide-react";
import { NewPortfolioModal } from "./new-portfolio-modal";
import { init } from "openai/_shims/index.mjs";

interface Portfolio {
  id: number;
  name: string;
  totalValue: number;
  initial_value: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export const PortfolioSummary = () => {
  // Datos de ejemplo para la visualización de portfolios
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para mostrar el modal
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/api/portfolios")
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching portfolios");
        return res.json();
      })

      .then((data) => {
        setPortfolios(data);
        setLoading(false);
      })

      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const totalPortfolioValue = portfolios.reduce(
    (total, p) => total + p.totalValue,
    0,
  );
  const totalInitialValue = portfolios.reduce(
    (total, p) => total + (p.initial_value ?? 0),
    0,
  );
  // Rendimiento total real del portafolio
  const realReturn =
    totalInitialValue > 0
      ? ((totalPortfolioValue - totalInitialValue) / totalInitialValue) * 100
      : 0;
  const isPositiveChange = realReturn >= 0;

  if (loading)
    return <div className="py-8 text-center">Cargando portafolios...</div>;
  if (error)
    return <div className="py-8 text-center text-red-500">Error: {error}</div>;

  // Función para guardar portafolio y activos
  interface AssetFile {
    id: number;
    url: string;
    filename: string;
    mimeType: string;
  }

  interface Asset {
    type: string;
    name: string;
    symbol: string;
    quantity: number;
    unitPrice: number;
    purchaseDate: string;
    file: AssetFile | null;
  }

  const handleSavePortfolio = async (
    portfolioName: string,
    assets: Asset[],
  ) => {
    try {
      // 1. Crear el portafolio
      const initialValue = assets.reduce((sum, asset) => {
        const a = asset as any;
        return sum + Number(a.quantity) * Number(a.price ?? a.unitPrice);
      }, 0);

      const res = await fetch("/api/portfolios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: portfolioName,
          initial_value: initialValue,
        }),
      });
      if (!res.ok) throw new Error("Error al crear portafolio");
      const newPortfolio = await res.json();

      // 2. Agregar los activos al portafolio y asociar archivos
      for (const asset of assets) {
        const a = asset as any;
        const assetRes = await fetch(
          `/api/portfolios/${newPortfolio.id}/assets`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              name: a.name,
              symbol: a.symbol,
              type: a.type,
              quantity: Number(a.quantity),
              price: Number(a.price ?? a.unitPrice),
              value: Number(a.quantity) * Number(a.price ?? a.unitPrice),
              change24h: 0,
              icon: "",
            }),
          },
        );

        // 3. Si el activo tiene archivo, asociarlo con el activo creado
        if (assetRes.ok && asset.file) {
          const newAsset = await assetRes.json();
          await fetch(`/api/files/${asset.file.id}/asset`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              assetId: newAsset.id,
              portfolioId: newPortfolio.id,
            }),
          });
        }
      }

      // 4. Recargar la lista de portafolios
      const updated = await fetch("/api/portfolios", {
        credentials: "include",
      });
      if (updated.ok) {
        const data = await updated.json();
        setPortfolios(data);
      }

      setShowModal(false);
    } catch (err) {
      alert("Error al guardar el portafolio");
    }
  };

  return (
    <Card className="mx-auto max-w-md rounded-xl bg-[#1a1400] p-6 text-[#ffd700] shadow-lg">
      <div className="flex justify-center">
        <Button
          size="sm"
          className="ml-5 rounded-lg bg-[#ffd700] px-4 py-2 font-semibold text-[#1a1400] shadow-sm hover:bg-[#ffe066]"
          onClick={() => setShowModal(true)}
        >
          <Plus className="h-4 w-4" />
          Nuevo
        </Button>
        {/* El modal ya usa AddAssetForm internamente */}
        <NewPortfolioModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSavePortfolio}
        />
      </div>
      <CardHeader className="flex flex-row items-center justify-center pb-4">
        <div className="space-y-1">
          <CardTitle className="mb-4 w-full text-center">
            Resumen de Portafolios
          </CardTitle>
          <CardDescription className="w-full text-center text-base">
            Visión general de tus inversiones
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col items-center">
          <span className="mb-2 text-3xl font-extrabold">
            ${totalPortfolioValue.toLocaleString("es-CO")}
          </span>
          <span
            className={`flex items-center text-base font-semibold ${isPositiveChange ? "text-green-400" : "text-red-400"} mt-1`}
          >
            {isPositiveChange ? (
              <TrendingUp className="mr-1 h-5 w-5" />
            ) : (
              <TrendingDown className="mr-1 h-5 w-5" />
            )}
            {isPositiveChange ? "+" : ""}
            {realReturn.toFixed(2)}% Rendimiento Total
          </span>
        </div>
        <div className="flex flex-col gap-6">
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">{portfolio.name}</span>
                <span className="text-base font-bold">
                  ${portfolio.totalValue.toLocaleString("es-CO")}
                </span>
              </div>
              <Progress
                value={(portfolio.totalValue / totalPortfolioValue) * 100}
                className="h-3 rounded-full bg-[#333] transition-all duration-500 [&>div]:bg-[#ffd700]"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
