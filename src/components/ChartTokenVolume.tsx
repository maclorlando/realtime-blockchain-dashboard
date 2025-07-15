"use client";
import { useBlockData } from "./BlockContext";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Card, Title, Loader, Center, Badge, Stack } from "@mantine/core";
import CustomTooltip from "./CustomTooltip";
import { BlockData } from "@/types";


export default function ChartTokenVolume() {
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

    const data = blocks.map((b: BlockData) => ({ ...b })); // ✅ Spread the entire block


    return (
        <Card padding="md" withBorder radius="md">
            <Stack gap="xs" mb="sm">
                <Title order={3}>💰 ERC20 Transfer Volume (M)</Title>
                {usingMock && <Badge color="gray">Mock Data</Badge>}
            </Stack>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <XAxis dataKey="blockNumber" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="volume" fill="#a78bfa" />
                </BarChart>
            </ResponsiveContainer>

        </Card>
    );
}
