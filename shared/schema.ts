import { pgTable, text, serial, integer, boolean, timestamp, real, json, pgEnum, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enum para identificar el proveedor de autenticación
export const authProviderEnum = pgEnum('auth_provider', ['local', 'google', 'apple', 'phantom', 'metamask', 'walletconnect']);

// Enum para el tipo de usuario
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

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
export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  totalValue: real("total_value").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  initial_value: real("initial_value").default(0),
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Tabla para el historial de valores del portafolio
export const portfolio_history = pgTable("portfolio_history", {
  id: serial("id").primaryKey(),
  portfolio_id: integer("portfolio_id").notNull().references(() => portfolios.id),
  value: real("value").notNull(),
  date: timestamp("date").notNull()
});

// Asset schema
export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id").notNull().references(() => portfolios.id),
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

// Type exports
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
