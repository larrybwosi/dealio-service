import prisma from '@/lib/db';
import { CustomRole } from '@/prisma/client';
import { AuthContext } from '../auth-context';

/**
 * Service for managing custom roles within an organization.
 * All functions require an authenticated context and appropriate permissions.
 */

/**
 * Creates a new custom role for an organization.
 * Requires 'role:manage' permission.
 * @param authContext - The authorization context of the user performing the action.
 * @param data - The data for the new role.
 * @returns The newly created CustomRole.
 */
export async function createCustomRole(
  authContext: AuthContext,
  data: { name: string; description?: string; permissions: string[] }
): Promise<CustomRole> {
  // Ensure the user has permission to manage roles before proceeding.
  if (!authContext.hasPermission('role:manage')) {
    throw new Error('Forbidden: Missing permission to manage roles.');
  }

  const { name, description, permissions } = data;

  const newRole = await prisma.customRole.create({
    data: {
      name,
      description: description ?? '', //
      permissions,
      organizationId: authContext.organizationId, //
    },
  });

  await prisma.auditLog.create({
    data: {
      organizationId: authContext.organizationId,
      memberId: authContext.memberId,
      action: 'CREATE',
      entityType: 'OTHER', // Consider adding a 'ROLE' entity type
      entityId: newRole.id, //
      description: `Created custom role: '${name}'`,
    },
  });

  return newRole;
}

/**
 * Assigns a custom role to a member of the organization.
 * Requires 'member:manage' permission.
 * @param authContext - The authorization context of the user performing the action.
 * @param data - The member and role IDs.
 */
export async function assignRoleToMember(
  authContext: AuthContext,
  data: { memberId: string; roleId: string }
): Promise<void> {
  if (!authContext.hasPermission('member:manage')) {
    throw new Error('Forbidden: Missing permission to manage members.');
  }

  // The `connect` operation in Prisma links the two records in the relation table.
  await prisma.member.update({
    where: {
      id: data.memberId,
      // Ensure the member belongs to the same organization for security.
      organizationId: authContext.organizationId,
    },
    data: {
      customRoles: {
        connect: { id: data.roleId },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      organizationId: authContext.organizationId,
      memberId: authContext.memberId,
      action: 'UPDATE',
      entityType: 'MEMBER',
      entityId: data.memberId,
      description: `Assigned role ${data.roleId} to member ${data.memberId}`,
    },
  });
}

/**
 * Revokes a custom role from a member of the organization.
 * Requires 'member:manage' permission.
 * @param authContext - The authorization context of the user performing the action.
 * @param data - The member and role IDs.
 */
export async function revokeRoleFromMember(
  authContext: AuthContext,
  data: { memberId: string; roleId: string }
): Promise<void> {
  if (!authContext.hasPermission('member:manage')) {
    throw new Error('Forbidden: Missing permission to manage members.');
  }

  // The `disconnect` operation removes the link in the relation table.
  await prisma.member.update({
    where: {
      id: data.memberId,
      organizationId: authContext.organizationId,
    },
    data: {
      customRoles: {
        disconnect: { id: data.roleId },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      organizationId: authContext.organizationId,
      memberId: authContext.memberId,
      action: 'UPDATE',
      entityType: 'MEMBER',
      entityId: data.memberId,
      description: `Revoked role ${data.roleId} from member ${data.memberId}`,
    },
  });
}
