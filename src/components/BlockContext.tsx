"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProvider, ERC20_ABI } from "@/lib/web3";
import { useNetwork } from "./NetworkContext";
import { getBlockData } from "@/lib/fetchBlocks";
import { useAppState } from "./AppStateContext"; // for live/mock + token
import { showNotification } from "@mantine/notifications";


const BlockContext = createContext<any>(null);
export const useBlockData = () => useContext(BlockContext);

const MOCK_BLOCKS = [
  { blockNumber: 1, timestamp: 1713021111, baseFee: 120000, gasUsed: 15000000, gasLimit: 30000000, volume: 1_000_000 },
  { blockNumber: 2, timestamp: 1713021171, baseFee: 130000, gasUsed: 18000000, gasLimit: 30000000, volume: 2_000_000 },
  { blockNumber: 3, timestamp: 1713021231, baseFee: 125000, gasUsed: 17000000, gasLimit: 30000000, volume: 3_200_000 },
  { blockNumber: 4, timestamp: 1713021291, baseFee: 110000, gasUsed: 16000000, gasLimit: 30000000, volume: 1_500_000 },
  { blockNumber: 5, timestamp: 1713021351, baseFee: 140000, gasUsed: 20000000, gasLimit: 30000000, volume: 2_800_000 },
  { blockNumber: 6, timestamp: 1713021411, baseFee: 150000, gasUsed: 19000000, gasLimit: 30000000, volume: 2_000_000 },
  { blockNumber: 7, timestamp: 1713021471, baseFee: 135000, gasUsed: 17000000, gasLimit: 30000000, volume: 3_000_000 },
  { blockNumber: 8, timestamp: 1713021531, baseFee: 128000, gasUsed: 16500000, gasLimit: 30000000, volume: 2_500_000 },
  { blockNumber: 9, timestamp: 1713021591, baseFee: 122000, gasUsed: 16000000, gasLimit: 30000000, volume: 3_500_000 },
  { blockNumber: 10, timestamp: 1713021651, baseFee: 138000, gasUsed: 17500000, gasLimit: 30000000, volume: 1_800_000 },
];

export const BlockProvider = ({ children }: { children: React.ReactNode }) => {
  const { useLive } = useAppState(); // 🧠 get current mode + token
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { wsUrl, tokenAddress, network } = useNetwork();
  const provider = useMemo(() => getProvider(wsUrl), [wsUrl]);

  const usingMock = !provider || !useLive;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
  
    if (usingMock) {
      setBlocks(MOCK_BLOCKS);
      setLoading(false);
      return;
    }

    showNotification({
        title: "Switching Network...",
        message: `Fetching latest blocks for ${network}`,
        autoClose: 2000,
      });
  
    async function initBlocks() {
      if (!provider) {
        setBlocks(MOCK_BLOCKS);
        setLoading(false);
        return;
      }
  
      const latest = await provider.getBlockNumber();
      const blockData = await Promise.all(
        [...Array(10)].map((_, i) =>
          getBlockData(latest - i, tokenAddress, provider)
        )
      );
      if (mounted) {
        setBlocks(blockData.reverse());
        setLoading(false);
      }
    }
  
    initBlocks();
  
    const listener = async (blockNumber: number) => {
      const newBlock = await getBlockData(blockNumber, tokenAddress, provider);
      if (mounted) {
        setBlocks((prev) => [...prev.slice(1), newBlock]);
      }
    };
  
    provider?.on("block", listener);
  
    return () => {
      mounted = false;
      provider?.off("block", listener);
    };
  }, [useLive, tokenAddress, wsUrl]); //added these deps
  

  return (
    <BlockContext.Provider value={{ blocks, loading, usingMock }}>
      {children}
    </BlockContext.Provider>
  );
};
