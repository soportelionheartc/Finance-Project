import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { ethers } from "ethers";

// Types for wallet interfaces
export interface WalletInfo {
  address: string;
  type: string;
  balance?: string;
}

// Interfaces for each wallet type
export interface PhantomWallet {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  publicKey?: { toString: () => string };
  signMessage?: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
}

declare global {
  interface Window {
    phantom?: {
      solana?: PhantomWallet;
    };
    ethereum?: any;
  }
}

// Phantom wallet context
interface PhantomWalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  connectPhantom: () => Promise<WalletInfo | null>;
  disconnectPhantom: () => Promise<void>;
}

const PhantomWalletContext = createContext<PhantomWalletContextType | null>(
  null,
);

export function PhantomWalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Connect to Phantom wallet
  const connectPhantom = useCallback(async (): Promise<WalletInfo | null> => {
    try {
      if (!window.phantom?.solana) {
        window.open("https://phantom.app/", "_blank");
        return null;
      }

      const provider = window.phantom?.solana;

      if (!provider) {
        throw new Error("Phantom wallet provider not found");
      }

      const response = await provider.connect();
      const address = response.publicKey.toString();

      setWalletAddress(address);
      setIsConnected(true);

      return {
        address,
        type: "solana",
      };
    } catch (error) {
      console.error("Error connecting to Phantom wallet:", error);
      return null;
    }
  }, []);

  // Disconnect from Phantom wallet
  const disconnectPhantom = useCallback(async (): Promise<void> => {
    try {
      if (window.phantom?.solana) {
        await window.phantom.solana.disconnect();
        setWalletAddress(null);
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Error disconnecting from Phantom wallet:", error);
    }
  }, []);

  return (
    <PhantomWalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        connectPhantom,
        disconnectPhantom,
      }}
    >
      {children}
    </PhantomWalletContext.Provider>
  );
}

export function usePhantomWallet() {
  const context = useContext(PhantomWalletContext);
  if (!context) {
    throw new Error(
      "usePhantomWallet must be used within a PhantomWalletProvider",
    );
  }
  return context;
}

// Ethereum wallet context
interface EthereumWalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  connectEthereum: () => Promise<WalletInfo | null>;
  disconnectEthereum: () => Promise<void>;
}

const EthereumWalletContext = createContext<EthereumWalletContextType | null>(
  null,
);

export function EthereumWalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Connect to Ethereum wallet (MetaMask)
  const connectEthereum = useCallback(async (): Promise<WalletInfo | null> => {
    try {
      if (!window.ethereum) {
        window.open("https://metamask.io/download/", "_blank");
        return null;
      }

      // @ts-ignore - ethers types are not fully updated
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Get the current network
      const network = await provider.getNetwork();
      const chainId = network.chainId.toString();

      setWalletAddress(address);
      setIsConnected(true);

      return {
        address,
        type: "ethereum",
      };
    } catch (error) {
      console.error("Error connecting to Ethereum wallet:", error);
      return null;
    }
  }, []);

  // Disconnect from Ethereum wallet
  const disconnectEthereum = useCallback(async (): Promise<void> => {
    // Note: MetaMask doesn't really have a disconnect method
    // We just clear our local state
    setWalletAddress(null);
    setIsConnected(false);
  }, []);

  return (
    <EthereumWalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        connectEthereum,
        disconnectEthereum,
      }}
    >
      {children}
    </EthereumWalletContext.Provider>
  );
}

export function useEthereumWallet() {
  const context = useContext(EthereumWalletContext);
  if (!context) {
    throw new Error(
      "useEthereumWallet must be used within an EthereumWalletProvider",
    );
  }
  return context;
}

// Combined wallet provider
export function WalletProviders({ children }: { children: ReactNode }) {
  return (
    <PhantomWalletProvider>
      <EthereumWalletProvider>{children}</EthereumWalletProvider>
    </PhantomWalletProvider>
  );
}
