// app/api/zones/route.ts
// ✅ API to serve backtested supply/demand zones to frontend

import { NextRequest } from 'next/server';
import { fetchHistoricalCandles, detectZonesFromHistory } from '@/lib/zoneDetector';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol') || 'ETHUSDT';
  const timeframe = searchParams.get('timeframe') || '1h';

  try {
    const candles = await fetchHistoricalCandles(symbol, timeframe, 1000);
    const zones = detectZonesFromHistory(candles, timeframe);

    return new Response(JSON.stringify(zones), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err: any) {
    console.error(`[zones] Failed to fetch for ${symbol} ${timeframe}:`, err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
