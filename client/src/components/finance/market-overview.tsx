import { useState, useEffect } from 'react';
import { getColombianStocks, getUSStocks, getCryptos, type Stock, type Crypto, MARKET_SOURCES } from '@/services/financial-api';
import { TrendingUp, RefreshCw, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
        getCryptos()
      ]);
      
      setColombianStocks(colombiaData);
      setUSStocks(usData);
      setCryptos(cryptoData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error al cargar datos financieros:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadFinancialData();
    
    // Actualizar automáticamente cada 5 minutos
    const intervalId = setInterval(() => {
      loadFinancialData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Formatear el timestamp de última actualización
  const formattedLastUpdated = lastUpdated ? 
    lastUpdated.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) : '';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-lg font-bold text-white">
            Mercados Financieros
          </h2>
        </div>
        <div className="flex items-center">
          {lastUpdated && (
            <span className="text-xs text-gray-400 mr-3">
              Actualizado: {formattedLastUpdated}
            </span>
          )}
          <button 
            onClick={() => loadFinancialData()}
            disabled={isRefreshing}
            className="bg-black border border-primary text-primary rounded-full p-1 hover:bg-primary/10 transition-colors disabled:opacity-50"
            aria-label="Actualizar datos"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Acciones colombianas */}
          <div className="space-y-3">
            <a 
              href={MARKET_SOURCES.COLOMBIA.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline flex items-center"
            >
              Acciones Colombia (BVC)
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {colombianStocks.map((stock) => (
                <a 
                  key={stock.ticker}
                  href={stock.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="bg-zinc-900/80 border border-zinc-800 hover:border-primary/50 transition-all group-hover:scale-105">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-white">{stock.company}</div>
                        {stock.isPositive ? (
                          <ArrowUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="mt-2 text-lg font-bold text-primary">
                        {stock.priceFormatted}
                      </div>
                      <div className={`text-xs mt-1 ${stock.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
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
              className="text-primary font-semibold hover:underline flex items-center"
            >
              Acciones USA (NYSE/NASDAQ)
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {usStocks.map((stock) => (
                <a 
                  key={stock.ticker}
                  href={stock.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="bg-zinc-900/80 border border-zinc-800 hover:border-primary/50 transition-all group-hover:scale-105">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-white">{stock.company}</div>
                        {stock.isPositive ? (
                          <ArrowUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="mt-2 text-lg font-bold text-primary">
                        {stock.priceFormatted}
                      </div>
                      <div className={`text-xs mt-1 ${stock.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
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
              className="text-primary font-semibold hover:underline flex items-center"
            >
              Criptomonedas
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {cryptos.map((crypto) => (
                <a 
                  key={crypto.ticker}
                  href={crypto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="bg-zinc-900/80 border border-zinc-800 hover:border-primary/50 transition-all group-hover:scale-105">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-white">{crypto.name}</div>
                        {crypto.isPositive ? (
                          <ArrowUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="mt-2 text-lg font-bold text-primary">
                        {crypto.priceFormatted}
                      </div>
                      <div className={`text-xs mt-1 ${crypto.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {crypto.isPositive ? '+' : ''}{crypto.changePercent.toFixed(2)}%
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-center text-gray-400 pt-4">
            <p>Precios actualizados desde fuentes oficiales en tiempo real</p>
            <p className="mt-1">Haz clic en cualquier activo para más información detallada</p>
            <div className="flex justify-center items-center gap-2 mt-2">
              <a href={MARKET_SOURCES.CRYPTO.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">CoinMarketCap</a>
              <span className="text-zinc-600">•</span>
              <a href={MARKET_SOURCES.COLOMBIA.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">Investing.com</a>
              <span className="text-zinc-600">•</span>
              <a href={MARKET_SOURCES.USA.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">Yahoo Finance</a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}