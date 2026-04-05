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
  LineChart,
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
          "hover:text-primary flex items-center px-4 py-2.5 text-gray-300 transition-colors duration-200 hover:bg-black md:py-3",
          isActive && "text-primary border-primary border-l-2",
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
    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
  );

  // Si el usuario no ha iniciado sesión, mostramos un sidebar mínimo
  if (!user) {
    return (
      <>
        {/* Overlay for mobile */}
        {isOpen && (
          <div
            className="bg-opacity-50 fixed inset-0 z-40 bg-black md:hidden"
            onClick={onClose}
          ></div>
        )}

        <aside className={sidebarClass}>
          <div className="border-b border-zinc-800 p-3 md:p-4">
            <div className="flex flex-col items-center">
              <LionLogo className="mb-1 h-12 w-12 md:mb-2 md:h-16 md:w-16" />
              <h2 className="text-primary text-center text-base font-bold md:text-lg">
                ZUPI FINTECH
              </h2>
              <p className="text-center text-xs text-gray-400 md:text-sm">
                CONSULTORA FINANCIERA Y DE INVERSIÓN
              </p>
            </div>
          </div>

          <div className="px-3 py-2 md:px-4 md:py-4">
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm text-gray-300">Juan Pablo Arango</p>
              <p className="text-primary mb-1 text-xs">CEO & Founder</p>
              <p className="truncate text-xs text-gray-400">+57 3163581762</p>
              <p className="truncate text-xs text-gray-400">
                lionheartcapital1303@gmail.com
              </p>
            </div>
          </div>

          <nav className="py-2">
            <SidebarLink
              href="/"
              icon={<Home className="text-primary h-5 w-5" />}
              onClick={onClose}
            >
              Inicio
            </SidebarLink>

            <SidebarLink
              href="/servicios"
              icon={<DollarSign className="text-primary h-5 w-5" />}
              onClick={onClose}
            >
              Servicios Financieros
            </SidebarLink>

            <SidebarLink
              href="/contacto"
              icon={<Mail className="text-primary h-5 w-5" />}
              onClick={onClose}
            >
              Contacto
            </SidebarLink>
          </nav>

          <div className="mt-auto border-t border-zinc-800 bg-zinc-900 p-3 md:p-4">
            <div className="text-center">
              <h4 className="text-primary mb-1 text-sm font-medium md:mb-2 md:text-base">
                Integración Blockchain
              </h4>
              <p className="mb-2 text-xs text-gray-300">
                Conecta tu wallet para gestionar tus activos digitales.
              </p>
              <Button
                className="bg-primary hover:bg-primary/90 w-full text-xs text-black transition-colors md:text-sm"
                onClick={() => (window.location.href = "/auth")}
              >
                <LogIn className="mr-1 h-4 w-4 md:mr-2 md:h-5 md:w-5" />
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
          className="bg-opacity-50 fixed inset-0 z-40 bg-black md:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside className={sidebarClass}>
        <div className="border-b border-zinc-800 p-3 md:p-4">
          <div className="flex flex-col items-center">
            <LionLogo className="mb-1 h-12 w-12 md:mb-2 md:h-16 md:w-16" />
            <h2 className="text-primary text-center text-base font-bold md:text-lg">
              ZUPI FINTECH
            </h2>
            <p className="text-center text-xs text-gray-400 md:text-sm">
              CONSULTORA FINANCIERA Y DE INVERSIÓN
            </p>
          </div>
        </div>

        <div className="px-3 py-2 md:px-4 md:py-4">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-gray-300">Juan Pablo Arango</p>
            <p className="text-primary mb-1 text-xs">CEO & Founder</p>
            <p className="truncate text-xs text-gray-400">+57 3163581762</p>
            <p className="truncate text-xs text-gray-400">
              lionheartcapital1303@gmail.com
            </p>
          </div>
        </div>

        <nav className="py-2">
          <SidebarLink
            href="/"
            icon={<Home className="text-primary h-5 w-5" />}
            onClick={onClose}
          >
            Inicio
          </SidebarLink>

          <SidebarLink
            href="/dashboard"
            icon={<LayoutDashboard className="text-primary h-5 w-5" />}
            onClick={onClose}
          >
            Dashboard
          </SidebarLink>

          <SidebarLink
            href="/finanzas-personales"
            icon={<DollarSign className="text-primary h-5 w-5" />}
            onClick={onClose}
          >
            Finanzas Personales
          </SidebarLink>

          <SidebarLink
            href="/portafolio"
            icon={<ChartPie className="text-primary h-5 w-5" />}
            onClick={onClose}
          >
            Mi Portafolio
          </SidebarLink>

          <SidebarLink
            href="/trading-bot"
            icon={<LineChart className="text-primary h-5 w-5" />}
            onClick={onClose}
          >
            Trading Bot
          </SidebarLink>

          <SidebarLink
            href="/wallet"
            icon={<Wallet className="text-primary h-5 w-5" />}
            onClick={onClose}
          >
            Wallets
          </SidebarLink>

          <SidebarLink
            href="/chat-descentralizado"
            icon={<MessageSquare className="text-primary h-5 w-5" />}
            onClick={onClose}
          >
            Chat Descentralizado
          </SidebarLink>

          <SidebarLink
            href="/servicios"
            icon={<Info className="text-primary h-5 w-5" />}
            onClick={onClose}
          >
            Servicios
          </SidebarLink>

          <SidebarLink
            href="/contacto"
            icon={<Mail className="text-primary h-5 w-5" />}
            onClick={onClose}
          >
            Contacto
          </SidebarLink>
        </nav>

        <div className="mt-auto border-t border-zinc-800 bg-zinc-900 p-3 md:p-4">
          <div className="text-center">
            <h4 className="text-primary mb-1 text-sm font-medium md:mb-2 md:text-base">
              Integración Blockchain
            </h4>
            <p className="mb-2 text-xs text-gray-300">
              Conecta tu wallet para gestionar tus activos digitales.
            </p>
            <Button
              className="bg-primary hover:bg-primary/90 w-full text-xs text-black transition-colors md:text-sm"
              onClick={() => (window.location.href = "/wallet")}
            >
              <Wallet className="mr-1 h-4 w-4 md:mr-2 md:h-5 md:w-5" />
              Conectar Wallet
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
