import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "@/hooks/use-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { WalletProviders } from "@/lib/auth/wallet-providers";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <WalletProviders>
        <App />
      </WalletProviders>
    </AuthProvider>
  </QueryClientProvider>,
);
