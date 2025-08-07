import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, isAdmin } from "./auth";
import { storage } from "./storage";
import OpenAI from "openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Endpoint para verificar si una clave secreta existe
  app.get("/api/check-secret", (req, res) => {
    const { key } = req.query;
    if (!key || typeof key !== 'string') {
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

      // Verificar si la clave de OpenAI está disponible
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ 
          error: "Servicio de IA no disponible", 
          response: "Lo siento, el servicio de IA no está disponible en este momento. Por favor, intente más tarde."
        });
      }

      // Aquí conectarías con OpenAI para obtener la respuesta 
      // Implementación con respuestas de ejemplo
      const responses = [
        "Basado en mi análisis, te recomendaría diversificar tu portafolio para minimizar el riesgo. Considera una mezcla de acciones, bonos y activos alternativos.",
        "Para maximizar tus retornos a largo plazo, es importante mantener disciplina y no reaccionar emocionalmente a las fluctuaciones del mercado.",
        "Antes de invertir en criptomonedas, es crucial entender los riesgos asociados. No inviertas más de lo que estás dispuesto a perder.",
        "El interés compuesto es una poderosa herramienta para construir riqueza a largo plazo. Empezar temprano y ser consistente puede generar resultados significativos.",
        "Para inversores principiantes, los fondos indexados ofrecen una manera efectiva y de bajo costo para obtener exposición al mercado.",
        "Recuerda siempre tener un fondo de emergencia antes de comenzar a invertir. Esto te dará tranquilidad y evitará que tengas que vender inversiones en momentos desfavorables."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      // Guardar el mensaje en el historial del usuario si está autenticado
      if (req.isAuthenticated()) {
        const userId = req.user.id;
        await storage.saveChatMessage({
          userId,
          message,
          response: randomResponse
        });
      }
      
      res.json({ response: randomResponse });
    } catch (error) {
      console.error("Error al procesar la solicitud de IA:", error);
      res.status(500).json({ 
        error: "Error interno del servidor",
        response: "Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde."
      });
    }
  });

  // Endpoint para analizar portafolio
  app.post("/api/ai/analyze-portfolio", async (req, res) => {
    try {
      const { assets } = req.body;
      if (!assets || !Array.isArray(assets)) {
        return res.status(400).json({ error: "Se requiere un array de activos" });
      }

      // Verificar si la clave de OpenAI está disponible
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ 
          error: "Servicio de IA no disponible",
          analysis: "Lo siento, el servicio de análisis de portafolio no está disponible en este momento. Por favor, intente más tarde."
        });
      }

      // Aquí conectarías con OpenAI para obtener el análisis
      // Implementación con respuesta de ejemplo
      const analysisResponse = "Tu portafolio muestra una buena diversificación entre acciones y criptomonedas. Sin embargo, podrías considerar aumentar tu exposición a bonos para reducir la volatilidad general. Actualmente, tienes un perfil de riesgo moderado-alto, con aproximadamente un 70% en acciones de alta capitalización, 20% en criptomonedas y 10% en efectivo. Para mejorar tu balance, considera una asignación de 60% en acciones, 15% en bonos, 15% en criptomonedas y 10% en efectivo o equivalentes.";
      
      res.json({ analysis: analysisResponse });
    } catch (error) {
      console.error("Error al analizar el portafolio:", error);
      res.status(500).json({ 
        error: "Error interno del servidor",
        analysis: "Lo siento, ha ocurrido un error al analizar tu portafolio. Por favor, intenta nuevamente más tarde."
      });
    }
  });
  // Setup authentication routes
  setupAuth(app);
  
  // Admin routes
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Don't send passwords to client
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).json({ message: "Error retrieving users" });
    }
  });

  // Initialize OpenAI client if API key is available
  const openai = process.env.OPENAI_API_KEY 
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
    : null;

  // Portfolio routes
  app.get("/api/portfolios", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const portfolios = await storage.getPortfolios(req.user!.id);
      res.json(portfolios);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving portfolios" });
    }
  });

  app.post("/api/portfolios", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const portfolio = await storage.createPortfolio({
        ...req.body,
        userId: req.user!.id
      });
      res.status(201).json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Error creating portfolio" });
    }
  });

  app.get("/api/portfolios/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const portfolioId = parseInt(req.params.id);
      const portfolio = await storage.getPortfolio(portfolioId);
      
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      
      // Check if portfolio belongs to user
      if (portfolio.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized access to portfolio" });
      }
      
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving portfolio" });
    }
  });

  // Asset routes
  app.get("/api/portfolios/:id/assets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const portfolioId = parseInt(req.params.id);
      const portfolio = await storage.getPortfolio(portfolioId);
      
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      
      // Check if portfolio belongs to user
      if (portfolio.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized access to portfolio" });
      }
      
      const assets = await storage.getAssets(portfolioId);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving assets" });
    }
  });

  app.post("/api/portfolios/:id/assets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const portfolioId = parseInt(req.params.id);
      const portfolio = await storage.getPortfolio(portfolioId);
      
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      
      // Check if portfolio belongs to user
      if (portfolio.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized access to portfolio" });
      }
      
      // Calculate value from price and quantity
      const value = req.body.price * req.body.quantity;
      
      const asset = await storage.createAsset({
        ...req.body,
        portfolioId,
        value
      });
      
      res.status(201).json(asset);
    } catch (error) {
      res.status(500).json({ message: "Error creating asset" });
    }
  });

  // Strategy routes
  app.get("/api/strategies", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const strategies = await storage.getStrategies(req.user!.id);
      res.json(strategies);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving strategies" });
    }
  });

  app.post("/api/strategies", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const strategy = await storage.createStrategy({
        ...req.body,
        userId: req.user!.id
      });
      res.status(201).json(strategy);
    } catch (error) {
      res.status(500).json({ message: "Error creating strategy" });
    }
  });

  // Wallet authentication routes
  app.post("/api/auth/wallet-login", async (req, res) => {
    try {
      const { address, type } = req.body;
      
      if (!address || !type) {
        return res.status(400).json({ error: "Se requiere dirección y tipo de wallet" });
      }
      
      // Buscar si existe una wallet con esta dirección
      const wallets = await storage.getAllWallets();
      const existingWallet = wallets.find(w => w.address.toLowerCase() === address.toLowerCase());
      
      if (!existingWallet) {
        // Si no existe la wallet, creamos un nuevo usuario
        // En un caso real, verificaríamos la firma criptográfica para autenticar
        const username = `${type.substring(0, 3)}_${address.substring(0, 6)}`;
        const randomPassword = Math.random().toString(36).slice(-10);
        
        const newUser = await storage.createUser({
          username,
          email: `${username}@placeholder.com`,
          password: randomPassword, // En un caso real, usaríamos un método más seguro
          name: `Wallet User ${address.substring(0, 6)}`
        });
        
        // Crear la wallet para este usuario
        await storage.createWallet({
          userId: newUser.id,
          type: type as any,
          address,
          isDefault: true
        });
        
        // Login
        req.login(newUser, (err) => {
          if (err) {
            return res.status(500).json({ error: "Error al iniciar sesión" });
          }
          return res.status(201).json(newUser);
        });
      } else {
        // Si la wallet existe, obtenemos el usuario y lo autenticamos
        const user = await storage.getUser(existingWallet.userId);
        
        if (!user) {
          return res.status(404).json({ error: "Usuario no encontrado" });
        }
        
        req.login(user, (err) => {
          if (err) {
            return res.status(500).json({ error: "Error al iniciar sesión" });
          }
          return res.json(user);
        });
      }
    } catch (error) {
      console.error("Error al autenticar con wallet:", error);
      res.status(500).json({ error: "Error al procesar la autenticación con wallet" });
    }
  });
  
  // Wallets management routes
  app.get("/api/wallets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const wallets = await storage.getWallets(req.user!.id);
      res.json(wallets);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving wallets" });
    }
  });
  
  app.post("/api/wallets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const wallet = await storage.createWallet({
        ...req.body,
        userId: req.user!.id
      });
      res.status(201).json(wallet);
    } catch (error) {
      res.status(500).json({ message: "Error creating wallet" });
    }
  });
  
  // Decentralized messages routes
  app.get("/api/decentralized-messages", async (req, res) => {
    try {
      const { topic } = req.query;
      
      if (!topic || typeof topic !== 'string') {
        return res.status(400).json({ error: "Se requiere un tema" });
      }
      
      const messages = await storage.getDecentralizedMessages(topic);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving decentralized messages" });
    }
  });
  
  app.post("/api/decentralized-messages", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { senderAddress, content, topic, chainId, isEncrypted } = req.body;
      
      if (!senderAddress || !content || !chainId) {
        return res.status(400).json({ error: "Faltan campos requeridos" });
      }
      
      // En producción verificaríamos que el usuario es dueño de la dirección
      // validando una firma
      
      // Obtener la wallet del usuario
      const wallets = await storage.getWallets(req.user!.id);
      let walletId = null;
      
      if (wallets.length > 0) {
        // Buscar la wallet que coincida con la dirección del remitente
        const matchingWallet = wallets.find(w => 
          w.address.toLowerCase() === senderAddress.toLowerCase()
        );
        
        if (matchingWallet) {
          walletId = matchingWallet.id;
        }
      }
      
      const message = await storage.saveDecentralizedMessage({
        walletId,
        senderAddress,
        content,
        topic: topic || 'general',
        chainId,
        isEncrypted: isEncrypted || false
      });
      
      res.status(201).json(message);
    } catch (error) {
      console.error("Error al guardar mensaje descentralizado:", error);
      res.status(500).json({ error: "Error al guardar el mensaje" });
    }
  });

  // AI Chat routes
  app.get("/api/chat/history", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const chatHistory = await storage.getChatHistory(req.user!.id);
      res.json(chatHistory);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving chat history" });
    }
  });

  app.post("/api/chat/message", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const message = req.body.message;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      // If OpenAI API key is not available, return a message
      if (!openai) {
        const chatEntry = await storage.saveChatMessage({
          userId: req.user!.id,
          message,
          response: "Lo siento, el servicio de chat IA no está disponible en este momento. Por favor, contacta al administrador."
        });
        return res.json(chatEntry);
      }
      
      // Call OpenAI API to get response
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system", 
            content: "Eres un asesor financiero experto especializado en inversiones, mercados financieros, criptomonedas, acciones y estrategias de trading. Proporciona respuestas precisas, informativas y útiles a consultas sobre estos temas. Evita dar consejos que puedan interpretarse como recomendaciones de inversión específicas. Tu objetivo es educar y proporcionar información objetiva."
          },
          { 
            role: "user", 
            content: message 
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      
      const response = completion.choices[0].message.content || "Lo siento, no pude procesar tu consulta.";
      
      // Save chat to history
      const chatEntry = await storage.saveChatMessage({
        userId: req.user!.id,
        message,
        response
      });
      
      res.json(chatEntry);
    } catch (error) {
      console.error("Chat API error:", error);
      
      // Fallback response
      const chatEntry = await storage.saveChatMessage({
        userId: req.user!.id,
        message: req.body.message,
        response: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo más tarde."
      });
      
      res.status(500).json(chatEntry);
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
