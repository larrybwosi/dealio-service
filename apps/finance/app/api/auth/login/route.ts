import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock user database
const users = [
  {
    id: "user-1",
    name: "Admin User",
    email: "admin@company.com",
    password: "admin123", // In real app, this would be hashed
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
    password: "manager123",
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
    password: "employee123",
    role: "Employee",
    department: "Operations",
    permissions: ["submit_expenses", "view_own_expenses"],
    isActive: true,
  },
]

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (!user.isActive) {
      return NextResponse.json({ error: "Account is deactivated" }, { status: 403 })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        department: user.department,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      data: {
        token,
        user: userWithoutPassword,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
