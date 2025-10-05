"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Badge } from "@workspace/ui/components/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog"
import { CheckCircle, XCircle, DollarSign, Calendar, Filter, Users, AlertTriangle } from "lucide-react"

export function BulkApproval() {
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState("")
  const [bulkComment, setBulkComment] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const pendingExpenses = [
    {
      id: "EXP-002",
      description: "Client Lunch Meeting",
      amount: 89.5,
      category: "Meals",
      submitter: "Sarah Wilson",
      date: "2024-01-14",
      daysWaiting: 2,
    },
    {
      id: "EXP-005",
      description: "Marketing Materials",
      amount: 320.0,
      category: "Marketing",
      submitter: "Alex Chen",
      date: "2024-01-11",
      daysWaiting: 5,
    },
    {
      id: "EXP-007",
      description: "Office Supplies",
      amount: 45.0,
      category: "Office",
      submitter: "John Doe",
      date: "2024-01-16",
      daysWaiting: 1,
    },
    {
      id: "EXP-008",
      description: "Taxi Fare",
      amount: 25.0,
      category: "Travel",
      submitter: "Emily Davis",
      date: "2024-01-15",
      daysWaiting: 2,
    },
    {
      id: "EXP-009",
      description: "Software License",
      amount: 99.0,
      category: "Software",
      submitter: "Mike Johnson",
      date: "2024-01-13",
      daysWaiting: 4,
    },
  ]

  const handleSelectExpense = (expenseId: string) => {
    setSelectedExpenses((prev) =>
      prev.includes(expenseId) ? prev.filter((id) => id !== expenseId) : [...prev, expenseId],
    )
  }

  const handleSelectAll = () => {
    setSelectedExpenses(selectedExpenses.length === pendingExpenses.length ? [] : pendingExpenses.map((e) => e.id))
  }

  const handleBulkApproveByAmount = () => {
    const amount = Number.parseFloat(maxAmount)
    if (amount > 0) {
      const eligibleExpenses = pendingExpenses
        .filter((expense) => expense.amount <= amount)
        .map((expense) => expense.id)
      setSelectedExpenses(eligibleExpenses)
    }
  }

  const handleBulkAction = () => {
    if (selectedExpenses.length > 0 && bulkAction) {
      setShowConfirmDialog(true)
    }
  }

  const confirmBulkAction = () => {
    console.log(`Bulk ${bulkAction} for expenses:`, selectedExpenses)
    console.log(`Comment: ${bulkComment}`)
    setShowConfirmDialog(false)
    setSelectedExpenses([])
    setBulkComment("")
  }

  const selectedTotal = pendingExpenses
    .filter((expense) => selectedExpenses.includes(expense.id))
    .reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">Bulk Approval</h1>
          <p className="text-xs text-gray-600">Approve or reject multiple expenses at once</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
            <Filter className="w-3 h-3 mr-1" />
            Filters
          </Button>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            Quick Selection Actions
          </CardTitle>
          <CardDescription className="text-xs">
            Use these shortcuts to quickly select expenses based on common criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Approve by Amount */}
            <div className="space-y-3 p-3 bg-linear-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-green-800">Amount Filter</Label>
                  <p className="text-xs text-green-600">Select by max amount</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1.5 h-3 w-3 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="Max amount"
                    className="h-7 text-xs pl-7 border-green-200 focus:border-green-400"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleBulkApproveByAmount}
                  size="sm"
                  className="w-full h-6 text-xs bg-green-600 hover:bg-green-700"
                  disabled={!maxAmount}
                >
                  Select Expenses
                </Button>
                <div className="text-xs text-green-600 text-center">
                  <a href="#" className="hover:underline font-medium">
                    View amount guidelines →
                  </a>
                </div>
              </div>
            </div>

            {/* By Category */}
            <div className="space-y-3 p-3 bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Filter className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-blue-800">Category Filter</Label>
                  <p className="text-xs text-blue-600">Group by category</p>
                </div>
              </div>
              <div className="space-y-2">
                <Select>
                  <SelectTrigger className="h-7 text-xs border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">Office Supplies</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="meals">Meals</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-6 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Apply Filter
                </Button>
                <div className="text-xs text-blue-600 text-center">
                  <a href="#" className="hover:underline font-medium">
                    Manage categories →
                  </a>
                </div>
              </div>
            </div>

            {/* By Submitter */}
            <div className="space-y-3 p-3 bg-linear-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-purple-800">Submitter Filter</Label>
                  <p className="text-xs text-purple-600">Filter by employee</p>
                </div>
              </div>
              <div className="space-y-2">
                <Select>
                  <SelectTrigger className="h-7 text-xs border-purple-200 focus:border-purple-400">
                    <SelectValue placeholder="Select submitter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Wilson</SelectItem>
                    <SelectItem value="alex">Alex Chen</SelectItem>
                    <SelectItem value="john">John Doe</SelectItem>
                    <SelectItem value="emily">Emily Davis</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-6 text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  Apply Filter
                </Button>
                <div className="text-xs text-purple-600 text-center">
                  <a href="#" className="hover:underline font-medium">
                    View team members →
                  </a>
                </div>
              </div>
            </div>

            {/* By Date Range */}
            <div className="space-y-3 p-3 bg-linear-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-orange-800">Date Filter</Label>
                  <p className="text-xs text-orange-600">Filter by date range</p>
                </div>
              </div>
              <div className="space-y-2">
                <Select>
                  <SelectTrigger className="h-7 text-xs border-orange-200 focus:border-orange-400">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-6 text-xs border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  Apply Filter
                </Button>
                <div className="text-xs text-orange-600 text-center">
                  <a href="#" className="hover:underline font-medium">
                    Custom date range →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
            <Button
              onClick={() => setSelectedExpenses(pendingExpenses.filter((e) => e.amount <= 50).map((e) => e.id))}
              size="sm"
              variant="outline"
              className="h-7 text-xs hover:bg-green-50 hover:border-green-300"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Select Small Amounts (&lt;$50)
            </Button>
            <Button
              onClick={() => setSelectedExpenses(pendingExpenses.filter((e) => e.daysWaiting > 3).map((e) => e.id))}
              size="sm"
              variant="outline"
              className="h-7 text-xs hover:bg-yellow-50 hover:border-yellow-300"
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              Select Overdue (&gt;3 days)
            </Button>
            <Button
              onClick={() => setSelectedExpenses([])}
              size="sm"
              variant="outline"
              className="h-7 text-xs hover:bg-gray-50"
            >
              Clear Selection
            </Button>
            <div className="ml-auto">
              <a href="#" className="text-xs text-blue-600 hover:underline font-medium">
                Need help with bulk actions? →
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection Summary */}
      {selectedExpenses.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-800">
                    {selectedExpenses.length} expense
                    {selectedExpenses.length > 1 ? "s" : ""} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-800">Total: ${selectedTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger className="w-32 h-6 text-xs">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approve">Approve All</SelectItem>
                    <SelectItem value="reject">Reject All</SelectItem>
                    <SelectItem value="request-info">Request Info</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleBulkAction} disabled={!bulkAction} size="sm" className="h-6 px-3 text-xs">
                  Apply Action
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expenses Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Pending Expenses</CardTitle>
          <CardDescription className="text-xs">Select expenses for bulk approval</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8 p-2">
                  <Checkbox
                    checked={selectedExpenses.length === pendingExpenses.length}
                    onCheckedChange={handleSelectAll}
                    className="h-3 w-3"
                  />
                </TableHead>
                <TableHead className="text-xs p-2">Expense</TableHead>
                <TableHead className="text-xs p-2">Amount</TableHead>
                <TableHead className="text-xs p-2">Category</TableHead>
                <TableHead className="text-xs p-2">Submitter</TableHead>
                <TableHead className="text-xs p-2">Days Waiting</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingExpenses.map((expense) => (
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
                      <p className="text-xs text-gray-500">{expense.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="p-2">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-gray-400" />
                      <span className="text-xs font-medium">${expense.amount.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-2">
                    <Badge variant="outline" className="text-xs h-4">
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-2">
                    <span className="text-xs">{expense.submitter}</span>
                  </TableCell>
                  <TableCell className="p-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className={`text-xs ${expense.daysWaiting > 3 ? "text-red-600" : "text-gray-600"}`}>
                        {expense.daysWaiting}d
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Confirm Bulk Action</DialogTitle>
            <DialogDescription className="text-xs">
              You are about to {bulkAction} {selectedExpenses.length} expense
              {selectedExpenses.length > 1 ? "s" : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Selected expenses:</span>
                  <span className="font-medium">{selectedExpenses.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Total amount:</span>
                  <span className="font-medium">${selectedTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Action:</span>
                  <span className="font-medium capitalize">{bulkAction}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Comments (optional)</Label>
              <Textarea
                placeholder="Add comments for this bulk action..."
                value={bulkComment}
                onChange={(e) => setBulkComment(e.target.value)}
                className="text-xs resize-none"
                rows={3}
              />
            </div>

            {bulkAction === "approve" && selectedTotal > 1000 && (
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded text-xs">
                <AlertTriangle className="w-3 h-3 text-yellow-600" />
                <span className="text-yellow-800">High value approval: Total amount exceeds $1,000</span>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={confirmBulkAction}
                className={`flex-1 h-7 text-xs ${
                  bulkAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : bulkAction === "reject"
                      ? "bg-red-600 hover:bg-red-700"
                      : ""
                }`}
              >
                {bulkAction === "approve" && <CheckCircle className="w-3 h-3 mr-1" />}
                {bulkAction === "reject" && <XCircle className="w-3 h-3 mr-1" />}
                Confirm {bulkAction}
              </Button>
              <Button variant="outline" className="flex-1 h-7 text-xs" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
