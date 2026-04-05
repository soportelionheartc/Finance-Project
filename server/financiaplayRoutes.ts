import express from "express";
import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import { ai } from "./ai";

dotenv.config();

const router = express.Router();

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Usuario no autenticado" });
}

// GET /api/financiaplay/placement — obtener nivel desbloqueado del usuario
router.get("/placement", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user!.id;
    const placement = await storage.getFinanciaplayPlacement(userId);
    if (!placement) {
      return res.json({ hasPlacement: false, unlockedLevel: null });
    }
    res.json({ hasPlacement: true, ...placement });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    res.status(500).json({ error: message });
  }
});

// POST /api/financiaplay/placement — guardar resultado del test diagnóstico
router.post("/placement", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { unlockedLevel, score } = req.body;

    if (!unlockedLevel || !score) {
      return res
        .status(400)
        .json({ error: "Se requiere unlockedLevel y score" });
    }

    const existing = await storage.getFinanciaplayPlacement(userId);
    if (existing) {
      const updated = await storage.updateFinanciaplayPlacement(userId, {
        unlockedLevel,
        score,
      });
      return res.json(updated);
    }

    const placement = await storage.createFinanciaplayPlacement({
      userId,
      unlockedLevel,
      score,
    });
    res.json(placement);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    res.status(500).json({ error: message });
  }
});

// GET /api/financiaplay/progress — progreso completo del usuario
router.get("/progress", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user!.id;
    const [progress, xpData, badges, placement] = await Promise.all([
      storage.getFinanciaplayProgress(userId),
      storage.getFinanciaplayXp(userId),
      storage.getFinanciaplayBadges(userId),
      storage.getFinanciaplayPlacement(userId),
    ]);

    res.json({
      completedGames: progress,
      totalXp: xpData?.totalXp ?? 0,
      badges: badges.map((b) => b.badgeId),
      unlockedLevel: placement?.unlockedLevel ?? null,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    res.status(500).json({ error: message });
  }
});

// POST /api/financiaplay/game/complete — registrar finalización de un juego
router.post("/game/complete", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { gameId, levelId, score, maxScore, timeRemainingPct } = req.body;

    if (!gameId || !levelId || score === undefined || !maxScore) {
      return res.status(400).json({ error: "Datos del juego incompletos" });
    }

    // Calculate XP
    let xpGained = Math.round((score / maxScore) * maxScore);
    if (score === maxScore) xpGained = Math.round(xpGained * 1.2);
    else if (timeRemainingPct && timeRemainingPct > 0.5)
      xpGained = Math.round(xpGained * 1.1);

    // Save progress
    const progress = await storage.createFinanciaplayProgress({
      userId,
      gameId,
      levelId,
      score,
      maxScore,
      xpGained,
      timeRemainingPct: timeRemainingPct ?? 0,
    });

    // Update total XP
    const xpRecord = await storage.upsertFinanciaplayXp(userId, xpGained);

    // Check and award badges
    const newBadges: string[] = [];
    const allProgress = await storage.getFinanciaplayProgress(userId);

    // 🌱 Primer Paso — first game completed
    if (!(await storage.hasFinanciaplayBadge(userId, "starter"))) {
      await storage.createFinanciaplayBadge({ userId, badgeId: "starter" });
      newBadges.push("starter");
    }

    // ⚡ Rayo — completed with >50% time remaining
    if (
      timeRemainingPct > 0.5 &&
      !(await storage.hasFinanciaplayBadge(userId, "speed_demon"))
    ) {
      await storage.createFinanciaplayBadge({ userId, badgeId: "speed_demon" });
      newBadges.push("speed_demon");
    }

    // 🧠 Maestro del Quiz — 100% in 3 different quizzes
    const perfectQuizzes = allProgress.filter((p) => p.score === p.maxScore);
    const uniquePerfectGames = new Set(perfectQuizzes.map((p) => p.gameId));
    if (
      uniquePerfectGames.size >= 3 &&
      !(await storage.hasFinanciaplayBadge(userId, "quiz_master"))
    ) {
      await storage.createFinanciaplayBadge({ userId, badgeId: "quiz_master" });
      newBadges.push("quiz_master");
    }

    // Level completion badges
    const l1Games = ["L1G1", "L1G2", "L1G3", "L1G4", "L1G5"];
    const l2Games = ["L2G1", "L2G2", "L2G3", "L2G4", "L2G5"];
    const l3Games = ["L3G1", "L3G2", "L3G3", "L3G4", "L3G5", "L3G6"];

    const completedGameIds = new Set(allProgress.map((p) => p.gameId));

    if (
      l1Games.every((g) => completedGameIds.has(g)) &&
      !(await storage.hasFinanciaplayBadge(userId, "saver"))
    ) {
      await storage.createFinanciaplayBadge({ userId, badgeId: "saver" });
      newBadges.push("saver");
    }
    if (
      l2Games.every((g) => completedGameIds.has(g)) &&
      !(await storage.hasFinanciaplayBadge(userId, "investor"))
    ) {
      await storage.createFinanciaplayBadge({ userId, badgeId: "investor" });
      newBadges.push("investor");
    }
    if (
      l3Games.every((g) => completedGameIds.has(g)) &&
      !(await storage.hasFinanciaplayBadge(userId, "expert"))
    ) {
      await storage.createFinanciaplayBadge({ userId, badgeId: "expert" });
      newBadges.push("expert");
    }

    // ✨ Perfeccionista — perfect score in all games of any level
    const checkPerfectLevel = (gameIds: string[]) =>
      gameIds.every((g) =>
        allProgress.some((p) => p.gameId === g && p.score === p.maxScore),
      );

    if (
      (checkPerfectLevel(l1Games) ||
        checkPerfectLevel(l2Games) ||
        checkPerfectLevel(l3Games)) &&
      !(await storage.hasFinanciaplayBadge(userId, "perfectionist"))
    ) {
      await storage.createFinanciaplayBadge({
        userId,
        badgeId: "perfectionist",
      });
      newBadges.push("perfectionist");
    }

    res.json({
      progress,
      xpGained,
      totalXp: xpRecord.totalXp,
      newBadges,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    res.status(500).json({ error: message });
  }
});

