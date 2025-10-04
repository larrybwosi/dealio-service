import * as XLSX from "exceljs"

export interface ExpenseExportData {
  id: string
  description: string
  amount: number
  category: string
  status: string
  submitter: string
  approver?: string
  date: string
  paymentMethod?: string
  location?: string
  tags?: string[]
  comments?: Array<{
    author: string
    message: string
    timestamp: string
    type: string
  }>
  createdAt: string
  updatedAt: string
}

export class ExportService {
  static async exportToExcel(data: ExpenseExportData[], filename = "expenses-export.xlsx") {
    const workbook = new XLSX.Workbook()

    // Set workbook properties
    workbook.creator = "Expense Management System"
    workbook.lastModifiedBy = "System"
    workbook.created = new Date()
    workbook.modified = new Date()

    // Create main expenses worksheet
    const worksheet = workbook.addWorksheet("Expenses", {
      pageSetup: { paperSize: 9, orientation: "landscape" },
    })

    // Define columns
    worksheet.columns = [
      { header: "Expense ID", key: "id", width: 12 },
      { header: "Description", key: "description", width: 30 },
      { header: "Amount", key: "amount", width: 12 },
      { header: "Category", key: "category", width: 15 },
      { header: "Status", key: "status", width: 12 },
      { header: "Submitter", key: "submitter", width: 20 },
      { header: "Approver", key: "approver", width: 20 },
      { header: "Date", key: "date", width: 12 },
      { header: "Payment Method", key: "paymentMethod", width: 15 },
      { header: "Location", key: "location", width: 20 },
      { header: "Tags", key: "tags", width: 20 },
      { header: "Comments Count", key: "commentsCount", width: 15 },
      { header: "Created At", key: "createdAt", width: 18 },
      { header: "Updated At", key: "updatedAt", width: 18 },
    ]

    // Style the header row
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: "FFFFFF" } }
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "366092" },
    }
    headerRow.alignment = { horizontal: "center", vertical: "middle" }
    headerRow.height = 25

    // Add data rows
    data.forEach((expense, index) => {
      const row = worksheet.addRow({
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        status: expense.status,
        submitter: expense.submitter,
        approver: expense.approver || "N/A",
        date: expense.date,
        paymentMethod: expense.paymentMethod || "N/A",
        location: expense.location || "N/A",
        tags: expense.tags?.join(", ") || "N/A",
        commentsCount: expense.comments?.length || 0,
        createdAt: new Date(expense.createdAt).toLocaleDateString(),
        updatedAt: new Date(expense.updatedAt).toLocaleDateString(),
      })

      // Alternate row colors
      if (index % 2 === 0) {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F8F9FA" },
        }
      }

      // Format amount column
      const amountCell = row.getCell("amount")
      amountCell.numFmt = "$#,##0.00"
      amountCell.alignment = { horizontal: "right" }

      // Color code status
      const statusCell = row.getCell("status")
      switch (expense.status.toLowerCase()) {
        case "approved":
          statusCell.font = { color: { argb: "22C55E" }, bold: true }
          break
        case "rejected":
          statusCell.font = { color: { argb: "EF4444" }, bold: true }
          break
        case "pending":
          statusCell.font = { color: { argb: "F59E0B" }, bold: true }
          break
      }
    })

    // Add borders to all cells
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        }
      })
    })

    // Create summary worksheet
    const summaryWorksheet = workbook.addWorksheet("Summary")

    // Calculate summary data
    const totalExpenses = data.length
    const totalAmount = data.reduce((sum, expense) => sum + expense.amount, 0)
    const approvedCount = data.filter((e) => e.status === "approved").length
    const pendingCount = data.filter((e) => e.status === "pending").length
    const rejectedCount = data.filter((e) => e.status === "rejected").length

    const categoryBreakdown = data.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        return acc
      },
      {} as Record<string, number>,
    )

    // Add summary data
    summaryWorksheet.addRow(["Expense Summary Report"])
    summaryWorksheet.addRow(["Generated on:", new Date().toLocaleDateString()])
    summaryWorksheet.addRow([])
    summaryWorksheet.addRow(["Total Expenses:", totalExpenses])
    summaryWorksheet.addRow(["Total Amount:", totalAmount])
    summaryWorksheet.addRow(["Approved:", approvedCount])
    summaryWorksheet.addRow(["Pending:", pendingCount])
    summaryWorksheet.addRow(["Rejected:", rejectedCount])
    summaryWorksheet.addRow([])
    summaryWorksheet.addRow(["Category Breakdown:"])

    Object.entries(categoryBreakdown).forEach(([category, amount]) => {
      summaryWorksheet.addRow([category, amount])
    })

    // Style summary worksheet
    summaryWorksheet.getCell("A1").font = { bold: true, size: 16 }
    summaryWorksheet.getColumn("A").width = 20
    summaryWorksheet.getColumn("B").width = 15

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // Create download
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    window.URL.revokeObjectURL(url)
  }

  static formatDataForExport(expenses: any[]): ExpenseExportData[] {
    return expenses.map((expense) => ({
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      status: expense.status,
      submitter: expense.submitter?.name || expense.submitter,
      approver: expense.approver?.name || expense.approver,
      date: expense.date,
      paymentMethod: expense.paymentMethod,
      location: expense.location,
      tags: expense.tags,
      comments: expense.comments,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    }))
  }
}
