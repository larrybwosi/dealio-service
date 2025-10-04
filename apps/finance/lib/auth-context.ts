import prisma from '@/lib/db';
import { auth } from './auth';
import { headers } from 'next/headers';
import { MemberRole } from '@/prisma/client';
import { cache } from 'react';
import { Permission } from './types/permissions';
import upstashRedis from '@/lib/redis';
import { PERMISSION_DEFINITIONS } from './permissions';

export class PermissionError extends Error {
  public attempts: number;
  public isBanned: boolean;
  public remainingAttempts: number;

  constructor(message: string, attempts: number = 0, isBanned: boolean = false) {
    super(message);
    this.name = 'PermissionError';
    this.attempts = attempts;
    this.isBanned = isBanned;
    this.remainingAttempts = Math.max(0, 5 - attempts);
  }
}

// Cache and Rate Limiting configuration
export const CONFIG = {
  AUTH_CONTEXT_TTL: 300, // 5 minutes
  MEMBER_DATA_TTL: 600, // 10 minutes
  PERMISSION_CACHE_TTL: 900, // 15 minutes
  FAILED_ATTEMPT_TTL: 3600, // 1 hour
  BAN_TTL: 86400, // 24 hours
  MAX_FAILED_ATTEMPTS: 5,
  WARNING_THRESHOLD_1: 3,
  WARNING_THRESHOLD_2: 4,
} as const;


// Redis client configuration
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

// Cache configuration
const CACHE_CONFIG = {
  AUTH_CONTEXT_TTL: 300, // 5 minutes
  MEMBER_DATA_TTL: 600, // 10 minutes
  PERMISSION_CACHE_TTL: 900, // 15 minutes
} as const;

// Cache key generators
const getCacheKeys = (memberId: string, organizationId: string, permission?: Permission) => ({
  authContext: `auth:context:${memberId}:${organizationId}`,
  memberData: `member:data:${memberId}:${organizationId}`,
  permissions: `permissions:${memberId}:${organizationId}`,
  failedAttempts: `auth:failed-attempts:${memberId}:${permission}`,
  ban: `auth:ban:${memberId}`,
});

/**
 * Interface for cached member data.
 */
interface CachedMemberData {
  id: string;
  role: MemberRole;
  customRoles: Array<{
    name: string;
    permissions: string[];
  }>;
  lastUpdated: number;
}

/**
 * Interface for the AuthContext object.
 */
export interface AuthContext {
  userId: string;
  memberId: string;
  organizationId: string;
  permissions: Set<string>;
  hasPermission: (permission: string) => boolean;
  role: MemberRole;
  customRoleNames: string[];
}

/**
 * Validates a permission string against a set of granted permissions, with support for wildcards.
 * @param grantedPermissions - A Set of permissions the user holds.
 * @param requiredPermission - The permission to check for.
 * @returns True if the permission is granted, false otherwise.
 */
const checkPermission = (grantedPermissions: Set<string>, requiredPermission: string): boolean => {
  // Universal wildcard grants all permissions
  if (grantedPermissions.has('*')) {
    return true;
  }

  // Direct match
  if (grantedPermissions.has(requiredPermission)) {
    return true;
  }

  // Wildcard matching (e.g., 'product:*' should match 'product:create')
  const parts = requiredPermission.split(':');
  for (let i = parts.length; i > 1; i--) {
    const wildcard = [...parts.slice(0, i - 1), '*'].join(':');
    if (grantedPermissions.has(wildcard)) {
      return true;
    }
  }

  return false;
};

/**
 * Fetches member data from cache or database.
 * @param userId - The user ID.
 * @param organizationId - The organization ID.
 * @returns Cached member data or null if not found.
 */
