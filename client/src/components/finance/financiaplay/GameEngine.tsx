import type { Game } from "@/data/financiaplayData";
import QuizMC from "./games/QuizMC";
import TrueFalse from "./games/TrueFalse";
import Match from "./games/Match";
import Decision from "./games/Decision";
import Categorize from "./games/Categorize";

interface GameEngineProps {
  game: Game;
  onFinish: (score: number, maxScore: number, timeRemainingPct: number) => void;
  onBack: () => void;
}

export default function GameEngine({ game, onFinish, onBack }: GameEngineProps) {
  switch (game.type) {
    case "quiz_mc":
      return <QuizMC game={game} onFinish={onFinish} onBack={onBack} />;
    case "true_false":
      return <TrueFalse game={game} onFinish={onFinish} onBack={onBack} />;
    case "match":
      return <Match game={game} onFinish={onFinish} onBack={onBack} />;
    case "decision":
      return <Decision game={game} onFinish={onFinish} onBack={onBack} />;
    case "categorize":
      return <Categorize game={game} onFinish={onFinish} onBack={onBack} />;
    default:
      return (
        <div className="p-8 text-center text-muted-foreground">
          Tipo de juego no soportado
        </div>
      );
  }
}
