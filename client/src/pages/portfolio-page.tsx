import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wallet } from "lucide-react";
import { Link } from "wouter";
import { PortfolioSummary } from "@/components/finance/portfolio-summary";
import { AssetDistribution } from "@/components/finance/asset-distribution";
import { AssetList } from "@/components/finance/asset-list";
import { TradingStrategies } from "@/components/finance/trading-strategies";
import { useWallet } from "@/lib/web3";

export default function PortfolioPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { connectWallet, isConnected, account, isConnecting } = useWallet();

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header title="Mi Portafolio" toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <div className="flex items-center mb-6">
              <Link href="/">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h2 className="text-xl font-semibold">Mi Portafolio</h2>
            </div>
          </div>
          
          <PortfolioSummary />
          <AssetDistribution />
          <AssetList />
          <TradingStrategies />

          <div className="mt-6 text-center">
            <Button 
              onClick={connectWallet} 
              disabled={isConnected || isConnecting}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-medium py-3 px-6 hover:opacity-90 transition-opacity"
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isConnected 
                ? `Conectado: ${account?.substring(0, 6)}...${account?.substring(38)}` 
                : isConnecting 
                  ? "Conectando..." 
                  : "Conectar Wallet Ethereum"}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
