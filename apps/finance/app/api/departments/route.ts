import { type NextRequest, NextResponse } from "next/server"

// Mock departments data
const departments = [
  {
    id: "dept-1",
    name: "Information Technology",
    code: "IT",
    description: "Manages technology infrastructure and software development",
    managerId: "user-1",
    budget: 500000,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    memberCount: 12,
  },
  {
    id: "dept-2",
    name: "Finance",
    code: "FIN",
    description: "Handles financial planning, budgeting, and expense management",
    managerId: "user-2",
    budget: 300000,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    memberCount: 8,
  },
  {
    id: "dept-3",
    name: "Operations",
    code: "OPS",
    description: "Oversees daily business operations and process optimization",
    managerId: "user-3",
    budget: 400000,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    memberCount: 15,
  },
  {
    id: "dept-4",
    name: "Marketing",
    code: "MKT",
    description: "Manages brand promotion, advertising, and customer engagement",
    managerId: "user-4",
    budget: 250000,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    memberCount: 6,
  },
  {
    id: "dept-5",
    name: "Human Resources",
    code: "HR",
    description: "Handles employee relations, recruitment, and organizational development",
    managerId: "user-6",
    budget: 200000,
    isActive: false,
    createdAt: "2024-01-01T00:00:00Z",
    memberCount: 4,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let filteredDepartments = [...departments]

    if (status && status !== "all") {
      const isActive = status === "active"
      filteredDepartments = filteredDepartments.filter((dept) => dept.isActive === isActive)
    }

    return NextResponse.json({
      data: filteredDepartments,
      total: filteredDepartments.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const departmentData = await request.json()

    // In a real app, you would validate and save to database
    const newDepartment = {
      id: `dept-${Date.now()}`,
      ...departmentData,
      createdAt: new Date().toISOString(),
      memberCount: 0,
    }

    // Add to departments array (in real app, save to database)
    departments.push(newDepartment)

    return NextResponse.json({
      data: newDepartment,
      message: "Department created successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create department" }, { status: 500 })
  }
}
