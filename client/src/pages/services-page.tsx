import { Button } from "@/components/ui/button";
import { DollarSign, Calendar, ShieldAlert, Building, FileText, ClipboardList, Search, Coins, Brain, ChevronRight, ArrowLeft, TrendingUp, Share2, BarChart3, Globe, Star, ChevronDown, MessageCircle, Linkedin, Instagram, Facebook, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { LionLogo } from "@/assets/lion-logo";
import { SiKickstarter, SiTiktok, SiTwitch } from "react-icons/si";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header con efecto de gradiente */}
      <header className="border-b border-border/40 bg-gradient-to-r from-primary/20 to-black p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full blur-sm opacity-70"></div>
                <LionLogo className="h-10 w-10 relative z-10" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gradient bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">LION HEART CAPITAL</h1>
                <p className="text-xs text-muted-foreground">CONSULTORÍA FINANCIERA Y DE INVERSIÓN</p>
              </div>
            </div>
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4 max-w-5xl">
        {/* Hero Section con animación */}
        <div className="mb-10 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl"></div>
          <div className="relative z-10 p-6">
            <div className="flex items-center mb-6">
              <Link href="/">
                <Button variant="ghost" className="mr-2 hover:bg-primary/20 flex items-center">
                  <ArrowLeft className="h-5 w-5 mr-1" />
                  Regresar
                </Button>
              </Link>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Servicios Financieros</h2>
            </div>
            
            <div className="text-center mb-8 transform transition-all hover:scale-105 duration-300">
              <div className="inline-block p-6 bg-black/40 rounded-xl border border-yellow-600/30 shadow-lg shadow-primary/20">
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">LION HEART CAPITAL</h2>
                <p className="text-xl text-gray-300">FINANZAS E INVERSIONES DE ALTO IMPACTO</p>
                <div className="flex justify-center mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-black text-primary border border-primary/20 text-xs">
                    <Star className="h-3 w-3 mr-1" /> Consultora Top
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-6 relative inline-block">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">Servicios Financieros Premium</span>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start p-4 bg-black/40 rounded-lg border border-yellow-600/10 hover:border-yellow-600/30 transition-all group hover:transform hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 duration-300">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full blur-sm opacity-0 group-hover:opacity-60 transition-opacity"></div>
                <div className="text-yellow-500 mr-4 mt-1 p-2 bg-black/40 rounded-full border border-yellow-600/20 relative z-10">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-lg mb-1 group-hover:text-yellow-500 transition-colors">Consultoría financiera</h4>
                <p className="text-sm text-gray-400">Asesoramiento personalizado y exclusivo para optimizar tus finanzas personales o empresariales, maximizando rendimientos y reduciendo costos.</p>
                <div className="mt-3 hidden group-hover:block transition-all">
                  <Link href="/contacto">
                    <Button variant="link" className="text-xs text-yellow-500 hover:text-yellow-400 px-0 flex items-center">
                      Solicitar asesoría <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-black/40 rounded-lg border border-yellow-600/10 hover:border-yellow-600/30 transition-all group hover:transform hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 duration-300">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full blur-sm opacity-0 group-hover:opacity-60 transition-opacity"></div>
                <div className="text-orange-500 mr-4 mt-1 p-2 bg-black/40 rounded-full border border-orange-600/20 relative z-10">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-lg mb-1 group-hover:text-orange-500 transition-colors">Planificación financiera</h4>
                <p className="text-sm text-gray-400">Estrategias personalizadas a largo plazo para alcanzar tus objetivos financieros y patrimoniales con planes de acción concretos.</p>
                <div className="mt-3 hidden group-hover:block transition-all">
                  <Link href="/contacto">
                    <Button variant="link" className="text-xs text-orange-500 hover:text-orange-400 px-0 flex items-center">
                      Solicitar plan <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-black/40 rounded-lg border border-yellow-600/10 hover:border-yellow-600/30 transition-all group hover:transform hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 duration-300">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur-sm opacity-0 group-hover:opacity-60 transition-opacity"></div>
                <div className="text-red-500 mr-4 mt-1 p-2 bg-black/40 rounded-full border border-red-600/20 relative z-10">
                  <ShieldAlert className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-lg mb-1 group-hover:text-red-500 transition-colors">Gestión de riesgos financieros</h4>
                <p className="text-sm text-gray-400">Análisis y mitigación exhaustiva de riesgos con protección avanzada para tu patrimonio e inversiones en todo tipo de mercados.</p>
                <div className="mt-3 hidden group-hover:block transition-all">
                  <Link href="/contacto">
                    <Button variant="link" className="text-xs text-red-500 hover:text-red-400 px-0 flex items-center">
                      Evaluar riesgos <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-6 relative inline-block">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">Servicios Contables y Tributarios</span>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/40 p-5 rounded-lg border border-yellow-600/10 hover:border-yellow-600/30 transition-all group hover:transform hover:scale-[1.02] duration-300">
              <div className="h-14 w-14 mx-auto mb-3 bg-black/50 rounded-full flex items-center justify-center border border-teal-600/20 group-hover:border-teal-500/40 transition-all">
                <Building className="h-7 w-7 text-teal-500" />
              </div>
              <h4 className="font-medium text-center mb-2 group-hover:text-teal-500 transition-colors">Contabilidad empresarial</h4>
              <p className="text-xs text-gray-400 text-center">Mantenemos tus registros contables en orden y conformidad con la normativa vigente.</p>
            </div>
            
            <div className="bg-black/40 p-5 rounded-lg border border-yellow-600/10 hover:border-yellow-600/30 transition-all group hover:transform hover:scale-[1.02] duration-300">
              <div className="h-14 w-14 mx-auto mb-3 bg-black/50 rounded-full flex items-center justify-center border border-purple-600/20 group-hover:border-purple-500/40 transition-all">
                <FileText className="h-7 w-7 text-purple-500" />
              </div>
              <h4 className="font-medium text-center mb-2 group-hover:text-purple-500 transition-colors">Declaraciones de renta</h4>
              <p className="text-xs text-gray-400 text-center">Preparación y presentación de declaraciones para personas naturales y jurídicas.</p>
            </div>
            
            <div className="bg-black/40 p-5 rounded-lg border border-yellow-600/10 hover:border-yellow-600/30 transition-all group hover:transform hover:scale-[1.02] duration-300">
              <div className="h-14 w-14 mx-auto mb-3 bg-black/50 rounded-full flex items-center justify-center border border-blue-600/20 group-hover:border-blue-500/40 transition-all">
                <ClipboardList className="h-7 w-7 text-blue-500" />
              </div>
              <h4 className="font-medium text-center mb-2 group-hover:text-blue-500 transition-colors">Outsourcing contable</h4>
              <p className="text-xs text-gray-400 text-center">Externaliza tu departamento contable con nuestro equipo especializado.</p>
            </div>
            
            <div className="bg-black/40 p-5 rounded-lg border border-yellow-600/10 hover:border-yellow-600/30 transition-all group hover:transform hover:scale-[1.02] duration-300">
              <div className="h-14 w-14 mx-auto mb-3 bg-black/50 rounded-full flex items-center justify-center border border-amber-600/20 group-hover:border-amber-500/40 transition-all">
                <Search className="h-7 w-7 text-amber-500" />
              </div>
              <h4 className="font-medium text-center mb-2 group-hover:text-amber-500 transition-colors">Auditorías contables</h4>
              <p className="text-xs text-gray-400 text-center">Revisión exhaustiva de tus estados financieros para garantizar su precisión.</p>
            </div>
            
            <div className="bg-black/40 p-5 rounded-lg border border-yellow-600/10 hover:border-yellow-600/30 transition-all group hover:transform hover:scale-[1.02] duration-300">
              <div className="h-14 w-14 mx-auto mb-3 bg-black/50 rounded-full flex items-center justify-center border border-yellow-600/20 group-hover:border-yellow-500/40 transition-all">
                <DollarSign className="h-7 w-7 text-yellow-500" />
              </div>
              <h4 className="font-medium text-center mb-2 group-hover:text-yellow-500 transition-colors">Asesoría fiscal</h4>
              <p className="text-xs text-gray-400 text-center">Optimización fiscal y cumplimiento con las obligaciones tributarias.</p>
            </div>
            
            <div className="bg-black/40 p-5 rounded-lg border border-green-600/10 hover:border-green-600/30 transition-all group hover:transform hover:scale-[1.02] duration-300">
              <div className="h-14 w-14 mx-auto mb-3 bg-black/50 rounded-full flex items-center justify-center border border-green-600/20 group-hover:border-green-500/40 transition-all">
                <DollarSign className="h-7 w-7 text-green-500" />
              </div>
              <h4 className="font-medium text-center mb-2 group-hover:text-green-500 transition-colors">Sistema POS y Facturación</h4>
              <p className="text-xs text-gray-400 text-center">Implementación de sistemas de punto de venta y facturación electrónica para empresas y restaurantes.</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/20 p-5 rounded-lg border border-yellow-600/30 hover:border-yellow-500/60 transition-all group hover:transform hover:scale-[1.02] duration-300">
              <div className="h-14 w-14 mx-auto mb-3 bg-black/50 rounded-full flex items-center justify-center border border-yellow-600/40 group-hover:border-yellow-500/80 transition-all">
                <Star className="h-7 w-7 text-yellow-400" />
              </div>
              <h4 className="font-medium text-center mb-2 text-yellow-500 transition-colors">Paquete Premium</h4>
              <p className="text-xs text-gray-300 text-center">Accede a todos nuestros servicios contables con atención prioritaria y beneficios exclusivos.</p>
            </div>
          </div>
        </div>
        
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4 relative inline-block">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">Asesoría en Inversiones y Manejo</span>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
          </h3>
          <div className="bg-black rounded-lg p-6 border border-gray-800 mb-6 shadow-lg shadow-black/10 backdrop-blur-sm transition-all hover:border-yellow-500/20">
            <p className="text-gray-300">Ofrecemos asesoría especializada en inversiones y manejo de activos para maximizar tus rendimientos y minimizar riesgos.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black p-5 rounded-lg border border-gray-800 hover:border-yellow-600/30 transition-all hover:bg-black/80 group">
              <h4 className="font-medium mb-2 flex items-center group-hover:text-yellow-500 transition-colors">
                <DollarSign className="text-yellow-500 mr-2 h-4 w-4" />
                Análisis de Mercados
              </h4>
              <p className="text-sm text-gray-400">Evaluación continua de oportunidades en mercados globales con insights accionables.</p>
            </div>
            <div className="bg-black p-5 rounded-lg border border-gray-800 hover:border-yellow-600/30 transition-all hover:bg-black/80 group">
              <h4 className="font-medium mb-2 flex items-center group-hover:text-yellow-500 transition-colors">
                <Coins className="text-yellow-500 mr-2 h-4 w-4" />
                Gestión de Criptoactivos
              </h4>
              <p className="text-sm text-gray-400">Estrategias especializadas para inversión en criptomonedas y activos digitales.</p>
            </div>
            <div className="bg-black p-5 rounded-lg border border-gray-800 hover:border-yellow-600/30 transition-all hover:bg-black/80 group">
              <h4 className="font-medium mb-2 flex items-center group-hover:text-yellow-500 transition-colors">
                <DollarSign className="text-yellow-500 mr-2 h-4 w-4" />
                Trading Automatizado
              </h4>
              <p className="text-sm text-gray-400">Implementación de estrategias algorítmicas basadas en medias móviles y otros indicadores.</p>
            </div>
            <div className="bg-black p-5 rounded-lg border border-gray-800 hover:border-yellow-600/30 transition-all hover:bg-black/80 group">
              <h4 className="font-medium mb-2 flex items-center group-hover:text-yellow-500 transition-colors">
                <Brain className="text-yellow-500 mr-2 h-4 w-4" />
                Análisis con IA
              </h4>
              <p className="text-sm text-gray-400">Modelos predictivos avanzados para optimizar decisiones de inversión.</p>
            </div>
          </div>
        </div>



        <div className="mt-10 text-center">
          <Link href="/contacto">
            <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-medium py-3 px-6 hover:opacity-90 transition-opacity">
              <DollarSign className="mr-2 h-4 w-4" />
              Escríbenos para una asesoría gratuita
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <footer className="border-t border-zinc-800 p-8 text-center text-sm text-gray-400 mt-8 bg-black rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="mb-3">
                <p className="font-bold text-primary">Lion Heart Capital S.A.S.</p>
              </div>
              <p className="text-sm mb-3">Consultores financieros especializados en inversiones y gestión de activos.</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-primary">Contacto:</span>
                <a href="mailto:lionheartcapital1303@gmail.com" className="text-sm hover:text-primary transition-colors">
                  lionheartcapital1303@gmail.com
                </a>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <h3 className="font-medium text-primary mb-4">Síguenos</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                <a 
                  href="https://wa.me/+573000000000" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a 
                  href="https://linkedin.com/company/lionheartcapital" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a 
                  href="https://kick.com/lionheartcapital" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="Kick"
                >
                  <SiKickstarter className="h-5 w-5" />
                </a>
                <a 
                  href="https://tiktok.com/@lionheartcapital" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="TikTok"
                >
                  <SiTiktok className="h-5 w-5" />
                </a>
                <a 
                  href="https://twitch.tv/lionheartcapital" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="Twitch"
                >
                  <SiTwitch className="h-5 w-5" />
                </a>
                <a 
                  href="https://instagram.com/lionheartcapital" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://facebook.com/lionheartcapital" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://lionheartcapital.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="Website"
                >
                  <Globe className="h-5 w-5" />
                </a>
              </div>
              <p className="text-xs">¡Próximamente en App Store y Google Play!</p>
            </div>
          </div>
          
          <div className="border-t border-zinc-800 pt-4 text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Lion Heart Capital S.A.S. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}