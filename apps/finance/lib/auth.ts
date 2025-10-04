import { betterAuth,  } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin, apiKey, bearer, customSession, multiSession, username, jwt } from 'better-auth/plugins';
import { oneTimeToken } from 'better-auth/plugins/one-time-token';
import { tauri } from '@daveyplate/better-auth-tauri/plugin';
import { unstable_cache } from 'next/cache';
import DodoPayments from 'dodopayments/index.mjs';
import { db } from './db';
import { nextCookies } from 'better-auth/next-js';
import { UserRole } from '@/prisma/client';
import upstashRedis from '@/lib/redis';
import { dodopayments, checkout, portal, webhooks } from '@dodopayments/better-auth';

export const dodoPayments = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: 'test_mode',
});
 

let redisClient: {
  get: <T>(key: string) => Promise<T | null>;
  setex: <T>(key: string, ttl: number, value: T) => Promise<void>;
  del: (...keys: string[]) => Promise<number>;
  keys: (pattern: string) => Promise<string[]>;
  incr: (key: string) => Promise<number>;
};

if (process.env.NODE_ENV === 'production') {
  const upstashRedisClient = upstashRedis;
  redisClient = {
    get: async <T>(key: string): Promise<T | null> => {
      try {
        const value = await upstashRedisClient.get(key);
        if (value === null || value === undefined) {
          return null;
        }

        // If it's already an object, return it directly
        if (typeof value === 'object') {
          return value as T;
        }

        // If it's a string, try to parse it as JSON
        if (typeof value === 'string') {
          try {
            return JSON.parse(value) as T;
          } catch (parseError) {
            console.error('Error parsing JSON from Redis:', parseError);
            // If it's not valid JSON, return the string as is
            return value as T;
          }
        }

        // For other types, return as is
        return value as T;
      } catch (error) {
        console.error('Error getting value from Redis:', error);
        return null;
      }
    },
    setex: async <T>(key: string, ttl: number, value: T) => {
      await upstashRedisClient.set(key, value, { ex: ttl });
    },
    del: (...keys: string[]) => upstashRedisClient.del(...keys),
    keys: (pattern: string) => upstashRedisClient.keys(pattern),
    incr: (key: string) => upstashRedisClient.incr(key),
  };
} else {
  // ioredis for development
  const { getRedisClient } = await import('@/lib/ioredis');
  const ioredis = getRedisClient();
  redisClient = {
    get: async <T>(key: string): Promise<T | null> => {
      try {
        const value = await ioredis.get(key);
        if (value === null || value === undefined) {
          return null;
        }

        // ioredis always returns strings, so we need to parse JSON
        return JSON.parse(value) as T;
      } catch (error) {
        console.error('Error getting value from Redis:', error);
        return null;
      }
    },
    setex: async <T>(key: string, ttl: number, value: T) => {
      await ioredis.setex(key, ttl, JSON.stringify(value));
    },
    del: (...keys: string[]) => ioredis.del(keys),
    keys: (pattern: string) => ioredis.keys(pattern),
    incr: (key: string) => ioredis.incr(key),
  };
}


export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  appName: 'Dealio ',
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://tauri.localhost',
    'https://tauri.localhost',
  ],
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'github'],
    },
  },
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 * 60,
    },
    preserveSessionInDatabase: true,
  },
  plugins: [
    apiKey({
      enableMetadata: true,
    }),
    admin({
      defaultRole: UserRole.MEMBER,
    }),
    username(),
    multiSession({
      maximumSessions: 10,
    }),
    oneTimeToken(),
    bearer(),
    jwt({ jwt:{ expirationTime:'1d'}}),
    customSession(async ({ user, session }) => {
      const userOrgAndMemberCache = unstable_cache(
        async (userId: string) => {
          'use server';
          const usr = await db.user.findUnique({
            where: { id: userId },
          });

          const activeOrganizationId = usr?.activeOrganizationId;

          // If no active organization, return null values
          if (!activeOrganizationId) {
            return {
              member: null,
              activeOrganizationId: null,
            };
          }

          const member = await db.member.findUnique({
            where: {
              organizationId_userId: {
                organizationId: activeOrganizationId,
                userId,
              },
            },
            select: {
              id: true,
              role: true,
            },
          });

          return { member, activeOrganizationId };
        },
        [user.id],
        { revalidate: 60 * 60 * 24 } // Cache for 24 hours
      );

      const { member, activeOrganizationId } = await userOrgAndMemberCache(user.id);

      return {
        user: {
          ...user,
          activeOrganizationId: activeOrganizationId || null,
          memberId: member?.id || null,
        },
        session,
      };
    }),
    tauri({
      scheme: 'com.dealio.apps',
      callbackURL: '/', // Optional: Where to redirect after auth (default: "/")
      successText: 'Authentication successful! You can close this window.', // Optional
      successURL: '/', // Optional: Custom success page URL that will receive a ?tauriRedirect search parameter
      debugLogs: false, // Optional: Enable debug logs
    }),
    dodopayments({
      client: dodoPayments,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: 'pdt_xxxxxxxxxxxxxxxxxxxxx',
              slug: 'premium-plan',
            },
          ],
          successUrl: '/dashboard/success',
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET!,
          onPayload: async payload => {
            console.log('Received webhook:', payload.event_type);
          },
        }),
      ],
    }),
    nextCookies(),
  ],

  secondaryStorage: {
    get: async (key: string) => {
      try {
        const value = await redisClient.get(key);
        // console.log('Session value in get: ', value);

        if (value === null || value === undefined) {
          return null;
        }

        // Handle different data types from Redis
        if (typeof value === 'string') {
          return value;
        }

        // If it's an object (common with Upstash), stringify it
        if (typeof value === 'object') {
          return JSON.stringify(value);
        }

        // For other types, convert to string
        return String(value);
      } catch (error) {
        console.error('Error getting session value from Redis:', error);
        return null;
      }
    },

    set: async (key: string, value: string, ttl?: number) => {
      try {
        // console.log('Session set value: ', { key, ttl, value });

        // Ensure value is a string for session storage
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

        // Use provided TTL or default to 7 Days
        const expirationTime = ttl || 60 * 60 * 24 * 7;

        await redisClient.setex(key, expirationTime, stringValue);
      } catch (error) {
        console.error('Error setting session value in Redis:', error);
        throw error; // Re-throw to let the session manager handle it
      }
    },

    delete: async (key: string) => {
      try {
        await redisClient.del(key);
      } catch (error) {
        console.error('Error deleting session value from Redis:', error);
        // Don't throw here as deletion failures shouldn't break the flow
      }
    },
  },
  rateLimit: {
    window: 60,
    max: 100,
    storage: 'secondary-storage',
  },
});
