"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { Calendar } from "@workspace/ui/components/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Progress } from "@workspace/ui/components/progress"
import { Separator } from "@workspace/ui/components/separator"
import {
  FileText,
  Download,
  CalendarIcon,
  TrendingUp,
  DollarSign,
  PieChart,
  Zap,
  Loader2,
  Eye,
  Share2,
  Filter,
  Search,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { format } from "date-fns"

interface Report {
  id: string
  title: string
  type: string
  description: string
  createdAt: string
  status: "generating" | "completed" | "failed"
  size: string
  downloadUrl?: string
  aiGenerated?: boolean
}

export function ReportsDashboard() {
  const [selectedDateRange, setSelectedDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      title: "Monthly Expense Summary - January 2024",
      type: "expense-summary",
      description: "Comprehensive overview of all expenses for January 2024",
      createdAt: "2024-01-31T10:30:00Z",
      status: "completed",
      size: "2.4 MB",
      downloadUrl: "/reports/monthly-jan-2024.pdf",
    },
    {
      id: "2",
      title: "Budget vs Actual Analysis Q1 2024",
      type: "budget-analysis",
      description: "AI-generated analysis comparing budgeted vs actual expenses",
      createdAt: "2024-01-30T14:15:00Z",
      status: "completed",
      size: "1.8 MB",
      downloadUrl: "/reports/budget-analysis-q1.pdf",
      aiGenerated: true,
    },
    {
      id: "3",
      title: "Approval Workflow Performance Report",
      type: "workflow-analysis",
      description: "Analysis of approval times and bottlenecks",
      createdAt: "2024-01-29T09:45:00Z",
      status: "generating",
      size: "Calculating...",
      aiGenerated: true,
    },
  ])
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [selectedReportType, setSelectedReportType] = useState("expense-summary")

  const reportTypes = [
    {
      id: "expense-summary",
      name: "Expense Summary",
      description: "Detailed breakdown of expenses by category, department, and time period",
      icon: DollarSign,
    },
    {
      id: "budget-analysis",
      name: "Budget Analysis",
      description: "Compare actual spending against budgets with variance analysis",
      icon: PieChart,
    },
    {
      id: "approval-metrics",
      name: "Approval Metrics",
      description: "Performance metrics for approval workflows and processing times",
      icon: CheckCircle,
    },
    {
      id: "trend-analysis",
      name: "Trend Analysis",
      description: "Spending trends and patterns over time with forecasting",
      icon: TrendingUp,
    },
    {
      id: "compliance-report",
      name: "Compliance Report",
      description: "Policy compliance and audit trail documentation",
      icon: AlertTriangle,
    },
    {
      id: "custom-ai",
      name: "Custom AI Report",
      description: "AI-generated report based on your specific requirements",
      icon: Zap,
    },
  ]

  const generateReport = async () => {
    setIsGenerating(true)

    const newReport: Report = {
      id: Date.now().toString(),
      title: `${reportTypes.find((t) => t.id === selectedReportType)?.name} - ${format(new Date(), "MMM yyyy")}`,
      type: selectedReportType,
      description: aiPrompt || reportTypes.find((t) => t.id === selectedReportType)?.description || "",
      createdAt: new Date().toISOString(),
      status: "generating",
      size: "Generating...",
      aiGenerated: selectedReportType === "custom-ai" || aiPrompt.length > 0,
    }

    setReports((prev) => [newReport, ...prev])

    // Simulate report generation
    setTimeout(() => {
      setReports((prev) =>
        prev.map((report) =>
          report.id === newReport.id
            ? { ...report, status: "completed" as const, size: "1.2 MB", downloadUrl: `/reports/${report.id}.pdf` }
            : report,
        ),
      )
      setIsGenerating(false)
      setAiPrompt("")
    }, 3000)
  }

  const getStatusIcon = (status: Report["status"]) => {
    switch (status) {
      case "generating":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "generating":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports Dashboard</h1>
          <p className="text-gray-600">Generate and manage expense reports with AI assistance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">AI Generated</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-purple-600" />
                AI-Powered Report Generation
              </CardTitle>
              <CardDescription>
                Create comprehensive reports using AI analysis or choose from predefined templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTypes.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedReportType === type.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedReportType(type.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <type.icon className="h-6 w-6 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{type.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator />

              {/* Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date-range">Date Range</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDateRange?.from ? (
                            selectedDateRange.to ? (
                              <>
                                {format(selectedDateRange.from, "LLL dd, y")} -{" "}
                                {format(selectedDateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(selectedDateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={selectedDateRange?.from}
                          selected={selectedDateRange}
                          onSelect={setSelectedDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="department">Department (Optional)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ai-prompt">AI Instructions (Optional)</Label>
                    <Textarea
                      id="ai-prompt"
                      placeholder="Describe what specific insights or analysis you want in the report..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      rows={4}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Example: "Focus on travel expenses and identify cost-saving opportunities"
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={generateReport} disabled={isGenerating} className="min-w-[140px]">
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Report History</CardTitle>
                  <CardDescription>View and download previously generated reports</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input placeholder="Search reports..." className="pl-10 w-64" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(report.status)}
                        <FileText className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{report.title}</h3>
                          {report.aiGenerated && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              <Zap className="h-3 w-3 mr-1" />
                              AI
                            </Badge>
                          )}
                          <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Created: {format(new Date(report.createdAt), "MMM dd, yyyy 'at' HH:mm")}</span>
                          <span>Size: {report.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {report.status === "completed" && (
                        <>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </>
                      )}
                      {report.status === "generating" && (
                        <div className="flex items-center space-x-2">
                          <Progress value={65} className="w-24" />
                          <span className="text-sm text-gray-600">65%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
