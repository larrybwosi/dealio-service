import { type NextRequest, NextResponse } from "next/server"

// Mock users data (in real app, this would come from database)
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
  // ... other users
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = users.find((u) => u.id === params.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      data: user,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userData = await request.json()
    const userIndex = users.findIndex((u) => u.id === params.id)

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user (in real app, update in database)
    users[userIndex] = {
      ...users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      data: users[userIndex],
      message: "User updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userIndex = users.findIndex((u) => u.id === params.id)

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove user (in real app, delete from database)
    users.splice(userIndex, 1)

    return NextResponse.json({
      message: "User deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
