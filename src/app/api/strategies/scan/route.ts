// app/api/strategies/scan/route.ts
import { NextRequest } from 'next/server';
import axios from 'axios';
import { detectBullishReversal } from '@/lib/detectors/bullishReversal';

const symbols = ['ETHUSDT', 'BTCUSDT', 'SOLUSDT'];
const timeframes = ['5m', '30m', '1h', '4h'];

// Weights per timeframe (total should sum to 1.0)
const timeframeWeights: Record<string, number> = {
  '5m': 0.2,
  '30m': 0.25,
  '1h': 0.25,
  '4h': 0.3,
};

export async function GET(req: NextRequest) {
  const results: Record<string, any> = {};

  for (const symbol of symbols) {
    let totalConfidence = 0;
    results[symbol] = {
      timeframes: {},
      strategy: 'Bullish Reversal on Demand Zone',
      totalConfidence: 0,
    };

    for (const interval of timeframes) {
      try {
        const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`;
        const response = await axios.get(url);

        const candles = response.data.map((candle: any) => ({
          time: new Date(candle[0]).toISOString(),
          open: parseFloat(candle[1]),
          high: parseFloat(candle[2]),
          low: parseFloat(candle[3]),
          close: parseFloat(candle[4]),
          volume: parseFloat(candle[5]),
        }));

        const signalTriggered = detectBullishReversal(candles);
        let triggeredAt = null;
        if (signalTriggered) {
          totalConfidence += timeframeWeights[interval];
          triggeredAt = candles.at(-1)?.time;
        }

        results[symbol].timeframes[interval] = {
          signalTriggered,
          confidence: signalTriggered ? timeframeWeights[interval] : 0,
          triggeredAt,
          candles, // ✅ provide candles for all timeframes
        };
      } catch (err: any) {
        results[symbol].timeframes[interval] = {
          error: err.message,
          signalTriggered: false,
          confidence: 0,
        };
      }
    }

    results[symbol].totalConfidence = parseFloat(totalConfidence.toFixed(2));
  }

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}