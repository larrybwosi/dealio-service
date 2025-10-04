import { type NextRequest, NextResponse } from "next/server"
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer"

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#1f2937",
    fontWeight: "bold",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    color: "#374151",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
    color: "#4b5563",
    fontWeight: "bold",
  },
  text: {
    fontSize: 12,
    marginBottom: 6,
    color: "#6b7280",
    lineHeight: 1.5,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
})

// PDF Document Component
const ExpenseReportPDF = ({ reportData }: { reportData: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Expense Report</Text>

      <View style={styles.section}>
        <Text style={styles.title}>Executive Summary</Text>
        <Text style={styles.text}>
          This report provides a comprehensive analysis of expenses for the specified period. Total expenses analyzed:
          $45,230.50
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Key Metrics</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Category</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Amount</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Budget</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Variance</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Travel</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>$12,450</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>$15,000</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>-17%</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Office Supplies</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>$3,280</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>$3,000</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>+9%</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>AI Analysis</Text>
        <Text style={styles.text}>
          {reportData?.analysis || "AI analysis will be included here based on the generated insights."}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Recommendations</Text>
        <Text style={styles.text}>
          • Consider implementing stricter travel approval policies • Negotiate better rates with preferred vendors •
          Implement automated expense categorization • Review recurring subscriptions for optimization
        </Text>
      </View>
    </Page>
  </Document>
)

export async function GET(request: NextRequest, { params }: { params: { reportId: string } }) {
  try {
    const reportId = params.reportId

    // In a real implementation, you would:
    // 1. Fetch the report data from your database
    // 2. Generate the PDF with actual data
    // 3. Return the PDF as a download

    const reportData = {
      id: reportId,
      analysis: "This is a sample AI-generated analysis for the expense report.",
    }

    const pdfDoc = <ExpenseReportPDF reportData={reportData} />
    const pdfBuffer = await pdf(pdfDoc).toBuffer()

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="expense-report-${reportId}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
