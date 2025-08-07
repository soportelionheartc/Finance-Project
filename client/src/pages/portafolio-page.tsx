import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowUp, ArrowDown, Plus, Filter, Download, ChartPie, TrendingUp, BarChart2, Wallet } from "lucide-react";

export default function PortafolioPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("resumen");
  const [showAddAssetDialog, setShowAddAssetDialog] = useState(false);
  
  // Datos de ejemplo - Portfolio
  const portfolio = {
    id: 1,
    name: "Mi Portafolio Principal",
    totalValue: 65800000,
    performanceDay: 1.5,
    performanceWeek: 2.3,
    performanceMonth: -0.8,
    performanceYear: 12.5,
    createdAt: "2025-01-15",
    lastUpdated: "2025-04-01"
  };
  
  // Datos de ejemplo - Distribución de activos
  const assetDistribution = [
    { type: "Acciones", percentage: 45, value: 29610000 },
    { type: "Criptomonedas", percentage: 30, value: 19740000 },
    { type: "Fondos de Inversión", percentage: 15, value: 9870000 },
    { type: "Renta Fija", percentage: 8, value: 5264000 },
    { type: "Efectivo", percentage: 2, value: 1316000 }
  ];

  // Datos de ejemplo - Activos
  const assets = [
    {
      id: 1,
      name: "Bitcoin",
      symbol: "BTC",
      type: "crypto",
      quantity: 0.45,
      price: 66000000,
      value: 29700000,
      change24h: 2.1,
      allocation: 45.15,
      lastUpdated: "2025-04-01T10:30:00"
    },
    {
      id: 2,
      name: "Ethereum",
      symbol: "ETH",
      type: "crypto",
      quantity: 5.2,
      price: 3521000,
      value: 18309200,
      change24h: 3.5,
      allocation: 27.82,
      lastUpdated: "2025-04-01T10:30:00"
    },
    {
      id: 3,
      name: "Ecopetrol",
      symbol: "ECO",
      type: "stock",
      quantity: 500,
      price: 2510,
      value: 1255000,
      change24h: -1.2,
      allocation: 1.91,
      lastUpdated: "2025-04-01T10:30:00"
    },
    {
      id: 4,
      name: "Bancolombia",
      symbol: "BCOL",
      type: "stock",
      quantity: 120,
      price: 45200,
      value: 5424000,
      change24h: 0.8,
      allocation: 8.24,
      lastUpdated: "2025-04-01T10:30:00"
    },
    {
      id: 5,
      name: "Vanguard S&P 500 ETF",
      symbol: "VOO",
      type: "etf",
      quantity: 10,
      price: 1952000,
      value: 19520000,
      change24h: 0.5,
      allocation: 29.66,
      lastUpdated: "2025-04-01T10:30:00"
    },
    {
      id: 6,
      name: "TES Colombia 2026",
      symbol: "TESCOL26",
      type: "bond",
      quantity: 1,
      price: 5000000,
      value: 5000000,
      change24h: 0.1,
      allocation: 7.59,
      lastUpdated: "2025-04-01T10:30:00"
    }
  ];

  // Datos de ejemplo - Transacciones
  const transactions = [
    {
      id: 1,
      assetName: "Bitcoin",
      symbol: "BTC",
      type: "compra",
      quantity: 0.15,
      price: 65870000,
      value: 9880500,
      date: "2025-03-28T15:45:22",
      fee: 49402
    },
    {
      id: 2,
      assetName: "Ecopetrol",
      symbol: "ECO",
      type: "venta",
      quantity: 200,
      price: 2580,
      value: 516000,
      date: "2025-03-25T11:23:08",
      fee: 2580
    },
    {
      id: 3,
      assetName: "Ethereum",
      symbol: "ETH",
      type: "compra",
      quantity: 1.2,
      price: 3485000,
      value: 4182000,
      date: "2025-03-20T09:15:30",
      fee: 20910
    },
    {
      id: 4,
      assetName: "Vanguard S&P 500 ETF",
      symbol: "VOO",
      type: "compra",
      quantity: 2,
      price: 1897000,
      value: 3794000,
      date: "2025-03-15T14:32:45",
      fee: 18970
    },
    {
      id: 5,
      assetName: "TES Colombia 2026",
      symbol: "TESCOL26",
      type: "compra",
      quantity: 1,
      price: 5000000,
      value: 5000000,
      date: "2025-03-10T10:05:18",
      fee: 25000
    }
  ];

  // Formato de moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Formato de porcentaje
  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Formato de fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular valores totales
  const calculateTotal = (data: any[]) => {
    return data.reduce((total, item) => total + item.value, 0);
  };

  // Determinar color basado en el cambio
  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return "text-gray-500";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Mi Portafolio
          </h1>
          <p className="text-muted-foreground">
            Gestiona y analiza tus inversiones en un solo lugar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Valor Total
              </CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrency(portfolio.totalValue)}</div>
              <div className="flex items-center text-xs text-green-500 mt-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>{formatPercentage(portfolio.performanceDay)} hoy</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Rendimiento
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Día</p>
                  <p className={`font-medium ${getChangeColor(portfolio.performanceDay)}`}>
                    {formatPercentage(portfolio.performanceDay)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Semana</p>
                  <p className={`font-medium ${getChangeColor(portfolio.performanceWeek)}`}>
                    {formatPercentage(portfolio.performanceWeek)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Mes</p>
                  <p className={`font-medium ${getChangeColor(portfolio.performanceMonth)}`}>
                    {formatPercentage(portfolio.performanceMonth)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Año</p>
                  <p className={`font-medium ${getChangeColor(portfolio.performanceYear)}`}>
                    {formatPercentage(portfolio.performanceYear)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Acciones Rápidas
              </CardTitle>
              <ChartPie className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={() => setShowAddAssetDialog(true)}
                  className="w-full text-xs bg-primary hover:bg-primary/90 text-black"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Añadir Activo
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-xs"
                >
                  <Filter className="h-3.5 w-3.5 mr-1" />
                  Filtrar por Tipo
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-xs"
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Exportar Datos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="resumen" value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="activos">Activos</TabsTrigger>
            <TabsTrigger value="transacciones">Transacciones</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resumen" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Distribución de Activos</CardTitle>
                  <CardDescription>
                    Tu asignación actual por tipo de activo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assetDistribution.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.type}</span>
                          <div className="text-right">
                            <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
                            <span className="text-xs text-muted-foreground ml-2">({item.percentage}%)</span>
                          </div>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Rendimiento por Activo</CardTitle>
                  <CardDescription>
                    Variación en las últimas 24 horas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assets.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between p-2 border border-zinc-800 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                            <span className="text-xs font-bold text-primary">
                              {asset.symbol.slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{asset.name}</p>
                            <p className="text-xs text-muted-foreground">{asset.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${getChangeColor(asset.change24h)}`}>
                            {formatPercentage(asset.change24h)}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatCurrency(asset.value)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>
                  Últimas 5 transacciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Activo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div className="text-sm">{formatDate(transaction.date)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{transaction.assetName}</div>
                            <div className="text-xs text-muted-foreground">{transaction.symbol}</div>
                          </TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              transaction.type === 'compra' 
                                ? 'bg-green-500/20 text-green-500' 
                                : 'bg-red-500/20 text-red-500'
                            }`}>
                              {transaction.type.toUpperCase()}
                            </div>
                          </TableCell>
                          <TableCell>{transaction.quantity}</TableCell>
                          <TableCell>{formatCurrency(transaction.price)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(transaction.value)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="border-t border-zinc-800 pt-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setActiveTab("transacciones")}
                >
                  Ver todas las transacciones
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="activos">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Mis Activos</CardTitle>
                  <CardDescription>
                    Todos los activos en tu portafolio
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setShowAddAssetDialog(true)}
                  className="bg-primary hover:bg-primary/90 text-black"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Activo
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Activo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Cambio 24h</TableHead>
                        <TableHead>Asignación</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                          </TableCell>
                          <TableCell>
                            <div className="capitalize">{asset.type}</div>
                          </TableCell>
                          <TableCell>{asset.quantity}</TableCell>
                          <TableCell>{formatCurrency(asset.price)}</TableCell>
                          <TableCell>{formatCurrency(asset.value)}</TableCell>
                          <TableCell>
                            <div className={`flex items-center ${getChangeColor(asset.change24h)}`}>
                              {asset.change24h > 0 ? (
                                <ArrowUp className="h-3.5 w-3.5 mr-1" />
                              ) : asset.change24h < 0 ? (
                                <ArrowDown className="h-3.5 w-3.5 mr-1" />
                              ) : null}
                              {formatPercentage(asset.change24h)}
                            </div>
                          </TableCell>
                          <TableCell>{asset.allocation.toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="border-t border-zinc-800 pt-4 flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Total: <span className="font-medium text-primary">{formatCurrency(calculateTotal(assets))}</span>
                </div>
                <Button 
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar a Excel
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="transacciones">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Historial de Transacciones</CardTitle>
                  <CardDescription>
                    Registro de todas tus operaciones
                  </CardDescription>
                </div>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-black"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Transacción
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Tipo de operación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las operaciones</SelectItem>
                        <SelectItem value="buy">Solo compras</SelectItem>
                        <SelectItem value="sell">Solo ventas</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Tipo de activo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los activos</SelectItem>
                        <SelectItem value="crypto">Criptomonedas</SelectItem>
                        <SelectItem value="stock">Acciones</SelectItem>
                        <SelectItem value="etf">ETFs y Fondos</SelectItem>
                        <SelectItem value="bond">Renta Fija</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Input 
                      placeholder="Buscar..." 
                      className="w-[180px] border-zinc-700 bg-zinc-800"
                    />
                    <Button variant="outline">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Activo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead className="text-right">Comisión</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div className="text-sm">{formatDate(transaction.date)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{transaction.assetName}</div>
                            <div className="text-xs text-muted-foreground">{transaction.symbol}</div>
                          </TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              transaction.type === 'compra' 
                                ? 'bg-green-500/20 text-green-500' 
                                : 'bg-red-500/20 text-red-500'
                            }`}>
                              {transaction.type.toUpperCase()}
                            </div>
                          </TableCell>
                          <TableCell>{transaction.quantity}</TableCell>
                          <TableCell>{formatCurrency(transaction.price)}</TableCell>
                          <TableCell>{formatCurrency(transaction.value)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(transaction.fee)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="border-t border-zinc-800 pt-4 flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Mostrando 5 de 50 transacciones
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Anterior
                  </Button>
                  <Button variant="outline" size="sm">
                    Siguiente
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Diálogo para Añadir Activo */}
      <Dialog open={showAddAssetDialog} onOpenChange={setShowAddAssetDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Activo</DialogTitle>
            <DialogDescription>
              Ingresa los detalles del activo que deseas añadir a tu portafolio
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="asset-type" className="text-right">
                Tipo
              </Label>
              <Select defaultValue="crypto">
                <SelectTrigger id="asset-type" className="col-span-3">
                  <SelectValue placeholder="Seleccionar tipo de activo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crypto">Criptomoneda</SelectItem>
                  <SelectItem value="stock">Acción</SelectItem>
                  <SelectItem value="etf">ETF / Fondo</SelectItem>
                  <SelectItem value="bond">Renta Fija</SelectItem>
                  <SelectItem value="cash">Efectivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="asset-name" className="text-right">
                Nombre
              </Label>
              <Input
                id="asset-name"
                placeholder="Ej. Bitcoin"
                className="col-span-3 border-zinc-700 bg-zinc-800"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="asset-symbol" className="text-right">
                Símbolo
              </Label>
              <Input
                id="asset-symbol"
                placeholder="Ej. BTC"
                className="col-span-3 border-zinc-700 bg-zinc-800"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="asset-quantity" className="text-right">
                Cantidad
              </Label>
              <Input
                id="asset-quantity"
                type="number"
                placeholder="Ej. 0.5"
                className="col-span-3 border-zinc-700 bg-zinc-800"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="asset-price" className="text-right">
                Precio Unitario
              </Label>
              <Input
                id="asset-price"
                type="number"
                placeholder="Ej. 65000000"
                className="col-span-3 border-zinc-700 bg-zinc-800"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="asset-date" className="text-right">
                Fecha de Compra
              </Label>
              <Input
                id="asset-date"
                type="date"
                className="col-span-3 border-zinc-700 bg-zinc-800"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddAssetDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-black"
              onClick={() => setShowAddAssetDialog(false)}
            >
              Añadir Activo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}