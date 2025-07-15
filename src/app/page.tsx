// src/app/page.tsx
'use client";'
import { AppStateProvider } from "@/components/AppStateContext";
import { BlockProvider } from "@/components/BlockContext";
import DashboardControls from "@/components/DashboardControls";
import { Container, Title, Stack, Divider, Center, Loader } from "@mantine/core";
import ChartTokenVolume from "@/components/ChartTokenVolume";
import ChartBlockBaseFee from "@/components/ChartBlockBaseFee";
import ChartGasRatio from "@/components/ChartGasRatio";
import { NetworkProvider } from "@/components/NetworkContext";
import DashboardContent from "@/components/DashboardContent";

export default function Page() {
  return (
    <NetworkProvider>
      <AppStateProvider>
        <BlockProvider>
          <Container size="lg" py="xl">
            <Stack gap="xs" mb="lg">
              <Title order={1}>📊 Real-Time Ethereum Dashboard</Title>
              <DashboardControls />
              <Divider />
            </Stack>
            <DashboardContent/>
          </Container>
        </BlockProvider>
      </AppStateProvider>
    </NetworkProvider>
  );
}
