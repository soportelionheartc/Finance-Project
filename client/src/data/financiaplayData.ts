// ============================================================
// FinanciaPlay v2.0 — Game Data & TypeScript Types
// ============================================================

// --- Interfaces ---

export interface Topic {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

export interface Level {
  id: string;
  name: string;
  badge: string;
  color: string;
  darkColor: string;
  description: string;
  topics: Topic[];
}

export interface PlacementQuestion {
  q: string;
  opts: string[];
  correct: number;
  level: number;
  topic: string;
}

export interface QuizQuestion {
  q: string;
  opts: string[];
  correct: number;
  explain: string;
}

export interface TrueFalseStatement {
  q: string;
  answer: boolean;
  explain: string;
}

export interface CategoryItem {
  label: string;
  cat: string;
}

export interface Category {
  key: string;
  label: string;
}

export interface Scenario {
  text: string;
  opts: string[];
  correct: number;
  explain: string;
}

export interface MatchPair {
  left: string;
  right: string;
}

export interface Game {
  id: string;
  type: "quiz_mc" | "true_false" | "categorize" | "decision" | "match";
  title: string;
  points: number;
  timeSec: number;
  topic: string;
  icon: string;
  questions?: QuizQuestion[];
  statements?: TrueFalseStatement[];
  categories?: Category[];
  items?: CategoryItem[];
  scenarios?: Scenario[];
  pairs?: MatchPair[];
}

export interface Badge {
  id: string;
  title: string;
  criteria: string;
}

// --- Curriculum ---

export const CURRICULUM: Record<string, Level> = {
  level1: {
    id: "L1",
    name: "Fundamentos Financieros",
    badge: "🌱",
    color: "#00C896",
    darkColor: "#009e77",
    description: "Dinero, presupuesto, ahorro, crédito y primeros pasos",
    topics: [
      { id: "L1T1", name: "¿Qué es el dinero?", icon: "💵", desc: "Funciones, tipos y valor del dinero" },
      { id: "L1T2", name: "Presupuesto personal", icon: "📋", desc: "Regla 50/30/20, ingresos vs gastos" },
      { id: "L1T3", name: "Fondo de emergencia", icon: "🛡️", desc: "Por qué tener 3–6 meses de reserva" },
      { id: "L1T4", name: "Ahorro e interés compuesto", icon: "📈", desc: "Cómo crece el dinero con el tiempo" },
      { id: "L1T5", name: "Deuda y crédito", icon: "💳", desc: "Tipos de crédito, tasas, historial" },
      { id: "L1T6", name: "Seguros básicos", icon: "☂️", desc: "Vida, salud, automóvil" },
      { id: "L1T7", name: "Pensión y jubilación", icon: "🧓", desc: "Sistemas pensionales, ahorro temprano" },
      { id: "L1T8", name: "Metas financieras", icon: "🎯", desc: "Corto, mediano y largo plazo" },
    ],
  },
  level2: {
    id: "L2",
    name: "Inversiones & Mercados",
    badge: "📊",
    color: "#3B82F6",
    darkColor: "#2563eb",
    description: "Renta fija, renta variable, fondos, riesgo y portafolios",
    topics: [
      { id: "L2T1", name: "Riesgo y retorno", icon: "⚖️", desc: "Relación riesgo-rendimiento, perfil inversor" },
      { id: "L2T2", name: "Renta fija", icon: "🏦", desc: "Bonos del gobierno y corporativos, TES, CDT" },
      { id: "L2T3", name: "Renta variable", icon: "📉", desc: "Acciones, dividendos, análisis fundamental" },
      { id: "L2T4", name: "Fondos de inversión", icon: "🧺", desc: "FIC, ETF, fondos indexados" },
      { id: "L2T5", name: "Diversificación", icon: "🌐", desc: "Teoría de portafolio de Markowitz" },
      { id: "L2T6", name: "Análisis técnico", icon: "🔍", desc: "Velas, soportes, resistencias, indicadores" },
      { id: "L2T7", name: "Criptoactivos", icon: "₿", desc: "Bitcoin, blockchain, DeFi, riesgos" },
      { id: "L2T8", name: "Valoración de empresas", icon: "🏢", desc: "P/E, EV/EBITDA, flujo de caja descontado" },
    ],
  },
  level3: {
    id: "L3",
    name: "Mercados de Capitales & Derivados",
    badge: "🏆",
    color: "#F59E0B",
    darkColor: "#d97706",
    description: "El nivel del analista experto: derivados, estructurados, política monetaria y gestión de riesgo institucional",
    topics: [
      { id: "L3T1", name: "Estructura de mercados", icon: "🏛️", desc: "Mercados primario/secundario, OTC vs bolsa, market makers" },
      { id: "L3T2", name: "Derivados: Futuros & Forwards", icon: "📅", desc: "Contratos a plazo, pricing, base, roll-over" },
      { id: "L3T3", name: "Opciones financieras", icon: "🎲", desc: "Call/Put, Greeks (Delta, Gamma, Vega, Theta), Black-Scholes" },
      { id: "L3T4", name: "Swaps & Estructurados", icon: "🔄", desc: "IRS, CDS, notas estructuradas, CLO/CDO" },
      { id: "L3T5", name: "Riesgo de mercado", icon: "📐", desc: "VaR, CVaR, stress testing, FRTB" },
      { id: "L3T6", name: "Renta fija avanzada", icon: "📏", desc: "Duration, convexity, curva de rendimientos, spreads" },
      { id: "L3T7", name: "Política monetaria", icon: "🏛️", desc: "Fed, BCE, tasas de referencia, QE, transmisión" },
      { id: "L3T8", name: "Gestión de portafolios", icon: "🎯", desc: "CAPM, factor investing, alpha, beta, Sharpe ratio" },
      { id: "L3T9", name: "Mercado de divisas (FX)", icon: "💱", desc: "Spot, forward, carry trade, paridad de tasas" },
      { id: "L3T10", name: "Regulación financiera", icon: "📜", desc: "Basilea III, MiFID II, Dodd-Frank, supervisión" },
    ],
  },
};

// --- Placement Test ---

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // Muy fáciles (L1)
  { q: "¿Qué función principal tiene el dinero?", opts: ["Medio de cambio", "Fuente de energía", "Tipo de seguro", "Producto bancario"], correct: 0, level: 1, topic: "L1T1" },
  { q: "La regla 50/30/20 se refiere a:", opts: ["Años, meses, días", "Necesidades, gustos, ahorro", "Capital, interés, plazo", "Activos, pasivos, patrimonio"], correct: 1, level: 1, topic: "L1T2" },
  { q: "¿Cuántos meses de gastos se recomienda en un fondo de emergencia?", opts: ["1 mes", "3–6 meses", "12 meses", "24 meses"], correct: 1, level: 1, topic: "L1T3" },
  // Intermedios (L2)
  { q: "El interés compuesto capitaliza:", opts: ["Solo el capital inicial", "Intereses sobre intereses", "Solo los depósitos nuevos", "El saldo negativo"], correct: 1, level: 1, topic: "L1T4" },
  { q: "Un ETF es:", opts: ["Un seguro de vida", "Un fondo cotizado en bolsa", "Un tipo de crédito hipotecario", "Un impuesto al valor"], correct: 1, level: 2, topic: "L2T4" },
  { q: "La diversificación de portafolio reduce principalmente el riesgo:", opts: ["Sistémico", "No sistemático (idiosincrático)", "De tasa de interés", "Político"], correct: 1, level: 2, topic: "L2T5" },
  { q: "El análisis fundamental busca determinar:", opts: ["El patrón gráfico de precios", "El valor intrínseco de una empresa", "La volatilidad implícita", "Los niveles de soporte"], correct: 1, level: 2, topic: "L2T3" },
  // Difíciles (L3)
  { q: "La 'Delta' de una opción representa:", opts: ["La tasa libre de riesgo", "La sensibilidad del precio al precio del subyacente", "El tiempo hasta el vencimiento", "La volatilidad histórica"], correct: 1, level: 3, topic: "L3T3" },
  { q: "Value at Risk (VaR) al 95% significa:", opts: ["La pérdida máxima posible", "La pérdida que no se supera el 95% de los días", "El retorno mínimo garantizado", "El capital regulatorio requerido"], correct: 1, level: 3, topic: "L3T5" },
  { q: "Un Interest Rate Swap (IRS) intercambia:", opts: ["Divisas a tipo de cambio fijo", "Flujos de tasa fija por tasa variable", "Acciones por bonos", "Contratos de futuros por opciones"], correct: 1, level: 3, topic: "L3T4" },
  { q: "La convexidad en renta fija describe:", opts: ["La curvatura de la relación precio-rendimiento", "El spread crediticio del emisor", "La correlación entre activos", "El riesgo de liquidación"], correct: 0, level: 3, topic: "L3T6" },
  { q: "El modelo Black-Scholes asume:", opts: ["Volatilidad estocástica y saltos en precios", "Volatilidad constante y movimiento browniano geométrico", "Distribución t de Student de retornos", "Correlación perfecta entre activos"], correct: 1, level: 3, topic: "L3T3" },
];

