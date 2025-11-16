import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupAuth, isAdmin } from "./auth";
import { storage } from "./storage";
import OpenAI from "openai";
import nodemailer from "nodemailer";
import financeRoutes from "./financeRoutes";
import express from "express";
import dotenv from "dotenv";
import forumRoutes from "./forumRoutes";
import { set } from "date-fns";

dotenv.config(); // asegura cargar .env

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Middleware para asegurar que el usuario esté logueado
function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Usuario no autenticado" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.use("/api/finance", financeRoutes);
  app.use("/api/forum", forumRoutes);

 // const router = express.Router();

  // Contact form
  app.post("/api/contact", async (req, res) => {
    const { name, email, message, to } = req.body;
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      } as nodemailer.TransportOptions);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Nuevo mensaje de contacto de ${name} <${email}>`,
        text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
      };
      const info = await transporter.sendMail(mailOptions);
      console.log("[nodemailer] sendMail response:", info);
      res.status(200).json({ success: true, info });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("[nodemailer] error:", errorMessage);
      res.status(500).json({ success: false, error: errorMessage });
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

  //app.use(router);

  const httpServer = createServer(app);
  return httpServer;
}
