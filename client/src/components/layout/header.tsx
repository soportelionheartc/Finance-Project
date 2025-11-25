import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LionLogo } from "@/components/ui/lion-logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Settings, User } from "lucide-react";

interface HeaderProps {
  title?: string;
  toggleSidebar?: () => void;
}

export function Header({ title, toggleSidebar }: HeaderProps) {
  const [, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="border-b border-border/40 bg-gradient-to-r from-primary/20 to-black p-4">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <LionLogo className="h-10 w-10" />
          <div>
              <h1 className="font-bold text-lg text-gradient bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent" >FINANCE 360°</h1>
              <p>Zupi Fintech</p>
          </div>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#FFC107] text-black">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name || user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    {user.role === 'admin' && (
                      <p className="text-xs text-primary font-medium mt-1">Administrador</p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === 'admin' && (
                  <DropdownMenuItem onSelect={() => setLocation('/admin')}>
                    <Settings className="mr-2 h-4 w-4 text-primary" />
                    <span className="font-medium">Panel Admin</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={() => setLocation('dashboard')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setLocation('/configuracion')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{logoutMutation.isPending ? "Cerrando sesión..." : "Cerrar sesión"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}