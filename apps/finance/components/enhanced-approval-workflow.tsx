"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card"
import { Button } from "@repo/ui/button"
import { Badge } from "@repo/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar"
import { Textarea } from "@repo/ui/textarea"
import { Label } from "@repo/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog"
import { CheckCircle, XCircle, Clock, Eye, Calendar, DollarSign, FileText, AlertTriangle } from "lucide-react"

export function EnhancedApprovalWorkflow() {
  const [selectedExpense, setSelectedExpense] = useState<any>(null)
  const [approvalComment, setApprovalComment] = useState("")
  const [rejectionComment, setRejectionComment] = useState("")
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)

  const pendingExpenses = [
    {
      id: "EXP-002",
      description: "Client Lunch Meeting - Q1 Planning Discussion",
      amount: 89.5,
      category: "Meals & Entertainment",
      date: "2024-01-14",
      submitter: {
        name: "Sarah Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Sales Manager",
        email: "sarah.wilson@company.com",
      },
      priority: "normal",
      daysWaiting: 2,
      attachments: ["receipt-lunch.pdf"],
      details: {
        location: "Downtown Restaurant",
        paymentMethod: "Credit Card",
        businessPurpose: "Quarterly planning discussion with key client",
        attendees: "Sarah Wilson, John Smith (Client), Mary Johnson (Client)",
      },
      comments: [],
    },
    {
      id: "EXP-005",
      description: "Marketing Materials - Brochures and Flyers",
      amount: 320.0,
      category: "Marketing",
      date: "2024-01-11",
      submitter: {
        name: "Alex Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Marketing Specialist",
        email: "alex.chen@company.com",
      },
      priority: "normal",
      daysWaiting: 5,
      attachments: ["invoice-printing.pdf", "design-proof.pdf"],
      details: {
        location: "Los Angeles Office",
        paymentMethod: "Credit Card",
        businessPurpose: "Marketing materials for upcoming trade show",
        vendor: "PrintPro Solutions",
      },
      comments: [],
    },
    {
      id: "EXP-006",
      description: "Software License - Project Management Tool",
      amount: 1500.0,
      category: "Software",
      date: "2024-01-10",
      submitter: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "IT Manager",
        email: "mike.johnson@company.com",
      },
      priority: "high",
      daysWaiting: 6,
      attachments: ["license-agreement.pdf"],
      details: {
        location: "Remote",
        paymentMethod: "Bank Transfer",
        businessPurpose: "Annual license renewal for project management software",
        vendor: "ProjectFlow Inc",
      },
      comments: [],
    },
  ]

  const handleApprove = () => {
    if (!selectedExpense) return

    const comment = {
      id: Date.now().toString(),
      author: "Current User",
      message: approvalComment || "Expense approved",
      timestamp: new Date().toISOString(),
      type: "approval",
    }

    console.log(`Approving expense ${selectedExpense.id}`, comment)
    setApprovalComment("")
    setShowApprovalDialog(false)
    setSelectedExpense(null)
  }

  const handleReject = () => {
    if (!selectedExpense || !rejectionComment.trim()) return

    const comment = {
      id: Date.now().toString(),
      author: "Current User",
      message: rejectionComment,
      timestamp: new Date().toISOString(),
      type: "rejection",
    }

    console.log(`Rejecting expense ${selectedExpense.id}`, comment)
    setRejectionComment("")
    setShowRejectionDialog(false)
    setSelectedExpense(null)
  }

  const openApprovalDialog = (expense: any, type: "approve" | "reject") => {
    setSelectedExpense(expense)
    setActionType(type)
    if (type === "approve") {
      setShowApprovalDialog(true)
    } else {
      setShowRejectionDialog(true)
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 h-5 text-xs">High Priority</Badge>
      case "normal":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 h-5 text-xs">Normal</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 h-5 text-xs">Low Priority</Badge>
      default:
        return (
          <Badge variant="secondary" className="h-5 text-xs">
            {priority}
          </Badge>
        )
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">Enhanced Approval Workflow</h1>
          <p className="text-xs text-gray-600">Review and approve pending expense submissions with comments</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Pending Approval</p>
              <p className="text-sm font-semibold">{pendingExpenses.length}</p>
            </div>
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">High Priority</p>
              <p className="text-sm font-semibold">{pendingExpenses.filter((e) => e.priority === "high").length}</p>
            </div>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Amount</p>
              <p className="text-sm font-semibold">
                ${pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
              </p>
            </div>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Avg Wait Time</p>
              <p className="text-sm font-semibold">
                {Math.round(pendingExpenses.reduce((sum, exp) => sum + exp.daysWaiting, 0) / pendingExpenses.length)}{" "}
                days
              </p>
            </div>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Pending Approvals Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Pending Approvals</CardTitle>
          <CardDescription className="text-xs">
            Expenses waiting for your approval with comment requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs p-2">Expense</TableHead>
                <TableHead className="text-xs p-2">Submitter</TableHead>
                <TableHead className="text-xs p-2">Amount</TableHead>
                <TableHead className="text-xs p-2">Priority</TableHead>
                <TableHead className="text-xs p-2">Days</TableHead>
                <TableHead className="text-xs p-2">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingExpenses.map((expense) => (
                <TableRow key={expense.id} className="hover:bg-gray-50">
                  <TableCell className="p-2">
                    <div>
                      <p className="text-xs font-medium">{expense.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{expense.id}</span>
                        <span className="text-xs text-gray-500">{expense.category}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={expense.submitter.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {expense.submitter.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium">{expense.submitter.name}</p>
                        <p className="text-xs text-gray-500">{expense.submitter.role}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-2">
                    <span className="text-xs font-medium">${expense.amount.toFixed(2)}</span>
                  </TableCell>
                  <TableCell className="p-2">{getPriorityBadge(expense.priority)}</TableCell>
                  <TableCell className="p-2">
                    <span className="text-xs">{expense.daysWaiting}d</span>
                  </TableCell>
                  <TableCell className="p-2">
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => setSelectedExpense(expense)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-sm">Expense Details - {selectedExpense?.id}</DialogTitle>
                            <DialogDescription className="text-xs">
                              Review expense details before making approval decision
                            </DialogDescription>
                          </DialogHeader>
                          {selectedExpense && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <h4 className="text-xs font-medium">Basic Information</h4>
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
                                  <h4 className="text-xs font-medium">Submitter Details</h4>
                                  <div className="space-y-1 text-xs">
                                    <p>
                                      <span className="font-medium">Name:</span> {selectedExpense.submitter.name}
                                    </p>
                                    <p>
                                      <span className="font-medium">Role:</span> {selectedExpense.submitter.role}
                                    </p>
                                    <p>
                                      <span className="font-medium">Email:</span> {selectedExpense.submitter.email}
                                    </p>
                                    <p>
                                      <span className="font-medium">Priority:</span> {selectedExpense.priority}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="text-xs font-medium">Business Purpose</h4>
                                <p className="text-xs text-gray-600">{selectedExpense.details?.businessPurpose}</p>
                              </div>

                              <div className="space-y-2">
                                <h4 className="text-xs font-medium">Attachments</h4>
                                <div className="flex gap-2">
                                  {selectedExpense.attachments?.map((attachment: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      <FileText className="w-2 h-2 mr-1" />
                                      {attachment}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex gap-2 pt-4">
                                <Button
                                  onClick={() => openApprovalDialog(selectedExpense, "approve")}
                                  className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => openApprovalDialog(selectedExpense, "reject")}
                                  variant="destructive"
                                  className="flex-1 h-8 text-xs"
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        onClick={() => openApprovalDialog(expense, "approve")}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => openApprovalDialog(expense, "reject")}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Approve Expense</DialogTitle>
            <DialogDescription className="text-xs">
              Approve expense {selectedExpense?.id} - {selectedExpense?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Amount:</span>
                  <span className="font-medium">${selectedExpense?.amount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Submitter:</span>
                  <span className="font-medium">{selectedExpense?.submitter?.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Category:</span>
                  <span className="font-medium">{selectedExpense?.category}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Comments (optional)</Label>
              <Textarea
                placeholder="Add any comments about this approval..."
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                className="text-xs resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleApprove} className="flex-1 h-7 text-xs bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Approve Expense
              </Button>
              <Button variant="outline" className="flex-1 h-7 text-xs" onClick={() => setShowApprovalDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Reject Expense</DialogTitle>
            <DialogDescription className="text-xs">
              Reject expense {selectedExpense?.id} - {selectedExpense?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-red-50 rounded">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Amount:</span>
                  <span className="font-medium">${selectedExpense?.amount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Submitter:</span>
                  <span className="font-medium">{selectedExpense?.submitter?.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Category:</span>
                  <span className="font-medium">{selectedExpense?.category}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Rejection Reason *</Label>
              <Textarea
                placeholder="Please provide a reason for rejecting this expense..."
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
                className="text-xs resize-none"
                rows={3}
                required
              />
              <p className="text-xs text-red-600">* A comment is required when rejecting an expense</p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleReject}
                disabled={!rejectionComment.trim()}
                variant="destructive"
                className="flex-1 h-7 text-xs"
              >
                <XCircle className="w-3 h-3 mr-1" />
                Reject Expense
              </Button>
              <Button variant="outline" className="flex-1 h-7 text-xs" onClick={() => setShowRejectionDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
