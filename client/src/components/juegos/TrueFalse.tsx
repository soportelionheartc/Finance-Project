import { useState } from "react";
import { Button } from "@/components/ui/button";

// Tipos de preguntas y payload
export interface PreguntaTF {
  question: string;
  answer: boolean;
  explain?: string;
}

export interface TrueFalsePayload {
  questions: PreguntaTF[];
}

// Nivel
export interface Nivel {
  level: number;
  points: number;
  minPointsToPass: number;
  payload: TrueFalsePayload;
  unlocked?: boolean;
}

// Juego financiero
export interface JuegoFinancieroTF {
  id: string | number;
  type: "true_false";
  title: string;
  points: number;
  timeLimitSec: number;
  payload: TrueFalsePayload;
  levels?: Nivel[];
  unlocked?: boolean;
  image?: string;
}

// Props del componente
interface TrueFalseProps {
  juego: JuegoFinancieroTF;
  onBack: () => void;
  onLevelComplete?: (score: number) => void;
  currentLevel?: number; // opcional para manejar niveles
}

export function TrueFalse({
  juego,
  onBack,
  onLevelComplete,
  currentLevel = 0,
}: TrueFalseProps) {
  // Tomamos nivel actual si existe
  const level: Nivel | null = juego.levels?.[currentLevel] || null;
  const payload = level?.payload ?? juego.payload;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = payload.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (answer: boolean) => {
    if (!currentQuestion) return;

    if (answer === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    const minPoints = level?.minPointsToPass ?? questions.length; 
    const passed = score >= minPoints;

      alert(`Puntaje: ${score}/${questions.length} - ${passed ? "Nivel aprobado 🎉" : "No alcanzaste el mínimo ❌"}`);

    return (
      <div className="p-6">
        <h2 className="text-xl font-bold">
          {juego.title} - Nivel {level?.level ?? 1}
        </h2>
        <p className="mt-4">
          ¡Juego terminado! Puntaje: {score}/{questions.length}
        </p>
        <button
          onClick={() => {
            if (onLevelComplete) onLevelComplete(score);
            onBack();
          }}
          className="mt-4 px-4 py-2 bg-primary text-white rounded"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
       {/* BOTÓN VOLVER */}
    <Button variant="outline" onClick={onBack}>
      ← Volver
    </Button>
      <h2 className="text-xl font-bold">
        {juego.title} - Nivel {level?.level ?? 1}
      </h2>
      <p className="mt-4">
        {currentQuestion ? currentQuestion.question : "No hay preguntas disponibles."}
      </p>
      <div className="mt-4 flex gap-4">
        <button
          onClick={() => handleAnswer(true)}
          disabled={!currentQuestion}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Verdadero
        </button>
        <button
          onClick={() => handleAnswer(false)}
          disabled={!currentQuestion}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Falso
        </button>
      </div>
      
    </div>
  );
}
