import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CURRICULUM, GAMES_BY_LEVEL, type Game } from "@/data/financiaplayData";
import {
  Lock,
  ChevronDown,
  ChevronUp,
  Check,
  BookOpen,
  Gamepad2,
} from "lucide-react";

interface CompletedGame {
  gameId: string;
  levelId: string;
  score: number;
  maxScore: number;
}

interface LevelMapProps {
  unlockedLevel: number;
  completedGames: CompletedGame[];
  onSelectGame: (game: Game) => void;
  onSelectTopic: (topicId: string, levelId: string) => void;
}

const LEVEL_KEYS = ["level1", "level2", "level3"] as const;
const LEVEL_NUMBERS: Record<string, number> = {
  level1: 1,
  level2: 2,
  level3: 3,
};
const LEVEL_BORDER_COLORS: Record<string, string> = {
  level1: "border-green-500/60",
  level2: "border-blue-500/60",
  level3: "border-[#FFC107]/60",
};

export default function LevelMap({
  unlockedLevel,
  completedGames,
  onSelectGame,
  onSelectTopic,
}: LevelMapProps) {
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);

  function isLevelUnlocked(levelKey: string) {
    return LEVEL_NUMBERS[levelKey] <= unlockedLevel;
  }

  function getCompletedCount(levelId: string) {
    const games = GAMES_BY_LEVEL[levelId] ?? [];
    return games.filter((g) => completedGames.some((c) => c.gameId === g.id))
      .length;
  }

  function isGameCompleted(gameId: string) {
    return completedGames.some((c) => c.gameId === gameId);
  }

  function toggleLevel(levelKey: string) {
    if (!isLevelUnlocked(levelKey)) return;
    setExpandedLevel((prev) => (prev === levelKey ? null : levelKey));
  }

  return (
    <div className="space-y-4">
      {LEVEL_KEYS.map((levelKey) => {
        const level = CURRICULUM[levelKey];
        const unlocked = isLevelUnlocked(levelKey);
        const expanded = expandedLevel === levelKey;
        const games = GAMES_BY_LEVEL[level.id] ?? [];
        const completed = getCompletedCount(level.id);
        const total = games.length;

        return (
          <div key={levelKey}>
            <Card
              className={`transition-all ${LEVEL_BORDER_COLORS[levelKey]} border-2 ${
                unlocked
                  ? "cursor-pointer hover:shadow-md"
                  : "cursor-not-allowed opacity-50"
              }`}
              onClick={() => toggleLevel(levelKey)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{level.badge}</span>
                    <div>
                      <h3 className="text-base font-semibold">{level.name}</h3>
                      <p className="text-muted-foreground text-xs">
                        {level.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      {completed}/{total} juegos completados
                    </span>
                    {unlocked ? (
                      expanded ? (
                        <ChevronUp className="text-muted-foreground h-4 w-4" />
                      ) : (
                        <ChevronDown className="text-muted-foreground h-4 w-4" />
                      )
                    ) : (
                      <Lock className="text-muted-foreground h-4 w-4" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <AnimatePresence>
              {expanded && unlocked && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 pt-3 pl-4">
                    {/* Topics */}
                    <div>
                      <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium">
                        <BookOpen className="h-4 w-4" /> Temas
                      </h4>
                      <div className="grid gap-1.5">
                        {level.topics.map((topic) => (
                          <button
                            key={topic.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTopic(topic.id, level.id);
                            }}
                            className="hover:bg-muted/50 flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors"
                          >
                            <span>{topic.icon}</span>
                            <span>{topic.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Games */}
                    <div>
                      <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium">
                        <Gamepad2 className="h-4 w-4" /> Juegos
                      </h4>
                      <div className="grid gap-1.5">
                        {games.map((game) => {
                          const done = isGameCompleted(game.id);
                          return (
                            <Card
                              key={game.id}
                              className="cursor-pointer transition-shadow hover:shadow-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectGame(game);
                              }}
                            >
                              <CardContent className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-2">
                                  <span>{game.icon}</span>
                                  <span className="text-sm font-medium">
                                    {game.title}
                                  </span>
                                  <span className="text-muted-foreground text-xs">
                                    {game.points} pts
                                  </span>
                                </div>
                                {done && (
                                  <Check className="h-4 w-4 text-green-500" />
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
