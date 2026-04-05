import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Strategy } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export const TradingStrategies = () => {
  const { toast } = useToast();

  const { data: strategies = [], isLoading } = useQuery<Strategy[]>({
    queryKey: ["/api/strategies"],
  });

  const createStrategyMutation = useMutation({
    mutationFn: async (strategy: any) => {
      const res = await apiRequest("POST", "/api/strategies", strategy);
      return await res.json();
    },
    onSuccess: (newStrategy) => {
      queryClient.setQueryData(
        ["/api/strategies"],
        (oldData: Strategy[] = []) => [...oldData, newStrategy],
      );
    },
    onError: (error) => {
      toast({
        title: "Error al crear estrategia",
        description:
          error.message || "Ha ocurrido un error. Intenta de nuevo más tarde.",
        variant: "destructive",
      });
    },
  });

  // Create sample strategies if none exist
  useEffect(() => {
    if (!isLoading && strategies.length === 0) {
      const sampleStrategies = [
        {
          name: "Rebalanceo de Portafolio",
          description:
            "Basado en tu perfil de riesgo, sugerimos aumentar exposición a ETFs tecnológicos en un 5%.",
          parameters: {
            riskProfile: "moderate",
            recommendations: [
              { assetType: "etf", sector: "technology", changePercentage: 5 },
            ],
          },
          active: false,
        },
        {
          name: "Trading Algorítmico",
          description:
            "Implementa nuestra estrategia de medias móviles para Bitcoin con un rendimiento histórico del 18% anual.",
          parameters: {
            asset: "BTC/USD",
            strategy: "movingAverage",
            shortPeriod: 9,
            longPeriod: 21,
            historicalReturn: 18,
          },
          active: false,
        },
      ];

      // Create strategies one by one with a delay
      sampleStrategies.forEach((strategy, index) => {
        setTimeout(() => {
          createStrategyMutation.mutate(strategy);
        }, index * 300);
      });
    }
  }, [isLoading, strategies.length]);

  const activateStrategyMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      const res = await apiRequest("POST", `/api/strategies/${id}`, { active });
      return await res.json();
    },
    onSuccess: (updatedStrategy) => {
      queryClient.setQueryData(
        ["/api/strategies"],
        (oldData: Strategy[] = []) =>
          oldData.map((strategy) =>
            strategy.id === updatedStrategy.id ? updatedStrategy : strategy,
          ),
      );

      toast({
        title: updatedStrategy.active
          ? "Estrategia activada"
          : "Estrategia desactivada",
        description: `La estrategia ha sido ${updatedStrategy.active ? "activada" : "desactivada"} correctamente.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error al actualizar estrategia",
        description:
          error.message || "Ha ocurrido un error. Intenta de nuevo más tarde.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="bg-primary mb-6 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Estrategias Recomendadas</CardTitle>
        <Badge
          variant="outline"
          className="border-yellow-500 bg-transparent text-yellow-500"
        >
          <BrainCircuit className="mr-1 h-3 w-3" />
          IA Powered
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {strategies.map((strategy) => (
          <div key={strategy.id} className="bg-primary-light rounded-md p-3">
            <div className="mb-2 flex justify-between">
              <h4 className="font-medium">{strategy.name}</h4>
              <Button
                variant="link"
                className="h-auto p-0 text-xs text-yellow-500"
                onClick={() =>
                  activateStrategyMutation.mutate({
                    id: strategy.id,
                    active: !strategy.active,
                  })
                }
              >
                {strategy.active ? "Desactivar" : "Aplicar"}
              </Button>
            </div>
            <p className="text-sm text-gray-400">{strategy.description}</p>
          </div>
        ))}

        {strategies.length === 0 && isLoading && (
          <div className="bg-primary-light rounded-md p-3">
            <p className="text-sm text-gray-400">Cargando estrategias...</p>
          </div>
        )}

        {strategies.length === 0 && !isLoading && (
          <div className="bg-primary-light rounded-md p-3">
            <p className="text-sm text-gray-400">
              No hay estrategias disponibles.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
