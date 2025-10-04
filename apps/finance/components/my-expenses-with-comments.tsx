"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card"
import { Button } from "@repo/ui/button"
import { Badge } from "@repo/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog"
import { CheckCircle, XCircle, Clock, MessageSquare, Calendar, DollarSign, User, FileText } from "lucide-react"

export function MyExpensesWithComments() {
  const [selectedExpense, setSelectedExpense] = useState<any>(null)

  const myExpenses = [
    {
      id: "EXP-001",
      description: "Office Supplies - Stationery and Paper",
      amount: 245.0,
      category: "Office Supplies",
      date: "2024-01-15",
      status: "approved",
      approver: "Sarah Wilson",
      comments: [
        {
          id: "1",
          author: "Sarah Wilson",
          authorRole: "Finance Manager",
          message: "Approved - necessary office supplies for Q1. Please ensure to keep receipts for future reference.",
          timestamp: "2024-01-15 10:30",
          type: "approval",
        },
      ],
    },
    {
      id: "EXP-002",
      description: "Client Lunch Meeting - Q1 Planning",
      amount: 89.5,
      category: "Meals",
      date: "2024-01-14",
      status: "pending",
      approver: "Mike Johnson",
      comments: [],
    },
    {
      id: "EXP-003",
      description: "Software License - Adobe Creative Suite",
      amount: 1200.0,
      category: "Software",
      date: "2024-01-13",
      status: "rejected",
      approver: "Sarah Wilson",
      comments: [
        {
          id: "2",
          author: "Sarah Wilson",
          authorRole: "Finance Manager",
          message:
            "Rejected - Please provide business justification and check if we already have this license. Also, consider if there are more cost-effective alternatives available.",
          timestamp: "2024-01-13 16:45",
          type: "rejection",
        },
      ],
    },
    {
      id: "EXP-004",
      description: "Conference Travel - Tech Summit 2024",
      amount: 850.0,
      category: "Travel",
      date: "2024-01-12",
      status: "approved",
      approver: "Sarah Wilson",
      comments: [
        {
          id: "3",
          author: "Sarah Wilson",
          authorRole: "Finance Manager",
          message:
            "Approved - Good investment in professional development. Please submit expense report within 30 days of return.",
          timestamp: "2024-01-12 14:20",
          type: "approval",
        },
      ],
    },
    {
      id: "EXP-005",
      description: "Marketing Materials - Brochures",
      amount: 320.0,
      category: "Marketing",
      date: "2024-01-11",
      status: "approved",
      approver: "Mike Johnson",
      comments: [
        {
          id: "4",
          author: "Mike Johnson",
          authorRole: "Department Head",
          message: "Approved for trade show preparation.",
          timestamp: "2024-01-11 09:15",
          type: "approval",
        },
      ],
    },
  ]

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

  const getCommentTypeIcon = (type: string) => {
    switch (type) {
      case "approval":
        return <CheckCircle className="w-3 h-3 text-green-600" />
      case "rejection":
        return <XCircle className="w-3 h-3 text-red-600" />
      default:
        return <MessageSquare className="w-3 h-3 text-blue-600" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const approvedExpenses = myExpenses.filter((e) => e.status === "approved")
  const rejectedExpenses = myExpenses.filter((e) => e.status === "rejected")
  const pendingExpenses = myExpenses.filter((e) => e.status === "pending")
  const totalAmount = myExpenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">My Expenses</h1>
          <p className="text-xs text-gray-600">View your submitted expenses and approval comments</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Submitted</p>
              <p className="text-sm font-semibold">{myExpenses.length}</p>
            </div>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Approved</p>
              <p className="text-sm font-semibold">{approvedExpenses.length}</p>
            </div>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Pending</p>
              <p className="text-sm font-semibold">{pendingExpenses.length}</p>
            </div>
            <Clock className="w-4 h-4 text-yellow-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Amount</p>
              <p className="text-sm font-semibold">${totalAmount.toFixed(2)}</p>
            </div>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">My Expense Submissions</CardTitle>
          <CardDescription className="text-xs">Track your expenses and view approval comments</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs p-2">Expense</TableHead>
                <TableHead className="text-xs p-2">Amount</TableHead>
                <TableHead className="text-xs p-2">Category</TableHead>
                <TableHead className="text-xs p-2">Status</TableHead>
                <TableHead className="text-xs p-2">Approver</TableHead>
                <TableHead className="text-xs p-2">Comments</TableHead>
                <TableHead className="text-xs p-2">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myExpenses.map((expense) => (
                <TableRow key={expense.id} className="hover:bg-gray-50">
                  <TableCell className="p-2">
                    <div>
                      <p className="text-xs font-medium">{expense.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{expense.id}</span>
                        <Calendar className="w-2 h-2 text-gray-400" />
                        <span className="text-xs text-gray-500">{expense.date}</span>
                      </div>
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
                  <TableCell className="p-2">{getStatusBadge(expense.status)}</TableCell>
                  <TableCell className="p-2">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className="text-xs">{expense.approver}</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-2">
                    <div className="flex items-center gap-1">
                      {expense.comments.length > 0 ? (
                        <>
                          <MessageSquare className="w-3 h-3 text-blue-600" />
                          <span className="text-xs text-blue-600 font-medium">
                            {expense.comments.length} comment{expense.comments.length > 1 ? "s" : ""}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">No comments</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="p-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => setSelectedExpense(expense)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-sm">Expense Details - {selectedExpense?.id}</DialogTitle>
                          <DialogDescription className="text-xs">
                            View expense information and approval comments
                          </DialogDescription>
                        </DialogHeader>
                        {selectedExpense && (
                          <div className="space-y-4">
                            {/* Expense Details */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h4 className="text-xs font-medium">Expense Information</h4>
                                <div className="space-y-1 text-xs">
                                  <p>
                                    <span className="font-medium">Description:</span> {selectedExpense.description}
                                  </p>
                                  <p>
                                    <span className="font-medium">Amount:</span> ${selectedExpense.amount.toFixed(2)}
                                  </p>
                                  <p>
                                    <span className="font-medium">Category:</span> {selectedExpense.category}
                                  </p>
                                  <p>
                                    <span className="font-medium">Date:</span> {selectedExpense.date}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h4 className="text-xs font-medium">Approval Status</h4>
                                <div className="space-y-1 text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Status:</span>
                                    {getStatusBadge(selectedExpense.status)}
                                  </div>
                                  <p>
                                    <span className="font-medium">Approver:</span> {selectedExpense.approver}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Comments Section */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-medium">Approval Comments</h4>
                              {selectedExpense.comments.length > 0 ? (
                                <div className="space-y-2">
                                  {selectedExpense.comments.map((comment: any) => (
                                    <div key={comment.id} className="p-3 border rounded-lg">
                                      <div className="flex items-start gap-2">
                                        <div className="mt-1">{getCommentTypeIcon(comment.type)}</div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium">{comment.author}</span>
                                            <span className="text-xs text-gray-500">({comment.authorRole})</span>
                                            <span className="text-xs text-gray-400">
                                              {formatTimestamp(comment.timestamp)}
                                            </span>
                                          </div>
                                          <p className="text-xs text-gray-700">{comment.message}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-3 border rounded-lg bg-gray-50">
                                  <p className="text-xs text-gray-500 text-center">
                                    No comments available for this expense
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Action based on status */}
                            {selectedExpense.status === "rejected" && (
                              <div className="p-3 bg-red-50 border border-red-200 rounded">
                                <p className="text-xs text-red-800 font-medium mb-1">Action Required</p>
                                <p className="text-xs text-red-700">
                                  This expense was rejected. Please review the comments above and resubmit with the
                                  requested changes.
                                </p>
                              </div>
                            )}

                            {selectedExpense.status === "pending" && (
                              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                <p className="text-xs text-yellow-800 font-medium mb-1">Pending Approval</p>
                                <p className="text-xs text-yellow-700">
                                  Your expense is currently under review. You will be notified once a decision is made.
                                </p>
                              </div>
                            )}

                            {selectedExpense.status === "approved" && (
                              <div className="p-3 bg-green-50 border border-green-200 rounded">
                                <p className="text-xs text-green-800 font-medium mb-1">Approved</p>
                                <p className="text-xs text-green-700">
                                  Your expense has been approved and will be processed for reimbursement.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Comments */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Recent Comments</CardTitle>
          <CardDescription className="text-xs">Latest feedback on your expense submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {myExpenses
              .filter((e) => e.comments.length > 0)
              .slice(0, 3)
              .map((expense) => (
                <div key={expense.id} className="p-2 border rounded">
                  <div className="flex items-start gap-2">
                    <div className="mt-1">{getCommentTypeIcon(expense.comments[0].type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">{expense.description}</span>
                        {getStatusBadge(expense.status)}
                      </div>
                      <p className="text-xs text-gray-600">{expense.comments[0].message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {expense.comments[0].author} • {formatTimestamp(expense.comments[0].timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
