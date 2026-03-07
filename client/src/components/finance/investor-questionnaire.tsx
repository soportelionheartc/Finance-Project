import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  INVESTOR_QUESTIONS, 
  INVESTOR_PROFILES, 
  calculateInvestorProfile,
  type InvestorProfileType 
} from "@/lib/investor-questions";
import { CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export interface InvestorQuestionnaireProps {
  onComplete: (answers: Record<number, number>) => void;
  isLoading?: boolean;
}

export const InvestorQuestionnaire: React.FC<InvestorQuestionnaireProps> = ({ 
  onComplete, 
  isLoading = false 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [profileType, setProfileType] = useState<InvestorProfileType | null>(null);
  const [, setLocation] = useLocation();


  const totalQuestions = INVESTOR_QUESTIONS.length;
  const currentQuestion = INVESTOR_QUESTIONS[currentStep];
  const progressValue = ((currentStep + 1) / totalQuestions) * 100;

  const handleAnswerChange = (optionId: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: optionId
    });
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate final score and show result
      const pointAnswers: Record<number, number> = {};
      INVESTOR_QUESTIONS.forEach(question => {
        const optionId = answers[question.id];
        const option = question.options.find(opt => opt.id === optionId);
        if (option) {
          pointAnswers[question.id] = option.points;
        }
      });
      
      const calculatedProfile = calculateInvestorProfile(pointAnswers);
      setProfileType(calculatedProfile);
      setShowResult(true);
      onComplete(pointAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isCurrentQuestionAnswered = answers[currentQuestion?.id] !== undefined;
  const canGoNext = isCurrentQuestionAnswered && !isLoading;

  // Result screen
  if (showResult && profileType) {
    const profile = INVESTOR_PROFILES[profileType];
    
    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div className="text-center space-y-2">
          <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h2 className="text-3xl font-bold">¡Cuestionario Completado!</h2>
          <p className="text-muted-foreground">
            Hemos identificado tu perfil de inversión
          </p>
        </div>

        <Card className="border-2" style={{ borderColor: profile.color }}>
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Badge
                style={{ backgroundColor: profile.color, color: "#000" }}
                className="text-lg px-4 py-1.5"
              >
                {profile.label}
              </Badge>
            </div>
            <CardTitle className="text-2xl">{profile.description}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Characteristics */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="text-xl">📊</span>
                Características de tu perfil
              </h3>
              <ul className="space-y-2">
                {profile.characteristics.map((characteristic, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="text-muted-foreground">
                      {characteristic}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="text-xl">💡</span>
                Recomendaciones de distribución
              </h3>
              <ul className="space-y-2">
                {profile.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span className="text-muted-foreground">
                      {recommendation}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Review Frequency */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-xl">⏰</span>
                <span className="font-semibold">Frecuencia de revisión:</span>
                <span className="text-muted-foreground">
                  {profile.reviewFrequency}
                </span>
              </div>
            </div>

            {/* Educational Note */}
            <div className="bg-muted/50 rounded-lg p-4 mt-4">
              <p className="text-sm text-muted-foreground">
                <strong>Nota:</strong> Este perfil es una guía inicial basada en
                tus respuestas. Tu estrategia de inversión puede evolucionar con
                el tiempo según tus objetivos y circunstancias. Consulta con un
                asesor financiero para una estrategia personalizada.
              </p>
            </div>

            {/* Home Button */}
            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => {
                  setLocation("/dashboard");
                }}
                className="w-full"
              >
                Volver al Inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Questionnaire screen
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Progress Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">
            Paso {currentStep + 1} de {totalQuestions}
          </span>
          <span className="text-muted-foreground">
            {Math.round(progressValue)}% completado
          </span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-center">
            {currentQuestion.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={answers[currentQuestion.id] || ""}
            onValueChange={handleAnswerChange}
            className="space-y-3"
          >
            {currentQuestion.options.map((option) => (
              <div
                key={option.id}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                  answers[currentQuestion.id] === option.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
                onClick={() => handleAnswerChange(option.id)}
              >
                <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                <Label
                  htmlFor={`option-${option.id}`}
                  className="flex-1 cursor-pointer text-base"
                >
                  <span className="font-semibold text-primary mr-2">{option.id}.</span>
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0 || isLoading}
          className="flex-1 md:flex-none"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canGoNext}
          className="flex-1 md:flex-none"
        >
          {currentStep === totalQuestions - 1 ? (
            <>
              {isLoading ? 'Guardando...' : 'Ver Resultado'}
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Siguiente
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Help text */}
      <div className="text-center text-sm text-muted-foreground">
        Selecciona la opción que mejor describa tu situación
      </div>
    </div>
  );
};
