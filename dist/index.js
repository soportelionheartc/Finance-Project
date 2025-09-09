var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express3 from "express";

// server/routes.ts
import { createServer } from "http";

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session3 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// server/storage.ts
import "dotenv/config";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  assets: () => assets,
  authProviderEnum: () => authProviderEnum,
  authProviders: () => authProviders,
  blockchainTypeEnum: () => blockchainTypeEnum,
  chatHistory: () => chatHistory,
  decentralizedMessages: () => decentralizedMessages,
  insertAssetSchema: () => insertAssetSchema,
  insertAuthProviderSchema: () => insertAuthProviderSchema,
  insertChatHistorySchema: () => insertChatHistorySchema,
  insertDecentralizedMessageSchema: () => insertDecentralizedMessageSchema,
  insertPortfolioSchema: () => insertPortfolioSchema,
  insertStrategySchema: () => insertStrategySchema,
  insertUserSchema: () => insertUserSchema,
  insertWalletSchema: () => insertWalletSchema,
  portfolio_history: () => portfolio_history,
  portfolios: () => portfolios,
  session: () => session,
  strategies: () => strategies,
  userRoleEnum: () => userRoleEnum,
  users: () => users,
  wallets: () => wallets
});
import { pgTable, text, serial, integer, boolean, timestamp, real, json, pgEnum, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var authProviderEnum = pgEnum("auth_provider", ["local", "google", "apple", "phantom", "metamask", "walletconnect"]);
var userRoleEnum = pgEnum("user_role", ["user", "admin"]);
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique(),
  password: text("password"),
  email: text("email").notNull().unique(),
  name: text("name"),
  profilePicture: text("profile_picture"),
  role: userRoleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
  isEmailVerified: boolean("is_email_verified").default(false),
  preferredLanguage: text("preferred_language").default("es")
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
  role: true,
  isEmailVerified: true,
  profilePicture: true
});
var session = pgTable("session", {
  sid: varchar("sid").primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire").notNull()
});
var authProviders = pgTable("auth_providers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  provider: authProviderEnum("provider").notNull(),
  providerId: text("provider_id").notNull(),
  // ID único del proveedor (Google ID, Apple ID, etc.)
  providerData: json("provider_data"),
  // Datos adicionales del proveedor
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertAuthProviderSchema = createInsertSchema(authProviders).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var blockchainTypeEnum = pgEnum("blockchain_type", ["ethereum", "solana", "bitcoin", "polygon", "binance"]);
var wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: blockchainTypeEnum("type").notNull(),
  // ethereum, solana, bitcoin, etc.
  address: text("address").notNull(),
  label: text("label"),
  publicKey: text("public_key"),
  balance: real("balance").default(0),
  network: text("network"),
  // mainnet, testnet, devnet, etc.
  isConnected: boolean("is_connected").default(false),
  isDefault: boolean("is_default").default(false),
  lastSynced: timestamp("last_synced"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  totalValue: real("total_value").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  initial_value: real("initial_value").default(0)
});
var insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var portfolio_history = pgTable("portfolio_history", {
  id: serial("id").primaryKey(),
  portfolio_id: integer("portfolio_id").notNull().references(() => portfolios.id),
  value: real("value").notNull(),
  date: timestamp("date").notNull()
});
var assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id").notNull().references(() => portfolios.id),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  type: text("type").notNull(),
  // stock, crypto, etf, etc
  quantity: real("quantity").notNull(),
  price: real("price").notNull(),
  value: real("value").notNull(),
  change24h: real("change24h"),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var strategies = pgTable("strategies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  parameters: json("parameters"),
  active: boolean("active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertStrategySchema = createInsertSchema(strategies).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  response: text("response").notNull(),
  timestamp: timestamp("timestamp").defaultNow()
});
var insertChatHistorySchema = createInsertSchema(chatHistory).omit({
  id: true,
  timestamp: true
});
var decentralizedMessages = pgTable("decentralized_messages", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").references(() => wallets.id),
  senderAddress: text("sender_address").notNull(),
  content: text("content").notNull(),
  topic: text("topic"),
  // Tema del mensaje (finanzas, inversiones, etc.)
  timestamp: timestamp("timestamp").defaultNow(),
  transactionHash: text("transaction_hash"),
  // Hash de la transacción en blockchain
  chainId: text("chain_id").notNull(),
  // ID de la cadena (Ethereum, Solana, etc.)
  isEncrypted: boolean("is_encrypted").default(false)
});
var insertDecentralizedMessageSchema = createInsertSchema(decentralizedMessages).omit({
  id: true,
  timestamp: true
});

