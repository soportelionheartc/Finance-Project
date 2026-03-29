import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Game } from "@/data/financiaplayData";
import { CURRICULUM, GAMES_BY_LEVEL } from "@/data/financiaplayData";
import PlacementTest from "@/components/finance/financiaplay/PlacementTest";
import LevelMap from "@/components/finance/financiaplay/LevelMap";
import GameEngine from "@/components/finance/financiaplay/GameEngine";
import AiLesson from "@/components/finance/financiaplay/AiLesson";
import XpBar from "@/components/finance/financiaplay/XpBar";
import BadgeGrid from "@/components/finance/financiaplay/BadgeGrid";

type Screen = "loading" | "placement" | "dashboard" | "game" | "lesson";

interface ProgressData {
  completedGames: Array<{
    gameId: string;
    levelId: string;
    score: number;
    maxScore: number;
  }>;
  totalXp: number;
  badges: string[];
  unlockedLevel: number | null;
}

export default function FinanciaPlayPage() {
  const queryClient = useQueryClient();
  const [screen, setScreen] = useState<Screen>("loading");
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [lessonData, setLessonData] = useState<{
    topicId: string;
    topicName: string;
    topicDesc: string;
    levelName: string;
    levelId: string;
  } | null>(null);
  const [lastResult, setLastResult] = useState<{
    xpGained: number;
    newBadges: string[];
    score: number;
    maxScore: number;
  } | null>(null);

  const { data: progress, isLoading: progressLoading } = useQuery<ProgressData>({
    queryKey: ["/api/financiaplay/progress"],
  });

  const { data: placementData, isLoading: placementLoading } = useQuery<{
    hasPlacement: boolean;
    unlockedLevel: number | null;
  }>({
    queryKey: ["/api/financiaplay/placement"],
  });

  const isLoading = progressLoading || placementLoading;

  // Determine screen based on data
  if (screen === "loading" && !isLoading) {
    if (!placementData?.hasPlacement) {
      setScreen("placement");
    } else {
      setScreen("dashboard");
    }
  }

  const handlePlacementComplete = useCallback(
    (unlockedLevel: number) => {
      queryClient.invalidateQueries({ queryKey: ["/api/financiaplay/placement"] });
      queryClient.invalidateQueries({ queryKey: ["/api/financiaplay/progress"] });
      setScreen("dashboard");
    },
    [queryClient],
  );

  const handleSelectGame = useCallback((game: Game) => {
    setCurrentGame(game);
    setLastResult(null);
    setScreen("game");
  }, []);

  const handleSelectTopic = useCallback(
    (topicId: string, levelId: string) => {
      const levelKey = `level${levelId.replace("L", "")}` as keyof typeof CURRICULUM;
      const level = CURRICULUM[levelKey];
      const topic = level?.topics.find((t) => t.id === topicId);
      if (topic && level) {
        setLessonData({
          topicId: topic.id,
          topicName: topic.name,
          topicDesc: topic.desc,
          levelName: level.name,
          levelId,
        });
        setScreen("lesson");
      }
    },
    [],
  );

  const handleGameFinish = useCallback(
    async (score: number, maxScore: number, timeRemainingPct: number) => {
      if (!currentGame) return;
      try {
        const res = await apiRequest("POST", "/api/financiaplay/game/complete", {
          gameId: currentGame.id,
          levelId: currentGame.id.substring(0, 2),
          score,
          maxScore,
          timeRemainingPct,
        });
        const result = await res.json();
        setLastResult({
          xpGained: result.xpGained,
          newBadges: result.newBadges,
          score,
          maxScore,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/financiaplay/progress"] });
      } catch {
        setLastResult({ xpGained: 0, newBadges: [], score, maxScore });
      }
      setScreen("dashboard");
    },
    [currentGame, queryClient],
  );

  const unlockedLevel = progress?.unlockedLevel ?? placementData?.unlockedLevel ?? 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4 md:p-6">
        <div className="w-full max-w-4xl">
          {screen === "loading" && (
            <div className="space-y-4 mt-8">
              <Skeleton className="h-12 w-64 mx-auto" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          )}

          {screen === "placement" && (
            <PlacementTest onComplete={handlePlacementComplete} />
          )}

          {screen === "dashboard" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">FinanciaPlay</h1>
                <p className="text-muted-foreground">
                  Tu camino hacia la educación financiera
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <XpBar currentXp={progress?.totalXp ?? 0} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScreen("placement")}
                >
                  Repetir diagnóstico
                </Button>
              </div>

              {lastResult && (
                <div className="bg-[#FFC107]/10 border border-[#FFC107]/30 rounded-lg p-4 text-center space-y-2">
                  <p className="text-lg font-semibold">
                    🎮 Resultado: {lastResult.score}/{lastResult.maxScore}
                  </p>
                  <p className="text-[#FFC107] font-bold">
                    +{lastResult.xpGained} XP
                  </p>
                  {lastResult.newBadges.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      ¡Nuevas insignias: {lastResult.newBadges.join(", ")}!
                    </p>
                  )}
                </div>
              )}

              <LevelMap
                unlockedLevel={unlockedLevel}
                completedGames={progress?.completedGames ?? []}
                onSelectGame={handleSelectGame}
                onSelectTopic={handleSelectTopic}
              />

              <BadgeGrid earnedBadges={progress?.badges ?? []} />
            </div>
          )}

          {screen === "game" && currentGame && (
            <div>
              <Button
                variant="ghost"
                className="mb-4"
                onClick={() => {
                  setCurrentGame(null);
                  setScreen("dashboard");
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al mapa
              </Button>
              <GameEngine
                game={currentGame}
                onFinish={handleGameFinish}
                onBack={() => {
                  setCurrentGame(null);
                  setScreen("dashboard");
                }}
              />
            </div>
          )}

          {screen === "lesson" && lessonData && (
            <AiLesson
              {...lessonData}
              onClose={() => {
                setLessonData(null);
                setScreen("dashboard");
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