async function getCachedMemberData(userId: string, organizationId: string): Promise<CachedMemberData | null> {
  const { memberData } = getCacheKeys(userId, organizationId);

  try {
    const cached = await redisClient.get<CachedMemberData>(memberData);
    if (cached && cached.lastUpdated && Date.now() - cached.lastUpdated < CONFIG.MEMBER_DATA_TTL * 1000) {
      return cached;
    }

    const member = await prisma.member.findUnique({
      where: { organizationId_userId:{ organizationId, userId }},
      include: { customRoles: { select: { name: true, permissions: true } } },
    });
    
    // console.log('Member: ', member)
    if (!member) return null;

    const cachedData: CachedMemberData = {
      id: member.id,
      role: member.role,
      customRoles: member.customRoles,
      lastUpdated: Date.now(),
    };

    await redisClient.setex(memberData, CONFIG.MEMBER_DATA_TTL, cachedData);
    return cachedData;
  } catch (error) {
    console.error('Error fetching cached member data:', error);
    const member = await prisma.member.findFirst({
      where: { userId, organizationId, isActive: true },
      include: { customRoles: { select: { name: true, permissions: true } } },
    });
    return member
      ? { id: member.id, role: member.role, customRoles: member.customRoles, lastUpdated: Date.now() }
      : null;
  }
}

/**
 * Computes and caches permissions for a member.
 * @param memberData - The member data.
 * @param memberId - The member ID.
 * @param organizationId - The organization ID.
 * @returns Set of permissions.
 */
async function getPermissions(
  memberData: CachedMemberData,
  memberId: string,
  organizationId: string
): Promise<Set<string>> {
  const { permissions } = getCacheKeys(memberData.id, organizationId);

  try {
    // Try to get permissions from cache
    const cachedPermissions = await redisClient.get<string[]>(permissions);
    if (cachedPermissions) {
      return new Set(cachedPermissions);
    }

    // Compute permissions
    const basePermissions = PERMISSION_DEFINITIONS.memberRoles[memberData.role] || [];
    const customRolePermissions = memberData.customRoles.flatMap(role => role.permissions);
    const combinedPermissions = [...basePermissions, ...customRolePermissions];

    // Cache the permissions
    await redisClient.setex(permissions, CACHE_CONFIG.PERMISSION_CACHE_TTL, combinedPermissions);

    return new Set(combinedPermissions);
  } catch (error) {
    console.error('Error caching permissions:', error);
    // Fallback to computing permissions without caching
    const basePermissions = PERMISSION_DEFINITIONS.memberRoles[memberData.role] || [];
    const customRolePermissions = memberData.customRoles.flatMap(role => role.permissions);
    return new Set([...basePermissions, ...customRolePermissions]);
  }
}

/**
 * Creates an authorization context for a user within an organization.
 * This function is cached per request to avoid redundant database calls.
 * @param params - Object containing the organizationId.
 * @returns AuthContext or null if user is not authenticated or not a member.
 * @throws Error if the database query fails.
 */
export const createAuthContext = cache(async (params: { organizationId: string }): Promise<AuthContext | null> => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return null;
    }

    const { organizationId } = params;
    const userId = session.user.id;
    // console.log('UserId: ',userId)

    // Get member data (with caching)
    const memberData = await getCachedMemberData(userId, organizationId);
    if (!memberData) {
      return null;
    }

    const { authContext } = getCacheKeys(memberData.id, organizationId);
    // Try to get complete auth context from cache first
    try {
      const cachedContext = await redisClient.get<Omit<AuthContext, 'hasPermission'>>(authContext);
      if (cachedContext && cachedContext.permissions) {
        const permissionsSet = new Set(cachedContext.permissions as unknown as string[]);
        return {
          ...cachedContext,
          permissions: permissionsSet,
          hasPermission: (permission: string): boolean => {
            if (cachedContext.role === MemberRole.OWNER) {
              return true;
            }
            return checkPermission(permissionsSet, permission);
          },
        };
      }
    } catch (cacheError) {
      console.warn('Cache retrieval failed, falling back to database:', cacheError);
    }

    // Get permissions (with caching)
    const combinedPermissions = await getPermissions(memberData, memberData.id, organizationId);

    // Create auth context
    const context: AuthContext = {
      userId: userId,
      memberId: memberData.id,
      organizationId: organizationId,
      role: memberData.role,
      customRoleNames: memberData.customRoles.map(role => role.name),
      permissions: combinedPermissions,
      hasPermission: (permission: string): boolean => {
        if (memberData.role === MemberRole.OWNER) {
          return true;
        }
        return checkPermission(combinedPermissions, permission);
      },
    };

    // Cache the complete auth context (excluding the function)
    try {
      const cacheableContext = {
        userId: context.userId,
        memberId: context.memberId,
        organizationId: context.organizationId,
        role: context.role,
        customRoleNames: context.customRoleNames,
        permissions: Array.from(context.permissions), // Convert Set to Array for JSON serialization
      };
      await redisClient.setex(authContext, CACHE_CONFIG.AUTH_CONTEXT_TTL, cacheableContext);
    } catch (cacheError) {
      console.warn('Failed to cache auth context:', cacheError);
    }

    return context;
  } catch (error) {
    console.error('Error creating auth context:', error);
    throw new Error('Failed to create authorization context.');
  }
});