// --- Games by Level ---

export const GAMES_BY_LEVEL: Record<string, Game[]> = {
  L1: [
    {
      id: "L1G1", type: "quiz_mc", title: "¿Qué sabes del dinero?", points: 100, timeSec: 90,
      topic: "L1T1", icon: "💵",
      questions: [
        { q: "¿Cuáles son las tres funciones del dinero?", opts: ["Medio de cambio, depósito de valor, unidad de cuenta", "Ahorro, crédito, inversión", "Oro, plata, papel", "Ingreso, gasto, deuda"], correct: 0, explain: "El dinero funciona como medio de intercambio, guarda valor en el tiempo y sirve para comparar precios (unidad de cuenta)." },
        { q: "La inflación hace que el dinero:", opts: ["Valga más con el tiempo", "Pierda poder adquisitivo", "Genere intereses automáticamente", "Se convierta en activo real"], correct: 1, explain: "Con inflación, los mismos pesos compran menos bienes. Por eso es clave invertir para superar la inflación." },
        { q: "El dinero fiduciario se basa en:", opts: ["Reservas de oro", "La confianza en el Estado emisor", "Materias primas físicas", "Blockchain"], correct: 1, explain: "Desde 1971 (Nixon Shock) las monedas modernas no están respaldadas en oro sino en la confianza institucional." },
      ],
    },
    {
      id: "L1G2", type: "true_false", title: "Mitos del presupuesto", points: 80, timeSec: 60,
      topic: "L1T2", icon: "📋",
      statements: [
        { q: "Gastar menos de lo que ganas es condición necesaria para ahorrar.", answer: true, explain: "Sin superávit de flujo no hay ahorro posible. Ingresos > Gastos = base de la salud financiera." },
        { q: "El presupuesto personal solo sirve para personas con salario bajo.", answer: false, explain: "El presupuesto es herramienta universal: millonarios y empresas lo usan. Es la hoja de ruta del dinero." },
        { q: "La regla 50/30/20 es rígida e inamovible.", answer: false, explain: "Es una guía orientadora. Según tu contexto puede ser 60/20/20 o incluso 40/20/40 si tienes altos ingresos." },
      ],
    },
    {
      id: "L1G3", type: "categorize", title: "Clasifica tus gastos", points: 120, timeSec: 120,
      topic: "L1T2", icon: "🗂️",
      categories: [{ key: "needs", label: "Necesidades 🏠" }, { key: "wants", label: "Gustos 🎉" }, { key: "saving", label: "Ahorro/Deuda 💰" }],
      items: [
        { label: "Arriendo / hipoteca", cat: "needs" }, { label: "Supermercado básico", cat: "needs" },
        { label: "Servicios públicos", cat: "needs" }, { label: "Transporte al trabajo", cat: "needs" },
        { label: "Suscripción streaming", cat: "wants" }, { label: "Restaurante de lujo", cat: "wants" },
        { label: "Ropa de marca", cat: "wants" }, { label: "Videojuegos", cat: "wants" },
        { label: "CDT / fondo de ahorro", cat: "saving" }, { label: "Abono a deuda", cat: "saving" },
      ],
    },
    {
      id: "L1G4", type: "decision", title: "Decisiones inteligentes", points: 130, timeSec: 120,
      topic: "L1T4", icon: "🧠",
      scenarios: [
        { text: "Tienes $3M disponibles. ¿No tienes fondo de emergencia ni deudas. Qué haces?", opts: ["Gasto en vacaciones", "Lo invierto inmediatamente en crypto", "Construyo el fondo de emergencia primero"], correct: 2, explain: "El fondo de emergencia es el primer pilar. Sin él, cualquier imprevisto destruye tu plan financiero." },
        { text: "Deuda al 36% E.A. vs CDT al 9% E.A. ¿Qué priorizas?", opts: ["Seguir ahorrando en CDT", "Pagar la deuda primero", "Mitad y mitad"], correct: 1, explain: "El costo de la deuda (36%) supera ampliamente el retorno del CDT (9%). Cada peso en deuda 'rinde' 36%." },
      ],
    },
    {
      id: "L1G5", type: "match", title: "Conecta conceptos", points: 110, timeSec: 90,
      topic: "L1T4", icon: "🔗",
      pairs: [
        { left: "Interés compuesto", right: "Interés sobre interés acumulado" },
        { left: "Inflación", right: "Pérdida de poder adquisitivo" },
        { left: "Fondo emergencia", right: "3 a 6 meses de gastos" },
        { left: "50/30/20", right: "Necesidades, gustos, ahorro" },
      ],
    },
  ],
  L2: [
    {
      id: "L2G1", type: "quiz_mc", title: "Riesgo y Retorno", points: 120, timeSec: 90,
      topic: "L2T1", icon: "⚖️",
      questions: [
        { q: "Un inversor 'conservador' privilegia:", opts: ["Alta rentabilidad a cualquier costo", "Seguridad del capital sobre el retorno", "Activos de alta volatilidad", "Derivados apalancados"], correct: 1, explain: "El perfil conservador prioriza preservar el capital, acepta menor rendimiento a cambio de estabilidad." },
        { q: "La relación riesgo-retorno indica que:", opts: ["Mayor riesgo siempre trae mayor ganancia", "Mayor riesgo potencial acompaña mayor retorno esperado", "Los activos seguros pagan más", "No hay relación entre riesgo y retorno"], correct: 1, explain: "Es un principio fundamental: para aspirar a mayor rendimiento hay que asumir mayor riesgo. No es garantía, es potencial." },
        { q: "El riesgo sistémico es aquel que:", opts: ["Se puede eliminar diversificando", "Afecta a todo el mercado (no se diversifica)", "Solo afecta a una empresa", "Es controlado por el inversor"], correct: 1, explain: "Crisis de 2008, COVID-19, subidas de tasas: son riesgos sistémicos que golpean a todos los activos." },
      ],
    },
    {
      id: "L2G2", type: "true_false", title: "Renta Fija: Mitos y Realidades", points: 90, timeSec: 70,
      topic: "L2T2", icon: "🏦",
      statements: [
        { q: "Cuando suben las tasas de interés, los precios de los bonos bajan.", answer: true, explain: "Relación inversa fundamental. Si emiten bonos nuevos a tasa más alta, los viejos (tasa menor) valen menos." },
        { q: "Un CDT en Colombia tiene riesgo de mercado igual que un bono corporativo.", answer: false, explain: "El CDT tiene riesgo de crédito del banco emisor (cubierto por Fogafin hasta cierto monto) pero no riesgo de precio de mercado si se mantiene al vencimiento." },
        { q: "Los TES son bonos emitidos por el Gobierno Nacional de Colombia.", answer: true, explain: "Los Títulos de Tesorería (TES) son la principal fuente de financiación del Estado colombiano en el mercado doméstico." },
      ],
    },
    {
      id: "L2G3", type: "categorize", title: "Clasifica los activos", points: 130, timeSec: 110,
      topic: "L2T3", icon: "📂",
      categories: [{ key: "rf", label: "Renta Fija 🏦" }, { key: "rv", label: "Renta Variable 📈" }, { key: "alt", label: "Alternativos 🌐" }],
      items: [
        { label: "TES Colombia", cat: "rf" }, { label: "Bono corporativo Ecopetrol", cat: "rf" },
        { label: "Acción Bancolombia", cat: "rv" }, { label: "ETF S&P 500", cat: "rv" },
        { label: "CDT Bancolombia 180d", cat: "rf" }, { label: "Bitcoin", cat: "alt" },
        { label: "Fondo inmobiliario (REIT)", cat: "alt" }, { label: "Acción Apple (AAPL)", cat: "rv" },
      ],
    },
    {
      id: "L2G4", type: "quiz_mc", title: "Análisis Técnico & Fundamental", points: 140, timeSec: 100,
      topic: "L2T6", icon: "🔍",
      questions: [
        { q: "El P/E ratio (precio/ganancia) indica:", opts: ["Cuánto paga el mercado por cada peso de utilidad", "El precio de la acción menos dividendos", "La deuda sobre el patrimonio", "El margen operativo de la empresa"], correct: 0, explain: "Si P/E = 15, el mercado paga $15 por cada $1 de utilidad. Comparar con el sector da perspectiva de valoración." },
        { q: "Un soporte en análisis técnico es:", opts: ["Nivel de precio donde vendedores dominan", "Nivel de precio donde compradores frenan la caída", "La media móvil de 200 días", "El máximo histórico del activo"], correct: 1, explain: "El soporte es un 'piso' donde históricamente los compradores aparecen y detienen la caída del precio." },
        { q: "El indicador RSI mide:", opts: ["Volumen relativo de transacciones", "Velocidad y magnitud de los cambios de precio", "Correlación entre dos activos", "El spread bid-ask"], correct: 1, explain: "El RSI (Relative Strength Index) oscila entre 0-100. Por encima de 70 suele indicar sobrecompra; debajo de 30, sobreventa." },
      ],
    },
    {
      id: "L2G5", type: "match", title: "Vocabulario del Inversionista", points: 110, timeSec: 90,
      topic: "L2T5", icon: "📚",
      pairs: [
        { left: "Beta", right: "Sensibilidad al mercado general" },
        { left: "Sharpe Ratio", right: "Retorno ajustado por riesgo" },
        { left: "Correlación -1", right: "Activos se mueven en sentidos opuestos" },
        { left: "Frontera eficiente", right: "Máximo retorno para dado nivel de riesgo" },
      ],
    },
  ],
  L3: [
    {
      id: "L3G1", type: "quiz_mc", title: "Derivados Financieros", points: 160, timeSec: 100,
      topic: "L3T3", icon: "🎲",
      questions: [
        { q: "Una opción Call da el derecho (no obligación) de:", opts: ["Vender el subyacente al precio de ejercicio", "Comprar el subyacente al precio de ejercicio", "Intercambiar tasas de interés", "Entregar divisas a futuro"], correct: 1, explain: "El Call otorga el DERECHO de comprar. El comprador paga la prima; el vendedor tiene la OBLIGACIÓN de vender si se ejerce." },
        { q: "La 'Theta' de una opción representa:", opts: ["Cambio en delta por cambio en subyacente", "Pérdida de valor temporal diaria", "Sensibilidad a la volatilidad", "Sensibilidad a la tasa libre de riesgo"], correct: 1, explain: "Theta (θ) = decaimiento temporal. Cada día que pasa, sin otros cambios, una opción vale menos. Enemigo del comprador." },
        { q: "Un Forward sobre divisas permite:", opts: ["Comprar volatilidad futura", "Fijar hoy un tipo de cambio para una fecha futura", "Intercambiar tasas fija/variable", "Especular con índices de renta variable"], correct: 1, explain: "El forward FX elimina la incertidumbre cambiaria: empresa exportadora fija el tipo de cambio hoy para la entrega futura." },
      ],
    },
    {
      id: "L3G2", type: "true_false", title: "Riesgo Institucional & VaR", points: 130, timeSec: 80,
      topic: "L3T5", icon: "📐",
      statements: [
        { q: "El VaR al 99% para 1 día de $1M significa que hay 1% de probabilidad de perder más de $1M en un día.", answer: true, explain: "VaR(99%, 1d) = $1M → solo 1 de cada 100 días esperamos pérdidas mayores. Es el cuantil 1% de la distribución de pérdidas." },
        { q: "El CVaR (Expected Shortfall) es siempre menor o igual al VaR.", answer: false, explain: "CVaR es la pérdida ESPERADA dado que se supera el VaR. Siempre es mayor. Captura el riesgo de cola que VaR ignora." },
        { q: "Basilea III aumentó los requerimientos de capital para los bancos.", answer: true, explain: "Tras la crisis de 2008, Basilea III exige más capital de alta calidad (Tier 1), colchones anticíclicos y ratios de liquidez (LCR, NSFR)." },
      ],
    },
    {
      id: "L3G3", type: "quiz_mc", title: "Renta Fija Avanzada", points: 150, timeSec: 100,
      topic: "L3T6", icon: "📏",
      questions: [
        { q: "La Duration de Macaulay mide:", opts: ["La tasa cupón del bono", "El vencimiento promedio ponderado de los flujos", "El spread crediticio sobre la tasa libre de riesgo", "La convexidad del precio"], correct: 1, explain: "Duration = tiempo promedio en que se reciben los flujos ponderado por su valor presente. Bono cero-cupón: Duration = Plazo." },
        { q: "Si la curva de rendimientos se invierte (pendiente negativa):", opts: ["Señala expansión económica robusta", "Históricamente anticipa recesión", "Indica que los bancos centrales compran bonos cortos", "No tiene implicaciones macroeconómicas"], correct: 1, explain: "Curva invertida (corto paga más que largo) ha precedido a las últimas 7 recesiones en EE.UU. Es el indicador adelantado más citado." },
        { q: "El spread Z (Z-spread) de un bono corporativo representa:", opts: ["La diferencia entre precio sucio y limpio", "La sobretasa constante sobre la curva swap", "El haircut aplicado en repos", "La correlación con la tasa de política monetaria"], correct: 1, explain: "Z-spread = bps adicionales sobre toda la curva de tasas swap que igualan el VPN del bono a su precio de mercado. Mide riesgo crediticio." },
      ],
    },
    {
      id: "L3G4", type: "decision", title: "Decisiones de Portafolio Institucional", points: 180, timeSec: 140,
      topic: "L3T8", icon: "🎯",
      scenarios: [
        { text: "Un fondo de pensiones debe reducir duración del portafolio. ¿Cuál instrumento utiliza?", opts: ["Comprar bonos de largo plazo", "Vender futuros de tasas de interés (TBond futures)", "Aumentar posición en acciones de dividendo", "Emitir papel comercial"], correct: 1, explain: "Futuros de renta fija permiten ajustar la duración sintéticamente sin vender el portafolio físico. Eficiente, rápido y de bajo costo de transacción." },
        { text: "Empresa colombiana tiene deuda en USD. ¿Cómo cubre el riesgo cambiario?", opts: ["No hacer nada, espera que el peso se aprecie", "Comprar un Cross Currency Swap (CCS) COP/USD", "Invertir todo en dólares físicos", "Emitir más deuda en pesos para compensar"], correct: 1, explain: "Un CCS intercambia flujos en USD por COP a tipos pactados, eliminando la exposición cambiaria. Herramienta estándar de tesorería corporativa." },
      ],
    },
    {
      id: "L3G5", type: "match", title: "Greeks & Derivados Avanzados", points: 160, timeSec: 100,
      topic: "L3T3", icon: "🔬",
      pairs: [
        { left: "Delta (Δ)", right: "Sensibilidad precio opción / precio subyacente" },
        { left: "Gamma (Γ)", right: "Tasa de cambio del delta" },
        { left: "Vega (ν)", right: "Sensibilidad a la volatilidad implícita" },
        { left: "Rho (ρ)", right: "Sensibilidad a la tasa de interés libre de riesgo" },
      ],
    },
    {
      id: "L3G6", type: "quiz_mc", title: "Política Monetaria & Macro", points: 140, timeSec: 90,
      topic: "L3T7", icon: "🏛️",
      questions: [
        { q: "El Quantitative Easing (QE) consiste en:", opts: ["Subir tasas de interés rápidamente", "Compra de activos por el banco central para inyectar liquidez", "Reducir el encaje bancario al 0%", "Emitir moneda digital por el banco central"], correct: 1, explain: "QE: el banco central compra bonos (gubernamentales, MBS) expandiendo su balance. Baja tasas largas, estimula crédito y activos de riesgo." },
        { q: "La regla de Taylor determina:", opts: ["El precio justo de un bono corporativo", "La tasa de política monetaria óptima dado inflación y output gap", "El multiplicador fiscal del gasto público", "El nivel de reservas internacionales recomendado"], correct: 1, explain: "Regla de Taylor: tasa = r* + π + 0.5(π - π*) + 0.5(y - y*). Guía cuantitativa para la decisión de tasas del banco central." },
        { q: "El carry trade en FX explota:", opts: ["Diferencias en volatilidad implícita entre pares", "Diferencial de tasas de interés entre países", "Ineficiencias en el mercado spot", "Arbitraje de dividendos entre mercados"], correct: 1, explain: "Carry trade: fondear en moneda de baja tasa (JPY, CHF) e invertir en moneda de alta tasa (MXN, BRL). Rentable pero expuesto a reversiones bruscas." },
      ],
    },
  ],
};

// --- Badges ---

export const BADGES: Badge[] = [
  { id: "starter", title: "Primer Paso 🌱", criteria: "Completa cualquier juego por primera vez" },
  { id: "saver", title: "Ahorrador Consciente 💰", criteria: "Completa todos los juegos de Nivel 1" },
  { id: "investor", title: "Inversionista 📊", criteria: "Completa todos los juegos de Nivel 2" },
  { id: "expert", title: "Analista Experto 🏆", criteria: "Completa todos los juegos de Nivel 3" },
  { id: "quiz_master", title: "Maestro del Quiz 🧠", criteria: "100% en 3 quizzes distintos" },
  { id: "speed_demon", title: "Rayo ⚡", criteria: "Completa un juego con >50% del tiempo restante" },
  { id: "perfectionist", title: "Perfeccionista ✨", criteria: "Puntaje perfecto en todos los juegos de un nivel" },
];
