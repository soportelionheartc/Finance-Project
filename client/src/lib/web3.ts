import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';

interface UseWalletReturn {
  account: string | null;
  chainId: number | null;
  balance: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  isConnected: boolean;
  provider: ethers.BrowserProvider | null;
}

export function useWallet(): UseWalletReturn {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const { toast } = useToast();

  const isConnected = !!account;

  async function connectWallet() {
    if (!window.ethereum) {
      toast({
        title: 'Wallet no encontrada',
        description: 'Por favor instala MetaMask u otro proveedor de Ethereum',
        variant: 'destructive',
      });
      return;
    }

    setIsConnecting(true);

    try {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await ethersProvider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('No se pudo obtener la cuenta');
      }

      const network = await ethersProvider.getNetwork();
      const userBalance = await ethersProvider.getBalance(accounts[0]);
      
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      setBalance(ethers.formatEther(userBalance));
      setProvider(ethersProvider);

      toast({
        title: 'Wallet conectada',
        description: `Conectado a la cuenta ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error al conectar',
        description: error.message || 'Ocurrió un error al conectar la wallet',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  }

  function disconnectWallet() {
    setAccount(null);
    setChainId(null);
    setBalance(null);
    setProvider(null);
    
    toast({
      title: 'Wallet desconectada',
      description: 'Tu wallet ha sido desconectada correctamente',
    });
  }

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        
        // Update balance for new account
        if (provider) {
          provider.getBalance(accounts[0]).then(balance => {
            setBalance(ethers.formatEther(balance));
          });
        }
        
        toast({
          title: 'Cuenta cambiada',
          description: `Cambiado a la cuenta ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
        });
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      setChainId(parseInt(chainIdHex, 16));
      
      toast({
        title: 'Red cambiada',
        description: `Cambiado a la red ID: ${parseInt(chainIdHex, 16)}`,
      });
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [account, provider]);

  return {
    account,
    chainId,
    balance,
    connectWallet,
    disconnectWallet,
    isConnecting,
    isConnected,
    provider
  };
}

export async function getEthereumBalance(address: string): Promise<string> {
  if (!window.ethereum) {
    throw new Error('No Ethereum provider found');
  }
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

interface TokenBalance {
  symbol: string;
  balance: string;
  decimals: number;
  name: string;
}

// ERC20 Token standard ABI for balanceOf and decimals methods
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)'
];

export async function getTokenBalance(tokenAddress: string, userAddress: string): Promise<TokenBalance> {
  if (!window.ethereum) {
    throw new Error('No Ethereum provider found');
  }
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  
  const [balance, decimals, symbol, name] = await Promise.all([
    tokenContract.balanceOf(userAddress),
    tokenContract.decimals(),
    tokenContract.symbol(),
    tokenContract.name()
  ]);
  
  return {
    symbol,
    name,
    decimals,
    balance: ethers.formatUnits(balance, decimals)
  };
}
