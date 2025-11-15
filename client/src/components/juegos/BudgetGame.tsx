// client/src/components/juegos/BudgetGame.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export interface BudgetCategory {
  key: string;
  label: string;
  targetPctMin: number;
  targetPctMax: number;
}

export interface BudgetPayload {
  income: number;
  categories: BudgetCategory[];
}

export interface BudgetGameProps {
  juego: {
    id: string | number;
    title: string;
    points: number;
    timeLimitSec: number;
    payload: BudgetPayload;
  };
  onBack: () => void;
}

export const BudgetGame: React.FC<BudgetGameProps> = ({ juego, onBack }) => {
  const { income, categories } = juego.payload;
  const [allocations, setAllocations] = useState<{ [key: string]: number }>(
    categories.reduce((acc, cat) => ({ ...acc, [cat.key]: 0 }), {})
  );

  const handleChange = (key: string, value: number) => {
    setAllocations(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6">
      <button
        className="flex items-center gap-2 mb-4 text-primary font-semibold"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <h2 className="text-xl font-bold mb-4">{juego.title}</h2>
      <p className="mb-4">Ingreso disponible: <strong>${income.toLocaleString()}</strong></p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(cat => {
          const allocated = allocations[cat.key];
          return (
            <Card key={cat.key}>
              <CardHeader>
                <CardTitle>{cat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Rango recomendado: {cat.targetPctMin}% - {cat.targetPctMax}%</p>
                <input
                  type="number"
                  min={0}
                  max={income}
                  value={allocated}
                  onChange={e => handleChange(cat.key, Number(e.target.value))}
                  className="w-full border rounded px-2 py-1 mt-2"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  % asignado: {((allocated / income) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6">
        <p>Total asignado: ${Object.values(allocations).reduce((a, b) => a + b, 0).toLocaleString()}</p>
      </div>
    </div>
  );
};
