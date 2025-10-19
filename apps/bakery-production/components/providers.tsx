"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DeleteConfirmationProvider } from "./delete-modal-provider";
import { OrgProvider } from "@/lib/org-context";
import { SessionProvider } from "@/lib/session";

function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({defaultOptions: {queries: {refetchOnWindowFocus: false, gcTime: 1000 * 60 * 60 * 12, staleTime: 1000 * 60 * 30}}});
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <QueryProvider>
        <NuqsAdapter>
          <DeleteConfirmationProvider>
            <SessionProvider>
              <>{children}</>
            </SessionProvider>
          </DeleteConfirmationProvider>
        </NuqsAdapter>
      </QueryProvider>
    </NextThemesProvider>
  );
}
