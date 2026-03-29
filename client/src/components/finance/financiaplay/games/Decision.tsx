import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, ArrowLeft, Trophy } from "lucide-react";
import type { Game } from "@/data/financiaplayData";

interface DecisionProps {
  game: Game;
  onFinish: (score: number, maxScore: number, timeRemainingPct: number) => void;
  onBack: () => void;
}

export default function Decision({ game, onFinish, onBack }: DecisionProps) {
  const scenarios = game.scenarios ?? [];
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
      onFinish(finalScore, scenarios.length, pct);
    },
    [stopTimer, timeLeft, game.timeSec, scenarios.length, onFinish],
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

  useEffect(() => {
    if (timeLeft === 0 && finished) {
      onFinish(score, scenarios.length, 0);
    }
  }, [timeLeft, finished, score, scenarios.length, onFinish]);

  const handleSelect = (optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
    if (optIdx === scenarios[currentIdx].correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= scenarios.length) {
      finishGame(score);
    } else {
      setCurrentIdx(nextIdx);
      setSelected(null);
    }
  };

  if (scenarios.length === 0) return null;

  const timePct = (timeLeft / game.timeSec) * 100;
  const scenario = scenarios[currentIdx];

  if (finished) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-[#FFC107]/30 bg-card">
          <CardHeader className="text-center">
            <Trophy className="mx-auto mb-2 size-12 text-[#FFC107]" />
            <CardTitle className="text-2xl">¡Escenarios completados!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-4xl font-bold text-[#FFC107]">
              {score} / {scenarios.length}
            </p>
            <p className="text-muted-foreground">
              {score === scenarios.length
                ? "¡Decisiones perfectas! 🎉"
                : score >= scenarios.length * 0.7
                  ? "¡Buen criterio financiero! 💪"
                  : "Sigue aprendiendo 📚"}
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

      <Progress value={timePct} className="h-2" />

      <p className="text-center text-sm text-muted-foreground">
        Escenario {currentIdx + 1} de {scenarios.length}
      </p>

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
              <CardTitle className="text-base font-normal leading-relaxed">
                📋 <span className="font-semibold">Situación:</span>
              </CardTitle>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {scenario.text}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm font-semibold">¿Qué harías?</p>
              {scenario.opts.map((opt, idx) => {
                let extraClass = "";

                if (selected !== null) {
                  if (idx === scenario.correct) {
                    extraClass = "border-green-500 bg-green-500/20 text-green-300 hover:bg-green-500/20";
                  } else if (idx === selected && idx !== scenario.correct) {
                    extraClass = "border-red-500 bg-red-500/20 text-red-300";
                  }
                }

                return (
                  <Button
                    key={idx}
                    variant="outline"
                    className={`w-full justify-start whitespace-normal text-left h-auto py-3 px-4 ${extraClass}`}
                    onClick={() => handleSelect(idx)}
                    disabled={selected !== null}
                  >
                    {opt}
                    {selected !== null && idx === scenario.correct && (
                      <CheckCircle className="ml-auto size-5 shrink-0 text-green-400" />
                    )}
                    {selected === idx && idx !== scenario.correct && (
                      <XCircle className="ml-auto size-5 shrink-0 text-red-400" />
                    )}
                  </Button>
                );
              })}

              {selected !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-lg border border-[#FFC107]/30 bg-[#FFC107]/10 p-4 text-sm"
                >
                  <p className="font-semibold text-[#FFC107]">Explicación:</p>
                  <p className="mt-1 text-muted-foreground">{scenario.explain}</p>
                </motion.div>
              )}

              {selected !== null && (
                <Button onClick={handleNext} className="mt-4 w-full">
                  {currentIdx + 1 < scenarios.length ? "Siguiente" : "Ver resultado"}
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-sm text-muted-foreground">
        Puntaje: <span className="font-bold text-[#FFC107]">{score}</span> /{" "}
        {scenarios.length}
      </p>
    </div>
  );
}
