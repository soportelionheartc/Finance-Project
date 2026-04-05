import { useState, useEffect, useRef } from "react";

// ============================================================
// KNOWLEDGE CURRICULUM — 3 LEVELS
// Nivel 3 = Analista experto en mercados de capitales y derivados
// ============================================================
const CURRICULUM = {
  level1: {
    id: "L1",
    name: "Fundamentos Financieros",
    badge: "🌱",
    color: "#00C896",
    darkColor: "#009e77",
    description: "Dinero, presupuesto, ahorro, crédito y primeros pasos",
    topics: [
      {
        id: "L1T1",
        name: "¿Qué es el dinero?",
        icon: "💵",
        desc: "Funciones, tipos y valor del dinero",
      },
      {
        id: "L1T2",
        name: "Presupuesto personal",
        icon: "📋",
        desc: "Regla 50/30/20, ingresos vs gastos",
      },
      {
        id: "L1T3",
        name: "Fondo de emergencia",
        icon: "🛡️",
        desc: "Por qué tener 3–6 meses de reserva",
      },
      {
        id: "L1T4",
        name: "Ahorro e interés compuesto",
        icon: "📈",
        desc: "Cómo crece el dinero con el tiempo",
      },
      {
        id: "L1T5",
        name: "Deuda y crédito",
        icon: "💳",
        desc: "Tipos de crédito, tasas, historial",
      },
      {
        id: "L1T6",
        name: "Seguros básicos",
        icon: "☂️",
        desc: "Vida, salud, automóvil",
      },
      {
        id: "L1T7",
        name: "Pensión y jubilación",
        icon: "🧓",
        desc: "Sistemas pensionales, ahorro temprano",
      },
      {
        id: "L1T8",
        name: "Metas financieras",
        icon: "🎯",
        desc: "Corto, mediano y largo plazo",
      },
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
      {
        id: "L2T1",
        name: "Riesgo y retorno",
        icon: "⚖️",
        desc: "Relación riesgo-rendimiento, perfil inversor",
      },
      {
        id: "L2T2",
        name: "Renta fija",
        icon: "🏦",
        desc: "Bonos del gobierno y corporativos, TES, CDT",
      },
      {
        id: "L2T3",
        name: "Renta variable",
        icon: "📉",
        desc: "Acciones, dividendos, análisis fundamental",
      },
      {
        id: "L2T4",
        name: "Fondos de inversión",
        icon: "🧺",
        desc: "FIC, ETF, fondos indexados",
      },
      {
        id: "L2T5",
        name: "Diversificación",
        icon: "🌐",
        desc: "Teoría de portafolio de Markowitz",
      },
      {
        id: "L2T6",
        name: "Análisis técnico",
        icon: "🔍",
        desc: "Velas, soportes, resistencias, indicadores",
      },
      {
        id: "L2T7",
        name: "Criptoactivos",
        icon: "₿",
        desc: "Bitcoin, blockchain, DeFi, riesgos",
      },
      {
        id: "L2T8",
        name: "Valoración de empresas",
        icon: "🏢",
        desc: "P/E, EV/EBITDA, flujo de caja descontado",
      },
    ],
  },
  level3: {
    id: "L3",
    name: "Mercados de Capitales & Derivados",
    badge: "🏆",
    color: "#F59E0B",
    darkColor: "#d97706",
    description:
      "El nivel del analista experto: derivados, estructurados, política monetaria y gestión de riesgo institucional",
    topics: [
      {
        id: "L3T1",
        name: "Estructura de mercados",
        icon: "🏛️",
        desc: "Mercados primario/secundario, OTC vs bolsa, market makers",
      },
      {
        id: "L3T2",
        name: "Derivados: Futuros & Forwards",
        icon: "📅",
        desc: "Contratos a plazo, pricing, base, roll-over",
      },
      {
        id: "L3T3",
        name: "Opciones financieras",
        icon: "🎲",
        desc: "Call/Put, Greeks (Delta, Gamma, Vega, Theta), Black-Scholes",
      },
      {
        id: "L3T4",
        name: "Swaps & Estructurados",
        icon: "🔄",
        desc: "IRS, CDS, notas estructuradas, CLO/CDO",
      },
      {
        id: "L3T5",
        name: "Riesgo de mercado",
        icon: "📐",
        desc: "VaR, CVaR, stress testing, FRTB",
      },
      {
        id: "L3T6",
        name: "Renta fija avanzada",
        icon: "📏",
        desc: "Duration, convexity, curva de rendimientos, spreads",
      },
      {
        id: "L3T7",
        name: "Política monetaria",
        icon: "🏛️",
        desc: "Fed, BCE, tasas de referencia, QE, transmisión",
      },
      {
        id: "L3T8",
        name: "Gestión de portafolios",
        icon: "🎯",
        desc: "CAPM, factor investing, alpha, beta, Sharpe ratio",
      },
      {
        id: "L3T9",
        name: "Mercado de divisas (FX)",
        icon: "💱",
        desc: "Spot, forward, carry trade, paridad de tasas",
      },
      {
        id: "L3T10",
        name: "Regulación financiera",
        icon: "📜",
        desc: "Basilea III, MiFID II, Dodd-Frank, supervisión",
      },
    ],
  },
};

// ============================================================
// PLACEMENT TEST — mezcla fácil → muy difícil
// ============================================================
const PLACEMENT_QUESTIONS = [
  // Muy fáciles (L1)
  {
    q: "¿Qué función principal tiene el dinero?",
    opts: [
      "Medio de cambio",
      "Fuente de energía",
      "Tipo de seguro",
      "Producto bancario",
    ],
    correct: 0,
    level: 1,
    topic: "L1T1",
  },
  {
    q: "La regla 50/30/20 se refiere a:",
    opts: [
      "Años, meses, días",
      "Necesidades, gustos, ahorro",
      "Capital, interés, plazo",
      "Activos, pasivos, patrimonio",
    ],
    correct: 1,
    level: 1,
    topic: "L1T2",
  },
  {
    q: "¿Cuántos meses de gastos se recomienda en un fondo de emergencia?",
    opts: ["1 mes", "3–6 meses", "12 meses", "24 meses"],
    correct: 1,
    level: 1,
    topic: "L1T3",
  },
  // Intermedios (L2)
  {
    q: "El interés compuesto capitaliza:",
    opts: [
      "Solo el capital inicial",
      "Intereses sobre intereses",
      "Solo los depósitos nuevos",
      "El saldo negativo",
    ],
    correct: 1,
    level: 1,
    topic: "L1T4",
  },
  {
    q: "Un ETF es:",
    opts: [
      "Un seguro de vida",
      "Un fondo cotizado en bolsa",
      "Un tipo de crédito hipotecario",
      "Un impuesto al valor",
    ],
    correct: 1,
    level: 2,
    topic: "L2T4",
  },
  {
    q: "La diversificación de portafolio reduce principalmente el riesgo:",
    opts: [
      "Sistémico",
      "No sistemático (idiosincrático)",
      "De tasa de interés",
      "Político",
    ],
    correct: 1,
    level: 2,
    topic: "L2T5",
  },
  {
    q: "El análisis fundamental busca determinar:",
    opts: [
      "El patrón gráfico de precios",
      "El valor intrínseco de una empresa",
      "La volatilidad implícita",
      "Los niveles de soporte",
    ],
    correct: 1,
    level: 2,
    topic: "L2T3",
  },
  // Difíciles (L3)
  {
    q: "La 'Delta' de una opción representa:",
    opts: [
      "La tasa libre de riesgo",
      "La sensibilidad del precio al precio del subyacente",
      "El tiempo hasta el vencimiento",
      "La volatilidad histórica",
    ],
    correct: 1,
    level: 3,
    topic: "L3T3",
  },
  {
    q: "Value at Risk (VaR) al 95% significa:",
    opts: [
      "La pérdida máxima posible",
      "La pérdida que no se supera el 95% de los días",
      "El retorno mínimo garantizado",
      "El capital regulatorio requerido",
    ],
    correct: 1,
    level: 3,
    topic: "L3T5",
  },
  {
    q: "Un Interest Rate Swap (IRS) intercambia:",
    opts: [
      "Divisas a tipo de cambio fijo",
      "Flujos de tasa fija por tasa variable",
      "Acciones por bonos",
      "Contratos de futuros por opciones",
    ],
    correct: 1,
    level: 3,
    topic: "L3T4",
  },
  {
    q: "La convexidad en renta fija describe:",
    opts: [
      "La curvatura de la relación precio-rendimiento",
      "El spread crediticio del emisor",
      "La correlación entre activos",
      "El riesgo de liquidación",
    ],
    correct: 0,
    level: 3,
    topic: "L3T6",
  },
  {
    q: "El modelo Black-Scholes asume:",
    opts: [
      "Volatilidad estocástica y saltos en precios",
      "Volatilidad constante y movimiento browniano geométrico",
      "Distribución t de Student de retornos",
      "Correlación perfecta entre activos",
    ],
    correct: 1,
    level: 3,
    topic: "L3T3",
  },
];

