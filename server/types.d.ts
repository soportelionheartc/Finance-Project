import "express";

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string | null;
      password: string | null;
      email: string;
      name: string | null;
      profilePicture: string | null;
      role: "user" | "admin";
      createdAt: Date | null;
      lastLogin: Date | null;
      isEmailVerified: boolean | null;
      preferredLanguage: string | null;
    }

    interface Request {
      user?: User;
      isAuthenticated: () => boolean;
    }
  }
}
