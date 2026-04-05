// Importacion para obetener la informacion del .env para realizar la conexcion a la base de datos despues.
import "dotenv/config";
import {
  users,
  portfolios,
  assets,
  strategies,
  chatHistory,
  wallets,
  decentralizedMessages,
  emailVerificationCodes,
  investorProfiles,
  files,
  financiaplayProgress,
  financiaplayPlacement,
  financiaplayBadges,
  financiaplayXp,
} from "@shared/schema";
import type {
  User,
  InsertUser,
  Portfolio,
  InsertPortfolio,
  Asset,
  InsertAsset,
  Strategy,
  InsertStrategy,
  ChatEntry,
  InsertChatEntry,
  Wallet,
  InsertWallet,
  DecentralizedMessage,
  InsertDecentralizedMessage,
  VerificationCode,
  InsertVerificationCode,
  InvestorProfile,
  InsertInvestorProfile,
  PortfolioFile,
  InsertFile,
  FinanciaplayProgress,
  InsertFinanciaplayProgress,
  FinanciaplayPlacement,
  InsertFinanciaplayPlacement,
  FinanciaplayBadge,
  InsertFinanciaplayBadge,
  FinanciaplayXp,
  InsertFinanciaplayXp,
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, and, sql, lt, or, desc, gte, count } from "drizzle-orm";
import { pool } from "./db";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: number): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<boolean>;

  // Portfolio operations
  getPortfolios(userId: number): Promise<Portfolio[]>;
  getPortfolio(id: number): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(
    id: number,
    portfolio: Partial<InsertPortfolio>,
  ): Promise<Portfolio | undefined>;
  deletePortfolio(id: number): Promise<boolean>;

  // Asset operations
  getAssets(portfolioId: number): Promise<Asset[]>;
  getAsset(id: number): Promise<Asset | undefined>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAsset(
    id: number,
    asset: Partial<InsertAsset>,
  ): Promise<Asset | undefined>;
  deleteAsset(id: number): Promise<boolean>;

  // Strategy operations
  getStrategies(userId: number): Promise<Strategy[]>;
  getStrategy(id: number): Promise<Strategy | undefined>;
  createStrategy(strategy: InsertStrategy): Promise<Strategy>;
  updateStrategy(
    id: number,
    strategy: Partial<InsertStrategy>,
  ): Promise<Strategy | undefined>;
  deleteStrategy(id: number): Promise<boolean>;

  // Chat operations
  getChatHistory(userId: number): Promise<ChatEntry[]>;
  saveChatMessage(chatEntry: InsertChatEntry): Promise<ChatEntry>;

  // Wallet operations
  getWallets(userId: number): Promise<Wallet[]>;
  getWallet(id: number): Promise<Wallet | undefined>;
  getAllWallets(): Promise<Wallet[]>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWallet(
    id: number,
    wallet: Partial<InsertWallet>,
  ): Promise<Wallet | undefined>;
  deleteWallet(id: number): Promise<boolean>;

  // Decentralized messages operations
  getDecentralizedMessages(topic: string): Promise<DecentralizedMessage[]>;
  getDecentralizedMessage(
    id: number,
  ): Promise<DecentralizedMessage | undefined>;
  saveDecentralizedMessage(
    message: InsertDecentralizedMessage,
  ): Promise<DecentralizedMessage>;

  // Transaction operations
  getTransactions(portfolioId: number): Promise<any[]>;
  createTransaction(transaction: {
    portfolioId: number;
    type: string;
    asset: string;
    amount: number;
    price: number;
    date: Date;
  }): Promise<any>;

  // Verification code operations
  createVerificationCode(
    userId: number,
    hashedCode: string,
    verificationToken: string,
    expiresAt: Date,
  ): Promise<VerificationCode>;
  getLatestVerificationCode(
    userId: number,
  ): Promise<VerificationCode | undefined>;
  getVerificationCodeByToken(
    token: string,
  ): Promise<VerificationCode | undefined>;
  markCodeAsUsed(codeId: number): Promise<void>;
  incrementCodeAttempts(codeId: number): Promise<void>;
  updateUserEmailVerification(
    userId: number,
    verified: boolean,
  ): Promise<User | undefined>;
  deleteExpiredVerificationCodes(): Promise<void>;
  countRecentVerificationCodes(userId: number, since: Date): Promise<number>;

  // Investor profile operations
  createInvestorProfile(data: InsertInvestorProfile): Promise<InvestorProfile>;
  getInvestorProfileByUserId(
    userId: number,
  ): Promise<InvestorProfile | undefined>;
  updateInvestorProfile(
    userId: number,
    data: Partial<InsertInvestorProfile>,
  ): Promise<InvestorProfile | undefined>;

  // File operations
  createFile(data: InsertFile): Promise<PortfolioFile>;
  getFileById(id: number): Promise<PortfolioFile | undefined>;
  getFilesByUserId(userId: number): Promise<PortfolioFile[]>;
  getFilesByPortfolioId(portfolioId: number): Promise<PortfolioFile[]>;
  getFilesByAssetId(assetId: number): Promise<PortfolioFile[]>;
  updateFilePortfolioId(
    id: number,
    portfolioId: number,
  ): Promise<PortfolioFile | undefined>;
  updateFileAssetId(
    id: number,
    assetId: number,
    portfolioId: number,
  ): Promise<PortfolioFile | undefined>;
  deleteFile(id: number): Promise<boolean>;

  // FinanciaPlay operations
  createFinanciaplayProgress(
    data: InsertFinanciaplayProgress,
  ): Promise<FinanciaplayProgress>;
  getFinanciaplayProgress(userId: number): Promise<FinanciaplayProgress[]>;
  getFinanciaplayProgressByGame(
    userId: number,
    gameId: string,
  ): Promise<FinanciaplayProgress | undefined>;

  createFinanciaplayPlacement(
    data: InsertFinanciaplayPlacement,
  ): Promise<FinanciaplayPlacement>;
  getFinanciaplayPlacement(
    userId: number,
  ): Promise<FinanciaplayPlacement | undefined>;
  updateFinanciaplayPlacement(
    userId: number,
    data: Partial<InsertFinanciaplayPlacement>,
  ): Promise<FinanciaplayPlacement | undefined>;

  createFinanciaplayBadge(
    data: InsertFinanciaplayBadge,
  ): Promise<FinanciaplayBadge>;
  getFinanciaplayBadges(userId: number): Promise<FinanciaplayBadge[]>;
  hasFinanciaplayBadge(userId: number, badgeId: string): Promise<boolean>;

  getFinanciaplayXp(userId: number): Promise<FinanciaplayXp | undefined>;
  upsertFinanciaplayXp(
    userId: number,
    xpToAdd: number,
  ): Promise<FinanciaplayXp>;
  getFinanciaplayLeaderboard(
    limit: number,
  ): Promise<{ userId: number; totalXp: number; username: string | null }[]>;

  // Session store
  sessionStore: any; // Using 'any' for SessionStore to avoid type errors
}

