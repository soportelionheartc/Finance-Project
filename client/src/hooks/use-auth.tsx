import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { User } from "@shared/schema";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";

// Definición de esquemas de validación
const loginSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

const registerSchema = insertUserSchema
  .extend({
    passwordConfirm: z
      .string()
      .min(1, "La confirmación de contraseña es obligatoria"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirm"],
  });

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

// Definición del contexto de autenticación
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  isAdmin: boolean;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<
    { email: string; message: string },
    Error,
    RegisterData
  >;
  socialLoginMutation: UseMutationResult<User, Error, string>;
  verifyEmailMutation: UseMutationResult<
    { success: boolean; message: string },
    Error,
    { code: string }
  >;
  resendVerificationMutation: UseMutationResult<
    { message: string },
    Error,
    void
  >;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Función para manejar la redirección según el rol
  const handleSuccessfulLogin = (user: User) => {
    if (user.role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/dashboard";
    }
  };

  // Consulta para obtener los datos del usuario actual
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        if (res.status === 401) return null;
        if (!res.ok) throw new Error("Error al obtener el usuario");
        return await res.json();
      } catch (err) {
        return null;
      }
    },
  });

  // Mutación para iniciar sesión
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${user.name || user.username}`,
      });
      handleSuccessfulLogin(user);
    },
    onError: (error: Error) => {
      toast({
        title: "Error de inicio de sesión",
        description: error.message || "Credenciales incorrectas",
        variant: "destructive",
      });
    },
  });

  // Mutación para registro
  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData) => {
      const { passwordConfirm, ...userData } = credentials;
      const res = await apiRequest("POST", "/api/register", userData);
      return await res.json();
    },
    onSuccess: (response: { email: string; message: string }) => {
      // Guardar email en localStorage para la página de verificación
      localStorage.setItem("pendingVerificationEmail", response.email);

      toast({
        title: "¡Registro exitoso!",
        description: "Por favor verifica tu correo electrónico para continuar",
      });

      // Redirigir a la página de verificación
      // Usar replace para evitar que el usuario pueda volver atrás
      window.location.replace("/verify-email");
    },
    onError: (error: Error) => {
      toast({
        title: "Error de registro",
        description: error.message || "Error al crear la cuenta",
        variant: "destructive",
      });
    },
  });

  // Mutación para inicio de sesión social
  const socialLoginMutation = useMutation({
    mutationFn: async (provider: string) => {
      const res = await apiRequest("POST", `/api/auth/${provider}`, {});
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${user.name || user.username}`,
      });
      handleSuccessfulLogin(user);
    },
    onError: (error: Error) => {
      toast({
        title: "Error de inicio de sesión",
        description:
          "No se pudo conectar con el proveedor social. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  // Mutación para cerrar sesión
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
      window.location.href = "/auth";
    },
    onError: (error: Error) => {
      toast({
        title: "Error al cerrar sesión",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutación para verificar email
  const verifyEmailMutation = useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      const email = localStorage.getItem("pendingVerificationEmail");
      if (!email) {
        throw new Error(
          "No se encontró el correo electrónico pendiente de verificación",
        );
      }
      const res = await apiRequest("POST", "/api/verify-email", {
        email,
        code,
      });
      return await res.json();
    },
    onSuccess: (data: { success: boolean; message: string }) => {
      // Limpiar email de localStorage
      localStorage.removeItem("pendingVerificationEmail");

      toast({
        title: "¡Email verificado!",
        description: "Ahora puedes iniciar sesión con tu cuenta",
      });

      // Redirigir a la página de login (NO al dashboard)
      // Usar replace para evitar que el usuario pueda volver atrás
      window.location.replace("/auth");
    },
    onError: (error: Error) => {
      toast({
        title: "Error de verificación",
        description: error.message || "Código inválido o expirado",
        variant: "destructive",
      });
    },
  });

  // Mutación para reenviar código de verificación
  const resendVerificationMutation = useMutation({
    mutationFn: async () => {
      const email = localStorage.getItem("pendingVerificationEmail");
      if (!email) {
        throw new Error(
          "No se encontró el correo electrónico pendiente de verificación",
        );
      }
      const res = await apiRequest("POST", "/api/resend-verification", {
        email,
      });
      return await res.json();
    },
    onSuccess: (data: { message: string }) => {
      toast({
        title: "Código enviado",
        description: data.message || "Revisa tu correo electrónico",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al enviar código",
        description:
          error.message || "No se pudo enviar el código. Intenta nuevamente.",
        variant: "destructive",
      });
    },
  });

  // Verificar si el usuario es administrador
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error: error as Error | null,
        isAdmin,
        loginMutation,
        logoutMutation,
        registerMutation,
        socialLoginMutation,
        verifyEmailMutation,
        resendVerificationMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}

export const loginFormSchema = loginSchema;
export const registerFormSchema = registerSchema;
