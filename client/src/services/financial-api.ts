// Enlaces directos a las páginas de mercados financieros
// CoinMarketCap para criptomonedas
// Investing.com para acciones de Colombia y NYSE/NASDAQ

// Enlaces a las fuentes de datos que los usuarios pueden visitar directamente
export const MARKET_SOURCES = {
  // Fuente para criptomonedas
  CRYPTO: {
    name: "CoinMarketCap",
    url: "https://coinmarketcap.com/",
    topCoinsList: "https://coinmarketcap.com/es/",
    bitcoin: "https://coinmarketcap.com/es/currencies/bitcoin/",
    ethereum: "https://coinmarketcap.com/es/currencies/ethereum/",
    bnb: "https://coinmarketcap.com/es/currencies/bnb/",
    solana: "https://coinmarketcap.com/es/currencies/solana/",
    xrp: "https://coinmarketcap.com/es/currencies/xrp/",
  },

  // Fuente para acciones de Colombia (BVC)
  COLOMBIA: {
    name: "Investing.com Colombia",
    url: "https://es.investing.com/equities/colombia",
    mainIndex: "https://es.investing.com/indices/colombia-select-index",
    ecopetrol: "https://es.investing.com/equities/ecopetrol-cn",
    bancolombia: "https://es.investing.com/equities/pfbcolom",
    grupoSura: "https://es.investing.com/equities/gruposura",
    isa: "https://es.investing.com/equities/isa",
    grupoArgos: "https://es.investing.com/equities/grupoargos",
  },

  // Fuente para acciones de Estados Unidos (NYSE/NASDAQ)
  USA: {
    name: "Yahoo Finance",
    url: "https://finance.yahoo.com/",
    mainIndex: "https://finance.yahoo.com/quote/%5EGSPC?p=%5EGSPC",
    apple: "https://finance.yahoo.com/quote/AAPL?p=AAPL",
    microsoft: "https://finance.yahoo.com/quote/MSFT?p=MSFT",
    amazon: "https://finance.yahoo.com/quote/AMZN?p=AMZN",
    tesla: "https://finance.yahoo.com/quote/TSLA?p=TSLA",
    nvidia: "https://finance.yahoo.com/quote/NVDA?p=NVDA",
  },
};

// Interfaz para datos de acciones en general
export interface Stock {
  ticker: string;
  company: string;
  price: number;
  priceFormatted: string;
  change: number;
  changePercent: number;
  volume: string;
  isPositive: boolean;
  url: string; // URL directo a la página de la acción
}

// Interfaz para datos de criptomonedas
export interface Crypto {
  ticker: string;
  name: string;
  price: number;
  priceFormatted: string;
  change: number;
  changePercent: number;
  marketCap: string;
  volume24h: string;
  isPositive: boolean;
  url: string; // URL directo a la página de la criptomoneda
}

// Función para obtener las principales acciones de Colombia (BVC)
// Los datos son de muestra, pero cada registro incluye la URL real a la fuente de datos
// ✅ Obtener acciones colombianas (datos reales desde backend Express)
export async function getColombianStocks(): Promise<Stock[]> {
  try {
    const response = await fetch("/api/finance/colombia");
    const data = await response.json();

    return data.map((item: any) => {
      const price = item.price ?? 0;
      const changePercent = item.change ?? 0;

      return {
        ticker: item.symbol,
        company: item.name,
        price,
        priceFormatted: `${price.toLocaleString("es-CO")} COP`,
        change: changePercent,
        changePercent,
        volume: "N/A",
        isPositive: changePercent >= 0,
        url:
          MARKET_SOURCES.COLOMBIA[
            item.symbol?.toLowerCase() as keyof typeof MARKET_SOURCES.COLOMBIA
          ] || MARKET_SOURCES.COLOMBIA.url,
      };
    });
  } catch (error) {
    console.error(
      "❌ Error al obtener datos reales del mercado colombiano:",
      error,
    );
    return [];
  }
}

// ✅ Obtener acciones de EE.UU. desde tu backend Express (datos reales)
export async function getUSStocks(): Promise<Stock[]> {
  try {
    const response = await fetch(
      "/api/finance/markets?symbols=AAPL,MSFT,GOOG,AMZN,TSLA,NVDA",
    );
    const data = await response.json();

    // Transformar los datos para ajustarse al formato del front
    return data.map((item: any) => {
      const price = item.price ?? 0;
      const changePercent = item.change ?? 0;

      return {
        ticker: item.symbol,
        company: item.name,
        price,
        priceFormatted: `${price.toFixed(2)} USD`,
        change: changePercent,
        changePercent,
        volume: "N/A",
        isPositive: changePercent >= 0,
        url: `https://finance.yahoo.com/quote/${item.symbol}`,
      };
    });
  } catch (error) {
    console.error(
      "❌ Error al obtener datos reales del mercado de EE.UU.:",
      error,
    );
    return [];
  }
}

// Función para obtener las principales criptomonedas
// Los datos son de muestra, pero cada registro incluye la URL real a la fuente de datos
export async function getCryptos(): Promise<Crypto[]> {
  try {
    const response = await fetch("/api/finance/cryptos");
    const data = await response.json();

    return data.map((item: any) => {
      const price = item.price ?? 0;
      const changePercent = item.change ?? 0;

      return {
        ticker: item.symbol, // Ej: BTC-USD
        name: item.name, // Ej: Bitcoin
        price,
        priceFormatted: `$${price.toLocaleString("en-US")}`,
        change: changePercent,
        changePercent,
        marketCap: item.marketCap || "N/A",
        volume24h: item.volume24h || "N/A",
        isPositive: changePercent >= 0,
        url: `https://coinmarketcap.com/currencies/${item.name.toLowerCase().replace(/\s+/g, "-")}/`,
      };
    });
  } catch (error) {
    console.error("❌ Error al obtener criptomonedas:", error);
    return [];
  }
}
