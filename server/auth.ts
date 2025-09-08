import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, InsertUser } from "@shared/schema";
import { log } from "./vite";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import 'dotenv/config';

// Generate random session secret if not provided
const SESSION_SECRET = process.env.SESSION_SECRET || randomBytes(32).toString('hex');

// Roles
enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

// Extended user interface
interface ExtendedUser extends SelectUser {
  role: "user" | "admin";
}

declare global {
  namespace Express {
    interface User extends ExtendedUser { }
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied ?? "", salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export async function ensureAdminUser() {
  try {
    // Check if admin exists
    const adminUser = await storage.getUserByUsername("jplhc");

    if (!adminUser) {
      log("Creating admin user: jplhc", "auth");

      // Create admin user
      const admin: InsertUser = {
        username: "jplhc",
        password: await hashPassword("2025lhc"),
        email: "admin@lionheartcapital.com",
        name: "Lion Heart Admin"
      };

      const createdAdmin = await storage.createUser(admin);

      // Set admin role (this would normally be in a separate table in a real app)
      (createdAdmin as ExtendedUser).role = UserRole.ADMIN;

      log("Admin user created successfully", "auth");
    } else {
      log("Admin user already exists", "auth");
    }
  } catch (error) {
    log(`Error ensuring admin user: ${error}`, "auth");
  }
}

// Admin middleware
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && (req.user as ExtendedUser).role === UserRole.ADMIN) {
    return next();
  }
  return res.status(403).json({ error: "Acceso no autorizado" });
}

export function setupAuth(app: Express) {
  // Google OAuth2 Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      if (!profile.emails || !profile.emails[0]?.value) {
        return done(new Error("No se recibió el email de Google"), undefined);
      }
      let user = await storage.getUserByEmail(profile.emails[0].value);
      if (!user) {
        user = await storage.createUser({
          username: profile.displayName.replace(/\s/g, "_").toLowerCase(),
          email: profile.emails[0].value,
          name: profile.displayName,
          password: null,
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, undefined);
    }
  }));

  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

  app.get("/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth?error=google" }),
    (req: Request, res: Response) => {
      res.redirect("/dashboard"); // Cambia la ruta si quieres otro destino
    }
  );
  const sessionSettings: session.SessionOptions = {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Ensure admin user exists
  ensureAdminUser();

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password ?? ""))) {
          return done(null, false);
        } else {
          // Check if admin user
          if (username === "jplhc") {
            (user as ExtendedUser).role = UserRole.ADMIN;
          } else {
            (user as ExtendedUser).role = UserRole.USER;
          }

          // Update last login time
          await storage.updateUserLastLogin(user.id);
          return done(null, { ...user, role: user.username === "jplhc" ? "admin" : "user" });
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (user) {
        // Set role for admin
        if (user.username === "jplhc") {
          (user as ExtendedUser).role = UserRole.ADMIN;
        } else {
          (user as ExtendedUser).role = UserRole.USER;
        }
      }
      done(null, user ? { ...user, role: user.username === "jplhc" ? "admin" : "user" } : null);
    } catch (error) {
      done(error, null);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      // Check if username exists
      const existingUsername = await storage.getUserByUsername(req.body.username);
      if (existingUsername) {
        return res.status(400).json({ error: "El nombre de usuario ya está en uso" });
      }

      // Check if email exists
      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ error: "El correo electrónico ya está registrado" });
      }

      // Prevent creation of another admin user
      if (req.body.username === "jplhc") {
        return res.status(400).json({ error: "Este nombre de usuario está reservado" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      // Set role
      (user as ExtendedUser).role = UserRole.USER;

      req.login(user, (err) => {
        if (err) return next(err);
        // Don't send password back to client
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error | null, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: "Credenciales incorrectas" });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        // Don't send password back to client
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    // Don't send password back to client
    const { password, ...userWithoutPassword } = req.user as SelectUser;
    res.json(userWithoutPassword);
  });


  app.post("/api/auth/apple", async (req, res, next) => {
    try {
      // This is a simulation. In a real scenario, you'd use a proper OAuth flow and Apple Sign In APIs
      const randomId = Math.floor(Math.random() * 10000);
      const email = `apple_user_${randomId}@example.com`;

      // Check if email already exists
      let user = await storage.getUserByEmail(email);

      if (!user) {
        // Create new user
        user = await storage.createUser({
          username: `apple_user_${randomId}`,
          email,
          password: await hashPassword(randomBytes(16).toString('hex')), // Random password
          name: `Apple User ${randomId}`,
        });
      }

      // Set role
      (user as ExtendedUser).role = UserRole.USER;

      req.login(user, (err) => {
        if (err) return next(err);
        // Don't send password back to client
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  // Admin routes
  app.get("/api/admin/users", isAdmin, async (req, res, next) => {
    try {
      const users = await storage.getAllUsers();
      // Don't send passwords to client
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      res.json(usersWithoutPasswords);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/admin/users/:id", isAdmin, async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "ID de usuario inválido" });
      }

      // Prevent deletion of admin user
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

