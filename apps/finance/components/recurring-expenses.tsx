"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card"
import { Button } from "@repo/ui/button"
import { Badge } from "@repo/ui/badge"
import { Switch } from "@repo/ui/switch"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/dropdown-menu"
import {
  RefreshCw,
  Plus,
  Calendar,
  DollarSign,
  Play,
  Pause,
  Edit,
  Trash2,
  MoreHorizontal,
  Clock,
  AlertCircle,
} from "lucide-react"

export function RecurringExpenses() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const recurringExpenses = [
    {
      id: "REC-001",
      description: "Office Rent - Monthly Payment",
      amount: 2500.0,
      category: "Office & Facilities",
      frequency: "Monthly",
      nextDue: "2024-02-01",
      status: "active",
      lastProcessed: "2024-01-01",
      totalProcessed: 12,
      paymentMethod: "Bank Transfer",
      supplier: "Property Management Co.",
    },
    {
      id: "REC-002",
      description: "Software Subscriptions - Adobe Creative Suite",
      amount: 99.99,
      category: "Software",
      frequency: "Monthly",
      nextDue: "2024-01-20",
      status: "active",
      lastProcessed: "2023-12-20",
      totalProcessed: 8,
      paymentMethod: "Credit Card",
      supplier: "Adobe Inc.",
    },
    {
      id: "REC-003",
      description: "Internet Service - Business Plan",
      amount: 149.99,
      category: "Utilities",
      frequency: "Monthly",
      nextDue: "2024-01-25",
      status: "active",
      lastProcessed: "2023-12-25",
      totalProcessed: 24,
      paymentMethod: "Bank Transfer",
      supplier: "TechNet ISP",
    },
    {
      id: "REC-004",
      description: "Insurance Premium - Business Liability",
      amount: 450.0,
      category: "Insurance",
      frequency: "Quarterly",
      nextDue: "2024-03-15",
      status: "paused",
      lastProcessed: "2023-12-15",
      totalProcessed: 4,
      paymentMethod: "Bank Transfer",
      supplier: "SecureGuard Insurance",
    },
    {
      id: "REC-005",
      description: "Cloud Storage - Enterprise Plan",
      amount: 29.99,
      category: "Software",
      frequency: "Monthly",
      nextDue: "2024-01-18",
      status: "active",
      lastProcessed: "2023-12-18",
      totalProcessed: 15,
      paymentMethod: "Credit Card",
      supplier: "CloudStore Pro",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 h-5 text-xs">
            <Play className="w-2 h-2 mr-1" />
            Active
          </Badge>
        )
      case "paused":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 h-5 text-xs">
            <Pause className="w-2 h-2 mr-1" />
            Paused
          </Badge>
        )
      case "expired":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 h-5 text-xs">
            <AlertCircle className="w-2 h-2 mr-1" />
            Expired
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

  const getFrequencyBadge = (frequency: string) => {
    const colors = {
      Monthly: "bg-blue-100 text-blue-800",
      Quarterly: "bg-purple-100 text-purple-800",
      Yearly: "bg-green-100 text-green-800",
      Weekly: "bg-orange-100 text-orange-800",
    }
    return (
      <Badge
        className={`${colors[frequency as keyof typeof colors]} hover:${colors[frequency as keyof typeof colors]} h-5 text-xs`}
      >
        <Calendar className="w-2 h-2 mr-1" />
        {frequency}
      </Badge>
    )
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const activeExpenses = recurringExpenses.filter((exp) => exp.status === "active")
  const totalMonthlyAmount = activeExpenses
    .filter((exp) => exp.frequency === "Monthly")
    .reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">Recurring Expenses</h1>
          <p className="text-xs text-gray-600">Manage automated and scheduled expense payments</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
            <RefreshCw className="w-3 h-3 mr-1" />
            Process Due
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-7 px-3 text-xs">
                <Plus className="w-3 h-3 mr-1" />
                New Recurring
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-sm">Create Recurring Expense</DialogTitle>
                <DialogDescription className="text-xs">Set up a new recurring expense schedule</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="description" className="text-xs">
                    Description
                  </Label>
                  <Input id="description" placeholder="Expense description" className="h-7 text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="amount" className="text-xs">
                      Amount
                    </Label>
                    <Input id="amount" type="number" placeholder="0.00" className="h-7 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Frequency</Label>
                    <Select>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Category</Label>
                  <Select>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office">Office & Facilities</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Payment Method</Label>
                  <Select>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="credit-card">Credit Card</SelectItem>
                      <SelectItem value="company-card">Company Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-approve" />
                  <Label htmlFor="auto-approve" className="text-xs">
                    Auto-approve when processed
                  </Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 h-7 text-xs">Create Recurring</Button>
                  <Button variant="outline" className="flex-1 h-7 text-xs" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Active Recurring</p>
              <p className="text-sm font-semibold">{activeExpenses.length}</p>
            </div>
            <RefreshCw className="w-4 h-4 text-green-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Monthly Total</p>
              <p className="text-sm font-semibold">${totalMonthlyAmount.toFixed(2)}</p>
            </div>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Due This Week</p>
              <p className="text-sm font-semibold">
                {
                  recurringExpenses.filter(
                    (exp) => getDaysUntilDue(exp.nextDue) <= 7 && getDaysUntilDue(exp.nextDue) >= 0,
                  ).length
                }
              </p>
            </div>
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Overdue</p>
              <p className="text-sm font-semibold">
                {recurringExpenses.filter((exp) => getDaysUntilDue(exp.nextDue) < 0).length}
              </p>
            </div>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Recurring Expenses Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">All Recurring Expenses</CardTitle>
          <CardDescription className="text-xs">Manage your scheduled expense payments</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs p-2">Expense</TableHead>
                <TableHead className="text-xs p-2">Amount</TableHead>
                <TableHead className="text-xs p-2">Frequency</TableHead>
                <TableHead className="text-xs p-2">Next Due</TableHead>
                <TableHead className="text-xs p-2">Status</TableHead>
                <TableHead className="text-xs p-2">Processed</TableHead>
                <TableHead className="text-xs p-2 w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recurringExpenses.map((expense) => {
                const daysUntilDue = getDaysUntilDue(expense.nextDue)
                return (
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
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-medium">{expense.amount.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-2">{getFrequencyBadge(expense.frequency)}</TableCell>
                    <TableCell className="p-2">
                      <div>
                        <p className="text-xs">{expense.nextDue}</p>
                        <p
                          className={`text-xs ${daysUntilDue < 0 ? "text-red-600" : daysUntilDue <= 7 ? "text-orange-600" : "text-gray-500"}`}
                        >
                          {daysUntilDue < 0
                            ? `${Math.abs(daysUntilDue)} days overdue`
                            : daysUntilDue === 0
                              ? "Due today"
                              : `${daysUntilDue} days`}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="p-2">{getStatusBadge(expense.status)}</TableCell>
                    <TableCell className="p-2">
                      <div>
                        <p className="text-xs font-medium">{expense.totalProcessed}x</p>
                        <p className="text-xs text-gray-500">Last: {expense.lastProcessed}</p>
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
                            <Edit className="mr-2 h-3 w-3" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs">
                            {expense.status === "active" ? (
                              <>
                                <Pause className="mr-2 h-3 w-3" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-3 w-3" />
                                Resume
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs">
                            <RefreshCw className="mr-2 h-3 w-3" />
                            Process Now
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs text-red-600">
                            <Trash2 className="mr-2 h-3 w-3" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upcoming Payments */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Upcoming Payments</CardTitle>
          <CardDescription className="text-xs">Expenses due in the next 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recurringExpenses
              .filter((exp) => getDaysUntilDue(exp.nextDue) >= 0 && getDaysUntilDue(exp.nextDue) <= 30)
              .sort((a, b) => getDaysUntilDue(a.nextDue) - getDaysUntilDue(b.nextDue))
              .map((expense) => {
                const daysUntilDue = getDaysUntilDue(expense.nextDue)
                return (
                  <div key={expense.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${daysUntilDue <= 7 ? "bg-red-500" : "bg-blue-500"}`} />
                      <div>
                        <p className="text-xs font-medium">{expense.description}</p>
                        <p className="text-xs text-gray-500">{expense.supplier}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">${expense.amount.toFixed(2)}</p>
                      <p className={`text-xs ${daysUntilDue <= 7 ? "text-red-600" : "text-gray-500"}`}>
                        {daysUntilDue === 0 ? "Due today" : `${daysUntilDue} days`}
                      </p>
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
