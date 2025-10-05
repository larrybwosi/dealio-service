"use client"

import { useState } from "react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  DollarSign,
  MessageSquare,
  RefreshCw,
} from "lucide-react"
import { useExpenses, useDeleteExpense, useApproveExpense, useRejectExpense } from "@/hooks/use-expenses"
import { useCategories } from "@/hooks/use-categories"
import { ExportService } from "@/lib/export-utils"
import { PDFExportService } from "@/lib/pdf-export-utils"
import { ExportDropdown } from "@/components/export-dropdown"
import { useRouter } from "next/navigation"

export function ExpenseListWithQuery() {
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [page, setPage] = useState(1)
  const router = useRouter();

  // Fetch data using TanStack Query
  const {
    data: expensesData,
    isLoading: expensesLoading,
    error: expensesError,
    refetch: refetchExpenses,
  } = useExpenses({
    status: statusFilter !== "all" ? statusFilter : undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    page,
    limit: 10,
  })

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories()

  // Mutations
  const deleteExpenseMutation = useDeleteExpense()
  const approveExpenseMutation = useApproveExpense()
  const rejectExpenseMutation = useRejectExpense()

  const expenses = expensesData?.data || []
  const pagination = expensesData?.pagination
  const categories = categoriesData?.data || []

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 h-5 text-xs">
            <CheckCircle className="w-2 h-2 mr-1" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 h-5 text-xs">
            <Clock className="w-2 h-2 mr-1" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 h-5 text-xs">
            <XCircle className="w-2 h-2 mr-1" />
            Rejected
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

  const handleSelectExpense = (expenseId: string) => {
    setSelectedExpenses((prev) =>
      prev.includes(expenseId) ? prev.filter((id) => id !== expenseId) : [...prev, expenseId],
    )
  }

  const handleSelectAll = () => {
    setSelectedExpenses(selectedExpenses.length === expenses.length ? [] : expenses.map((e: any) => e.id))
  }

  const handleDeleteExpense = (id: string) => {
    deleteExpenseMutation.mutate(id)
  }

  const handleApproveExpense = (id: string, comment?: string) => {
    approveExpenseMutation.mutate({ id, comment })
  }

  const handleRejectExpense = (id: string, comment: string) => {
    rejectExpenseMutation.mutate({ id, comment })
  }

  const handleExportExcel = async () => {
    try {
      const exportData = ExportService.formatDataForExport(expenses)
      await ExportService.exportToExcel(exportData, `expenses-export-${new Date().toISOString().split("T")[0]}.xlsx`)
    } catch (error) {
      console.error("Excel export failed:", error)
    }
  }

  const handleExportPDF = async () => {
    try {
      const exportData = ExportService.formatDataForExport(expenses)
      await PDFExportService.exportToPDF(exportData, `expenses-report-${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("PDF export failed:", error)
    }
  }

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams({
        format: "csv",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(categoryFilter !== "all" && { category: categoryFilter }),
      })

      const response = await fetch(`/api/expenses/export?${params}`)
      const blob = await response.blob()

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `expenses-export-${new Date().toISOString().split("T")[0]}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("CSV export failed:", error)
    }
  }

  if (expensesError) {
    return (
      <div className="p-4">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-red-600 mb-4">Failed to load expenses</p>
            <Button onClick={() => refetchExpenses()} size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">All Expenses</h1>
          <p className="text-xs text-gray-600">Manage and track all expense submissions</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => refetchExpenses()}
            size="sm"
            variant="outline"
            className="h-7 px-3 text-xs"
            disabled={expensesLoading}
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${expensesLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <ExportDropdown
            data={expenses}
            filename="expenses-export"
            filters={{
              status: statusFilter,
              category: categoryFilter,
            }}
            onExportStart={() => console.log("Export started")}
            onExportComplete={() => console.log("Export completed")}
            onExportError={(error) => console.error("Export error:", error)}
          />
          <Button size="sm" className="h-7 px-3 text-xs" onClick={() => router.push('/?view=create')}>
            New Expense
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1.5 h-3 w-3 text-gray-400" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-7 text-xs pl-7"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 h-7 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40 h-7 text-xs">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoriesLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  categories
                    .filter((category: any) => category?.name && category.name.trim())
                    .map((category: any) => (
                      <SelectItem key={category.id} value={category.name || "unknown"}>
                        {category.name}
                      </SelectItem>
                    ))
                )}
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" className="h-7 px-3 text-xs bg-transparent">
              <Filter className="w-3 h-3 mr-1" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedExpenses.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-800">
                {selectedExpenses.length} expense{selectedExpenses.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-6 px-2 text-xs bg-transparent">
                  Approve Selected
                </Button>
                <Button size="sm" variant="outline" className="h-6 px-2 text-xs bg-transparent">
                  Reject Selected
                </Button>
                <Button size="sm" variant="outline" className="h-6 px-2 text-xs bg-transparent">
                  Export Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expenses Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="w-8 p-2">
                  <Checkbox
                    checked={selectedExpenses.length === expenses.length && expenses.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="h-3 w-3"
                  />
                </TableHead>
                <TableHead className="text-xs p-2">Expense</TableHead>
                <TableHead className="text-xs p-2">Amount</TableHead>
                <TableHead className="text-xs p-2">Category</TableHead>
                <TableHead className="text-xs p-2">Status</TableHead>
                <TableHead className="text-xs p-2">Submitter</TableHead>
                <TableHead className="text-xs p-2">Date</TableHead>
                <TableHead className="text-xs p-2">Comments</TableHead>
                <TableHead className="text-xs p-2 w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expensesLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="p-2">
                      <Skeleton className="h-3 w-3" />
                    </TableCell>
                    <TableCell className="p-2">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="p-2">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="p-2">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="p-2">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="p-2">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="p-2">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="p-2">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="p-2">
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                  </TableRow>
                ))
              ) : expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <p className="text-sm text-gray-500">No expenses found</p>
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((expense: any) => (
                  <TableRow key={expense.id} className="hover:bg-gray-50">
                    <TableCell className="p-2">
                      <Checkbox
                        checked={selectedExpenses.includes(expense.id)}
                        onCheckedChange={() => handleSelectExpense(expense.id)}
                        className="h-3 w-3"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <div>
                        <p className="text-xs font-medium">{expense.description}</p>
                        <div className="flex gap-1 mt-1">
                          {expense.tags?.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="h-4 text-xs px-1">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-medium">{expense.amount?.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <span className="text-xs">{expense.category}</span>
                    </TableCell>
                    <TableCell className="p-2">{getStatusBadge(expense.status)}</TableCell>
                    <TableCell className="p-2">
                      <span className="text-xs">{expense.submitter?.name}</span>
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs">{expense.date}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="flex items-center gap-1">
                        {expense.comments?.length > 0 ? (
                          <Badge variant="outline" className="text-xs h-4">
                            {expense.comments.length} comment{expense.comments.length > 1 ? "s" : ""}
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">No comments</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem className="text-xs">
                            <Eye className="mr-2 h-3 w-3" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs">
                            <Edit className="mr-2 h-3 w-3" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs">
                            <MessageSquare className="mr-2 h-3 w-3" />
                            View Comments
                          </DropdownMenuItem>
                          {expense.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                className="text-xs"
                                onClick={() => handleApproveExpense(expense.id)}
                                disabled={approveExpenseMutation.isPending}
                              >
                                <CheckCircle className="mr-2 h-3 w-3" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-xs"
                                onClick={() => handleRejectExpense(expense.id, "Rejected via quick action")}
                                disabled={rejectExpenseMutation.isPending}
                              >
                                <XCircle className="mr-2 h-3 w-3" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem
                            className="text-xs text-red-600"
                            onClick={() => handleDeleteExpense(expense.id)}
                            disabled={deleteExpenseMutation.isPending}
                          >
                            <Trash2 className="mr-2 h-3 w-3" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} expenses
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-3 text-xs bg-transparent"
              onClick={() => setPage(page - 1)}
              disabled={page === 1 || expensesLoading}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-3 text-xs bg-transparent"
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.totalPages || expensesLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="text-center">
            <p className="text-lg font-semibold">
              {expensesLoading ? <Skeleton className="h-6 w-8 mx-auto" /> : pagination?.total || 0}
            </p>
            <p className="text-xs text-gray-600">Total Expenses</p>
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-center">
            <p className="text-lg font-semibold">
              {expensesLoading ? (
                <Skeleton className="h-6 w-16 mx-auto" />
              ) : (
                `$${expenses.reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0).toFixed(2)}`
              )}
            </p>
            <p className="text-xs text-gray-600">Total Amount</p>
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-center">
            <p className="text-lg font-semibold">
              {expensesLoading ? (
                <Skeleton className="h-6 w-4 mx-auto" />
              ) : (
                expenses.filter((e: any) => e.status === "pending").length
              )}
            </p>
            <p className="text-xs text-gray-600">Pending Approval</p>
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-center">
            <p className="text-lg font-semibold">
              {expensesLoading ? (
                <Skeleton className="h-6 w-4 mx-auto" />
              ) : (
                expenses.filter((e: any) => e.status === "approved").length
              )}
            </p>
            <p className="text-xs text-gray-600">Approved</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
