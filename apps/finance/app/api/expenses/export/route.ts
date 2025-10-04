import { type NextRequest, NextResponse } from "next/server"

// Mock data - same as in expenses/route.ts
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
  // Add more mock data as needed
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "json"
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const submitterId = searchParams.get("submitterId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

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
    if (startDate) {
      filteredExpenses = filteredExpenses.filter((exp) => exp.date >= startDate)
    }
    if (endDate) {
      filteredExpenses = filteredExpenses.filter((exp) => exp.date <= endDate)
    }

    // Format data for export
    const exportData = filteredExpenses.map((expense) => ({
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      status: expense.status,
      submitter: expense.submitter.name,
      approver: expense.approver?.name || "N/A",
      date: expense.date,
      paymentMethod: expense.paymentMethod,
      location: expense.location,
      tags: expense.tags,
      comments: expense.comments,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    }))

    if (format === "csv") {
      // Generate CSV
      const csvHeaders = [
        "ID",
        "Description",
        "Amount",
        "Category",
        "Status",
        "Submitter",
        "Approver",
        "Date",
        "Payment Method",
        "Location",
        "Tags",
        "Comments Count",
        "Created At",
        "Updated At",
      ]

      const csvRows = exportData.map((expense) => [
        expense.id,
        `"${expense.description}"`,
        expense.amount,
        expense.category,
        expense.status,
        expense.submitter,
        expense.approver,
        expense.date,
        expense.paymentMethod || "N/A",
        expense.location || "N/A",
        `"${expense.tags?.join(", ") || "N/A"}"`,
        expense.comments?.length || 0,
        new Date(expense.createdAt).toLocaleDateString(),
        new Date(expense.updatedAt).toLocaleDateString(),
      ])

      const csvContent = [csvHeaders.join(","), ...csvRows.map((row) => row.join(","))].join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="expenses-export-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      })
    }

    // Return JSON data for Excel/PDF processing
    return NextResponse.json({
      data: exportData,
      summary: {
        totalExpenses: exportData.length,
        totalAmount: exportData.reduce((sum, exp) => sum + exp.amount, 0),
        approvedCount: exportData.filter((e) => e.status === "approved").length,
        pendingCount: exportData.filter((e) => e.status === "pending").length,
        rejectedCount: exportData.filter((e) => e.status === "rejected").length,
        exportedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to export expenses" }, { status: 500 })
  }
}
