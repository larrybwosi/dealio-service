import { type NextRequest, NextResponse } from "next/server"

// Mock departments data (in real app, this would come from database)
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
  // ... other departments
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const department = departments.find((d) => d.id === params.id)

    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 })
    }

    return NextResponse.json({
      data: department,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch department" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const departmentData = await request.json()
    const departmentIndex = departments.findIndex((d) => d.id === params.id)

    if (departmentIndex === -1) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 })
    }

    // Update department (in real app, update in database)
    departments[departmentIndex] = {
      ...departments[departmentIndex],
      ...departmentData,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      data: departments[departmentIndex],
      message: "Department updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update department" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const departmentIndex = departments.findIndex((d) => d.id === params.id)

    if (departmentIndex === -1) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 })
    }

    // Remove department (in real app, delete from database)
    departments.splice(departmentIndex, 1)

    return NextResponse.json({
      message: "Department deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete department" }, { status: 500 })
  }
}