// ============================================================
// GAME CONTENT PER LEVEL (rich & varied)
// ============================================================
const GAMES_BY_LEVEL = {
  L1: [
    {
      id: "L1G1",
      type: "quiz_mc",
      title: "¿Qué sabes del dinero?",
      points: 100,
      timeSec: 90,
      topic: "L1T1",
      icon: "💵",
      questions: [
        {
          q: "¿Cuáles son las tres funciones del dinero?",
          opts: [
            "Medio de cambio, depósito de valor, unidad de cuenta",
            "Ahorro, crédito, inversión",
            "Oro, plata, papel",
            "Ingreso, gasto, deuda",
          ],
          correct: 0,
          explain:
            "El dinero funciona como medio de intercambio, guarda valor en el tiempo y sirve para comparar precios (unidad de cuenta).",
        },
        {
          q: "La inflación hace que el dinero:",
          opts: [
            "Valga más con el tiempo",
            "Pierda poder adquisitivo",
            "Genere intereses automáticamente",
            "Se convierta en activo real",
          ],
          correct: 1,
          explain:
            "Con inflación, los mismos pesos compran menos bienes. Por eso es clave invertir para superar la inflación.",
        },
        {
          q: "El dinero fiduciario se basa en:",
          opts: [
            "Reservas de oro",
            "La confianza en el Estado emisor",
            "Materias primas físicas",
            "Blockchain",
          ],
          correct: 1,
          explain:
            "Desde 1971 (Nixon Shock) las monedas modernas no están respaldadas en oro sino en la confianza institucional.",
        },
      ],
    },
    {
      id: "L1G2",
      type: "true_false",
      title: "Mitos del presupuesto",
      points: 80,
      timeSec: 60,
      topic: "L1T2",
      icon: "📋",
      statements: [
        {
          q: "Gastar menos de lo que ganas es condición necesaria para ahorrar.",
          answer: true,
          explain:
            "Sin superávit de flujo no hay ahorro posible. Ingresos > Gastos = base de la salud financiera.",
        },
        {
          q: "El presupuesto personal solo sirve para personas con salario bajo.",
          answer: false,
          explain:
            "El presupuesto es herramienta universal: millonarios y empresas lo usan. Es la hoja de ruta del dinero.",
        },
        {
          q: "La regla 50/30/20 es rígida e inamovible.",
          answer: false,
          explain:
            "Es una guía orientadora. Según tu contexto puede ser 60/20/20 o incluso 40/20/40 si tienes altos ingresos.",
        },
      ],
    },
    {
      id: "L1G3",
      type: "categorize",
      title: "Clasifica tus gastos",
      points: 120,
      timeSec: 120,
      topic: "L1T2",
      icon: "🗂️",
      categories: [
        { key: "needs", label: "Necesidades 🏠" },
        { key: "wants", label: "Gustos 🎉" },
        { key: "saving", label: "Ahorro/Deuda 💰" },
      ],
      items: [
        { label: "Arriendo / hipoteca", cat: "needs" },
        { label: "Supermercado básico", cat: "needs" },
        { label: "Servicios públicos", cat: "needs" },
        { label: "Transporte al trabajo", cat: "needs" },
        { label: "Suscripción streaming", cat: "wants" },
        { label: "Restaurante de lujo", cat: "wants" },
        { label: "Ropa de marca", cat: "wants" },
        { label: "Videojuegos", cat: "wants" },
        { label: "CDT / fondo de ahorro", cat: "saving" },
        { label: "Abono a deuda", cat: "saving" },
      ],
    },
    {
      id: "L1G4",
      type: "decision",
      title: "Decisiones inteligentes",
      points: 130,
      timeSec: 120,
      topic: "L1T4",
      icon: "🧠",
      scenarios: [
        {
          text: "Tienes $3M disponibles. ¿No tienes fondo de emergencia ni deudas. Qué haces?",
          opts: [
            "Gasto en vacaciones",
            "Lo invierto inmediatamente en crypto",
            "Construyo el fondo de emergencia primero",
          ],
          correct: 2,
          explain:
            "El fondo de emergencia es el primer pilar. Sin él, cualquier imprevisto destruye tu plan financiero.",
        },
        {
          text: "Deuda al 36% E.A. vs CDT al 9% E.A. ¿Qué priorizas?",
          opts: [
            "Seguir ahorrando en CDT",
            "Pagar la deuda primero",
            "Mitad y mitad",
          ],
          correct: 1,
          explain:
            "El costo de la deuda (36%) supera ampliamente el retorno del CDT (9%). Cada peso en deuda 'rinde' 36%.",
        },
      ],
    },
    {
      id: "L1G5",
      type: "match",
      title: "Conecta conceptos",
      points: 110,
      timeSec: 90,
      topic: "L1T4",
      icon: "🔗",
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
      id: "L2G1",
      type: "quiz_mc",
      title: "Riesgo y Retorno",
      points: 120,
      timeSec: 90,
      topic: "L2T1",
      icon: "⚖️",
      questions: [
        {
          q: "Un inversor 'conservador' privilegia:",
          opts: [
            "Alta rentabilidad a cualquier costo",
            "Seguridad del capital sobre el retorno",
            "Activos de alta volatilidad",
            "Derivados apalancados",
          ],
          correct: 1,
          explain:
            "El perfil conservador prioriza preservar el capital, acepta menor rendimiento a cambio de estabilidad.",
        },
        {
          q: "La relación riesgo-retorno indica que:",
          opts: [
            "Mayor riesgo siempre trae mayor ganancia",
            "Mayor riesgo potencial acompaña mayor retorno esperado",
            "Los activos seguros pagan más",
            "No hay relación entre riesgo y retorno",
          ],
          correct: 1,
          explain:
            "Es un principio fundamental: para aspirar a mayor rendimiento hay que asumir mayor riesgo. No es garantía, es potencial.",
        },
        {
          q: "El riesgo sistémico es aquel que:",
          opts: [
            "Se puede eliminar diversificando",
            "Afecta a todo el mercado (no se diversifica)",
            "Solo afecta a una empresa",
            "Es controlado por el inversor",
          ],
          correct: 1,
          explain:
            "Crisis de 2008, COVID-19, subidas de tasas: son riesgos sistémicos que golpean a todos los activos.",
        },
      ],
    },
    {
      id: "L2G2",
      type: "true_false",
      title: "Renta Fija: Mitos y Realidades",
      points: 90,
      timeSec: 70,
      topic: "L2T2",
      icon: "🏦",
      statements: [
        {
          q: "Cuando suben las tasas de interés, los precios de los bonos bajan.",
          answer: true,
          explain:
            "Relación inversa fundamental. Si emiten bonos nuevos a tasa más alta, los viejos (tasa menor) valen menos.",
        },
        {
          q: "Un CDT en Colombia tiene riesgo de mercado igual que un bono corporativo.",
          answer: false,
          explain:
            "El CDT tiene riesgo de crédito del banco emisor (cubierto por Fogafin hasta cierto monto) pero no riesgo de precio de mercado si se mantiene al vencimiento.",
        },
        {
          q: "Los TES son bonos emitidos por el Gobierno Nacional de Colombia.",
          answer: true,
          explain:
            "Los Títulos de Tesorería (TES) son la principal fuente de financiación del Estado colombiano en el mercado doméstico.",
        },
      ],
    },
    {
      id: "L2G3",
      type: "categorize",
      title: "Clasifica los activos",
      points: 130,
      timeSec: 110,
      topic: "L2T3",
      icon: "📂",
      categories: [
        { key: "rf", label: "Renta Fija 🏦" },
        { key: "rv", label: "Renta Variable 📈" },
        { key: "alt", label: "Alternativos 🌐" },
      ],
      items: [
        { label: "TES Colombia", cat: "rf" },
        { label: "Bono corporativo Ecopetrol", cat: "rf" },
        { label: "Acción Bancolombia", cat: "rv" },
        { label: "ETF S&P 500", cat: "rv" },
        { label: "CDT Bancolombia 180d", cat: "rf" },
        { label: "Bitcoin", cat: "alt" },
        { label: "Fondo inmobiliario (REIT)", cat: "alt" },
        { label: "Acción Apple (AAPL)", cat: "rv" },
      ],
    },
    {
      id: "L2G4",
      type: "quiz_mc",
      title: "Análisis Técnico & Fundamental",
      points: 140,
      timeSec: 100,
      topic: "L2T6",
      icon: "🔍",
      questions: [
        {
          q: "El P/E ratio (precio/ganancia) indica:",
          opts: [
            "Cuánto paga el mercado por cada peso de utilidad",
            "El precio de la acción menos dividendos",
            "La deuda sobre el patrimonio",
            "El margen operativo de la empresa",
          ],
          correct: 0,
          explain:
            "Si P/E = 15, el mercado paga $15 por cada $1 de utilidad. Comparar con el sector da perspectiva de valoración.",
        },
        {
          q: "Un soporte en análisis técnico es:",
          opts: [
            "Nivel de precio donde vendedores dominan",
            "Nivel de precio donde compradores frenan la caída",
            "La media móvil de 200 días",
            "El máximo histórico del activo",
          ],
          correct: 1,
          explain:
            "El soporte es un 'piso' donde históricamente los compradores aparecen y detienen la caída del precio.",
        },
        {
          q: "El indicador RSI mide:",
          opts: [
            "Volumen relativo de transacciones",
            "Velocidad y magnitud de los cambios de precio",
            "Correlación entre dos activos",
            "El spread bid-ask",
          ],
          correct: 1,
          explain:
            "El RSI (Relative Strength Index) oscila entre 0-100. Por encima de 70 suele indicar sobrecompra; debajo de 30, sobreventa.",
        },
      ],
    },
    {
      id: "L2G5",
      type: "match",
      title: "Vocabulario del Inversionista",
      points: 110,
      timeSec: 90,
      topic: "L2T5",
      icon: "📚",
      pairs: [
        { left: "Beta", right: "Sensibilidad al mercado general" },
        { left: "Sharpe Ratio", right: "Retorno ajustado por riesgo" },
        {
          left: "Correlación -1",
          right: "Activos se mueven en sentidos opuestos",
        },
        {
          left: "Frontera eficiente",
          right: "Máximo retorno para dado nivel de riesgo",
        },
      ],
    },
  ],
  L3: [
    {
      id: "L3G1",
      type: "quiz_mc",
      title: "Derivados Financieros",
      points: 160,
      timeSec: 100,
      topic: "L3T3",
      icon: "🎲",
      questions: [
        {
          q: "Una opción Call da el derecho (no obligación) de:",
          opts: [
            "Vender el subyacente al precio de ejercicio",
            "Comprar el subyacente al precio de ejercicio",
            "Intercambiar tasas de interés",
            "Entregar divisas a futuro",
          ],
          correct: 1,
          explain:
            "El Call otorga el DERECHO de comprar. El comprador paga la prima; el vendedor tiene la OBLIGACIÓN de vender si se ejerce.",
        },
        {
          q: "La 'Theta' de una opción representa:",
          opts: [
            "Cambio en delta por cambio en subyacente",
            "Pérdida de valor temporal diaria",
            "Sensibilidad a la volatilidad",
            "Sensibilidad a la tasa libre de riesgo",
          ],
          correct: 1,
          explain:
            "Theta (θ) = decaimiento temporal. Cada día que pasa, sin otros cambios, una opción vale menos. Enemigo del comprador.",
        },
        {
          q: "Un Forward sobre divisas permite:",
          opts: [
            "Comprar volatilidad futura",
            "Fijar hoy un tipo de cambio para una fecha futura",
            "Intercambiar tasas fija/variable",
            "Especular con índices de renta variable",
          ],
          correct: 1,
          explain:
            "El forward FX elimina la incertidumbre cambiaria: empresa exportadora fija el tipo de cambio hoy para la entrega futura.",
        },
      ],
    },
    {
      id: "L3G2",
      type: "true_false",
      title: "Riesgo Institucional & VaR",
      points: 130,
      timeSec: 80,
      topic: "L3T5",
      icon: "📐",
      statements: [
        {
          q: "El VaR al 99% para 1 día de $1M significa que hay 1% de probabilidad de perder más de $1M en un día.",
          answer: true,
          explain:
            "VaR(99%, 1d) = $1M → solo 1 de cada 100 días esperamos pérdidas mayores. Es el cuantil 1% de la distribución de pérdidas.",
        },
        {
          q: "El CVaR (Expected Shortfall) es siempre menor o igual al VaR.",
          answer: false,
          explain:
            "CVaR es la pérdida ESPERADA dado que se supera el VaR. Siempre es mayor. Captura el riesgo de cola que VaR ignora.",
        },
        {
          q: "Basilea III aumentó los requerimientos de capital para los bancos.",
          answer: true,
          explain:
            "Tras la crisis de 2008, Basilea III exige más capital de alta calidad (Tier 1), colchones anticíclicos y ratios de liquidez (LCR, NSFR).",
        },
      ],
    },
    {
      id: "L3G3",
      type: "quiz_mc",
      title: "Renta Fija Avanzada",
      points: 150,
      timeSec: 100,
      topic: "L3T6",
      icon: "📏",
      questions: [
        {
          q: "La Duration de Macaulay mide:",
          opts: [
            "La tasa cupón del bono",
            "El vencimiento promedio ponderado de los flujos",
            "El spread crediticio sobre la tasa libre de riesgo",
            "La convexidad del precio",
          ],
          correct: 1,
          explain:
            "Duration = tiempo promedio en que se reciben los flujos ponderado por su valor presente. Bono cero-cupón: Duration = Plazo.",
        },
        {
          q: "Si la curva de rendimientos se invierte (pendiente negativa):",
          opts: [
            "Señala expansión económica robusta",
            "Históricamente anticipa recesión",
            "Indica que los bancos centrales compran bonos cortos",
            "No tiene implicaciones macroeconómicas",
          ],
          correct: 1,
          explain:
            "Curva invertida (corto paga más que largo) ha precedido a las últimas 7 recesiones en EE.UU. Es el indicador adelantado más citado.",
        },
        {
          q: "El spread Z (Z-spread) de un bono corporativo representa:",
          opts: [
            "La diferencia entre precio sucio y limpio",
            "La sobretasa constante sobre la curva swap",
            "El haircut aplicado en repos",
            "La correlación con la tasa de política monetaria",
          ],
          correct: 1,
          explain:
            "Z-spread = bps adicionales sobre toda la curva de tasas swap que igualan el VPN del bono a su precio de mercado. Mide riesgo crediticio.",
        },
      ],
    },
    {
      id: "L3G4",
      type: "decision",
      title: "Decisiones de Portafolio Institucional",
      points: 180,
      timeSec: 140,
      topic: "L3T8",
      icon: "🎯",
      scenarios: [
        {
          text: "Un fondo de pensiones debe reducir duración del portafolio. ¿Cuál instrumento utiliza?",
          opts: [
            "Comprar bonos de largo plazo",
            "Vender futuros de tasas de interés (TBond futures)",
            "Aumentar posición en acciones de dividendo",
            "Emitir papel comercial",
          ],
          correct: 1,
          explain:
            "Futuros de renta fija permiten ajustar la duración sintéticamente sin vender el portafolio físico. Eficiente, rápido y de bajo costo de transacción.",
        },
        {
          text: "Empresa colombiana tiene deuda en USD. ¿Cómo cubre el riesgo cambiario?",
          opts: [
            "No hacer nada, espera que el peso se aprecie",
            "Comprar un Cross Currency Swap (CCS) COP/USD",
            "Invertir todo en dólares físicos",
            "Emitir más deuda en pesos para compensar",
          ],
          correct: 1,
          explain:
            "Un CCS intercambia flujos en USD por COP a tipos pactados, eliminando la exposición cambiaria. Herramienta estándar de tesorería corporativa.",
        },
      ],
    },
    {
      id: "L3G5",
      type: "match",
      title: "Greeks & Derivados Avanzados",
      points: 160,
      timeSec: 100,
      topic: "L3T3",
      icon: "🔬",
      pairs: [
        {
          left: "Delta (Δ)",
          right: "Sensibilidad precio opción / precio subyacente",
        },
        { left: "Gamma (Γ)", right: "Tasa de cambio del delta" },
        { left: "Vega (ν)", right: "Sensibilidad a la volatilidad implícita" },
        {
          left: "Rho (ρ)",
          right: "Sensibilidad a la tasa de interés libre de riesgo",
        },
      ],
    },
    {
      id: "L3G6",
      type: "quiz_mc",
      title: "Política Monetaria & Macro",
      points: 140,
      timeSec: 90,
      topic: "L3T7",
      icon: "🏛️",
      questions: [
        {
          q: "El Quantitative Easing (QE) consiste en:",
          opts: [
            "Subir tasas de interés rápidamente",
            "Compra de activos por el banco central para inyectar liquidez",
            "Reducir el encaje bancario al 0%",
            "Emitir moneda digital por el banco central",
          ],
          correct: 1,
          explain:
            "QE: el banco central compra bonos (gubernamentales, MBS) expandiendo su balance. Baja tasas largas, estimula crédito y activos de riesgo.",
        },
        {
          q: "La regla de Taylor determina:",
          opts: [
            "El precio justo de un bono corporativo",
            "La tasa de política monetaria óptima dado inflación y output gap",
            "El multiplicador fiscal del gasto público",
            "El nivel de reservas internacionales recomendado",
          ],
          correct: 1,
          explain:
            "Regla de Taylor: tasa = r* + π + 0.5(π - π*) + 0.5(y - y*). Guía cuantitativa para la decisión de tasas del banco central.",
        },
        {
          q: "El carry trade en FX explota:",
          opts: [
            "Diferencias en volatilidad implícita entre pares",
            "Diferencial de tasas de interés entre países",
            "Ineficiencias en el mercado spot",
            "Arbitraje de dividendos entre mercados",
          ],
          correct: 1,
          explain:
            "Carry trade: fondear en moneda de baja tasa (JPY, CHF) e invertir en moneda de alta tasa (MXN, BRL). Rentable pero expuesto a reversiones bruscas.",
        },
      ],
    },
  ],
};