// Memory Storage implementation
export class MemStorage implements IStorage {
  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }
  private users: Map<number, User>;
  private portfolios: Map<number, Portfolio>;
  private assets: Map<number, Asset>;
  private strategies: Map<number, Strategy>;
  private chats: Map<number, ChatEntry>;
  private wallets: Map<number, Wallet>;
  private decentralizedMsgs: Map<number, DecentralizedMessage>;
  sessionStore: any; // Using any to avoid SessionStore type errors

  private userIdCounter: number;
  private portfolioIdCounter: number;
  private assetIdCounter: number;
  private strategyIdCounter: number;
  private chatIdCounter: number;
  private walletIdCounter: number;
  private decentralizedMsgIdCounter: number;

  constructor() {
    this.users = new Map();
    this.portfolios = new Map();
    this.assets = new Map();
    this.strategies = new Map();
    this.chats = new Map();
    this.wallets = new Map();
    this.decentralizedMsgs = new Map();

    this.userIdCounter = 1;
    this.portfolioIdCounter = 1;
    this.assetIdCounter = 1;
    this.strategyIdCounter = 1;
    this.chatIdCounter = 1;
    this.walletIdCounter = 1;
    this.decentralizedMsgIdCounter = 1;

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = {
      ...insertUser,
      id,
      createdAt: now,
      lastLogin: null,
      role: "user", // Establecer rol predeterminado
      isEmailVerified: false, // Establecer estado de verificación predeterminado
      profilePicture: null, // <-- Agrega esto
      username: insertUser.username ?? null,
      password: insertUser.password ?? null,
      name: insertUser.name ?? null,
      preferredLanguage: insertUser.preferredLanguage ?? null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserLastLogin(id: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (user) {
      const updatedUser = { ...user, lastLogin: new Date() };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Portfolio operations
  async getPortfolios(userId: number): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values()).filter(
      (portfolio) => portfolio.userId === userId,
    );
  }

  async getPortfolio(id: number): Promise<Portfolio | undefined> {
    return this.portfolios.get(id);
  }

  async createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio> {
    const id = this.portfolioIdCounter++;
    const now = new Date();
    const newPortfolio: Portfolio = {
      ...portfolio,
      id,
      name: portfolio.name,
      userId: portfolio.userId,
      totalValue: portfolio.totalValue ?? 0,
      createdAt: now,
      updatedAt: now,
      initial_value: portfolio.initial_value ?? null,
    };
    this.portfolios.set(id, newPortfolio);
    return newPortfolio;
  }

  async updatePortfolio(
    id: number,
    portfolioUpdate: Partial<InsertPortfolio>,
  ): Promise<Portfolio | undefined> {
    const portfolio = await this.getPortfolio(id);
    if (portfolio) {
      const updatedPortfolio = {
        ...portfolio,
        ...portfolioUpdate,
        updatedAt: new Date(),
      };
      this.portfolios.set(id, updatedPortfolio);
      return updatedPortfolio;
    }
    return undefined;
  }

  async deletePortfolio(id: number): Promise<boolean> {
    return this.portfolios.delete(id);
  }

  // Asset operations
  async getAssets(portfolioId: number): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter(
      (asset) => asset.portfolioId === portfolioId,
    );
  }

  async getAsset(id: number): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const id = this.assetIdCounter++;
    const now = new Date();
    const newAsset: Asset = {
      ...asset,
      id,
      name: asset.name,
      symbol: asset.symbol,
      type: asset.type,
      quantity: asset.quantity,
      price: asset.price,
      value: asset.value,
      change24h: asset.change24h ?? null,
      icon: asset.icon ?? null,
      portfolioId: asset.portfolioId,
      createdAt: now,
      updatedAt: now,
    };
    this.assets.set(id, newAsset);

    // Update portfolio total value
    const portfolio = await this.getPortfolio(asset.portfolioId);
    if (portfolio) {
      const updatedValue = portfolio.totalValue + asset.value;
      await this.updatePortfolio(portfolio.id, { totalValue: updatedValue });
    }

    return newAsset;
  }

  async updateAsset(
    id: number,
    assetUpdate: Partial<InsertAsset>,
  ): Promise<Asset | undefined> {
    const asset = await this.getAsset(id);
    if (asset) {
      // Calculate value difference for portfolio update
      const oldValue = asset.value;
      const newValue =
        assetUpdate.value !== undefined
          ? assetUpdate.value
          : assetUpdate.price !== undefined &&
              assetUpdate.quantity !== undefined
            ? assetUpdate.price * assetUpdate.quantity
            : assetUpdate.price !== undefined
              ? assetUpdate.price * asset.quantity
              : assetUpdate.quantity !== undefined
                ? asset.price * assetUpdate.quantity
                : asset.value;

      const updatedAsset = {
        ...asset,
        ...assetUpdate,
        value: newValue,
        updatedAt: new Date(),
      };
      this.assets.set(id, updatedAsset);

      // Update portfolio total value
      if (oldValue !== newValue) {
        const portfolio = await this.getPortfolio(asset.portfolioId);
        if (portfolio) {
          const valueDifference = newValue - oldValue;
          const updatedValue = portfolio.totalValue + valueDifference;
          await this.updatePortfolio(portfolio.id, {
            totalValue: updatedValue,
          });
        }
      }

      return updatedAsset;
    }
    return undefined;
  }

  async deleteAsset(id: number): Promise<boolean> {
    const asset = await this.getAsset(id);
    if (asset) {
      // Update portfolio total value
      const portfolio = await this.getPortfolio(asset.portfolioId);
      if (portfolio) {
        const updatedValue = portfolio.totalValue - asset.value;
        await this.updatePortfolio(portfolio.id, { totalValue: updatedValue });
      }

      return this.assets.delete(id);
    }
    return false;
  }

  // Strategy operations
  async getStrategies(userId: number): Promise<Strategy[]> {
    return Array.from(this.strategies.values()).filter(
      (strategy) => strategy.userId === userId,
    );
  }

  async getStrategy(id: number): Promise<Strategy | undefined> {
    return this.strategies.get(id);
  }

  async createStrategy(strategy: InsertStrategy): Promise<Strategy> {
    const id = this.strategyIdCounter++;
    const now = new Date();
    const newStrategy: Strategy = {
      ...strategy,
      id,
      name: strategy.name,
      userId: strategy.userId,
      description: strategy.description ?? null,
      parameters: strategy.parameters ?? {},
      active: strategy.active ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.strategies.set(id, newStrategy);
    return newStrategy;
  }

  async updateStrategy(
    id: number,
    strategyUpdate: Partial<InsertStrategy>,
  ): Promise<Strategy | undefined> {
    const strategy = await this.getStrategy(id);
    if (strategy) {
      const updatedStrategy = {
        ...strategy,
        ...strategyUpdate,
        updatedAt: new Date(),
      };
      this.strategies.set(id, updatedStrategy);
      return updatedStrategy;
    }
    return undefined;
  }

  async deleteStrategy(id: number): Promise<boolean> {
    return this.strategies.delete(id);
  }

  // Chat operations
  async getChatHistory(userId: number): Promise<ChatEntry[]> {
    return Array.from(this.chats.values())
      .filter((chat) => chat.userId === userId)
      .sort((a, b) => {
        if (!a.timestamp && !b.timestamp) return 0;
        if (!a.timestamp) return 1;
        if (!b.timestamp) return -1;
        return a.timestamp.getTime() - b.timestamp.getTime();
      });
  }

  async saveChatMessage(chatEntry: InsertChatEntry): Promise<ChatEntry> {
    const id = this.chatIdCounter++;
    const now = new Date();
    const newChat: ChatEntry = { ...chatEntry, id, timestamp: now };
    this.chats.set(id, newChat);
    return newChat;
  }

  // Wallet operations
  async getWallets(userId: number): Promise<Wallet[]> {
    return Array.from(this.wallets.values()).filter(
      (wallet) => wallet.userId === userId,
    );
  }

  async getWallet(id: number): Promise<Wallet | undefined> {
    return this.wallets.get(id);
  }

  async getAllWallets(): Promise<Wallet[]> {
    return Array.from(this.wallets.values());
  }

  async createWallet(wallet: InsertWallet): Promise<Wallet> {
    const id = this.walletIdCounter++;
    const now = new Date();
    const newWallet: Wallet = {
      ...wallet,
      id,
      userId: wallet.userId,
      type: wallet.type,
      address: wallet.address,
      label: wallet.label ?? null,
      publicKey: wallet.publicKey ?? null,
      balance: wallet.balance ?? 0,
      network: wallet.network ?? null,
      isConnected: wallet.isConnected ?? false,
      isDefault: wallet.isDefault ?? false,
      lastSynced: wallet.lastSynced ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.wallets.set(id, newWallet);
    return newWallet;
  }

  async updateWallet(
    id: number,
    walletUpdate: Partial<InsertWallet>,
  ): Promise<Wallet | undefined> {
    const wallet = await this.getWallet(id);
    if (wallet) {
      const updatedWallet = {
        ...wallet,
        ...walletUpdate,
        updatedAt: new Date(),
      };
      this.wallets.set(id, updatedWallet);
      return updatedWallet;
    }
    return undefined;
  }

  async deleteWallet(id: number): Promise<boolean> {
    return this.wallets.delete(id);
  }

  // Decentralized messages operations
  async getDecentralizedMessages(
    topic: string,
  ): Promise<DecentralizedMessage[]> {
    return Array.from(this.decentralizedMsgs.values())
      .filter((msg) => msg.topic === topic)
      .sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        return a.timestamp.getTime() - b.timestamp.getTime();
      });
  }

  //transacciones
  async getTransactions(portfolioId: number): Promise<any[]> {
    return [];
  }

  async createTransaction(transaction: {
    portfolioId: number;
    type: string;
    asset: string;
    amount: number;
    price: number;
    date: Date;
  }): Promise<any> {
    return { id: Date.now(), ...transaction };
  }
  async getDecentralizedMessage(
    id: number,
  ): Promise<DecentralizedMessage | undefined> {
    return this.decentralizedMsgs.get(id);
  }

  async saveDecentralizedMessage(
    message: InsertDecentralizedMessage,
  ): Promise<DecentralizedMessage> {
    const id = this.decentralizedMsgIdCounter++;
    const now = new Date();
    const newMessage: DecentralizedMessage = {
      ...message,
      id,
      walletId: message.walletId ?? null,
      senderAddress: message.senderAddress,
      content: message.content,
      topic: message.topic ?? null,
      timestamp: now,
      transactionHash: message.transactionHash ?? null,
      chainId: message.chainId,
      isEncrypted: message.isEncrypted ?? null,
    };
    this.decentralizedMsgs.set(id, newMessage);
    return newMessage;
  }

  // Verification code operations (stubs for MemStorage)
  async createVerificationCode(
    _userId: number,
    _hashedCode: string,
    _verificationToken: string,
    _expiresAt: Date,
  ): Promise<VerificationCode> {
    throw new Error("Not implemented in MemStorage");
  }

  async getLatestVerificationCode(
    _userId: number,
  ): Promise<VerificationCode | undefined> {
    throw new Error("Not implemented in MemStorage");
  }

  async getVerificationCodeByToken(
    _token: string,
  ): Promise<VerificationCode | undefined> {
    throw new Error("Not implemented in MemStorage");
  }

  async markCodeAsUsed(_codeId: number): Promise<void> {
    throw new Error("Not implemented in MemStorage");
  }

  async incrementCodeAttempts(_codeId: number): Promise<void> {
    throw new Error("Not implemented in MemStorage");
  }

  async updateUserEmailVerification(
    _userId: number,
    _verified: boolean,
  ): Promise<User | undefined> {
    throw new Error("Not implemented in MemStorage");
  }

  async deleteExpiredVerificationCodes(): Promise<void> {
    throw new Error("Not implemented in MemStorage");
  }

  async countRecentVerificationCodes(
    _userId: number,
    _since: Date,
  ): Promise<number> {
    throw new Error("Not implemented in MemStorage");
  }

  // Investor profile operations (stubs for MemStorage)
  async createInvestorProfile(
    _data: InsertInvestorProfile,
  ): Promise<InvestorProfile> {
    throw new Error("Not implemented in MemStorage");
  }

  async getInvestorProfileByUserId(
    _userId: number,
  ): Promise<InvestorProfile | undefined> {
    throw new Error("Not implemented in MemStorage");
  }

  async updateInvestorProfile(
    _userId: number,
    _data: Partial<InsertInvestorProfile>,
  ): Promise<InvestorProfile | undefined> {
    throw new Error("Not implemented in MemStorage");
  }

  // File operations (stubs for MemStorage)
  async createFile(_data: InsertFile): Promise<PortfolioFile> {
    throw new Error("Not implemented in MemStorage");
  }

  async getFileById(_id: number): Promise<PortfolioFile | undefined> {
    throw new Error("Not implemented in MemStorage");
  }

  async getFilesByUserId(_userId: number): Promise<PortfolioFile[]> {
    throw new Error("Not implemented in MemStorage");
  }

  async getFilesByPortfolioId(_portfolioId: number): Promise<PortfolioFile[]> {
    throw new Error("Not implemented in MemStorage");
  }

  async getFilesByAssetId(_assetId: number): Promise<PortfolioFile[]> {
    throw new Error("Not implemented in MemStorage");
  }

  async updateFilePortfolioId(
    _id: number,
    _portfolioId: number,
  ): Promise<PortfolioFile | undefined> {
    throw new Error("Not implemented in MemStorage");
  }

  async updateFileAssetId(
    _id: number,
    _assetId: number,
    _portfolioId: number,
  ): Promise<PortfolioFile | undefined> {
    throw new Error("Not implemented in MemStorage");
  }

  async deleteFile(_id: number): Promise<boolean> {
    throw new Error("Not implemented in MemStorage");
  }

  // FinanciaPlay stubs
  async createFinanciaplayProgress(
    _data: InsertFinanciaplayProgress,
  ): Promise<FinanciaplayProgress> {
    throw new Error("Not implemented in MemStorage");
  }
  async getFinanciaplayProgress(
    _userId: number,
  ): Promise<FinanciaplayProgress[]> {
    throw new Error("Not implemented in MemStorage");
  }
  async getFinanciaplayProgressByGame(
    _userId: number,
    _gameId: string,
  ): Promise<FinanciaplayProgress | undefined> {
    throw new Error("Not implemented in MemStorage");
  }
  async createFinanciaplayPlacement(
    _data: InsertFinanciaplayPlacement,
  ): Promise<FinanciaplayPlacement> {
    throw new Error("Not implemented in MemStorage");
  }
  async getFinanciaplayPlacement(
    _userId: number,
  ): Promise<FinanciaplayPlacement | undefined> {
    throw new Error("Not implemented in MemStorage");
  }
  async updateFinanciaplayPlacement(
    _userId: number,
    _data: Partial<InsertFinanciaplayPlacement>,
  ): Promise<FinanciaplayPlacement | undefined> {
    throw new Error("Not implemented in MemStorage");
  }
  async createFinanciaplayBadge(
    _data: InsertFinanciaplayBadge,
  ): Promise<FinanciaplayBadge> {
    throw new Error("Not implemented in MemStorage");
  }
  async getFinanciaplayBadges(_userId: number): Promise<FinanciaplayBadge[]> {
    throw new Error("Not implemented in MemStorage");
  }
  async hasFinanciaplayBadge(
    _userId: number,
    _badgeId: string,
  ): Promise<boolean> {
    throw new Error("Not implemented in MemStorage");
  }
  async getFinanciaplayXp(
    _userId: number,
  ): Promise<FinanciaplayXp | undefined> {
    throw new Error("Not implemented in MemStorage");
  }
  async upsertFinanciaplayXp(
    _userId: number,
    _xpToAdd: number,
  ): Promise<FinanciaplayXp> {
    throw new Error("Not implemented in MemStorage");
  }
  async getFinanciaplayLeaderboard(
    _limit: number,
  ): Promise<{ userId: number; totalXp: number; username: string | null }[]> {
    throw new Error("Not implemented in MemStorage");
  }
}

