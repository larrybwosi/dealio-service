import { createAuthClient } from 'better-auth/react';
import { useQuery, UseQueryResult, useQueryClient } from '@tanstack/react-query';
import { apiKeyClient, customSessionClient, organizationClient, usernameClient } from 'better-auth/client/plugins';
import { API_ENDPOINT } from './axios';
import { fetch } from '@tauri-apps/plugin-http';
import axios, { AxiosError } from 'axios';
import axiosTauriApiAdapter from 'axios-tauri-api-adapter';

// ========= CONSTANTS =========
const SESSION_STORAGE_KEY = 'session_data_v1' as const;
const BEARER_TOKEN_KEY = 'bearer_token' as const;
const QUERY_KEY = ['session'] as const;

// Time constants
const TIME_CONSTANTS = {
  ONE_HOUR: 60 * 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  TWENTY_FOUR_HOURS: 24 * 60 * 60 * 1000,
  MAX_RETRY_DELAY: 30 * 1000,
} as const;

// ========= TYPE DEFINITIONS =========
export class BetterFetchError extends Error {
  readonly status: number;
  readonly info?: unknown;

  constructor(message: string, status: number, info?: unknown) {
    super(message);
    this.name = 'BetterFetchError';
    this.status = status;
    this.info = info;
  }
}

interface User {
  readonly id: string;
  readonly emailVerified: boolean;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly email?: string;
  readonly image?: string;
  readonly username?: string;
  readonly displayUsername?: string;
}

interface Session {
  readonly id: string;
  readonly userId: string;
  readonly expiresAt: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly token: string;
  readonly ipAddress?: string;
  readonly userAgent?: string;
  readonly activeOrganizationId?: string;
}

export interface SessionData {
  readonly user: User;
  readonly session: Session;
}

interface UseSessionOptions {
  /**
   * How long to persist the session data in the cache before it becomes stale.
   * @default 3600000 (1 hour)
   */
  readonly persistFor?: number;

  /**
   * Whether to enable the query. Useful for conditional fetching.
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * Custom refetch interval in milliseconds. Set to false to disable.
   * @default false
   */
  readonly refetchInterval?: number | false;
}

type UseSessionReturn = Omit<UseQueryResult<SessionData, BetterFetchError>, 'data' | 'error'> & {
  readonly data: SessionData | undefined;
  readonly error: BetterFetchError | null;
  readonly clearSession: () => void;
  readonly refreshSession: () => Promise<SessionData>;
};

interface StoredSessionData {
  readonly data: SessionData;
  readonly timestamp: number;
}

// ========= UTILITY FUNCTIONS =========
//eslint-disable-next-line
const parseStoredDates = (data: any): SessionData => ({
  ...data,
  user: {
    ...data.user,
    createdAt: new Date(data.user.createdAt),
    updatedAt: new Date(data.user.updatedAt),
  },
  session: {
    ...data.session,
    expiresAt: new Date(data.session.expiresAt),
    createdAt: new Date(data.session.createdAt),
    updatedAt: new Date(data.session.updatedAt),
  },
});

const getStoredSession = (): SessionData | null => {
  try {
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!storedSession) return null;

    const parsed: StoredSessionData = JSON.parse(storedSession);
    const isValid = Date.now() - parsed.timestamp < TIME_CONSTANTS.TWENTY_FOUR_HOURS;

    if (!isValid) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }

    return parseStoredDates(parsed.data);
  } catch (error) {
    console.warn('Failed to parse stored session:', error);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
};

const storeSession = (data: SessionData): void => {
  // console.log('Session storage set: ', data)
  try {
    const storedData: StoredSessionData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(storedData));
    // localStorage.setItem(BEARER_TOKEN_KEY,data.session.token);
  } catch (error) {
    console.warn('Failed to store session data:', error);
  }
};

