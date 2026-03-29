import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupAuth, isAdmin } from "./auth";
import { storage } from "./storage";
import OpenAI from "openai";
import { sendContactEmail } from "./emailService";
import financeRoutes from "./financeRoutes";
import dotenv from "dotenv";
import forumRoutes from "./forumRoutes";
import fileRoutes from "./fileRoutes";
import financiaplayRoutes from "./financiaplayRoutes";
import rateLimit from "express-rate-limit";


dotenv.config(); // asegura cargar .env

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Rate limiter for contact form
const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour per IP
  message: { error: "Demasiados mensajes de contacto. Por favor, inténtalo de nuevo en 1 hora." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware para asegurar que el usuario esté logueado
function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Usuario no autenticado" });
}

// Helper function to calculate investor profile based on questionnaire answers
function calculateInvestorProfile(answers: Record<number, number>): { riskProfile: string; totalScore: number } {
  // Sum points from questions 1-6
  const totalScore = Object.entries(answers)
    .filter(([questionId]) => {
      const qid = parseInt(questionId, 10);
      return qid >= 1 && qid <= 6;
    })
    .reduce((sum, [, points]) => sum + points, 0);

  // Determine risk profile based on total score
  // Conservative: 0-7, Moderate: 8-14, Aggressive: 15-21
  let riskProfile: string;
  if (totalScore <= 7) {
    riskProfile = 'conservative';
  } else if (totalScore <= 14) {
    riskProfile = 'moderate';
  } else {
    riskProfile = 'aggressive';
  }

  return { riskProfile, totalScore };
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.use("/api/finance", financeRoutes);
  app.use("/api/forum", forumRoutes);
  app.use("/api/files", fileRoutes);
  app.use("/api/financiaplay", financiaplayRoutes);

 // const router = express.Router();

  // Contact form (with rate limiting and SendGrid)
  app.post("/api/contact", contactRateLimiter, async (req, res) => {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Nombre, email y mensaje son requeridos" });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: "Formato de email inválido" });
    }

    try {
      await sendContactEmail(name, email, message);
      console.log(`[routes] ✅ Contact form submitted by ${name} <${email}>`);
      res.status(200).json({ success: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`[routes] ❌ Contact form error:`, errorMessage);
      res.status(500).json({ success: false, error: "Error al enviar el mensaje. Por favor, inténtalo de nuevo." });
    }
  });

  app.get("/api/check-secret", (req, res) => {
    const { key } = req.query;
    if (!key || typeof key !== "string") {
      return res.status(400).json({ error: "Se requiere un nombre de clave" });
    }
    const secretValue = process.env[key];
    res.json({ available: !!secretValue });
  });

  // AI financial advice
 app.post("/api/ai/financial-advice", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) return res.status(400).json({ error: "Se requiere un mensaje" });

      if (!openai) {
        console.error("❌ OpenAI no está inicializado");
        return res.status(503).json({
          error: "Servicio de IA no disponible",
          response: "El servicio de IA no está disponible actualmente.",
        });
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Eres un asesor financiero profesional, claro y responsable. No prometas rendimientos, da consejos realistas." },
          { role: "user", content: message },
        ],
      });

      const aiResponse = completion.choices[0]?.message?.content || "No se recibió respuesta del modelo.";
      console.log("💬 Respuesta de OpenAI:", aiResponse);

      res.json({ response: aiResponse });
    } catch (error: any) {
      console.error("❌ Error al procesar solicitud de IA:", error.response?.data || error.message || error);
      res.status(500).json({ error: "Error interno del servidor", response: "Ocurrió un error al obtener la respuesta de IA." });
    }
  });

  // Analyze portfolio
