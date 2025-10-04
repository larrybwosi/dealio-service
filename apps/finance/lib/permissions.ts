// src/lib/permissions.ts

/**
 * Defines the permissions for built-in member roles and serves as the source of truth for all possible permissions.
 * Wildcards (*) can be used. For example, 'product:*' grants all actions for products.
 *
 * Format: resource:action[:scope]
 * - resource: The entity being acted upon (e.g., product, sale, member).
 * - action: The operation being performed (e.g., create, view, update, delete, approve).
 * - scope (optional): A qualifier for the action (e.g., 'own' for viewing one's own sales).
 */
export const PERMISSION_DEFINITIONS = {
  // Static roles assigned to members. These are built-in and cannot be deleted by organizations.
  memberRoles: {
    OWNER: [
      "organization:*", // Full control over the organization and all its resources
    ],
    ADMIN: [
      "product:*",
      "sale:*",
      "expense:*",
      "report:*",
      "inventory:*",
      "purchase:*",
      "customer:*",
      "supplier:*",
      "member:create",
      "member:view",
      "member:update",
      "member:deactivate",
      "invitation:create",
      "invitation:view",
      "invitation:delete",
      "organization:settings:view",
      "organization:settings:update",
      "role:view",
      "role:create",
      "role:update",
      "role:delete",
      "chat:manage",
      "audit:view",
    ],
    MANAGER: [
      "product:view",
      "product:create",
      "product:update",
      "sale:view",
      "sale:create",
      "sale:cancel",
      "expense:view",
      "expense:create",
      "expense:update",
      "expense:approve",
      "report:view",
      "inventory:view",
      "inventory:adjust",
      "purchase:view",
      "purchase:create",
      "purchase:update",
      "customer:view",
      "customer:create",
      "customer:update",
      "supplier:view",
      "supplier:create",
      "categories*",
    ],
    EMPLOYEE: [
      "product:view",
      "sale:view:own",
      "sale:create",
      "expense:view:own",
      "expense:create",
      "customer:view",
      "customer:create",
      "chat:view",
      "chat:create",
    ],
    CASHIER: [
      "sale:create",
      "sale:view:own",
      "customer:view",
      "customer:create",
    ],
    REPORTER: [
      "report:view",
      "sale:view",
      "product:view",
      "expense:view",
      "inventory:view",
    ],
    CUSTOMER: [
      // Permissions for a customer portal would go here
    ],
    GUEST: ["chat:view"],
  },

  // A comprehensive list of all available permissions, derived from the schema.
  // This can be used for building UIs for custom role creation.
  allPermissions: {
    organization: [
      "organization:settings:view",
      "organization:settings:update",
      "organization:billing:view",
      "organization:billing:manage",
      "organization:delete",
    ],
    product: [
      "product:view",
      "product:create",
      "product:update",
      "product:delete",
      "product:update:marketing",
    ],
    sale: [
      "sale:view",
      "sale:view:own",
      "sale:create",
      "sale:update",
      "sale:cancel",
      "sale:process_payment",
    ],
    expense: [
      "expense:view",
      "expense:view:own",
      "expense:create",
      "expense:update",
      "expense:delete",
      "expense:approve",
      "expense:reimburse",
    ],
    report: [
      "report:view",
      "report:view:financial",
      "report:create",
      "report:share",
    ],
    inventory: [
      "inventory:view",
      "inventory:adjust",
      "location:view",
      "location:create",
      "location:update",
      "location:delete",
    ],
    purchase: [
      "purchase:view",
      "purchase:create",
      "purchase:update",
      "purchase:delete",
      "purchase:receive",
    ],
    member: [
      "member:view",
      "member:create",
      "member:update",
      "member:deactivate",
      "member:delete",
    ],
    invitation: ["invitation:view", "invitation:create", "invitation:delete"],
    customer: [
      "customer:view",
      "customer:create",
      "customer:update",
      "customer:delete",
    ],
    supplier: [
      "supplier:view",
      "supplier:create",
      "supplier:update",
      "supplier:delete",
    ],
    return: ["return:view", "return:create", "return:process"],
    attendance: ["attendance:view", "attendance:manage", "attendance:log"],
    audit: ["audit:view"],
    chat: ["chat:view", "chat:create", "chat:manage", "chat:delete"],
    role: ["role:view", "role:create", "role:update", "role:delete"],
    tax: ["tax:view", "tax:create", "tax:update", "tax:delete"],
    department: [
      "department:view",
      "department:create",
      "department:update",
      "department:delete",
    ],
    budget: ["budget:view", "budget:create", "budget:update", "budget:delete"],
    account: [
      "account:view",
      "account:create",
      "account:update",
      "account:delete",
    ],
    journal: [
      "journal:view",
      "journal:create",
      "journal:post",
      "journal:delete",
    ],
    fiscal_period: ["fiscal_period:view", "fiscal_period:manage"],
  },
} as const; // 'as const' provides strong typing for role names and permissions

// Type helper for extracting permission strings from memberRoles
export type Permission =
  (typeof PERMISSION_DEFINITIONS.memberRoles)[keyof typeof PERMISSION_DEFINITIONS.memberRoles][number];

// Type helper for extracting all possible permission strings
export type AnyPermission =
  (typeof PERMISSION_DEFINITIONS.allPermissions)[keyof typeof PERMISSION_DEFINITIONS.allPermissions][number];

/**
 * Checks if a member's roles grant them a specific permission.
 * @param memberPermissions - An array of permissions the member has.
 * @param requiredPermission - The permission to check for.
 * @returns True if the member has the permission, false otherwise.
 */
export function hasPermission(
  memberPermissions: readonly string[],
  requiredPermission: string
): boolean {
  if (memberPermissions.includes(requiredPermission)) {
    return true;
  }

  // Check for wildcards
  const requiredParts = requiredPermission.split(":");
  for (const permission of memberPermissions) {
    if (permission.endsWith("*")) {
      const wildcardParts = permission.split(":");
      // e.g., 'product:*' should match 'product:create'
      if (requiredParts[0] === wildcardParts[0]) {
        return true;
      }
    }
  }

  return false;
}
