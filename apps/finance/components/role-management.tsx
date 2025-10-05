"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { Switch } from "@workspace/ui/components/switch"
import { Badge } from "@workspace/ui/components/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Shield, Plus, Search, Edit, Users, Key, Crown, Eye, Building2 } from "lucide-react"
import { useRoles, useCreateRole, useUpdateRole } from "@/hooks/use-roles"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface RoleFormData {
  name: string
  description: string
  permissions: string[]
  isActive: boolean
  hierarchy: number
}

export function RoleManagement() {
  const mockRoles = [
    {
      id: "1",
      name: "Finance Director",
      description: "Senior executive overseeing all financial operations and strategy",
      permissions: ["all"],
      isActive: true,
      hierarchy: 5,
      userCount: 1,
      isCustom: false,
      departmentId: "finance",
    },
    {
      id: "2",
      name: "Finance Manager",
      description: "Manages day-to-day financial operations and team supervision",
      permissions: ["manage_budgets", "approve_expenses", "view_reports", "manage_department"],
      isActive: true,
      hierarchy: 4,
      userCount: 3,
      isCustom: false,
      departmentId: "finance",
    },
    {
      id: "3",
      name: "Senior Accountant",
      description: "Handles complex accounting tasks and expense approvals",
      permissions: ["approve_department", "view_reports", "manage_budgets"],
      isActive: true,
      hierarchy: 3,
      userCount: 5,
      isCustom: false,
      departmentId: "finance",
    },
    {
      id: "4",
      name: "Accounts Payable Specialist",
      description: "Processes vendor payments and expense reimbursements",
      permissions: ["approve_team", "view_reports", "submit_expenses"],
      isActive: true,
      hierarchy: 2,
      userCount: 4,
      isCustom: true,
      departmentId: "finance",
    },
    {
      id: "5",
      name: "Finance Analyst",
      description: "Analyzes financial data and prepares reports",
      permissions: ["view_reports", "submit_expenses", "view_own_expenses"],
      isActive: true,
      hierarchy: 2,
      userCount: 6,
      isCustom: false,
      departmentId: "finance",
    },
    {
      id: "6",
      name: "Finance Intern",
      description: "Entry-level position with limited access for learning",
      permissions: ["submit_expenses", "view_own_expenses"],
      isActive: true,
      hierarchy: 1,
      userCount: 2,
      isCustom: false,
      departmentId: "finance",
    },
  ]

  const { data: rolesData, isLoading } = useRoles()
  const { user: currentUser } = useAuth()
  const createRoleMutation = useCreateRole()
  const updateRoleMutation = useUpdateRole()

  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState<any>(null)

  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    description: "",
    permissions: [],
    isActive: true,
    hierarchy: 1,
  })

  const roles = mockRoles || []

  const availablePermissions = [
    {
      category: "Finance Administration",
      permissions: [
        { id: "all", label: "All Permissions", description: "Complete finance system access", level: "critical" },
        {
          id: "manage_finance_settings",
          label: "Manage Finance Settings",
          description: "Configure finance department settings",
          level: "high",
        },
        {
          id: "manage_finance_users",
          label: "Manage Finance Users",
          description: "User administration within finance",
          level: "high",
        },
        { id: "manage_roles", label: "Manage Roles", description: "Role and permission management", level: "high" },
      ],
    },
    {
      category: "Budget & Financial Planning",
      permissions: [
        {
          id: "manage_budgets",
          label: "Manage Budgets",
          description: "Create and edit departmental budgets",
          level: "medium",
        },
        { id: "approve_budgets", label: "Approve Budgets", description: "Approve budget allocations", level: "high" },
        {
          id: "view_financial_reports",
          label: "View Financial Reports",
          description: "Access financial analytics",
          level: "low",
        },
        {
          id: "create_forecasts",
          label: "Create Forecasts",
          description: "Generate financial forecasts",
          level: "medium",
        },
      ],
    },
    {
      category: "Expense Management",
      permissions: [
        { id: "submit_expenses", label: "Submit Expenses", description: "Create expense reports", level: "low" },
        { id: "view_own_expenses", label: "View Own Expenses", description: "View personal expenses", level: "low" },
        { id: "approve_expenses", label: "Approve Expenses", description: "Approve expense reports", level: "medium" },
        {
          id: "approve_all",
          label: "Approve All Expenses",
          description: "Approve any expense in finance",
          level: "high",
        },
        {
          id: "approve_department",
          label: "Approve Department Expenses",
          description: "Approve finance department expenses",
          level: "medium",
        },
        {
          id: "approve_team",
          label: "Approve Team Expenses",
          description: "Approve team member expenses",
          level: "medium",
        },
      ],
    },
    {
      category: "Accounting & Compliance",
      permissions: [
        { id: "manage_accounts", label: "Manage Accounts", description: "Handle chart of accounts", level: "medium" },
        { id: "process_payments", label: "Process Payments", description: "Handle vendor payments", level: "medium" },
        { id: "audit_access", label: "Audit Access", description: "Access audit trails and logs", level: "high" },
        {
          id: "compliance_reports",
          label: "Compliance Reports",
          description: "Generate compliance reports",
          level: "medium",
        },
      ],
    },
  ]

  // Filter roles
  const filteredRoles = roles.filter((role: any) => {
    const matchesSearch =
      role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getPermissionLevelBadge = (level: string) => {
    const levelColors: Record<string, string> = {
      critical: "bg-red-100 text-red-800",
      high: "bg-orange-100 text-orange-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    }
    return (
      <Badge className={`${levelColors[level] || "bg-gray-100 text-gray-800"} hover:${levelColors[level]} text-xs`}>
        {level}
      </Badge>
    )
  }

  const getRoleHierarchyBadge = (hierarchy: number) => {
    const hierarchyLabels: Record<number, { label: string; color: string }> = {
      5: { label: "System Admin", color: "bg-red-100 text-red-800" },
      4: { label: "Executive", color: "bg-purple-100 text-purple-800" },
      3: { label: "Manager", color: "bg-blue-100 text-blue-800" },
      2: { label: "Supervisor", color: "bg-orange-100 text-orange-800" },
      1: { label: "Employee", color: "bg-gray-100 text-gray-800" },
    }
    const config = hierarchyLabels[hierarchy] || { label: "Unknown", color: "bg-gray-100 text-gray-800" }
    return (
      <Badge className={`${config.color} hover:${config.color}`}>
        {hierarchy === 5 && <Crown className="w-3 h-3 mr-1" />}
        {config.label}
      </Badge>
    )
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactive</Badge>
    )
  }

  const handleCreateRole = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("Role name is required")
        return
      }
      if (!formData.description.trim()) {
        toast.error("Role description is required")
        return
      }
      if (formData.permissions.length === 0) {
        toast.error("At least one permission is required")
        return
      }

      await createRoleMutation.mutateAsync(formData)
      setShowCreateDialog(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to create role")
    }
  }

  const handleEditRole = (role: any) => {
    setSelectedRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions || [],
      isActive: role.isActive,
      hierarchy: role.hierarchy || 1,
    })
    setShowEditDialog(true)
  }

  const handleUpdateRole = async () => {
    try {
      if (!selectedRole) return

      await updateRoleMutation.mutateAsync({
        id: selectedRole.id,
        data: formData,
      })
      setShowEditDialog(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to update role")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      permissions: [],
      isActive: true,
      hierarchy: 1,
    })
    setSelectedRole(null)
  }

  const canManageRoles = currentUser?.permissions?.includes("all") || currentUser?.permissions?.includes("manage_roles")

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
              <h1 className="text-2xl font-bold">Finance Department - Role Management</h1>
              <p className="text-sm text-gray-600">Manage roles and permissions within the Finance Department</p>
            </div>
          </div>
        </div>
        {canManageRoles && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="h-9 px-4">
                <Plus className="w-4 h-4 mr-2" />
                Create Finance Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Finance Role</DialogTitle>
                <DialogDescription>
                  Define a new role with specific permissions for the Finance Department
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Role Name *</Label>
                    <Input
                      placeholder="e.g., Finance Manager"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Hierarchy Level *</Label>
                    <select
                      className="w-full h-9 px-3 border border-gray-300 rounded-md text-sm"
                      value={formData.hierarchy}
                      onChange={(e) => setFormData({ ...formData, hierarchy: Number(e.target.value) })}
                    >
                      <option value={1}>Level 1 - Employee</option>
                      <option value={2}>Level 2 - Supervisor</option>
                      <option value={3}>Level 3 - Manager</option>
                      <option value={4}>Level 4 - Executive</option>
                      <option value={5}>Level 5 - System Admin</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Description *</Label>
                  <Textarea
                    placeholder="Describe the role's responsibilities and scope"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Permissions *</Label>
                  <div className="max-h-80 overflow-y-auto border rounded p-4 space-y-4">
                    {availablePermissions.map((category) => (
                      <div key={category.category} className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700">{category.category}</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {category.permissions.map((permission) => (
                            <div key={permission.id} className="flex items-start space-x-3 p-2 border rounded">
                              <input
                                type="checkbox"
                                id={permission.id}
                                className="mt-1"
                                checked={formData.permissions.includes(permission.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({
                                      ...formData,
                                      permissions: [...formData.permissions, permission.id],
                                    })
                                  } else {
                                    setFormData({
                                      ...formData,
                                      permissions: formData.permissions.filter((p) => p !== permission.id),
                                    })
                                  }
                                }}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                                    {permission.label}
                                  </Label>
                                  {getPermissionLevelBadge(permission.level)}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Active Role</Label>
                    <p className="text-xs text-gray-600">Role can be assigned to users</p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1" onClick={handleCreateRole} disabled={createRoleMutation.isPending}>
                    {createRoleMutation.isPending ? "Creating..." : "Create Role"}
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
                <p className="text-sm text-gray-600">Finance Roles</p>
                <p className="text-2xl font-bold">{roles.length}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Roles</p>
                <p className="text-2xl font-bold">{roles.filter((r: any) => r.isActive).length}</p>
              </div>
              <Key className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Management Roles</p>
                <p className="text-2xl font-bold">{roles.filter((r: any) => r.hierarchy >= 4).length}</p>
              </div>
              <Crown className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">
                  {roles.reduce((sum: number, r: any) => sum + (r.userCount || 0), 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search roles..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Finance Department Roles ({filteredRoles.length})</CardTitle>
          <CardDescription>Manage roles and their associated permissions within the Finance Department</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Hierarchy</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role: any) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{role.name}</p>
                        <p className="text-sm text-gray-500">{role.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleHierarchyBadge(role.hierarchy)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Key className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{role.permissions?.length || 0} permissions</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{role.userCount || 0} users</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(role.isActive)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {canManageRoles && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditRole(role)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update role information and permissions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Role Name *</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Hierarchy Level *</Label>
                <select
                  className="w-full h-9 px-3 border border-gray-300 rounded-md text-sm"
                  value={formData.hierarchy}
                  onChange={(e) => setFormData({ ...formData, hierarchy: Number(e.target.value) })}
                >
                  <option value={1}>Level 1 - Employee</option>
                  <option value={2}>Level 2 - Supervisor</option>
                  <option value={3}>Level 3 - Manager</option>
                  <option value={4}>Level 4 - Executive</option>
                  <option value={5}>Level 5 - System Admin</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Description *</Label>
              <Textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Permissions *</Label>
              <div className="max-h-80 overflow-y-auto border rounded p-4 space-y-4">
                {availablePermissions.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700">{category.category}</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {category.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-3 p-2 border rounded">
                          <input
                            type="checkbox"
                            id={`edit-${permission.id}`}
                            className="mt-1"
                            checked={formData.permissions.includes(permission.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  permissions: [...formData.permissions, permission.id],
                                })
                              } else {
                                setFormData({
                                  ...formData,
                                  permissions: formData.permissions.filter((p) => p !== permission.id),
                                })
                              }
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`edit-${permission.id}`} className="text-sm font-medium cursor-pointer">
                                {permission.label}
                              </Label>
                              {getPermissionLevelBadge(permission.level)}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Active Role</Label>
                <p className="text-xs text-gray-600">Role can be assigned to users</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1" onClick={handleUpdateRole} disabled={updateRoleMutation.isPending}>
                {updateRoleMutation.isPending ? "Updating..." : "Update Role"}
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
