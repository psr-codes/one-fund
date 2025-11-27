"use client";

import { createNetworkConfig, SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client"; // UPDATED IMPORT
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@mysten/dapp-kit/dist/index.css";
import ToastProvider from "./ToastProvider";

const { networkConfig } = createNetworkConfig({
	testnet: {
        // ⚠️ REPLACE THIS with the URL found in OneChain docs/discord if this fails
        // If OneChain uses standard Sui Testnet, use getFullnodeUrl('testnet')
        // For now, let's try the IP or domain you might have found in their docs:
		// url: "https://fullnode.testnet.onechain.labs", 
		// url: "https://rpc-testnet.onelabs.cc", 
		url: "https://rpc-testnet.onelabs.cc:443", 
	},
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
				<WalletProvider>
					<ToastProvider>
						{children}
					</ToastProvider>
				</WalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
	);
}