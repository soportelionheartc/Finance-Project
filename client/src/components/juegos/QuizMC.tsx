import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Pregunta {
  q: string;
  options: string[];
  answerIndex: number;
  explain?: string;
}

interface QuizMCProps {
  juego: {
    title: string;
    points: number;
    timeLimitSec: number;
    payload: {
      questions: Pregunta[];
    };
  };
  onBack: () => void; // Para volver a la lista de juegos
  onLevelComplete?: (score: number) => void; // Reporta puntaje al page
}

export function QuizMC({ juego, onBack, onLevelComplete }: QuizMCProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const pregunta = juego.payload.questions[currentQ];

  const handleAnswer = (index: number) => {
    setSelected(index);

    const pointsPerQuestion = juego.points / juego.payload.questions.length;
    const isCorrect = index === pregunta.answerIndex;
    const newScore = score + (isCorrect ? pointsPerQuestion : 0);
    setScore(newScore);

    // Mostrar feedback un ratito antes de pasar a la siguiente
    setTimeout(() => {
      setSelected(null);

      if (currentQ + 1 < juego.payload.questions.length) {
        setCurrentQ(currentQ + 1);
      } else {
        // Reportar puntaje al page
        if (onLevelComplete) onLevelComplete(newScore);
        alert(`¡Juego terminado! Puntaje: ${newScore}`);
        onBack();
      }
    }, 700);
  };

  return (
    <div className="border p-4 rounded-md shadow-md space-y-4">
       {/* BOTÓN VOLVER ARRIBA */}
      <Button variant="outline" onClick={onBack}>
        ← Volver
      </Button>
      <h2 className="text-lg font-bold">{juego.title}</h2>
      <p className="text-sm text-muted-foreground">
        Pregunta {currentQ + 1} de {juego.payload.questions.length}
      </p>
      <p className="font-medium">{pregunta.q}</p>
      <div className="grid gap-2 mt-2">
        {pregunta.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            className={`p-2 border rounded ${
              selected === i
                ? i === pregunta.answerIndex
                  ? "bg-green-200"
                  : "bg-red-200"
                : "hover:bg-gray-100"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
