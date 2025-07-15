import { ethers } from "ethers";

export const getProvider = (url: string) => {
  return url ? new ethers.WebSocketProvider(url) : null;
};

export const ERC20_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];
