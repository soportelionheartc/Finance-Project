import { Link, useLocation } from "wouter";
import { LionLogo } from "@/assets/lion-logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  Home,
  LogIn,
  Newspaper,
  Mail,
  Info,
  Star,
  ChevronRight,
  Wallet,
  DollarSign,
  LogOut,
  ChartPie,
  LayoutDashboard,
  MessageSquare,
  BarChart,
  LineChart
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

const SidebarLink = ({ href, icon, children, onClick }: SidebarLinkProps) => {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center px-4 py-2.5 md:py-3 text-gray-300 hover:bg-black hover:text-primary transition-colors duration-200",
          isActive && "text-primary border-l-2 border-primary"
        )}
        onClick={onClick}
      >
        <span className="w-6">{icon}</span>
        <span className="ml-2 text-sm md:text-base">{children}</span>
      </a>
    </Link>
  );
};

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user } = useAuth();
  const sidebarClass = cn(
    "bg-black border-r border-zinc-800 transition-all duration-300 ease-in-out overflow-y-auto",
    "fixed md:relative inset-y-0 left-0 z-50 w-full md:w-72 shrink-0 max-w-[300px]",
    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
  );

  // Si el usuario no ha iniciado sesión, mostramos un sidebar mínimo
  if (!user) {
    return (
      <>
        {/* Overlay for mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
          ></div>
        )}

        <aside className={sidebarClass}>
          <div className="p-3 md:p-4 border-b border-zinc-800">
            <div className="flex flex-col items-center">
              <LionLogo className="w-12 h-12 md:w-16 md:h-16 mb-1 md:mb-2" />
              <h2 className="text-base md:text-lg font-bold text-primary text-center">
                ZUPI FINTECH
              </h2>
              <p className="text-xs md:text-sm text-gray-400 text-center">
                CONSULTORA FINANCIERA Y DE INVERSIÓN
              </p>
            </div>
          </div>

          <div className="py-2 md:py-4 px-3 md:px-4">
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm text-gray-300">Juan Pablo Arango</p>
              <p className="text-xs text-primary mb-1">CEO & Founder</p>
              <p className="text-xs text-gray-400 truncate">+57 3163581762</p>
              <p className="text-xs text-gray-400 truncate">
                lionheartcapital1303@gmail.com
              </p>
            </div>
          </div>

          <nav className="py-2">
            <SidebarLink
              href="/"
              icon={<Home className="h-5 w-5 text-primary" />}
              onClick={onClose}
            >
              Inicio
            </SidebarLink>

            <SidebarLink
              href="/servicios"
              icon={<DollarSign className="h-5 w-5 text-primary" />}
              onClick={onClose}
            >
              Servicios Financieros
            </SidebarLink>

            <SidebarLink
              href="/contacto"
              icon={<Mail className="h-5 w-5 text-primary" />}
              onClick={onClose}
            >
              Contacto
            </SidebarLink>
          </nav>

          <div className="p-3 md:p-4 mt-auto border-t border-zinc-800 bg-zinc-900">
            <div className="text-center">
              <h4 className="text-sm md:text-base font-medium text-primary mb-1 md:mb-2">
                Integración Blockchain
              </h4>
              <p className="text-xs text-gray-300 mb-2 text-xs">
                Conecta tu wallet para gestionar tus activos digitales.
              </p>
              <Button
                className="w-full bg-primary text-black hover:bg-primary/90 transition-colors text-xs md:text-sm"
                onClick={() => (window.location.href = "/auth")}
              >
                <LogIn className="mr-1 md:mr-2 h-4 md:h-5 w-4 md:w-5" />
                Iniciar Sesión para Acceder
              </Button>
            </div>
          </div>
        </aside>
      </>
    );
  }

  // Si el usuario ha iniciado sesión, mostramos el sidebar completo
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside className={sidebarClass}>
        <div className="p-3 md:p-4 border-b border-zinc-800">
          <div className="flex flex-col items-center">
            <LionLogo className="w-12 h-12 md:w-16 md:h-16 mb-1 md:mb-2" />
            <h2 className="text-base md:text-lg font-bold text-primary text-center">
              ZUPI FINTECH
            </h2>
            <p className="text-xs md:text-sm text-gray-400 text-center">
              CONSULTORA FINANCIERA Y DE INVERSIÓN
            </p>
          </div>
        </div>

        <div className="py-2 md:py-4 px-3 md:px-4">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-gray-300">Juan Pablo Arango</p>
            <p className="text-xs text-primary mb-1">CEO & Founder</p>
            <p className="text-xs text-gray-400 truncate">+57 3163581762</p>
            <p className="text-xs text-gray-400 truncate">
              lionheartcapital1303@gmail.com
            </p>
          </div>
        </div>

        <nav className="py-2">
          <SidebarLink
            href="/"
            icon={<Home className="h-5 w-5 text-primary" />}
            onClick={onClose}
          >
            Inicio
          </SidebarLink>

          <SidebarLink
            href="/dashboard"
            icon={<LayoutDashboard className="h-5 w-5 text-primary" />}
            onClick={onClose}
          >
            Dashboard
          </SidebarLink>

          <SidebarLink
            href="/finanzas-personales"
            icon={<DollarSign className="h-5 w-5 text-primary" />}
            onClick={onClose}
          >
            Finanzas Personales
          </SidebarLink>

          <SidebarLink
            href="/portafolio"
            icon={<ChartPie className="h-5 w-5 text-primary" />}
            onClick={onClose}
          >
            Mi Portafolio
          </SidebarLink>

          <SidebarLink
            href="/trading-bot"
            icon={<LineChart className="h-5 w-5 text-primary" />}
            onClick={onClose}
          >
            Trading Bot
          </SidebarLink>

          <SidebarLink
            href="/wallet"
            icon={<Wallet className="h-5 w-5 text-primary" />}
            onClick={onClose}
          >
            Wallets
          </SidebarLink>

          <SidebarLink
            href="/chat-descentralizado"
            icon={<MessageSquare className="h-5 w-5 text-primary" />}
            onClick={onClose}
          >
            Chat Descentralizado
          </SidebarLink>

          <SidebarLink
            href="/servicios"
            icon={<Info className="h-5 w-5 text-primary" />}
            onClick={onClose}
          >
            Servicios
          </SidebarLink>

          <SidebarLink
            href="/contacto"
            icon={<Mail className="h-5 w-5 text-primary" />}
            onClick={onClose}
          >
            Contacto
          </SidebarLink>
        </nav>

        <div className="p-3 md:p-4 mt-auto border-t border-zinc-800 bg-zinc-900">
          <div className="text-center">
            <h4 className="text-sm md:text-base font-medium text-primary mb-1 md:mb-2">
              Integración Blockchain
            </h4>
            <p className="text-xs text-gray-300 mb-2 text-xs">
              Conecta tu wallet para gestionar tus activos digitales.
            </p>
            <Button
              className="w-full bg-primary text-black hover:bg-primary/90 transition-colors text-xs md:text-sm"
              onClick={() => (window.location.href = "/wallet")}
            >
              <Wallet className="mr-1 md:mr-2 h-4 md:h-5 w-4 md:w-5" />
              Conectar Wallet
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
