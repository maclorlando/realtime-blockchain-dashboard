// lib/useMarketData.ts
import { useEffect, useRef, useState } from 'react';
import { CandlestickData, IChartApi } from 'lightweight-charts';

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

export function useMarketData({ selected, timeframe }: { selected: string; timeframe: string }) {
  const [candles, setCandles] = useState<CandlestickData[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [json, setJson] = useState<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/strategies/scan`);
        const data = await res.json();
        setJson(data);
        const raw = data[selected]?.timeframes?.[timeframe]?.candles || [];

        const transformed = raw.map((c: any) => ({
          time: Math.floor(new Date(c.time).getTime() / 1000),
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }));

        setCandles(transformed);
      } catch (err) {
        console.error('Candle fetch failed', err);
        setCandles([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selected, timeframe]);

  useEffect(() => {
    const loadZones = async () => {
      try {
        const res = await fetch(`/api/zones?symbol=${selected}&timeframe=${timeframe}`);
        const data: Zone[] = await res.json();
        setZones(data);
      } catch (err) {
        console.error('Zone fetch failed', err);
        setZones([]);
      }
    };

    loadZones();
  }, [selected, timeframe]);

  return { candles, zones, json, loading, containerRef, canvasRef, chartRef };
}