// server/storage.ts
import session2 from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";

// server/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
var { Pool } = pkg;
var pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
var db = drizzle(pool, { schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
var MemoryStore = createMemoryStore(session2);
var PostgresSessionStore = connectPg(session2);
var DatabaseStorage = class {
  sessionStore;
  // Using any to avoid SessionStore type errors
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUserLastLogin(id) {
    const [user] = await db.update(users).set({ lastLogin: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
    return user;
  }
  async getAllUsers() {
    return db.select().from(users);
  }
  async deleteUser(id) {
    await db.delete(users).where(eq(users.id, id));
    const user = await this.getUser(id);
    return user === void 0;
  }
  // Portfolio operations
  async getPortfolios(userId) {
    return db.select().from(portfolios).where(eq(portfolios.userId, userId));
  }
  async getPortfolio(id) {
    const [portfolio] = await db.select().from(portfolios).where(eq(portfolios.id, id));
    return portfolio;
  }
  async createPortfolio(portfolio) {
    const [newPortfolio] = await db.insert(portfolios).values(portfolio).returning();
    return newPortfolio;
  }
  async updatePortfolio(id, portfolioUpdate) {
    const [updatedPortfolio] = await db.update(portfolios).set({
      ...portfolioUpdate,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(portfolios.id, id)).returning();
    return updatedPortfolio;
  }
  async deletePortfolio(id) {
    await db.delete(portfolios).where(eq(portfolios.id, id));
    const portfolio = await this.getPortfolio(id);
    return portfolio === void 0;
  }
  // Asset operations
  async getAssets(portfolioId) {
    return db.select().from(assets).where(eq(assets.portfolioId, portfolioId));
  }
  async getAsset(id) {
    const [asset] = await db.select().from(assets).where(eq(assets.id, id));
    return asset;
  }
  async createAsset(asset) {
    const [newAsset] = await db.insert(assets).values(asset).returning();
    const portfolio = await this.getPortfolio(asset.portfolioId);
    if (portfolio) {
      const updatedValue = portfolio.totalValue + asset.value;
      await this.updatePortfolio(portfolio.id, { totalValue: updatedValue });
    }
    return newAsset;
  }
  async updateAsset(id, assetUpdate) {
    const originalAsset = await this.getAsset(id);
    if (!originalAsset) return void 0;
    let newValue = originalAsset.value;
    if (assetUpdate.value !== void 0) {
      newValue = assetUpdate.value;
    } else if (assetUpdate.price !== void 0 || assetUpdate.quantity !== void 0) {
      const newPrice = assetUpdate.price !== void 0 ? assetUpdate.price : originalAsset.price;
      const newQuantity = assetUpdate.quantity !== void 0 ? assetUpdate.quantity : originalAsset.quantity;
      newValue = newPrice * newQuantity;
      assetUpdate.value = newValue;
    }
    const [updatedAsset] = await db.update(assets).set({
      ...assetUpdate,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(assets.id, id)).returning();
    if (updatedAsset && originalAsset.value !== newValue) {
      const portfolio = await this.getPortfolio(originalAsset.portfolioId);
      if (portfolio) {
        const valueDifference = newValue - originalAsset.value;
        const updatedValue = portfolio.totalValue + valueDifference;
        await this.updatePortfolio(portfolio.id, { totalValue: updatedValue });
      }
    }
    return updatedAsset;
  }
  async deleteAsset(id) {
    const asset = await this.getAsset(id);
    if (!asset) return false;
    const portfolio = await this.getPortfolio(asset.portfolioId);
    if (portfolio) {
      const updatedValue = portfolio.totalValue - asset.value;
      await this.updatePortfolio(portfolio.id, { totalValue: updatedValue });
    }
    await db.delete(assets).where(eq(assets.id, id));
    const deletedAsset = await this.getAsset(id);
    return deletedAsset === void 0;
  }
  // Strategy operations
  async getStrategies(userId) {
    return db.select().from(strategies).where(eq(strategies.userId, userId));
  }
  async getStrategy(id) {
    const [strategy] = await db.select().from(strategies).where(eq(strategies.id, id));
    return strategy;
  }
  async createStrategy(strategy) {
    const [newStrategy] = await db.insert(strategies).values(strategy).returning();
    return newStrategy;
  }
  async updateStrategy(id, strategyUpdate) {
    const [updatedStrategy] = await db.update(strategies).set({
      ...strategyUpdate,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(strategies.id, id)).returning();
    return updatedStrategy;
  }
  async deleteStrategy(id) {
    await db.delete(strategies).where(eq(strategies.id, id));
    const deletedStrategy = await this.getStrategy(id);
    return deletedStrategy === void 0;
  }
  // Chat operations
  async getChatHistory(userId) {
    return db.select().from(chatHistory).where(eq(chatHistory.userId, userId)).orderBy(chatHistory.timestamp);
  }
  async saveChatMessage(chatEntry) {
    const [newChat] = await db.insert(chatHistory).values(chatEntry).returning();
    return newChat;
  }
  // Wallet operations
  async getWallets(userId) {
    return db.select().from(wallets).where(eq(wallets.userId, userId));
  }
  async getWallet(id) {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.id, id));
    return wallet;
  }
  async getAllWallets() {
    return db.select().from(wallets);
  }
  async createWallet(wallet) {
    const [newWallet] = await db.insert(wallets).values(wallet).returning();
    return newWallet;
  }
  async updateWallet(id, walletUpdate) {
    const [updatedWallet] = await db.update(wallets).set({
      ...walletUpdate,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(wallets.id, id)).returning();
    return updatedWallet;
  }
  async deleteWallet(id) {
    await db.delete(wallets).where(eq(wallets.id, id));
    const deletedWallet = await this.getWallet(id);
    return deletedWallet === void 0;
  }
  // Decentralized messages operations
  async getDecentralizedMessages(topic) {
    return db.select().from(decentralizedMessages).where(eq(decentralizedMessages.topic, topic)).orderBy(decentralizedMessages.timestamp);
  }
  async getDecentralizedMessage(id) {
    const [message] = await db.select().from(decentralizedMessages).where(eq(decentralizedMessages.id, id));
    return message;
  }
  async saveDecentralizedMessage(message) {
    const [newMessage] = await db.insert(decentralizedMessages).values(message).returning();
    return newMessage;
  }
};
var storage = new DatabaseStorage();

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/auth.ts
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import "dotenv/config";
var SESSION_SECRET = process.env.SESSION_SECRET || randomBytes(32).toString("hex");
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied ?? "", salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
async function ensureAdminUser() {
  try {
    const adminUser = await storage.getUserByUsername("jplhc");
    if (!adminUser) {
      log("Creating admin user: jplhc", "auth");
      const admin = {
        username: "jplhc",
        password: await hashPassword("2025lhc"),
        email: "admin@lionheartcapital.com",
        name: "Lion Heart Admin"
      };
      const createdAdmin = await storage.createUser(admin);
      createdAdmin.role = "admin" /* ADMIN */;
      log("Admin user created successfully", "auth");
    } else {
      log("Admin user already exists", "auth");
    }
  } catch (error) {
    log(`Error ensuring admin user: ${error}`, "auth");
  }
}
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "admin" /* ADMIN */) {
    return next();
  }
  return res.status(403).json({ error: "Acceso no autorizado" });
}
function setupAuth(app2) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      if (!profile.emails || !profile.emails[0]?.value) {
        return done(new Error("No se recibi\xF3 el email de Google"), void 0);
      }
      let user = await storage.getUserByEmail(profile.emails[0].value);
      if (!user) {
        user = await storage.createUser({
          username: profile.displayName.replace(/\s/g, "_").toLowerCase(),
          email: profile.emails[0].value,
          name: profile.displayName,
          password: null
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, void 0);
    }
  }));
  app2.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  app2.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth?error=google" }),
    (req, res) => {
      res.redirect("/dashboard");
    }
  );
  const sessionSettings = {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1e3
      // 1 day
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session3(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  ensureAdminUser();
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password ?? "")) {
          return done(null, false);
        } else {
          if (username === "jplhc") {
            user.role = "admin" /* ADMIN */;
          } else {
            user.role = "user" /* USER */;
          }
          await storage.updateUserLastLogin(user.id);
          return done(null, { ...user, role: user.username === "jplhc" ? "admin" : "user" });
        }
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      if (user) {
        if (user.username === "jplhc") {
          user.role = "admin" /* ADMIN */;
        } else {
          user.role = "user" /* USER */;
        }
      }
      done(null, user ? { ...user, role: user.username === "jplhc" ? "admin" : "user" } : null);
    } catch (error) {
      done(error, null);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUsername = await storage.getUserByUsername(req.body.username);
      if (existingUsername) {
        return res.status(400).json({ error: "El nombre de usuario ya est\xE1 en uso" });
      }
      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ error: "El correo electr\xF3nico ya est\xE1 registrado" });
      }
      if (req.body.username === "jplhc") {
        return res.status(400).json({ error: "Este nombre de usuario est\xE1 reservado" });
      }
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password)
      });
      user.role = "user" /* USER */;
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: "Credenciales incorrectas" });
      }
      req.login(user, (err2) => {
        if (err2) return next(err2);
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
  app2.post("/api/auth/apple", async (req, res, next) => {
    try {
      const randomId = Math.floor(Math.random() * 1e4);
      const email = `apple_user_${randomId}@example.com`;
      let user = await storage.getUserByEmail(email);
      if (!user) {
        user = await storage.createUser({
          username: `apple_user_${randomId}`,
          email,
          password: await hashPassword(randomBytes(16).toString("hex")),
          // Random password
          name: `Apple User ${randomId}`
        });
      }
      user.role = "user" /* USER */;
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/admin/users", isAdmin, async (req, res, next) => {
    try {
      const users2 = await storage.getAllUsers();
      const usersWithoutPasswords = users2.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(usersWithoutPasswords);
    } catch (error) {
      next(error);
    }
  });
  app2.delete("/api/admin/users/:id", isAdmin, async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "ID de usuario inv\xE1lido" });
      }
      const userToDelete = await storage.getUser(userId);
      if (userToDelete?.username === "jplhc") {
        return res.status(400).json({ error: "No se puede eliminar el usuario administrador" });
      }
      await storage.deleteUser(userId);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });
}

