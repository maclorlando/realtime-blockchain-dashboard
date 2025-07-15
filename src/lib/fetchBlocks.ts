import { getProvider, ERC20_ABI } from "./web3";
import { ethers, formatUnits } from "ethers";
import { useNetwork } from "@/components/NetworkContext";
import { useMemo } from "react";

export async function getBlockData(blockNumber: number, tokenAddress: string, provider: ethers.WebSocketProvider) {
  console.count("🧪 getBlockData calls");
  
  const block = await provider.getBlock(blockNumber);
  if (!block) throw new Error(`Block ${blockNumber} not found.`);

  const { chainId } = await provider.getNetwork();
  let decimals = 6; // default to Ethereum

  // If on Base mainnet (chainId 8453), and using USDbC
  if (Number(chainId) === 8453) {
    decimals = 18;
  }

  const logs = await provider.getLogs({
    fromBlock: blockNumber,
    toBlock: blockNumber,
    address: tokenAddress,
    topics: [ethers.id("Transfer(address,address,uint256)")]
  });

  const iface = new ethers.Interface(ERC20_ABI);
  let totalVolume = 0;

  for (const log of logs) {
    try {
      const parsed = iface.parseLog(log) as ethers.LogDescription;
      // USDC uses 6 decimals on both Base and Ethereum
      const value = ethers.formatUnits(parsed.args.value, decimals); // returns string like "543.21"
      totalVolume += parseFloat(value); //safe float conversion
      // 🧪 Debug each log value
    console.log("🔎 Transfer:", parsed.args.value.toString(), "→", value, "USDC");

    } catch (e) {
      // skip unparseable logs
      console.warn("⚠️ Failed to parse log", e);
    }
    console.log("📦 Block", block.number, "Total Volume:", totalVolume);
  }

  return {
    blockNumber: block.number,
    timestamp: block.timestamp,
    baseFee: block.baseFeePerGas ? Number(formatUnits(block.baseFeePerGas, "gwei")) : 0,
    gasUsed: Number(block.gasUsed),
    gasLimit: Number(block.gasLimit),
    volume: totalVolume,
  };
}
