import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const [, setLocation] = useLocation();
  const { verifyEmailMutation, resendVerificationMutation } = useAuth();
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [email, setEmail] = useState<string | null>(null);

  // Obtener email de localStorage
  useEffect(() => {
    const pendingEmail = localStorage.getItem("pendingVerificationEmail");
    if (!pendingEmail) {
      // Si no hay email pendiente, redirigir a auth
      setLocation("/auth");
    } else {
      setEmail(pendingEmail);
    }
  }, [setLocation]);

  // Cooldown timer para reenvío
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = () => {
    if (code.length === 6) {
      verifyEmailMutation.mutate({ code });
    }
  };

  const handleResend = () => {
    if (resendCooldown === 0) {
      resendVerificationMutation.mutate();
      setResendCooldown(60); // 60 segundos de cooldown
    }
  };

  // Si no hay email, no mostrar nada (redirigirá)
  if (!email) {
    return null;
  }

  const isCodeComplete = code.length === 6;
  const isVerifying = verifyEmailMutation.isPending;
  const isResending = resendVerificationMutation.isPending;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader className="space-y-4 text-center">
            <div className="bg-primary/20 mx-auto w-fit rounded-full p-4">
              <Mail className="text-primary h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-2xl text-white">
                Verifica tu correo electrónico
              </CardTitle>
              <CardDescription className="mt-2 text-gray-400">
                Hemos enviado un código de 6 dígitos a
              </CardDescription>
              <p className="text-primary mt-1 font-medium">{email}</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Input OTP */}
            <div className="flex flex-col items-center space-y-4">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={setCode}
                disabled={isVerifying}
              >
                <InputOTPGroup>
                  <InputOTPSlot
                    index={0}
                    className="border-zinc-700 bg-zinc-800 text-white"
                  />
                  <InputOTPSlot
                    index={1}
                    className="border-zinc-700 bg-zinc-800 text-white"
                  />
                  <InputOTPSlot
                    index={2}
                    className="border-zinc-700 bg-zinc-800 text-white"
                  />
                  <InputOTPSlot
                    index={3}
                    className="border-zinc-700 bg-zinc-800 text-white"
                  />
                  <InputOTPSlot
                    index={4}
                    className="border-zinc-700 bg-zinc-800 text-white"
                  />
                  <InputOTPSlot
                    index={5}
                    className="border-zinc-700 bg-zinc-800 text-white"
                  />
                </InputOTPGroup>
              </InputOTP>

              <p className="text-center text-sm text-gray-400">
                Ingresa el código de 6 dígitos que recibiste
              </p>
            </div>

            {/* Error message */}
            {verifyEmailMutation.isError && (
              <Alert
                variant="destructive"
                className="border-red-900 bg-red-950/50"
              >
                <AlertDescription>
                  {verifyEmailMutation.error?.message ||
                    "Código inválido o expirado"}
                </AlertDescription>
              </Alert>
            )}

            {/* Botón de verificar */}
            <Button
              onClick={handleVerify}
              disabled={!isCodeComplete || isVerifying}
              className="bg-primary hover:bg-primary/90 w-full font-semibold text-black"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar código"
              )}
            </Button>

            {/* Botón de reenviar */}
            <div className="space-y-2 text-center">
              <p className="text-sm text-gray-400">¿No recibiste el código?</p>
              <Button
                onClick={handleResend}
                disabled={resendCooldown > 0 || isResending}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : resendCooldown > 0 ? (
                  `Reenviar código (${resendCooldown}s)`
                ) : (
                  "Reenviar código"
                )}
              </Button>
            </div>

            {/* Mensaje informativo */}
            <Alert className="border-zinc-700 bg-zinc-800">
              <AlertDescription className="text-sm text-gray-400">
                El código expira en 15 minutos. Si no lo encuentras, revisa tu
                carpeta de spam.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
