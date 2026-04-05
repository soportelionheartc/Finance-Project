import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft, Trophy, CheckCircle, XCircle } from "lucide-react";
import type { Game } from "@/data/financiaplayData";

interface CategorizeProps {
  game: Game;
  onFinish: (score: number, maxScore: number, timeRemainingPct: number) => void;
  onBack: () => void;
}

export default function Categorize({
  game,
  onFinish,
  onBack,
}: CategorizeProps) {
  const categories = game.categories ?? [];
  const items = game.items ?? [];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState<
    Array<{ correct: boolean; chosen: string }>
  >([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(game.timeSec);
  const [finished, setFinished] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{
    correct: boolean;
    chosenLabel: string;
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

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

  useEffect(() => {
    if (timeLeft === 0 && finished) {
      onFinish(score, items.length, 0);
    }
  }, [timeLeft, finished, score, items.length, onFinish]);

  const handleCategorySelect = (catKey: string) => {
    if (lastAnswer !== null) return;
    const item = items[currentIdx];
    const isCorrect = item.cat === catKey;
    const chosenLabel =
      categories.find((c) => c.key === catKey)?.label ?? catKey;

    if (isCorrect) {
      setScore((s) => s + 1);
    }

    setResults((prev) => [
      ...prev,
      { correct: isCorrect, chosen: chosenLabel },
    ]);
    setLastAnswer({ correct: isCorrect, chosenLabel });
  };

  const handleNext = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= items.length) {
      stopTimer();
      setFinished(true);
      const pct = (timeLeft / game.timeSec) * 100;
      onFinish(score, items.length, pct);
    } else {
      setCurrentIdx(nextIdx);
      setLastAnswer(null);
    }
  };

  if (items.length === 0 || categories.length === 0) return null;

  const timePct = (timeLeft / game.timeSec) * 100;
  const currentItem = items[currentIdx];
  const correctCatLabel =
    categories.find((c) => c.key === currentItem.cat)?.label ?? currentItem.cat;

  if (finished && timeLeft > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-card border-[#FFC107]/30">
          <CardHeader className="text-center">
            <Trophy className="mx-auto mb-2 size-12 text-[#FFC107]" />
            <CardTitle className="text-2xl">
              ¡Categorización completada!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-4xl font-bold text-[#FFC107]">
              {score} / {items.length}
            </p>
            <p className="text-muted-foreground">
              {score === items.length
                ? "¡Clasificación perfecta! 🎉"
                : score >= items.length * 0.7
                  ? "¡Muy bien clasificado! 💪"
                  : "Sigue practicando 📚"}
            </p>

            {/* Results recap */}
            <div className="mt-4 space-y-2 text-left">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                    results[idx]?.correct
                      ? "bg-green-500/10 text-green-300"
                      : "bg-red-500/10 text-red-300"
                  }`}
                >
                  {results[idx]?.correct ? (
                    <CheckCircle className="size-4 shrink-0" />
                  ) : (
                    <XCircle className="size-4 shrink-0" />
                  )}
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground ml-auto text-xs">
                    {categories.find((c) => c.key === item.cat)?.label}
                  </span>
                </div>
              ))}
            </div>

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

      <Progress value={timePct} className="h-2" />

      <p className="text-muted-foreground text-center text-sm">
        Elemento {currentIdx + 1} de {items.length}
      </p>

      <Card className="border-border/50">
        <CardHeader className="text-center">
          <CardTitle className="text-lg">¿A qué categoría pertenece?</CardTitle>
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto mt-3 rounded-lg border border-[#FFC107]/30 bg-[#FFC107]/10 px-6 py-4"
          >
            <p className="text-lg font-semibold text-[#FFC107]">
              {currentItem.label}
            </p>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              let extraClass = "";
              if (lastAnswer !== null) {
                if (cat.key === currentItem.cat) {
                  extraClass =
                    "border-green-500 bg-green-500/20 text-green-300";
                } else if (
                  lastAnswer.chosenLabel === cat.label &&
                  !lastAnswer.correct
                ) {
                  extraClass = "border-red-500 bg-red-500/20 text-red-300";
                }
              }

              return (
                <Button
                  key={cat.key}
                  variant="outline"
                  className={`h-auto px-4 py-3 text-sm font-semibold whitespace-normal ${extraClass}`}
                  onClick={() => handleCategorySelect(cat.key)}
                  disabled={lastAnswer !== null}
                >
                  {cat.label}
                </Button>
              );
            })}
          </div>

          {lastAnswer !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 rounded-lg border p-3 text-sm ${
                lastAnswer.correct
                  ? "border-green-500/30 bg-green-500/10 text-green-300"
                  : "border-red-500/30 bg-red-500/10 text-red-300"
              }`}
            >
              {lastAnswer.correct ? (
                <p>
                  ✅ ¡Correcto! Pertenece a <strong>{correctCatLabel}</strong>
                </p>
              ) : (
                <p>
                  ❌ Incorrecto. La categoría correcta es{" "}
                  <strong>{correctCatLabel}</strong>
                </p>
              )}
            </motion.div>
          )}

          {lastAnswer !== null && (
            <Button onClick={handleNext} className="w-full">
              {currentIdx + 1 < items.length ? "Siguiente" : "Ver resultado"}
            </Button>
          )}
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-center text-sm">
        Puntaje: <span className="font-bold text-[#FFC107]">{score}</span> /{" "}
        {items.length}
      </p>
    </div>
  );
}
