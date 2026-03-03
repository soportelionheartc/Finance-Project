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
import { generateVerificationCode, generateVerificationToken, hashVerificationCode, verifyCodeMatch, isCodeExpired } from "./verificationUtils";
import { sendVerificationEmail } from "./emailService";

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
        // Google OAuth users are automatically verified since Google already verified their email
        await storage.updateUserEmailVerification(user.id, true);
        // Refresh user to get updated verification status
        user = (await storage.getUser(user.id))!;
      } else if (!user.isEmailVerified) {
        // If existing user was not verified, mark them as verified now
        await storage.updateUserEmailVerification(user.id, true);
        user = (await storage.getUser(user.id))!;
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

      // Generate and store verification code
      const verificationCode = generateVerificationCode();
      const verificationToken = generateVerificationToken();
      const hashedCode = hashVerificationCode(verificationCode);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
      
      try {
        await storage.createVerificationCode(user.id, hashedCode, verificationToken, expiresAt);
        // Send verification email
        if (user.email) {
          const displayName = user.name || user.username || "Usuario";
          await sendVerificationEmail(user.email, verificationCode, displayName, verificationToken);
          log(`Verification email sent to ${user.email}`, "auth");
        }
      } catch (emailError) {
        // Log error but don't fail registration
        log(`Failed to send verification email to ${user.email}: ${emailError}`, "auth");
      }

      // Do NOT log in the user - they must verify email first
      res.status(201).json({ 
        email: user.email,
        message: "Cuenta creada exitosamente. Por favor verifica tu correo electrónico para continuar."
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
      
      // Check if email is verified
      if (!user.isEmailVerified) {
        return res.status(403).json({ 
          error: "Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.",
          errorCode: "EMAIL_NOT_VERIFIED",
          email: user.email
        });
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

  // Verify email endpoint
  app.post("/api/verify-email", async (req, res, next) => {
    try {
      const { email, code } = req.body;

      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "El correo electrónico es requerido" });
      }

      if (!code || typeof code !== "string" || code.length !== 6) {
        return res.status(400).json({ error: "El código de verificación debe tener 6 dígitos" });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Check if already verified
      if (user.isEmailVerified) {
        return res.status(400).json({ error: "Este correo ya está verificado" });
      }

      const userId = user.id;

      // Get the latest verification code for this user
      const verificationRecord = await storage.getLatestVerificationCode(userId);

      if (!verificationRecord) {
        return res.status(400).json({ error: "No hay código de verificación pendiente. Solicita uno nuevo." });
      }

      // Check if code is expired
      if (isCodeExpired(verificationRecord.expiresAt)) {
        return res.status(400).json({ error: "El código ha expirado. Solicita uno nuevo." });
      }

      // Check if already used
      if (verificationRecord.isUsed) {
        return res.status(400).json({ error: "Este código ya fue utilizado. Solicita uno nuevo." });
      }

      // Check max attempts (3)
      const currentAttempts = verificationRecord.attempts ?? 0;
      if (currentAttempts >= 3) {
        return res.status(400).json({ error: "Has excedido el número máximo de intentos. Solicita un código nuevo." });
      }

      // Verify the code (the 'code' field in DB stores the hashed code)
      const isMatch = verifyCodeMatch(code, verificationRecord.code);

      if (!isMatch) {
        // Increment attempts
        await storage.incrementCodeAttempts(verificationRecord.id);
        const remainingAttempts = 2 - currentAttempts;
        return res.status(400).json({ 
          error: remainingAttempts > 0 
            ? `Código incorrecto. Te quedan ${remainingAttempts} intento${remainingAttempts > 1 ? 's' : ''}.`
            : "Código incorrecto. Has excedido el número máximo de intentos. Solicita un código nuevo."
        });
      }

      // Code matches! Mark as used and verify user email
      await storage.markCodeAsUsed(verificationRecord.id);
      await storage.updateUserEmailVerification(userId, true);

      // DO NOT log in the user - they must log in manually after verification
      log(`Email verified successfully for user ${userId}`, "auth");
      
      res.json({ 
        success: true, 
        message: "¡Correo electrónico verificado exitosamente! Ya puedes iniciar sesión."
      });
    } catch (error) {
      next(error);
    }
  });
  // One-click email verification via token (GET request for email links)
  app.get("/verify-email-token/:token", async (req, res, next) => {
    try {
      const { token } = req.params;

      if (!token || typeof token !== "string") {
        return res.status(400).send(`
          <!DOCTYPE html>
          <html>
            <head><title>Error de Verificación</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #1a1a2e; color: white;">
              <h1 style="color: #ff6b6b;">❌ Token inválido</h1>
              <p>El enlace de verificación no es válido.</p>
              <a href="/auth" style="color: #FFC107; text-decoration: none; font-weight: bold;">Volver al inicio de sesión</a>
            </body>
          </html>
        `);
      }

      // Find verification code by token
      const verificationRecord = await storage.getVerificationCodeByToken(token);

      if (!verificationRecord) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html>
            <head><title>Error de Verificación</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #1a1a2e; color: white;">
              <h1 style="color: #ff6b6b;">❌ Token no encontrado</h1>
              <p>El enlace de verificación no existe o ya fue utilizado.</p>
              <a href="/verify-email" style="color: #FFC107; text-decoration: none; font-weight: bold;">Ingresar código manualmente</a>
            </body>
          </html>
        `);
      }

      // Check if code is expired
      if (isCodeExpired(verificationRecord.expiresAt)) {
        return res.status(400).send(`
          <!DOCTYPE html>
          <html>
            <head><title>Código Expirado</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #1a1a2e; color: white;">
              <h1 style="color: #ff9800;">⏱️ Código expirado</h1>
              <p>El enlace de verificación ha expirado. Los enlaces expiran después de 15 minutos.</p>
              <a href="/verify-email" style="color: #FFC107; text-decoration: none; font-weight: bold;">Solicitar un nuevo código</a>
            </body>
          </html>
        `);
      }

      // Check if already used
      if (verificationRecord.isUsed) {
        return res.status(400).send(`
          <!DOCTYPE html>
          <html>
            <head><title>Ya Verificado</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #1a1a2e; color: white;">
              <h1 style="color: #4caf50;">✅ Ya verificado</h1>
              <p>Este correo electrónico ya fue verificado.</p>
              <a href="/auth" style="color: #FFC107; text-decoration: none; font-weight: bold;">Ir al inicio de sesión</a>
            </body>
          </html>
        `);
      }

      // Mark as used and verify user email
      await storage.markCodeAsUsed(verificationRecord.id);
      await storage.updateUserEmailVerification(verificationRecord.userId, true);

      log(`Email verified successfully via token for user ${verificationRecord.userId}`, "auth");
      
      // Send success HTML page with redirect
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Verificación Exitosa</title>
            <meta http-equiv="refresh" content="3;url=/auth">
          </head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #1a1a2e; color: white;">
            <h1 style="color: #4caf50;">✅ ¡Correo verificado exitosamente!</h1>
            <p style="color: #b8b8b8;">Tu correo electrónico ha sido verificado correctamente.</p>
            <p style="color: #FFC107;">Serás redirigido al inicio de sesión en 3 segundos...</p>
            <a href="/auth" style="color: #FFC107; text-decoration: none; font-weight: bold;">O haz clic aquí para continuar</a>
          </body>
        </html>
      `);
    } catch (error) {
      next(error);
    }
  });
  // Resend verification code endpoint
  app.post("/api/resend-verification", async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "El correo electrónico es requerido" });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Check if user is already verified
      if (user.isEmailVerified) {
        return res.status(400).json({ error: "Este correo ya está verificado" });
      }

      const userId = user.id;
      const userEmail = user.email;
      const userName = user.name || user.username || "Usuario";

      // Rate limit: max 5 codes per hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentCodesCount = await storage.countRecentVerificationCodes(userId, oneHourAgo);

      if (recentCodesCount >= 5) {
        return res.status(429).json({ 
          error: "Has alcanzado el límite de solicitudes (5 por hora). Por favor espera antes de intentar de nuevo."
        });
      }

      // Generate new verification code
      const verificationCode = generateVerificationCode();
      const verificationToken = generateVerificationToken();
      const hashedCode = hashVerificationCode(verificationCode);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

      await storage.createVerificationCode(userId, hashedCode, verificationToken, expiresAt);

      // Send verification email
      try {
        await sendVerificationEmail(userEmail, verificationCode, userName, verificationToken);
        log(`Verification code resent to ${userEmail}`, "auth");
        res.json({ success: true, message: "Se ha enviado un nuevo código de verificación a tu correo electrónico." });
      } catch (emailError) {
        log(`Failed to resend verification email to ${userEmail}: ${emailError}`, "auth");
        return res.status(500).json({ error: "No se pudo enviar el correo de verificación. Inténtalo de nuevo más tarde." });
      }
    } catch (error) {
      next(error);
    }
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

      // Auto-verify Apple OAuth users (Apple already verified the email)
      if (!user.isEmailVerified) {
        await storage.updateUserEmailVerification(user.id, true);
        user = (await storage.getUser(user.id))!;
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

