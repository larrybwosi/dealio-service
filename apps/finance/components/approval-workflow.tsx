"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Textarea } from "@workspace/ui/components/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MessageSquare,
  User,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
} from "lucide-react"

export function ApprovalWorkflow() {
  const [selectedExpense, setSelectedExpense] = useState<any>(null)
  const [approvalComment, setApprovalComment] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

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
    },
  ]

  const approvedExpenses = [
    {
      id: "EXP-001",
      description: "Office Supplies - Stationery",
      amount: 245.0,
      approver: "Sarah Wilson",
      approvedDate: "2024-01-15",
      status: "approved",
    },
    {
      id: "EXP-004",
      description: "Conference Travel",
      amount: 850.0,
      approver: "Sarah Wilson",
      approvedDate: "2024-01-12",
      status: "approved",
    },
  ]

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

  const handleApprove = (expenseId: string) => {
    console.log(`Approving expense ${expenseId} with comment: ${approvalComment}`)
    setApprovalComment("")
  }

  const handleReject = (expenseId: string) => {
    console.log(`Rejecting expense ${expenseId} with comment: ${approvalComment}`)
    setApprovalComment("")
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">Approval Workflow</h1>
          <p className="text-xs text-gray-600">Review and approve pending expense submissions</p>
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Expenses</SelectItem>
              <SelectItem value="pending">Pending Only</SelectItem>
              <SelectItem value="high-priority">High Priority</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
            Bulk Actions
          </Button>
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
            <AlertCircle className="w-4 h-4 text-red-600" />
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

      <div className="grid grid-cols-3 gap-4">
        {/* Pending Approvals */}
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Approvals</CardTitle>
            <CardDescription className="text-xs">Expenses waiting for your approval</CardDescription>
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
                                Review expense details and make approval decision
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
                                        <span className="font-medium">Amount:</span> $
                                        {selectedExpense.amount.toFixed(2)}
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
                                    <h4 className="text-xs font-medium">Additional Details</h4>
                                    <div className="space-y-1 text-xs">
                                      <p>
                                        <span className="font-medium">Location:</span>{" "}
                                        {selectedExpense.details?.location}
                                      </p>
                                      <p>
                                        <span className="font-medium">Payment:</span>{" "}
                                        {selectedExpense.details?.paymentMethod}
                                      </p>
                                      <p>
                                        <span className="font-medium">Priority:</span> {selectedExpense.priority}
                                      </p>
                                      <p>
                                        <span className="font-medium">Days Waiting:</span> {selectedExpense.daysWaiting}
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

                                <div className="space-y-2">
                                  <h4 className="text-xs font-medium">Approval Comments</h4>
                                  <Textarea
                                    placeholder="Add comments for your approval decision..."
                                    value={approvalComment}
                                    onChange={(e) => setApprovalComment(e.target.value)}
                                    className="text-xs"
                                    rows={3}
                                  />
                                </div>

                                <div className="flex gap-2 pt-4">
                                  <Button
                                    onClick={() => handleApprove(selectedExpense.id)}
                                    className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() => handleReject(selectedExpense.id)}
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
                          onClick={() => handleApprove(expense.id)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleReject(expense.id)}
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

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recent Activity</CardTitle>
            <CardDescription className="text-xs">Latest approval decisions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {approvedExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{expense.description}</p>
                  <p className="text-xs text-gray-600">
                    Approved by {expense.approver} • ${expense.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Approve All Under $100
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <MessageSquare className="w-3 h-3 mr-1" />
              Request More Info
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <User className="w-3 h-3 mr-1" />
              Delegate Approval
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              Set Reminder
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
