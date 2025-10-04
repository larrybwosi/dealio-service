import { type NextRequest, NextResponse } from "next/server"

const users = [
  {
    id: "user-1",
    name: "Admin User",
    email: "admin@company.com",
    role: "Admin",
    department: "IT",
    permissions: ["all"],
    maxApprovalAmount: 100000,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-15T10:30:00Z",
  },
  {
    id: "user-2",
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    role: "Finance Manager",
    department: "Finance",
    permissions: ["approve_expenses", "manage_budgets", "view_reports", "manage_department"],
    maxApprovalAmount: 50000,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-15T09:15:00Z",
  },
  {
    id: "user-3",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "Department Head",
    department: "Operations",
    permissions: ["approve_department", "view_reports", "manage_department"],
    maxApprovalAmount: 25000,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-14T16:45:00Z",
  },
  {
    id: "user-4",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    role: "Team Lead",
    department: "Marketing",
    permissions: ["approve_team", "view_reports"],
    maxApprovalAmount: 10000,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-15T08:20:00Z",
  },
  {
    id: "user-5",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Employee",
    department: "Operations",
    permissions: ["submit_expenses", "view_own_expenses"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-15T11:00:00Z",
  },
  {
    id: "user-6",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "Manager",
    department: "HR",
    permissions: ["approve_expenses", "view_reports", "manage_department"],
    maxApprovalAmount: 15000,
    isActive: false,
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-10T14:30:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const department = searchParams.get("department")
    const status = searchParams.get("status")

    let filteredUsers = [...users]

    if (role && role !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.role === role)
    }
    if (department && department !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.department === department)
    }
    if (status && status !== "all") {
      const isActive = status === "active"
      filteredUsers = filteredUsers.filter((user) => user.isActive === isActive)
    }

    return NextResponse.json({
      data: filteredUsers,
      total: filteredUsers.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // In a real app, you would validate and save to database
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    }

    // Add to users array (in real app, save to database)
    users.push(newUser)

    return NextResponse.json({
      data: newUser,
      message: "User created successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
