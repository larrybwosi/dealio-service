'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { useSession as useAuthSession } from '@/lib/authClient';
import LoadingSkeleton from '@/components/session-loader';
import { useRouter } from 'next/navigation';

// Define the session type based on your auth implementation
interface Session {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

// Context value type
interface SessionContextValue {
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  refreshSession: () => Promise<void>;
}

// Create context with proper typing
const SessionContext = createContext<SessionContextValue | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
  redirectTo?: string;
  loadingComponent?: ReactNode;
  requireAuth?: boolean;
  onAuthError?: (error: Error) => void;
}

export function SessionProvider({
  children,
  redirectTo = '/login',
  loadingComponent,
  requireAuth = false,
  onAuthError,
}: SessionProviderProps) {
  const { data: session, isPending: authLoading, error: authError, refetch: refetchSession } = useAuthSession();

  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  const isAuthenticated = useMemo(() => !!session, [session]);

  // Refresh session callback
  const refreshSession = useCallback(async () => {
    try {
      await refetchSession();
    } catch (error) {
      console.error('Failed to refresh session:', error);
    }
  }, [refetchSession]);

  // Handle authentication errors
  useEffect(() => {
    if (authError) {
      console.error('Authentication error:', authError);
      if (onAuthError) {
        onAuthError(authError);
      }
    }
  }, [authError, onAuthError]);

  // Handle redirect for protected routes
  useEffect(() => {
    if (!authLoading && !session && requireAuth && !hasRedirected) {
      console.log('No session found, redirecting to:', redirectTo);
      setHasRedirected(true);
      router.push(redirectTo);
    }
  }, [authLoading, session, requireAuth, redirectTo, router, hasRedirected]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<SessionContextValue>(
    () => ({
      session: session || null,
      isAuthenticated,
      isLoading: authLoading,
      error: authError || null,
      refreshSession,
    }),
    [session, isAuthenticated, authLoading, authError, refreshSession]
  );

  // Show loading state for initial authentication
  if (authLoading && !session) {
    console.log('Showing loading state - authenticating...');
    return loadingComponent ? <>{loadingComponent}</> : <LoadingSkeleton />;
  }

  // Don't render children if auth is required but not authenticated
  if (requireAuth && !session && !authLoading) {
    return null;
  }

  console.log('Rendering provider with session:', !!session);
  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
}

// Custom hook to use session context
export function useSession() {
  const context = useContext(SessionContext);

  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return context;
}

// Optional: Hook for protected routes
export function useRequireAuth() {
  const { session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/login');
    }
  }, [session, isLoading, router]);

  return { session, isLoading };
}

// Optional: Hook to get user data directly
export function useUser() {
  const { session } = useSession();
  return session?.user ?? null;
}
