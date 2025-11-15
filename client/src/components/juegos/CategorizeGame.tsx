import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CategorizeItem {
  label: string;
  categoryKey: string;
}

interface CategorizeCategory {
  key: string;
  label: string;
}

interface CategorizePayload {
  categories: CategorizeCategory[];
  items: CategorizeItem[];
}

interface JuegoCategorize {
  title: string;
  points: number;
  timeLimitSec: number;
  payload: CategorizePayload;
}

interface CategorizeGameProps {
  juego: JuegoCategorize;
  onBack: () => void;
}

export function CategorizeGame({ juego, onBack }: CategorizeGameProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (itemLabel: string, categoryKey: string) => {
    setAnswers((prev) => ({ ...prev, [itemLabel]: categoryKey }));
  };

  const correctCount = submitted
    ? juego.payload.items.filter(
        (item) => answers[item.label] === item.categoryKey
      ).length
    : 0;

  return (
    <div className="p-6">
      {/* BOTÓN VOLVER ARRIBA */}
            <Button variant="outline" onClick={onBack}>
              ← Volver
            </Button>
      <h2 className="text-xl font-bold mb-4">{juego.title}</h2>

      {juego.payload.categories.map((category) => (
        <div key={category.key} className="mb-4">
          <h3 className="font-semibold">{category.label}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {juego.payload.items
              .filter((item) => !Object.keys(answers).includes(item.label))
              .map((item) => (
                <Button
                  key={item.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelect(item.label, category.key)}
                >
                  {item.label}
                </Button>
              ))}
          </div>
        </div>
      ))}

      {Object.keys(answers).length === juego.payload.items.length && !submitted && (
        <Button className="mt-4" onClick={() => setSubmitted(true)}>
          Revisar respuestas
        </Button>
      )}

      {submitted && (
        <div className="mt-4">
          <p>
            Respuestas correctas: {correctCount} de {juego.payload.items.length}
          </p>
        </div>
      )}
    </div>
  );
}
