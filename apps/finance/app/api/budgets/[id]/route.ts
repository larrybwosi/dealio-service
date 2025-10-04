import { type NextRequest, NextResponse } from "next/server"

// This would typically come from a database
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
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const budget = budgets.find((b) => b.id === params.id)

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 })
    }

    // Calculate additional metrics
    const usagePercentage = (budget.usedAmount / budget.totalAmount) * 100
    let budgetStatus = "healthy"

    if (usagePercentage >= 90) budgetStatus = "critical"
    else if (usagePercentage >= 75) budgetStatus = "warning"

    const enrichedBudget = {
      ...budget,
      usagePercentage: Math.round(usagePercentage),
      budgetStatus,
    }

    return NextResponse.json({
      data: enrichedBudget,
      message: "Budget retrieved successfully",
    })
  } catch (error) {
    console.error("Error fetching budget:", error)
    return NextResponse.json({ error: "Failed to fetch budget" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const budgetIndex = budgets.findIndex((b) => b.id === params.id)

    if (budgetIndex === -1) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 })
    }

    // Update budget
    const updatedBudget = {
      ...budgets[budgetIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    // Recalculate remaining amount if total or used amount changed
    if (body.totalAmount !== undefined || body.usedAmount !== undefined) {
      updatedBudget.remainingAmount = updatedBudget.totalAmount - updatedBudget.usedAmount
    }

    budgets[budgetIndex] = updatedBudget

    return NextResponse.json({
      data: updatedBudget,
      message: "Budget updated successfully",
    })
  } catch (error) {
    console.error("Error updating budget:", error)
    return NextResponse.json({ error: "Failed to update budget" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const budgetIndex = budgets.findIndex((b) => b.id === params.id)

    if (budgetIndex === -1) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 })
    }

    budgets.splice(budgetIndex, 1)

    return NextResponse.json({
      message: "Budget deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting budget:", error)
    return NextResponse.json({ error: "Failed to delete budget" }, { status: 500 })
  }
}
