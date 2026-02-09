import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Bookmark, Share2, TrendingUp, ChevronRight, Eye, MessageCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { LionLogo } from "@/assets/lion-logo";
import { SiKickstarter } from "react-icons/si";

// Interfaces para nuestro modelo
interface NewsItem {
  id: number;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  timeAgo: string;
  imageUrl?: string;
  premium: boolean;
}

export default function NoticiasPage() {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  // Simulación de carga de noticias
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockNewsItems: NewsItem[] = [
        {
          id: 1,
          title: "La Fed mantiene tasas de interés sin cambios",
          summary: "La Reserva Federal de Estados Unidos decidió mantener las tasas de interés sin cambios en su última reunión, en línea con las expectativas del mercado.",
          category: "Macroeconomía",
          publishedAt: "2025-03-30",
          timeAgo: "2 días",
          premium: false
        },
        {
          id: 2,
          title: "Bitcoin alcanza nuevo máximo histórico",
          summary: "La principal criptomoneda superó los $100,000 por primera vez en su historia, impulsada por la aprobación de nuevos ETFs y la adopción institucional.",
          category: "Criptomonedas",
          publishedAt: "2025-03-31",
          timeAgo: "1 día",
          premium: false
        },
        {
          id: 3,
          title: "Análisis técnico: S&P 500 en zona de sobrecompra",
          summary: "El indicador RSI del índice S&P 500 muestra niveles de sobrecompra que podrían anticipar una corrección en el corto plazo.",
          category: "Análisis Técnico",
          publishedAt: "2025-03-31",
          timeAgo: "5 horas",
          premium: true
        },
        {
          id: 4,
          title: "China anuncia nuevos estímulos económicos",
          summary: "El gobierno chino anunció un paquete de estímulos económicos de $1.2 billones para impulsar su economía en medio de la desaceleración del crecimiento.",
          category: "Economía Global",
          publishedAt: "2025-03-29",
          timeAgo: "3 días",
          premium: false
        },
        {
          id: 5,
          title: "Apple supera expectativas en resultados trimestrales",
          summary: "Las acciones de Apple subieron un 8% después de reportar resultados que superaron las expectativas de Wall Street, impulsados por ventas récord del iPhone 16.",
          category: "Acciones",
          publishedAt: "2025-03-28",
          timeAgo: "4 días",
          premium: false
        },
        {
          id: 6,
          title: "Estrategias de inversión para un entorno inflacionario",
          summary: "Expertos recomiendan diversificar portafolios con activos reales como commodities y REITS para protegerse contra la inflación persistente.",
          category: "Estrategias",
          publishedAt: "2025-03-30",
          timeAgo: "2 días",
          premium: true
        },
      ];

      // Extraer categorías únicas
      const uniqueCategories = Array.from(
        new Set(mockNewsItems.map(item => item.category))
      );
      
      setNewsItems(mockNewsItems);
      setCategories(uniqueCategories);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Filtrar noticias por categoría
  const filteredNews = selectedCategory === 'Todas' 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <LionLogo className="h-10 w-10" />
              <div>
                <h1 className="font-bold text-lg">LION HEART CAPITAL</h1>
              </div>
            </div>
          </Link>
          <Link href="/auth">
            <Button variant="secondary" size="sm">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Noticias Financieras</h1>
          <div className="text-sm text-muted-foreground">
            {selectedCategory !== "Todas" && (
              <Button
                variant="ghost"
                className="h-8 px-2"
                onClick={() => setSelectedCategory("Todas")}
              >
                <ChevronRight className="h-4 w-4 mr-1" />
                Ver todas
              </Button>
            )}
          </div>
        </div>

        {/* Categorías */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge
            className={`cursor-pointer py-1 px-3 ${selectedCategory === "Todas" ? "bg-black text-primary border-primary/30" : "bg-black border border-zinc-700"}`}
            onClick={() => setSelectedCategory("Todas")}
          >
            Todas
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category}
              className={`cursor-pointer py-1 px-3 ${selectedCategory === category ? "bg-black text-primary border-primary/30" : "bg-black border border-zinc-700"}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Noticias destacadas */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="bg-zinc-900 border-zinc-700 overflow-hidden"
              >
                <CardContent className="p-0">
                  <Skeleton className="h-40 w-full rounded-t-lg bg-black" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4 bg-black" />
                    <Skeleton className="h-4 w-full bg-black" />
                    <Skeleton className="h-4 w-full bg-black" />
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-4 w-24 bg-black" />
                      <Skeleton className="h-4 w-16 bg-black" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map((news) => (
              <Card
                key={news.id}
                className="bg-zinc-900 border-zinc-700 overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="h-40 bg-black flex items-center justify-center">
                    <TrendingUp className="h-16 w-16 text-primary/50" />
                  </div>
                  <div className="p-4 space-y-2 relative">
                    {news.premium && (
                      <Badge className="absolute top-4 right-4 bg-black text-primary border-primary/50">
                        Premium
                      </Badge>
                    )}

                    <Badge
                      variant="outline"
                      className="bg-black border-primary/30 text-primary"
                    >
                      {news.category}
                    </Badge>

                    <h3 className="font-medium text-lg line-clamp-2">
                      {news.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {news.summary}
                    </p>

                    <div className="flex justify-between items-center pt-2 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {news.timeAgo}
                      </div>

                      <div className="flex gap-2">
                        {news.premium ? (
                          <Link href="/auth">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full hover:text-primary hover:bg-primary/10"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                          >
                            <Share2 className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full"
                        >
                          <Bookmark className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Llamada a la acción */}
        <Card className="mt-8 bg-black border border-primary/30">
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-primary">
                  Accede a noticias y análisis premium
                </h3>
                <p className="text-gray-400">
                  Obtén acceso a análisis técnicos detallados, estrategias de
                  inversión exclusivas y alertas de mercado antes que nadie.
                </p>
                <Link href="/auth">
                  <Button
                    variant="outline"
                    className="border-primary text-primary mt-2"
                  >
                    Iniciar sesión para acceder
                  </Button>
                </Link>
              </div>
              <div className="flex justify-center">
                <div className="bg-black/50 p-8 rounded-full border border-primary/20">
                  <LionLogo className="h-32 w-32" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 p-6 text-center text-sm text-gray-400 mt-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-medium text-primary">Zupi Fintech</p>
              <p className="mt-2">Contacto: lionheartcapital1303@gmail.com</p>
            </div>

            <div className="space-y-4">
              <p className="font-medium text-primary">Síguenos</p>
              <div className="flex gap-4 justify-center">
                <a
                  href="https://wa.me/+573000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-primary text-primary rounded-full"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                </a>
                <a
                  href="https://kick.com/lionheartcapital"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-primary text-primary rounded-full"
                  >
                    <SiKickstarter className="h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p>¡Próximamente en App Store y Google Play!</p>
            <p className="text-xs mt-1">
              Descarga nuestra aplicación móvil para acceder a todas las
              funcionalidades desde tu dispositivo.
            </p>
          </div>

          <div className="mt-4">
            © {new Date().getFullYear()} Zupi Fintech. Todos los derechos
            reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}