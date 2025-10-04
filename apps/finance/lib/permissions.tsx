"use client"

import type React from "react"

export interface Permission {
  id: string
  label: string
  description: string
  category: string
  level: "critical" | "high" | "medium" | "low"
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  hierarchy: number
  isActive: boolean
  isCustom?: boolean
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  permissions: string[]
  department: string
  isActive: boolean
}

// Permission checking utilities
export class PermissionManager {
  static hasPermission(user: User, permission: string): boolean {
    if (!user || !user.permissions) return false

    // Admin users with 'all' permission have access to everything
    if (user.permissions.includes("all")) return true

    // Check if user has the specific permission
    return user.permissions.includes(permission)
  }

  static hasAnyPermission(user: User, permissions: string[]): boolean {
    if (!user || !user.permissions) return false

    // Admin users with 'all' permission have access to everything
    if (user.permissions.includes("all")) return true

    // Check if user has any of the specified permissions
    return permissions.some((permission) => user.permissions.includes(permission))
  }

  static hasAllPermissions(user: User, permissions: string[]): boolean {
    if (!user || !user.permissions) return false

    // Admin users with 'all' permission have access to everything
    if (user.permissions.includes("all")) return true

    // Check if user has all of the specified permissions
    return permissions.every((permission) => user.permissions.includes(permission))
  }

  static canApproveAmount(user: User, amount: number): boolean {
    if (!user) return false

    // Admin users can approve any amount
    if (user.permissions.includes("all") || user.permissions.includes("approve_all")) {
      return true
    }

    // Check against user's approval limit
    const maxApprovalAmount = (user as any).maxApprovalAmount || 0
    return amount <= maxApprovalAmount
  }

  static canManageDepartment(user: User, department: string): boolean {
    if (!user) return false

    // Admin users can manage any department
    if (user.permissions.includes("all")) return true

    // Users with manage_department permission can manage their own department
    if (user.permissions.includes("manage_department") && user.department === department) {
      return true
    }

    return false
  }

  static getAccessibleDepartments(user: User, allDepartments: string[]): string[] {
    if (!user) return []

    // Admin users can access all departments
    if (user.permissions.includes("all")) return allDepartments

    // Users can access their own department
    const accessibleDepts = [user.department]

    // Users with manage_department can access their department
    if (user.permissions.includes("manage_department")) {
      return accessibleDepts
    }

    return accessibleDepts
  }

  static getRoleHierarchy(role: string): number {
    const hierarchyMap: Record<string, number> = {
      Admin: 5,
      "Finance Manager": 4,
      "Department Head": 4,
      Manager: 3,
      "Team Lead": 2,
      Employee: 1,
    }
    return hierarchyMap[role] || 1
  }

  static canManageUser(currentUser: User, targetUser: User): boolean {
    if (!currentUser || !targetUser) return false

    // Admin users can manage anyone
    if (currentUser.permissions.includes("all")) return true

    // Users with manage_users permission can manage users in lower hierarchy
    if (currentUser.permissions.includes("manage_users")) {
      const currentHierarchy = this.getRoleHierarchy(currentUser.role)
      const targetHierarchy = this.getRoleHierarchy(targetUser.role)
      return currentHierarchy > targetHierarchy
    }

    return false
  }

  static filterByPermissions<T extends { permissions?: string[] }>(
    items: T[],
    user: User,
    requiredPermission: string,
  ): T[] {
    if (!user) return []

    // Admin users can see everything
    if (user.permissions.includes("all")) return items

    // Filter based on permission
    if (!user.permissions.includes(requiredPermission)) return []

    return items
  }
}

// Permission constants
export const PERMISSIONS = {
  // System Administration
  ALL: "all",
  SYSTEM_SETTINGS: "system_settings",
  MANAGE_USERS: "manage_users",
  MANAGE_ROLES: "manage_roles",

  // Department Management
  MANAGE_DEPARTMENT: "manage_department",
  MANAGE_BUDGETS: "manage_budgets",
  VIEW_REPORTS: "view_reports",

  // Expense Management
  SUBMIT_EXPENSES: "submit_expenses",
  VIEW_OWN_EXPENSES: "view_own_expenses",
  APPROVE_EXPENSES: "approve_expenses",
  APPROVE_ALL: "approve_all",
  APPROVE_DEPARTMENT: "approve_department",
  APPROVE_TEAM: "approve_team",
} as const

// Role-based component wrapper
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions: string | string[],
  fallback?: React.ComponentType<P>,
) {
  return function PermissionWrapper(props: P) {
    // This would be implemented with useAuth hook
    // const { user } = useAuth()
    // const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions]
    // const hasAccess = PermissionManager.hasAnyPermission(user, permissions)

    // if (!hasAccess) {
    //   return fallback ? <fallback {...props} /> : null
    // }

    return <Component {...props} />
  }
}
