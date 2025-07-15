// lib/zoneDetector.ts
import axios from 'axios';
import { CandlestickData, UTCTimestamp } from 'lightweight-charts';

export interface Zone {
  type: 'supply' | 'demand';
  high: number;
  low: number;
  score: number;
  firstTouched: string;
  lastRetested: string;
  bounceCount: number;
  timeframe: string;
}

export async function fetchHistoricalCandles(symbol: string, interval: string, limit = 1000): Promise<CandlestickData[]> {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const res = await axios.get(url);
  return res.data.map((c: any) => ({
    time: Math.floor(c[0] / 1000) as UTCTimestamp,
    open: parseFloat(c[1]),
    high: parseFloat(c[2]),
    low: parseFloat(c[3]),
    close: parseFloat(c[4]),
  }));
}

export function detectZonesFromHistory(candles: CandlestickData[], timeframe: string): Zone[] {
  const zones: Zone[] = [];

  for (let i = 5; i < candles.length - 5; i++) {
    const current = candles[i];
    const prev = candles[i - 1];
    const next = candles[i + 1];
    const next1 = candles[i + 1];
    const next2 = candles[i + 2];

    // Supply zone: local high with big drop
    if (
      typeof current.high === 'number' &&
      typeof prev.high === 'number' &&
      typeof next.high === 'number' &&
      typeof current.close === 'number' &&
      typeof next1.close === 'number' &&
      typeof next2.close === 'number' &&
      current.high > prev.high &&
      current.high > next.high
    ) {
      const impulseDown = next1.close < current.close && next2.close < current.close;
      if (impulseDown) {
        zones.push({
          type: 'supply',
          high: current.high,
          low: current.high * 0.997,
          score: 1,
          firstTouched: new Date(Number(next1.time) * 1000).toISOString(),
          lastRetested: new Date(Number(next1.time) * 1000).toISOString(),
          bounceCount: 0,
          timeframe,
        });
      }
    }

    // Demand zone: local low with strong bounce
    if (
      typeof current.low === 'number' &&
      typeof prev.low === 'number' &&
      typeof next.low === 'number' &&
      typeof current.close === 'number' &&
      typeof next1.close === 'number' &&
      typeof next2.close === 'number' &&
      current.low < prev.low &&
      current.low < next.low
    ) {
      const impulseUp = next1.close > current.close && next2.close > current.close;
      if (impulseUp) {
        zones.push({
          type: 'demand',
          high: current.low * 1.003,
          low: current.low,
          score: 1,
          firstTouched: new Date(Number(next1.time) * 1000).toISOString(),
          lastRetested: new Date(Number(next1.time) * 1000).toISOString(),
          bounceCount: 0,
          timeframe,
        });
      }
    }
  }

  return zones;
}
