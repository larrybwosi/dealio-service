"use client"

import { useState } from "react"
import { Card, CardContent } from "@repo/ui/card"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { Badge } from "@repo/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select"
import { Checkbox } from "@repo/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/dropdown-menu"
import {
  Search,
  Filter,
  Download,
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
} from "lucide-react"
import { useRouter } from "next/navigation"

export function ExpenseList() {
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const router = useRouter();

  const expenses = [
    {
      id: "EXP-001",
      description: "Office Supplies - Stationery and Paper",
      amount: 245.0,
      category: "Office Supplies",
      date: "2024-01-15",
      status: "approved",
      submitter: "John Doe",
      approver: "Sarah Wilson",
      paymentMethod: "Company Card",
      location: "New York Office",
      tags: ["office", "supplies"],
      comments: [
        {
          id: "1",
          author: "Sarah Wilson",
          message: "Approved - necessary office supplies for Q1",
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
      submitter: "Sarah Wilson",
      approver: "Mike Johnson",
      paymentMethod: "Credit Card",
      location: "Downtown Restaurant",
      tags: ["client", "meeting"],
      comments: [],
    },
    {
      id: "EXP-003",
      description: "Software License - Adobe Creative Suite",
      amount: 1200.0,
      category: "Software",
      date: "2024-01-13",
      status: "rejected",
      submitter: "Mike Johnson",
      approver: "Sarah Wilson",
      paymentMethod: "Bank Transfer",
      location: "Remote",
      tags: ["software", "license"],
      comments: [
        {
          id: "2",
          author: "Sarah Wilson",
          message: "Rejected - Please provide business justification and check if we already have this license",
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
      submitter: "Emily Davis",
      approver: "Sarah Wilson",
      paymentMethod: "Company Card",
      location: "San Francisco",
      tags: ["travel", "conference"],
      comments: [],
    },
    {
      id: "EXP-005",
      description: "Marketing Materials - Brochures",
      amount: 320.0,
      category: "Marketing",
      date: "2024-01-11",
      status: "pending",
      submitter: "Alex Chen",
      approver: "Mike Johnson",
      paymentMethod: "Credit Card",
      location: "Los Angeles Office",
      tags: ["marketing", "print"],
      comments: [],
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

  const handleSelectExpense = (expenseId: string) => {
    setSelectedExpenses((prev) =>
      prev.includes(expenseId) ? prev.filter((id) => id !== expenseId) : [...prev, expenseId],
    )
  }

  const handleSelectAll = () => {
    setSelectedExpenses(selectedExpenses.length === expenses.length ? [] : expenses.map((e) => e.id))
  }

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">All Expenses</h1>
          <p className="text-xs text-gray-600">Manage and track all expense submissions</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
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
                <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Meals">Meals</SelectItem>
                <SelectItem value="Software">Software</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
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
                <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                  Approve Selected
                </Button>
                <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                  Reject Selected
                </Button>
                <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
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
                    checked={selectedExpenses.length === expenses.length}
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
              {filteredExpenses.map((expense) => (
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
                        {expense.tags.map((tag) => (
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
                      <span className="text-xs font-medium">{expense.amount.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-2">
                    <span className="text-xs">{expense.category}</span>
                  </TableCell>
                  <TableCell className="p-2">{getStatusBadge(expense.status)}</TableCell>
                  <TableCell className="p-2">
                    <span className="text-xs">{expense.submitter}</span>
                  </TableCell>
                  <TableCell className="p-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs">{expense.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-2">
                    <div className="flex items-center gap-1">
                      {expense.comments.length > 0 ? (
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
                        <DropdownMenuItem className="text-xs text-red-600">
                          <Trash2 className="mr-2 h-3 w-3" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="text-center">
            <p className="text-lg font-semibold">{filteredExpenses.length}</p>
            <p className="text-xs text-gray-600">Total Expenses</p>
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-center">
            <p className="text-lg font-semibold">
              ${filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-600">Total Amount</p>
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-center">
            <p className="text-lg font-semibold">{filteredExpenses.filter((e) => e.status === "pending").length}</p>
            <p className="text-xs text-gray-600">Pending Approval</p>
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-center">
            <p className="text-lg font-semibold">{filteredExpenses.filter((e) => e.status === "approved").length}</p>
            <p className="text-xs text-gray-600">Approved</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
