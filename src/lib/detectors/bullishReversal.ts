export function detectBullishReversal(candles: any[]): boolean {
    const last = candles.at(-1);
    const prev = candles.at(-2);
  
    if (!last || !prev) return false;
  
    const body = Math.abs(last.close - last.open);
    const tail = last.open > last.close
      ? last.low - last.close
      : last.low - last.open;
  
    const isBullishEngulfing = last.close > last.open && last.open < prev.close && last.close > prev.open;
    const isLongLowerWick = tail > body;
    const isNearSupport = last.low <= Math.min(...candles.slice(-10).map(c => c.low)) * 1.01; // ~1% from recent low
  
    return isBullishEngulfing && isLongLowerWick && isNearSupport;
  }
  