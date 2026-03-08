import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, Link } from "wouter";
import { useAuth, loginFormSchema, registerFormSchema } from "@/hooks/use-auth";
import { LionLogo } from "@/components/ui/lion-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";

type LoginFormValues = z.infer<typeof loginFormSchema>;
type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation, socialLoginMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  // Estado para sugerencias de username
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);

  // Definir todos los hooks antes de cualquier retorno condicional
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  //TODO: revisar el register form que esta funcionando todo trocado
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
    },
  });

  // Generar sugerencias de username para nombres y apellidos compuestos
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    registerForm.setValue("name", e.target.value);
    const value = e.target.value.trim();
    if (!value) {
      setUsernameSuggestions([]);
      return;
    }
    const partes = value.split(/\s+/).filter(Boolean);
    if (partes.length < 2) {
      setUsernameSuggestions([partes[0]?.toLowerCase() || ""]);
      return;
    }
    // Ejemplo: Juan David Perez Gomez
    const nombres = partes.slice(0, -2); // todos menos los dos últimos
    const apellidos = partes.slice(-2); // los dos últimos
    const primerNombre = partes[0] || "";
    const segundoNombre = partes[1] || "";
    const primerApellido = apellidos[0] || "";
    const segundoApellido = apellidos[1] || "";
    const iniciales = partes.map(p => p[0]).join("");
    // Números aleatorios para combinaciones
    const nums = [
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 900 + 100),
      new Date().getFullYear() % 100, // dos últimos dígitos del año
    ];
    const combinaciones = [
      `${primerNombre}${primerApellido}`,
      `${primerNombre}${segundoApellido}`,
      `${primerNombre}.${primerApellido}`,
      `${primerNombre}_${primerApellido}`,
      `${primerNombre}${segundoNombre}${primerApellido}`,
      `${primerNombre}${segundoNombre}`,
      `${primerNombre}${segundoNombre}${primerApellido}${segundoApellido}`,
      `${primerNombre[0] || ''}${primerApellido}`,
      `${primerNombre}${primerApellido[0] || ''}`,
      `${iniciales}`,
      `${primerNombre}${segundoNombre[0] || ''}${primerApellido}`,
      `${primerNombre}${primerApellido}${segundoApellido}`,
      // combinaciones con números
      `${primerNombre}${primerApellido}${nums[0]}`,
      `${primerNombre}${primerApellido}${nums[1]}`,
      `${primerNombre}${primerApellido}${nums[2]}`,
      `${primerNombre}.${primerApellido}${nums[0]}`,
      `${primerNombre}_${primerApellido}${nums[1]}`,
      `${iniciales}${nums[2]}`,
      `${primerNombre}${segundoNombre}${primerApellido}${nums[0]}`,
    ];
    setUsernameSuggestions(combinaciones.map(s => s.toLowerCase()).filter(Boolean));
  };

  // Autocompletar username al hacer clic en sugerencia
  const handleSuggestionClick = (suggestion: string) => {
    registerForm.setValue("username", suggestion);
  };

  // Función para cerrar sesión manualmente
  const handleLogout = () => {
    fetch('/api/logout', {
      method: 'POST',
      credentials: 'include'
    })
      .then(() => {
        // Recargar la página después de cerrar sesión
        window.location.reload();
      })
      .catch(err => {
        console.error('Error al cerrar sesión:', err);
      });
  };

  // Funciones de envío de formularios
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  const onSocialLogin = (provider: string) => {
    socialLoginMutation.mutate(provider);
  };

  // Si el usuario ya está autenticado, ofrecemos la opción de cerrar sesión
  if (user) {
    return (
      <div className="flex min-h-screen bg-black items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-lg border border-zinc-800 bg-zinc-900 shadow-lg">
          <div className="text-center mb-6">
            <LionLogo withText size="lg" />
            <h2 className="mt-6 text-xl font-bold text-white">
              Ya has iniciado sesión
            </h2>
            <p className="mt-2 text-gray-400">
              Has iniciado sesión como <span className="text-primary font-medium">{user.username}</span>
            </p>
          </div>
          <div className="space-y-4">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-black"
              onClick={() => window.location.href = "/dashboard"}
            >
              Ir a la página de inicio
            </Button>
            <Button
              variant="outline"
              className="w-full border-primary text-primary"
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header fuera del container para ocupar todo el ancho */}
      <div className="w-full">
        <div className="flex items-center gap-3 border-b border-border/40 bg-linear-to-r from-primary/20 to-black p-4">
          <LionLogo className="h-10 w-10" />
          <div>
            <h1 className="font-bold text-lg text-gradient bg-linear-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              FINANCE 360°
            </h1>
            <p>Zupi Fintech</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4 flex flex-col items-center">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <div className="flex justify-start mb-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="hover:bg-primary/20 flex items-center text-primary px-0"
                >
                  <ArrowLeft className="h-5 w-5 mr-1" />
                  Regresar
                </Button>
              </Link>
            </div>
          </div>

          <div className="max-w-2xl mx-auto text-center mb-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              <span className="block">Zupi Fintech</span>
              <span className="block text-primary mt-2">
                Tu éxito financiero
              </span>
            </h1>
            <p className="mt-4 text-md text-gray-300">
              Accede a nuestra plataforma para obtener análisis financieros
              avanzados, gestionar tus activos de forma inteligente y maximizar
              tus inversiones con ayuda de la inteligencia artificial.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div className="text-center">
                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                  <h3 className="text-primary text-lg font-bold">IA</h3>
                  <p className="text-gray-400 text-xs mt-1">
                    Análisis inteligente de datos
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                  <h3 className="text-primary text-lg font-bold">Blockchain</h3>
                  <p className="text-gray-400 text-xs mt-1">
                    Integración con wallets
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                  <h3 className="text-primary text-lg font-bold">Mercados</h3>
                  <p className="text-gray-400 text-xs mt-1">
                    Acceso a datos globales
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Tabs
              defaultValue="login"
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-black border border-primary/30">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-primary data-[state=active]:text-black"
                >
                  Iniciar sesión
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-primary data-[state=active]:text-black"
                >
                  Registrarse
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card className="bg-black border-zinc-800">
                  <CardContent className="pt-6">
                    {loginMutation.error && (
                      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
                        <div className="bg-zinc-900 border border-yellow-600 rounded-xl p-6 shadow-lg max-w-md w-full text-center animate-fade-in">
                          <h4 className="text-lg font-bold text-yellow-500 mb-2">
                            {(loginMutation.error as any)?.errorCode === 'EMAIL_NOT_VERIFIED' 
                              ? '📧 Verifica tu correo electrónico' 
                              : 'Acceso denegado'}
                          </h4>
                          <p className="text-gray-300 mb-4">
                            {(loginMutation.error as any)?.errorCode === 'EMAIL_NOT_VERIFIED' 
                              ? 'Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada y carpeta de spam.' 
                              : 'Credenciales incorrectas. Por favor verifica tu usuario y contraseña. Si no tienes cuenta, regístrate.'}
                          </p>
                          {(loginMutation.error as any)?.errorCode === 'EMAIL_NOT_VERIFIED' && (
                            <Button
                              variant="outline"
                              className="border-primary text-primary hover:bg-primary/20 mb-2 w-full"
                              onClick={() => {
                                const email = (loginMutation.error as any)?.email;
                                if (email) {
                                  localStorage.setItem('pendingVerificationEmail', email);
                                  setLocation('/verify-email');
                                }
                              }}
                            >
                              Ir a verificar correo
                            </Button>
                          )}
                          <Button
                            className="bg-yellow-500 text-black font-semibold px-6 w-full"
                            onClick={() => loginMutation.reset()}
                          >
                            Cerrar
                          </Button>
                        </div>
                      </div>
                    )}
                    <form
                      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-gray-300">
                          Nombre de usuario
                        </Label>
                        <Input
                          id="username"
                          placeholder="Usuario"
                          className="bg-black border-zinc-700 focus:border-primary"
                          {...loginForm.register("username")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-300">
                          Contraseña
                        </Label>
                        <Input
                          id="password"
                          placeholder="**********"
                          type="password"
                          className="bg-black border-zinc-700 focus:border-primary"
                          {...loginForm.register("password")}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-black font-bold"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending
                          ? "Iniciando sesión..."
                          : "Iniciar sesión"}
                      </Button>
                    </form>

                    <div className="mt-6">
                      <p className="text-center text-sm text-gray-400 mb-3">
                        O continuar con
                      </p>
                      <SocialAuthButtons />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <Card className="bg-black border-zinc-800">
                  <CardContent className="pt-6">
                    {/* Modal personalizado para error de registro */}
                    {registerMutation.error && (
                      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
                        <div className="bg-zinc-900 border border-yellow-600 rounded-xl p-6 shadow-lg max-w-sm w-full text-center animate-fade-in">
                          <h4 className="text-lg font-bold text-yellow-500 mb-2">
                            Registro fallido
                          </h4>
                          <p className="text-gray-300 mb-4">
                            Error al registrarse. Por favor verifica los datos e
                            intenta de nuevo.
                          </p>
                          <Button
                            className="bg-yellow-500 text-black font-semibold px-6 mt-2"
                            onClick={() => registerMutation.reset()}
                          >
                            Cerrar
                          </Button>
                        </div>
                      </div>
                    )}
                    <form
                      onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor="register-name"
                          className="text-gray-300"
                        >
                          Nombre completo
                        </Label>
                        <Input
                          id="register-name"
                          placeholder="Nombre y apellido"
                          className="bg-black border-zinc-700 focus:border-primary"
                          {...registerForm.register("name")}
                          onChange={handleNameChange}
                        />
                        {registerForm.formState.errors.name && (
                          <p className="text-sm font-medium text-destructive">
                            {registerForm.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="register-username"
                          className="text-gray-300"
                        >
                          Nombre de usuario
                        </Label>
                        <Input
                          id="register-username"
                          placeholder="usuario"
                          className="bg-black border-zinc-700 focus:border-primary"
                          {...registerForm.register("username")}
                        />
                        {/* Sugerencias de username */}
                        {usernameSuggestions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {usernameSuggestions.map((s, i) => (
                              <button
                                type="button"
                                key={s + i}
                                className="px-2 py-1 bg-zinc-800 border border-primary text-primary rounded text-xs hover:bg-primary hover:text-black transition"
                                onClick={() => handleSuggestionClick(s)}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                        {registerForm.formState.errors.username && (
                          <p className="text-sm font-medium text-destructive">
                            {registerForm.formState.errors.username.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="register-email"
                          className="text-gray-300"
                        >
                          Correo electrónico
                        </Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="correo@ejemplo.com"
                          className="bg-black border-zinc-700 focus:border-primary"
                          {...registerForm.register("email")}
                        />
                        {registerForm.formState.errors.email && (
                          <p className="text-sm font-medium text-destructive">
                            {registerForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="register-password"
                          className="text-gray-300"
                        >
                          Contraseña
                        </Label>
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="**********"
                          className="bg-black border-zinc-700 focus:border-primary"
                          {...registerForm.register("password")}
                        />
                        {registerForm.formState.errors.password && (
                          <p className="text-sm font-medium text-destructive">
                            {registerForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="register-confirm-password"
                          className="text-gray-300"
                        >
                          Confirmar contraseña
                        </Label>
                        <Input
                          id="register-confirm-password"
                          type="password"
                          placeholder="**********"
                          className="bg-black border-zinc-700 focus:border-primary"
                          {...registerForm.register("passwordConfirm")}
                        />
                        {registerForm.formState.errors.passwordConfirm && (
                          <p className="text-sm font-medium text-destructive">
                            {
                              registerForm.formState.errors.passwordConfirm
                                .message
                            }
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-black font-bold"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending
                          ? "Registrando..."
                          : "Registrarse"}
                      </Button>
                    </form>

                    <div className="mt-6">
                      <p className="text-center text-sm text-gray-400 mb-3">
                        O continuar con
                      </p>
                      <SocialAuthButtons />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>© 2025 Zupi Fintech Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}