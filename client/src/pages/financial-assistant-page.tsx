import { Header } from "@/components/layout/header";
import { AiChat } from "@/components/finance/ai-chat";

export default function FinancialAssistantPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
                <div className="max-w-xl w-full text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Asistente Financiero Inteligente</h1>
                    <p className="text-muted-foreground mb-4">
                        Haz preguntas sobre tu portafolio, inversiones, finanzas personales o mercados. El asistente te responde con IA.
                    </p>
                </div>
                <div className="w-full max-w-xl">
                    <AiChat />
                    
                </div>
            </main>
        </div>
    );
}
