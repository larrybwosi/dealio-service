"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card"
import { Button } from "@repo/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select"
import { Badge } from "@repo/ui/badge"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Calendar, Download, Filter, BarChart3, PieChartIcon } from "lucide-react"

export function ExpenseAnalytics() {
  const [timeRange, setTimeRange] = useState("6months")
  const [chartType, setChartType] = useState("line")

  const monthlyData = [
    { month: "Jul", expenses: 4200, budget: 5000, approved: 3800, pending: 400 },
    { month: "Aug", expenses: 3800, budget: 5000, approved: 3600, pending: 200 },
    { month: "Sep", expenses: 5200, budget: 5000, approved: 4800, pending: 400 },
    { month: "Oct", expenses: 4600, budget: 5000, approved: 4200, pending: 400 },
    { month: "Nov", expenses: 5800, budget: 5000, approved: 5400, pending: 400 },
    { month: "Dec", expenses: 6200, budget: 5000, approved: 5800, pending: 400 },
  ]

  const categoryData = [
    { name: "Travel", value: 8500, color: "#3b82f6", percentage: 35 },
    { name: "Software", value: 3200, color: "#ef4444", percentage: 13 },
    { name: "Office", value: 2400, color: "#10b981", percentage: 10 },
    { name: "Marketing", value: 4800, color: "#f59e0b", percentage: 20 },
    { name: "Training", value: 1800, color: "#8b5cf6", percentage: 7 },
    { name: "Meals", value: 3600, color: "#06b6d4", percentage: 15 },
  ]

  const departmentData = [
    { department: "Sales", Q1: 12000, Q2: 14500, Q3: 13200, Q4: 15800 },
    { department: "Marketing", Q1: 8500, Q2: 9200, Q3: 10100, Q4: 11300 },
    { department: "IT", Q1: 6200, Q2: 7800, Q3: 8900, Q4: 9500 },
    { department: "Operations", Q1: 4500, Q2: 5200, Q3: 5800, Q4: 6100 },
    { department: "HR", Q1: 2800, Q2: 3100, Q3: 3400, Q4: 3800 },
  ]

  const trendData = [
    { period: "Week 1", thisYear: 1200, lastYear: 1100 },
    { period: "Week 2", thisYear: 1350, lastYear: 1250 },
    { period: "Week 3", thisYear: 1180, lastYear: 1300 },
    { period: "Week 4", thisYear: 1420, lastYear: 1180 },
  ]

  const stats = [
    {
      title: "Total Expenses",
      value: "$24,580",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-blue-600",
    },
    {
      title: "Avg Monthly",
      value: "$4,097",
      change: "+8.2%",
      trend: "up",
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: "Budget Variance",
      value: "-$2,420",
      change: "4.8% over",
      trend: "down",
      icon: TrendingDown,
      color: "text-red-600",
    },
    {
      title: "Approval Rate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">Expense Analytics</h1>
          <p className="text-xs text-gray-600">Comprehensive expense insights and trends</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
            <Filter className="w-3 h-3 mr-1" />
            Filters
          </Button>
          <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <Card key={index} className="p-3">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded ${stat.color} bg-opacity-10`}>
                    <stat.icon className={`w-3 h-3 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{stat.title}</p>
                    <p className="text-sm font-semibold">{stat.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={stat.trend === "up" ? "default" : "destructive"} className="h-4 text-xs">
                    {stat.change}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Main Chart */}
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-sm">Expense Trends</CardTitle>
                <CardDescription className="text-xs">Monthly expense patterns and budget comparison</CardDescription>
              </div>
              <div className="flex gap-1">
                <Button
                  variant={chartType === "line" ? "default" : "outline"}
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setChartType("line")}
                >
                  Line
                </Button>
                <Button
                  variant={chartType === "area" ? "default" : "outline"}
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setChartType("area")}
                >
                  Area
                </Button>
                <Button
                  variant={chartType === "bar" ? "default" : "outline"}
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setChartType("bar")}
                >
                  Bar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              {(() => {
                if (chartType === "line") {
                  return (
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend />
                      <Line type="monotone" dataKey="expenses" stroke="#3b82f6" strokeWidth={2} name="Expenses" />
                      <Line type="monotone" dataKey="budget" stroke="#10b981" strokeWidth={2} name="Budget" />
                    </LineChart>
                  )
                }
                if (chartType === "area") {
                  return (
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="approved"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                        name="Approved"
                      />
                      <Area type="monotone" dataKey="pending" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Pending" />
                    </AreaChart>
                  )
                }
                return (
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="expenses" fill="#3b82f6" name="Expenses" />
                    <Bar dataKey="budget" fill="#10b981" name="Budget" />
                  </BarChart>
                )
              })()}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Category Breakdown</CardTitle>
            <CardDescription className="text-xs">Expense distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                    <span>{category.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">${category.value.toLocaleString()}</span>
                    <span className="text-gray-500 ml-1">({category.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Department Comparison */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Department Comparison</CardTitle>
            <CardDescription className="text-xs">Quarterly expense comparison by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={departmentData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="department" type="category" tick={{ fontSize: 10 }} width={60} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="Q4" fill="#3b82f6" name="Q4 2024" />
                <Bar dataKey="Q3" fill="#10b981" name="Q3 2024" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Year-over-Year Comparison */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Year-over-Year Trends</CardTitle>
            <CardDescription className="text-xs">Comparing current year vs previous year</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="thisYear" stroke="#3b82f6" strokeWidth={2} name="2024" />
                <Line
                  type="monotone"
                  dataKey="lastYear"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="2023"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Key Insights</CardTitle>
          <CardDescription className="text-xs">AI-powered expense insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium">Spending Trend</span>
              </div>
              <p className="text-xs text-gray-600">
                Travel expenses increased by 23% this quarter. Consider implementing travel policy guidelines.
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-medium">Budget Alert</span>
              </div>
              <p className="text-xs text-gray-600">
                Software category is 80% utilized. Review subscriptions to optimize spending.
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <div className="flex items-center gap-2 mb-2">
                <PieChartIcon className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium">Optimization</span>
              </div>
              <p className="text-xs text-gray-600">
                Office supplies spending is 15% under budget. Good cost management this quarter.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
