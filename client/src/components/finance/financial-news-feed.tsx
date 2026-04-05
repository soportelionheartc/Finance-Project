import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Clock,
  Newspaper,
  LineChart,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Tipos para las noticias financieras
interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: "CNBC" | "Yahoo Finance" | "Investing";
  publishedAt: string;
  timeAgo: string;
  category?: string;
}

export default function FinancialNewsFeed() {
  const [isLoading, setIsLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);

        // En producción, esto debería usar las APIs reales de CNBC, Yahoo Finance e Investing
        // pero para este prototipo, usaremos datos simulados

        // Simular un retardo de carga
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Datos de ejemplo - reemplazar con las APIs reales en producción
        const mockNews: NewsItem[] = [
          {
            title: "La Fed mantiene tasas de interés entre 5.25% y 5.5%",
            summary:
              "La Reserva Federal de EE.UU. decidió mantener las tasas de interés sin cambios, en línea con las expectativas del mercado y señaló que podría comenzar a recortar las tasas en los próximos meses.",
            url: "https://www.cnbc.com/fed-decision",
            source: "CNBC",
            publishedAt: "2025-04-01T14:30:00Z",
            timeAgo: "2 horas",
            category: "Política Monetaria",
          },
          {
            title: "Bitcoin supera los $100,000 por primera vez en su historia",
            summary:
              "La principal criptomoneda del mercado ha alcanzado un nuevo máximo histórico, impulsada por la adopción institucional y la creciente demanda de ETFs de Bitcoin.",
            url: "https://finance.yahoo.com/crypto-bitcoin-record",
            source: "Yahoo Finance",
            publishedAt: "2025-04-01T10:45:00Z",
            timeAgo: "6 horas",
            category: "Criptomonedas",
          },
          {
            title: "Apple anuncia nuevos dispositivos en evento de primavera",
            summary:
              "La empresa de tecnología reveló nuevos productos que superaron las expectativas del mercado, enviando sus acciones a máximos históricos durante la sesión.",
            url: "https://www.investing.com/apple-event",
            source: "Investing",
            publishedAt: "2025-04-01T12:15:00Z",
            timeAgo: "4 horas",
            category: "Tecnología",
          },
          {
            title: "China presenta nuevo paquete de estímulo económico",
            summary:
              "El gobierno chino anunció medidas por valor de $1.2 billones para estimular su economía en medio de preocupaciones por la desaceleración del crecimiento.",
            url: "https://www.cnbc.com/china-stimulus",
            source: "CNBC",
            publishedAt: "2025-04-01T09:20:00Z",
            timeAgo: "7 horas",
            category: "Economía Global",
          },
          {
            title:
              "Petroleras suben tras anuncio de recortes de producción de la OPEP+",
            summary:
              "Las acciones de las principales empresas petroleras se dispararon después de que la OPEP+ anunciara recortes adicionales en la producción de petróleo.",
            url: "https://finance.yahoo.com/oil-stocks-surge",
            source: "Yahoo Finance",
            publishedAt: "2025-04-01T11:30:00Z",
            timeAgo: "5 horas",
            category: "Energía",
          },
          {
            title:
              "El euro se fortalece frente al dólar tras datos económicos positivos",
            summary:
              "La moneda europea ganó terreno después de que los datos de inflación y empleo en la eurozona superaran las expectativas de los analistas.",
            url: "https://www.investing.com/forex-euro-dollar",
            source: "Investing",
            publishedAt: "2025-04-01T13:45:00Z",
            timeAgo: "3 horas",
            category: "Forex",
          },
          {
            title: "Tesla reporta entregas récord en el primer trimestre",
            summary:
              "El fabricante de vehículos eléctricos superó las expectativas con entregas que aumentaron un 25% respecto al mismo período del año anterior.",
            url: "https://www.cnbc.com/tesla-deliveries",
            source: "CNBC",
            publishedAt: "2025-04-01T08:15:00Z",
            timeAgo: "8 horas",
            category: "Automotriz",
          },
          {
            title:
              "Nuevas regulaciones para criptomonedas en EE.UU. podrían ser inminentes",
            summary:
              "Fuentes cercanas a la SEC indican que el organismo regulador podría anunciar un nuevo marco normativo para activos digitales en las próximas semanas.",
            url: "https://finance.yahoo.com/crypto-regulations",
            source: "Yahoo Finance",
            publishedAt: "2025-04-01T15:10:00Z",
            timeAgo: "1 hora",
            category: "Regulación",
          },
          {
            title:
              "Mercados europeos cierran al alza por segundo día consecutivo",
            summary:
              "Los principales índices bursátiles europeos terminaron la sesión con ganancias significativas, impulsados por resultados corporativos positivos.",
            url: "https://www.investing.com/european-markets",
            source: "Investing",
            publishedAt: "2025-04-01T16:30:00Z",
            timeAgo: "30 minutos",
            category: "Mercados Europeos",
          },
        ];

        // Organizamos las noticias por fuente y tomamos las 3 más recientes de cada una
        const cnbcNews = mockNews
          .filter((item) => item.source === "CNBC")
          .slice(0, 3);
        const yahooNews = mockNews
          .filter((item) => item.source === "Yahoo Finance")
          .slice(0, 3);
        const investingNews = mockNews
          .filter((item) => item.source === "Investing")
          .slice(0, 3);

        // Combinamos todas las noticias
        setNews([...cnbcNews, ...yahooNews, ...investingNews]);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching financial news:", err);
        setError(
          "No se pudieron cargar las noticias financieras. Por favor, intenta de nuevo más tarde.",
        );
        setIsLoading(false);
      }
    };

    fetchNews();

    // Configurar actualización automática cada 3 horas (en milisegundos)
    const updateInterval = setInterval(fetchNews, 3 * 60 * 60 * 1000);

    return () => clearInterval(updateInterval);
  }, []);

  // Agrupar noticias por fuente
  const cnbcNews = news.filter((item) => item.source === "CNBC");
  const yahooNews = news.filter((item) => item.source === "Yahoo Finance");
  const investingNews = news.filter((item) => item.source === "Investing");

  // Función para renderizar el icono de la fuente
  const getSourceIcon = (source: string) => {
    switch (source) {
      case "CNBC":
        return <TrendingUp className="mr-1 h-4 w-4" />;
      case "Yahoo Finance":
        return <LineChart className="mr-1 h-4 w-4" />;
      case "Investing":
        return <Newspaper className="mr-1 h-4 w-4" />;
      default:
        return <Newspaper className="mr-1 h-4 w-4" />;
    }
  };

  // Función para obtener el color de badge según la fuente
  const getSourceColor = (source: string): string => {
    switch (source) {
      case "CNBC":
        return "bg-blue-950 text-blue-400 border-blue-800/30";
      case "Yahoo Finance":
        return "bg-purple-950 text-purple-400 border-purple-800/30";
      case "Investing":
        return "bg-green-950 text-green-400 border-green-800/30";
      default:
        return "bg-black text-primary border-primary/30";
    }
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
        <Button
          variant="outline"
          className="mt-4 border-red-500/30 text-red-500 hover:bg-red-500/10"
          onClick={() => window.location.reload()}
        >
          Intentar de nuevo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sección CNBC */}
      <div>
        <h3 className="text-md mb-3 flex items-center font-medium">
          <TrendingUp className="mr-2 h-4 w-4 text-blue-400" />
          <span className="text-blue-400">CNBC</span>
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="border-gray-800 bg-black">
                    <CardContent className="space-y-3 p-4">
                      <Skeleton className="h-4 w-24 bg-blue-950/40" />
                      <Skeleton className="h-5 w-full bg-blue-950/40" />
                      <Skeleton className="h-4 w-full bg-blue-950/40" />
                      <Skeleton className="h-4 w-full bg-blue-950/40" />
                      <div className="flex justify-between pt-2">
                        <Skeleton className="h-3 w-20 bg-blue-950/40" />
                        <Skeleton className="h-3 w-16 bg-blue-950/40" />
                      </div>
                    </CardContent>
                  </Card>
                ))
            : cnbcNews.map((item, index) => (
                <Card
                  key={index}
                  className="border-gray-800 bg-black transition-all hover:border-blue-600/30"
                >
                  <CardContent className="relative space-y-2 p-4">
                    {item.category && (
                      <Badge
                        variant="outline"
                        className="border-blue-800/30 bg-black/50 text-blue-400"
                      >
                        {item.category}
                      </Badge>
                    )}

                    <h4 className="line-clamp-2 text-sm font-medium text-white">
                      {item.title}
                    </h4>

                    <p className="line-clamp-2 text-xs text-gray-400">
                      {item.summary}
                    </p>

                    <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {item.timeAgo}
                      </div>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-400 hover:underline"
                      >
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Ver
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>

      {/* Sección Yahoo Finance */}
      <div>
        <h3 className="text-md mb-3 flex items-center font-medium">
          <LineChart className="mr-2 h-4 w-4 text-purple-400" />
          <span className="text-purple-400">Yahoo Finance</span>
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="border-gray-800 bg-black">
                    <CardContent className="space-y-3 p-4">
                      <Skeleton className="h-4 w-24 bg-purple-950/40" />
                      <Skeleton className="h-5 w-full bg-purple-950/40" />
                      <Skeleton className="h-4 w-full bg-purple-950/40" />
                      <Skeleton className="h-4 w-full bg-purple-950/40" />
                      <div className="flex justify-between pt-2">
                        <Skeleton className="h-3 w-20 bg-purple-950/40" />
                        <Skeleton className="h-3 w-16 bg-purple-950/40" />
                      </div>
                    </CardContent>
                  </Card>
                ))
            : yahooNews.map((item, index) => (
                <Card
                  key={index}
                  className="border-gray-800 bg-black transition-all hover:border-purple-600/30"
                >
                  <CardContent className="relative space-y-2 p-4">
                    {item.category && (
                      <Badge
                        variant="outline"
                        className="border-purple-800/30 bg-black/50 text-purple-400"
                      >
                        {item.category}
                      </Badge>
                    )}

                    <h4 className="line-clamp-2 text-sm font-medium text-white">
                      {item.title}
                    </h4>

                    <p className="line-clamp-2 text-xs text-gray-400">
                      {item.summary}
                    </p>

                    <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {item.timeAgo}
                      </div>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-purple-400 hover:underline"
                      >
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Ver
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>

      {/* Sección Investing */}
      <div>
        <h3 className="text-md mb-3 flex items-center font-medium">
          <Newspaper className="mr-2 h-4 w-4 text-green-400" />
          <span className="text-green-400">Investing</span>
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="border-gray-800 bg-black">
                    <CardContent className="space-y-3 p-4">
                      <Skeleton className="h-4 w-24 bg-green-950/40" />
                      <Skeleton className="h-5 w-full bg-green-950/40" />
                      <Skeleton className="h-4 w-full bg-green-950/40" />
                      <Skeleton className="h-4 w-full bg-green-950/40" />
                      <div className="flex justify-between pt-2">
                        <Skeleton className="h-3 w-20 bg-green-950/40" />
                        <Skeleton className="h-3 w-16 bg-green-950/40" />
                      </div>
                    </CardContent>
                  </Card>
                ))
            : investingNews.map((item, index) => (
                <Card
                  key={index}
                  className="border-gray-800 bg-black transition-all hover:border-green-600/30"
                >
                  <CardContent className="relative space-y-2 p-4">
                    {item.category && (
                      <Badge
                        variant="outline"
                        className="border-green-800/30 bg-black/50 text-green-400"
                      >
                        {item.category}
                      </Badge>
                    )}

                    <h4 className="line-clamp-2 text-sm font-medium text-white">
                      {item.title}
                    </h4>

                    <p className="line-clamp-2 text-xs text-gray-400">
                      {item.summary}
                    </p>

                    <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {item.timeAgo}
                      </div>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-green-400 hover:underline"
                      >
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Ver
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>

      <div className="pt-2 text-center text-xs text-gray-500">
        <p>Las noticias se actualizan automáticamente cada 3 horas</p>
        <p>Última actualización: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}
