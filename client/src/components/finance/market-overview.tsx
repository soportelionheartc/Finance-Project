import { useState, useEffect } from "react";
import {
  getColombianStocks,
  getUSStocks,
  getCryptos,
  type Stock,
  type Crypto,
  MARKET_SOURCES,
} from "@/services/financial-api";
import {
  TrendingUp,
  RefreshCw,
  ExternalLink,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function MarketOverview() {
  const [colombianStocks, setColombianStocks] = useState<Stock[]>([]);
  const [usStocks, setUSStocks] = useState<Stock[]>([]);
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Función para cargar todos los datos financieros
  const loadFinancialData = async () => {
    setIsRefreshing(true);
    try {
      const [colombiaData, usData, cryptoData] = await Promise.all([
        getColombianStocks(),
        getUSStocks(),
        getCryptos(),
      ]);

      setColombianStocks(colombiaData);
      setUSStocks(usData);
      setCryptos(cryptoData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error al cargar datos financieros:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadFinancialData();

    // Actualizar automáticamente cada 5 minutos
    const intervalId = setInterval(
      () => {
        loadFinancialData();
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(intervalId);
  }, []);

  // Formatear el timestamp de última actualización
  const formattedLastUpdated = lastUpdated
    ? lastUpdated.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <TrendingUp className="text-primary mr-2 h-5 w-5" />
          <h2 className="text-lg font-bold text-white">Mercados Financieros</h2>
        </div>
        <div className="flex items-center">
          {lastUpdated && (
            <span className="mr-3 text-xs text-gray-400">
              Actualizado: {formattedLastUpdated}
            </span>
          )}
          <button
            onClick={() => loadFinancialData()}
            disabled={isRefreshing}
            className="border-primary text-primary hover:bg-primary/10 rounded-full border bg-black p-1 transition-colors disabled:opacity-50"
            aria-label="Actualizar datos"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
        </div>
      ) : (
        <>
          {/* Acciones colombianas */}
          <div className="space-y-3">
            <a
              href={MARKET_SOURCES.COLOMBIA.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary flex items-center font-semibold hover:underline"
            >
              Acciones Colombia (BVC)
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {colombianStocks.map((stock) => (
                <a
                  key={stock.ticker}
                  href={stock.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="hover:border-primary/50 border border-zinc-800 bg-zinc-900/80 transition-all group-hover:scale-105">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="font-medium text-white">
                          {stock.company}
                        </div>
                        {stock.isPositive ? (
                          <ArrowUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="text-primary mt-2 text-lg font-bold">
                        {stock.priceFormatted}
                      </div>
                      <div
                        className={`mt-1 text-xs ${stock.isPositive ? "text-green-500" : "text-red-500"}`}
                      >
                        {stock.isPositive ? "+" : ""}
                        {stock.changePercent.toFixed(2)}%
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>

          {/* Acciones EEUU */}
          <div className="space-y-3">
            <a
              href={MARKET_SOURCES.USA.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary flex items-center font-semibold hover:underline"
            >
              Acciones USA (NYSE/NASDAQ)
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {usStocks.map((stock) => (
                <a
                  key={stock.ticker}
                  href={stock.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="hover:border-primary/50 border border-zinc-800 bg-zinc-900/80 transition-all group-hover:scale-105">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="font-medium text-white">
                          {stock.company}
                        </div>
                        {stock.isPositive ? (
                          <ArrowUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="text-primary mt-2 text-lg font-bold">
                        {stock.priceFormatted}
                      </div>
                      <div
                        className={`mt-1 text-xs ${stock.isPositive ? "text-green-500" : "text-red-500"}`}
                      >
                        {stock.isPositive ? "+" : ""}
                        {stock.changePercent.toFixed(2)}%
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>

          {/* Criptomonedas */}
          <div className="space-y-3">
            <a
              href={MARKET_SOURCES.CRYPTO.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary flex items-center font-semibold hover:underline"
            >
              Criptomonedas
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {cryptos.map((crypto) => (
                <a
                  key={crypto.ticker}
                  href={crypto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="hover:border-primary/50 border border-zinc-800 bg-zinc-900/80 transition-all group-hover:scale-105">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="font-medium text-white">
                          {crypto.name}
                        </div>
                        {crypto.isPositive ? (
                          <ArrowUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="text-primary mt-2 text-lg font-bold">
                        {crypto.priceFormatted}
                      </div>
                      <div
                        className={`mt-1 text-xs ${crypto.isPositive ? "text-green-500" : "text-red-500"}`}
                      >
                        {crypto.isPositive ? "+" : ""}
                        {crypto.changePercent.toFixed(2)}%
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>

          <div className="pt-4 text-center text-sm text-gray-400">
            <p>Precios actualizados desde fuentes oficiales en tiempo real</p>
            <p className="mt-1">
              Haz clic en cualquier activo para más información detallada
            </p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <a
                href={MARKET_SOURCES.CRYPTO.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-xs hover:underline"
              >
                CoinMarketCap
              </a>
              <span className="text-zinc-600">•</span>
              <a
                href={MARKET_SOURCES.COLOMBIA.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-xs hover:underline"
              >
                Investing.com
              </a>
              <span className="text-zinc-600">•</span>
              <a
                href={MARKET_SOURCES.USA.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-xs hover:underline"
              >
                Yahoo Finance
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
