import type { Express } from "express";
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

dotenv.config(); // asegúrate de cargar .env (si no lo haces desde index.ts)

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;
console.log("✅ OPENAI_API_KEY detectada:", !!process.env.OPENAI_API_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup auth UNA VEZ
  setupAuth(app);

 // Rutas existentes
  app.use("/api/finance", financeRoutes);

    // Rutas del foro
  app.use("/api/forum", forumRoutes);

  // Montar router de finanzas
  app.use("/api/finance", financeRoutes);

  const router = express.Router();

  router.post("/api/contact", async (req, res) => {
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

  app.use(router);

  app.get("/api/check-secret", (req, res) => {
    const { key } = req.query;
    if (!key || typeof key !== "string") {
      return res.status(400).json({ error: "Se requiere un nombre de clave" });
    }
    const secretValue = process.env[key];
    res.json({ available: !!secretValue });
  });

  // Endpoint para obtener consejos financieros
  app.post("/api/ai/financial-advice", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Se requiere un mensaje" });
    }

    if (!openai) {
      console.error("❌ OpenAI no está inicializado");
      return res.status(503).json({
        error: "Servicio de IA no disponible",
        response: "El servicio de IA no está disponible actualmente.",
      });
    }

    // 🔥 Aquí hacemos la llamada real a OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un asesor financiero profesional, claro y responsable. No prometas rendimientos, da consejos realistas.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const aiResponse = completion.choices[0]?.message?.content || "No se recibió respuesta del modelo.";
    console.log("💬 Respuesta de OpenAI:", aiResponse);

    res.json({ response: aiResponse });

  } catch (error: any) {
    console.error("❌ Error al procesar solicitud de IA:");
    console.error(error.response?.data || error.message || error);
    res.status(500).json({
      error: "Error interno del servidor",
      response: "Ocurrió un error al obtener la respuesta de IA."
    });
  }
});

  // Endpoint para analizar portafolio (mantengo tu logic actual)
  app.post("/api/ai/analyze-portfolio", async (req, res) => {
    try {
      const { assets } = req.body;
      if (!assets || !Array.isArray(assets)) {
        return res.status(400).json({ error: "Se requiere un array de activos" });
      }

      if (!process.env.OPENAI_API_KEY || !openai) {
        return res.status(503).json({
          error: "Servicio de IA no disponible",
          analysis: "Lo siento, el servicio de análisis de portafolio no está disponible en este momento. Por favor, intente más tarde.",
        });
      }

      // (Aquí podrías llamar a OpenAI para un análisis real; por ahora uso el placeholder)
      const analysisResponse = "Tu portafolio muestra una buena diversificación ...";
      res.json({ analysis: analysisResponse });
    } catch (error) {
      console.error("Error al analizar el portafolio:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        analysis: "Lo siento, ha ocurrido un error al analizar tu portafolio. Por favor, intenta nuevamente más tarde.",
      });
    }
  });
  // Dentro de registerRoutes, antes de crear el servidor:
router.get("/api/portfolios", (req, res) => {
  // Devuelve un array vacío por ahora
  res.json([]);
});

// O si quieres simular algunos portafolios de ejemplo:
router.get("/api/portfolios", (req, res) => {
  const samplePortfolios = [
    { id: 1, name: "Portafolio A", totalValue: 1000000, initial_value: 900000, userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: "Portafolio B", totalValue: 500000, initial_value: 500000, userId: 1, createdAt: new Date(), updatedAt: new Date() },
  ];
  res.json(samplePortfolios);
});

app.use(router);


  // --- resto de rutas (admin, portfolios, wallets, chat, etc.) ---
  // (copiar el resto de tus rutas exactamente como las tienes, sin volver a llamar setupAuth)

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
