'use client';
import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { useSession as useAuthSession } from '@/lib/authClient';
import LoadingSkeleton from '@/components/session-loader';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email?: string;
  name?: string;
  //eslint-disable-next-line
  [key: string]: any;
}

interface Session {
  user: User;
  expiresAt: number;
  refreshToken?: string;
}

interface SessionContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

export function SessionProvider({
  children,
  redirectTo = '/login',
  loadingComponent,
}: SessionProviderProps) {
  // Call useAuthSession at the top level
  const { data: session, isPending: authLoading, error: authError } = useAuthSession();
  const router = useRouter();
  
  // Add loading timeout to prevent infinite loading
  useEffect(() => {
    if (authLoading) {
      const timeoutId = setTimeout(() => {
        if (authLoading) {
          console.log('Auth loading timed out, redirecting to login');
          router.push(redirectTo);
        }
      }, 10000); // 10 seconds timeout
      return () => clearTimeout(timeoutId);
    }
  }, [authLoading, redirectTo]);

  const isAuthenticated = useMemo(() => !!session, [session]);


  const contextValue = useMemo<SessionContextType>(
    () => ({
      isLoading: authLoading,
      isAuthenticated,
    }),
    [session, authLoading, isAuthenticated]
  );

  // Only show loading state for initial authentication
  if (authLoading && !session) {
    console.log('Showing loading state - authenticating...');
    return loadingComponent ? <>{loadingComponent}</> : <LoadingSkeleton />;
  }

  // If we have a session or we're not loading, show the children
  console.log('Rendering provider with session:', !!session);
  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
}
