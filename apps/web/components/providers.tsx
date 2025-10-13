"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DeleteConfirmationProvider } from "./delete-modal-provider";
import { OrgProvider } from "@/lib/org-context";
import { SessionProvider } from "@/lib/session";

function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <QueryProvider>
        <NuqsAdapter>
          <DeleteConfirmationProvider>
            <SessionProvider>
              <OrgProvider>{children}</OrgProvider>
            </SessionProvider>
          </DeleteConfirmationProvider>
        </NuqsAdapter>
      </QueryProvider>
    </NextThemesProvider>
  );
}