// Database Storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any to avoid SessionStore type errors

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserLastLogin(id: number): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async deleteUser(id: number): Promise<boolean> {
    await db.delete(users).where(eq(users.id, id));
    // Verificar si el usuario fue eliminado
    const user = await this.getUser(id);
    return user === undefined;
  }

  // Portfolio operations
  async getPortfolios(userId: number): Promise<Portfolio[]> {
    return db.select().from(portfolios).where(eq(portfolios.userId, userId));
  }

  async getPortfolio(id: number): Promise<Portfolio | undefined> {
    const [portfolio] = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.id, id));
    return portfolio;
  }

  async createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio> {
    const [newPortfolio] = await db
      .insert(portfolios)
      .values(portfolio)
      .returning();
    return newPortfolio;
  }

  async updatePortfolio(
    id: number,
    portfolioUpdate: Partial<InsertPortfolio>,
  ): Promise<Portfolio | undefined> {
    const [updatedPortfolio] = await db
      .update(portfolios)
      .set({
        ...portfolioUpdate,
        updatedAt: new Date(),
      })
      .where(eq(portfolios.id, id))
      .returning();
    return updatedPortfolio;
  }

  async deletePortfolio(id: number): Promise<boolean> {
    await db.delete(portfolios).where(eq(portfolios.id, id));
    // Since we can't rely on result.count, check if portfolio still exists
    const portfolio = await this.getPortfolio(id);
    return portfolio === undefined;
  }

  // Asset operations
  async getAssets(portfolioId: number): Promise<Asset[]> {
    return db.select().from(assets).where(eq(assets.portfolioId, portfolioId));
  }

  async getAsset(id: number): Promise<Asset | undefined> {
    const [asset] = await db.select().from(assets).where(eq(assets.id, id));
    return asset;
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const [newAsset] = await db.insert(assets).values(asset).returning();

    // Update portfolio total value
    const portfolio = await this.getPortfolio(asset.portfolioId);
    if (portfolio) {
      const updatedValue = portfolio.totalValue + asset.value;
      await this.updatePortfolio(portfolio.id, { totalValue: updatedValue });
    }

    return newAsset;
  }

  async updateAsset(
    id: number,
    assetUpdate: Partial<InsertAsset>,
  ): Promise<Asset | undefined> {
    // Get original asset to calculate value difference
    const originalAsset = await this.getAsset(id);
    if (!originalAsset) return undefined;

    // Calculate new value if price or quantity changed
    let newValue = originalAsset.value;
    if (assetUpdate.value !== undefined) {
      newValue = assetUpdate.value;
    } else if (
      assetUpdate.price !== undefined ||
      assetUpdate.quantity !== undefined
    ) {
      const newPrice =
        assetUpdate.price !== undefined
          ? assetUpdate.price
          : originalAsset.price;
      const newQuantity =
        assetUpdate.quantity !== undefined
          ? assetUpdate.quantity
          : originalAsset.quantity;
      newValue = newPrice * newQuantity;

      // Add value to the update object
      assetUpdate.value = newValue;
    }

    const [updatedAsset] = await db
      .update(assets)
      .set({
        ...assetUpdate,
        updatedAt: new Date(),
      })
      .where(eq(assets.id, id))
      .returning();

    // Update portfolio total value if asset value changed
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

  async deleteAsset(id: number): Promise<boolean> {
    // Get asset to update portfolio total value
    const asset = await this.getAsset(id);
    if (!asset) return false;

    // Update portfolio total value
    const portfolio = await this.getPortfolio(asset.portfolioId);
    if (portfolio) {
      const updatedValue = portfolio.totalValue - asset.value;
      await this.updatePortfolio(portfolio.id, { totalValue: updatedValue });
    }

    // Delete the asset
    await db.delete(assets).where(eq(assets.id, id));
    // Check if asset was deleted
    const deletedAsset = await this.getAsset(id);
    return deletedAsset === undefined;
  }

  // Strategy operations
  async getStrategies(userId: number): Promise<Strategy[]> {
    return db.select().from(strategies).where(eq(strategies.userId, userId));
  }

  async getStrategy(id: number): Promise<Strategy | undefined> {
    const [strategy] = await db
      .select()
      .from(strategies)
      .where(eq(strategies.id, id));
    return strategy;
  }

  async createStrategy(strategy: InsertStrategy): Promise<Strategy> {
    const [newStrategy] = await db
      .insert(strategies)
      .values(strategy)
      .returning();
    return newStrategy;
  }

  async updateStrategy(
    id: number,
    strategyUpdate: Partial<InsertStrategy>,
  ): Promise<Strategy | undefined> {
    const [updatedStrategy] = await db
      .update(strategies)
      .set({
        ...strategyUpdate,
        updatedAt: new Date(),
      })
      .where(eq(strategies.id, id))
      .returning();
    return updatedStrategy;
  }

  async deleteStrategy(id: number): Promise<boolean> {
    await db.delete(strategies).where(eq(strategies.id, id));
    // Check if strategy was deleted
    const deletedStrategy = await this.getStrategy(id);
    return deletedStrategy === undefined;
  }

  // Chat operations
  async getChatHistory(userId: number): Promise<ChatEntry[]> {
    return db
      .select()
      .from(chatHistory)
      .where(eq(chatHistory.userId, userId))
      .orderBy(chatHistory.timestamp);
  }

  async saveChatMessage(chatEntry: InsertChatEntry): Promise<ChatEntry> {
    const [newChat] = await db
      .insert(chatHistory)
      .values(chatEntry)
      .returning();
    return newChat;
  }

  // Wallet operations
  async getWallets(userId: number): Promise<Wallet[]> {
    return db.select().from(wallets).where(eq(wallets.userId, userId));
  }

  async getWallet(id: number): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.id, id));
    return wallet;
  }

  async getAllWallets(): Promise<Wallet[]> {
    return db.select().from(wallets);
  }

  async createWallet(wallet: InsertWallet): Promise<Wallet> {
    const [newWallet] = await db.insert(wallets).values(wallet).returning();
    return newWallet;
  }

  async updateWallet(
    id: number,
    walletUpdate: Partial<InsertWallet>,
  ): Promise<Wallet | undefined> {
    const [updatedWallet] = await db
      .update(wallets)
      .set({
        ...walletUpdate,
        updatedAt: new Date(),
      })
      .where(eq(wallets.id, id))
      .returning();
    return updatedWallet;
  }

  async deleteWallet(id: number): Promise<boolean> {
    await db.delete(wallets).where(eq(wallets.id, id));
    // Check if wallet was deleted
    const deletedWallet = await this.getWallet(id);
    return deletedWallet === undefined;
  }

  // Decentralized messages operations
  async getDecentralizedMessages(
    topic: string,
  ): Promise<DecentralizedMessage[]> {
    return db
      .select()
      .from(decentralizedMessages)
      .where(eq(decentralizedMessages.topic, topic))
      .orderBy(decentralizedMessages.timestamp);
  }

  async getDecentralizedMessage(
    id: number,
  ): Promise<DecentralizedMessage | undefined> {
    const [message] = await db
      .select()
      .from(decentralizedMessages)
      .where(eq(decentralizedMessages.id, id));
    return message;
  }

  async saveDecentralizedMessage(
    message: InsertDecentralizedMessage,
  ): Promise<DecentralizedMessage> {
    const [newMessage] = await db
      .insert(decentralizedMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  // Transaction operations
  async getTransactions(portfolioId: number): Promise<any[]> {
    const query = sql`
    SELECT * FROM transactions 
    WHERE "portfolioId" = ${portfolioId}
    ORDER BY date DESC
  `;
    const result = await db.execute(query);
    return result.rows ?? [];
  }

  async createTransaction(transaction: {
    portfolioId: number;
    type: string;
    asset: string;
    amount: number;
    price: number;
    date: Date;
  }): Promise<any> {
    const query = sql`
    INSERT INTO transactions ("portfolioId", type, asset, amount, price, date)
    VALUES (
      ${transaction.portfolioId},
      ${transaction.type},
      ${transaction.asset},
      ${transaction.amount},
      ${transaction.price},
      ${transaction.date}
    )
    RETURNING *
  `;
    const result = await db.execute(query);
    return result.rows[0];
  }

  // Verification code operations
  async createVerificationCode(
    userId: number,
    hashedCode: string,
    verificationToken: string,
    expiresAt: Date,
  ): Promise<VerificationCode> {
    const [verificationCode] = await db
      .insert(emailVerificationCodes)
      .values({
        userId,
        code: hashedCode,
        verificationToken,
        expiresAt,
      })
      .returning();
    return verificationCode;
  }

  async getLatestVerificationCode(
    userId: number,
  ): Promise<VerificationCode | undefined> {
    const [code] = await db
      .select()
      .from(emailVerificationCodes)
      .where(
        and(
          eq(emailVerificationCodes.userId, userId),
          eq(emailVerificationCodes.isUsed, false),
        ),
      )
      .orderBy(desc(emailVerificationCodes.createdAt))
      .limit(1);
    return code;
  }

  async getVerificationCodeByToken(
    token: string,
  ): Promise<VerificationCode | undefined> {
    const [code] = await db
      .select()
      .from(emailVerificationCodes)
      .where(
        and(
          eq(emailVerificationCodes.verificationToken, token),
          eq(emailVerificationCodes.isUsed, false),
        ),
      )
      .limit(1);
    return code;
  }

  async markCodeAsUsed(codeId: number): Promise<void> {
    await db
      .update(emailVerificationCodes)
      .set({ isUsed: true })
      .where(eq(emailVerificationCodes.id, codeId));
  }

  async incrementCodeAttempts(codeId: number): Promise<void> {
    await db
      .update(emailVerificationCodes)
      .set({ attempts: sql`${emailVerificationCodes.attempts} + 1` })
      .where(eq(emailVerificationCodes.id, codeId));
  }

  async updateUserEmailVerification(
    userId: number,
    verified: boolean,
  ): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ isEmailVerified: verified })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async deleteExpiredVerificationCodes(): Promise<void> {
    await db
      .delete(emailVerificationCodes)
      .where(
        or(
          lt(emailVerificationCodes.expiresAt, new Date()),
          eq(emailVerificationCodes.isUsed, true),
        ),
      );
  }

  async countRecentVerificationCodes(
    userId: number,
    since: Date,
  ): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(emailVerificationCodes)
      .where(
        and(
          eq(emailVerificationCodes.userId, userId),
          gte(emailVerificationCodes.createdAt, since),
        ),
      );
    return result?.count ?? 0;
  }

  // Investor profile operations
  async createInvestorProfile(
    data: InsertInvestorProfile,
  ): Promise<InvestorProfile> {
    const [profile] = await db
      .insert(investorProfiles)
      .values(data)
      .returning();
    return profile;
  }

  async getInvestorProfileByUserId(
    userId: number,
  ): Promise<InvestorProfile | undefined> {
    const [profile] = await db
      .select()
      .from(investorProfiles)
      .where(eq(investorProfiles.userId, userId))
      .limit(1);
    return profile;
  }

  async updateInvestorProfile(
    userId: number,
    data: Partial<InsertInvestorProfile>,
  ): Promise<InvestorProfile | undefined> {
    const [updatedProfile] = await db
      .update(investorProfiles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(investorProfiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  // File operations
  async createFile(data: InsertFile): Promise<PortfolioFile> {
    const [file] = await db.insert(files).values(data).returning();
    return file;
  }

  async getFileById(id: number): Promise<PortfolioFile | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file;
  }

  async getFilesByUserId(userId: number): Promise<PortfolioFile[]> {
    return db.select().from(files).where(eq(files.userId, userId));
  }

  async getFilesByPortfolioId(portfolioId: number): Promise<PortfolioFile[]> {
    return db.select().from(files).where(eq(files.portfolioId, portfolioId));
  }

  async getFilesByAssetId(assetId: number): Promise<PortfolioFile[]> {
    return db.select().from(files).where(eq(files.assetId, assetId));
  }

  async updateFilePortfolioId(
    id: number,
    portfolioId: number,
  ): Promise<PortfolioFile | undefined> {
    const [file] = await db
      .update(files)
      .set({ portfolioId })
      .where(eq(files.id, id))
      .returning();
    return file;
  }

  async updateFileAssetId(
    id: number,
    assetId: number,
    portfolioId: number,
  ): Promise<PortfolioFile | undefined> {
    const [file] = await db
      .update(files)
      .set({ assetId, portfolioId })
      .where(eq(files.id, id))
      .returning();
    return file;
  }

  async deleteFile(id: number): Promise<boolean> {
    await db.delete(files).where(eq(files.id, id));
    const file = await this.getFileById(id);
    return file === undefined;
  }

  // FinanciaPlay operations
  async createFinanciaplayProgress(
    data: InsertFinanciaplayProgress,
  ): Promise<FinanciaplayProgress> {
    const [progress] = await db
      .insert(financiaplayProgress)
      .values(data)
      .returning();
    return progress;
  }

  async getFinanciaplayProgress(
    userId: number,
  ): Promise<FinanciaplayProgress[]> {
    return db
      .select()
      .from(financiaplayProgress)
      .where(eq(financiaplayProgress.userId, userId));
  }

  async getFinanciaplayProgressByGame(
    userId: number,
    gameId: string,
  ): Promise<FinanciaplayProgress | undefined> {
    const [progress] = await db
      .select()
      .from(financiaplayProgress)
      .where(
        and(
          eq(financiaplayProgress.userId, userId),
          eq(financiaplayProgress.gameId, gameId),
        ),
      );
    return progress;
  }

  async createFinanciaplayPlacement(
    data: InsertFinanciaplayPlacement,
  ): Promise<FinanciaplayPlacement> {
    const [placement] = await db
      .insert(financiaplayPlacement)
      .values(data)
      .returning();
    return placement;
  }

  async getFinanciaplayPlacement(
    userId: number,
  ): Promise<FinanciaplayPlacement | undefined> {
    const [placement] = await db
      .select()
      .from(financiaplayPlacement)
      .where(eq(financiaplayPlacement.userId, userId));
    return placement;
  }

  async updateFinanciaplayPlacement(
    userId: number,
    data: Partial<InsertFinanciaplayPlacement>,
  ): Promise<FinanciaplayPlacement | undefined> {
    const [updated] = await db
      .update(financiaplayPlacement)
      .set({ ...data, completedAt: new Date() })
      .where(eq(financiaplayPlacement.userId, userId))
      .returning();
    return updated;
  }

  async createFinanciaplayBadge(
    data: InsertFinanciaplayBadge,
  ): Promise<FinanciaplayBadge> {
    const [badge] = await db
      .insert(financiaplayBadges)
      .values(data)
      .returning();
    return badge;
  }

  async getFinanciaplayBadges(userId: number): Promise<FinanciaplayBadge[]> {
    return db
      .select()
      .from(financiaplayBadges)
      .where(eq(financiaplayBadges.userId, userId));
  }

  async hasFinanciaplayBadge(
    userId: number,
    badgeId: string,
  ): Promise<boolean> {
    const [badge] = await db
      .select()
      .from(financiaplayBadges)
      .where(
        and(
          eq(financiaplayBadges.userId, userId),
          eq(financiaplayBadges.badgeId, badgeId),
        ),
      );
    return !!badge;
  }

  async getFinanciaplayXp(userId: number): Promise<FinanciaplayXp | undefined> {
    const [xp] = await db
      .select()
      .from(financiaplayXp)
      .where(eq(financiaplayXp.userId, userId));
    return xp;
  }

  async upsertFinanciaplayXp(
    userId: number,
    xpToAdd: number,
  ): Promise<FinanciaplayXp> {
    const existing = await this.getFinanciaplayXp(userId);
    if (existing) {
      const [updated] = await db
        .update(financiaplayXp)
        .set({ totalXp: existing.totalXp + xpToAdd, updatedAt: new Date() })
        .where(eq(financiaplayXp.userId, userId))
        .returning();
      return updated;
    }
    const [created] = await db
      .insert(financiaplayXp)
      .values({ userId, totalXp: xpToAdd })
      .returning();
    return created;
  }

  async getFinanciaplayLeaderboard(
    limit: number,
  ): Promise<{ userId: number; totalXp: number; username: string | null }[]> {
    return db
      .select({
        userId: financiaplayXp.userId,
        totalXp: financiaplayXp.totalXp,
        username: users.username,
      })
      .from(financiaplayXp)
      .leftJoin(users, eq(financiaplayXp.userId, users.id))
      .orderBy(desc(financiaplayXp.totalXp))
      .limit(limit);
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
