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


export default function ChartBlockBaseFee() {
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

    return (
        <Card padding="md" withBorder radius="md">
            <Stack gap="xs" mb="sm">
                <Title order={3}>📕 Base Fee per Block</Title>
                {usingMock && <Badge color="gray">Mock Data</Badge>}
            </Stack>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={blocks}>
                    <XAxis dataKey="blockNumber" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="baseFee"
                        stroke="#ff6b6b"
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>

        </Card>
    );
}
