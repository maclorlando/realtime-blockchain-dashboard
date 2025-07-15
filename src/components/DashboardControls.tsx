"use client";

import { useAppState } from "@/components/AppStateContext";
import { Select, Switch, Group, Badge } from "@mantine/core";
import { useNetwork, safeGetAddress } from "@/components/NetworkContext";

export default function DashboardControls() {
    const { useLive, toggleLive } = useAppState();
    const { network, setNetwork, tokenAddress, wsUrl, setTokenAddress, setTokenSymbol } = useNetwork();
    const TOKEN_OPTIONS: Record<string, { label: string; value: string }[]> = {
        ethereum: [
          { label: "USDC", value: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
          //{ label: "WETH", value: "0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2" },
         // { label: "WBTC", value: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" },
          //{ label: "USDT", value: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
        ],
        base: [
          { label: "USDC", value: "0xd9AA3213fC2b2F3B8B5cD4F021F3E9862c5C38F9" }, // USDbC
          { label: "WETH", value: "0x4200000000000000000000000000000000000006" },
          //{ label: "WBTC", value: "0x...? (WBTC on Base)" },
        ],
      };
    
    const tokenOptions = TOKEN_OPTIONS[network] || [];
      

    return (
        <Group justify="space-between" mb="lg">
            {/* <Select
                label="Network"
                value={network}
                onChange={(val) => setNetwork(val as "ethereum" | "base")}
                data={[
                    { label: "Base", value: "base" },
                    { label: "Ethereum", value: "ethereum" },
                ]}
                w={160}
            /> */}
            <Select
                label="Token"
                value={tokenAddress}
                onChange={(val) => {
                    if (val) {
                        const checksummedAddress = safeGetAddress(val);
                        setTokenAddress(checksummedAddress);
                        const selectedToken = tokenOptions.find((token) => token.value.toLowerCase() === val.toLowerCase());
                        if (selectedToken) {
                            setTokenSymbol(selectedToken.label);
                        }
                    }
                }}
                data={tokenOptions}
                searchable
            />
            {/* <Badge size="lg" color="gray" variant="outline">
                Tracking: USDC
            </Badge> */}

            <Switch
                label="Live Mode"
                checked={useLive}
                onChange={toggleLive}
                disabled={!wsUrl} //now uses WebSocket URL
            />
        </Group>
    );
}
