"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { Textarea } from "@repo/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select"
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
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit,
  Users,
  DollarSign,
  UserPlus,
  UserMinus,
  Eye,
  Crown,
  Shield,
} from "lucide-react"
import { useDepartments, useCreateDepartment, useUpdateDepartment } from "@/hooks/use-departments"
import { useUsers } from "@/hooks/use-users"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface DepartmentFormData {
  name: string
  code: string
  description: string
  managerId: string
  budget: number
  isActive: boolean
}

export function DepartmentManagement() {
  const mockFinanceDepartment = {
    id: "finance-001",
    name: "Finance Department",
    code: "FIN",
    description:
      "Responsible for financial planning, budgeting, accounting, and expense management across the organization",
    managerId: "user-001",
    budget: 2500000,
    isActive: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-12-01",
  }

  const mockFinanceUsers = [
    {
      id: "user-001",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "Finance Director",
      department: "Finance Department",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fHww",
      permissions: ["all"],
      isActive: true,
      hierarchy: 5,
    },
    {
      id: "user-002",
      name: "Michael Chen",
      email: "michael.chen@company.com",
      role: "Finance Manager",
      department: "Finance Department",
      avatar: "/professional-man.png",
      permissions: [
        "manage_budgets",
        "approve_expenses",
        "view_reports",
        "manage_department",
      ],
      isActive: true,
      hierarchy: 4,
    },
    {
      id: "user-003",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      role: "Senior Accountant",
      department: "Finance Department",
      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
      permissions: ["approve_department", "view_reports", "manage_budgets"],
      isActive: true,
      hierarchy: 3,
    },
    {
      id: "user-004",
      name: "David Kim",
      email: "david.kim@company.com",
      role: "Accounts Payable Specialist",
      department: "Finance Department",
      avatar: "/professional-analyst.png",
      permissions: ["approve_team", "view_reports", "submit_expenses"],
      isActive: true,
      hierarchy: 2,
    },
    {
      id: "user-005",
      name: "Lisa Thompson",
      email: "lisa.thompson@company.com",
      role: "Finance Analyst",
      department: "Finance Department",
      avatar:
        "https://plus.unsplash.com/premium_photo-1673957923985-b814a9dbc03d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
      permissions: ["view_reports", "submit_expenses", "view_own_expenses"],
      isActive: true,
      hierarchy: 2,
    },
    {
      id: "user-006",
      name: "James Wilson",
      email: "james.wilson@company.com",
      role: "Finance Analyst",
      department: "Finance Department",
      avatar:
        "https://media.istockphoto.com/id/2164732058/photo/mature-business-and-man-with-tablet-outdoor-for-communication-research-and-typing-email-on.webp?a=1&b=1&s=612x612&w=0&k=20&c=TvDlQXszOaxSi6n1U_hHGbVMGqAS_oXVx4JoeCBawm4=",
      permissions: ["view_reports", "submit_expenses", "view_own_expenses"],
      isActive: true,
      hierarchy: 2,
    },
    {
      id: "user-007",
      name: "Amanda Foster",
      email: "amanda.foster@company.com",
      role: "Accounts Receivable Specialist",
      department: "Finance Department",
      avatar: "/professional-woman-specialist.png",
      permissions: ["approve_team", "view_reports", "submit_expenses"],
      isActive: true,
      hierarchy: 2,
    },
    {
      id: "user-008",
      name: "Robert Martinez",
      email: "robert.martinez@company.com",
      role: "Budget Analyst",
      department: "Finance Department",
      avatar: "/professional-man-budget.png",
      permissions: ["manage_budgets", "view_reports", "submit_expenses"],
      isActive: true,
      hierarchy: 2,
    },
    {
      id: "user-009",
      name: "Jennifer Lee",
      email: "jennifer.lee@company.com",
      role: "Finance Intern",
      department: "Finance Department",
      avatar: "/young-professional-woman.png",
      permissions: ["submit_expenses", "view_own_expenses"],
      isActive: true,
      hierarchy: 1,
    },
    {
      id: "user-010",
      name: "Alex Turner",
      email: "alex.turner@company.com",
      role: "Finance Intern",
      department: "Finance Department",
      avatar:
        "https://plus.unsplash.com/premium_photo-1663054774427-55adfb2be76f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVvcGxlfGVufDB8fDB8fHww",
      permissions: ["submit_expenses", "view_own_expenses"],
      isActive: true,
      hierarchy: 1,
    },
  ];

  const { data: departmentsData, isLoading } = useDepartments()
  const { data: usersData } = useUsers()
  const { user: currentUser } = useAuth()
  const createDepartmentMutation = useCreateDepartment()
  const updateDepartmentMutation = useUpdateDepartment()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showMembersDialog, setShowMembersDialog] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)

  const [formData, setFormData] = useState<DepartmentFormData>({
    name: "",
    code: "",
    description: "",
    managerId: "",
    budget: 0,
    isActive: true,
  })

  const departments = [mockFinanceDepartment] || []
  const users = mockFinanceUsers || []
  const managers = users.filter(
    (user: any) =>
      user.permissions?.includes("manage_department") ||
      user.role === "Manager" ||
      user.role === "Department Head" ||
      user.hierarchy >= 4,
  )

  // Filter departments
  const filteredDepartments = departments.filter((dept: any) => {
    const matchesSearch =
      dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? dept.isActive : !dept.isActive)
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactive</Badge>
    )
  }

  const getDepartmentMembers = (departmentName: string) => {
    return users.filter((user: any) => user.department === departmentName)
  }

  const handleCreateDepartment = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("Department name is required")
        return
      }
      if (!formData.code.trim()) {
        toast.error("Department code is required")
        return
      }

      await createDepartmentMutation.mutateAsync(formData)
      setShowCreateDialog(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to create department")
    }
  }

  const handleEditDepartment = (department: any) => {
    setSelectedDepartment(department)
    setFormData({
      name: department.name,
      code: department.code,
      description: department.description || "",
      managerId: department.managerId || "",
      budget: department.budget || 0,
      isActive: department.isActive,
    })
    setShowEditDialog(true)
  }

  const handleUpdateDepartment = async () => {
    try {
      if (!selectedDepartment) return

      await updateDepartmentMutation.mutateAsync({
        id: selectedDepartment.id,
        data: formData,
      })
      setShowEditDialog(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to update department")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      managerId: "",
      budget: 0,
      isActive: true,
    })
    setSelectedDepartment(null)
  }

  const viewDepartmentMembers = (department: any) => {
    setSelectedDepartment(department)
    setShowMembersDialog(true)
  }

  const canManageDepartments =
    currentUser?.permissions?.includes("all") || currentUser?.permissions?.includes("manage_department")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Finance Department Management</h1>
              <p className="text-sm text-gray-600">
                Manage Finance Department structure, members, and budget allocation
              </p>
            </div>
          </div>
        </div>
        {canManageDepartments && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="h-9 px-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Sub-Department
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Finance Sub-Department</DialogTitle>
                <DialogDescription>Add a new sub-department within Finance</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Sub-Department Name *</Label>
                    <Input
                      placeholder="e.g., Accounts Payable"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Department Code *</Label>
                    <Input
                      placeholder="e.g., AP"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Description</Label>
                  <Textarea
                    placeholder="Brief description of the sub-department's role and responsibilities"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sub-Department Manager</Label>
                  <Select
                    value={formData.managerId}
                    onValueChange={(value) => setFormData({ ...formData, managerId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {managers.map((manager: any) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={manager.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {manager.name
                                  ?.split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span>{manager.name}</span>
                            <span className="text-gray-500 text-sm">({manager.role})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Annual Budget Allocation</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pl-9"
                      value={formData.budget || ""}
                      onChange={(e) => setFormData({ ...formData, budget: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Active Sub-Department</Label>
                    <p className="text-xs text-gray-600">Sub-department is operational</p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1"
                    onClick={handleCreateDepartment}
                    disabled={createDepartmentMutation.isPending}
                  >
                    {createDepartmentMutation.isPending ? "Creating..." : "Create Sub-Department"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Department Budget</p>
                <p className="text-2xl font-bold">${mockFinanceDepartment.budget.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Management Level</p>
                <p className="text-2xl font-bold">{users.filter((u: any) => u.hierarchy >= 4).length}</p>
              </div>
              <Crown className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Roles</p>
                <p className="text-2xl font-bold">{new Set(users.map((u) => u.role)).size}</p>
              </div>
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search department members..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Finance Department Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Finance Department Overview</CardTitle>
          <CardDescription>Current department structure and team composition</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((department: any) => {
                const members = getDepartmentMembers(department.name)
                const manager = users.find((u: any) => u.id === department.managerId)

                return (
                  <TableRow key={department.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">{department.code}</span>
                        </div>
                        <div>
                          <p className="font-medium">{department.name}</p>
                          <p className="text-sm text-gray-500">{department.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {manager ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={manager.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {manager.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{manager.name}</p>
                            <p className="text-xs text-gray-500">{manager.role}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No manager assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => viewDepartmentMembers(department)}
                      >
                        <Users className="w-4 h-4 mr-1" />
                        {members.length} members
                      </Button>
                    </TableCell>
                    <TableCell>
                      {department.budget ? (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span>${department.budget.toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">No budget set</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(department.isActive)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {canManageDepartments && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditDepartment(department)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => viewDepartmentMembers(department)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Department Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>Update department information and settings</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Department Name *</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Department Code *</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Department Manager</Label>
              <Select
                value={formData.managerId}
                onValueChange={(value) => setFormData({ ...formData, managerId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  {managers.map((manager: any) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={manager.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {manager.name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{manager.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Annual Budget</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  className="pl-9"
                  value={formData.budget || ""}
                  onChange={(e) => setFormData({ ...formData, budget: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Active Department</Label>
                <p className="text-xs text-gray-600">Department is operational</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1" onClick={handleUpdateDepartment} disabled={updateDepartmentMutation.isPending}>
                {updateDepartmentMutation.isPending ? "Updating..." : "Update Department"}
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Department Members Dialog */}
      <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Finance Department Members</DialogTitle>
            <DialogDescription>
              {selectedDepartment?.name} - {getDepartmentMembers(selectedDepartment?.name || "").length} members
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative flex-1 mr-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search members..." className="pl-9" />
              </div>
              {canManageDepartments && (
                <Button size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Hierarchy</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="w-16">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getDepartmentMembers(selectedDepartment?.name || "").map((member: any) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{member.name?.split(" ").map((n: string) => n[0])}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {member.hierarchy >= 4 && <Crown className="w-3 h-3 mr-1" />}
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            member.hierarchy >= 4
                              ? "bg-purple-100 text-purple-800"
                              : member.hierarchy >= 3
                                ? "bg-blue-100 text-blue-800"
                                : member.hierarchy >= 2
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                          }
                        >
                          Level {member.hierarchy}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{member.permissions?.length || 0} permissions</span>
                      </TableCell>
                      <TableCell>
                        {canManageDepartments && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
