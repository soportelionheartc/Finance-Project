import { Header } from "@/components/layout/header";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Settings,
  LineChart,
  BarChart3,
  UsersRound,
  Shield,
  AlertCircle,
  FileText,
  Bell,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

import {
  Activity,
  AreaChart,
  PieChart,
  Grid3X3,
  Filter,
  Download,
} from "lucide-react";

import { useEffect } from "react";

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [selectedTab, setSelectedTab] = useState("dashboard");

  // Filtros de usuarios
  const [filters, setFilters] = useState<{
    query: string;
    role: "all" | "admin" | "user";
    status: "all" | "active" | "inactive";
  }>({
    query: "",
    role: "all",
    status: "all",
  });

  // Stats del dashboard: solo 'Usuarios Totales' dinámico desde la BD
  const [totalUsers, setTotalUsers] = useState<string>("-");
  useEffect(() => {
    async function fetchTotalUsers() {
      try {
        const res = await fetch("/api/admin/users", { credentials: "include" });
        if (!res.ok) throw new Error("Error al obtener usuarios");
        const data = await res.json();
        setTotalUsers(data.length ? String(data.length) : "0");
      } catch (err) {
        setTotalUsers("-");
      }
    }
    fetchTotalUsers();
  }, []);
  const stats = [
    {
      id: 1,
      title: "Usuarios Totales",
      value: totalUsers,
      icon: <Users className="text-primary h-5 w-5" />,
      change: "",
    },
    {
      id: 2,
      title: "Accesos Diarios",
      value: "38",
      icon: <Activity className="text-primary h-5 w-5" />,
      change: "+8% vs. ayer",
    },
    {
      id: 3,
      title: "Retención",
      value: "76%",
      icon: <UsersRound className="text-primary h-5 w-5" />,
      change: "+2% este mes",
    },
    {
      id: 4,
      title: "Premium",
      value: "16",
      icon: <Shield className="text-primary h-5 w-5" />,
      change: "+3 nuevos",
    },
  ];

  // Usuarios (estado)
  const [users, setUsers] = useState<
    Array<{
      id: number;
      username: string;
      name: string;
      role: "user" | "admin";
      status: "active" | "inactive";
      lastLogin: string;
      email: string;
    }>
  >([]);

  // Cargar usuarios desde la API al montar
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users", { credentials: "include" });
        if (!res.ok) throw new Error("Error al obtener usuarios");
        const data = await res.json();
        // Mapear los datos para agregar status y lastLogin si no existen
        setUsers(
          data.map((u: any) => ({
            id: u.id,
            username: u.username,
            name: u.name,
            role: u.role || (u.username === "jplhc" ? "admin" : "user"),
            status: "active", // Puedes ajustar según tu modelo
            lastLogin: u.lastLogin
              ? new Date(u.lastLogin).toLocaleString()
              : "-",
            email: u.email,
          })),
        );
      } catch (err) {
        // Si hay error, dejar usuarios vacío
        setUsers([]);
      }
    }
    fetchUsers();
  }, []);

  // Formulario nuevo usuario
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    email: "",
    role: "user" as "user" | "admin",
    status: "active" as "active" | "inactive",
  });
  const [creationSuccess, setCreationSuccess] = useState(false);

  // Selección de usuarios (local, no persistente)
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(
    new Set(),
  );

  const toggleUserSelection = (id: number) => {
    setSelectedUserIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const ids = filteredUsers.map((u) => u.id);
      setSelectedUserIds(new Set(ids));
    } else {
      setSelectedUserIds(new Set());
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedUserIds.size === 0) return;
    // Eliminar en la base de datos
    await Promise.all(
      Array.from(selectedUserIds).map(async (id) => {
        await fetch(`/api/admin/users/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
      }),
    );
    // Actualizar la lista local
    setUsers((prev) => prev.filter((u) => !selectedUserIds.has(u.id)));
    setSelectedUserIds(new Set());
  };

  const canSubmitNewUser = newUser.name && newUser.username && newUser.email;

  const handleCreateUser = () => {
    if (!canSubmitNewUser) return;
    // Enviar al backend (solo frontend, no persistente aún)
    fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: newUser.name.trim(),
        username: newUser.username.trim(),
        email: newUser.email.trim(),
        password: "Lhcuser12345",
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Error al crear usuario");
        const user = await res.json();
        setUsers((prev) => [
          ...prev,
          {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role || (user.username === "jplhc" ? "admin" : "user"),
            status: "active",
            lastLogin: user.lastLogin
              ? new Date(user.lastLogin).toLocaleString()
              : "-",
          },
        ]);
        setCreationSuccess(true);
      })
      .catch(() => {
        setCreationSuccess(false);
        alert("Error al crear usuario");
      });
  };

  const handleAutoUsername = () => {
    if (!newUser.name) return;
    const suggestion = newUser.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[^a-z\s]/g, "")
      .trim()
      .replace(/\s+/g, "_");
    setNewUser((u) => ({ ...u, username: suggestion }));
  };

  const filteredUsers = users.filter((u) => {
    if (filters.role !== "all" && u.role !== filters.role) return false;
    if (filters.status !== "all" && u.status !== filters.status) return false;
    const q = filters.query.trim().toLowerCase();
    if (
      q &&
      !(
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      )
    )
      return false;
    return true;
  });

  // Alertas del sistema
  const alerts = [
    {
      id: 1,
      type: "error",
      message: "Error de conexión a API de mercados",
      time: "10:25 AM",
    },
    {
      id: 2,
      type: "warning",
      message: "Uso de CPU alto (85%)",
      time: "09:15 AM",
    },
    {
      id: 3,
      type: "info",
      message: "Actualización de precios completada",
      time: "08:30 AM",
    },
    {
      id: 4,
      type: "success",
      message: "Backup automático completado",
      time: "04:00 AM",
    },
  ];

  // Reportes disponibles
  const reports = [
    {
      id: 1,
      name: "Usuarios Activos - Abril 2025",
      format: "PDF",
      date: "01/04/2025",
    },
    {
      id: 2,
      name: "Métricas de Uso - Q1 2025",
      format: "Excel",
      date: "31/03/2025",
    },
    { id: 3, name: "Análisis de Retención", format: "PDF", date: "28/03/2025" },
    { id: 4, name: "Reporte Financiero", format: "Excel", date: "15/03/2025" },
  ];

  if (!isAdmin) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Acceso Restringido
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <AlertCircle className="text-destructive mx-auto mb-3 h-12 w-12" />
            <p className="mb-2">
              No tienes permiso para acceder al panel de administración.
            </p>
            <p className="text-muted-foreground text-sm">
              Este panel es exclusivo para administradores.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Volver al Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header title="Panel de Administración" />

      <main className="container mx-auto flex-1 px-4 py-6">
        <div className="mb-6 flex flex-col items-center justify-center space-y-2">
          <h1 className="text-primary bg-linear-to-r from-yellow-400 to-yellow-600 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent">
            Panel de Administración
          </h1>
          <p className="text-muted-foreground text-center">
            Bienvenido, {user?.name || user?.username} - Administrador del
            Sistema
          </p>
        </div>

        <Tabs
          defaultValue="dashboard"
          className="space-y-6"
          onValueChange={setSelectedTab}
        >
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.id} className="border-zinc-800 bg-zinc-900">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    {stat.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-primary text-2xl font-bold">
                      {stat.value}
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="border-zinc-800 bg-zinc-950">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      Actividad de Usuarios
                    </CardTitle>
                    <AreaChart className="text-primary h-4 w-4" />
                  </div>
                  <CardDescription>
                    Actividad diaria en la plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex h-[220px] items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    [Gráfica de actividad - Datos en tiempo real]
                  </p>
                </CardContent>
              </Card>

              <Card className="border-zinc-800 bg-zinc-950">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      Distribución de Usuarios
                    </CardTitle>
                    <PieChart className="text-primary h-4 w-4" />
                  </div>
                  <CardDescription>Por tipo de cuenta y estado</CardDescription>
                </CardHeader>
                <CardContent className="flex h-[220px] items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    [Gráfica de distribución - Actualizada 01/04/2025]
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-zinc-800 bg-zinc-950">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">
                    Alertas del Sistema
                  </CardTitle>
                  <Bell className="text-primary h-4 w-4" />
                </div>
                <CardDescription>
                  Últimas notificaciones de la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start justify-between rounded-md bg-zinc-900 p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 ${
                            alert.type === "error"
                              ? "text-red-500"
                              : alert.type === "warning"
                                ? "text-yellow-500"
                                : alert.type === "success"
                                  ? "text-green-500"
                                  : "text-blue-500"
                          }`}
                        >
                          <AlertCircle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-muted-foreground text-xs">
                            {alert.time}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          alert.type === "error"
                            ? "destructive"
                            : alert.type === "warning"
                              ? "default"
                              : alert.type === "success"
                                ? "outline-solid"
                                : "secondary"
                        }
                        className="text-xs"
                      >
                        {alert.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Ver todas las alertas
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="mb-8 flex w-full flex-col items-center justify-center">
              <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-4 rounded-xl border border-yellow-600/30 bg-zinc-900 px-6 py-4 shadow-[0_2px_16px_0_rgba(255,215,0,0.10)]">
                <div className="flex w-full flex-col items-center justify-between lg:flex-row">
                  <div className="flex flex-col items-center justify-center text-center lg:items-start lg:text-left">
                    <h2 className="text-gradient mb-0 bg-linear-to-r from-yellow-400 to-yellow-600 bg-clip-text text-xl font-bold text-transparent">
                      Gestión de Usuarios
                    </h2>
                    <p className="mb-4 text-sm text-gray-300">
                      Administra los usuarios de la plataforma
                    </p>
                  </div>
                  <div className="mt-0 flex gap-2 lg:mt-0">
                    <Dialog
                      open={isCreating}
                      onOpenChange={(open) => {
                        setIsCreating(open);
                        if (!open) {
                          // Reset al cerrar
                          setCreationSuccess(false);
                          setNewUser({
                            name: "",
                            username: "",
                            email: "",
                            role: "user",
                            status: "active",
                          });
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-2 bg-yellow-600 px-3 py-0.5 text-sm font-semibold text-black hover:bg-yellow-500">
                          <span className="mr-1">
                            <svg
                              width="16"
                              height="16"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </span>
                          Nuevo Usuario
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        {!creationSuccess && (
                          <>
                            <DialogHeader>
                              <DialogTitle>Nuevo Usuario</DialogTitle>
                              <DialogDescription>
                                Crea un nuevo usuario en la plataforma.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                              <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre</Label>
                                <Input
                                  id="nombre"
                                  value={newUser.name}
                                  onChange={(e) =>
                                    setNewUser((u) => ({
                                      ...u,
                                      name: e.target.value,
                                    }))
                                  }
                                  onBlur={handleAutoUsername}
                                  placeholder="Nombre completo"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="username">Usuario</Label>
                                <Input
                                  id="username"
                                  value={newUser.username}
                                  onChange={(e) =>
                                    setNewUser((u) => ({
                                      ...u,
                                      username: e.target.value,
                                    }))
                                  }
                                  placeholder="usuario_unico"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={newUser.email}
                                  onChange={(e) =>
                                    setNewUser((u) => ({
                                      ...u,
                                      email: e.target.value,
                                    }))
                                  }
                                  placeholder="correo@ejemplo.com"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Rol</Label>
                                  <Select
                                    value={newUser.role}
                                    onValueChange={(val: any) =>
                                      setNewUser((u) => ({ ...u, role: val }))
                                    }
                                  >
                                    <SelectTrigger className="h-9">
                                      <SelectValue placeholder="Rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="user">
                                        Usuario
                                      </SelectItem>
                                      <SelectItem value="admin">
                                        Administrador
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Estado</Label>
                                  <Select
                                    value={newUser.status}
                                    onValueChange={(val: any) =>
                                      setNewUser((u) => ({ ...u, status: val }))
                                    }
                                  >
                                    <SelectTrigger className="h-9">
                                      <SelectValue placeholder="Estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">
                                        Activo
                                      </SelectItem>
                                      <SelectItem value="inactive">
                                        Inactivo
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreating(false)}
                              >
                                Cancelar
                              </Button>
                              <Button
                                type="button"
                                disabled={!canSubmitNewUser}
                                onClick={handleCreateUser}
                              >
                                Crear
                              </Button>
                            </DialogFooter>
                          </>
                        )}
                        {creationSuccess && (
                          <div className="flex flex-col items-center gap-4 py-6 text-center">
                            <CheckCircle2 className="h-12 w-12 text-green-500" />
                            <div>
                              <h3 className="mb-1 text-lg font-semibold">
                                Usuario creado correctamente
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                El usuario se añadió a la lista (datos no
                                persistentes aún).
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  // Preparar otro
                                  setCreationSuccess(false);
                                  setNewUser({
                                    name: "",
                                    username: "",
                                    email: "",
                                    role: "user",
                                    status: "active",
                                  });
                                }}
                              >
                                Crear otro
                              </Button>
                              <Button
                                onClick={() => {
                                  setIsCreating(false);
                                  setCreationSuccess(false);
                                  setNewUser({
                                    name: "",
                                    username: "",
                                    email: "",
                                    role: "user",
                                    status: "active",
                                  });
                                }}
                              >
                                Cerrar
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          disabled={selectedUserIds.size === 0}
                          className="flex items-center gap-2 bg-red-600 px-3 py-0.5 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <span className="mr-1">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M3 6h18M9 6V4h6v2m2 0v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6h12Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          Eliminar{" "}
                          {selectedUserIds.size > 0
                            ? `${selectedUserIds.size}`
                            : ""}{" "}
                          {selectedUserIds.size > 1 ? "Usuarios" : "Usuario"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Se eliminarán {selectedUserIds.size} usuario
                            {selectedUserIds.size > 1 ? "s" : ""}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>No</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteSelected}>
                            Sí
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="mt-0 flex w-full justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-yellow-600 px-3 py-0.5 text-sm font-medium text-yellow-600"
                      >
                        <span className="mr-1">
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeWidth="2"
                              d="M4 21h16M10 3h4M12 3v14m0 0l-4-4m4 4l4-4"
                            />
                          </svg>
                        </span>
                        Filtrar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-72 p-2">
                      <div className="px-2 py-1.5">
                        <p className="text-muted-foreground mb-1 text-xs">
                          Búsqueda
                        </p>
                        <Input
                          placeholder="Nombre, usuario o correo"
                          value={filters.query}
                          onChange={(e) =>
                            setFilters((f) => ({ ...f, query: e.target.value }))
                          }
                          className="h-8"
                        />
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Rol</DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={filters.role}
                        onValueChange={(val) =>
                          setFilters((f) => ({
                            ...f,
                            role: val as "all" | "admin" | "user",
                          }))
                        }
                      >
                        <DropdownMenuRadioItem value="all">
                          Todos
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="admin">
                          Administrador
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="user">
                          Usuario
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>

                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Estado</DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={filters.status}
                        onValueChange={(val) =>
                          setFilters((f) => ({
                            ...f,
                            status: val as "all" | "active" | "inactive",
                          }))
                        }
                      >
                        <DropdownMenuRadioItem value="all">
                          Todos
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="active">
                          Activo
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="inactive">
                          Inactivo
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>

                      <DropdownMenuSeparator />
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-muted-foreground text-xs">
                          Resultados: {filteredUsers.length}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() =>
                            setFilters({
                              query: "",
                              role: "all",
                              status: "all",
                            })
                          }
                        >
                          Limpiar
                        </Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={
                          filteredUsers.length > 0 &&
                          selectedUserIds.size === filteredUsers.length
                        }
                        onCheckedChange={(c) => toggleSelectAll(Boolean(c))}
                        aria-label="Seleccionar todos"
                      />
                    </TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Último Acceso</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUserIds.has(user.id)}
                          onCheckedChange={() => toggleUserSelection(user.id)}
                          aria-label={`Seleccionar ${user.username}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-muted-foreground text-xs">
                            @{user.username}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                        >
                          {user.role === "admin" ? "Administrador" : "Usuario"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active"
                              ? "outline-solid"
                              : "destructive"
                          }
                        >
                          {user.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            {user.status === "active" ? (
                              <EyeOff className="text-destructive h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actividad de Usuarios</CardTitle>
                <CardDescription>
                  Últimas acciones en la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/20 flex items-start gap-4 rounded-md p-3">
                    <div className="bg-primary/20 rounded-full p-2">
                      <UsersRound className="text-primary h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">María Gómez</span> ha
                        iniciado sesión en la plataforma
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Hace 1 hora
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted/20 flex items-start gap-4 rounded-md p-3">
                    <div className="bg-primary/20 rounded-full p-2">
                      <Settings className="text-primary h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Carlos Rodríguez</span> ha
                        actualizado su perfil
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Hace 3 horas
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted/20 flex items-start gap-4 rounded-md p-3">
                    <div className="bg-primary/20 rounded-full p-2">
                      <Shield className="text-primary h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Juan Pablo López</span> ha
                        realizado cambios en los permisos
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Hace 5 horas
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Ver todo el historial
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="mb-8 flex w-full flex-col items-center justify-center">
              <div className="flex w-full max-w-3xl flex-col items-center justify-between gap-4 rounded-lg border border-yellow-600/30 bg-zinc-900 px-4 py-3 shadow-[0_2px_12px_0_rgba(255,215,0,0.08)] lg:flex-row">
                <div className="flex flex-col items-center justify-center text-center lg:items-start lg:text-left">
                  <h2 className="text-gradient mb-0 bg-linear-to-r from-yellow-400 to-yellow-600 bg-clip-text text-xl font-bold text-transparent">
                    Gestión del Sistema
                  </h2>
                  <p className="mb-0 text-sm text-gray-300">
                    Administra la configuración y el estado del sistema
                  </p>
                </div>
                <div className="mt-0 flex lg:mt-0">
                  <Button
                    variant="outline"
                    className="flex items-center gap-1 border-yellow-600 px-3 py-0.5 text-sm font-medium text-yellow-600"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-zinc-800 bg-zinc-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">CPU</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-primary text-2xl font-bold">32%</div>
                  <p className="text-muted-foreground mt-1 text-xs">Normal</p>
                </CardContent>
              </Card>
              <Card className="border-zinc-800 bg-zinc-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Memoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-primary text-2xl font-bold">64%</div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    4.2GB/8GB
                  </p>
                </CardContent>
              </Card>
              <Card className="border-zinc-800 bg-zinc-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Almacenamiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-primary text-2xl font-bold">45%</div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    112GB/250GB
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>APIs Conectadas</CardTitle>
                <CardDescription>
                  Estado de las conexiones externas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-muted/20 flex items-center justify-between rounded-md p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="font-medium">Yahoo Finance</span>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Última sincronización: 12:30 PM
                    </div>
                  </div>
                  <div className="bg-muted/20 flex items-center justify-between rounded-md p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="font-medium">CoinMarket</span>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Última sincronización: 12:35 PM
                    </div>
                  </div>
                  <div className="bg-muted/20 flex items-center justify-between rounded-md p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <span className="font-medium">CNBC</span>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Última sincronización: 11:45 AM
                    </div>
                  </div>
                  <div className="bg-muted/20 flex items-center justify-between rounded-md p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span className="font-medium">Investing.com</span>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Error de conexión
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Reintentar conexiones fallidas
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tareas Programadas</CardTitle>
                <CardDescription>
                  Procesos automáticos del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-muted/20 flex items-center justify-between rounded-md p-3">
                    <div>
                      <p className="font-medium">Backup automático</p>
                      <p className="text-muted-foreground text-xs">
                        Diario a las 4:00 AM
                      </p>
                    </div>
                    <Badge variant="outline">Activo</Badge>
                  </div>
                  <div className="bg-muted/20 flex items-center justify-between rounded-md p-3">
                    <div>
                      <p className="font-medium">Actualización de precios</p>
                      <p className="text-muted-foreground text-xs">
                        Cada 15 minutos
                      </p>
                    </div>
                    <Badge variant="outline">Activo</Badge>
                  </div>
                  <div className="bg-muted/20 flex items-center justify-between rounded-md p-3">
                    <div>
                      <p className="font-medium">Limpieza de caché</p>
                      <p className="text-muted-foreground text-xs">
                        Cada 48 horas
                      </p>
                    </div>
                    <Badge variant="outline">Activo</Badge>
                  </div>
                  <div className="bg-muted/20 flex items-center justify-between rounded-md p-3">
                    <div>
                      <p className="font-medium">Envío de reportes</p>
                      <p className="text-muted-foreground text-xs">
                        Semanal - Lunes 8:00 AM
                      </p>
                    </div>
                    <Badge variant="outline">Activo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="mb-8 flex w-full flex-col items-center justify-center">
              <div className="flex w-full max-w-3xl flex-col items-center justify-between gap-4 rounded-lg border border-yellow-600/30 bg-zinc-900 px-4 py-3 shadow-[0_2px_12px_0_rgba(255,215,0,0.08)] lg:flex-row">
                <div className="flex flex-col items-center justify-center text-center lg:items-start lg:text-left">
                  <h2 className="text-gradient mb-0 bg-linear-to-r from-yellow-400 to-yellow-600 bg-clip-text text-xl font-bold text-transparent">
                    Reportes y Análisis
                  </h2>
                  <p className="mb-0 text-sm text-gray-300">
                    Informes y métricas de la plataforma
                  </p>
                </div>
                <div className="mt-0 flex gap-2 lg:mt-0">
                  <Button
                    variant="outline"
                    className="flex items-center gap-1 border-yellow-600 px-3 py-0.5 text-sm font-medium text-yellow-600"
                  >
                    <span className="mr-1">
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          d="M4 21h16M10 3h4M12 3v14m0 0l-4-4m4 4l4-4"
                        />
                      </svg>
                    </span>
                    Todos los reportes
                  </Button>
                  <Button className="flex items-center gap-1 bg-yellow-600 px-3 py-0.5 text-sm font-semibold text-black hover:bg-yellow-500">
                    <span className="mr-1">
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </span>
                    Generar Reporte
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="border-zinc-800 bg-zinc-950">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      Usuarios Activos
                    </CardTitle>
                    <LineChart className="text-primary h-4 w-4" />
                  </div>
                  <CardDescription>Últimos 30 días</CardDescription>
                </CardHeader>
                <CardContent className="flex h-[250px] items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    [Gráfica de tendencia - Actualizada hoy]
                  </p>
                </CardContent>
              </Card>

              <Card className="border-zinc-800 bg-zinc-950">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      Distribución por Funcionalidad
                    </CardTitle>
                    <BarChart3 className="text-primary h-4 w-4" />
                  </div>
                  <CardDescription>Uso de características</CardDescription>
                </CardHeader>
                <CardContent className="flex h-[250px] items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    [Gráfica de barras - Actualizada hoy]
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Reportes Disponibles</CardTitle>
                <CardDescription>
                  Informes generados para descarga
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-muted/20 flex items-center justify-between rounded-md p-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="text-primary h-4 w-4" />
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-muted-foreground text-xs">
                            Generado: {report.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{report.format}</Badge>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Ver archivo completo
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Correo</CardTitle>
                <CardDescription>
                  Campañas y notificaciones enviadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="bg-muted/20 rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Enviados</p>
                      <Mail className="text-primary h-4 w-4" />
                    </div>
                    <p className="mt-2 text-2xl font-bold">124</p>
                    <p className="text-muted-foreground text-xs">Este mes</p>
                  </div>
                  <div className="bg-muted/20 rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Abiertos</p>
                      <Eye className="text-primary h-4 w-4" />
                    </div>
                    <p className="mt-2 text-2xl font-bold">87</p>
                    <p className="text-muted-foreground text-xs">Tasa: 70.2%</p>
                  </div>
                  <div className="bg-muted/20 rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Clicks</p>
                      <Activity className="text-primary h-4 w-4" />
                    </div>
                    <p className="mt-2 text-2xl font-bold">42</p>
                    <p className="text-muted-foreground text-xs">Tasa: 33.9%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="text-muted-foreground border-t py-6 text-sm">
        <div className="container mx-auto text-center">
          <p>
            © {new Date().getFullYear()} Zupi Fintech - Panel de Administración
          </p>
          <p className="text-xs">
            Versión 1.0.0 - Última actualización: 02/04/2025
          </p>
        </div>
      </footer>
    </div>
  );
}
