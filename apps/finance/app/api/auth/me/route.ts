import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

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
  },
  {
    id: "user-2",
    name: "Finance Manager",
    email: "manager@company.com",
    role: "Manager",
    department: "Finance",
    permissions: ["approve_expenses", "manage_budgets", "view_reports", "manage_department"],
    maxApprovalAmount: 50000,
    isActive: true,
  },
  {
    id: "user-3",
    name: "John Employee",
    email: "employee@company.com",
    role: "Employee",
    department: "Operations",
    permissions: ["submit_expenses", "view_own_expenses"],
    isActive: true,
  },
]

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      const user = users.find((u) => u.id === decoded.userId)

      if (!user || !user.isActive) {
        return NextResponse.json({ error: "User not found or inactive" }, { status: 401 })
      }

      return NextResponse.json({
        data: user,
      })
    } catch (jwtError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
