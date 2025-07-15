'use client';

import { Card, Center, Loader } from '@mantine/core';
import { useEffect, RefObject } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  CandlestickData,
} from 'lightweight-charts';
import { Zone } from '@/lib/zoneDetector';

export default function TradingViewChart({
  candles,
  loading,
  containerRef,
  canvasRef,
  chartRef,
  json,
  selected,
  timeframe,
  showZones,
  zones,
}: {
  candles: CandlestickData[];
  loading: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  chartRef: React.MutableRefObject<IChartApi | null>;
  json: any;
  selected: string;
  timeframe: string;
  showZones: boolean;
  zones: Zone[];
}) {
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current || candles.length === 0) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (chartRef.current) {
      chartRef.current.remove();
    }

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 240,
      layout: {
        background: { color: '#1A1B1E' },
        textColor: 'white',
      },
      grid: {
        vertLines: { color: '#2C2E33' },
        horzLines: { color: '#2C2E33' },
      },
      crosshair: { mode: 1 },
      timeScale: { borderColor: '#2C2E33' },
    });

    const series: ISeriesApi<'Candlestick'> = chart.addCandlestickSeries();
    series.setData(candles);

    const signalTime = json?.[selected]?.timeframes?.[timeframe]?.triggeredAt;
    if (signalTime) {
      const timestamp = Math.floor(new Date(signalTime).getTime() / 1000) as UTCTimestamp;
      series.setMarkers([
        {
          time: timestamp,
          position: 'belowBar',
          color: 'green',
          shape: 'circle',
          text: 'Signal',
        },
      ]);
    }

    chartRef.current = chart;
    chart.timeScale().fitContent();

    let lastPriceLine: ReturnType<typeof series.createPriceLine> | null = null;
    chart.subscribeCrosshairMove((param) => {
      if (!param?.point || !param.time || !param.seriesData) return;
      const raw = param.seriesData.get(series);
      if (!raw) return;

      const candle = raw as CandlestickData;
      if (typeof candle.close !== 'number') return;

      if (lastPriceLine) series.removePriceLine(lastPriceLine);
      lastPriceLine = series.createPriceLine({
        price: candle.close,
        color: '#888',
        lineWidth: 1,
        lineStyle: 0,
        axisLabelVisible: true,
        title: `C: ${candle.close}`,
      });
    });

    // ✅ Improved zone drawing: top N, nearest to price, faded overlaps
    if (showZones && zones.length > 0) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * pixelRatio;
      canvas.height = 240 * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);
      ctx.clearRect(0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio);

      const currentPrice = candles[candles.length - 1]?.close ?? 0;
      const topZones = zones
        .map(z => ({ ...z, distance: Math.abs(currentPrice - (z.high + z.low) / 2) }))
        .sort((a, b) => a.distance - b.distance || b.score - a.score)
        .slice(0, 10);

      topZones.forEach((zone, idx) => {
        const y1 = series.priceToCoordinate(zone.high) ?? 0;
        const y2 = series.priceToCoordinate(zone.low) ?? 0;
        const yTop = Math.min(y1, y2);
        const yBottom = Math.max(y1, y2);

        const baseAlpha = 0.05;
        const textAlpha = 0.3;
        const strength = 1 - idx * 0.06; // Fade overlap based on rank

        ctx.fillStyle = zone.type === 'demand'
          ? `rgba(0,255,0,${baseAlpha * strength})`
          : `rgba(255,0,0,${baseAlpha * strength})`;
        ctx.fillRect(0, yTop, canvas.width / pixelRatio, yBottom - yTop);

        ctx.fillStyle = zone.type === 'demand'
          ? `rgba(0,255,0,${textAlpha})`
          : `rgba(255,0,0,${textAlpha})`;
        ctx.font = '11px monospace';
        ctx.fillText(`${zone.type.toUpperCase()} (${zone.bounceCount})`, 5, yTop + 12);
      });
    }
  }, [candles, selected, timeframe, showZones, zones]);

  return (
    <Card withBorder mt="xs" bg="dark.7" padding="md" style={{ position: 'relative' }}>
      {loading ? (
        <Center h={240}><Loader /></Center>
      ) : (
        <>
          <div ref={containerRef} style={{ width: '100%', height: 240 }} />
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 240,
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
        </>
      )}
    </Card>
  );
}
