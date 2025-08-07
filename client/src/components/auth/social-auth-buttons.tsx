import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { usePhantomWallet } from "@/lib/auth/wallet-providers";
import { useEthereumWallet } from "@/lib/auth/wallet-providers";
import { SiGoogle, SiApple, SiFantom, SiEthereum } from "react-icons/si";

export function SocialAuthButtons() {
  const { socialLoginMutation } = useAuth();
  const { connectPhantom } = usePhantomWallet();
  const { connectEthereum } = useEthereumWallet();

  // Function to handle social login (Google, Apple)
  const onSocialLogin = useCallback((provider: string) => {
    socialLoginMutation.mutate(provider);
  }, [socialLoginMutation]);

  // Function to handle Phantom wallet connection
  const handlePhantomConnect = useCallback(async () => {
    try {
      const walletInfo = await connectPhantom();
      if (walletInfo && walletInfo.address) {
        // Call your API to login with wallet
        const response = await fetch('/api/auth/wallet-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: walletInfo.address,
            type: 'solana',
          }),
        });

        if (!response.ok) {
          throw new Error('Error logging in with Phantom wallet');
        }

        // Reload page to update auth state
        window.location.reload();
      }
    } catch (error) {
      console.error('Phantom connection error:', error);
    }
  }, [connectPhantom]);

  // Function to handle Ethereum wallet connection
  const handleEthereumConnect = useCallback(async () => {
    try {
      const walletInfo = await connectEthereum();
      if (walletInfo && walletInfo.address) {
        // Call your API to login with wallet
        const response = await fetch('/api/auth/wallet-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: walletInfo.address,
            type: 'ethereum',
          }),
        });

        if (!response.ok) {
          throw new Error('Error logging in with Ethereum wallet');
        }

        // Reload page to update auth state
        window.location.reload();
      }
    } catch (error) {
      console.error('Ethereum connection error:', error);
    }
  }, [connectEthereum]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocialLogin("google")}
          disabled={socialLoginMutation.isPending}
          className="flex items-center justify-center gap-2 bg-black border-zinc-700 text-white hover:bg-zinc-900"
        >
          <SiGoogle className="h-4 w-4" />
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocialLogin("apple")}
          disabled={socialLoginMutation.isPending}
          className="flex items-center justify-center gap-2 bg-black border-zinc-700 text-white hover:bg-zinc-900"
        >
          <SiApple className="h-4 w-4" />
          Apple
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <Button
          type="button"
          variant="outline"
          onClick={handlePhantomConnect}
          disabled={socialLoginMutation.isPending}
          className="flex items-center justify-center gap-2 bg-black border-purple-600/30 text-purple-400 hover:bg-purple-900/10"
        >
          <SiFantom className="h-4 w-4" />
          Phantom
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleEthereumConnect}
          disabled={socialLoginMutation.isPending}
          className="flex items-center justify-center gap-2 bg-black border-blue-600/30 text-blue-400 hover:bg-blue-900/10"
        >
          <SiEthereum className="h-4 w-4" />
          Ethereum
        </Button>
      </div>
    </>
  );
}