// server/routes.ts
import OpenAI from "openai";
import nodemailer from "nodemailer";
import express2 from "express";
async function registerRoutes(app2) {
  setupAuth(app2);
  const router = express2.Router();
  router.post("/api/contact", async (req, res) => {
    const { name, email, message, to } = req.body;
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Nuevo mensaje de contacto de ${name} <${email}>`,
        text: `Nombre: ${name}
Email: ${email}

Mensaje:
${message}`
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
  app2.use(router);
  app2.get("/api/check-secret", (req, res) => {
    const { key } = req.query;
    if (!key || typeof key !== "string") {
      return res.status(400).json({ error: "Se requiere un nombre de clave" });
    }
    const secretValue = process.env[key];
    res.json({ available: !!secretValue });
  });
  app2.post("/api/ai/financial-advice", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Se requiere un mensaje" });
      }
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({
          error: "Servicio de IA no disponible",
          response: "Lo siento, el servicio de IA no est\xE1 disponible en este momento. Por favor, intente m\xE1s tarde."
        });
      }
      const responses = [
        "Basado en mi an\xE1lisis, te recomendar\xEDa diversificar tu portafolio para minimizar el riesgo. Considera una mezcla de acciones, bonos y activos alternativos.",
        "Para maximizar tus retornos a largo plazo, es importante mantener disciplina y no reaccionar emocionalmente a las fluctuaciones del mercado.",
        "Antes de invertir en criptomonedas, es crucial entender los riesgos asociados. No inviertas m\xE1s de lo que est\xE1s dispuesto a perder.",
        "El inter\xE9s compuesto es una poderosa herramienta para construir riqueza a largo plazo. Empezar temprano y ser consistente puede generar resultados significativos.",
        "Para inversores principiantes, los fondos indexados ofrecen una manera efectiva y de bajo costo para obtener exposici\xF3n al mercado.",
        "Recuerda siempre tener un fondo de emergencia antes de comenzar a invertir. Esto te dar\xE1 tranquilidad y evitar\xE1 que tengas que vender inversiones en momentos desfavorables."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
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
        response: "Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, intenta nuevamente m\xE1s tarde."
      });
    }
  });
  app2.post("/api/ai/analyze-portfolio", async (req, res) => {
    try {
      const { assets: assets2 } = req.body;
      if (!assets2 || !Array.isArray(assets2)) {
        return res.status(400).json({ error: "Se requiere un array de activos" });
      }
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({
          error: "Servicio de IA no disponible",
          analysis: "Lo siento, el servicio de an\xE1lisis de portafolio no est\xE1 disponible en este momento. Por favor, intente m\xE1s tarde."
        });
      }
      const analysisResponse = "Tu portafolio muestra una buena diversificaci\xF3n entre acciones y criptomonedas. Sin embargo, podr\xEDas considerar aumentar tu exposici\xF3n a bonos para reducir la volatilidad general. Actualmente, tienes un perfil de riesgo moderado-alto, con aproximadamente un 70% en acciones de alta capitalizaci\xF3n, 20% en criptomonedas y 10% en efectivo. Para mejorar tu balance, considera una asignaci\xF3n de 60% en acciones, 15% en bonos, 15% en criptomonedas y 10% en efectivo o equivalentes.";
      res.json({ analysis: analysisResponse });
    } catch (error) {
      console.error("Error al analizar el portafolio:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        analysis: "Lo siento, ha ocurrido un error al analizar tu portafolio. Por favor, intenta nuevamente m\xE1s tarde."
      });
    }
  });
  setupAuth(app2);
  app2.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      const usersWithoutPasswords = users2.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).json({ message: "Error retrieving users" });
    }
  });
  const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
  app2.get("/api/portfolios", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const portfolios2 = await storage.getPortfolios(req.user.id);
      res.json(portfolios2);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving portfolios" });
    }
  });
  app2.post("/api/portfolios", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const portfolio = await storage.createPortfolio({
        ...req.body,
        userId: req.user.id
      });
      res.status(201).json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Error creating portfolio" });
    }
  });
  app2.get("/api/portfolios/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const portfolioId = parseInt(req.params.id);
      const portfolio = await storage.getPortfolio(portfolioId);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      if (portfolio.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized access to portfolio" });
      }
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving portfolio" });
    }
  });
  app2.get("/api/portfolios/:id/assets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const portfolioId = parseInt(req.params.id);
      const portfolio = await storage.getPortfolio(portfolioId);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      if (portfolio.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized access to portfolio" });
      }
      const assets2 = await storage.getAssets(portfolioId);
      res.json(assets2);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving assets" });
    }
  });
  app2.post("/api/portfolios/:id/assets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const portfolioId = parseInt(req.params.id);
      const portfolio = await storage.getPortfolio(portfolioId);
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      if (portfolio.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized access to portfolio" });
      }
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
  app2.get("/api/strategies", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const strategies2 = await storage.getStrategies(req.user.id);
      res.json(strategies2);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving strategies" });
    }
  });
  app2.post("/api/strategies", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const strategy = await storage.createStrategy({
        ...req.body,
        userId: req.user.id
      });
      res.status(201).json(strategy);
    } catch (error) {
      res.status(500).json({ message: "Error creating strategy" });
    }
  });
  app2.post("/api/auth/wallet-login", async (req, res) => {
    try {
      const { address, type } = req.body;
      if (!address || !type) {
        return res.status(400).json({ error: "Se requiere direcci\xF3n y tipo de wallet" });
      }
      const wallets2 = await storage.getAllWallets();
      const existingWallet = wallets2.find((w) => w.address.toLowerCase() === address.toLowerCase());
      if (!existingWallet) {
        const username = `${type.substring(0, 3)}_${address.substring(0, 6)}`;
        const randomPassword = Math.random().toString(36).slice(-10);
        const newUser = await storage.createUser({
          username,
          email: `${username}@placeholder.com`,
          password: randomPassword,
          // En un caso real, usaríamos un método más seguro
          name: `Wallet User ${address.substring(0, 6)}`
        });
        await storage.createWallet({
          userId: newUser.id,
          type,
          address,
          isDefault: true
        });
        req.login(newUser, (err) => {
          if (err) {
            return res.status(500).json({ error: "Error al iniciar sesi\xF3n" });
          }
          return res.status(201).json(newUser);
        });
      } else {
        const user = await storage.getUser(existingWallet.userId);
        if (!user) {
          return res.status(404).json({ error: "Usuario no encontrado" });
        }
        req.login(user, (err) => {
          if (err) {
            return res.status(500).json({ error: "Error al iniciar sesi\xF3n" });
          }
          return res.json(user);
        });
      }
    } catch (error) {
      console.error("Error al autenticar con wallet:", error);
      res.status(500).json({ error: "Error al procesar la autenticaci\xF3n con wallet" });
    }
  });
  app2.get("/api/wallets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const wallets2 = await storage.getWallets(req.user.id);
      res.json(wallets2);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving wallets" });
    }
  });
  app2.post("/api/wallets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const wallet = await storage.createWallet({
        ...req.body,
        userId: req.user.id
      });
      res.status(201).json(wallet);
    } catch (error) {
      res.status(500).json({ message: "Error creating wallet" });
    }
  });
  app2.get("/api/decentralized-messages", async (req, res) => {
    try {
      const { topic } = req.query;
      if (!topic || typeof topic !== "string") {
        return res.status(400).json({ error: "Se requiere un tema" });
      }
      const messages = await storage.getDecentralizedMessages(topic);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving decentralized messages" });
    }
  });
  app2.post("/api/decentralized-messages", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const { senderAddress, content, topic, chainId, isEncrypted } = req.body;
      if (!senderAddress || !content || !chainId) {
        return res.status(400).json({ error: "Faltan campos requeridos" });
      }
      const wallets2 = await storage.getWallets(req.user.id);
      let walletId = null;
      if (wallets2.length > 0) {
        const matchingWallet = wallets2.find(
          (w) => w.address.toLowerCase() === senderAddress.toLowerCase()
        );
        if (matchingWallet) {
          walletId = matchingWallet.id;
        }
      }
      const message = await storage.saveDecentralizedMessage({
        walletId,
        senderAddress,
        content,
        topic: topic || "general",
        chainId,
        isEncrypted: isEncrypted || false
      });
      res.status(201).json(message);
    } catch (error) {
      console.error("Error al guardar mensaje descentralizado:", error);
      res.status(500).json({ error: "Error al guardar el mensaje" });
    }
  });
  app2.get("/api/chat/history", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const chatHistory2 = await storage.getChatHistory(req.user.id);
      res.json(chatHistory2);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving chat history" });
    }
  });
  app2.post("/api/chat/message", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const message = req.body.message;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      if (!openai) {
        const chatEntry2 = await storage.saveChatMessage({
          userId: req.user.id,
          message,
          response: "Lo siento, el servicio de chat IA no est\xE1 disponible en este momento. Por favor, contacta al administrador."
        });
        return res.json(chatEntry2);
      }
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "Eres un asesor financiero experto especializado en inversiones, mercados financieros, criptomonedas, acciones y estrategias de trading. Proporciona respuestas precisas, informativas y \xFAtiles a consultas sobre estos temas. Evita dar consejos que puedan interpretarse como recomendaciones de inversi\xF3n espec\xEDficas. Tu objetivo es educar y proporcionar informaci\xF3n objetiva."
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
      const chatEntry = await storage.saveChatMessage({
        userId: req.user.id,
        message,
        response
      });
      res.json(chatEntry);
    } catch (error) {
      console.error("Chat API error:", error);
      const chatEntry = await storage.saveChatMessage({
        userId: req.user.id,
        message: req.body.message,
        response: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo m\xE1s tarde."
      });
      res.status(500).json(chatEntry);
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/index.ts
import "dotenv/config";
import session4 from "express-session";
import "dotenv/config";
import passport2 from "passport";
import { randomBytes as randomBytes2 } from "crypto";
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
var SESSION_SECRET2 = process.env.SESSION_SECRET || randomBytes2(32).toString("hex");
app.set("trust proxy", 1);
app.use(session4({
  secret: SESSION_SECRET2,
  resave: false,
  saveUninitialized: false,
  store: storage.sessionStore,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1e3
    // 1 día
  }
}));
app.use(passport2.initialize());
app.use(passport2.session());
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
