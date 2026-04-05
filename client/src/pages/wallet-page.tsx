import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DecentralizedChat } from "@/components/blockchain/decentralized-chat";
import { usePhantomWallet } from "@/lib/auth/wallet-providers";
import { useEthereumWallet } from "@/lib/auth/wallet-providers";
import { useQuery } from "@tanstack/react-query";
import {
  Wallet,
  CreditCard,
  Plus,
  Package,
  ArrowRightLeft,
  Send,
  PlusCircle,
  ChevronRight,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiEthereum, SiSolana, SiBitcoin } from "react-icons/si";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserWallet {
  id: number;
  address: string;
  type: "ethereum" | "solana" | "bitcoin" | "polygon" | "binance";
  balance: number;
  isConnected: boolean;
  label: string | null;
}

function WalletIcon({ type }: { type: string }) {
  switch (type) {
    case "ethereum":
      return <SiEthereum className="h-5 w-5 text-blue-500" />;
    case "solana":
      return <SiSolana className="h-5 w-5 text-purple-500" />;
    case "bitcoin":
      return <SiBitcoin className="h-5 w-5 text-orange-500" />;
    default:
      return <Wallet className="h-5 w-5" />;
  }
}

function shortenAddress(address: string): string {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

export default function WalletPage() {
  const { user } = useAuth();
  const {
    connectPhantom,
    disconnectPhantom,
    walletAddress: phantomAddress,
    isConnected: isPhantomConnected,
  } = usePhantomWallet();

  const {
    connectEthereum,
    disconnectEthereum,
    walletAddress: ethereumAddress,
    isConnected: isEthereumConnected,
  } = useEthereumWallet();

  const [activeTab, setActiveTab] = useState("overview");

  // Consultar wallets del usuario
  const { data: wallets, isLoading } = useQuery<UserWallet[]>({
    queryKey: ["/api/wallets"],
    enabled: !!user,
  });

  // Conectar a Phantom
  const handleConnectPhantom = async () => {
    try {
      await connectPhantom();
    } catch (error) {
      console.error("Error connecting to Phantom:", error);
    }
  };

  // Conectar a Ethereum (MetaMask)
  const handleConnectEthereum = async () => {
    try {
      await connectEthereum();
    } catch (error) {
      console.error("Error connecting to Ethereum:", error);
    }
  };

  return (
    <div className="container space-y-8 py-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Integración Blockchain
        </h1>
        <p className="text-muted-foreground text-lg">
          Conecta tus wallets y participa en conversaciones descentralizadas
        </p>
      </div>

      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Wallets Conectadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {isLoading ? (
                    <span className="animate-pulse">-</span>
                  ) : (
                    wallets?.filter((w) => w.isConnected).length || 0
                  )}
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  de {isLoading ? "-" : wallets?.length || 0} wallets
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  size="sm"
                  className="w-full"
                  variant="outline"
                  onClick={() => setActiveTab("wallets")}
                >
                  Ver detalles
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Balance Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  $
                  {isLoading ? (
                    <span className="animate-pulse">-</span>
                  ) : (
                    wallets
                      ?.reduce((acc, wallet) => acc + wallet.balance, 0)
                      .toFixed(2) || "0.00"
                  )}
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  A través de todas las wallets
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button size="sm" className="w-full" variant="outline" disabled>
                  Actualizar
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Blockchain Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8 Canales</div>
                <p className="text-muted-foreground mt-1 text-sm">
                  Discusiones en tiempo real
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  size="sm"
                  className="w-full"
                  variant="outline"
                  onClick={() => setActiveTab("chat")}
                >
                  Unirse al chat
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Tus Wallets</CardTitle>
                  <CardDescription>
                    Conecta y administra tus wallets blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="flex h-24 items-center justify-center">
                        <p>Cargando wallets...</p>
                      </div>
                    ) : wallets && wallets.length > 0 ? (
                      wallets.map((wallet) => (
                        <div
                          key={wallet.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full">
                              <WalletIcon type={wallet.type} />
                            </div>
                            <div>
                              <p className="font-medium">
                                {wallet.label || `Wallet ${wallet.id}`}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                {shortenAddress(wallet.address)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={
                                wallet.isConnected ? "default" : "outline-solid"
                              }
                            >
                              {wallet.isConnected
                                ? "Conectada"
                                : "Desconectada"}
                            </Badge>
                            <p className="font-medium">
                              ${wallet.balance.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex h-24 flex-col items-center justify-center gap-3">
                        <p>No tienes wallets conectadas</p>
                        <Button
                          size="sm"
                          onClick={() => setActiveTab("wallets")}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Conectar Wallet
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("wallets")}
                  >
                    Ver todas las wallets
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>
                  Operaciones comunes con tus wallets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    disabled={!isPhantomConnected && !isEthereumConnected}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Fondos
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    disabled={!isPhantomConnected && !isEthereumConnected}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Recibir Activos
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    disabled={!isPhantomConnected && !isEthereumConnected}
                  >
                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                    Intercambiar Tokens
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setActiveTab("wallets")}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Conectar Nueva Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wallets" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Conectar Wallet</CardTitle>
                <CardDescription>
                  Añade tus wallets para interactuar con la blockchain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Solana</h3>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src="https://phantom.app/favicon.ico"
                          alt="Phantom"
                        />
                        <AvatarFallback>
                          <SiSolana className="h-6 w-6 text-purple-500" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">Phantom Wallet</h4>
                        <p className="text-muted-foreground text-sm">
                          {isPhantomConnected
                            ? `Conectado: ${shortenAddress(phantomAddress || "")}`
                            : "No conectado"}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={
                        isPhantomConnected
                          ? disconnectPhantom
                          : handleConnectPhantom
                      }
                      variant={isPhantomConnected ? "outline-solid" : "default"}
                    >
                      {isPhantomConnected ? "Desconectar" : "Conectar"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Ethereum</h3>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src="https://metamask.io/images/favicon.png"
                          alt="MetaMask"
                        />
                        <AvatarFallback>
                          <SiEthereum className="h-6 w-6 text-blue-500" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">MetaMask</h4>
                        <p className="text-muted-foreground text-sm">
                          {isEthereumConnected
                            ? `Conectado: ${shortenAddress(ethereumAddress || "")}`
                            : "No conectado"}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={
                        isEthereumConnected
                          ? disconnectEthereum
                          : handleConnectEthereum
                      }
                      variant={
                        isEthereumConnected ? "outline-solid" : "default"
                      }
                    >
                      {isEthereumConnected ? "Desconectar" : "Conectar"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Bitcoin</h3>
                  <div className="bg-muted/30 flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          <SiBitcoin className="h-6 w-6 text-orange-500" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">Bitcoin Wallet</h4>
                        <p className="text-muted-foreground text-sm">
                          Próximamente
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" disabled>
                      Próximamente
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wallets Registradas</CardTitle>
                <CardDescription>
                  Administra tus direcciones de blockchain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="flex h-24 items-center justify-center">
                    <p>Cargando wallets...</p>
                  </div>
                ) : wallets && wallets.length > 0 ? (
                  wallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full">
                          <WalletIcon type={wallet.type} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {wallet.label || `Wallet ${wallet.id}`}
                            </p>
                            <Badge
                              variant={
                                wallet.isConnected ? "default" : "outline-solid"
                              }
                              className="text-xs"
                            >
                              {wallet.isConnected
                                ? "Conectada"
                                : "Desconectada"}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {shortenAddress(wallet.address)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${wallet.balance.toFixed(2)}
                        </p>
                        <p className="text-muted-foreground text-xs capitalize">
                          {wallet.type}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-24 flex-col items-center justify-center gap-3">
                    <p>No tienes wallets conectadas</p>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleConnectPhantom}>
                        <Key className="mr-2 h-4 w-4" />
                        Phantom
                      </Button>
                      <Button size="sm" onClick={handleConnectEthereum}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Ethereum
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <div className="mx-auto md:max-w-3xl">
            <DecentralizedChat />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
