import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, this would be a real database
const expenses = [
  {
    id: "EXP-001",
    description: "Office Supplies - Stationery and Paper",
    amount: 245.0,
    category: "Office Supplies",
    date: "2024-01-15",
    status: "approved",
    submitter: {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@company.com",
      role: "Employee",
    },
    approver: {
      id: "user-2",
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      role: "Manager",
    },
    paymentMethod: "Company Card",
    location: "New York Office",
    tags: ["office", "supplies"],
    attachments: ["receipt-001.pdf"],
    comments: [
      {
        id: "1",
        author: "Sarah Wilson",
        authorRole: "Finance Manager",
        message: "Approved - necessary office supplies for Q1",
        timestamp: "2024-01-15T10:30:00Z",
        type: "approval",
      },
    ],
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "EXP-002",
    description: "Client Lunch Meeting - Q1 Planning",
    amount: 89.5,
    category: "Meals",
    date: "2024-01-14",
    status: "pending",
    submitter: {
      id: "user-3",
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      role: "Manager",
    },
    approver: {
      id: "user-4",
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      role: "Director",
    },
    paymentMethod: "Credit Card",
    location: "Downtown Restaurant",
    tags: ["client", "meeting"],
    attachments: ["receipt-002.pdf"],
    comments: [],
    createdAt: "2024-01-14T12:00:00Z",
    updatedAt: "2024-01-14T12:00:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const submitterId = searchParams.get("submitterId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let filteredExpenses = [...expenses]

    // Apply filters
    if (status && status !== "all") {
      filteredExpenses = filteredExpenses.filter((exp) => exp.status === status)
    }
    if (category && category !== "all") {
      filteredExpenses = filteredExpenses.filter((exp) => exp.category === category)
    }
    if (submitterId) {
      filteredExpenses = filteredExpenses.filter((exp) => exp.submitter.id === submitterId)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedExpenses = filteredExpenses.slice(startIndex, endIndex)

    return NextResponse.json({
      data: paginatedExpenses,
      pagination: {
        page,
        limit,
        total: filteredExpenses.length,
        totalPages: Math.ceil(filteredExpenses.length / limit),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newExpense = {
      id: `EXP-${String(expenses.length + 1).padStart(3, "0")}`,
      ...body,
      status: "pending",
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    expenses.push(newExpense)

    return NextResponse.json(newExpense, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 })
  }
}
