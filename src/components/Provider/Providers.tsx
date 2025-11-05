"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { LiffProvider } from "./LiffProvider";
import { LongdoMapScriptProvider } from "../Script/LongdoScriptLoader";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LiffProvider>
        <LongdoMapScriptProvider>{children}</LongdoMapScriptProvider>
      </LiffProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
