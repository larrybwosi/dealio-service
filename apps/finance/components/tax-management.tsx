"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card"
import { Button } from "@repo/ui/button"
import { Label } from "@repo/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select"
import { Badge } from "@repo/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog"
import {
  Calculator,
  FileText,
  Calendar,
  DollarSign,
  AlertTriangle,
  Download,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Building,
  Receipt,
} from "lucide-react"
import { TaxCalculator, type TaxCalculation, type TaxSubmission } from "@/lib/tax-utils"
import { useExpenses } from "@/hooks/use-expenses"
import { toast } from "sonner"

export function TaxManagement() {
  const [selectedPeriod, setSelectedPeriod] = useState("Q4-2024")
  const [selectedLocation, setSelectedLocation] = useState("New York")
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculation | null>(null)
  const [submissions, setSubmissions] = useState<TaxSubmission[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false)

  const { data: expensesData } = useExpenses()
  const expenses = expensesData?.data || []

  // Mock tax submissions data
  useEffect(() => {
    setSubmissions([
      {
        id: "TAX-001",
        period: "Q3-2024",
        type: "quarterly",
        status: "submitted",
        dueDate: "2024-10-15",
        submittedDate: "2024-10-12",
        totalSales: 125000,
        totalTax: 10312.5,
        expenses: ["EXP-001", "EXP-002"],
        attachments: ["tax-form-q3.pdf"],
        createdAt: "2024-10-12T10:00:00Z",
        updatedAt: "2024-10-12T10:00:00Z",
      },
      {
        id: "TAX-002",
        period: "Q2-2024",
        type: "quarterly",
        status: "approved",
        dueDate: "2024-07-15",
        submittedDate: "2024-07-10",
        totalSales: 98000,
        totalTax: 8085.0,
        expenses: ["EXP-003", "EXP-004"],
        attachments: ["tax-form-q2.pdf"],
        createdAt: "2024-07-10T10:00:00Z",
        updatedAt: "2024-07-15T14:30:00Z",
      },
    ])
  }, [])

  const calculateTax = async () => {
    setIsCalculating(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const [quarter, year] = selectedPeriod.split("-")
      const quarterNum = Number.parseInt(quarter.replace("Q", ""))
      const yearNum = Number.parseInt(year)

      const calculation = TaxCalculator.calculateQuarterlyTax(expenses, quarterNum, yearNum)
      setTaxCalculation(calculation)
      toast.success("Tax calculation completed")
    } catch (error) {
      toast.error("Failed to calculate tax")
    } finally {
      setIsCalculating(false)
    }
  }

  const submitTaxReturn = async () => {
    if (!taxCalculation) return

    try {
      const newSubmission: TaxSubmission = {
        id: `TAX-${String(submissions.length + 1).padStart(3, "0")}`,
        period: selectedPeriod,
        type: "quarterly",
        status: "submitted",
        dueDate: getNextDueDate(),
        submittedDate: new Date().toISOString().split("T")[0],
        totalSales: taxCalculation.subtotal,
        totalTax: taxCalculation.totalTax,
        expenses: expenses.map((e) => e.id),
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setSubmissions([newSubmission, ...submissions])
      setShowSubmissionDialog(false)
      toast.success("Tax return submitted successfully")
    } catch (error) {
      toast.error("Failed to submit tax return")
    }
  }

  const getNextDueDate = () => {
    const [quarter, year] = selectedPeriod.split("-")
    const quarterNum = Number.parseInt(quarter.replace("Q", ""))
    const yearNum = Number.parseInt(year)
    const dueMonth = quarterNum * 3 + 1 // Month after quarter end
    return new Date(yearNum, dueMonth - 1, 15).toISOString().split("T")[0]
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      case "submitted":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Clock className="w-3 h-3 mr-1" />
            Submitted
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <FileText className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        )
    }
  }

  const upcomingDeadlines = TaxCalculator.getUpcomingDeadlines()
  const totalTaxLiability = submissions.reduce((sum, sub) => sum + sub.totalTax, 0)
  const pendingSubmissions = submissions.filter((sub) => sub.status === "submitted").length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Tax Management</h1>
          <p className="text-gray-600">Calculate, track, and submit tax returns</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
          <Button>
            <Calculator className="w-4 h-4 mr-2" />
            New Calculation
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tax Liability</p>
                <p className="text-2xl font-bold">${totalTaxLiability.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Submissions</p>
                <p className="text-2xl font-bold">{pendingSubmissions}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next Deadline</p>
                <p className="text-lg font-semibold">
                  {upcomingDeadlines[0]?.dueDate ? new Date(upcomingDeadlines[0].dueDate).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold">98%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calculator" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calculator">Tax Calculator</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calculator Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Tax Calculator
                </CardTitle>
                <CardDescription>Calculate taxes for a specific period and location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tax Period</Label>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Q1-2024">Q1 2024</SelectItem>
                        <SelectItem value="Q2-2024">Q2 2024</SelectItem>
                        <SelectItem value="Q3-2024">Q3 2024</SelectItem>
                        <SelectItem value="Q4-2024">Q4 2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New York">New York</SelectItem>
                        <SelectItem value="California">California</SelectItem>
                        <SelectItem value="Federal">Federal Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={calculateTax} disabled={isCalculating} className="w-full">
                  {isCalculating ? (
                    <>
                      <Calculator className="w-4 h-4 mr-2 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Tax
                    </>
                  )}
                </Button>

                {taxCalculation && (
                  <div className="space-y-4 mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold">Tax Calculation Results</h3>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">${taxCalculation.subtotal.toLocaleString()}</span>
                      </div>

                      {taxCalculation.taxBreakdown.map((tax, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {tax.taxName} ({tax.rate}%):
                          </span>
                          <span>${tax.amount.toLocaleString()}</span>
                        </div>
                      ))}

                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total Tax:</span>
                        <span>${taxCalculation.totalTax.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between text-lg font-bold">
                        <span>Grand Total:</span>
                        <span>${taxCalculation.grandTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
                      <DialogTrigger asChild>
                        <Button className="w-full mt-4">
                          <Send className="w-4 h-4 mr-2" />
                          Submit Tax Return
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Submit Tax Return</DialogTitle>
                          <DialogDescription>Review and submit your tax return for {selectedPeriod}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-2">Summary</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Period:</span>
                                <span>{selectedPeriod}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Location:</span>
                                <span>{selectedLocation}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Total Tax:</span>
                                <span className="font-medium">${taxCalculation.totalTax.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Due Date:</span>
                                <span>{getNextDueDate()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setShowSubmissionDialog(false)} className="flex-1">
                              Cancel
                            </Button>
                            <Button onClick={submitTaxReturn} className="flex-1">
                              Submit Return
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tax Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current Tax Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {TaxCalculator.getTaxRates().map((rate) => (
                    <div key={rate.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium">{rate.name}</p>
                        <p className="text-xs text-gray-600">{rate.jurisdiction}</p>
                      </div>
                      <Badge variant="outline">{rate.rate}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Submissions</CardTitle>
              <CardDescription>Track all your tax return submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Tax Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.period}</TableCell>
                      <TableCell className="capitalize">{submission.type}</TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell>{new Date(submission.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {submission.submittedDate ? new Date(submission.submittedDate).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>${submission.totalTax.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deadlines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Stay on top of your tax filing deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline, index) => {
                  const daysUntil = Math.ceil(
                    (new Date(deadline.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                  )
                  const isUrgent = daysUntil <= 7

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${isUrgent ? "border-red-200 bg-red-50" : "border-gray-200"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{deadline.description}</h3>
                          <p className="text-sm text-gray-600">
                            Due: {new Date(deadline.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={isUrgent ? "destructive" : "secondary"}>{daysUntil} days</Badge>
                          {isUrgent && (
                            <div className="flex items-center mt-1 text-red-600">
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              <span className="text-xs">Urgent</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Reports</CardTitle>
              <CardDescription>Generate and download tax reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <Receipt className="w-6 h-6 mb-2" />
                  <span>Quarterly Summary</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <FileText className="w-6 h-6 mb-2" />
                  <span>Annual Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <Building className="w-6 h-6 mb-2" />
                  <span>By Location</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <TrendingUp className="w-6 h-6 mb-2" />
                  <span>Tax Trends</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
