export interface TaxRate {
  id: string
  name: string
  rate: number
  type: "sales" | "income" | "property" | "other"
  jurisdiction: string
  isActive: boolean
  effectiveDate: string
  expiryDate?: string
}

export interface TaxCalculation {
  subtotal: number
  taxBreakdown: {
    taxId: string
    taxName: string
    rate: number
    amount: number
    jurisdiction: string
  }[]
  totalTax: number
  grandTotal: number
}

export interface TaxSubmission {
  id: string
  period: string
  type: "quarterly" | "monthly" | "annual"
  status: "draft" | "submitted" | "approved" | "rejected"
  dueDate: string
  submittedDate?: string
  totalSales: number
  totalTax: number
  expenses: string[]
  attachments: string[]
  createdAt: string
  updatedAt: string
}

export class TaxCalculator {
  private static taxRates: TaxRate[] = [
    {
      id: "sales-tax-ny",
      name: "New York Sales Tax",
      rate: 8.25,
      type: "sales",
      jurisdiction: "New York",
      isActive: true,
      effectiveDate: "2024-01-01",
    },
    {
      id: "sales-tax-ca",
      name: "California Sales Tax",
      rate: 7.25,
      type: "sales",
      jurisdiction: "California",
      isActive: true,
      effectiveDate: "2024-01-01",
    },
    {
      id: "federal-income",
      name: "Federal Income Tax",
      rate: 21.0,
      type: "income",
      jurisdiction: "Federal",
      isActive: true,
      effectiveDate: "2024-01-01",
    },
    {
      id: "state-income-ny",
      name: "New York State Income Tax",
      rate: 6.33,
      type: "income",
      jurisdiction: "New York",
      isActive: true,
      effectiveDate: "2024-01-01",
    },
  ]

  static getTaxRates(type?: string, jurisdiction?: string): TaxRate[] {
    let rates = this.taxRates.filter((rate) => rate.isActive)

    if (type) {
      rates = rates.filter((rate) => rate.type === type)
    }

    if (jurisdiction) {
      rates = rates.filter((rate) => rate.jurisdiction === jurisdiction)
    }

    return rates
  }

  static calculateTax(amount: number, taxRates: TaxRate[], location?: string): TaxCalculation {
    const applicableRates = location
      ? taxRates.filter((rate) => rate.jurisdiction === location || rate.jurisdiction === "Federal")
      : taxRates

    const taxBreakdown = applicableRates.map((rate) => ({
      taxId: rate.id,
      taxName: rate.name,
      rate: rate.rate,
      amount: (amount * rate.rate) / 100,
      jurisdiction: rate.jurisdiction,
    }))

    const totalTax = taxBreakdown.reduce((sum, tax) => sum + tax.amount, 0)

    return {
      subtotal: amount,
      taxBreakdown,
      totalTax,
      grandTotal: amount + totalTax,
    }
  }

  static calculateQuarterlyTax(expenses: any[], quarter: number, year: number): TaxCalculation {
    const quarterStart = new Date(year, (quarter - 1) * 3, 1)
    const quarterEnd = new Date(year, quarter * 3, 0)

    const quarterlyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= quarterStart && expenseDate <= quarterEnd
    })

    const totalAmount = quarterlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const salesTaxRates = this.getTaxRates("sales")

    return this.calculateTax(totalAmount, salesTaxRates)
  }

  static getUpcomingDeadlines(): { type: string; dueDate: string; description: string }[] {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    const currentQuarter = Math.floor(currentMonth / 3) + 1

    const deadlines = []

    // Quarterly deadlines
    for (let q = currentQuarter; q <= 4; q++) {
      const dueDate = new Date(currentYear, q * 3, 15) // 15th of the month after quarter end
      if (dueDate > now) {
        deadlines.push({
          type: "quarterly",
          dueDate: dueDate.toISOString().split("T")[0],
          description: `Q${q} ${currentYear} Tax Filing`,
        })
      }
    }

    // Annual deadline
    const annualDue = new Date(currentYear + 1, 2, 15) // March 15th
    deadlines.push({
      type: "annual",
      dueDate: annualDue.toISOString().split("T")[0],
      description: `${currentYear} Annual Tax Return`,
    })

    return deadlines.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }
}
