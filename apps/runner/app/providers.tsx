"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@zoomoff/ui";
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 10_000, retry: 1 }, mutations: { retry: 0 } } });
export function Providers({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}><ToastProvider>{children}</ToastProvider></QueryClientProvider>;
}