// GET /api/financiaplay/leaderboard — top usuarios por XP
router.get("/leaderboard", ensureAuthenticated, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    const leaderboard = await storage.getFinanciaplayLeaderboard(limit);
    res.json(leaderboard);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    res.status(500).json({ error: message });
  }
});

// POST /api/financiaplay/lesson — generar micro-lección IA
router.post("/lesson", ensureAuthenticated, async (req, res) => {
  try {
    const { topicId, topicName, topicDesc, levelName, levelId } = req.body;

    if (!topicId || !topicName || !topicDesc || !levelName) {
      return res.status(400).json({ error: "Datos del tema incompletos" });
    }

    const levelNote =
      levelId === "L3"
        ? " Nivel L3: usa terminología técnica con referencias a CFA/GARP/Basilea."
        : "";
    const systemPrompt = `Eres un educador financiero experto. El usuario está aprendiendo sobre '${topicName}' (${topicDesc}) en el nivel '${levelName}'.${levelNote} `;
    const prompt = `Genera una mini-lección educativa BREVE, DINÁMICA y GAMIFICADA en español con este formato JSON exacto: { "emoji": "...", "title": "...", "hook": "...", "concept": "...", "example": "...", "keyFact": "...", "challenge": "..." }. Responde SOLO con el JSON, sin texto adicional.`;

    if (!ai) {
      return res.json({
        emoji: "📚",
        title: topicName,
        hook: "Aprende sobre " + topicName,
        concept: topicDesc,
        example: "Ejemplo práctico de " + topicName,
        keyFact: "Dato clave sobre " + topicName,
        challenge: "¿Puedes aplicar este concepto en tu vida financiera?",
      });
    }
    const message = await ai.chat([
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ]);

    const parsed = JSON.parse(message);
    res.json(parsed);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    res.status(500).json({
      error: message,
      emoji: "❌",
      title: "Error",
      hook: "No se pudo generar la lección",
      concept: "Intenta de nuevo más tarde",
      example: "",
      keyFact: "",
      challenge: "",
    });
  }
});

export default router;