// ============================================================
// MAIN APP
// ============================================================
export default function FinanciaPlay() {
  const [screen, setScreen] = useState("home"); // home | placement | result | course | game | mini_lesson
  const [placementIdx, setPlacementIdx] = useState(0);
  const [placementAnswers, setPlacementAnswers] = useState([]);
  const [userProfile, setUserProfile] = useState(null); // { knowledgeLevel: 1|2|3, completedGames: [], xp: 0 }
  const [currentGame, setCurrentGame] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [miniLesson, setMiniLesson] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiContent, setAiContent] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  // Compute available levels and games for this user
  const availableLevels = userProfile
    ? getAvailableLevels(userProfile.knowledgeLevel)
    : [];

  function getAvailableLevels(kl) {
    const all = ["L1", "L2", "L3"];
    return all.slice(0, kl);
  }

  function computePlacementLevel(answers) {
    const levelScores = { 1: 0, 2: 0, 3: 0 };
    const levelCounts = { 1: 0, 2: 0, 3: 0 };
    answers.forEach((ans, i) => {
      const q = PLACEMENT_QUESTIONS[i];
      levelCounts[q.level]++;
      if (ans === q.correct) levelScores[q.level]++;
    });
    const pct3 = levelCounts[3] > 0 ? levelScores[3] / levelCounts[3] : 0;
    const pct2 = levelCounts[2] > 0 ? levelScores[2] / levelCounts[2] : 0;
    const pct1 = levelCounts[1] > 0 ? levelScores[1] / levelCounts[1] : 0;
    if (pct3 >= 0.6) return 3;
    if (pct2 >= 0.5 || (pct1 >= 0.8 && pct2 >= 0.3)) return 2;
    return 1;
  }

  // Timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  function handleTimeUp() {
    if (!gameState) return;
    setGameState((gs) => ({ ...gs, phase: "summary", timeUp: true }));
  }

  function startGame(game) {
    setCurrentGame(game);
    if (game.type === "quiz_mc") {
      setGameState({
        phase: "playing",
        qIdx: 0,
        answers: [],
        score: 0,
        feedback: null,
      });
    } else if (game.type === "true_false") {
      setGameState({
        phase: "playing",
        sIdx: 0,
        answers: [],
        score: 0,
        feedback: null,
      });
    } else if (game.type === "categorize") {
      const shuffled = [...game.items].sort(() => Math.random() - 0.5);
      setGameState({ phase: "playing", items: shuffled, placed: {}, score: 0 });
    } else if (game.type === "decision") {
      setGameState({
        phase: "playing",
        sIdx: 0,
        answers: [],
        score: 0,
        feedback: null,
      });
    } else if (game.type === "match") {
      const lefts = game.pairs.map((p, i) => ({ id: i, text: p.left }));
      const rights = [
        ...game.pairs.map((p, i) => ({ id: i, text: p.right })),
      ].sort(() => Math.random() - 0.5);
      setGameState({
        phase: "playing",
        lefts,
        rights,
        selected: null,
        matched: {},
        errors: 0,
        score: 0,
      });
    }
    setTimeLeft(game.timeSec);
    setScreen("game");
  }

  function finishGame(score, maxScore) {
    clearTimeout(timerRef.current);
    setTimeLeft(null);
    const xpGained = Math.round((score / maxScore) * currentGame.points);
    setUserProfile((p) => ({
      ...p,
      xp: p.xp + xpGained,
      completedGames: [...p.completedGames, currentGame.id],
    }));
    setGameState((gs) => ({
      ...gs,
      phase: "summary",
      finalScore: score,
      maxScore,
      xpGained,
    }));
  }

  async function fetchMiniLesson(topicId, levelId) {
    setAiLoading(true);
    setAiContent(null);
    setScreen("mini_lesson");
    const allTopics = [
      ...CURRICULUM.level1.topics,
      ...CURRICULUM.level2.topics,
      ...CURRICULUM.level3.topics,
    ];
    const topic = allTopics.find((t) => t.id === topicId);
    const levelKey =
      levelId === "L1" ? "level1" : levelId === "L2" ? "level2" : "level3";
    const level = CURRICULUM[levelKey];
    const prompt = `Eres un educador financiero experto. El usuario está aprendiendo sobre "${topic?.name}" (${topic?.desc}) en el nivel "${level.name}".

Genera una mini-lección educativa BREVE, DINÁMICA y GAMIFICADA en español con este formato JSON exacto (sin markdown, solo JSON puro):
{
  "emoji": "emoji relevante al tema",
  "title": "título atractivo de la lección",
  "hook": "1 dato sorprendente o pregunta intrigante de máximo 2 oraciones",
  "concept": "explicación clara del concepto en máximo 3 oraciones, con analogía simple",
  "example": "ejemplo práctico o caso real con números, máximo 3 oraciones",
  "keyFact": "1 hecho clave memorable de máximo 1 oración",
  "challenge": "1 mini-desafío de reflexión para el usuario (pregunta abierta)"
}

El lenguaje debe ser cercano, motivador y evitar jerga sin explicar. Si el nivel es L3 (experto), usa terminología técnica precisa con referencias a estándares internacionales (CFA, GARP, Basilea, etc.).`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content
        ?.map((c) => c.text || "")
        .join("")
        .trim();
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setAiContent(parsed);
    } catch (e) {
      setAiContent({
        emoji: "📚",
        title: topic?.name,
        hook: "Cargando contenido educativo...",
        concept: "Hubo un problema al cargar la lección. Intenta de nuevo.",
        example: "",
        keyFact: "",
        challenge: "",
      });
    }
    setAiLoading(false);
  }

  // ---- RENDER ----
  if (screen === "home")
    return <HomeScreen onStart={() => setScreen("placement")} />;
  if (screen === "placement")
    return (
      <PlacementScreen
        idx={placementIdx}
        answers={placementAnswers}
        onAnswer={(ans) => {
          const newAns = [...placementAnswers, ans];
          if (placementIdx + 1 >= PLACEMENT_QUESTIONS.length) {
            const kl = computePlacementLevel(newAns);
            setUserProfile({ knowledgeLevel: kl, completedGames: [], xp: 0 });
            setPlacementAnswers(newAns);
            setScreen("result");
          } else {
            setPlacementAnswers(newAns);
            setPlacementIdx((i) => i + 1);
          }
        }}
      />
    );
  if (screen === "result")
    return (
      <ResultScreen
        profile={userProfile}
        onContinue={() => setScreen("course")}
      />
    );
  if (screen === "course")
    return (
      <CourseScreen
        profile={userProfile}
        availableLevels={availableLevels}
        onStartGame={startGame}
        onMiniLesson={fetchMiniLesson}
        onRetest={() => {
          setPlacementIdx(0);
          setPlacementAnswers([]);
          setUserProfile(null);
          setScreen("placement");
        }}
      />
    );
  if (screen === "game")
    return (
      <GameScreen
        game={currentGame}
        gameState={gameState}
        timeLeft={timeLeft}
        setGameState={setGameState}
        onFinish={finishGame}
        onBack={() => {
          clearTimeout(timerRef.current);
          setTimeLeft(null);
          setScreen("course");
        }}
      />
    );
  if (screen === "mini_lesson")
    return (
      <MiniLessonScreen
        loading={aiLoading}
        content={aiContent}
        onBack={() => setScreen("course")}
        onPlayGame={() => {
          const levelKey = aiContent
            ? "L" +
              (CURRICULUM.level1.topics.find((t) => t.id === miniLesson)
                ? "1"
                : CURRICULUM.level2.topics.find((t) => t.id === miniLesson)
                  ? "2"
                  : "3")
            : null;
          setScreen("course");
        }}
      />
    );

  return null;
}

