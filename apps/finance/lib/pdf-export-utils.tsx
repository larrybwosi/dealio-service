import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, pdf } from "@react-pdf/renderer"
import type { ExpenseExportData } from "./export-utils"

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 5,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f3f4f6",
    borderRadius: 5,
  },
  summaryItem: {
    textAlign: "center",
  },
  summaryLabel: {
    fontSize: 8,
    color: "#6b7280",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: "#e5e7eb",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "12.5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    padding: 5,
  },
  tableCol: {
    width: "12.5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#e5e7eb",
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#374151",
  },
  tableCell: {
    fontSize: 8,
    color: "#1f2937",
  },
  statusApproved: {
    color: "#059669",
    fontWeight: "bold",
  },
  statusPending: {
    color: "#d97706",
    fontWeight: "bold",
  },
  statusRejected: {
    color: "#dc2626",
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    color: "#6b7280",
    fontSize: 8,
    borderTop: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
})

// PDF Document Component
export const ExpenseReportPDF = ({
  data,
  title = "Expense Report",
}: {
  data: ExpenseExportData[]
  title?: string
}) => {
  const totalAmount = data.reduce((sum, expense) => sum + expense.amount, 0)
  const approvedCount = data.filter((e) => e.status === "approved").length
  const pendingCount = data.filter((e) => e.status === "pending").length
  const rejectedCount = data.filter((e) => e.status === "rejected").length

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return styles.statusApproved
      case "pending":
        return styles.statusPending
      case "rejected":
        return styles.statusRejected
      default:
        return styles.tableCell
    }
  }

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>
          <Text style={styles.subtitle}>Total Records: {data.length}</Text>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TOTAL AMOUNT</Text>
            <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>APPROVED</Text>
            <Text style={styles.summaryValue}>{approvedCount}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>PENDING</Text>
            <Text style={styles.summaryValue}>{pendingCount}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>REJECTED</Text>
            <Text style={styles.summaryValue}>{rejectedCount}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>ID</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "25%" }]}>
              <Text style={styles.tableCellHeader}>Description</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Amount</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Category</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Status</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "15%" }]}>
              <Text style={styles.tableCellHeader}>Submitter</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Date</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Comments</Text>
            </View>
          </View>

          {/* Data Rows */}
          {data.slice(0, 25).map((expense, index) => (
            <View style={styles.tableRow} key={expense.id}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{expense.id}</Text>
              </View>
              <View style={[styles.tableCol, { width: "25%" }]}>
                <Text style={styles.tableCell}>
                  {expense.description.length > 30 ? `${expense.description.substring(0, 30)}...` : expense.description}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>${expense.amount.toFixed(2)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{expense.category}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell, getStatusStyle(expense.status)]}>{expense.status.toUpperCase()}</Text>
              </View>
              <View style={[styles.tableCol, { width: "15%" }]}>
                <Text style={styles.tableCell}>{expense.submitter}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{expense.date}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{expense.comments?.length || 0}</Text>
              </View>
            </View>
          ))}
        </View>

        {data.length > 25 && (
          <Text style={{ marginTop: 10, fontSize: 8, color: "#6b7280" }}>
            * Showing first 25 records. For complete data, please use Excel export.
          </Text>
        )}

        {/* Footer */}
        <Text style={styles.footer}>Expense Management System - Confidential Report</Text>
      </Page>
    </Document>
  )
}

export class PDFExportService {
  static async exportToPDF(data: ExpenseExportData[], filename = "expenses-report.pdf") {
    const doc = <ExpenseReportPDF data={data} />
    const blob = await pdf(doc).toBlob()

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    window.URL.revokeObjectURL(url)
  }

  static getPDFDownloadLink(data: ExpenseExportData[], filename = "expenses-report.pdf") {
    return (
      <PDFDownloadLink document={<ExpenseReportPDF data={data} />} fileName={filename}>
        {({ blob, url, loading, error }) => (loading ? "Generating PDF..." : "Download PDF")}
      </PDFDownloadLink>
    )
  }
}
