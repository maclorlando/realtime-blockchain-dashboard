"use client";
import { createContext, useContext, useState } from "react";
import { getAddress } from "ethers"; 

type NetworkOption = "ethereum" | "base";

export function safeGetAddress(addr?: string) {
    try {
      return getAddress(addr ?? "");
    } catch {
      console.warn("⚠️ Invalid token address checksum:", addr);
      return ""; // fallback to safe empty value
    }
  }

  const NETWORK_CONFIG = {
    base: {
      name: "Base",
      wsUrl: process.env.NEXT_PUBLIC_BASE_WS_URL!,
      usdc: safeGetAddress(process.env.NEXT_PUBLIC_USDC_ADDRESS_BASE),
    },
    ethereum: {
      name: "Ethereum",
      wsUrl: process.env.NEXT_PUBLIC_ETHEREUM_WS_URL!,
      usdc: safeGetAddress(process.env.NEXT_PUBLIC_USDC_ADDRESS_ETHEREUM),
    },
  };

const NetworkContext = createContext<any>(null);
export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider = ({ children }: { children: React.ReactNode }) => {
  const [network, setNetwork] = useState<NetworkOption>("ethereum"); // default to eth network
  const [tokenAddress, setTokenAddress] = useState<string>("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"); //init to usdc on eth
  const [tokenSymbol, setTokenSymbol] = useState<string>("USDC"); //init to usdc on eth

  const config = NETWORK_CONFIG[network];

  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork,
        setTokenAddress,
        setTokenSymbol,
        wsUrl: config.wsUrl,
        tokenAddress: tokenAddress,
        tokenSymbol: tokenSymbol,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};
