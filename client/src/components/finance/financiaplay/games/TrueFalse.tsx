import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, ArrowLeft, Trophy } from "lucide-react";
import type { Game } from "@/data/financiaplayData";

interface TrueFalseProps {
  game: Game;
  onFinish: (score: number, maxScore: number, timeRemainingPct: number) => void;
  onBack: () => void;
}

export default function TrueFalse({ game, onFinish, onBack }: TrueFalseProps) {
  const statements = game.statements ?? [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
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
      onFinish(finalScore, statements.length, pct);
    },
    [stopTimer, timeLeft, game.timeSec, statements.length, onFinish],
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
      onFinish(score, statements.length, 0);
    }
  }, [timeLeft, finished, score, statements.length, onFinish]);

  const handleAnswer = (userAnswer: boolean) => {
    if (answered !== null) return;
    setAnswered(userAnswer);
    if (userAnswer === statements[currentIdx].answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= statements.length) {
      finishGame(score);
    } else {
      setCurrentIdx(nextIdx);
      setAnswered(null);
    }
  };

  if (statements.length === 0) return null;

  const timePct = (timeLeft / game.timeSec) * 100;
  const stmt = statements[currentIdx];
  const isCorrect = answered !== null && answered === stmt.answer;

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-card border-[#FFC107]/30">
          <CardHeader className="text-center">
            <Trophy className="mx-auto mb-2 size-12 text-[#FFC107]" />
            <CardTitle className="text-2xl">¡Juego completado!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-4xl font-bold text-[#FFC107]">
              {score} / {statements.length}
            </p>
            <p className="text-muted-foreground">
              {score === statements.length
                ? "¡Perfecto! 🎉"
                : score >= statements.length * 0.7
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

      <Progress value={timePct} className="h-2" />

      <p className="text-muted-foreground text-center text-sm">
        Afirmación {currentIdx + 1} de {statements.length}
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
              <CardTitle className="text-lg leading-relaxed">
                {stmt.q}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className={`h-14 text-base font-semibold ${
                    answered !== null && stmt.answer === true
                      ? "border-green-500 bg-green-500/20 text-green-300"
                      : answered === true && !isCorrect
                        ? "border-red-500 bg-red-500/20 text-red-300"
                        : ""
                  }`}
                  onClick={() => handleAnswer(true)}
                  disabled={answered !== null}
                >
                  {answered !== null && stmt.answer === true && (
                    <CheckCircle className="mr-2 size-5" />
                  )}
                  {answered === true && !isCorrect && (
                    <XCircle className="mr-2 size-5" />
                  )}
                  Verdadero
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className={`h-14 text-base font-semibold ${
                    answered !== null && stmt.answer === false
                      ? "border-green-500 bg-green-500/20 text-green-300"
                      : answered === false && !isCorrect
                        ? "border-red-500 bg-red-500/20 text-red-300"
                        : ""
                  }`}
                  onClick={() => handleAnswer(false)}
                  disabled={answered !== null}
                >
                  {answered !== null && stmt.answer === false && (
                    <CheckCircle className="mr-2 size-5" />
                  )}
                  {answered === false && !isCorrect && (
                    <XCircle className="mr-2 size-5" />
                  )}
                  Falso
                </Button>
              </div>

              {answered !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-[#FFC107]/30 bg-[#FFC107]/10 p-4 text-sm"
                >
                  <p className="font-semibold text-[#FFC107]">Explicación:</p>
                  <p className="text-muted-foreground mt-1">{stmt.explain}</p>
                </motion.div>
              )}

              {answered !== null && (
                <Button onClick={handleNext} className="w-full">
                  {currentIdx + 1 < statements.length
                    ? "Siguiente"
                    : "Ver resultado"}
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <p className="text-muted-foreground text-center text-sm">
        Puntaje: <span className="font-bold text-[#FFC107]">{score}</span> /{" "}
        {statements.length}
      </p>
    </div>
  );
}
