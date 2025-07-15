"use client";
import { useBlockData } from "./BlockContext";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Card, Title, Loader, Center, Badge, Stack } from "@mantine/core";
import CustomTooltip from "./CustomTooltip";
import { BlockData } from "@/types";

export default function ChartGasRatio() {
    const { blocks, loading, usingMock } = useBlockData();

    if (loading) {
        return (
            <Card padding="md" withBorder radius="md" mih={250}>
                <Center mih={250}>
                    <Loader />
                </Center>
            </Card>
        );
    }

    const data = blocks.map((b: BlockData) => ({
        ...b,
        gasRatio: (b.gasUsed / b.gasLimit) * 100,
      }));
      
    return (
        <Card padding="md" withBorder radius="md">
            <Stack gap="xs" mb="sm">
                <Title order={3}>🔥 Gas Used / Limit Ratio (%)</Title>
                {usingMock && <Badge color="gray">Mock Data</Badge>}
            </Stack>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <XAxis dataKey="blockNumber" />
                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v.toFixed(0)}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="gasRatio" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>

        </Card>
    );
}