// ============================================================
// HOME SCREEN
// ============================================================
function HomeScreen({ onStart }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 50%, #0a0f1e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Georgia', serif",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative orbs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,200,150,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          right: "20%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ textAlign: "center", zIndex: 1, maxWidth: 600 }}>
        <div style={{ fontSize: 72, marginBottom: 8 }}>📈</div>
        <h1
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 8px",
            letterSpacing: "-2px",
            lineHeight: 1.1,
          }}
        >
          Financia<span style={{ color: "#00C896" }}>Play</span>
        </h1>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "1.15rem",
            marginBottom: 8,
            fontStyle: "italic",
          }}
        >
          De billetera a mercados de capitales — aprende jugando
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 32,
          }}
        >
          {["🌱 Fundamentos", "📊 Inversiones", "🏆 Derivados & Capitales"].map(
            (t, i) => (
              <span
                key={i}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 20,
                  padding: "6px 14px",
                  color: "#cbd5e1",
                  fontSize: "0.85rem",
                }}
              >
                {t}
              </span>
            ),
          )}
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            padding: "20px 28px",
            marginBottom: 32,
            textAlign: "left",
          }}
        >
          <p
            style={{
              color: "#e2e8f0",
              margin: 0,
              lineHeight: 1.7,
              fontSize: "0.95rem",
            }}
          >
            🎯 <strong style={{ color: "#00C896" }}>Test de diagnóstico</strong>{" "}
            adaptativo para ubicarte en tu nivel real
            <br />
            🎮 <strong style={{ color: "#3B82F6" }}>
              Juegos educativos
            </strong>{" "}
            dinámicos: quizzes, decisiones, retos
            <br />
            🤖 <strong style={{ color: "#F59E0B" }}>
              Lecciones con IA
            </strong>{" "}
            personalizadas para cada tema
            <br />
            🏆 <strong style={{ color: "#a78bfa" }}>3 niveles</strong> desde
            finanzas personales hasta derivados
          </p>
        </div>
        <button
          onClick={onStart}
          style={{
            background: "linear-gradient(135deg, #00C896, #00a07a)",
            color: "#fff",
            border: "none",
            borderRadius: 14,
            padding: "16px 48px",
            fontSize: "1.15rem",
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: 0.5,
            boxShadow: "0 8px 32px rgba(0,200,150,0.4)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.04)";
            e.target.style.boxShadow = "0 12px 40px rgba(0,200,150,0.55)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 8px 32px rgba(0,200,150,0.4)";
          }}
        >
          Comenzar Test →
        </button>
        <p style={{ color: "#475569", fontSize: "0.8rem", marginTop: 14 }}>
          ~3 minutos · 12 preguntas de diagnóstico
        </p>
      </div>
    </div>
  );
}

