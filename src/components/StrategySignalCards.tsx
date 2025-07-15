'use client';

import { useEffect, useState } from 'react';
import { Card, Title, Text, Badge, Group, Progress, Stack, Skeleton } from '@mantine/core';

interface TimeframeResult {
  signalTriggered: boolean;
  confidence: number;
  error?: string;
}

interface StrategyResult {
  strategy: string;
  totalConfidence: number;
  timeframes: Record<string, TimeframeResult>;
}

export default function StrategySignalCards() {
  const [data, setData] = useState<Record<string, StrategyResult> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/strategies/scan');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to fetch strategy data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60_000); // Refresh every 60s
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <Stack>
        <Skeleton height={100} radius="md" />
        <Skeleton height={100} radius="md" />
        <Skeleton height={100} radius="md" />
      </Stack>
    );
  }

  return (
    <Stack>
      {Object.entries(data).map(([symbol, result]) => {
        const confidence = result.totalConfidence;
        const emoji =
          confidence >= 0.7 ? '🟢' :
          confidence >= 0.4 ? '🟡' : '🔴';

        return (
          <Card key={symbol} withBorder radius="md" p="lg">
            <Title order={3}>{symbol}</Title>
            <Text size="sm" c="dimmed">{result.strategy}</Text>

            <Group mt="xs">
              {Object.entries(result.timeframes).map(([tf, tfResult]) => (
                <Badge key={tf} color={tfResult.signalTriggered ? 'green' : 'gray'}>
                  {tf}
                </Badge>
              ))}
            </Group>

            <Text size="xs" mt="sm">Confidence: {emoji} {(confidence * 100).toFixed(0)}%</Text>
            <Progress value={confidence * 100} color="blue" mt="xs" radius="xl" />
          </Card>
        );
      })}
    </Stack>
  );
}
