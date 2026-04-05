import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, TrendingUp } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  publishedAt: string;
  timeAgo: string;
}

export const NewsFeed = () => {
  // Datos de ejemplo para el feed de noticias
  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: "Bitcoin supera los $43,000 por primera vez desde marzo",
      summary:
        "La principal criptomoneda continúa su tendencia alcista en medio de una creciente adopción institucional.",
      publishedAt: "2025-04-01T09:45:00.000Z",
      timeAgo: "1h",
    },
    {
      id: 2,
      title: "Ecopetrol anuncia nuevo descubrimiento en el Caribe colombiano",
      summary:
        "La petrolera colombiana confirmó un hallazgo significativo que podría aumentar las reservas nacionales.",
      publishedAt: "2025-04-01T08:30:00.000Z",
      timeAgo: "2h",
    },
    {
      id: 3,
      title: "La Fed mantiene tasas de interés sin cambios",
      summary:
        "El banco central de EE.UU. decidió mantener las tasas en su nivel actual, señalando preocupaciones sobre la inflación.",
      publishedAt: "2025-03-31T16:00:00.000Z",
      timeAgo: "18h",
    },
    {
      id: 4,
      title: "Apple presenta nueva línea de dispositivos con IA integrada",
      summary:
        "La compañía de Cupertino reveló productos con capacidades avanzadas de inteligencia artificial.",
      publishedAt: "2025-03-31T14:20:00.000Z",
      timeAgo: "20h",
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">Noticias Financieras</CardTitle>
          <CardDescription>Actualizaciones del mercado</CardDescription>
        </div>
        <Badge
          variant="outline"
          className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500"
        >
          <TrendingUp className="mr-1 h-3 w-3" />
          Premium
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="border-b pb-3 last:border-b-0 last:pb-0"
            >
              <h3 className="mb-1 font-medium">{item.title}</h3>
              <p className="text-muted-foreground mb-2 text-xs">
                {item.summary}
              </p>
              <div className="text-muted-foreground flex items-center text-xs">
                <CalendarDays className="mr-1 h-3 w-3" />
                <span>{formatDate(item.publishedAt)}</span>
                <span className="mx-2">•</span>
                <span>{item.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
