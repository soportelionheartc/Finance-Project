import { useState } from "react";
import { Button } from "@/components/ui/button";
// Scenario y payload
export interface DecisionScenario {
  text: string;
  options: string[];
  correctIndex: number;
  explain?: string;
}

export interface DecisionPayload {
  scenarios: DecisionScenario[];
}

// Nivel
export interface NivelDecision {
  level: number;
  points: number;
  minPointsToPass: number;
  payload: DecisionPayload;
  unlocked?: boolean;
}

// Juego financiero
export interface JuegoFinancieroDecision {
  id: string | number;
  type: "decision";
  title: string;
  points: number;
  timeLimitSec: number;
  payload: DecisionPayload;
  levels?: NivelDecision[];
  unlocked?: boolean;
  image?: string;
}

// Props del componente
interface DecisionGameProps {
  juego: JuegoFinancieroDecision;
  onBack: () => void;
  onLevelComplete?: (score: number) => void;
  currentLevel?: number;
}

export function DecisionGame({
  juego,
  onBack,
  onLevelComplete,
  currentLevel = 0,
}: DecisionGameProps) {
  const level: NivelDecision | null = juego.levels?.[currentLevel] || null;
  const payload = level?.payload ?? juego.payload;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplain, setShowExplain] = useState(false);
  const [score, setScore] = useState(0);

  const scenario = payload.scenarios[currentIndex];

  const handleSelect = (index: number) => {
    setSelectedOption(index);
    setShowExplain(true);

    if (index === scenario.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplain(false);

    if (currentIndex < payload.scenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Al terminar todas las preguntas, evalúa el resultado
      const minPoints = level?.minPointsToPass ?? payload.scenarios.length;
      const passed = score >= minPoints;

      alert(
        `Puntaje: ${score}/${payload.scenarios.length} - ${passed ? "Nivel aprobado 🎉" : "No alcanzaste el mínimo ❌"}`,
      );

      if (onLevelComplete) onLevelComplete(score);
      onBack();
    }
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      {/* BOTÓN VOLVER ARRIBA */}
      <Button variant="outline" onClick={onBack}>
        ← Volver
      </Button>
      <h2 className="mb-4 text-xl font-bold">
        {juego.title} - Nivel {level?.level ?? 1}
      </h2>
      <p className="mb-4">{scenario.text}</p>

      <div className="space-y-2">
        {scenario.options.map((option, idx) => (
          <button
            key={idx}
            disabled={selectedOption !== null}
            className={`w-full rounded border px-4 py-2 ${
              showExplain && idx === scenario.correctIndex ? "bg-green-200" : ""
            } ${
              showExplain &&
              selectedOption === idx &&
              idx !== scenario.correctIndex
                ? "bg-red-200"
                : ""
            }`}
            onClick={() => handleSelect(idx)}
          >
            {option}
          </button>
        ))}
      </div>

      {showExplain && scenario.explain && (
        <div className="border-primary bg-primary/10 mt-4 border-l-4 p-2">
          <p>{scenario.explain}</p>
        </div>
      )}

      {selectedOption !== null && (
        <button
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={handleNext}
        >
          {currentIndex < payload.scenarios.length - 1
            ? "Siguiente"
            : "Terminar"}
        </button>
      )}
    </div>
  );
}
