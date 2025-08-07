import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown, DollarSign, CreditCard, Landmark, LineChart, PiggyBank, Wallet } from "lucide-react";

export default function FinanzasPersonalesPage() {
  const { user } = useAuth();

  // Datos de ejemplo
  const cuentas = [
    { nombre: "Cuenta de Ahorros", saldo: 5800000, entidad: "Bancolombia", tipo: "ahorro" },
    { nombre: "Cuenta Corriente", saldo: 2300000, entidad: "Davivienda", tipo: "corriente" },
    { nombre: "Cuenta de Nómina", saldo: 1200000, entidad: "Banco de Bogotá", tipo: "nomina" }
  ];

  const gastosMensuales = [
    { categoria: "Vivienda", monto: 1500000, porcentaje: 30 },
    { categoria: "Alimentación", monto: 800000, porcentaje: 16 },
    { categoria: "Transporte", monto: 400000, porcentaje: 8 },
    { categoria: "Servicios", monto: 300000, porcentaje: 6 },
    { categoria: "Entretenimiento", monto: 500000, porcentaje: 10 },
    { categoria: "Salud", monto: 250000, porcentaje: 5 },
    { categoria: "Educación", monto: 700000, porcentaje: 14 },
    { categoria: "Otros", monto: 550000, porcentaje: 11 }
  ];

  const ingresos = [
    { fuente: "Salario", monto: 4500000, fecha: "2025-03-30", recurrente: true },
    { fuente: "Freelance", monto: 1200000, fecha: "2025-03-15", recurrente: false },
    { fuente: "Inversiones", monto: 800000, fecha: "2025-03-28", recurrente: true }
  ];

  const tarjetas = [
    { 
      nombre: "Tarjeta Oro", 
      entidad: "Bancolombia", 
      limite: 8000000, 
      saldo: 2500000, 
      fechaCorte: "2025-04-15",
      fechaPago: "2025-04-20",
      tipo: "Visa"
    },
    { 
      nombre: "Tarjeta Platinum", 
      entidad: "Davivienda", 
      limite: 12000000, 
      saldo: 4500000, 
      fechaCorte: "2025-04-10",
      fechaPago: "2025-04-15",
      tipo: "Mastercard"
    }
  ];

  const prestamos = [
    {
      nombre: "Hipoteca",
      entidad: "Bancolombia",
      montoInicial: 150000000,
      saldoActual: 120000000,
      interes: 0.8,
      plazo: 180,
      cuotasMesActual: 36,
      fechaPago: "2025-04-15",
      valorCuota: 1450000
    },
    {
      nombre: "Préstamo Personal",
      entidad: "Davivienda",
      montoInicial: 25000000,
      saldoActual: 18000000,
      interes: 1.2,
      plazo: 60,
      cuotasMesActual: 24,
      fechaPago: "2025-04-20",
      valorCuota: 550000
    }
  ];

  // Calcular totales
  const totalCuentas = cuentas.reduce((total, cuenta) => total + cuenta.saldo, 0);
  const totalGastos = gastosMensuales.reduce((total, gasto) => total + gasto.monto, 0);
  const totalIngresos = ingresos.reduce((total, ingreso) => total + ingreso.monto, 0);
  const totalTarjetas = tarjetas.reduce((total, tarjeta) => total + tarjeta.saldo, 0);
  const totalPrestamos = prestamos.reduce((total, prestamo) => total + prestamo.saldoActual, 0);
  const saldoDisponible = totalIngresos - totalGastos;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Finanzas Personales
          </h1>
          <p className="text-muted-foreground">
            Gestiona tus ingresos, gastos y estado financiero
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Mensuales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrency(totalIngresos)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Próximo ingreso estimado: {formatCurrency(4500000)}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Gastos Mensuales
              </CardTitle>
              <CreditCard className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrency(totalGastos)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {(totalGastos / totalIngresos * 100).toFixed(1)}% de tus ingresos
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Saldo Disponible
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrency(saldoDisponible)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {(saldoDisponible / totalIngresos * 100).toFixed(1)}% para ahorro/inversión
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Patrimonio Total
              </CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrency(totalCuentas - totalTarjetas - totalPrestamos)}</div>
              <div className="flex items-center text-xs text-green-500 mt-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>2.5% este mes</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="cuentas" className="mt-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="cuentas">Cuentas</TabsTrigger>
            <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
            <TabsTrigger value="gastos">Gastos</TabsTrigger>
            <TabsTrigger value="tarjetas">Tarjetas</TabsTrigger>
            <TabsTrigger value="prestamos">Préstamos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cuentas">
            <div className="grid gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Cuentas Bancarias</CardTitle>
                  <CardDescription>
                    Saldo total en cuentas: {formatCurrency(totalCuentas)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cuentas.map((cuenta, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg">
                        <div>
                          <h4 className="font-medium">{cuenta.nombre}</h4>
                          <p className="text-sm text-muted-foreground">{cuenta.entidad}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{formatCurrency(cuenta.saldo)}</p>
                          <p className="text-xs text-muted-foreground">{cuenta.tipo}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ingresos">
            <div className="grid gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Ingresos</CardTitle>
                  <CardDescription>
                    Desglose de tus ingresos mensuales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ingresos.map((ingreso, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg">
                        <div>
                          <h4 className="font-medium">{ingreso.fuente}</h4>
                          <p className="text-sm text-muted-foreground">
                            {ingreso.recurrente ? "Recurrente" : "Único"} • {ingreso.fecha}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{formatCurrency(ingreso.monto)}</p>
                          <div className="flex items-center text-xs text-green-500">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            <span>{((ingreso.monto / totalIngresos) * 100).toFixed(1)}% del total</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gastos">
            <div className="grid gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Gastos</CardTitle>
                  <CardDescription>
                    Desglose de tus gastos mensuales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {gastosMensuales.map((gasto, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{gasto.categoria}</span>
                          <span className="text-sm">{formatCurrency(gasto.monto)}</span>
                        </div>
                        <Progress value={gasto.porcentaje} className="h-2" />
                        <p className="text-xs text-muted-foreground text-right">{gasto.porcentaje}% de gastos totales</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tarjetas">
            <div className="grid gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Tarjetas de Crédito</CardTitle>
                  <CardDescription>
                    Saldo utilizado: {formatCurrency(totalTarjetas)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {tarjetas.map((tarjeta, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{tarjeta.nombre}</h4>
                            <p className="text-sm text-muted-foreground">{tarjeta.entidad} • {tarjeta.tipo}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">{formatCurrency(tarjeta.saldo)}</p>
                            <p className="text-xs text-muted-foreground">de {formatCurrency(tarjeta.limite)}</p>
                          </div>
                        </div>
                        <Progress value={(tarjeta.saldo / tarjeta.limite) * 100} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <p>Fecha de corte: {tarjeta.fechaCorte}</p>
                          <p>Fecha de pago: {tarjeta.fechaPago}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="prestamos">
            <div className="grid gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Préstamos</CardTitle>
                  <CardDescription>
                    Saldo total pendiente: {formatCurrency(totalPrestamos)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {prestamos.map((prestamo, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{prestamo.nombre}</h4>
                            <p className="text-sm text-muted-foreground">{prestamo.entidad} • {prestamo.interes}% mensual</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">{formatCurrency(prestamo.saldoActual)}</p>
                            <p className="text-xs text-muted-foreground">de {formatCurrency(prestamo.montoInicial)}</p>
                          </div>
                        </div>
                        <Progress value={(1 - (prestamo.saldoActual / prestamo.montoInicial)) * 100} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <p>Cuota: {formatCurrency(prestamo.valorCuota)}</p>
                          <p>Progreso: {prestamo.cuotasMesActual} de {prestamo.plazo} meses</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}