app.post("/api/ai/analyze-portfolio", ensureAuthenticated, async (req, res) => {
    try {
      console.log("req.user:", req.user);
      const { portfolioId } = req.body;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });
      if (!portfolioId) return res.status(400).json({ error: "Se requiere el ID del portafolio" });

      const assets = await storage.getAssets(portfolioId);
      if (!assets || assets.length === 0) {
        return res.json({ analysis: "Este portafolio no tiene assets todavía." });
      }

      const totalValue = assets.reduce((sum, a) => sum + (a.value || 0), 0);
      const assetBreakdown = assets.map(a => ({
        name: a.name,
        value: a.value,
        percentage: totalValue ? ((a.value / totalValue) * 100).toFixed(2) + "%" : "0%"
      }));

      res.json({ analysis: { totalValue, assets: assetBreakdown, message: "Análisis generado con datos reales del portafolio." } });
    } catch (err) {
      console.error("Error al analizar el portafolio:", err);
      res.status(500).json({ error: "Error interno del servidor", analysis: "Ocurrió un error al analizar tu portafolio. Intenta nuevamente." });
    }
  });

  // Portfolios
  app.get("/api/portfolios", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      const portfolios = await storage.getPortfolios(userId!);
      res.json(portfolios);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al obtener portafolios" });
    }
  });

  app.post("/api/portfolios", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const portfolio = await storage.createPortfolio({ ...req.body, userId });
      res.json(portfolio);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al crear portafolio" });
    }
  });

  app.get("/api/portfolios/:id/assets", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const portfolioId = parseInt(req.params.id, 10);
      const assets = await storage.getAssets(portfolioId);
      res.json(assets);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al obtener los assets" });
    }
  });

  app.post("/api/portfolios/:id/assets", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const portfolioId = parseInt(req.params.id, 10);
      const assetData = req.body;
      const newAsset = await storage.createAsset({ ...assetData, portfolioId });
      res.json(newAsset);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al agregar el asset" });
    }
  });

  app.delete("/api/portfolios/:id/assets/:assetId", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const assetId = parseInt(req.params.assetId, 10);
      const success = await storage.deleteAsset(assetId);
      res.json({ success });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al eliminar el asset" });
    }
  });
// Transactions
app.get("/api/portfolios/:id/transactions", ensureAuthenticated, async (req, res) => {
  try {
    const portfolioId = parseInt(req.params.id, 10);
    const transactions = await storage.getTransactions(portfolioId);
    res.json(transactions);
  } catch (err) {
    console.error("Error obteniendo transacciones:", err);
    res.status(500).json({ error: "Error al obtener las transacciones" });
  }
});

app.post("/api/portfolios/:id/transactions", ensureAuthenticated, async (req, res) => {
  try {
    const portfolioId = parseInt(req.params.id, 10);
    const txData = req.body;
    const newTx = await storage.createTransaction({ ...txData, portfolioId });
    res.json(newTx);
  } catch (err) {
    console.error("Error creando transacción:", err);
    res.status(500).json({ error: "Error al crear la transacción" });
  }
});

  // Investor Profile Routes
  
  // POST /api/investor-profile - Create/Submit questionnaire
  app.post("/api/investor-profile", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { answers } = req.body;

      if (!answers || typeof answers !== 'object') {
        return res.status(400).json({ error: "Se requieren respuestas al cuestionario" });
      }

      // Check if user already has a profile
      const existingProfile = await storage.getInvestorProfileByUserId(userId);
      if (existingProfile) {
        return res.status(409).json({ error: "El usuario ya tiene un perfil de inversor. Usa PUT para actualizar." });
      }

      // Calculate risk profile and total score
      const { riskProfile, totalScore } = calculateInvestorProfile(answers);

      // Create the profile
      const newProfile = await storage.createInvestorProfile({
        userId,
        riskProfile: riskProfile as "conservative" | "moderate" | "aggressive",
        totalScore,
        answers,
        completedAt: new Date(),
      });

      res.status(201).json(newProfile);
    } catch (err) {
      console.error("Error al crear perfil de inversor:", err);
      res.status(500).json({ error: "Error al crear el perfil de inversor" });
    }
  });

  // GET /api/investor-profile - Retrieve current user's profile
  app.get("/api/investor-profile", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const profile = await storage.getInvestorProfileByUserId(userId);

      if (!profile) {
        return res.status(404).json({ error: "No se encontró un perfil de inversor para este usuario" });
      }

      res.json(profile);
    } catch (err) {
      console.error("Error al obtener perfil de inversor:", err);
      res.status(500).json({ error: "Error al obtener el perfil de inversor" });
    }
  });

  // PUT /api/investor-profile - Update/Re-take questionnaire
  app.put("/api/investor-profile", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { answers } = req.body;

      if (!answers || typeof answers !== 'object') {
        return res.status(400).json({ error: "Se requieren respuestas al cuestionario" });
      }

      // Check if profile exists
      const existingProfile = await storage.getInvestorProfileByUserId(userId);
      if (!existingProfile) {
        return res.status(404).json({ error: "No se encontró un perfil de inversor. Usa POST para crear uno." });
      }

      // Recalculate risk profile and total score
      const { riskProfile, totalScore } = calculateInvestorProfile(answers);

      // Update the profile
      const updatedProfile = await storage.updateInvestorProfile(userId, {
        riskProfile: riskProfile as "conservative" | "moderate" | "aggressive",
        totalScore,
        answers,
        completedAt: new Date(),
      });

      res.json(updatedProfile);
    } catch (err) {
      console.error("Error al actualizar perfil de inversor:", err);
      res.status(500).json({ error: "Error al actualizar el perfil de inversor" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
