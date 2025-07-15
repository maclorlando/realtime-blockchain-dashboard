import { ethers } from "ethers";
import { ERC20_ABI } from "./web3"; // assumes you already have ERC20 ABI

const decimalsCache: Record<string, number> = {};

export async function fetchTokenDecimals(
  tokenAddress: string,
  provider: ethers.Provider
): Promise<number> {
  const normalized = tokenAddress.toLowerCase();
  if (decimalsCache[normalized]) {
    return decimalsCache[normalized];
  }

  try {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const decimals: number = await tokenContract.decimals();
    decimalsCache[normalized] = decimals;
    console.log(`🔢 [decimals] ${tokenAddress} = ${decimals}`);
    return decimals;
  } catch (err) {
    console.warn(`⚠️ Failed to fetch decimals for ${tokenAddress}, defaulting to 18`, err);
    return 18; // fallback default
  }
}
