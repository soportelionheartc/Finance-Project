import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft, Trophy, Link2 } from "lucide-react";
import type { Game } from "@/data/financiaplayData";

interface MatchProps {
  game: Game;
  onFinish: (score: number, maxScore: number, timeRemainingPct: number) => void;
  onBack: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Match({ game, onFinish, onBack }: MatchProps) {
  const pairs = game.pairs ?? [];
  const shuffledRight = useMemo(
    () => shuffle(pairs.map((p) => p.right)),
    [pairs],
  );

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrongPair, setWrongPair] = useState<{
    left: number;
    right: number;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState(game.timeSec);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
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
      onFinish(score, pairs.length, 0);
    }
  }, [timeLeft, finished, score, pairs.length, onFinish]);

  // Check match when both sides are selected
  useEffect(() => {
    if (selectedLeft === null || selectedRight === null) return;

    const correctRight = pairs[selectedLeft].right;
    const pickedRight = shuffledRight[selectedRight];

    if (correctRight === pickedRight) {
      setScore((s) => {
        const newScore = s + 1;
        if (newScore === pairs.length) {
          stopTimer();
          setFinished(true);
          const pct = (timeLeft / game.timeSec) * 100;
          onFinish(newScore, pairs.length, pct);
        }
        return newScore;
      });
      setMatched((prev) => new Set(prev).add(selectedLeft));
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setWrongPair({ left: selectedLeft, right: selectedRight });
      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 800);
    }
  }, [
    selectedLeft,
    selectedRight,
    pairs,
    shuffledRight,
    stopTimer,
    timeLeft,
    game.timeSec,
    onFinish,
  ]);

  const handleLeftClick = (idx: number) => {
    if (matched.has(idx) || wrongPair) return;
    setSelectedLeft(idx);
  };

  const handleRightClick = (idx: number) => {
    // check if this right item is already matched
    const isRightMatched = Array.from(matched).some(
      (leftIdx) => pairs[leftIdx].right === shuffledRight[idx],
    );
    if (isRightMatched || wrongPair) return;
    setSelectedRight(idx);
  };

  if (pairs.length === 0) return null;

  const timePct = (timeLeft / game.timeSec) * 100;

  if (finished && timeLeft > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-card border-[#FFC107]/30">
          <CardHeader className="text-center">
            <Trophy className="mx-auto mb-2 size-12 text-[#FFC107]" />
            <CardTitle className="text-2xl">¡Parejas completadas!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-4xl font-bold text-[#FFC107]">
              {score} / {pairs.length}
            </p>
            <p className="text-muted-foreground">
              {score === pairs.length
                ? "¡Todas correctas! 🎉"
                : "¡Buen intento! 💪"}
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

      <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
        <Link2 className="size-4" />
        <span>
          Conecta las parejas: {score} / {pairs.length}
        </span>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Left column */}
            <div className="space-y-2">
              {pairs.map((pair, idx) => {
                const isMatched = matched.has(idx);
                const isSelected = selectedLeft === idx;
                const isWrong = wrongPair?.left === idx;

                return (
                  <motion.div
                    key={`left-${idx}`}
                    animate={isWrong ? { x: [0, -5, 5, -5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <Button
                      variant="outline"
                      className={`h-auto min-h-12 w-full px-3 py-2 text-left text-sm whitespace-normal ${
                        isMatched
                          ? "border-green-500 bg-green-500/20 text-green-300 opacity-70"
                          : isSelected
                            ? "border-[#FFC107] bg-[#FFC107]/20 text-[#FFC107]"
                            : isWrong
                              ? "border-red-500 bg-red-500/20"
                              : ""
                      }`}
                      onClick={() => handleLeftClick(idx)}
                      disabled={isMatched}
                    >
                      {pair.left}
                    </Button>
                  </motion.div>
                );
              })}
            </div>

            {/* Right column */}
            <div className="space-y-2">
              {shuffledRight.map((right, idx) => {
                const isRightMatched = Array.from(matched).some(
                  (leftIdx) => pairs[leftIdx].right === right,
                );
                const isSelected = selectedRight === idx;
                const isWrong = wrongPair?.right === idx;

                return (
                  <motion.div
                    key={`right-${idx}`}
                    animate={isWrong ? { x: [0, 5, -5, 5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <Button
                      variant="outline"
                      className={`h-auto min-h-12 w-full px-3 py-2 text-left text-sm whitespace-normal ${
                        isRightMatched
                          ? "border-green-500 bg-green-500/20 text-green-300 opacity-70"
                          : isSelected
                            ? "border-[#FFC107] bg-[#FFC107]/20 text-[#FFC107]"
                            : isWrong
                              ? "border-red-500 bg-red-500/20"
                              : ""
                      }`}
                      onClick={() => handleRightClick(idx)}
                      disabled={isRightMatched}
                    >
                      {right}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-center text-xs">
        Selecciona un elemento de la izquierda y luego su pareja a la derecha
      </p>
    </div>
  );
}
