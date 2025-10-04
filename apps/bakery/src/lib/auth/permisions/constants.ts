export const PERMISSIONS = {
  // Organization Management
  ORGANIZATION_VIEW_SETTINGS: 'organization:view:settings',
  ORGANIZATION_UPDATE_SETTINGS: 'organization:update:settings',
  ORGANIZATION_VIEW_MEMBERS: 'organization:view:members',
  ORGANIZATION_MANAGE_CUSTOM_ROLES: 'organization:manage:custom_roles', // Create, Update, Delete custom roles
  ORGANIZATION_ASSIGN_CUSTOM_ROLES: 'organization:assign:custom_roles', // Assign custom roles to members
  ORGANIZATION_VIEW_AUDIT_LOGS: 'organization:view:audit_logs',

  // Member Management
  MEMBER_INVITE: 'member:invite',
  MEMBER_REMOVE: 'member:remove',
  MEMBER_UPDATE_ROLE: 'member:update:role', // Change MemberRole (e.g., Manager to Admin)
  MEMBER_VIEW_PROFILE: 'member:view:profile', // View any member's profile
  MEMBER_UPDATE_OWN_PROFILE: 'member:update:own:profile', // For the logged-in member

  // Product Management
  PRODUCT_CREATE: 'product:create',
  PRODUCT_READ_ALL: 'product:read:all', // View all products
  PRODUCT_READ_ASSIGNED: 'product:read:assigned', // View products in assigned locations (example)
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',
  PRODUCT_MANAGE_CATEGORIES: 'product:manage:categories',
  PRODUCT_MANAGE_STOCK: 'product:manage:stock', // Adjustments, movements
  PRODUCT_VIEW_STOCK_LEVELS: 'product:view:stock_levels',

  // Sales Management
  SALE_CREATE: 'sale:create',
  SALE_READ_ALL: 'sale:read:all', // View all sales
  SALE_READ_OWN: 'sale:read:own', // View sales made by oneself
  SALE_READ_LOCATION: 'sale:read:location', // View sales made at member's location(s)
  SALE_UPDATE: 'sale:update', // E.g., add notes, change payment status
  SALE_VOID: 'sale:void',
  SALE_PROCESS_RETURN: 'sale:process:return',

  // Purchase Management
  PURCHASE_CREATE: 'purchase:create',
  PURCHASE_READ_ALL: 'purchase:read:all',
  PURCHASE_UPDATE_STATUS: 'purchase:update:status',
  PURCHASE_APPROVE: 'purchase:approve', // If an approval flow exists

  // Customer Management
  CUSTOMER_CREATE: 'customer:create',
  CUSTOMER_READ_ALL: 'customer:read:all',
  CUSTOMER_UPDATE: 'customer:update',
  CUSTOMER_DELETE: 'customer:delete',
  CUSTOMER_MANAGE_LOYALTY: 'customer:manage:loyalty',

  // Inventory Location Management
  INVENTORY_LOCATION_CREATE: 'inventory_location:create',
  INVENTORY_LOCATION_READ_ALL: 'inventory_location:read:all',
  INVENTORY_LOCATION_UPDATE: 'inventory_location:update',
  INVENTORY_LOCATION_DELETE: 'inventory_location:delete',

  // Cash Drawer Management
  CASHDRAWER_OPEN: 'cashdrawer:open',
  CASHDRAWER_CLOSE: 'cashdrawer:close',
  CASHDRAWER_VIEW_ALL: 'cashdrawer:view:all', // View all drawer sessions
  CASHDRAWER_VIEW_OWN: 'cashdrawer:view:own', // View own drawer sessions

  // Reporting
  REPORT_VIEW_SALES: 'report:view:sales',
  REPORT_VIEW_INVENTORY: 'report:view:inventory',
  REPORT_VIEW_FINANCIAL: 'report:view:financial', // Broader financial reports

  // Expense Management
  EXPENSE_CREATE_OWN: 'expense:create:own',
  EXPENSE_CREATE_FOR_OTHERS: 'expense:create:for_others',
  EXPENSE_READ_OWN: 'expense:read:own',
  EXPENSE_READ_TEAM: 'expense:read:team', // Expenses submitted by team members
  EXPENSE_READ_ALL: 'expense:read:all',
  EXPENSE_APPROVE: 'expense:approve',
  EXPENSE_MANAGE_CATEGORIES: 'expense:manage:categories',
  EXPENSE_MANAGE_SETTINGS: 'expense:manage:settings', // Org level expense settings

  // Budget Management
  BUDGET_CREATE: 'budget:create',
  BUDGET_READ_ALL: 'budget:read:all',
  BUDGET_UPDATE: 'budget:update',
  BUDGET_DELETE: 'budget:delete',
  BUDGET_VIEW_REPORTS: 'budget:view:reports',

  // Attendance Management
  ATTENDANCE_CHECK_IN_OUT_OWN: 'attendance:check_in_out:own',
  ATTENDANCE_VIEW_OWN_LOGS: 'attendance:view:own:logs',
  ATTENDANCE_VIEW_TEAM_LOGS: 'attendance:view:team:logs', // Logs of direct reports or department
  ATTENDANCE_VIEW_ALL_LOGS: 'attendance:view:all:logs',
  ATTENDANCE_MANAGE_SETTINGS: 'attendance:manage:settings', // Org level attendance settings
  ATTENDANCE_MANUAL_ENTRY: 'attendance:manual:entry', // Manually add/edit attendance logs

  // Assistant (Chatbot/Automation) Management
  ASSISTANT_MANAGE_CONFIGURATION: 'assistant:manage:configuration',
  ASSISTANT_VIEW_LOGS: 'assistant:view:logs',
  ASSISTANT_INTERACT: 'assistant:interact',

  // Channel (Chat) Management
  CHANNEL_CREATE_PUBLIC: 'channel:create:public',
  CHANNEL_CREATE_PRIVATE: 'channel:create:private',
  CHANNEL_MANAGE_ANY: 'channel:manage:any', // Edit/delete any channel
  CHANNEL_ARCHIVE_ANY: 'channel:archive:any',
  CHANNEL_JOIN_PUBLIC: 'channel:join:public',
  CHANNEL_SEND_MESSAGES: 'channel:send:messages', // General permission to chat

  // Printer Settings Management
  PRINTER_SETTINGS_MANAGE: 'printer_settings:manage',

  // API Key Management (User level, but could be org-contextualized if needed)
  // USER_APIKEY_MANAGE_OWN: 'user:apikey:manage:own',

  // --- Add more permissions for every resource and action as needed ---
} as const; // 'as const' makes the values literal types for better type safety

export type PermissionString = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Helper to get all permission strings
export function getAllPermissionStrings(): PermissionString[] {
  return Object.values(PERMISSIONS);
}
