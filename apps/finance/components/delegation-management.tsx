"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { Textarea } from "@repo/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select"
import { Calendar } from "@repo/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover"
import { Switch } from "@repo/ui/switch"
import { Badge } from "@repo/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog"
import { format } from "date-fns"
import {
  CalendarIcon,
  Users,
  UserCheck,
  Clock,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  XCircle,
  Loader2,
  Send,
  Eye,
  History,
} from "lucide-react"
import { useDelegations, useCreateDelegation } from "@/hooks/use-delegations"
import { useUsers } from "@/hooks/use-users"
import { useCategories } from "@/hooks/use-categories"
import { toast } from "sonner"

interface DelegationFormData {
  delegateId: string
  startDate: Date | undefined
  endDate: Date | undefined
  maxAmount: number
  categories: string[]
  reason: string
  sendNotification: boolean
  autoActivate: boolean
}

export function DelegationManagement() {
  const { data: delegationsData, isLoading: delegationsLoading } = useDelegations()
  const { data: usersData } = useUsers()
  const { data: categoriesData } = useCategories()
  const createDelegationMutation = useCreateDelegation()

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDelegation, setSelectedDelegation] = useState<any>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  const [formData, setFormData] = useState<DelegationFormData>({
    delegateId: "",
    startDate: undefined,
    endDate: undefined,
    maxAmount: 0,
    categories: [],
    reason: "",
    sendNotification: true,
    autoActivate: true,
  })

  const delegations = delegationsData?.data || []
  const availableUsers = usersData?.data || []
  const categories = categoriesData?.data || [
    "Office Supplies",
    "Travel & Transportation",
    "Software & Subscriptions",
    "Marketing & Advertising",
    "Training & Development",
    "Meals & Entertainment",
    "Equipment & Hardware",
  ]

  // Filter delegations
  const filteredDelegations = delegations.filter((delegation: any) => {
    const matchesSearch =
      delegation.delegatedTo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delegation.reason?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || delegation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <UserCheck className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "expired":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <Clock className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "revoked":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Revoked
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const activeDelegations = delegations.filter((d: any) => d.status === "active")
  const totalDelegatedAmount = activeDelegations.reduce((sum: number, d: any) => sum + (d.maxAmount || 0), 0)
  const expiringDelegations = delegations.filter((d: any) => {
    if (d.status !== "active") return false
    const endDate = new Date(d.endDate)
    const today = new Date()
    const diffDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 3 && diffDays >= 0
  })

  const handleCreateDelegation = async () => {
    try {
      // Validation
      if (!formData.delegateId) {
        toast.error("Please select a delegate")
        return
      }
      if (!formData.startDate || !formData.endDate) {
        toast.error("Please select start and end dates")
        return
      }
      if (formData.maxAmount <= 0) {
        toast.error("Maximum amount must be greater than 0")
        return
      }
      if (!formData.reason.trim()) {
        toast.error("Please provide a reason for delegation")
        return
      }

      const delegationData = {
        delegateId: formData.delegateId,
        startDate: formData.startDate.toISOString().split("T")[0],
        endDate: formData.endDate.toISOString().split("T")[0],
        maxAmount: formData.maxAmount,
        categories: formData.categories,
        reason: formData.reason,
        sendNotification: formData.sendNotification,
        status: formData.autoActivate ? "active" : "pending",
      }

      await createDelegationMutation.mutateAsync(delegationData)
      setShowCreateDialog(false)
      setFormData({
        delegateId: "",
        startDate: undefined,
        endDate: undefined,
        maxAmount: 0,
        categories: [],
        reason: "",
        sendNotification: true,
        autoActivate: true,
      })
    } catch (error) {
      console.error("Error creating delegation:", error)
    }
  }

  const viewDelegationDetails = (delegation: any) => {
    setSelectedDelegation(delegation)
    setShowDetailsDialog(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Delegation Management</h1>
          <p className="text-sm text-gray-600">Delegate approval authority to other team members</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="h-9 px-4">
              <Plus className="w-4 h-4 mr-2" />
              New Delegation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Delegation</DialogTitle>
              <DialogDescription>Delegate your approval authority to another team member</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Delegate to *</Label>
                <Select
                  value={formData.delegateId}
                  onValueChange={(value) => setFormData({ ...formData, delegateId: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {user.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                          <span className="text-gray-500 text-sm">({user.role})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "MMM dd") : <span>Start</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData({ ...formData, startDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "MMM dd") : <span>End</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData({ ...formData, endDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Maximum Approval Amount *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="0.00"
                    className="h-9 pl-9"
                    type="number"
                    value={formData.maxAmount || ""}
                    onChange={(e) => setFormData({ ...formData, maxAmount: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Categories (optional)</Label>
                <Select>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Reason for delegation *</Label>
                <Textarea
                  placeholder="e.g., Vacation, Business trip, Project coverage..."
                  className="resize-none"
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Send notification</Label>
                    <p className="text-xs text-gray-600">Notify delegate about new authority</p>
                  </div>
                  <Switch
                    checked={formData.sendNotification}
                    onCheckedChange={(checked) => setFormData({ ...formData, sendNotification: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Auto-activate</Label>
                    <p className="text-xs text-gray-600">Start delegation immediately</p>
                  </div>
                  <Switch
                    checked={formData.autoActivate}
                    onCheckedChange={(checked) => setFormData({ ...formData, autoActivate: checked })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 h-9"
                  onClick={handleCreateDelegation}
                  disabled={createDelegationMutation.isPending}
                >
                  {createDelegationMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Create Delegation
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-9 bg-transparent"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Delegations</p>
                <p className="text-2xl font-bold">{activeDelegations.length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Delegated</p>
                <p className="text-2xl font-bold">${totalDelegatedAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unique Delegates</p>
                <p className="text-2xl font-bold">
                  {new Set(activeDelegations.map((d: any) => d.delegatedTo?.name)).size}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold">{expiringDelegations.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search delegations..."
                className="h-9 pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Delegations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Delegations</CardTitle>
          <CardDescription>Manage approval authority delegations ({filteredDelegations.length} total)</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {delegationsLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading delegations...</span>
            </div>
          ) : filteredDelegations.length === 0 ? (
            <div className="text-center p-8">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No delegations found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first delegation to get started"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Delegation
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Delegate</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Max Amount</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDelegations.map((delegation: any) => (
                  <TableRow key={delegation.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={delegation.delegatedTo?.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {delegation.delegatedTo?.name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{delegation.delegatedTo?.name}</p>
                          <p className="text-sm text-gray-500">{delegation.delegatedTo?.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">
                          {delegation.startDate} - {delegation.endDate}
                        </p>
                        <p className="text-xs text-gray-500">{delegation.reason}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">${delegation.maxAmount?.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {delegation.categories?.slice(0, 2).map((category: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                        {delegation.categories?.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{delegation.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(delegation.status)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{delegation.expensesApproved || 0} approved</p>
                        <p className="text-xs text-gray-500">
                          ${(delegation.totalApproved || 0).toLocaleString()} total
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => viewDelegationDetails(delegation)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                          <Trash2 className="h-4 w-4" />
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

      {/* Delegation Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Delegation Details</DialogTitle>
            <DialogDescription>View detailed information about this delegation</DialogDescription>
          </DialogHeader>
          {selectedDelegation && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Delegate</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedDelegation.delegatedTo?.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {selectedDelegation.delegatedTo?.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{selectedDelegation.delegatedTo?.name}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedDelegation.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Start Date</Label>
                  <p className="mt-1">{selectedDelegation.startDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">End Date</Label>
                  <p className="mt-1">{selectedDelegation.endDate}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Maximum Amount</Label>
                <p className="mt-1 text-lg font-semibold">${selectedDelegation.maxAmount?.toLocaleString()}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Reason</Label>
                <p className="mt-1">{selectedDelegation.reason}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Activity Summary</Label>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Expenses Approved</p>
                    <p className="text-xl font-bold text-green-700">{selectedDelegation.expensesApproved || 0}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Total Amount</p>
                    <p className="text-xl font-bold text-blue-700">
                      ${(selectedDelegation.totalApproved || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Button variant="outline" size="sm" className="h-9 bg-transparent">
              <Users className="w-4 h-4 mr-2" />
              Bulk Delegate
            </Button>
            <Button variant="outline" size="sm" className="h-9 bg-transparent">
              <Clock className="w-4 h-4 mr-2" />
              Extend Active
            </Button>
            <Button variant="outline" size="sm" className="h-9 bg-transparent">
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
            <Button variant="outline" size="sm" className="h-9 bg-transparent">
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
