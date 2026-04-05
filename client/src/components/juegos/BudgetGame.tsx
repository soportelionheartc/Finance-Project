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
    categories.reduce((acc, cat) => ({ ...acc, [cat.key]: 0 }), {}),
  );

  const handleChange = (key: string, value: number) => {
    setAllocations((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6">
      <button
        className="text-primary mb-4 flex items-center gap-2 font-semibold"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" /> Volver
      </button>

      <h2 className="mb-4 text-xl font-bold">{juego.title}</h2>
      <p className="mb-4">
        Ingreso disponible: <strong>${income.toLocaleString()}</strong>
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {categories.map((cat) => {
          const allocated = allocations[cat.key];
          return (
            <Card key={cat.key}>
              <CardHeader>
                <CardTitle>{cat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Rango recomendado: {cat.targetPctMin}% - {cat.targetPctMax}%
                </p>
                <input
                  type="number"
                  min={0}
                  max={income}
                  value={allocated}
                  onChange={(e) =>
                    handleChange(cat.key, Number(e.target.value))
                  }
                  className="mt-2 w-full rounded border px-2 py-1"
                />
                <p className="text-muted-foreground mt-2 text-sm">
                  % asignado: {((allocated / income) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6">
        <p>
          Total asignado: $
          {Object.values(allocations)
            .reduce((a, b) => a + b, 0)
            .toLocaleString()}
        </p>
      </div>
    </div>
  );
};