const clearStoredSession = (): void => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(BEARER_TOKEN_KEY);
  } catch (error) {
    console.warn('Failed to clear stored session:', error);
  }
};

const isAuthError = (error: unknown): boolean => {
  return error instanceof BetterFetchError && (error.status === 401 || error.status === 403);
};

// ========= AUTH CLIENT CONFIGURATION =========
export const authClient = createAuthClient({
  baseURL: API_ENDPOINT,
  plugins: [customSessionClient(), apiKeyClient(), usernameClient(), organizationClient()],
  fetchOptions: {
    credentials:'same-origin',
  },
  disableDefaultFetchPlugins: true,
});

export const { signIn, signUp, useSession, signOut, changePassword, apiKey } = createAuthClient({
  baseURL: process.env.VITE_PUBLIC_API_ENDPOINT,
  plugins: [apiKeyClient(), usernameClient(), organizationClient()],
  fetchOptions: {
    credentials: 'include',
  },
});

// ========= SESSION FETCHER =========
const fetchSession = async (): Promise<SessionData> => {
  const response = await fetch(`${API_ENDPOINT}/api/auth/get-session`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorInfo: unknown;
    try {
      errorInfo = await response.json();
    } catch {
      errorInfo = { message: 'Failed to parse error response.' };
    }

    throw new BetterFetchError(`Failed to fetch session. Status: ${response.status}`, response.status, errorInfo);
  }

  const data = await response.json();
  return parseStoredDates(data);
};


// ========= ADDITIONAL UTILITIES =========

/**
 * Check if the current session is valid (not expired)
 */
export const isSessionValid = (sessionData?: SessionData): boolean => {
  if (!sessionData?.session?.expiresAt) return false;
  return new Date(sessionData.session.expiresAt) > new Date();
};

/**
 * Get session expiry time in milliseconds from now
 */
export const getSessionTimeToExpiry = (sessionData?: SessionData): number => {
  if (!sessionData?.session?.expiresAt) return 0;
  return Math.max(0, new Date(sessionData.session.expiresAt).getTime() - Date.now());
};

/**
 * Check if session will expire within the given time (in milliseconds)
 */
export const isSessionNearExpiry = (
  sessionData?: SessionData,
  withinMs: number = TIME_CONSTANTS.FIVE_MINUTES
): boolean => {
  return getSessionTimeToExpiry(sessionData) < withinMs;
};

/**
 * Auto-refresh middleware for axios requests
 * This can be used to automatically refresh tokens when making API calls
 */
export const createAuthRefreshInterceptor = (axiosInstance: typeof axios) => {
  let isRefreshing = false;
  let refreshPromise: Promise<SessionData> | null = null;
  const pendingRequests: Array<() => void> = [];

  // Function to process pending requests after token refresh
  const processPendingRequests = () => {
    pendingRequests.forEach(callback => callback());
    pendingRequests.length = 0;
  };

  // Response interceptor to catch auth errors
  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      
      // If error is not auth-related or request has already been retried, reject
      if (!isAuthError(error) || originalRequest._retry) {
        return Promise.reject(error);
      }
      
      // Mark request as retried to prevent infinite loops
      originalRequest._retry = true;
      
      // If not already refreshing, start refresh process
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          // Use existing refresh promise or create a new one
          refreshPromise = refreshPromise || fetchSession().then(data => {
            storeSession(data);
            return data;
          });
          
          // Wait for token refresh
          await refreshPromise;
          
          // Process all pending requests
          processPendingRequests();
          
          // Update authorization header with new token
          const token = localStorage.getItem(BEARER_TOKEN_KEY);
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          
          // Retry the original request
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // If refresh fails, clear session and reject
          clearStoredSession();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      } else {
        // If already refreshing, queue this request
        return new Promise(resolve => {
          pendingRequests.push(() => {
            // Update authorization header with new token
            const token = localStorage.getItem(BEARER_TOKEN_KEY);
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }
  );

  return axiosInstance;
};
