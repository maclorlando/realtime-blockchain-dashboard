"use client";

import { useBlockData } from "@/components/BlockContext";
import { Loader, Center, Stack } from "@mantine/core";
import ChartTokenVolume from "./ChartTokenVolume";
import ChartBlockBaseFee from "./ChartBlockBaseFee";
import ChartGasRatio from "./ChartGasRatio";

export default function DashboardContent() {
  const { blocks, loading } = useBlockData();

  return loading ? (
    <Center py="xl">
      <Loader size="lg" />
    </Center>
  ) : (
    <Stack gap="xl">
      <ChartTokenVolume />
      <ChartBlockBaseFee />
      <ChartGasRatio />
    </Stack>
  );
}
