import { Header } from "@/components/layout/header";
import { AiChat } from "@/components/finance/ai-chat";
import { Button } from "@/components/ui/button";
import { InvestorProfileGuard } from "@/lib/investor-profile-guard";

export default function FinancialAssistantPage() {
  return (
    <InvestorProfileGuard>
      <div className="bg-background flex min-h-screen flex-col">
        <Header />

        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="mb-4 w-fit"
        >
          ← Volver
        </Button>

        <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-8">
          <div className="mb-8 w-full max-w-xl text-center">
            <h1 className="text-primary mb-2 text-3xl font-bold md:text-4xl">
              Asistente Financiero Inteligente
            </h1>
            <p className="text-muted-foreground mb-4">
              Haz preguntas sobre tu portafolio, inversiones, finanzas
              personales o mercados. El asistente te responde con IA.
            </p>
          </div>
          <div className="w-full max-w-xl">
            <AiChat />
          </div>
        </main>
      </div>
    </InvestorProfileGuard>
  );
}
