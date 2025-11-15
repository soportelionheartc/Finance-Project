// client/src/types.ts

// --- Preguntas / Payloads ---
export interface Pregunta {
  q: string;
  options: string[];
  answerIndex: number;
  explain?: string;
}

export interface PreguntaTF {
  question: string;
  answer: boolean;
  explain?: string;
}

export interface QuizMCPayload {
  questions: Pregunta[];
}

export interface TrueFalsePayload {
  questions: PreguntaTF[];
}

export interface CategorizePayload {
  categories: { key: string; label: string }[];
  items: { label: string; categoryKey: string }[];
}

export interface BudgetCategory {
  key: string;
  label: string;
  targetPctMin: number;
  targetPctMax: number;
}

export interface BudgetPayload {
  income: number;
  categories: BudgetCategory[];
}

export interface DecisionScenario {
  text: string;
  options: string[];
  correctIndex: number;
  explain?: string;
}

export interface DecisionPayload {
  scenarios: DecisionScenario[];
}

// --- Niveles ---
export interface NivelBase<T> {
  level: number;
  points: number;
  minPointsToPass: number;
  payload: T;
  unlocked?: boolean;
}

// --- Tipos de juego discriminados ---
export interface JuegoFinancieroBase<T, L = NivelBase<T>> {
  id: string | number;
  type: string;
  title: string;
  points: number;
  timeLimitSec: number;
  payload: T;
  levels?: L[];
  unlocked?: boolean;
  image?: string;
}

// True/False
export type NivelTF = NivelBase<TrueFalsePayload>;
export type JuegoFinancieroTF = JuegoFinancieroBase<TrueFalsePayload, NivelTF> & { type: "true_false" };

// QuizMC
export type NivelQuizMC = NivelBase<QuizMCPayload>;
export type JuegoFinancieroQuizMC = JuegoFinancieroBase<QuizMCPayload, NivelQuizMC> & { type: "quiz_mc" };

// Categorize
export type NivelCategorize = NivelBase<CategorizePayload>;
export type JuegoFinancieroCategorize = JuegoFinancieroBase<CategorizePayload, NivelCategorize> & { type: "categorize" };

// Budget
export type NivelBudget = NivelBase<BudgetPayload>;
export type JuegoFinancieroBudget = JuegoFinancieroBase<BudgetPayload, NivelBudget> & { type: "budget" };

// Decision
export type NivelDecision = NivelBase<DecisionPayload>;
export type JuegoFinancieroDecision = JuegoFinancieroBase<DecisionPayload, NivelDecision> & { type: "decision" };

// --- Unión de todos los juegos ---
export type JuegoFinanciero =
  | JuegoFinancieroTF
  | JuegoFinancieroQuizMC
  | JuegoFinancieroCategorize
  | JuegoFinancieroBudget
  | JuegoFinancieroDecision;
