export interface InvestorQuestion {
  id: number;
  title: string;
  options: InvestorQuestionOption[];
}

export interface InvestorQuestionOption {
  id: string;
  text: string;
  points: number;
}

export interface InvestorProfile {
  label: string;
  color: string;
  description: string;
  characteristics: string[];
  recommendations: string[];
  reviewFrequency: string;
}

export const INVESTOR_QUESTIONS: InvestorQuestion[] = [
  {
    id: 1,
    title: "¿Para qué quieres invertir tu dinero?",
    options: [
      { id: 'A', text: "Proteger mis ahorros de la inflación", points: 1 },
      { id: 'B', text: "Comprar algo a mediano plazo (casa/estudio)", points: 2 },
      { id: 'C', text: "Aumentar mi patrimonio significativamente", points: 3 }
    ]
  },
  {
    id: 2,
    title: "¿En cuánto tiempo planeas retirar este dinero?",
    options: [
      { id: 'A', text: "En menos de un año", points: 1 },
      { id: 'B', text: "De 1 a 5 años", points: 2 },
      { id: 'C', text: "Más de 5 años", points: 3 }
    ]
  },
  {
    id: 3,
    title: "Si tu inversión cae un 20% en un mes, ¿qué harías?",
    options: [
      { id: 'A', text: "Me asusto y retiro todo", points: 0 },
      { id: 'B', text: "Me preocupo, pero espero recuperación", points: 4 },
      { id: 'C', text: "Aprovecho y compro más", points: 7 }
    ]
  },
  {
    id: 4,
    title: "¿Qué tanto conoces sobre activos (acciones, criptos)?",
    options: [
      { id: 'A', text: "No sé nada, busco guía total", points: 1 },
      { id: 'B', text: "Entiendo conceptos básicos", points: 2 },
      { id: 'C', text: "Tengo experiencia analizando gráficas", points: 3 }
    ]
  },
  {
    id: 5,
    title: "¿Cómo describirías tu fuente de ingresos actual?",
    options: [
      { id: 'A', text: "Estable (salario fijo)", points: 1 },
      { id: 'B', text: "Variable (independiente)", points: 2 }
    ]
  },
  {
    id: 6,
    title: "¿Qué parte de tus ahorros son estos 10 millones COP?",
    options: [
      { id: 'A', text: "Es casi todo lo que tengo", points: 1 },
      { id: 'B', text: "Es una parte importante, tengo fondo de emergencia", points: 2 },
      { id: 'C', text: "Es dinero que me sobra", points: 3 }
    ]
  }
];

export type InvestorProfileType = 'conservative' | 'moderate' | 'aggressive';

export const INVESTOR_PROFILES: Record<InvestorProfileType, InvestorProfile> = {
  conservative: {
    label: "Conservador",
    color: "#4ade80",
    description: "Priorizas la seguridad y la preservación de tu capital.",
    characteristics: [
      "Prefieres inversiones de bajo riesgo",
      "Valoras la estabilidad sobre altos rendimientos",
      "Te preocupa proteger tu capital de pérdidas"
    ],
    recommendations: [
      "70% renta fija (bonos, CDTs)",
      "20% fondos indexados diversificados",
      "10% liquidez para emergencias"
    ],
    reviewFrequency: "Revisar portafolio cada 6 meses"
  },
  moderate: {
    label: "Moderado",
    color: "#D4AF37",
    description: "Buscas un equilibrio entre crecimiento y riesgo controlado.",
    characteristics: [
      "Aceptas volatilidad moderada por mejores rendimientos",
      "Tienes horizonte de inversión mediano-largo plazo",
      "Conocimiento financiero básico-intermedio"
    ],
    recommendations: [
      "40% renta fija (estabilidad)",
      "40% acciones/ETFs (crecimiento)",
      "15% alternativos (diversificación)",
      "5% liquidez"
    ],
    reviewFrequency: "Revisar portafolio trimestralmente"
  },
  aggressive: {
    label: "Arriesgado",
    color: "#f87171",
    description: "Buscas maximizar rendimientos aceptando alta volatilidad.",
    characteristics: [
      "Alta tolerancia al riesgo y volatilidad",
      "Horizonte de inversión largo plazo (5+ años)",
      "Experiencia en análisis de mercados"
    ],
    recommendations: [
      "60% acciones/criptomonedas (alto potencial)",
      "25% alternativos (venture capital, commodities)",
      "10% renta fija (balance mínimo)",
      "5% liquidez"
    ],
    reviewFrequency: "Revisar portafolio mensualmente"
  }
};

/**
 * Calculate investor profile type based on total points
 * 
 * Score ranges (matching backend logic):
 * - Conservative: 0-7 points (low risk tolerance)
 * - Moderate: 8-14 points (balanced approach)
 * - Aggressive: 15-21 points (high risk tolerance)
 * 
 * Note: Actual achievable range is 5-21 due to question structure
 */
export function calculateInvestorProfile(answers: Record<number, number>): InvestorProfileType {
  const totalPoints = Object.values(answers).reduce((sum, points) => sum + points, 0);
  
  if (totalPoints <= 7) {
    return 'conservative';
  } else if (totalPoints <= 14) {
    return 'moderate';
  } else {
    return 'aggressive';
  }
}
