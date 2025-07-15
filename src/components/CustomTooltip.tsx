"use client";
import React from "react";
import { useNetwork } from "@/components/NetworkContext"

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function formatTokenAmount(value: number): string {
  if (value >= 1e9) return (value / 1e9).toFixed(2) + "B";
  if (value >= 1e6) return (value / 1e6).toFixed(2) + "M";
  if (value >= 1e3) return (value / 1e3).toFixed(2) + "K";
  return value.toFixed(2);
}



const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const block = payload[0].payload;
  // 🧪 Debug what’s inside the tooltip block
  console.log("🧪 Tooltip payload:", block);
  const timestamp = block.timestamp;

  let dateStr = "Invalid Date";
  let timeStr = "Invalid Time";

  if (typeof timestamp === "number" && !isNaN(timestamp)) {
    const date = new Date(timestamp * 1000);
    dateStr = date.toLocaleDateString();
    timeStr = date.toLocaleTimeString();
  }

  const { tokenSymbol } = useNetwork()

  return (
    <div style={{ background: "#1a1b1e", padding: 12, borderRadius: 8, color: "#fff" }}>
      <div><strong>Block:</strong> {block.blockNumber}</div>
      <div><strong>Date:</strong> {dateStr}</div>
      <div><strong>Time:</strong> {timeStr}</div>
      {payload.map((item: any) => (
        <div key={item.name}>
          <strong>{item.name}:</strong>{" "}
          {item.name === "gasRatio"
            ? `${item.value.toFixed(2)}%`
            : item.name === "volume"
              ? `${formatTokenAmount(item.value)} ${tokenSymbol}`
              : `${item.value.toFixed(2)} gwei`}
        </div>
      ))}
    </div>
  );
};

export default CustomTooltip;
