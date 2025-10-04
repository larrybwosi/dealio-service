import { type NextRequest, NextResponse } from "next/server"

// Dummy data for expenses (replace with your actual data source)
const expenses = [
  { id: "1", amount: 100, category: "Food", submitter: { id: "user1" }, status: "pending", comments: [] },
  { id: "2", amount: 200, category: "Travel", submitter: { id: "user2" }, status: "pending", comments: [] },
  { id: "3", amount: 50, category: "Food", submitter: { id: "user1" }, status: "approved", comments: [] },
  { id: "4", amount: 150, category: "Other", submitter: { id: "user3" }, status: "pending", comments: [] },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { expenseIds, comment, criteria } = body

    let targetExpenses = []

    if (expenseIds && expenseIds.length > 0) {
      // Approve specific expenses
      targetExpenses = expenses.filter((exp) => expenseIds.includes(exp.id))
    } else if (criteria) {
      // Approve based on criteria
      targetExpenses = expenses.filter((exp) => {
        if (criteria.maxAmount && exp.amount > criteria.maxAmount) return false
        if (criteria.category && exp.category !== criteria.category) return false
        if (criteria.submitterId && exp.submitter.id !== criteria.submitterId) return false
        if (exp.status !== "pending") return false
        return true
      })
    }

    // Update expenses
    const updatedExpenses = targetExpenses.map((expense) => {
      expense.status = "approved"
      expense.updatedAt = new Date().toISOString()

      if (comment) {
        expense.comments.push({
          id: Date.now().toString(),
          author: "Current User",
          authorRole: "Manager",
          message: comment,
          timestamp: new Date().toISOString(),
          type: "approval",
        })
      }

      return expense
    })

    return NextResponse.json({
      message: `${updatedExpenses.length} expenses approved`,
      updatedExpenses,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to bulk approve expenses" }, { status: 500 })
  }
}
