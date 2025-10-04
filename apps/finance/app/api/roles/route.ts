import { type NextRequest, NextResponse } from "next/server"

// Mock roles data
const roles = [
  {
    id: "role-1",
    name: "Admin",
    description: "Full system administrator with complete access to all features and settings",
    permissions: ["all"],
    hierarchy: 5,
    isActive: true,
    isCustom: false,
    userCount: 2,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "role-2",
    name: "Finance Manager",
    description: "Manages financial operations, budgets, and expense approvals",
    permissions: ["manage_budgets", "approve_all", "view_reports", "manage_department"],
    hierarchy: 4,
    isActive: true,
    isCustom: false,
    userCount: 3,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "role-3",
    name: "Department Head",
    description: "Leads department operations and manages team members",
    permissions: ["approve_department", "manage_department", "view_reports"],
    hierarchy: 4,
    isActive: true,
    isCustom: false,
    userCount: 5,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "role-4",
    name: "Manager",
    description: "Supervises team operations and approves team expenses",
    permissions: ["approve_team", "view_reports"],
    hierarchy: 3,
    isActive: true,
    isCustom: false,
    userCount: 8,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "role-5",
    name: "Team Lead",
    description: "Leads small teams and handles basic approvals",
    permissions: ["approve_team", "submit_expenses", "view_own_expenses"],
    hierarchy: 2,
    isActive: true,
    isCustom: false,
    userCount: 12,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "role-6",
    name: "Employee",
    description: "Standard employee with basic expense submission capabilities",
    permissions: ["submit_expenses", "view_own_expenses"],
    hierarchy: 1,
    isActive: true,
    isCustom: false,
    userCount: 45,
    createdAt: "2024-01-01T00:00:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const hierarchy = searchParams.get("hierarchy")

    let filteredRoles = [...roles]

    if (status && status !== "all") {
      const isActive = status === "active"
      filteredRoles = filteredRoles.filter((role) => role.isActive === isActive)
    }

    if (hierarchy) {
      filteredRoles = filteredRoles.filter((role) => role.hierarchy >= Number(hierarchy))
    }

    return NextResponse.json({
      data: filteredRoles,
      total: filteredRoles.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const roleData = await request.json()

    // In a real app, you would validate and save to database
    const newRole = {
      id: `role-${Date.now()}`,
      ...roleData,
      isCustom: true,
      userCount: 0,
      createdAt: new Date().toISOString(),
    }

    // Add to roles array (in real app, save to database)
    roles.push(newRole)

    return NextResponse.json({
      data: newRole,
      message: "Role created successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 })
  }
}
