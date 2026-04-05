import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Calendar,
  ShieldAlert,
  Building,
  FileText,
  ClipboardList,
  Search,
  Coins,
  Brain,
  ChevronRight,
  ArrowLeft,
  TrendingUp,
  Share2,
  BarChart3,
  Globe,
  Star,
  ChevronDown,
  MessageCircle,
  Linkedin,
  Instagram,
  Facebook,
  ShoppingCart,
} from "lucide-react";
import { Link } from "wouter";
import { LionLogo } from "@/components/ui/lion-logo";
import { SiKickstarter, SiTiktok, SiTwitch } from "react-icons/si";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header con efecto de gradiente */}
      <header className="border-border/40 from-primary/20 border-b bg-linear-to-r to-black p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <div className="flex cursor-pointer items-center gap-3">
              <div className="relative">
                <div className="flex items-center gap-3"></div>
                <LionLogo className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-gradient bg-linear-to-r from-yellow-400 to-yellow-600 bg-clip-text text-lg font-bold text-transparent">
                  LION HEART CAPITAL
                </h1>
              </div>
            </div>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-8">
        {/* Hero Section con animación */}
        <div className="relative mb-10">
          <div className="from-primary/20 absolute inset-0 rounded-2xl bg-linear-to-br to-transparent"></div>
          <div className="relative z-10 p-6">
            <div className="mb-6 flex items-center">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="hover:bg-primary/20 mr-2 flex items-center"
                >
                  <ArrowLeft className="mr-1 h-5 w-5" />
                  Regresar
                </Button>
              </Link>
              <h2 className="bg-linear-to-r from-white to-gray-400 bg-clip-text text-2xl font-bold text-transparent">
                Servicios Financieros
              </h2>
            </div>

            <div className="mb-8 transform text-center transition-all duration-300 hover:scale-105">
              <div className="shadow-primary/20 inline-block rounded-xl border border-yellow-600/30 bg-black/40 p-6 shadow-lg">
                <h2 className="mb-2 bg-linear-to-r from-yellow-400 to-yellow-600 bg-clip-text text-3xl font-extrabold text-transparent">
                  LION HEART CAPITAL
                </h2>
                <p className="text-xl text-gray-300">
                  FINANZAS E INVERSIONES DE ALTO IMPACTO
                </p>
                <div className="mt-4 flex justify-center">
                  <span className="text-primary border-primary/20 inline-flex items-center rounded-full border bg-black px-3 py-1 text-xs">
                    <Star className="mr-1 h-3 w-3" /> Consultora Top
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="relative mb-6 inline-block text-lg font-semibold">
            <span className="bg-linear-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Servicios Financieros Premium
            </span>
            <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-linear-to-r from-yellow-400 to-yellow-600"></div>
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="group hover:shadow-primary/10 flex items-start rounded-lg border border-yellow-600/10 bg-black/40 p-4 transition-all duration-300 hover:scale-[1.02] hover:transform hover:border-yellow-600/30 hover:shadow-lg">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-linear-to-r from-yellow-500 to-yellow-600 opacity-0 blur-xs transition-opacity group-hover:opacity-60"></div>
                <div className="relative z-10 mt-1 mr-4 rounded-full border border-yellow-600/20 bg-black/40 p-2 text-yellow-500">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h4 className="mb-1 text-lg font-medium transition-colors group-hover:text-yellow-500">
                  Consultoría financiera
                </h4>
                <p className="text-sm text-gray-400">
                  Asesoramiento personalizado y exclusivo para optimizar tus
                  finanzas personales o empresariales, maximizando rendimientos
                  y reduciendo costos.
                </p>
                <div className="mt-3 hidden transition-all group-hover:block">
                  <Link href="/contacto">
                    <Button
                      variant="link"
                      className="flex items-center px-0 text-xs text-yellow-500 hover:text-yellow-400"
                    >
                      Solicitar asesoría{" "}
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="group hover:shadow-primary/10 flex items-start rounded-lg border border-yellow-600/10 bg-black/40 p-4 transition-all duration-300 hover:scale-[1.02] hover:transform hover:border-yellow-600/30 hover:shadow-lg">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-linear-to-r from-orange-500 to-orange-600 opacity-0 blur-xs transition-opacity group-hover:opacity-60"></div>
                <div className="relative z-10 mt-1 mr-4 rounded-full border border-orange-600/20 bg-black/40 p-2 text-orange-500">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h4 className="mb-1 text-lg font-medium transition-colors group-hover:text-orange-500">
                  Planificación financiera
                </h4>
                <p className="text-sm text-gray-400">
                  Estrategias personalizadas a largo plazo para alcanzar tus
                  objetivos financieros y patrimoniales con planes de acción
                  concretos.
                </p>
                <div className="mt-3 hidden transition-all group-hover:block">
                  <Link href="/contacto">
                    <Button
                      variant="link"
                      className="flex items-center px-0 text-xs text-orange-500 hover:text-orange-400"
                    >
                      Solicitar plan <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="group hover:shadow-primary/10 flex items-start rounded-lg border border-yellow-600/10 bg-black/40 p-4 transition-all duration-300 hover:scale-[1.02] hover:transform hover:border-yellow-600/30 hover:shadow-lg">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-linear-to-r from-red-500 to-red-600 opacity-0 blur-xs transition-opacity group-hover:opacity-60"></div>
                <div className="relative z-10 mt-1 mr-4 rounded-full border border-red-600/20 bg-black/40 p-2 text-red-500">
                  <ShieldAlert className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h4 className="mb-1 text-lg font-medium transition-colors group-hover:text-red-500">
                  Gestión de riesgos financieros
                </h4>
                <p className="text-sm text-gray-400">
                  Análisis y mitigación exhaustiva de riesgos con protección
                  avanzada para tu patrimonio e inversiones en todo tipo de
                  mercados.
                </p>
                <div className="mt-3 hidden transition-all group-hover:block">
                  <Link href="/contacto">
                    <Button
                      variant="link"
                      className="flex items-center px-0 text-xs text-red-500 hover:text-red-400"
                    >
                      Evaluar riesgos <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="relative mb-6 inline-block text-lg font-semibold">
            <span className="bg-linear-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Servicios Contables y Tributarios
            </span>
            <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-linear-to-r from-yellow-400 to-yellow-600"></div>
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="group rounded-lg border border-yellow-600/10 bg-black/40 p-5 transition-all duration-300 hover:scale-[1.02] hover:transform hover:border-yellow-600/30">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-teal-600/20 bg-black/50 transition-all group-hover:border-teal-500/40">
                <Building className="h-7 w-7 text-teal-500" />
              </div>
              <h4 className="mb-2 text-center font-medium transition-colors group-hover:text-teal-500">
                Contabilidad empresarial
              </h4>
              <p className="text-center text-xs text-gray-400">
                Mantenemos tus registros contables en orden y conformidad con la
                normativa vigente.
              </p>
            </div>

            <div className="group rounded-lg border border-yellow-600/10 bg-black/40 p-5 transition-all duration-300 hover:scale-[1.02] hover:transform hover:border-yellow-600/30">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-purple-600/20 bg-black/50 transition-all group-hover:border-purple-500/40">
                <FileText className="h-7 w-7 text-purple-500" />
              </div>
              <h4 className="mb-2 text-center font-medium transition-colors group-hover:text-purple-500">
                Declaraciones de renta
              </h4>
              <p className="text-center text-xs text-gray-400">
                Preparación y presentación de declaraciones para personas
                naturales y jurídicas.
              </p>
            </div>

            <div className="group rounded-lg border border-yellow-600/10 bg-black/40 p-5 transition-all duration-300 hover:scale-[1.02] hover:transform hover:border-yellow-600/30">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-blue-600/20 bg-black/50 transition-all group-hover:border-blue-500/40">
                <ClipboardList className="h-7 w-7 text-blue-500" />
              </div>
              <h4 className="mb-2 text-center font-medium transition-colors group-hover:text-blue-500">
                Outsourcing contable
              </h4>
              <p className="text-center text-xs text-gray-400">
                Externaliza tu departamento contable con nuestro equipo
                especializado.
              </p>
            </div>

            <div className="group rounded-lg border border-yellow-600/10 bg-black/40 p-5 transition-all duration-300 hover:scale-[1.02] hover:transform hover:border-yellow-600/30">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-amber-600/20 bg-black/50 transition-all group-hover:border-amber-500/40">
                <Search className="h-7 w-7 text-amber-500" />
              </div>
              <h4 className="mb-2 text-center font-medium transition-colors group-hover:text-amber-500">
                Auditorías contables
              </h4>
              <p className="text-center text-xs text-gray-400">
                Revisión exhaustiva de tus estados financieros para garantizar
                su precisión.
              </p>
            </div>

            <div className="group rounded-lg border border-yellow-600/10 bg-black/40 p-5 transition-all duration-300 hover:scale-[1.02] hover:transform hover:border-yellow-600/30">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-yellow-600/20 bg-black/50 transition-all group-hover:border-yellow-500/40">
                <DollarSign className="h-7 w-7 text-yellow-500" />
              </div>
              <h4 className="mb-2 text-center font-medium transition-colors group-hover:text-yellow-500">
                Asesoría fiscal
              </h4>
              <p className="text-center text-xs text-gray-400">
                Optimización fiscal y cumplimiento con las obligaciones
                tributarias.
              </p>
            </div>

            <div className="group rounded-lg border border-green-600/10 bg-black/40 p-5 transition-all duration-300 hover:scale-[1.02] hover:transform hover:border-green-600/30">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-green-600/20 bg-black/50 transition-all group-hover:border-green-500/40">
                <DollarSign className="h-7 w-7 text-green-500" />
              </div>
              <h4 className="mb-2 text-center font-medium transition-colors group-hover:text-green-500">
                Sistema POS y Facturación
              </h4>
              <p className="text-center text-xs text-gray-400">
                Implementación de sistemas de punto de venta y facturación
                electrónica para empresas y restaurantes.
              </p>
            </div>

            <div className="group rounded-lg border border-yellow-600/30 bg-linear-to-br from-yellow-500/10 to-yellow-600/20 p-5 transition-all duration-300 hover:scale-[1.02] hover:transform hover:border-yellow-500/60">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-yellow-600/40 bg-black/50 transition-all group-hover:border-yellow-500/80">
                <Star className="h-7 w-7 text-yellow-400" />
              </div>
              <h4 className="mb-2 text-center font-medium text-yellow-500 transition-colors">
                Paquete Premium
              </h4>
              <p className="text-center text-xs text-gray-300">
                Accede a todos nuestros servicios contables con atención
                prioritaria y beneficios exclusivos.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="relative mb-4 inline-block text-lg font-semibold">
            <span className="bg-linear-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Asesoría en Inversiones y Manejo
            </span>
            <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-linear-to-r from-yellow-400 to-yellow-600"></div>
          </h3>
          <div className="mb-6 rounded-lg border border-gray-800 bg-black p-6 shadow-lg shadow-black/10 backdrop-blur-sm transition-all hover:border-yellow-500/20">
            <p className="text-gray-300">
              Ofrecemos asesoría especializada en inversiones y manejo de
              activos para maximizar tus rendimientos y minimizar riesgos.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="group rounded-lg border border-gray-800 bg-black p-5 transition-all hover:border-yellow-600/30 hover:bg-black/80">
              <h4 className="mb-2 flex items-center font-medium transition-colors group-hover:text-yellow-500">
                <DollarSign className="mr-2 h-4 w-4 text-yellow-500" />
                Análisis de Mercados
              </h4>
              <p className="text-sm text-gray-400">
                Evaluación continua de oportunidades en mercados globales con
                insights accionables.
              </p>
            </div>
            <div className="group rounded-lg border border-gray-800 bg-black p-5 transition-all hover:border-yellow-600/30 hover:bg-black/80">
              <h4 className="mb-2 flex items-center font-medium transition-colors group-hover:text-yellow-500">
                <Coins className="mr-2 h-4 w-4 text-yellow-500" />
                Gestión de Criptoactivos
              </h4>
              <p className="text-sm text-gray-400">
                Estrategias especializadas para inversión en criptomonedas y
                activos digitales.
              </p>
            </div>
            <div className="group rounded-lg border border-gray-800 bg-black p-5 transition-all hover:border-yellow-600/30 hover:bg-black/80">
              <h4 className="mb-2 flex items-center font-medium transition-colors group-hover:text-yellow-500">
                <DollarSign className="mr-2 h-4 w-4 text-yellow-500" />
                Trading Automatizado
              </h4>
              <p className="text-sm text-gray-400">
                Implementación de estrategias algorítmicas basadas en medias
                móviles y otros indicadores.
              </p>
            </div>
            <div className="group rounded-lg border border-gray-800 bg-black p-5 transition-all hover:border-yellow-600/30 hover:bg-black/80">
              <h4 className="mb-2 flex items-center font-medium transition-colors group-hover:text-yellow-500">
                <Brain className="mr-2 h-4 w-4 text-yellow-500" />
                Análisis con IA
              </h4>
              <p className="text-sm text-gray-400">
                Modelos predictivos avanzados para optimizar decisiones de
                inversión.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/contacto">
            <Button className="bg-linear-to-r from-yellow-500 to-yellow-600 px-6 py-3 font-medium text-black transition-opacity hover:opacity-90">
              <DollarSign className="mr-2 h-4 w-4" />
              Escríbenos para una asesoría gratuita
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-8 rounded-lg border-t border-zinc-800 bg-black p-8 text-center text-sm text-gray-400">
          <div className="mb-6 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col items-center md:items-start">
              <div className="mb-3">
                <p className="text-primary font-bold">
                  Lion Heart Capital S.A.S.
                </p>
              </div>
              <p className="mb-3 text-sm">
                Consultores financieros especializados en inversiones y gestión
                de activos.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-primary text-sm">Contacto:</span>
                <a
                  href="mailto:lionheartcapital1303@gmail.com"
                  className="hover:text-primary text-sm transition-colors"
                >
                  lionheartcapital1303@gmail.com
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <h3 className="text-primary mb-4 font-medium">Síguenos</h3>
              <div className="mb-4 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/+573000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-primary/30 text-primary hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full border bg-black transition-all"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/company/lionheartcapital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-primary/30 text-primary hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full border bg-black transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://kick.com/lionheartcapital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-primary/30 text-primary hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full border bg-black transition-all"
                  aria-label="Kick"
                >
                  <SiKickstarter className="h-5 w-5" />
                </a>
                <a
                  href="https://tiktok.com/@lionheartcapital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-primary/30 text-primary hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full border bg-black transition-all"
                  aria-label="TikTok"
                >
                  <SiTiktok className="h-5 w-5" />
                </a>
                <a
                  href="https://twitch.tv/lionheartcapital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-primary/30 text-primary hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full border bg-black transition-all"
                  aria-label="Twitch"
                >
                  <SiTwitch className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com/lionheartcapital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-primary/30 text-primary hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full border bg-black transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com/lionheartcapital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-primary/30 text-primary hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full border bg-black transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://lionheartcapital.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-primary/30 text-primary hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full border bg-black transition-all"
                  aria-label="Website"
                >
                  <Globe className="h-5 w-5" />
                </a>
              </div>
              <p className="text-xs">
                ¡Próximamente en App Store y Google Play!
              </p>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4 text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Lion Heart Capital S.A.S. Todos los
              derechos reservados.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
