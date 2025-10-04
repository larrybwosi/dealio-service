'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { MemberRole } from '@/prisma/client';
import { headers } from 'next/headers';
import upstashRedis from '@/lib/redis';

// Redis client configuration
let redisClient: {
  get: (key: string) => Promise<string | null>;
  setex: (key: string, ttl: number, value: string) => Promise<void>;
  del: (...keys: string[]) => Promise<number>;
  keys: (pattern: string) => Promise<string[]>;
};

if (process.env.NODE_ENV === 'production') {
  redisClient = {
    get: (key: string) => upstashRedis.get(key).then(res => res?.toString() ?? null),
    setex: async (key: string, ttl: number, value: string) => {
      await upstashRedis.set(key, value, { ex: ttl });
    },
    del: (...keys: string[]) => upstashRedis.del(...keys),
    keys: (pattern: string) => upstashRedis.keys(pattern),
  };
} else {
  // ioredis for development
  const { getRedisClient } = await import('@/lib/services/redis');
  const ioredis = getRedisClient();

  redisClient = {
    get: (key: string) => ioredis.get(key),
    setex: async (key: string, ttl: number, value: string) => { await ioredis.setex(key, ttl, value); },
    del: (...keys: string[]) => ioredis.del(keys),
    keys: (pattern: string) => ioredis.keys(pattern),
  };
}

// Cache TTL constants
const AUTH_CONTEXT_TTL = 1800; // 30 minutes
const MEMBER_DETAILS_TTL = 3600; // 1 hour (more stable data)

interface ServerAuthContextResult {
  userId: string;
  memberId: string;
  organizationId: string;
  role?: MemberRole;
  organizationName?: string | null;
  organizationSlug?: string | null;
  organizationDescription?: string | null;
}

interface MemberOrgDetails {
  memberId: string | null;
  role?: MemberRole;
  organizationSlug?: string | null;
  organizationName?: string | null;
  organizationDescription?: string | null;
}

async function getMemberAndOrgDetails(userId: string, organizationId: string): Promise<MemberOrgDetails> {
  if (!userId || !organizationId) {
    return { memberId: null };
  }

  const memberCacheKey = `member:${userId}:${organizationId}`;

  try {
    const cachedMember = await redisClient.get(memberCacheKey);
    if (cachedMember) {
      return JSON.parse(cachedMember) as MemberOrgDetails;
    }

    const member = await db.member.findUnique({
      where: {
        organizationId_userId: { organizationId, userId },
      },
      select: {
        id: true,
        role: true,
        organization: {
          select: {
            slug: true,
            description: true,
            name: true,
          },
        },
      },
    });

    const result: MemberOrgDetails = member
      ? {
          memberId: member.id,
          role: member.role,
          organizationSlug: member.organization.slug,
          organizationName: member.organization.name,
          organizationDescription: member.organization.description,
        }
      : { memberId: null };

    await redisClient.setex(memberCacheKey, MEMBER_DETAILS_TTL, JSON.stringify(result));
    return result;
  } catch (error) {
    console.error('Error fetching member/org details:', error);
    return { memberId: null };
  }
}

async function getServerAuthContext(): Promise<ServerAuthContextResult> {
  let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
    
  } catch (error) {
    console.error('Error fetching session:', error);
    throw new Error('Failed to retrieve user session');
  }

  if (!session?.user?.id) {
    throw new Error('Unauthorized - No user ID found in session.');
  }

  const userId = session.user.id;
  const cacheKey = `auth:context:${userId}`;

  try {
    const cachedContext = await redisClient.get(cacheKey);
    if (cachedContext) {
      const parsedContext = JSON.parse(cachedContext) as ServerAuthContextResult;
      if (parsedContext?.userId && parsedContext?.memberId && parsedContext?.organizationId) {
        return parsedContext;
      }
    }

    const activeOrgId = await getUserActiveOrganization(userId);
    if (!activeOrgId) {
      throw new Error('No active organization is set for the user.');
    }

    const memberDetails = await getMemberAndOrgDetails(userId, activeOrgId);
    if (!memberDetails.memberId) {
      throw new Error(`User is not an active member of the designated organization (ID: ${activeOrgId}).`);
    }

    const authContextData: ServerAuthContextResult = {
      userId,
      memberId: memberDetails.memberId,
      organizationId: activeOrgId,
      role: memberDetails.role,
      organizationName: memberDetails.organizationName,
      organizationSlug: memberDetails.organizationSlug,
      organizationDescription: memberDetails.organizationDescription,
    };

    redisClient
      .setex(cacheKey, AUTH_CONTEXT_TTL, JSON.stringify(authContextData))
      .catch(error => console.error('Error caching auth context:', error));

    return authContextData;
  } catch (error) {
    console.error('Error in getServerAuthContext:', error);
    throw error instanceof Error ? error : new Error('Authentication context retrieval failed');
  }
}

async function getUserActiveOrganization(userId: string): Promise<string | null> {
  const userOrgCacheKey = `user:org:${userId}`;

  try {
    const cachedOrgId = await redisClient.get(userOrgCacheKey);
    if (cachedOrgId && typeof cachedOrgId === 'string') {
      return cachedOrgId;
    }

    const userPrefs = await db.user.findUnique({
      where: { id: userId },
      select: { activeOrganizationId: true },
    });

    const orgId = userPrefs?.activeOrganizationId || null;

    if (orgId) {
      redisClient.setex(userOrgCacheKey, 900, orgId).catch(error => console.error('Error caching user org:', error));
    }

    return orgId;
  } catch (error) {
    console.error('Error fetching user active organization:', error);
    return null;
  }
}

async function invalidateAuthCache(
  type: 'context' | 'membership' | 'user-org' | 'member-details',
  identifier: string,
  organizationId?: string
): Promise<void> {
  try {
    const keysToDelete: string[] = [];

    switch (type) {
      case 'context':
        keysToDelete.push(`auth:context:${identifier}`);
        break;
      case 'membership':
        if (organizationId) {
          keysToDelete.push(`auth:membership:${identifier}:${organizationId}`);
        } else {
          const keys = await redisClient.keys(`auth:membership:${identifier}:*`);
          keysToDelete.push(...keys);
        }
        break;
      case 'user-org':
        keysToDelete.push(`user:org:${identifier}`);
        break;
      case 'member-details':
        if (organizationId) {
          keysToDelete.push(`member:${identifier}:${organizationId}`);
        } else {
          const keys = await redisClient.keys(`member:${identifier}:*`);
          keysToDelete.push(...keys);
        }
        break;
    }

    if (keysToDelete.length > 0) {
      await redisClient.del(...keysToDelete);
    }
  } catch (error) {
    console.error('Error invalidating auth cache:', error);
  }
}

async function invalidateUserCache(userId: string, organizationId?: string): Promise<void> {
  await Promise.all([
    invalidateAuthCache('context', userId),
    invalidateAuthCache('user-org', userId),
    invalidateAuthCache('member-details', userId, organizationId),
    invalidateAuthCache('membership', userId, organizationId),
  ]);
}

export { getServerAuthContext, invalidateAuthCache, invalidateUserCache, getMemberAndOrgDetails };
