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
    xrp: "https://coinmarketcap.com/es/currencies/xrp/"
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
    grupoArgos: "https://es.investing.com/equities/grupoargos"
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
    nvidia: "https://finance.yahoo.com/quote/NVDA?p=NVDA"
  }
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
export async function getColombianStocks(): Promise<Stock[]> {
  try {
    return [
      { 
        ticker: 'ECOPETL', 
        company: 'Ecopetrol', 
        price: 4850, 
        priceFormatted: '4850 COP', 
        change: 42, 
        changePercent: 0.87, 
        volume: '4.2M',
        isPositive: true,
        url: MARKET_SOURCES.COLOMBIA.ecopetrol
      },
      { 
        ticker: 'BCOLOMBIA', 
        company: 'Bancolombia', 
        price: 62750, 
        priceFormatted: '62.750 COP', 
        change: 254, 
        changePercent: 0.41,
        volume: '685K',
        isPositive: true,
        url: MARKET_SOURCES.COLOMBIA.bancolombia
      },
      { 
        ticker: 'GRUPOSURA', 
        company: 'Grupo Sura', 
        price: 58320, 
        priceFormatted: '58.320 COP', 
        change: 678, 
        changePercent: 1.17, 
        volume: '352K',
        isPositive: true,
        url: MARKET_SOURCES.COLOMBIA.grupoSura
      },
      { 
        ticker: 'ISA', 
        company: 'ISA', 
        price: 42170, 
        priceFormatted: '42.170 COP', 
        change: -320, 
        changePercent: -0.75, 
        volume: '245K',
        isPositive: false,
        url: MARKET_SOURCES.COLOMBIA.isa
      },
      { 
        ticker: 'GRUPOARGOS', 
        company: 'Grupo Argos', 
        price: 21540, 
        priceFormatted: '21.540 COP', 
        change: 183, 
        changePercent: 0.86, 
        volume: '387K',
        isPositive: true,
        url: MARKET_SOURCES.COLOMBIA.grupoArgos
      }
    ];
  } catch (error) {
    console.error('Error al obtener datos de acciones colombianas:', error);
    return [];
  }
}

// Función para obtener las principales acciones de NYSE/NASDAQ
// Los datos son de muestra, pero cada registro incluye la URL real a la fuente de datos
export async function getUSStocks(): Promise<Stock[]> {
  try {
    return [
      { 
        ticker: 'AAPL', 
        company: 'Apple', 
        price: 298.45, 
        priceFormatted: '298.45 USD', 
        change: 3.82, 
        changePercent: 1.29, 
        volume: '78.2M',
        isPositive: true,
        url: MARKET_SOURCES.USA.apple
      },
      { 
        ticker: 'MSFT', 
        company: 'Microsoft', 
        price: 652.38, 
        priceFormatted: '652.38 USD', 
        change: -4.76, 
        changePercent: -0.72, 
        volume: '31.5M',
        isPositive: false,
        url: MARKET_SOURCES.USA.microsoft
      },
      { 
        ticker: 'AMZN', 
        company: 'Amazon', 
        price: 284.57, 
        priceFormatted: '284.57 USD', 
        change: 2.34, 
        changePercent: 0.83, 
        volume: '42.7M',
        isPositive: true,
        url: MARKET_SOURCES.USA.amazon
      },
      { 
        ticker: 'TSLA', 
        company: 'Tesla', 
        price: 328.95, 
        priceFormatted: '328.95 USD', 
        change: 5.64, 
        changePercent: 1.74, 
        volume: '105.6M',
        isPositive: true,
        url: MARKET_SOURCES.USA.tesla
      },
      { 
        ticker: 'NVDA', 
        company: 'NVIDIA', 
        price: 1485.92, 
        priceFormatted: '1485.92 USD', 
        change: -21.35, 
        changePercent: -1.42, 
        volume: '58.4M',
        isPositive: false,
        url: MARKET_SOURCES.USA.nvidia
      }
    ];
  } catch (error) {
    console.error('Error al obtener datos de acciones de EE.UU.:', error);
    return [];
  }
}

// Función para obtener las principales criptomonedas
// Los datos son de muestra, pero cada registro incluye la URL real a la fuente de datos
export async function getCryptocurrencies(): Promise<Crypto[]> {
  try {
    return [
      { 
        ticker: 'BTC', 
        name: 'Bitcoin', 
        price: 125845.32, 
        priceFormatted: '125,845.32 USD', 
        change: 1254.65, 
        changePercent: 1.01, 
        marketCap: '$ 2.45T',
        volume24h: '$ 37.2B',
        isPositive: true,
        url: MARKET_SOURCES.CRYPTO.bitcoin
      },
      { 
        ticker: 'ETH', 
        name: 'Ethereum', 
        price: 8724.58, 
        priceFormatted: '8724.58 USD', 
        change: -105.32, 
        changePercent: -1.19, 
        marketCap: '$ 1.05T',
        volume24h: '$ 17.4B',
        isPositive: false,
        url: MARKET_SOURCES.CRYPTO.ethereum
      },
      { 
        ticker: 'BNB', 
        name: 'BNB', 
        price: 1347.25, 
        priceFormatted: '1347.25 USD', 
        change: 24.18, 
        changePercent: 1.83, 
        marketCap: '$ 205.6B',
        volume24h: '$ 4.3B',
        isPositive: true,
        url: MARKET_SOURCES.CRYPTO.bnb
      },
      { 
        ticker: 'SOL', 
        name: 'Solana', 
        price: 472.65, 
        priceFormatted: '472.65 USD', 
        change: 5.37, 
        changePercent: 1.15, 
        marketCap: '$ 192.8B',
        volume24h: '$ 6.7B',
        isPositive: true,
        url: MARKET_SOURCES.CRYPTO.solana
      },
      { 
        ticker: 'XRP', 
        name: 'XRP', 
        price: 2.57, 
        priceFormatted: '2.57 USD', 
        change: -0.0342, 
        changePercent: -1.31, 
        marketCap: '$ 138.5B',
        volume24h: '$ 3.2B',
        isPositive: false,
        url: MARKET_SOURCES.CRYPTO.xrp
      }
    ];
  } catch (error) {
    console.error('Error al obtener datos de criptomonedas:', error);
    return [];
  }
}