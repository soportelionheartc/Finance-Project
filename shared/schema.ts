import { pgTable, text, serial, integer, boolean, timestamp, real, json, pgEnum, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enum para identificar el proveedor de autenticación
export const authProviderEnum = pgEnum('auth_provider', ['local', 'google', 'apple', 'phantom', 'metamask', 'walletconnect']);

// Enum para el tipo de usuario
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

// Enum para perfil de riesgo del inversor
export const riskProfileEnum = pgEnum('risk_profile', ['conservative', 'moderate', 'aggressive']);

// User schema
export const users = pgTable("users", {
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
  preferredLanguage: text("preferred_language").default("es"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
  role: true,
  isEmailVerified: true,
  profilePicture: true,
});

// Tabla de sesiones para Passport.js o express-session
export const session = pgTable("session", {
  sid: varchar("sid").primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Tabla para autenticación mediante proveedores externos
export const authProviders = pgTable("auth_providers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  provider: authProviderEnum("provider").notNull(),
  providerId: text("provider_id").notNull(), // ID único del proveedor (Google ID, Apple ID, etc.)
  providerData: json("provider_data"), // Datos adicionales del proveedor
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAuthProviderSchema = createInsertSchema(authProviders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Enum para los tipos de blockchain
export const blockchainTypeEnum = pgEnum('blockchain_type', ['ethereum', 'solana', 'bitcoin', 'polygon', 'binance']);

// Tabla para wallets de criptomonedas
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: blockchainTypeEnum("type").notNull(), // ethereum, solana, bitcoin, etc.
  address: text("address").notNull(),
  label: text("label"),
  publicKey: text("public_key"),
  balance: real("balance").default(0),
  network: text("network"), // mainnet, testnet, devnet, etc.
  isConnected: boolean("is_connected").default(false),
  isDefault: boolean("is_default").default(false),
  lastSynced: timestamp("last_synced"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Portfolio schema
export const portfolios = pgTable('portfolios', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, {onDelete: 'cascade'}),
  name: text('name').notNull(),
  totalValue: real('total_value').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  initial_value: real('initial_value').default(0),
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Tabla para el historial de valores del portafolio
export const portfolio_history = pgTable('portfolio_history', {
  id: serial('id').primaryKey(),
  portfolio_id: integer('portfolio_id')
    .notNull()
    .references(() => portfolios.id, {onDelete: 'cascade'}),
  value: real('value').notNull(),
  date: timestamp('date').notNull(),
});

// Asset schema
export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id").notNull().references(() => portfolios.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  type: text("type").notNull(), // stock, crypto, etf, etc
  quantity: real("quantity").notNull(),
  price: real("price").notNull(),
  value: real("value").notNull(),
  change24h: real("change24h"),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Trading strategies schema
export const strategies = pgTable("strategies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  parameters: json("parameters"),
  active: boolean("active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertStrategySchema = createInsertSchema(strategies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Chat history schema para chat IA
export const chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  response: text("response").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertChatHistorySchema = createInsertSchema(chatHistory).omit({
  id: true,
  timestamp: true,
});

// Tabla para mensajes descentralizados
export const decentralizedMessages = pgTable("decentralized_messages", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").references(() => wallets.id),
  senderAddress: text("sender_address").notNull(),
  content: text("content").notNull(),
  topic: text("topic"), // Tema del mensaje (finanzas, inversiones, etc.)
  timestamp: timestamp("timestamp").defaultNow(),
  transactionHash: text("transaction_hash"), // Hash de la transacción en blockchain
  chainId: text("chain_id").notNull(), // ID de la cadena (Ethereum, Solana, etc.)
  isEncrypted: boolean("is_encrypted").default(false),
});

export const insertDecentralizedMessageSchema = createInsertSchema(decentralizedMessages).omit({
  id: true,
  timestamp: true,
});

// Transactions schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),

  portfolioId: integer("portfolio_id")
    .notNull()
    .references(() => portfolios.id),

  assetName: text("asset_name").notNull(),

  symbol: text("symbol").notNull(),

  type: text("type").notNull(),  // compra / venta

  quantity: real("quantity").notNull(),

  price: real("price").notNull(),

  fee: real("fee"),

  date: timestamp("date", { mode: "string" }).notNull(),

  notes: text("notes"),
});


export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
});

// Email verification codes schema
export const emailVerificationCodes = pgTable("email_verification_codes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  code: text("code").notNull(), // stores hashed 6-digit code
  verificationToken: text("verification_token").unique(), // unique token for one-click verification (nullable for backwards compatibility)
  expiresAt: timestamp("expires_at").notNull(),
  attempts: integer("attempts").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  isUsed: boolean("is_used").default(false),
});

export const insertEmailVerificationCodeSchema = createInsertSchema(emailVerificationCodes).omit({
  id: true,
  createdAt: true,
});

// Investor profiles schema
export const investorProfiles = pgTable("investor_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  riskProfile: riskProfileEnum("risk_profile").notNull(),
  totalScore: integer("total_score").notNull(),
  answers: json("answers").notNull(), // JSONB storage for detailed question responses
  completedAt: timestamp("completed_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInvestorProfileSchema = createInsertSchema(investorProfiles)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    totalScore: z.number().int().min(0).max(21),
  });

// Files schema for uploaded documents
export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  portfolioId: integer("portfolio_id").references(() => portfolios.id, { onDelete: 'cascade' }),
  assetId: integer("asset_id").references(() => assets.id, { onDelete: 'cascade' }),
  filename: text("filename").notNull(), // stored filename (unique)
  originalName: text("original_name").notNull(), // original filename
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(), // bytes
  url: text("url").notNull(), // public URL path
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  createdAt: true,
});

// Type exports

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type AuthProvider = typeof authProviders.$inferSelect;
export type InsertAuthProvider = z.infer<typeof insertAuthProviderSchema>;

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;

export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;

export type Strategy = typeof strategies.$inferSelect;
export type InsertStrategy = z.infer<typeof insertStrategySchema>;

export type ChatEntry = typeof chatHistory.$inferSelect;
export type InsertChatEntry = z.infer<typeof insertChatHistorySchema>;

export type DecentralizedMessage = typeof decentralizedMessages.$inferSelect;
export type InsertDecentralizedMessage = z.infer<typeof insertDecentralizedMessageSchema>;

export type VerificationCode = typeof emailVerificationCodes.$inferSelect;
export type InsertVerificationCode = z.infer<typeof insertEmailVerificationCodeSchema>;

export type InvestorProfile = typeof investorProfiles.$inferSelect;
export type InsertInvestorProfile = z.infer<typeof insertInvestorProfileSchema>;

export type PortfolioFile = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
