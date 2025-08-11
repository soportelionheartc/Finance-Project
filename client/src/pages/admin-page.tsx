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
import {
  Activity,
  AreaChart,
  PieChart,
  Grid3X3,
  Filter,
  Download
} from "lucide-react";

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [selectedTab, setSelectedTab] = useState("dashboard");

  // Datos para el tablero administrativo
  const stats = [
    { id: 1, title: "Usuarios Totales", value: "124", icon: <Users className="h-5 w-5 text-primary" />, change: "+12% este mes" },
    { id: 2, title: "Accesos Diarios", value: "38", icon: <Activity className="h-5 w-5 text-primary" />, change: "+8% vs. ayer" },
    { id: 3, title: "Retención", value: "76%", icon: <UsersRound className="h-5 w-5 text-primary" />, change: "+2% este mes" },
    { id: 4, title: "Premium", value: "16", icon: <Shield className="h-5 w-5 text-primary" />, change: "+3 nuevos" },
  ];

  // Usuarios para la tabla
  const users = [
    { id: 1, username: "carlos_rodriguez", name: "Carlos Rodríguez", role: "user", status: "active", lastLogin: "Hace 2 horas", email: "carlos@ejemplo.com" },
    { id: 2, username: "maria_gomez", name: "María Gómez", role: "user", status: "active", lastLogin: "Hace 1 día", email: "maria@ejemplo.com" },
    { id: 3, username: "jplhc", name: "Juan Pablo López", role: "admin", status: "active", lastLogin: "Ahora", email: "admin@lionheartcapital.com" },
    { id: 4, username: "luis_perez", name: "Luis Pérez", role: "user", status: "inactive", lastLogin: "Hace 10 días", email: "luis@ejemplo.com" },
    { id: 5, username: "ana_martinez", name: "Ana Martínez", role: "user", status: "active", lastLogin: "Hace 5 horas", email: "ana@ejemplo.com" },
  ];

  // Alertas del sistema
  const alerts = [
    { id: 1, type: "error", message: "Error de conexión a API de mercados", time: "10:25 AM" },
    { id: 2, type: "warning", message: "Uso de CPU alto (85%)", time: "09:15 AM" },
    { id: 3, type: "info", message: "Actualización de precios completada", time: "08:30 AM" },
    { id: 4, type: "success", message: "Backup automático completado", time: "04:00 AM" },
  ];

  // Reportes disponibles
  const reports = [
    { id: 1, name: "Usuarios Activos - Abril 2025", format: "PDF", date: "01/04/2025" },
    { id: 2, name: "Métricas de Uso - Q1 2025", format: "Excel", date: "31/03/2025" },
    { id: 3, name: "Análisis de Retención", format: "PDF", date: "28/03/2025" },
    { id: 4, name: "Reporte Financiero", format: "Excel", date: "15/03/2025" },
  ];

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="text-xl text-center">Acceso Restringido</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-3" />
            <p className="mb-2">No tienes permiso para acceder al panel de administración.</p>
            <p className="text-sm text-muted-foreground">Este panel es exclusivo para administradores.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
              Volver al Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Panel de Administración" />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-2 mb-6">
          <h1 className="text-4xl font-bold text-primary text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent tracking-tight">
            Panel de Administración
          </h1>
          <p className="text-muted-foreground text-center">
            Bienvenido, {user?.name || user?.username} - Administrador del Sistema
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6" onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <Card key={stat.id} className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    {stat.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-950 border-zinc-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">Actividad de Usuarios</CardTitle>
                    <AreaChart className="h-4 w-4 text-primary" />
                  </div>
                  <CardDescription>Actividad diaria en la plataforma</CardDescription>
                </CardHeader>
                <CardContent className="h-[220px] flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    [Gráfica de actividad - Datos en tiempo real]
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-950 border-zinc-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">Distribución de Usuarios</CardTitle>
                    <PieChart className="h-4 w-4 text-primary" />
                  </div>
                  <CardDescription>Por tipo de cuenta y estado</CardDescription>
                </CardHeader>
                <CardContent className="h-[220px] flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    [Gráfica de distribución - Actualizada 01/04/2025]
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Alertas del Sistema</CardTitle>
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <CardDescription>Últimas notificaciones de la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start justify-between p-3 rounded-md bg-zinc-900"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${alert.type === 'error' ? 'text-red-500' :
                          alert.type === 'warning' ? 'text-yellow-500' :
                            alert.type === 'success' ? 'text-green-500' : 'text-blue-500'
                          }`}>
                          <AlertCircle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">{alert.time}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          alert.type === 'error' ? 'destructive' :
                            alert.type === 'warning' ? 'default' :
                              alert.type === 'success' ? 'outline' : 'secondary'
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
            <div className="w-full flex flex-col items-center justify-center mb-8">
              <div className="w-full max-w-4xl flex flex-col items-center justify-center gap-4 px-6 py-4 bg-zinc-900 rounded-xl border border-yellow-600/30 shadow-[0_2px_16px_0_rgba(255,215,0,0.10)]">
                <div className="w-full flex flex-col lg:flex-row items-center justify-between">
                  <div className="flex flex-col items-center lg:items-start text-center lg:text-left justify-center">
                    <h2 className="text-xl font-bold text-gradient bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-0">Gestión de Usuarios</h2>
                    <p className="text-sm text-gray-300 mb-4">Administra los usuarios de la plataforma</p>
                  </div>
                  <div className="flex gap-2 mt-0 lg:mt-0">
                    <Button className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold flex items-center gap-2 px-3 py-0.5 text-sm">
                      <span className="mr-1"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></span>
                      Nuevo Usuario
                    </Button>
                    <Button className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold flex items-center gap-2 px-3 py-0.5 text-sm">
                      <span className="mr-1"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M20 12H4" /></svg></span>
                      Eliminar Usuario
                    </Button>
                  </div>
                </div>
                <div className="w-full flex justify-center mt-0">
                  <Button variant="outline" className="border-yellow-600 text-yellow-600 font-medium flex items-center gap-2 px-3 py-0.5 text-sm">
                    <span className="mr-1"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M4 21h16M10 3h4M12 3v14m0 0l-4-4m4 4l4-4" /></svg></span>
                    Filtrar
                  </Button>
                </div>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Último Acceso</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-xs text-muted-foreground">@{user.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'outline' : 'destructive'}>
                          {user.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            {user.status === 'active' ? (
                              <EyeOff className="h-4 w-4 text-destructive" />
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
                <CardDescription>Últimas acciones en la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 bg-muted/20 p-3 rounded-md">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <UsersRound className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm"><span className="font-medium">María Gómez</span> ha iniciado sesión en la plataforma</p>
                      <p className="text-xs text-muted-foreground">Hace 1 hora</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-muted/20 p-3 rounded-md">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <Settings className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm"><span className="font-medium">Carlos Rodríguez</span> ha actualizado su perfil</p>
                      <p className="text-xs text-muted-foreground">Hace 3 horas</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-muted/20 p-3 rounded-md">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm"><span className="font-medium">Juan Pablo López</span> ha realizado cambios en los permisos</p>
                      <p className="text-xs text-muted-foreground">Hace 5 horas</p>
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
            <div className="w-full flex flex-col items-center justify-center mb-8">
              <div className="w-full max-w-3xl flex flex-col lg:flex-row items-center justify-between gap-4 px-4 py-3 bg-zinc-900 rounded-lg border border-yellow-600/30 shadow-[0_2px_12px_0_rgba(255,215,0,0.08)]">
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left justify-center">
                  <h2 className="text-xl font-bold text-gradient bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-0">Gestión del Sistema</h2>
                  <p className="text-sm text-gray-300 mb-0">Administra la configuración y el estado del sistema</p>
                </div>
                <div className="flex mt-0 lg:mt-0">
                  <Button variant="outline" className="border-yellow-600 text-yellow-600 font-medium flex items-center gap-1 px-3 py-0.5 text-sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">CPU</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">32%</div>
                  <p className="text-xs text-muted-foreground mt-1">Normal</p>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Memoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">64%</div>
                  <p className="text-xs text-muted-foreground mt-1">4.2GB/8GB</p>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Almacenamiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">45%</div>
                  <p className="text-xs text-muted-foreground mt-1">112GB/250GB</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>APIs Conectadas</CardTitle>
                <CardDescription>Estado de las conexiones externas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="font-medium">Yahoo Finance</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Última sincronización: 12:30 PM</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="font-medium">CoinMarket</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Última sincronización: 12:35 PM</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <span className="font-medium">CNBC</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Última sincronización: 11:45 AM</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span className="font-medium">Investing.com</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Error de conexión</div>
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
                <CardDescription>Procesos automáticos del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                    <div>
                      <p className="font-medium">Backup automático</p>
                      <p className="text-xs text-muted-foreground">Diario a las 4:00 AM</p>
                    </div>
                    <Badge variant="outline">Activo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                    <div>
                      <p className="font-medium">Actualización de precios</p>
                      <p className="text-xs text-muted-foreground">Cada 15 minutos</p>
                    </div>
                    <Badge variant="outline">Activo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                    <div>
                      <p className="font-medium">Limpieza de caché</p>
                      <p className="text-xs text-muted-foreground">Cada 48 horas</p>
                    </div>
                    <Badge variant="outline">Activo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                    <div>
                      <p className="font-medium">Envío de reportes</p>
                      <p className="text-xs text-muted-foreground">Semanal - Lunes 8:00 AM</p>
                    </div>
                    <Badge variant="outline">Activo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="w-full flex flex-col items-center justify-center mb-8">
              <div className="w-full max-w-3xl flex flex-col lg:flex-row items-center justify-between gap-4 px-4 py-3 bg-zinc-900 rounded-lg border border-yellow-600/30 shadow-[0_2px_12px_0_rgba(255,215,0,0.08)]">
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left justify-center">
                  <h2 className="text-xl font-bold text-gradient bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-0">Reportes y Análisis</h2>
                  <p className="text-sm text-gray-300 mb-0">Informes y métricas de la plataforma</p>
                </div>
                <div className="flex gap-2 mt-0 lg:mt-0">
                  <Button variant="outline" className="border-yellow-600 text-yellow-600 font-medium flex items-center gap-1 px-3 py-0.5 text-sm">
                    <span className="mr-1"><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M4 21h16M10 3h4M12 3v14m0 0l-4-4m4 4l4-4" /></svg></span>
                    Todos los reportes
                  </Button>
                  <Button className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold flex items-center gap-1 px-3 py-0.5 text-sm">
                    <span className="mr-1"><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></span>
                    Generar Reporte
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-zinc-950 border-zinc-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">Usuarios Activos</CardTitle>
                    <LineChart className="h-4 w-4 text-primary" />
                  </div>
                  <CardDescription>Últimos 30 días</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    [Gráfica de tendencia - Actualizada hoy]
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-950 border-zinc-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">Distribución por Funcionalidad</CardTitle>
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <CardDescription>Uso de características</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    [Gráfica de barras - Actualizada hoy]
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Reportes Disponibles</CardTitle>
                <CardDescription>Informes generados para descarga</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-xs text-muted-foreground">Generado: {report.date}</p>
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
                <CardDescription>Campañas y notificaciones enviadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/20 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Enviados</p>
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold mt-2">124</p>
                    <p className="text-xs text-muted-foreground">Este mes</p>
                  </div>
                  <div className="bg-muted/20 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Abiertos</p>
                      <Eye className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold mt-2">87</p>
                    <p className="text-xs text-muted-foreground">Tasa: 70.2%</p>
                  </div>
                  <div className="bg-muted/20 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Clicks</p>
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold mt-2">42</p>
                    <p className="text-xs text-muted-foreground">Tasa: 33.9%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t py-6 text-sm text-muted-foreground">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} Lion Heart Capital S.A.S. - Panel de Administración</p>
          <p className="text-xs">Versión 1.0.0 - Última actualización: 02/04/2025</p>
        </div>
      </footer>
    </div>
  );
}