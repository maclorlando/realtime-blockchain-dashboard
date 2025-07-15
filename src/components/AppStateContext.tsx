"use client";
import { createContext, useContext, useState } from "react";

type AppState = {
  useLive: boolean;
  toggleLive: () => void;
};

const AppStateContext = createContext<AppState | null>(null);
export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
};

export const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [useLive, setUseLive] = useState(true);

  return (
    <AppStateContext.Provider
      value={{
        useLive,
        toggleLive: () => setUseLive((v) => !v),
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