/**
 * Invalidates cached data for a specific member and organization.
 * Call this when member data, roles, or permissions change.
 * @param memberId - The member ID.
 * @param organizationId - The organization ID.
 */
export async function invalidateAuthCache(memberId: string, organizationId: string): Promise<void> {
  const keys = getCacheKeys(memberId, organizationId);

  try {
    await Promise.all([
      redisClient.del(keys.authContext),
      redisClient.del(keys.memberData),
      redisClient.del(keys.permissions),
    ]);
  } catch (error) {
    console.error('Error invalidating auth cache:', error);
  }
}

/**
 * Invalidates all cached data for an organization.
 * Use this when organization-wide changes occur.
 * @param organizationId - The organization ID.
 */
export async function invalidateOrganizationAuthCache(organizationId: string): Promise<void> {
  try {
    // Get all keys matching the organization pattern
    const patterns = [
      `auth:context:*:${organizationId}`,
      `member:data:*:${organizationId}`,
      `permissions:*:${organizationId}`,
    ];

    for (const pattern of patterns) {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    }
  } catch (error) {
    console.error('Error invalidating organization auth cache:', error);
  }
}

/**
 * Enforces required permissions for a route or action. Use this as a guard
 * at the beginning of any sensitive operation.
 * @param params - Object containing the organizationId.
 * @param permission - The required permission string (e.g., "product:delete").
 * @returns AuthContext if authorized.
 * @throws Error if the user is not authenticated, not a member, or lacks the required permission.
 */
/**
 * Enforces required permissions for a route or action.
 */
export async function requirePermission(
  params: { organizationId: string },
  permission: Permission
): Promise<AuthContext> {
  const context = await createAuthContext(params);

  if (!context) {
    throw new PermissionError(
      'Unauthorized: You must be logged in and a member of the organization to perform this action.'
    );
  }

  const banKey = getCacheKeys(context.memberId, params.organizationId).ban;
  const isBanned = await redisClient.get(banKey);

  if (isBanned) {
    throw new PermissionError('Access blocked: Your account is temporarily restricted due to too many failed authorization attempts.', CONFIG.MAX_FAILED_ATTEMPTS, true);
  }

  if (!context.hasPermission(permission)) {
    const failedAttemptsKey = getCacheKeys(context.memberId, params.organizationId, permission).failedAttempts;
    const attempts = await redisClient.incr(failedAttemptsKey);
    await redisClient.setex(failedAttemptsKey, CONFIG.FAILED_ATTEMPT_TTL, attempts);

    if (attempts >= CONFIG.MAX_FAILED_ATTEMPTS) {
      await redisClient.setex(banKey, CONFIG.BAN_TTL, 'banned');
      await prisma.user.update({ where: { id: context.userId }, data: { banned: true, banReason: 'Exceeded permission request limit.' } });
      throw new PermissionError(`Forbidden: You do not have the required permission: '${permission}'. You are now banned.`, attempts, true);
    }

    // Log the failed access attempt
    await prisma.auditLog.create({
      data: {
        organizationId: params.organizationId,
        memberId: context.memberId,
        action: 'ACCESS_DENIED',
        entityType: 'AUTH_CHECK',
        description: `Permission '${permission}' denied for member ${context.memberId} (Role: ${context.role}). Attempt ${attempts}/${CONFIG.MAX_FAILED_ATTEMPTS}.`,
        details: { requestedPermission: permission, heldPermissions: Array.from(context.permissions) },
      },
    });

    throw new PermissionError(`Forbidden: You do not have the required permission: '${permission}'`, attempts, false);
  }
    // If permission is granted, reset the attempt counter for that specific permission
    const failedAttemptsKey = getCacheKeys(context.memberId, params.organizationId, permission).failedAttempts;
    await redisClient.del(failedAttemptsKey);

  return context;
}

