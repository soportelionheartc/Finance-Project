import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PLACEMENT_QUESTIONS, CURRICULUM } from "@/data/financiaplayData";
import { apiRequest } from "@/lib/queryClient";

interface PlacementTestProps {
  onComplete: (unlockedLevel: number) => void;
}

const LEVEL_INFO: Record<number, { name: string; badge: string }> = {
  1: { name: CURRICULUM.level1.name, badge: CURRICULUM.level1.badge },
  2: { name: CURRICULUM.level2.name, badge: CURRICULUM.level2.badge },
  3: { name: CURRICULUM.level3.name, badge: CURRICULUM.level3.badge },
};

export default function PlacementTest({ onComplete }: PlacementTestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<{
    unlockedLevel: number;
    score: { level1: number; level2: number; level3: number };
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const total = PLACEMENT_QUESTIONS.length;
  const question = PLACEMENT_QUESTIONS[currentIndex];

  function handleSelect(optIndex: number) {
    setSelected(optIndex);
  }

  function handleNext() {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);

    if (currentIndex + 1 < total) {
      setCurrentIndex(currentIndex + 1);
    } else {
      computeResult(newAnswers);
    }
  }

  function computeResult(finalAnswers: number[]) {
    const byLevel: Record<number, { total: number; correct: number }> = {
      1: { total: 0, correct: 0 },
      2: { total: 0, correct: 0 },
      3: { total: 0, correct: 0 },
    };

    PLACEMENT_QUESTIONS.forEach((q, i) => {
      byLevel[q.level].total++;
      if (finalAnswers[i] === q.correct) {
        byLevel[q.level].correct++;
      }
    });

    let unlockedLevel = 1;
    const l3Pct = byLevel[3].total > 0 ? byLevel[3].correct / byLevel[3].total : 0;
    const l2Pct = byLevel[2].total > 0 ? byLevel[2].correct / byLevel[2].total : 0;

    if (l3Pct >= 0.6) {
      unlockedLevel = 3;
    } else if (l2Pct >= 0.5) {
      unlockedLevel = 2;
    }

    const score = {
      level1: byLevel[1].correct,
      level2: byLevel[2].correct,
      level3: byLevel[3].correct,
    };

    setResult({ unlockedLevel, score });
    submitPlacement(unlockedLevel, score);
  }

  async function submitPlacement(
    unlockedLevel: number,
    score: { level1: number; level2: number; level3: number },
  ) {
    setSubmitting(true);
    try {
      await apiRequest("POST", "/api/financiaplay/placement", {
        unlockedLevel,
        score,
      });
    } catch {
      // Placement saved locally, continue even if API fails
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    const info = LEVEL_INFO[result.unlockedLevel];
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="max-w-lg mx-auto">
          <CardHeader className="text-center">
            <div className="text-5xl mb-3">{info.badge}</div>
            <CardTitle className="text-2xl">¡Evaluación completa!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Tu nivel inicial es:
            </p>
            <p className="text-xl font-bold text-[#FFC107]">
              Nivel {result.unlockedLevel} — {info.name}
            </p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Nivel 1: {result.score.level1} correctas</p>
              <p>Nivel 2: {result.score.level2} correctas</p>
              <p>Nivel 3: {result.score.level3} correctas</p>
            </div>
            <Button
              onClick={() => onComplete(result.unlockedLevel)}
              disabled={submitting}
              className="w-full bg-[#FFC107] text-black hover:bg-[#FFD54F]"
            >
              {submitting ? "Guardando..." : "Continuar"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg">Evaluación Inicial</CardTitle>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1}/{total}
          </span>
        </div>
        <Progress value={((currentIndex + 1) / total) * 100} className="h-2" />
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <p className="font-medium text-base">{question.q}</p>
            <div className="grid gap-2">
              {question.opts.map((opt, i) => (
                <Button
                  key={i}
                  variant={selected === i ? "default" : "outline"}
                  className={
                    selected === i
                      ? "bg-[#FFC107] text-black hover:bg-[#FFD54F] justify-start text-left h-auto py-3 whitespace-normal"
                      : "justify-start text-left h-auto py-3 whitespace-normal"
                  }
                  onClick={() => handleSelect(i)}
                >
                  {opt}
                </Button>
              ))}
            </div>
            <Button
              onClick={handleNext}
              disabled={selected === null}
              className="w-full"
            >
              {currentIndex + 1 < total ? "Siguiente" : "Ver resultado"}
            </Button>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
