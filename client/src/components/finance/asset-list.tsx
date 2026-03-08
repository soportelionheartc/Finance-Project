import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Search, Monitor, ShoppingBag } from "lucide-react";
import { SiBitcoin, SiEthereum, SiApple, SiTesla } from "react-icons/si";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Asset {
  id: number;
  name: string;
  symbol: string;
  type: string;
  price: number;
  value: number;
  quantity: number;
  change24h: number;
  portfolioId: number;
  icon: string;
}

export const AssetList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Datos de ejemplo para los activos
  const assets: Asset[] = [
    {
      id: 1,
      name: "Bitcoin",
      symbol: "BTC",
      type: "crypto",
      price: 42156.89,
      value: 8431.38,
      quantity: 0.2,
      change24h: 2.34,
      portfolioId: 1,
      icon: "bitcoin"
    },
    {
      id: 2,
      name: "Ethereum",
      symbol: "ETH",
      type: "crypto",
      price: 2592.15,
      value: 5184.30,
      quantity: 2,
      change24h: 1.45,
      portfolioId: 1,
      icon: "ethereum"
    },
    {
      id: 3,
      name: "Apple Inc.",
      symbol: "AAPL",
      type: "stock",
      price: 169.75,
      value: 16975.00,
      quantity: 100,
      change24h: 1.23,
      portfolioId: 1,
      icon: "apple"
    },
    {
      id: 4,
      name: "Amazon.com Inc.",
      symbol: "AMZN",
      type: "stock",
      price: 178.35,
      value: 17835.00,
      quantity: 100,
      change24h: 2.14,
      portfolioId: 1,
      icon: "amazon"
    },
    {
      id: 5,
      name: "Microsoft Corp.",
      symbol: "MSFT",
      type: "stock",
      price: 408.12,
      value: 20406.00,
      quantity: 50,
      change24h: 0.89,
      portfolioId: 1,
      icon: "microsoft"
    },
    {
      id: 6,
      name: "Tesla Inc.",
      symbol: "TSLA",
      type: "stock",
      price: 172.63,
      value: 8631.50,
      quantity: 50,
      change24h: -1.87,
      portfolioId: 1,
      icon: "tesla"
    }
  ];

  // Filtrar activos según la búsqueda
  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIconForAsset = (asset: Asset) => {
    switch (asset.icon) {
      case 'bitcoin':
        return <SiBitcoin className="h-4 w-4 text-orange-500" />;
      case 'ethereum':
        return <SiEthereum className="h-4 w-4 text-purple-500" />;
      case 'apple':
        return <SiApple className="h-4 w-4 text-gray-500" />;
      case 'amazon':
        return <ShoppingBag className="h-4 w-4 text-yellow-700" />;
      case 'microsoft':
        return <Monitor className="h-4 w-4 text-blue-500" />;
      case 'tesla':
        return <SiTesla className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mis Activos</CardTitle>
        <CardDescription>Lista de tus inversiones actuales</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar activo..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {filteredAssets.map((asset) => (
            <div key={asset.id} className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-center space-x-3">
                {getIconForAsset(asset)}
                <div>
                  <div className="font-medium">{asset.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {asset.symbol} • {asset.quantity} {asset.type === 'crypto' ? 'unidades' : 'acciones'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(asset.value)}</div>
                <div className={`text-xs flex items-center justify-end ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {asset.change24h >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};