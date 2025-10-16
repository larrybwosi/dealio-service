'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlertCircle, Building2, CheckCircle2, Lock, Settings } from 'lucide-react';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { useOrgStore } from '@org/store';
import { useSession } from './authClient';
import axios from 'axios';

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { organizationId, set: setOrgDetails } = useOrgStore(state => ({
    organizationId: state.organizationId,
    set: state.set,
  }));

  console.log(session)

  const [isLoading, setIsLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState<'session' | 'organization' | 'complete'>('session');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeOrg = async () => {
      try {
        // 1. Check if org details are already in the Zustand store (and persisted storage)
        if (organizationId) {
          setLoadingStage('complete');
          setIsLoading(false);
          return;
        }

        // 2. If not in store, check the user's session status
        if (isPending) {
          setLoadingStage('session');
          return;
        }

        if (session?.user?.id) {
          setLoadingStage('organization');

          // 3. Session is authenticated, fetch org details from the API
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/org-details`,{withCredentials:true});
          if (!response.data) {
            if (response.status === 404) {
              // User exists but has no org details
              router.push('/');
              return;
            }
            throw new Error('Failed to fetch organization details');
          }

          const details = response.data;

          if (details.organizationId) {
            // 4. Set the fetched details in the Zustand store
            setOrgDetails({
              organizationId: details.organizationId,
              memberId: details.memberId,
              locationId: details.locationId,
              locationName: details.locationName,
              address: details.address,
              logo: details.logo,
              taxRate: details.taxRate,
              currency: details.currency,
              orgName: details.orgName,
              plan: details.plan,
            });
            setLoadingStage('complete');
          } else {
            // 5. No active session, redirect to the login page
            router.push('/login');
            return;
          }
        } else {
          // 5. No active session, redirect to the login page
          router.push('/login');
          return;
        }
      } catch (error) {
        console.error('Error initializing organization:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        // Optional: Show error for a moment before redirecting
        setTimeout(() => router.push('/login'), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    initializeOrg();
  }, [organizationId, session, isPending, router, setOrgDetails]);

  if (isLoading || error) {
    return (
      <div className="fixed inset-0 bg-background z-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/20">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
          {/* Animated background orbs */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse animation-delay-2000" />
        </div>

        {error ? (
          // Error State with App Layout
          <div className="relative h-full flex flex-col">
            {/* Header Skeleton */}
            <div className="p-6 border-b bg-background/80 backdrop-blur-sm">
              <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>

            {/* Error Content */}
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="max-w-md w-full">
                <div className="bg-card rounded-2xl shadow-xl border p-8 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-destructive" />
                      </div>
                      <div className="absolute inset-0 w-16 h-16 border-2 border-destructive/20 rounded-full animate-ping" />
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h2>
                  <p className="text-muted-foreground mb-6">{error}</p>

                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse" />
                    <span>Redirecting to login...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Loading State with Full App Layout
          <div className="relative h-full flex flex-col">
            {/* Header Skeleton */}
            <div className="p-6 border-b bg-background/80 backdrop-blur-sm">
              <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {loadingStage === 'session' ? (
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-primary animate-pulse" />
                      </div>
                    ) : loadingStage === 'organization' ? (
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-primary animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
              {/* Sidebar Skeleton */}
              <div className="w-64 border-r bg-background/50 backdrop-blur-sm p-6 hidden lg:block">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <Skeleton className="h-4 w-4 rounded-sm" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col">
                {/* Content Header */}
                <div className="p-6 border-b bg-background/50 backdrop-blur-sm">
                  <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-96" />
                      </div>
                      <div className="flex space-x-2">
                        <Skeleton className="h-9 w-24 rounded-md" />
                        <Skeleton className="h-9 w-32 rounded-md" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 p-6 bg-background/30">
                  <div className="max-w-6xl mx-auto space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-card rounded-lg border p-6 space-y-3">
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-4 rounded" />
                          </div>
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      ))}
                    </div>

                    {/* Main Content Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-card rounded-lg border p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="space-y-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-3">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <div className="flex-1 space-y-1">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-3/4" />
                              </div>
                              <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-card rounded-lg border p-6 space-y-4">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-32 w-full rounded-md" />
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Status Card */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-card border shadow-2xl rounded-2xl px-6 py-4 flex items-center space-x-4 min-w-[320px]">
                {/* Status Icon */}
                <div className="relative flex-shrink-0">
                  {loadingStage === 'session' ? (
                    <>
                      <div className="w-8 h-8 border-2 border-muted rounded-full animate-spin border-t-primary" />
                      <Lock className="absolute inset-0 m-auto w-3 h-3 text-primary" />
                    </>
                  ) : loadingStage === 'organization' ? (
                    <>
                      <div className="w-8 h-8 border-2 border-muted rounded-full animate-spin border-t-primary" />
                      <Building2 className="absolute inset-0 m-auto w-3 h-3 text-primary" />
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 border-2 border-muted rounded-full animate-spin border-t-primary" />
                      <Settings className="absolute inset-0 m-auto w-3 h-3 text-primary animate-spin" />
                    </>
                  )}
                </div>

                {/* Status Text */}
                <div className="flex-1">
                  <div className="font-medium text-foreground">
                    {loadingStage === 'session'
                      ? 'Authenticating'
                      : loadingStage === 'organization'
                        ? 'Loading Organization'
                        : 'Initializing'}
                    <span className="inline-flex ml-1">
                      <span className="animate-pulse delay-0">.</span>
                      <span className="animate-pulse delay-150">.</span>
                      <span className="animate-pulse delay-300">.</span>
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {loadingStage === 'session'
                      ? 'Verifying your session'
                      : loadingStage === 'organization'
                        ? 'Fetching organization details'
                        : 'Setting up your workspace'}
                  </p>
                </div>

                {/* Progress Dots */}
                <div className="flex space-x-1.5">
                  {['session', 'organization', 'complete'].map((stage, index) => (
                    <div
                      key={stage}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        loadingStage === stage
                          ? 'bg-primary animate-pulse scale-110'
                          : index < ['session', 'organization', 'complete'].indexOf(loadingStage)
                            ? 'bg-primary'
                            : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="fixed bottom-0 left-0 right-0 h-1 bg-muted/50">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-1000 ease-out"
                style={{
                  width: loadingStage === 'session' ? '33%' : loadingStage === 'organization' ? '66%' : '100%',
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
