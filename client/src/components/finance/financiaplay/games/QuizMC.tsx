import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, ArrowLeft, Trophy } from "lucide-react";
import type { Game } from "@/data/financiaplayData";

interface QuizMCProps {
  game: Game;
  onFinish: (score: number, maxScore: number, timeRemainingPct: number) => void;
  onBack: () => void;
}

export default function QuizMC({ game, onFinish, onBack }: QuizMCProps) {
  const questions = game.questions ?? [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(game.timeSec);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const finishGame = useCallback(
    (finalScore: number) => {
      stopTimer();
      setFinished(true);
      const pct = (timeLeft / game.timeSec) * 100;
      onFinish(finalScore, questions.length, pct);
    },
    [stopTimer, timeLeft, game.timeSec, questions.length, onFinish],
  );

  useEffect(() => {
    if (finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return stopTimer;
  }, [finished, stopTimer]);

  // When time runs out, trigger onFinish
  useEffect(() => {
    if (timeLeft === 0 && finished) {
      onFinish(score, questions.length, 0);
    }
  }, [timeLeft, finished, score, questions.length, onFinish]);

  const handleSelect = (optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
    if (optIdx === questions[currentIdx].correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= questions.length) {
      const finalScore = score;
      finishGame(finalScore);
    } else {
      setCurrentIdx(nextIdx);
      setSelected(null);
    }
  };

  if (questions.length === 0) return null;

  const timePct = (timeLeft / game.timeSec) * 100;
  const question = questions[currentIdx];

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-card border-[#FFC107]/30">
          <CardHeader className="text-center">
            <Trophy className="mx-auto mb-2 size-12 text-[#FFC107]" />
            <CardTitle className="text-2xl">¡Quiz completado!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-4xl font-bold text-[#FFC107]">
              {score} / {questions.length}
            </p>
            <p className="text-muted-foreground">
              {score === questions.length
                ? "¡Perfecto! 🎉"
                : score >= questions.length * 0.7
                  ? "¡Muy bien! 💪"
                  : "Sigue practicando 📚"}
            </p>
            <Button onClick={onBack} variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 size-4" />
              Volver
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="ghost" size="sm">
          <ArrowLeft className="mr-1 size-4" />
          Salir
        </Button>
        <Badge variant="outline" className="gap-1">
          <Clock className="size-3" />
          {timeLeft}s
        </Badge>
      </div>

      {/* Timer bar */}
      <Progress value={timePct} className="h-2" />

      {/* Progress */}
      <p className="text-muted-foreground text-center text-sm">
        Pregunta {currentIdx + 1} de {questions.length}
      </p>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg leading-relaxed">
                {question.q}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.opts.map((opt, idx) => {
                let variant: "outline" | "default" | "destructive" = "outline";
                let extraClass = "";

                if (selected !== null) {
                  if (idx === question.correct) {
                    variant = "default";
                    extraClass =
                      "border-green-500 bg-green-500/20 text-green-300 hover:bg-green-500/20";
                  } else if (idx === selected && idx !== question.correct) {
                    variant = "destructive";
                    extraClass = "border-red-500 bg-red-500/20";
                  }
                }

                return (
                  <Button
                    key={idx}
                    variant={variant}
                    className={`h-auto w-full justify-start px-4 py-3 text-left whitespace-normal ${extraClass}`}
                    onClick={() => handleSelect(idx)}
                    disabled={selected !== null}
                  >
                    <span className="text-muted-foreground mr-3 font-bold">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                    {selected !== null && idx === question.correct && (
                      <CheckCircle className="ml-auto size-5 shrink-0 text-green-400" />
                    )}
                    {selected === idx && idx !== question.correct && (
                      <XCircle className="ml-auto size-5 shrink-0 text-red-400" />
                    )}
                  </Button>
                );
              })}

              {/* Explanation */}
              {selected !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-lg border border-[#FFC107]/30 bg-[#FFC107]/10 p-4 text-sm"
                >
                  <p className="font-semibold text-[#FFC107]">Explicación:</p>
                  <p className="text-muted-foreground mt-1">
                    {question.explain}
                  </p>
                </motion.div>
              )}

              {/* Next button */}
              {selected !== null && (
                <Button onClick={handleNext} className="mt-4 w-full">
                  {currentIdx + 1 < questions.length
                    ? "Siguiente"
                    : "Ver resultado"}
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Score indicator */}
      <p className="text-muted-foreground text-center text-sm">
        Puntaje: <span className="font-bold text-[#FFC107]">{score}</span> /{" "}
        {questions.length}
      </p>
    </div>
  );
}
