"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card"
import { Button } from "@repo/ui/button"
import { Progress } from "@repo/ui/progress"
import { Badge } from "@repo/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/table"
import { Skeleton } from "@repo/ui/skeleton"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  Plus,
  Eye,
  Edit,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { useBudgets, useDeleteBudget } from "@/hooks/use-budgets"

export function BudgetOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState("current")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const {
    data: budgetsData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useBudgets({
    department: selectedDepartment !== "all" ? selectedDepartment : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
    period: selectedPeriod !== "current" ? selectedPeriod : undefined,
  })

  const deleteBudgetMutation = useDeleteBudget()

  const budgets = budgetsData?.data || []

  const getStatusBadge = (status: string, percentage: number) => {
    const budgetStatus = percentage >= 90 ? "critical" : percentage >= 75 ? "warning" : "healthy"

    switch (budgetStatus) {
      case "critical":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 h-5 text-xs">
            <AlertTriangle className="w-2 h-2 mr-1" />
            Critical
          </Badge>
        )
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 h-5 text-xs">
            <TrendingUp className="w-2 h-2 mr-1" />
            Warning
          </Badge>
        )
      case "healthy":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 h-5 text-xs">
            <TrendingDown className="w-2 h-2 mr-1" />
            Healthy
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="h-5 text-xs">
            {status}
          </Badge>
        )
    }
  }

  const totalAllocated = budgets.reduce((sum, budget) => sum + budget.totalAmount, 0)
  const totalUsed = budgets.reduce((sum, budget) => sum + budget.usedAmount, 0)
  const totalRemaining = totalAllocated - totalUsed
  const overallPercentage = totalAllocated > 0 ? (totalUsed / totalAllocated) * 100 : 0

  const pieData = budgets.map((budget) => ({
    name: budget.name,
    value: budget.usedAmount,
    color: budget.usagePercentage >= 90 ? "#ef4444" : budget.usagePercentage >= 75 ? "#f59e0b" : "#10b981",
  }))

  const barData = budgets.map((budget) => ({
    name: budget.name.split(" ")[0],
    allocated: budget.totalAmount,
    used: budget.usedAmount,
    remaining: budget.remainingAmount,
  }))

  const handleDeleteBudget = async (budgetId: string) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await deleteBudgetMutation.mutateAsync(budgetId)
      } catch (error) {
        console.error("Error deleting budget:", error)
      }
    }
  }

  if (isError) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm text-red-600 mb-4">{error?.message || "Failed to load budgets"}</p>
            <Button onClick={() => refetch()} size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold flex items-center gap-2">
            Budget Overview
            {isFetching && <Loader2 className="w-4 h-4 animate-spin" />}
          </h1>
          <p className="text-xs text-gray-600">Monitor budget allocation and spending across departments</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-32 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-24 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Quarter</SelectItem>
              <SelectItem value="previous">Previous Quarter</SelectItem>
              <SelectItem value="yearly">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="h-7 px-3 text-xs">
            <Plus className="w-3 h-3 mr-1" />
            New Budget
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Allocated</p>
              {isLoading ? (
                <Skeleton className="h-4 w-16 mt-1" />
              ) : (
                <p className="text-sm font-semibold">${totalAllocated.toLocaleString()}</p>
              )}
            </div>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Used</p>
              {isLoading ? (
                <Skeleton className="h-4 w-16 mt-1" />
              ) : (
                <p className="text-sm font-semibold">${totalUsed.toLocaleString()}</p>
              )}
            </div>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Remaining</p>
              {isLoading ? (
                <Skeleton className="h-4 w-16 mt-1" />
              ) : (
                <p className="text-sm font-semibold">${totalRemaining.toLocaleString()}</p>
              )}
            </div>
            <TrendingDown className="w-4 h-4 text-green-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Overall Usage</p>
              {isLoading ? (
                <Skeleton className="h-4 w-16 mt-1" />
              ) : (
                <p className="text-sm font-semibold">{overallPercentage.toFixed(1)}%</p>
              )}
            </div>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Budget List */}
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Budget Details</CardTitle>
            <CardDescription className="text-xs">Current budget status by category</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-2 w-16" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-2 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs p-2">Budget</TableHead>
                    <TableHead className="text-xs p-2">Department</TableHead>
                    <TableHead className="text-xs p-2">Progress</TableHead>
                    <TableHead className="text-xs p-2">Status</TableHead>
                    <TableHead className="text-xs p-2">Amount</TableHead>
                    <TableHead className="text-xs p-2 w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgets.map((budget) => (
                    <TableRow key={budget.id} className="hover:bg-gray-50">
                      <TableCell className="p-2">
                        <div>
                          <p className="text-xs font-medium">{budget.name}</p>
                          <p className="text-xs text-gray-500">{budget.id}</p>
                        </div>
                      </TableCell>
                      <TableCell className="p-2">
                        <span className="text-xs">{budget.department}</span>
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>${budget.usedAmount.toLocaleString()}</span>
                            <span>{budget.usagePercentage || 0}%</span>
                          </div>
                          <Progress value={budget.usagePercentage || 0} className="h-1" />
                        </div>
                      </TableCell>
                      <TableCell className="p-2">
                        {getStatusBadge(budget.budgetStatus || "healthy", budget.usagePercentage || 0)}
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="text-xs">
                          <p className="font-medium">${budget.totalAmount.toLocaleString()}</p>
                          <p className="text-gray-500">${budget.remainingAmount.toLocaleString()} left</p>
                        </div>
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                            <Eye className="h-2 w-2" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                            <Edit className="h-2 w-2" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="space-y-4">
          {/* Pie Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Budget Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-[150px]">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Used"]} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Budget Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <>
                  {budgets
                    .filter((budget) => budget.usagePercentage >= 75)
                    .map((budget) => (
                      <div
                        key={budget.id}
                        className={`flex items-center gap-2 p-2 rounded text-xs ${
                          budget.usagePercentage >= 90 ? "bg-red-50" : "bg-yellow-50"
                        }`}
                      >
                        <AlertTriangle
                          className={`w-3 h-3 ${budget.usagePercentage >= 90 ? "text-red-600" : "text-yellow-600"}`}
                        />
                        <div>
                          <p className="font-medium">
                            {budget.name} at {budget.usagePercentage}%
                          </p>
                          <p className="text-gray-600">
                            {budget.usagePercentage >= 90 ? "Critical level reached" : "Monitor spending closely"}
                          </p>
                        </div>
                      </div>
                    ))}
                  {budgets.filter((budget) => budget.usagePercentage >= 75).length === 0 && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded text-xs">
                      <TrendingDown className="w-3 h-3 text-green-600" />
                      <div>
                        <p className="font-medium">All budgets healthy</p>
                        <p className="text-gray-600">No alerts at this time</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bar Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Budget vs Spending Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-[200px]">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="allocated" fill="#3b82f6" name="Allocated" />
                <Bar dataKey="used" fill="#ef4444" name="Used" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
