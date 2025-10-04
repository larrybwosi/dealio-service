import { type NextRequest, NextResponse } from "next/server"

const delegations = [
  {
    id: "DEL-001",
    delegator: {
      id: "user-2",
      name: "Sarah Wilson",
      role: "Manager",
    },
    delegate: {
      id: "user-3",
      name: "Mike Johnson",
      role: "Senior Employee",
    },
    startDate: "2024-01-20T00:00:00Z",
    endDate: "2024-01-27T23:59:59Z",
    maxAmount: 1000,
    categories: ["Office Supplies", "Software"],
    isActive: true,
    reason: "Vacation coverage",
    createdAt: "2024-01-19T10:00:00Z",
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      data: delegations,
      total: delegations.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch delegations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newDelegation = {
      id: `DEL-${String(delegations.length + 1).padStart(3, "0")}`,
      ...body,
      isActive: true,
      createdAt: new Date().toISOString(),
    }

    delegations.push(newDelegation)

    return NextResponse.json(newDelegation, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create delegation" }, { status: 500 })
  }
}
