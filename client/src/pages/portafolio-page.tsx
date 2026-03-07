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
import { ArrowRight, ArrowUp, ArrowDown, Plus, Filter, Download, ChartPie, TrendingUp, TrendingDown, BarChart2, Wallet } from "lucide-react";
import { useEffect } from "react";
import { AddAssetForm } from "@/components/finance/add-asset-form";
import { PortfolioSummary } from "@/components/finance/portfolio-summary";
import { AssetDistribution } from "@/components/finance/asset-distribution";
import { InvestorProfileGuard } from "@/lib/investor-profile-guard";


type Asset = {
  id: number;
  name: string;
  symbol: string;
  type: string;
  quantity: number;
  price: number;
  value: number;
  change24h: number;
  allocation: number;
  lastUpdated: string;
};

export default function PortafolioPage() {
  // ...existing code...
  // Portafolios del usuario
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(null);
  // Portafolio seleccionado
  const selectedPortfolio = portfolios.find(p => p.id === selectedPortfolioId);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(true);
  // Estados para los filtros de transacciones
  const [filterOperation, setFilterOperation] = useState("all");
  const [filterAsset, setFilterAsset] = useState("all");
  // Función para exportar los activos filtrados a CSV
  const handleExportCSV = () => {
    const headers = [
      'Nombre', 'Símbolo', 'Tipo', 'Cantidad', 'Precio', 'Valor', 'Cambio 24h', 'Asignación', 'Última Actualización'
    ];
    const rows = filteredAssets.map(asset => [
      asset.name,
      asset.symbol,
      asset.type,
      asset.quantity,
      asset.price,
      asset.value,
      asset.change24h,
      asset.allocation,
      asset.lastUpdated
    ]);
    // Poner cada valor entre comillas y escapar comillas internas
    const escape = (val: any) => `"${String(val).replace(/"/g, '""')}"`;
    const csvContent = [headers, ...rows]
      .map(row => row.map(escape).join(";"))
      .join("\r\n");
    // Agregar BOM al inicio para compatibilidad con Excel y UTF-8
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Mis activos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  // Estado para mostrar el menú de filtro
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  // Estado para el tipo de filtro
  const [filterType, setFilterType] = useState<string | null>(null);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("resumen");
  const [showAddAssetDialog, setShowAddAssetDialog] = useState(false);
  // Estado para el diálogo de nueva transacción
  const [showAddTransactionDialog, setShowAddTransactionDialog] = useState(false);
  // Estado para los datos de la nueva transacción
  const [newTransaction, setNewTransaction] = useState({
    assetName: '',
    symbol: '',
    type: 'compra',
    quantity: '',
    price: '',
    value: '',
    date: '',
    fee: ''
  });

  // ...existing code...
useEffect(() => {
  if (!selectedPortfolioId && portfolios.length > 0) {
    setSelectedPortfolioId(portfolios[0].id);
  }
}, [portfolios, selectedPortfolioId]);

  useEffect(() => {
    async function fetchPortfolios() {
      if (!user) return;
      setIsLoadingPortfolio(true);
      try {
        const res = await fetch(`/api/portfolios?userId=${user.id}`, { credentials: "include" });
        if (!res.ok) throw new Error("Error al obtener portafolios");
        const data = await res.json();
        setPortfolios(Array.isArray(data) ? data : []);
        // Seleccionar el primero por defecto
        if (data.length > 0) setSelectedPortfolioId(data[0].id);
      } catch (err: any) {
        setPortfolioError(err.message || "Error desconocido");
      } finally {
        setIsLoadingPortfolio(false);
      }
    }
    fetchPortfolios();
  }, [user]);

  // Cargar activos cuando cambie el portafolio seleccionado
  useEffect(() => {
    async function fetchAssets() {
      if (!selectedPortfolioId) {
        setAssets([]);
        return;
      }
      try {
        const assetsRes = await fetch(`/api/portfolios/${selectedPortfolioId}/assets`, { credentials: "include" });
        if (!assetsRes.ok) throw new Error("Error al obtener activos");
        const assetsData = await assetsRes.json();
        setAssets(Array.isArray(assetsData) ? assetsData : []);
      } catch {
        setAssets([]);
      }
    }
    fetchAssets();
  }, [selectedPortfolioId]);

  // Estado para activos
  const [assets, setAssets] = useState<Asset[]>([]);


  // Distribución de activos basada en la BD
  const assetTypeLabels: Record<string, string> = {
    crypto: "Criptomonedas",
    stock: "Acciones",
    etf: "ETF / Fondos",
    bond: "Renta Fija",
    cash: "Efectivo"
  };

  const assetDistribution = (() => {
    if (!assets || assets.length === 0) return [];
    const total = assets.reduce((sum, a) => sum + (typeof a.value === 'number' ? a.value : 0), 0);
    const grouped: Record<string, number> = {};
    assets.forEach(a => {
      if (!grouped[a.type]) grouped[a.type] = 0;
      grouped[a.type] += typeof a.value === 'number' ? a.value : 0;
    });
    return Object.entries(grouped).map(([type, value]) => ({
      type: assetTypeLabels[type] || type,
      value,
      percentage: total > 0 ? Number((value / total * 100).toFixed(1)) : 0
    }));
  })();

  // Estado para el nuevo activo
  const [newAsset, setNewAsset] = useState({
    type: "crypto",
    name: "",
    symbol: "",
    quantity: "",
    price: "",
    date: ""
  });

  // Filtrar activos según el tipo seleccionado
  const filteredAssets = filterType
    ? assets.filter(asset => asset.type === filterType)
    : assets;

  // Estado para transacciones (editable)
 // Estado para transacciones (cargadas desde backend)
const [transactions, setTransactions] = useState<any[]>([]);
const [loadingTransactions, setLoadingTransactions] = useState(false);
const [transactionsError, setTransactionsError] = useState<string | null>(null);

useEffect(() => {
  async function fetchTransactions() {
    if (!selectedPortfolioId) {
      setTransactions([]);
      return;
    }
    setLoadingTransactions(true);
    setTransactionsError(null);
    try {
      const res = await fetch(`/api/portfolios/${selectedPortfolioId}/transactions`, {
        credentials: "include",
      });
      if (!res.ok) {
        // lee mensaje del backend si viene
        const body = await res.text();
        throw new Error(`Error ${res.status} al obtener transacciones. ${body}`);
      }
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error cargando transacciones:", err);
      setTransactions([]);
      setTransactionsError(err.message || "Error desconocido al cargar transacciones");
    } finally {
      setLoadingTransactions(false);
    }
  }

  fetchTransactions();
}, [selectedPortfolioId]);



  // Calcular el rendimiento total usando el valor inicial y actual del portafolio seleccionado
  const initialPortfolioValue = selectedPortfolio?.initial_value ?? 0;
  const currentPortfolioValue = selectedPortfolio?.totalValue ?? 0;
  const totalReturn = initialPortfolioValue > 0
    ? ((currentPortfolioValue - initialPortfolioValue) / initialPortfolioValue) * 100
    : 0;

  // Estado para el texto de búsqueda
  const [searchText, setSearchText] = useState("");

  // Filtrar transacciones según los filtros seleccionados y el texto de búsqueda
  const filteredTransactions = transactions.filter(transaction => {
    const typeMatch =
      filterOperation === "all" ||
      (filterOperation === "buy" && transaction.type === "compra") ||
      (filterOperation === "sell" && transaction.type === "venta");
    // Buscar el tipo de activo en la lista de assets
    const assetObj = assets.find(a => a.symbol === transaction.symbol);
    const assetType = assetObj ? assetObj.type : "";
    const assetMatch = filterAsset === "all" || assetType === filterAsset;
    // Coincidencia con el texto de búsqueda
    const searchMatch = searchText.trim() === "" || (
      transaction.assetName.toLowerCase().includes(searchText.toLowerCase()) ||
      transaction.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchText.toLowerCase())
    );
    return typeMatch && assetMatch && searchMatch;
  });

  // Formato de moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Formato de porcentaje
  const formatPercentage = (value: number | undefined | null) => {
    if (typeof value !== 'number' || isNaN(value)) return '-';
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

  // --- Función para añadir un activo al portafolio seleccionado ---
  const handleAddAsset = async () => {
    if (!newAsset.name || !newAsset.symbol || !newAsset.quantity || !newAsset.price) return;
    if (!selectedPortfolio || !selectedPortfolio.id) return;
    // Calcular valor y asignación
    const value = Number(newAsset.quantity) * Number(newAsset.price);
    const totalValue = assets.reduce((acc, a) => acc + a.value, 0) + value;
    const assetToAdd = {
      name: newAsset.name,
      symbol: newAsset.symbol,
      type: newAsset.type,
      quantity: Number(newAsset.quantity),
      price: Number(newAsset.price),
      value,
      change24h: 0,
      allocation: (value / totalValue) * 100,
      lastUpdated: newAsset.date || new Date().toISOString()
    };
    try {
      const res = await fetch(`/api/portfolios/${selectedPortfolio.id}/assets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(assetToAdd)
      });
      if (!res.ok) throw new Error("Error al guardar el activo");
      // Recargar activos desde el backend
      const assetsRes = await fetch(`/api/portfolios/${selectedPortfolio.id}/assets`, { credentials: "include" });
      const assetsData = await assetsRes.json();
      setAssets(Array.isArray(assetsData) ? assetsData : []);

      // Recargar portafolio actualizado
      const portfolioRes = await fetch(`/api/portfolios/${selectedPortfolio.id}`, { credentials: "include" });
      if (portfolioRes.ok) {
        const updatedPortfolio = await portfolioRes.json();
        setPortfolios(prev => prev.map(p => p.id === updatedPortfolio.id ? updatedPortfolio : p));
      }

      setShowAddAssetDialog(false);
      setNewAsset({ type: "crypto", name: "", symbol: "", quantity: "", price: "", date: "" });
    } catch (err) {
      alert("Error al guardar el activo");
    }
  };

  return (
    <InvestorProfileGuard>
      <div className="min-h-screen bg-background">
        <Header />
         <Button
        variant="outline"
        onClick={() => window.history.back()}
        className="mb-4 w-fit"
      >
        ← Volver
      </Button>
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-2 mb-6 justify-center items-center">
        <h1 className="text-3xl font-bold text-yellow-500 mb-2">
            Mis Portafolios
          </h1>
          <p className="text-muted-foreground">
            Gestiona y analiza tus inversiones en un solo lugar
          </p>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <PortfolioSummary />
      <AssetDistribution />
        </div>
        <div className="flex flex-col space-y-2 mb-6 justify-center items-center">
          {portfolios.length > 1 && (
            <div className="sticky top-0 z-20 pb-2 overflow-x-auto w-full justify-center flex">
              <Tabs value={selectedPortfolioId ? String(selectedPortfolioId) : undefined} onValueChange={val => setSelectedPortfolioId(Number(val))}>
                <TabsList className="gap-2 justify-center gap-2">
                  {[...portfolios].sort((a, b) => a.id - b.id).map((p) => (
                    <TabsTrigger key={p.id} value={String(p.id)}>{p.name}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center w-full justify-between">
                <CardTitle className="text-2xl font-medium">
                  Valor Total
                </CardTitle>
                <div className="flex flex-col ml-4">
                  <div className="text-xl font-bold text-muted-foreground">
                    {selectedPortfolio ? formatCurrency(selectedPortfolio.totalValue) : '-'}
                  </div>
                </div>
                <Wallet className="h-4 w-4 text-primary ml-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-base mt-1">
                {initialPortfolioValue > 0 ? (
                  <span className="text-muted-foreground flex items-center justify-center text-center w-full">
                    Rendimiento total:
                    <span className={`ml-2 flex items-center justify-center ${getChangeColor(totalReturn)}`}>
                      {totalReturn >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                      {formatPercentage(totalReturn)}
                    </span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">Sin datos</span>
                )}
              </div>
            </CardContent>
          </Card>

          {selectedPortfolio && (
            selectedPortfolio.performanceDay !== undefined ||
            selectedPortfolio.performanceWeek !== undefined ||
            selectedPortfolio.performanceMonth !== undefined ||
            selectedPortfolio.performanceYear !== undefined
          ) ? (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-2xl font-medium">
                  Rendimiento
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground text-base">Día</p>
                    <p className={`font-medium text-sm flex items-center ${selectedPortfolio ? getChangeColor(selectedPortfolio.performanceDay) : ''}`}>
                      {selectedPortfolio ? (
                        <>
                          {selectedPortfolio.performanceDay > 0 ? <TrendingUp className="h-3.5 w-3.5 mr-1" /> : selectedPortfolio.performanceDay < 0 ? <TrendingDown className="h-3.5 w-3.5 mr-1" /> : null}
                          {formatPercentage(selectedPortfolio.performanceDay)}
                        </>
                      ) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-base">Semana</p>
                    <p className={`font-medium text-sm flex items-center ${selectedPortfolio ? getChangeColor(selectedPortfolio.performanceWeek) : ''}`}>
                      {selectedPortfolio ? (
                        <>
                          {selectedPortfolio.performanceWeek > 0 ? <TrendingUp className="h-3.5 w-3.5 mr-1" /> : selectedPortfolio.performanceWeek < 0 ? <TrendingDown className="h-3.5 w-3.5 mr-1" /> : null}
                          {formatPercentage(selectedPortfolio.performanceWeek)}
                        </>
                      ) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-base">Mes</p>
                    <p className={`font-medium text-sm flex items-center ${selectedPortfolio ? getChangeColor(selectedPortfolio.performanceMonth) : ''}`}>
                      {selectedPortfolio ? (
                        <>
                          {selectedPortfolio.performanceMonth > 0 ? <TrendingUp className="h-3.5 w-3.5 mr-1" /> : selectedPortfolio.performanceMonth < 0 ? <TrendingDown className="h-3.5 w-3.5 mr-1" /> : null}
                          {formatPercentage(selectedPortfolio.performanceMonth)}
                        </>
                      ) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-base">Año</p>
                    <p className={`font-medium text-sm flex items-center ${selectedPortfolio ? getChangeColor(selectedPortfolio.performanceYear) : ''}`}>
                      {selectedPortfolio ? (
                        <>
                          {selectedPortfolio.performanceYear > 0 ? <TrendingUp className="h-3.5 w-3.5 mr-1" /> : selectedPortfolio.performanceYear < 0 ? <TrendingDown className="h-3.5 w-3.5 mr-1" /> : null}
                          {formatPercentage(selectedPortfolio.performanceYear)}
                        </>
                      ) : '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-2xl font-medium">
                  Rendimiento
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-4">
                  No hay datos de rendimiento disponibles para este portafolio.
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-2xl font-medium mb-1">
                Acciones Rápidas
              </CardTitle>
              <ChartPie className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-center items-center relative">
                <Button
                  onClick={() => setShowAddAssetDialog(true)}
                  className="w-[150px] text-sm bg-primary hover:bg-primary/90 text-black mb-3"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Añadir Activo
                </Button>
                <div className="relative mb-3">
                  <Button
                    variant="outline"
                    className="w-[150px] text-sm"
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                  >
                    <Filter className="h-3.5 w-3.5 mr-1" />
                    Filtrar por Tipo
                  </Button>
                  {showFilterMenu && (
                    <div className="absolute left-0 mt-2 w-[150px] bg-zinc-900 border rounded shadow-lg z-10">
                      <button className={`w-full text-center px-4 py-2 hover:bg-zinc-800 ${filterType === null ? 'text-primary' : ''}`} onClick={() => { setFilterType(null); setShowFilterMenu(false); }}>Todos</button>
                      <button className={`w-full text-center px-4 py-2 hover:bg-zinc-800 ${filterType === 'crypto' ? 'text-primary' : ''}`} onClick={() => { setFilterType('crypto'); setShowFilterMenu(false); }}>Criptomonedas</button>
                      <button className={`w-full text-center px-4 py-2 hover:bg-zinc-800 ${filterType === 'stock' ? 'text-primary' : ''}`} onClick={() => { setFilterType('stock'); setShowFilterMenu(false); }}>Acciones</button>
                      <button className={`w-full text-center px-4 py-2 hover:bg-zinc-800 ${filterType === 'etf' ? 'text-primary' : ''}`} onClick={() => { setFilterType('etf'); setShowFilterMenu(false); }}>ETFs y Fondos</button>
                      <button className={`w-full text-center px-4 py-2 hover:bg-zinc-800 ${filterType === 'bond' ? 'text-primary' : ''}`} onClick={() => { setFilterType('bond'); setShowFilterMenu(false); }}>Renta Fija</button>
                      <button className={`w-full text-center px-4 py-2 hover:bg-zinc-800 ${filterType === 'cash' ? 'text-primary' : ''}`} onClick={() => { setFilterType('cash'); setShowFilterMenu(false); }}>Efectivo</button>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-[150px] text-sm"
                  onClick={handleExportCSV}
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
                  <CardTitle className="text-2xl text-center">Distribución de Activos</CardTitle>
                  <CardDescription className="text-base text-center">
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
                  <CardTitle className="text-2xl text-center">Rendimiento por Activo</CardTitle>
                  <CardDescription className="text-base text-center">
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
                <CardTitle className="text-2xl text-center">Actividad Reciente</CardTitle>
                <CardDescription className="text-base text-center">
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
                            <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${transaction.type === 'compra'
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
                  <CardTitle className="text-2xl">Mis Activos</CardTitle>
                  <CardDescription className="text-base">
                    Todos los activos en tu portafolio
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowAddAssetDialog(true)}
                  className="bg-primary hover:bg-primary/90 text-black w-[100px]"
                >
                  <Plus className="h-2 w-4" />
                  Añadir
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
                      {filteredAssets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                          </TableCell>
                          <TableCell>
                            <div className="capitalize">{assetTypeLabels[asset.type] || asset.type}</div>
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
                          <TableCell>{
                            typeof asset.allocation === 'number' && !isNaN(asset.allocation)
                              ? asset.allocation.toFixed(2) + '%'
                              : '-'
                          }</TableCell>
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
                  onClick={handleExportCSV}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar a Excel
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="transacciones">
            <Card className="bg-zinc-900 border-zinc-800 w-full max-w-full">
              <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-2xl">Historial de Transacciones</CardTitle>
                  <CardDescription className="text-base">
                    Registro de todas tus operaciones
                  </CardDescription>
                </div>
                <Button
                  className="bg-primary hover:bg-primary/90 text-black w-full"
                  onClick={() => setShowAddTransactionDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                  Añadir transacción
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-stretch justify-between mb-4 gap-2 w-full">
                  <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full">
                    <Select value={filterOperation} onValueChange={setFilterOperation}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Tipo de operación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las operaciones</SelectItem>
                        <SelectItem value="buy">Solo compras</SelectItem>
                        <SelectItem value="sell">Solo ventas</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterAsset} onValueChange={setFilterAsset}>
                      <SelectTrigger className="w-full md:w-[180px]">
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

                  <div className="flex flex-row items-center gap-2 w-full md:w-auto">
                    <Input
                      placeholder="Buscar..."
                      className="w-full md:w-[180px] border"
                      value={searchText}
                      onChange={e => setSearchText(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto w-full">
                  <Table className="min-w-[600px] w-full">
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
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div className="text-sm">{formatDate(transaction.date)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{transaction.assetName}</div>
                            <div className="text-xs text-muted-foreground">{transaction.symbol}</div>
                          </TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${transaction.type === 'compra'
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
              <CardFooter className="border-t border-zinc-800 pt-4 flex flex-col md:flex-row justify-between gap-2">
                <div className="text-sm text-muted-foreground">
                  Mostrando 5 de {transactions.length} transacciones
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
      {/* Diálogo para Añadir Transacción */}
      <Dialog open={showAddTransactionDialog} onOpenChange={setShowAddTransactionDialog}>
        <DialogContent className="bg-zinc-900 max-w-sm w-full mx-auto p-4 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Añadir Nueva Transacción</DialogTitle>
            <DialogDescription className="text-base">
              Ingresa los detalles de la transacción que deseas registrar
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transaction-assetName" className="text-center">Activo</Label>
              <Input
                id="transaction-assetName"
                placeholder="Ej. Bitcoin"
                className="col-span-3"
                value={newTransaction.assetName}
                onChange={e => setNewTransaction({ ...newTransaction, assetName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transaction-symbol" className="text-center">Símbolo</Label>
              <Input
                id="transaction-symbol"
                placeholder="Ej. BTC"
                className="col-span-3"
                value={newTransaction.symbol}
                onChange={e => setNewTransaction({ ...newTransaction, symbol: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transaction-type" className="text-center">Tipo</Label>
              <Select
                defaultValue={newTransaction.type}
                onValueChange={value => setNewTransaction({ ...newTransaction, type: value })}
              >
                <SelectTrigger id="transaction-type" className="col-span-3">
                  <SelectValue placeholder="Seleccionar tipo de operación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compra">Compra</SelectItem>
                  <SelectItem value="venta">Venta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transaction-quantity" className="text-center">Cantidad</Label>
              <Input
                id="transaction-quantity"
                type="number"
                placeholder="Ej. 0.5"
                className="col-span-3"
                value={newTransaction.quantity}
                onChange={e => setNewTransaction({ ...newTransaction, quantity: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transaction-price" className="text-center">Precio Unitario</Label>
              <Input
                id="transaction-price"
                type="number"
                placeholder="Ej. 65000000"
                className="col-span-3"
                value={newTransaction.price}
                onChange={e => setNewTransaction({ ...newTransaction, price: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transaction-fee" className="text-center">Comisión</Label>
              <Input
                id="transaction-fee"
                type="number"
                placeholder="Ej. 10000"
                className="col-span-3"
                value={newTransaction.fee}
                onChange={e => setNewTransaction({ ...newTransaction, fee: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transaction-date" className="text-center">Fecha</Label>
              <Input
                id="transaction-date"
                type="datetime-local"
                className="col-span-3"
                value={newTransaction.date}
                onChange={e => setNewTransaction({ ...newTransaction, date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex w-full justify-between">
              <Button
                className="bg-primary hover:bg-primary/90 text-black w-[150px] mb-4"
                onClick={() => {
                  // Validar y agregar la transacción
                  if (!newTransaction.assetName || !newTransaction.symbol || !newTransaction.quantity || !newTransaction.price || !newTransaction.date) return;
                  // Calcular el valor total
                  const value = Number(newTransaction.quantity) * Number(newTransaction.price);
                  // Generar nuevo id
                  const newId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
                  setTransactions([
                    ...transactions,
                    {
                      id: newId,
                      assetName: newTransaction.assetName,
                      symbol: newTransaction.symbol,
                      type: newTransaction.type,
                      quantity: Number(newTransaction.quantity),
                      price: Number(newTransaction.price),
                      value,
                      date: newTransaction.date,
                      fee: Number(newTransaction.fee) || 0
                    }
                  ]);
                  setShowAddTransactionDialog(false);
                  setNewTransaction({
                    assetName: '', symbol: '', type: 'compra', quantity: '', price: '', value: '', date: '', fee: ''
                  });
                }}
              >
                Añadir Transacción
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddTransactionDialog(false)}
                className="hover:bg-primary/90 w-[150px] h-[42px]"
              >
                Cancelar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showAddAssetDialog} onOpenChange={setShowAddAssetDialog}>
        <DialogContent className="bg-zinc-900 w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Añadir Nuevo Activo</DialogTitle>
            <DialogDescription className="text-base">
              Ingresa los detalles del activo que deseas añadir a tu portafolio
            </DialogDescription>
          </DialogHeader>
          <AddAssetForm
            asset={newAsset}
            setAsset={setNewAsset}
            submitLabel="Añadir Activo"
            onSubmit={handleAddAsset}
            disabled={false}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddAssetDialog(false)}
              className="hover:bg-primary/90 w-[150px] h-[42px]"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </InvestorProfileGuard>
  );
}