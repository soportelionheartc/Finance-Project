import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookOpen } from "lucide-react";
import { QuizMC } from "@/components/juegos/QuizMC";
import { TrueFalse } from "@/components/juegos/TrueFalse";
import { CategorizeGame } from "@/components/juegos/CategorizeGame";
import { BudgetGame } from "@/components/juegos/BudgetGame";
import { DecisionGame } from "@/components/juegos/DecisionGame";

import {
  JuegoFinanciero,
  JuegoFinancieroTF,
  JuegoFinancieroQuizMC,
  JuegoFinancieroDecision,
  
  QuizMCPayload,
  TrueFalsePayload,
  CategorizePayload,
  BudgetPayload,
  DecisionPayload,
} from "@/types";

// --- Type Guards ---
function isQuizMC(j: JuegoFinanciero): j is JuegoFinancieroQuizMC { return j.type === "quiz_mc"; }
function isTrueFalse(j: JuegoFinanciero): j is JuegoFinancieroTF { return j.type === "true_false"; }
function isDecision(j: JuegoFinanciero): j is JuegoFinancieroDecision { return j.type === "decision"; }
function isCategorize(j: JuegoFinanciero): j is JuegoFinanciero & { payload: CategorizePayload } { return j.type === "categorize"; }
function isBudget(j: JuegoFinanciero): j is JuegoFinanciero & { payload: BudgetPayload } { return j.type === "budget"; }

export default function EducacionFinancieraPage() {
  const [loading, setLoading] = useState(true);
  const [juegos, setJuegos] = useState<JuegoFinanciero[]>([]);
  const [selectedJuego, setSelectedJuego] = useState<JuegoFinanciero | null>(null);
  const [currentLevel, setCurrentLevel] = useState(0);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await fetch("/data/financiaPlay.json");
        if (!res.ok) throw new Error("Error al cargar JSON");
        const data = await res.json();

        const todos: JuegoFinanciero[] = data.levels?.flatMap((lvl: any) => {
          const juegosRaw = lvl.games || [];
          return juegosRaw.map((g: any, juegoIdx: number) => ({
            id: g.id,
            type: g.type,
            title: g.title,
            points: g.points ?? 0,
            timeLimitSec: g.timeLimitSec ?? 0,
            image: g.image,
            levels: g.levels?.map((l: any, lvlIdx: number) => ({
              level: l.level,
              points: l.points ?? 0,
              minPointsToPass: l.minPointsToPass ?? 0,
              payload: l.payload,
              unlocked: lvlIdx === 0 && juegoIdx === 0, // solo el primer nivel del primer juego desbloqueado
            })),
            unlocked: g.unlocked ?? (juegoIdx === 0),
          }));
        }) || [];

        setJuegos(todos);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const handleLevelComplete = (score: number) => {
    if (!selectedJuego) return;

    const juegoIdx = juegos.findIndex(j => j.id === selectedJuego.id);
    if (juegoIdx === -1) return;

    const niveles = selectedJuego.levels ?? [];
    const nivelActual = niveles[currentLevel];
    if (!nivelActual) return;

    if (score >= nivelActual.minPointsToPass) {
      const updatedJuegos = [...juegos];

      // desbloquear siguiente nivel del mismo juego
      if (currentLevel + 1 < niveles.length) {
        updatedJuegos[juegoIdx].levels![currentLevel + 1].unlocked = true;
      } 
      // si no hay más niveles, desbloquear primer nivel del siguiente juego
      else if (juegoIdx + 1 < updatedJuegos.length) {
        const siguienteJuego = updatedJuegos[juegoIdx + 1];
        if (siguienteJuego.levels && siguienteJuego.levels[0]) {
          siguienteJuego.levels[0].unlocked = true;
        } else {
          siguienteJuego.unlocked = true;
        }
      }
       // si ya terminó todos los juegos
  else {
    alert("🎉 Felicidades, completaste todos los niveles del juego. ¡Eres un crack financiero! 💪");
  }

      setJuegos(updatedJuegos);
      setCurrentLevel(currentLevel + 1); // avanza al siguiente nivel
    } else {
      alert("No alcanzaste los puntos mínimos, inténtalo de nuevo.");
    }
  };

  // --- Render juego seleccionado ---
  if (selectedJuego) {
    const selectedLevel = selectedJuego.levels?.[currentLevel];
    if (selectedLevel && selectedLevel.unlocked) {
      if (isQuizMC(selectedJuego)) {
        return (
          <QuizMC
            juego={{ ...selectedJuego, points: selectedLevel.points, payload: selectedLevel.payload as QuizMCPayload }}
            onBack={() => { setSelectedJuego(null); setCurrentLevel(0); }}
            onLevelComplete={handleLevelComplete}
          />
        );
      }
      if (isTrueFalse(selectedJuego)) {
        return (
          <TrueFalse
            juego={{ ...selectedJuego, points: selectedLevel.points, payload: selectedLevel.payload as TrueFalsePayload }}
            currentLevel={currentLevel}
            onBack={() => { setSelectedJuego(null); setCurrentLevel(0); }}
            onLevelComplete={handleLevelComplete}
          />
        );
      }
      if (isDecision(selectedJuego)) {
        return (
          <DecisionGame
            juego={{ ...selectedJuego, points: selectedLevel.points, payload: selectedLevel.payload as DecisionPayload }}
            currentLevel={currentLevel}
            onBack={() => { setSelectedJuego(null); setCurrentLevel(0); }}
            onLevelComplete={handleLevelComplete}
          />
        );
      }
      if (isCategorize(selectedJuego)) {
        return (
          <CategorizeGame
            juego={{ ...selectedJuego, points: selectedLevel.points, payload: selectedLevel.payload as CategorizePayload }}
            
            onBack={() => { setSelectedJuego(null); setCurrentLevel(0); }}
          />
        );
      }
      if (isBudget(selectedJuego)) {
        return (
          <BudgetGame
            juego={{ ...selectedJuego, points: selectedLevel.points, payload: selectedLevel.payload as BudgetPayload }}
            
            onBack={() => { setSelectedJuego(null); setCurrentLevel(0); }}
          />
        );
      }
    }
  }

  // --- Lista de juegos con niveles ---
  return (
      <div className="p-6">

    <button
      onClick={() => window.history.back()}
      className="mb-4 px-3 py-1 border rounded hover:bg-gray-100"
    >
      ← Volver
    </button>

    <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <BookOpen className="w-6 h-6 text-primary" /> Educación Financiera
      </h1>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && juegos.length > 0 ? (
        <div className="space-y-6 mt-6">
          {juegos.map((juego) => (
            <Card key={juego.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{juego.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {juego.levels ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {juego.levels.map((lvl, idx) => (
                      <div
                        key={idx}
                        className={`p-2 border rounded text-center cursor-pointer transition ${
                          lvl.unlocked
                            ? "bg-green-100 hover:bg-green-200"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        onClick={() => {
                          if (lvl.unlocked) {
                            setSelectedJuego(juego);
                            setCurrentLevel(idx);
                          }
                        }}
                      >
                        <p className="font-semibold">Nivel {lvl.level}</p>
                        <p className="text-xs">Pts: {lvl.points}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No hay niveles definidos</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !loading ? (
        <p className="text-center text-muted-foreground">No se encontraron juegos financieros.</p>
      ) : null}
    </div>
  );
}