// ============================================================
// PLACEMENT SCREEN
// ============================================================
function PlacementScreen({ idx, answers, onAnswer }) {
  const q = PLACEMENT_QUESTIONS[idx];
  const total = PLACEMENT_QUESTIONS.length;
  const pct = (idx / total) * 100;
  const diffColor =
    q.level === 1 ? "#00C896" : q.level === 2 ? "#3B82F6" : "#F59E0B";
  const diffLabel =
    q.level === 1 ? "Básico" : q.level === 2 ? "Intermedio" : "Avanzado";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080d1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Georgia', serif",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 560 }}>
        {/* Progress */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
              Test de Diagnóstico
            </span>
            <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
              {idx + 1} / {total}
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: "#1e293b",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: "linear-gradient(90deg, #00C896, #3B82F6)",
                borderRadius: 3,
                transition: "width 0.4s",
              }}
            />
          </div>
        </div>

        {/* Difficulty badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              background: diffColor + "22",
              color: diffColor,
              border: `1px solid ${diffColor}44`,
              borderRadius: 20,
              padding: "4px 12px",
              fontSize: "0.78rem",
              fontWeight: 600,
            }}
          >
            {diffLabel}
          </span>
        </div>

        {/* Question card */}
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a, #1e293b)",
            border: "1px solid #334155",
            borderRadius: 20,
            padding: "32px",
            marginBottom: 24,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <p
            style={{
              color: "#f1f5f9",
              fontSize: "1.2rem",
              fontWeight: 600,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {q.q}
          </p>
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {q.opts.map((opt, i) => (
            <button
              key={i}
              onClick={() => onAnswer(i)}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid #334155",
                borderRadius: 14,
                padding: "16px 20px",
                color: "#e2e8f0",
                fontSize: "0.95rem",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                e.currentTarget.style.borderColor = diffColor;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "#334155";
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "#1e293b",
                  border: "1px solid #475569",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  color: "#64748b",
                  flexShrink: 0,
                }}
              >
                {["A", "B", "C", "D"][i]}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// RESULT SCREEN
// ============================================================
function ResultScreen({ profile, onContinue }) {
  const kl = profile.knowledgeLevel;
  const levelKey = kl === 1 ? "level1" : kl === 2 ? "level2" : "level3";
  const level = CURRICULUM[levelKey];
  const messages = {
    1: {
      title: "¡Bienvenido, Aprendiz! 🌱",
      sub: "Comenzarás con los fundamentos — la base de toda fortuna",
      tip: "Dato: Warren Buffett empezó comprando acciones a los 11 años. Nunca es tarde (ni temprano).",
    },
    2: {
      title: "¡Ya tienes base sólida! 📊",
      sub: "Saltamos a inversiones y análisis de mercados",
      tip: "Dato: El S&P 500 ha retornado ~10% anual en promedio en los últimos 100 años. La historia favorece al paciente.",
    },
    3: {
      title: "¡Nivel Experto detectado! 🏆",
      sub: "Directo a mercados de capitales, derivados y gestión institucional",
      tip: "Dato: El mercado global de derivados supera los $600 billones en valor nocional. Bienvenido a las grandes ligas.",
    },
  };
  const msg = messages[kl];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080d1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Georgia', serif",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>{level.badge}</div>
        <h2
          style={{
            color: "#f1f5f9",
            fontSize: "1.9rem",
            fontWeight: 700,
            margin: "0 0 10px",
          }}
        >
          {msg.title}
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "1rem", marginBottom: 24 }}>
          {msg.sub}
        </p>

        <div
          style={{
            background: `linear-gradient(135deg, ${level.color}18, ${level.color}08)`,
            border: `1px solid ${level.color}40`,
            borderRadius: 18,
            padding: "24px",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              color: level.color,
              fontSize: "1.3rem",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Nivel asignado: {level.name}
          </div>
          <div
            style={{
              color: "#94a3b8",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              marginBottom: 16,
            }}
          >
            {level.description}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              textAlign: "left",
            }}
          >
            {level.topics.slice(0, 4).map((t) => (
              <div
                key={t.id}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{t.icon}</span>
                <span
                  style={{
                    color: "#cbd5e1",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                  }}
                >
                  {t.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "#1e293b",
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 28,
            textAlign: "left",
          }}
        >
          <p
            style={{
              color: "#64748b",
              fontSize: "0.78rem",
              margin: "0 0 4px",
              fontStyle: "italic",
            }}
          >
            💡 Dato motivador
          </p>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "0.88rem",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {msg.tip}
          </p>
        </div>

        <button
          onClick={onContinue}
          style={{
            background: `linear-gradient(135deg, ${level.color}, ${level.darkColor})`,
            color: "#fff",
            border: "none",
            borderRadius: 14,
            padding: "15px 42px",
            fontSize: "1.05rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: `0 8px 28px ${level.color}44`,
          }}
        >
          Comenzar mi curso →
        </button>
      </div>
    </div>
  );
}

// ============================================================
// COURSE SCREEN
// ============================================================
function CourseScreen({
  profile,
  availableLevels,
  onStartGame,
  onMiniLesson,
  onRetest,
}) {
  const [activeLevel, setActiveLevel] = useState(
    availableLevels[availableLevels.length - 1],
  );
  const [expandedTopic, setExpandedTopic] = useState(null);
  const levelColors = { L1: "#00C896", L2: "#3B82F6", L3: "#F59E0B" };
  const levelData = {
    L1: CURRICULUM.level1,
    L2: CURRICULUM.level2,
    L3: CURRICULUM.level3,
  };
  const curLevel = levelData[activeLevel];
  const curGames = GAMES_BY_LEVEL[activeLevel] || [];
  const totalXpForLevel = curGames.reduce((s, g) => s + g.points, 0);
  const completedCount = curGames.filter((g) =>
    profile.completedGames.includes(g.id),
  ).length;
  const color = levelColors[activeLevel];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080d1a",
        fontFamily: "'Georgia', serif",
        padding: "0 0 80px",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(180deg, #0d1b3e 0%, #080d1a 100%)",
          borderBottom: "1px solid #1e293b",
          padding: "20px 24px 0",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div>
              <h1
                style={{
                  color: "#f1f5f9",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                FinanciaPlay 📈
              </h1>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.82rem",
                  margin: "2px 0 0",
                }}
              >
                Tu camino al dominio financiero
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  background: "#1e293b",
                  borderRadius: 12,
                  padding: "8px 16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: "#F59E0B",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  ⚡ {profile.xp}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.72rem" }}>
                  XP Total
                </div>
              </div>
              <button
                onClick={onRetest}
                style={{
                  background: "transparent",
                  border: "1px solid #334155",
                  color: "#64748b",
                  borderRadius: 10,
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                🔄 Re-test
              </button>
            </div>
          </div>

          {/* Level tabs */}
          <div style={{ display: "flex", gap: 4 }}>
            {availableLevels.map((lid) => {
              const ld = levelData[lid];
              const isActive = lid === activeLevel;
              const c = levelColors[lid];
              return (
                <button
                  key={lid}
                  onClick={() => setActiveLevel(lid)}
                  style={{
                    flex: 1,
                    padding: "10px 8px",
                    background: isActive ? c + "18" : "transparent",
                    border: `1px solid ${isActive ? c + "60" : "transparent"}`,
                    borderBottom: isActive
                      ? `2px solid ${c}`
                      : "2px solid transparent",
                    borderRadius: "10px 10px 0 0",
                    color: isActive ? c : "#64748b",
                    fontSize: "0.82rem",
                    fontWeight: isActive ? 700 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "center",
                  }}
                >
                  {ld.badge} {ld.name.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 20px" }}>
        {/* Level progress */}
        <div
          style={{
            background: `linear-gradient(135deg, ${color}14, ${color}06)`,
            border: `1px solid ${color}30`,
            borderRadius: 18,
            padding: "20px 24px",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 14,
            }}
          >
            <div>
              <h2
                style={{
                  color: "#f1f5f9",
                  margin: 0,
                  fontSize: "1.2rem",
                  fontWeight: 700,
                }}
              >
                {curLevel.name}
              </h2>
              <p
                style={{
                  color: "#64748b",
                  margin: "4px 0 0",
                  fontSize: "0.85rem",
                }}
              >
                {curLevel.description}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: color, fontWeight: 700 }}>
                {completedCount}/{curGames.length}
              </div>
              <div style={{ color: "#64748b", fontSize: "0.75rem" }}>
                juegos
              </div>
            </div>
          </div>
          <div
            style={{
              height: 8,
              background: "#1e293b",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${curGames.length > 0 ? (completedCount / curGames.length) * 100 : 0}%`,
                background: `linear-gradient(90deg, ${color}, ${color}aa)`,
                borderRadius: 4,
                transition: "width 0.5s",
              }}
            />
          </div>
        </div>

        {/* Topics */}
        <h3
          style={{
            color: "#94a3b8",
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          📚 Temas del nivel
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 10,
            marginBottom: 28,
          }}
        >
          {curLevel.topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onMiniLesson(topic.id, activeLevel)}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid #1e293b",
                borderRadius: 14,
                padding: "14px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor = color + "60";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "#1e293b";
              }}
            >
              <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>
                {topic.icon}
              </span>
              <div>
                <div
                  style={{
                    color: "#e2e8f0",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    marginBottom: 2,
                  }}
                >
                  {topic.name}
                </div>
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "0.72rem",
                    lineHeight: 1.3,
                  }}
                >
                  {topic.desc}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Games */}
        <h3
          style={{
            color: "#94a3b8",
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          🎮 Juegos educativos
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {curGames.map((game, idx) => {
            const done = profile.completedGames.includes(game.id);
            const typeLabels = {
              quiz_mc: "Quiz",
              true_false: "V/F",
              categorize: "Clasifica",
              decision: "Decisión",
              match: "Conecta",
            };
            const typeColors = {
              quiz_mc: "#3B82F6",
              true_false: "#8B5CF6",
              categorize: "#F59E0B",
              decision: "#EF4444",
              match: "#10B981",
            };
            return (
              <div
                key={game.id}
                style={{
                  background: done
                    ? "rgba(0,200,150,0.06)"
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid ${done ? "#00C89640" : "#1e293b"}`,
                  borderRadius: 16,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: "1.8rem", flexShrink: 0 }}>
                  {game.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        color: "#e2e8f0",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                      }}
                    >
                      {game.title}
                    </span>
                    <span
                      style={{
                        background: (typeColors[game.type] || "#64748b") + "22",
                        color: typeColors[game.type] || "#64748b",
                        fontSize: "0.72rem",
                        padding: "2px 8px",
                        borderRadius: 10,
                        fontWeight: 600,
                      }}
                    >
                      {typeLabels[game.type]}
                    </span>
                    {done && (
                      <span style={{ color: "#00C896", fontSize: "0.75rem" }}>
                        ✓ Completado
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 14 }}>
                    <span style={{ color: "#64748b", fontSize: "0.78rem" }}>
                      ⏱ {game.timeSec}s
                    </span>
                    <span style={{ color: "#F59E0B", fontSize: "0.78rem" }}>
                      ⚡ {game.points} pts
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onStartGame(game)}
                  style={{
                    background: done
                      ? "#1e293b"
                      : `linear-gradient(135deg, ${color}, ${levelColors[activeLevel]}aa)`,
                    color: done ? "#64748b" : "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "10px 20px",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    boxShadow: done ? "none" : `0 4px 16px ${color}30`,
                  }}
                >
                  {done ? "Repetir" : "Jugar →"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// GAME SCREEN
// ============================================================
function GameScreen({
  game,
  gameState,
  timeLeft,
  setGameState,
  onFinish,
  onBack,
}) {
  if (!game || !gameState) return null;
  const color = game.id.startsWith("L1")
    ? "#00C896"
    : game.id.startsWith("L2")
      ? "#3B82F6"
      : "#F59E0B";
  const timerPct = (timeLeft / game.timeSec) * 100;
  const timerColor =
    timerPct > 40 ? "#00C896" : timerPct > 15 ? "#F59E0B" : "#EF4444";

  if (gameState.phase === "summary") {
    const score = gameState.finalScore || gameState.score || 0;
    const max = gameState.maxScore || 1;
    const pct = Math.round((score / max) * 100);
    const xp = gameState.xpGained || 0;
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#080d1a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Georgia', serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 460, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>
            {pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "💪"}
          </div>
          <h2
            style={{
              color: "#f1f5f9",
              fontSize: "1.7rem",
              fontWeight: 700,
              margin: "0 0 8px",
            }}
          >
            {pct >= 80
              ? "¡Excelente!"
              : pct >= 50
                ? "¡Bien hecho!"
                : "¡Sigue practicando!"}
          </h2>
          {gameState.timeUp && (
            <p style={{ color: "#EF4444", fontSize: "0.9rem" }}>
              Se acabó el tiempo
            </p>
          )}
          <div
            style={{
              background: `linear-gradient(135deg, ${color}18, ${color}08)`,
              border: `1px solid ${color}40`,
              borderRadius: 18,
              padding: "24px",
              margin: "20px 0",
            }}
          >
            <div
              style={{
                fontSize: "3rem",
                fontWeight: 800,
                color,
                margin: "0 0 4px",
              }}
            >
              {pct}%
            </div>
            <div style={{ color: "#94a3b8", marginBottom: 16 }}>
              {score} / {max} correctas
            </div>
            <div
              style={{
                height: 10,
                background: "#1e293b",
                borderRadius: 5,
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}88)`,
                  borderRadius: 5,
                }}
              />
            </div>
            <div
              style={{ color: "#F59E0B", fontWeight: 700, fontSize: "1.1rem" }}
            >
              +{xp} XP ganados ⚡
            </div>
          </div>
          <button
            onClick={onBack}
            style={{
              background: `linear-gradient(135deg, ${color}, ${color}aa)`,
              color: "#fff",
              border: "none",
              borderRadius: 14,
              padding: "14px 36px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              marginRight: 12,
            }}
          >
            ← Volver al curso
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080d1a",
        fontFamily: "'Georgia', serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Game header */}
      <div
        style={{
          background: "#0d1b3e",
          borderBottom: "1px solid #1e293b",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: "1px solid #334155",
            color: "#94a3b8",
            borderRadius: 8,
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          ✕
        </button>
        <div style={{ flex: 1 }}>
          <div
            style={{ color: "#f1f5f9", fontWeight: 600, fontSize: "0.9rem" }}
          >
            {game.title}
          </div>
          <div
            style={{
              height: 4,
              background: "#1e293b",
              borderRadius: 2,
              marginTop: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${timerPct}%`,
                background: timerColor,
                borderRadius: 2,
                transition: "width 1s linear, background 0.5s",
              }}
            />
          </div>
        </div>
        <div
          style={{
            color: timerColor,
            fontWeight: 700,
            fontSize: "1.1rem",
            minWidth: 36,
            textAlign: "right",
          }}
        >
          {timeLeft !== null ? `${timeLeft}s` : ""}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "24px 20px",
          maxWidth: 600,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {game.type === "quiz_mc" && (
          <QuizGame
            game={game}
            gs={gameState}
            setGs={setGameState}
            onFinish={onFinish}
            color={color}
          />
        )}
        {game.type === "true_false" && (
          <TrueFalseGame
            game={game}
            gs={gameState}
            setGs={setGameState}
            onFinish={onFinish}
            color={color}
          />
        )}
        {game.type === "categorize" && (
          <CategorizeGame
            game={game}
            gs={gameState}
            setGs={setGameState}
            onFinish={onFinish}
            color={color}
          />
        )}
        {game.type === "decision" && (
          <DecisionGame
            game={game}
            gs={gameState}
            setGs={setGameState}
            onFinish={onFinish}
            color={color}
          />
        )}
        {game.type === "match" && (
          <MatchGame
            game={game}
            gs={gameState}
            setGs={setGameState}
            onFinish={onFinish}
            color={color}
          />
        )}
      </div>
    </div>
  );
}

// ---- QUIZ MC ----
function QuizGame({ game, gs, setGs, onFinish, color }) {
  const q = game.questions[gs.qIdx];
  const isLast = gs.qIdx === game.questions.length - 1;

  function answer(i) {
    if (gs.feedback !== null) return;
    const correct = i === q.correct;
    setGs((s) => ({
      ...s,
      feedback: { chosen: i, correct },
      score: s.score + (correct ? 1 : 0),
    }));
  }

  function next() {
    if (isLast) {
      const finalScore = gs.score + (gs.feedback?.correct ? 0 : 0); // already counted
      onFinish(
        gs.score +
          (gs.feedback?.correct ? 1 : 0) -
          (gs.answers.includes(true) ? 0 : 0),
        game.questions.length,
      );
      // Simple: score was updated when answering
      const s = gs.score + (gs.feedback.correct ? 0 : 0);
      onFinish(
        gs.score + (gs.feedback?.correct ? 0 : 0),
        game.questions.length,
      );
    } else {
      setGs((s) => ({
        ...s,
        qIdx: s.qIdx + 1,
        feedback: null,
        answers: [...s.answers, s.feedback?.correct],
      }));
    }
  }

  // Fix: count on answer
  function answerFixed(i) {
    if (gs.feedback !== null) return;
    const correct = i === q.correct;
    setGs((s) => ({
      ...s,
      feedback: { chosen: i, correct },
      score: s.score + (correct ? 1 : 0),
      answers: [...s.answers, correct],
    }));
  }

  function nextFixed() {
    if (isLast) {
      const finalScore = gs.score + (gs.feedback?.correct ? 0 : 0); // already counted above
      onFinish(gs.score, game.questions.length);
    } else {
      setGs((s) => ({ ...s, qIdx: s.qIdx + 1, feedback: null }));
    }
  }

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
          Pregunta {gs.qIdx + 1} de {game.questions.length}
        </span>
        <span style={{ color: "#F59E0B", fontSize: "0.85rem" }}>
          ⚡ {gs.score} pts
        </span>
      </div>
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          border: "1px solid #334155",
          borderRadius: 18,
          padding: "28px",
          marginBottom: 20,
        }}
      >
        <p
          style={{
            color: "#f1f5f9",
            fontSize: "1.15rem",
            fontWeight: 600,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {q.q}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {q.opts.map((opt, i) => {
          let bg = "rgba(255,255,255,0.04)",
            border = "#334155",
            textColor = "#e2e8f0";
          if (gs.feedback) {
            if (i === q.correct) {
              bg = "rgba(0,200,150,0.15)";
              border = "#00C896";
              textColor = "#00C896";
            } else if (i === gs.feedback.chosen && !gs.feedback.correct) {
              bg = "rgba(239,68,68,0.15)";
              border = "#EF4444";
              textColor = "#EF4444";
            } else {
              bg = "rgba(255,255,255,0.02)";
              border = "#1e293b";
              textColor = "#475569";
            }
          }
          return (
            <button
              key={i}
              onClick={() => answerFixed(i)}
              disabled={!!gs.feedback}
              style={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 12,
                padding: "14px 18px",
                color: textColor,
                fontSize: "0.95rem",
                textAlign: "left",
                cursor: gs.feedback ? "default" : "pointer",
                transition: "all 0.2s",
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.78rem",
                  flexShrink: 0,
                  color: "#64748b",
                }}
              >
                {i === q.correct && gs.feedback
                  ? "✓"
                  : i === gs.feedback?.chosen && !gs.feedback?.correct
                    ? "✗"
                    : ["A", "B", "C", "D"][i]}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {gs.feedback && (
        <div
          style={{
            background: gs.feedback.correct
              ? "rgba(0,200,150,0.1)"
              : "rgba(239,68,68,0.1)",
            border: `1px solid ${gs.feedback.correct ? "#00C89640" : "#EF444440"}`,
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 16,
          }}
        >
          <p
            style={{
              color: "#94a3b8",
              margin: 0,
              fontSize: "0.88rem",
              lineHeight: 1.5,
            }}
          >
            💡 {q.explain}
          </p>
        </div>
      )}
      {gs.feedback && (
        <button
          onClick={nextFixed}
          style={{
            width: "100%",
            background: `linear-gradient(135deg, ${color}, ${color}aa)`,
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "14px",
            fontSize: "1rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {isLast ? "Ver resultados 🏆" : "Siguiente →"}
        </button>
      )}
    </div>
  );
}

// ---- TRUE FALSE ----
function TrueFalseGame({ game, gs, setGs, onFinish, color }) {
  const s = game.statements[gs.sIdx];
  const isLast = gs.sIdx === game.statements.length - 1;

  function answer(bool) {
    if (gs.feedback !== null) return;
    const correct = bool === s.answer;
    setGs((prev) => ({
      ...prev,
      feedback: { chosen: bool, correct },
      score: prev.score + (correct ? 1 : 0),
    }));
  }
  function next() {
    if (isLast) onFinish(gs.score, game.statements.length);
    else setGs((prev) => ({ ...prev, sIdx: prev.sIdx + 1, feedback: null }));
  }

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
          {gs.sIdx + 1} / {game.statements.length}
        </span>
        <span style={{ color: "#F59E0B", fontSize: "0.85rem" }}>
          ⚡ {gs.score}
        </span>
      </div>
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          border: "1px solid #334155",
          borderRadius: 18,
          padding: "36px 28px",
          marginBottom: 28,
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#f1f5f9",
            fontSize: "1.2rem",
            fontWeight: 600,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          "{s.q}"
        </p>
      </div>
      {!gs.feedback && (
        <div style={{ display: "flex", gap: 16 }}>
          <button
            onClick={() => answer(true)}
            style={{
              flex: 1,
              background: "rgba(0,200,150,0.1)",
              border: "2px solid #00C896",
              borderRadius: 14,
              padding: "20px",
              color: "#00C896",
              fontSize: "1.2rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ✓ VERDADERO
          </button>
          <button
            onClick={() => answer(false)}
            style={{
              flex: 1,
              background: "rgba(239,68,68,0.1)",
              border: "2px solid #EF4444",
              borderRadius: 14,
              padding: "20px",
              color: "#EF4444",
              fontSize: "1.2rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ✗ FALSO
          </button>
        </div>
      )}
      {gs.feedback && (
        <>
          <div
            style={{ textAlign: "center", fontSize: "3rem", marginBottom: 12 }}
          >
            {gs.feedback.correct ? "✅" : "❌"}
          </div>
          <div
            style={{
              background: gs.feedback.correct
                ? "rgba(0,200,150,0.1)"
                : "rgba(239,68,68,0.1)",
              borderRadius: 12,
              padding: "14px 18px",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: gs.feedback.correct ? "#00C896" : "#EF4444",
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              {gs.feedback.correct ? "¡Correcto!" : "Incorrecto"} — Era{" "}
              {s.answer ? "VERDADERO" : "FALSO"}
            </div>
            <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.88rem" }}>
              💡 {s.explain}
            </p>
          </div>
          <button
            onClick={next}
            style={{
              width: "100%",
              background: `linear-gradient(135deg, ${color}, ${color}aa)`,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "14px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {isLast ? "Ver resultados 🏆" : "Siguiente →"}
          </button>
        </>
      )}
    </div>
  );
}

// ---- CATEGORIZE ----
function CategorizeGame({ game, gs, setGs, onFinish, color }) {
  const [selected, setSelected] = useState(null);
  const allPlaced = Object.keys(gs.placed).length === game.items.length;

  function selectItem(label) {
    setSelected(selected === label ? null : label);
  }
  function placeInCat(catKey) {
    if (!selected) return;
    const item = game.items.find((i) => i.label === selected);
    const correct = item?.cat === catKey;
    setGs((prev) => ({
      ...prev,
      placed: { ...prev.placed, [selected]: { catKey, correct } },
      score: prev.score + (correct ? 1 : 0),
    }));
    setSelected(null);
  }

  if (allPlaced && gs.phase !== "done") {
    const score = Object.values(gs.placed).filter((p) => p.correct).length;
    onFinish(score, game.items.length);
  }

  const unplaced = gs.items.filter((item) => !gs.placed[item.label]);

  return (
    <div style={{ width: "100%" }}>
      <p
        style={{
          color: "#94a3b8",
          fontSize: "0.9rem",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Toca un ítem → luego toca la categoría
      </p>
      {/* Unplaced items */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 24,
          minHeight: 60,
          background: "rgba(255,255,255,0.03)",
          border: "1px dashed #334155",
          borderRadius: 14,
          padding: "12px",
        }}
      >
        {unplaced.map((item) => (
          <button
            key={item.label}
            onClick={() => selectItem(item.label)}
            style={{
              background:
                selected === item.label
                  ? color + "33"
                  : "rgba(255,255,255,0.06)",
              border: `1px solid ${selected === item.label ? color : "#334155"}`,
              borderRadius: 10,
              padding: "7px 14px",
              color: selected === item.label ? color : "#e2e8f0",
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.15s",
              fontWeight: selected === item.label ? 600 : 400,
            }}
          >
            {item.label}
          </button>
        ))}
        {unplaced.length === 0 && (
          <span
            style={{
              color: "#475569",
              fontSize: "0.85rem",
              alignSelf: "center",
              width: "100%",
              textAlign: "center",
            }}
          >
            ¡Todos clasificados!
          </span>
        )}
      </div>
      {/* Categories */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {game.categories.map((cat) => {
          const placedHere = Object.entries(gs.placed).filter(
            ([, v]) => v.catKey === cat.key,
          );
          return (
            <div
              key={cat.key}
              onClick={() => selected && placeInCat(cat.key)}
              style={{
                background: selected ? color + "0d" : "rgba(255,255,255,0.03)",
                border: `1px solid ${selected ? color + "60" : "#1e293b"}`,
                borderRadius: 14,
                padding: "14px 16px",
                cursor: selected ? "pointer" : "default",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                {cat.label}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {placedHere.map(([label, info]) => (
                  <span
                    key={label}
                    style={{
                      background: info.correct
                        ? "rgba(0,200,150,0.15)"
                        : "rgba(239,68,68,0.15)",
                      border: `1px solid ${info.correct ? "#00C89660" : "#EF444460"}`,
                      color: info.correct ? "#00C896" : "#EF4444",
                      borderRadius: 8,
                      padding: "4px 10px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {info.correct ? "✓" : "✗"} {label}
                  </span>
                ))}
                {placedHere.length === 0 && (
                  <span style={{ color: "#475569", fontSize: "0.78rem" }}>
                    — vacío —
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          textAlign: "right",
          marginTop: 14,
          color: "#64748b",
          fontSize: "0.82rem",
        }}
      >
        {Object.keys(gs.placed).length}/{game.items.length} clasificados ·{" "}
        {gs.score} correctos
      </div>
    </div>
  );
}

// ---- DECISION ----
function DecisionGame({ game, gs, setGs, onFinish, color }) {
  const sc = game.scenarios[gs.sIdx];
  const isLast = gs.sIdx === game.scenarios.length - 1;

  function choose(i) {
    if (gs.feedback !== null) return;
    const correct = i === sc.correct;
    setGs((prev) => ({
      ...prev,
      feedback: { chosen: i, correct },
      score: prev.score + (correct ? 1 : 0),
    }));
  }
  function next() {
    if (isLast) onFinish(gs.score, game.scenarios.length);
    else setGs((prev) => ({ ...prev, sIdx: prev.sIdx + 1, feedback: null }));
  }

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #1a1033, #0f1829)",
          border: "1px solid #4a3060",
          borderRadius: 18,
          padding: "28px",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            color: "#a78bfa",
            fontSize: "0.8rem",
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          🧠 ESCENARIO {gs.sIdx + 1}/{game.scenarios.length}
        </div>
        <p
          style={{
            color: "#f1f5f9",
            fontSize: "1.1rem",
            fontWeight: 600,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {sc.text}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {sc.opts.map((opt, i) => {
          let bg = "rgba(167,139,250,0.06)",
            border = "#4a3060",
            tc = "#c4b5fd";
          if (gs.feedback) {
            if (i === sc.correct) {
              bg = "rgba(0,200,150,0.12)";
              border = "#00C896";
              tc = "#00C896";
            } else if (i === gs.feedback.chosen) {
              bg = "rgba(239,68,68,0.12)";
              border = "#EF4444";
              tc = "#EF4444";
            } else {
              bg = "rgba(255,255,255,0.02)";
              border = "#1e293b";
              tc = "#475569";
            }
          }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={!!gs.feedback}
              style={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 12,
                padding: "16px 20px",
                color: tc,
                fontSize: "0.95rem",
                textAlign: "left",
                cursor: gs.feedback ? "default" : "pointer",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              {["A", "B", "C"][i]}. {opt}
            </button>
          );
        })}
      </div>
      {gs.feedback && (
        <>
          <div
            style={{
              background: "rgba(167,139,250,0.08)",
              border: "1px solid #4a306040",
              borderRadius: 12,
              padding: "14px 18px",
              marginBottom: 14,
            }}
          >
            <p
              style={{
                color: "#94a3b8",
                margin: 0,
                fontSize: "0.88rem",
                lineHeight: 1.5,
              }}
            >
              💡 {sc.explain}
            </p>
          </div>
          <button
            onClick={next}
            style={{
              width: "100%",
              background: `linear-gradient(135deg, ${color}, ${color}aa)`,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "14px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {isLast ? "Ver resultados 🏆" : "Siguiente escenario →"}
          </button>
        </>
      )}
    </div>
  );
}

// ---- MATCH ----
function MatchGame({ game, gs, setGs, onFinish, color }) {
  const allMatched = Object.keys(gs.matched).length === game.pairs.length;
  if (allMatched) {
    const score = game.pairs.length - gs.errors;
    onFinish(Math.max(0, score), game.pairs.length);
  }

  function selectLeft(id) {
    if (gs.matched[id] !== undefined) return;
    setGs((s) => ({ ...s, selected: s.selected === id ? null : id }));
  }

  function selectRight(id) {
    if (gs.selected === null) return;
    const correct = id === gs.selected;
    if (correct) {
      setGs((s) => ({
        ...s,
        matched: { ...s.matched, [s.selected]: true },
        selected: null,
        score: s.score + 1,
      }));
    } else {
      setGs((s) => ({ ...s, errors: s.errors + 1, selected: null }));
    }
  }

  return (
    <div style={{ width: "100%" }}>
      <p
        style={{
          color: "#94a3b8",
          fontSize: "0.88rem",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Selecciona un concepto → luego su definición
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              color: "#64748b",
              fontSize: "0.75rem",
              fontWeight: 600,
              textAlign: "center",
              marginBottom: 4,
            }}
          >
            CONCEPTO
          </div>
          {gs.lefts.map((item) => {
            const matched = gs.matched[item.id] !== undefined;
            const selected = gs.selected === item.id;
            return (
              <button
                key={item.id}
                onClick={() => selectLeft(item.id)}
                disabled={matched}
                style={{
                  background: matched
                    ? "rgba(0,200,150,0.12)"
                    : selected
                      ? color + "22"
                      : "rgba(255,255,255,0.05)",
                  border: `1px solid ${matched ? "#00C89650" : selected ? color : "#334155"}`,
                  borderRadius: 10,
                  padding: "12px",
                  color: matched ? "#00C896" : selected ? color : "#e2e8f0",
                  fontSize: "0.82rem",
                  fontWeight: 500,
                  cursor: matched ? "default" : "pointer",
                  textAlign: "center",
                  transition: "all 0.2s",
                }}
              >
                {matched ? "✓ " : ""}
                {item.text}
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              color: "#64748b",
              fontSize: "0.75rem",
              fontWeight: 600,
              textAlign: "center",
              marginBottom: 4,
            }}
          >
            DEFINICIÓN
          </div>
          {gs.rights.map((item) => {
            const matched = gs.matched[item.id] !== undefined;
            return (
              <button
                key={item.id}
                onClick={() => selectRight(item.id)}
                disabled={matched || gs.selected === null}
                style={{
                  background: matched
                    ? "rgba(0,200,150,0.12)"
                    : "rgba(255,255,255,0.05)",
                  border: `1px solid ${matched ? "#00C89650" : "#334155"}`,
                  borderRadius: 10,
                  padding: "12px",
                  color: matched ? "#00C896" : "#94a3b8",
                  fontSize: "0.8rem",
                  cursor:
                    matched || gs.selected === null ? "default" : "pointer",
                  textAlign: "center",
                  transition: "all 0.2s",
                }}
              >
                {matched ? "✓ " : ""}
                {item.text}
              </button>
            );
          })}
        </div>
      </div>
      <div
        style={{
          textAlign: "center",
          marginTop: 16,
          color: "#64748b",
          fontSize: "0.82rem",
        }}
      >
        {Object.keys(gs.matched).length}/{game.pairs.length} pareados ·{" "}
        {gs.errors > 0 && `${gs.errors} errores`}
      </div>
    </div>
  );
}

// ============================================================
// MINI LESSON SCREEN (AI Powered)
// ============================================================
function MiniLessonScreen({ loading, content, onBack }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080d1a",
        fontFamily: "'Georgia', serif",
        padding: "24px 20px",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: "1px solid #334155",
            color: "#64748b",
            borderRadius: 10,
            padding: "8px 16px",
            cursor: "pointer",
            marginBottom: 24,
            fontSize: "0.85rem",
          }}
        >
          ← Volver
        </button>

        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div
              style={{
                fontSize: 48,
                marginBottom: 16,
                animation: "pulse 1.5s infinite",
              }}
            >
              🤖
            </div>
            <p style={{ color: "#94a3b8" }}>
              Generando tu lección personalizada...
            </p>
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "center",
                marginTop: 16,
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#3B82F6",
                    opacity: 0.3 + i * 0.3,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && content && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 56, marginBottom: 8 }}>
                {content.emoji}
              </div>
              <h2
                style={{
                  color: "#f1f5f9",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {content.title}
              </h2>
            </div>

            {[
              { label: "🪝 ¿Lo sabías?", text: content.hook, color: "#F59E0B" },
              {
                label: "💡 El concepto",
                text: content.concept,
                color: "#3B82F6",
              },
              {
                label: "📊 Ejemplo real",
                text: content.example,
                color: "#00C896",
              },
              {
                label: "🔑 Dato clave",
                text: content.keyFact,
                color: "#a78bfa",
              },
            ].map((card, i) =>
              card.text ? (
                <div
                  key={i}
                  style={{
                    background: card.color + "0d",
                    border: `1px solid ${card.color}30`,
                    borderRadius: 16,
                    padding: "18px 20px",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      color: card.color,
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      marginBottom: 8,
                      letterSpacing: 0.5,
                    }}
                  >
                    {card.label}
                  </div>
                  <p
                    style={{
                      color: "#e2e8f0",
                      margin: 0,
                      lineHeight: 1.7,
                      fontSize: "0.92rem",
                    }}
                  >
                    {card.text}
                  </p>
                </div>
              ) : null,
            )}

            {content.challenge && (
              <div
                style={{
                  background: "linear-gradient(135deg, #1a1033, #0f1829)",
                  border: "1px solid #4a3060",
                  borderRadius: 16,
                  padding: "20px",
                  marginTop: 8,
                }}
              >
                <div
                  style={{
                    color: "#a78bfa",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  🧠 MINI-RETO DE REFLEXIÓN
                </div>
                <p
                  style={{
                    color: "#c4b5fd",
                    margin: 0,
                    lineHeight: 1.6,
                    fontStyle: "italic",
                  }}
                >
                  {content.challenge}
                </p>
              </div>
            )}

            <button
              onClick={onBack}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #3B82F6, #2563eb)",
                color: "#fff",
                border: "none",
                borderRadius: 14,
                padding: "15px",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                marginTop: 24,
              }}
            >
              ¡Entendido! Ver juegos →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
