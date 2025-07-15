// StrategyTab.tsx (Fix: zone toggle + native tooltip plan)

'use client';

import { Card, Stack, Select, Checkbox, Group, Text } from '@mantine/core';
import { useState } from 'react';
import TradingViewChart from './TradingViewChart';
import { useMarketData } from '../lib/useMarketData';

const assets = ['ETHUSDT', 'BTCUSDT', 'SOLUSDT'];
const timeframes = ['5m', '30m', '1h', '4h'];

export default function StrategyTab() {
  const [selected, setSelected] = useState('ETHUSDT');
  const [timeframe, setTimeframe] = useState('5m');
  const [showZones, setShowZones] = useState(true);

  const { candles, zones, loading, canvasRef, chartRef, containerRef, json } = useMarketData({ selected, timeframe });

  return (
    <Card withBorder radius="md" mt="md" p="lg">
      <Stack>
        <Group grow>
          <Select label="Choose Asset" data={assets} value={selected} onChange={(v) => setSelected(v || 'ETHUSDT')} />
          <Select label="Timeframe" data={timeframes} value={timeframe} onChange={(v) => setTimeframe(v || '5m')} />
        </Group>

        <Checkbox
          label="Show Supply/Demand Zones"
          checked={showZones}
          onChange={(e) => setShowZones(e.currentTarget.checked)}
        />

        <Text size="sm" c="dimmed">
          🧠 Chart + Strategy overlays for: <strong>{selected}</strong> ({timeframe})
        </Text>

        <div style={{ position: 'relative' }}>
          <TradingViewChart
            candles={candles}
            loading={loading}
            containerRef={containerRef}
            canvasRef={canvasRef}
            chartRef={chartRef}
            json={json}
            selected={selected}
            timeframe={timeframe}
            showZones={showZones}
            zones={zones}
          />
        </div>
      </Stack>
    </Card>
  );
}