import { type NextRequest, NextResponse } from "next/server"

// Mock data - in a real app, this would come from a database
const budgets = [
  {
    id: "BUD-001",
    name: "Office Supplies Budget",
    description: "Budget for office supplies and stationery",
    totalAmount: 5000,
    usedAmount: 2400,
    remainingAmount: 2600,
    period: "Q1 2024",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    categories: [
      { id: "cat-1", name: "Office Supplies", allocated: 3000, used: 1800 },
      { id: "cat-2", name: "Stationery", allocated: 2000, used: 600 },
    ],
    alerts: [
      { threshold: 75, enabled: true, triggered: false },
      { threshold: 90, enabled: true, triggered: false },
    ],
    department: "Operations",
    location: "all",
    status: "active",
    settings: {
      autoRollover: false,
      enableAlerts: true,
      allowOverruns: false,
    },
    createdBy: "user-1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "BUD-002",
    name: "Travel & Transportation",
    description: "Budget for business travel and transportation expenses",
    totalAmount: 12000,
    usedAmount: 8500,
    remainingAmount: 3500,
    period: "Q1 2024",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    categories: [
      { id: "cat-3", name: "Flights", allocated: 8000, used: 5500 },
      { id: "cat-4", name: "Hotels", allocated: 3000, used: 2000 },
      { id: "cat-5", name: "Ground Transport", allocated: 1000, used: 1000 },
    ],
    alerts: [
      { threshold: 75, enabled: true, triggered: true },
      { threshold: 90, enabled: true, triggered: false },
    ],
    department: "Sales",
    location: "all",
    status: "active",
    settings: {
      autoRollover: true,
      enableAlerts: true,
      allowOverruns: false,
    },
    createdBy: "user-2",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-02-10T14:20:00Z",
  },
  {
    id: "BUD-003",
    name: "Software & Subscriptions",
    description: "Budget for software licenses and subscription services",
    totalAmount: 4000,
    usedAmount: 3200,
    remainingAmount: 800,
    period: "Q1 2024",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    categories: [
      { id: "cat-6", name: "Software Licenses", allocated: 2500, used: 2000 },
      { id: "cat-7", name: "SaaS Subscriptions", allocated: 1500, used: 1200 },
    ],
    alerts: [
      { threshold: 75, enabled: true, triggered: true },
      { threshold: 90, enabled: true, triggered: false },
    ],
    department: "IT",
    location: "all",
    status: "active",
    settings: {
      autoRollover: false,
      enableAlerts: true,
      allowOverruns: true,
    },
    createdBy: "user-3",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-02-05T09:15:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get("department")
    const status = searchParams.get("status")
    const period = searchParams.get("period")

    let filteredBudgets = [...budgets]

    if (department && department !== "all") {
      filteredBudgets = filteredBudgets.filter((budget) => budget.department === department)
    }
    if (status && status !== "all") {
      filteredBudgets = filteredBudgets.filter((budget) => budget.status === status)
    }
    if (period && period !== "all") {
      filteredBudgets = filteredBudgets.filter((budget) => budget.period === period)
    }

    // Calculate usage percentages and status
    const enrichedBudgets = filteredBudgets.map((budget) => {
      const usagePercentage = (budget.usedAmount / budget.totalAmount) * 100
      let budgetStatus = "healthy"

      if (usagePercentage >= 90) budgetStatus = "critical"
      else if (usagePercentage >= 75) budgetStatus = "warning"

      return {
        ...budget,
        usagePercentage: Math.round(usagePercentage),
        budgetStatus,
      }
    })

    return NextResponse.json({
      data: enrichedBudgets,
      total: enrichedBudgets.length,
      message: "Budgets retrieved successfully",
    })
  } catch (error) {
    console.error("Error fetching budgets:", error)
    return NextResponse.json({ error: "Failed to fetch budgets", message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "totalAmount", "startDate", "endDate", "department"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Calculate total from categories if provided
    let totalAmount = body.totalAmount
    if (body.categories && body.categories.length > 0) {
      totalAmount = body.categories.reduce((sum: number, cat: any) => sum + (cat.allocated || 0), 0)
    }

    const newBudget = {
      id: `BUD-${String(budgets.length + 1).padStart(3, "0")}`,
      name: body.name,
      description: body.description || "",
      totalAmount,
      usedAmount: 0,
      remainingAmount: totalAmount,
      period: body.period || "Q1 2024",
      startDate: body.startDate,
      endDate: body.endDate,
      categories: body.categories || [],
      alerts: body.alerts || [
        { threshold: 75, enabled: true, triggered: false },
        { threshold: 90, enabled: true, triggered: false },
      ],
      department: body.department,
      location: body.location || "all",
      status: "active",
      settings: {
        autoRollover: body.autoRollover || false,
        enableAlerts: body.enableAlerts !== false,
        allowOverruns: body.allowOverruns || false,
      },
      createdBy: "current-user", // In real app, get from auth
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    budgets.push(newBudget)

    return NextResponse.json(
      {
        data: newBudget,
        message: "Budget created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating budget:", error)
    return NextResponse.json({ error: "Failed to create budget", message: "Internal server error" }, { status: 500 })
  }
}
