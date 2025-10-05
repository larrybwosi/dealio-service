"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Switch } from "@workspace/ui/components/switch"
import { Badge } from "@workspace/ui/components/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Users, UserPlus, Search, Edit, Shield, Building, DollarSign, UserCheck, UserX, Crown, Key } from "lucide-react"
import { useUsers, useUpdateUser } from "@/hooks/use-users"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface UserFormData {
  name: string
  email: string
  role: string
  department: string
  permissions: string[]
  maxApprovalAmount: number
  isActive: boolean
}

export function UserManagement() {
  const { data: usersData, isLoading } = useUsers()
  const { user: currentUser } = useAuth()
  const updateUserMutation = useUpdateUser()

  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "Employee",
    department: "",
    permissions: [],
    maxApprovalAmount: 0,
    isActive: true,
  })

  const users = usersData?.data || []
  const roles = ["Admin", "Manager", "Finance Manager", "Department Head", "Team Lead", "Employee"]
  const departments = ["IT", "Finance", "Operations", "Marketing", "HR", "Sales", "Legal"]
  const availablePermissions = [
    { id: "all", label: "All Permissions", description: "Full system access" },
    { id: "submit_expenses", label: "Submit Expenses", description: "Create expense reports" },
    { id: "view_own_expenses", label: "View Own Expenses", description: "View personal expenses" },
    { id: "approve_expenses", label: "Approve Expenses", description: "Approve expense reports" },
    { id: "approve_all", label: "Approve All", description: "Approve any expense" },
    { id: "approve_department", label: "Approve Department", description: "Approve department expenses" },
    { id: "approve_team", label: "Approve Team", description: "Approve team expenses" },
    { id: "manage_budgets", label: "Manage Budgets", description: "Create and edit budgets" },
    { id: "view_reports", label: "View Reports", description: "Access analytics and reports" },
    { id: "manage_users", label: "Manage Users", description: "User administration" },
    { id: "manage_department", label: "Manage Department", description: "Department administration" },
    { id: "system_settings", label: "System Settings", description: "Configure system settings" },
  ]

  // Filter users
  const filteredUsers = users.filter((user: any) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter
    return matchesSearch && matchesRole && matchesDepartment
  })

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      Admin: "bg-red-100 text-red-800",
      Manager: "bg-blue-100 text-blue-800",
      "Finance Manager": "bg-green-100 text-green-800",
      "Department Head": "bg-purple-100 text-purple-800",
      "Team Lead": "bg-orange-100 text-orange-800",
      Employee: "bg-gray-100 text-gray-800",
    }
    return (
      <Badge className={`${roleColors[role] || "bg-gray-100 text-gray-800"} hover:${roleColors[role]}`}>
        {role === "Admin" && <Crown className="w-3 h-3 mr-1" />}
        {role}
      </Badge>
    )
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <UserCheck className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        <UserX className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    )
  }

  const handleCreateUser = async () => {
    try {
      // Validation
      if (!formData.name.trim()) {
        toast.error("Name is required")
        return
      }
      if (!formData.email.trim()) {
        toast.error("Email is required")
        return
      }
      if (!formData.department) {
        toast.error("Department is required")
        return
      }

      // Create user logic would go here
      toast.success("User created successfully")
      setShowCreateDialog(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to create user")
    }
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      permissions: user.permissions || [],
      maxApprovalAmount: user.maxApprovalAmount || 0,
      isActive: user.isActive,
    })
    setShowEditDialog(true)
  }

  const handleUpdateUser = async () => {
    try {
      if (!selectedUser) return

      await updateUserMutation.mutateAsync({
        id: selectedUser.id,
        data: formData,
      })
      setShowEditDialog(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to update user")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "Employee",
      department: "",
      permissions: [],
      maxApprovalAmount: 0,
      isActive: true,
    })
    setSelectedUser(null)
  }

  const toggleUserStatus = async (user: any) => {
    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        data: { ...user, isActive: !user.isActive },
      })
    } catch (error) {
      toast.error("Failed to update user status")
    }
  }

  const canManageUsers = currentUser?.permissions?.includes("all") || currentUser?.permissions?.includes("manage_users")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-gray-600">Manage system users, roles, and permissions</p>
        </div>
        {canManageUsers && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="h-9 px-4">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account with appropriate permissions</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Full Name *</Label>
                    <Input
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Email Address *</Label>
                    <Input
                      type="email"
                      placeholder="john.doe@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Role *</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Maximum Approval Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pl-9"
                      value={formData.maxApprovalAmount || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, maxApprovalAmount: Number.parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Permissions</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-3">
                    {availablePermissions.map((permission) => (
                      <div key={permission.id} className="flex items-start space-x-2">
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
                        <div>
                          <Label htmlFor={permission.id} className="text-xs font-medium cursor-pointer">
                            {permission.label}
                          </Label>
                          <p className="text-xs text-gray-500">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Active User</Label>
                    <p className="text-xs text-gray-600">User can access the system</p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1" onClick={handleCreateUser}>
                    Create User
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
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{users.filter((u: any) => u.isActive).length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-2xl font-bold">{new Set(users.map((u: any) => u.department)).size}</p>
              </div>
              <Building className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approvers</p>
                <p className="text-2xl font-bold">
                  {users.filter((u: any) => u.permissions?.some((p: string) => p.includes("approve"))).length}
                </p>
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
                placeholder="Search users..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Max Approval</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {user.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4 text-gray-400" />
                      {user.department}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Key className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{user.permissions?.length || 0} permissions</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.maxApprovalAmount ? (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span>${user.maxApprovalAmount.toLocaleString()}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {canManageUsers && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleUserStatus(user)}
                          >
                            {user.isActive ? (
                              <UserX className="h-4 w-4 text-red-600" />
                            ) : (
                              <UserCheck className="h-4 w-4 text-green-600" />
                            )}
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

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and permissions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Full Name *</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Email Address *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Department *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Maximum Approval Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="0.00"
                  className="pl-9"
                  value={formData.maxApprovalAmount || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, maxApprovalAmount: Number.parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Permissions</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-3">
                {availablePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-start space-x-2">
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
                    <div>
                      <Label htmlFor={`edit-${permission.id}`} className="text-xs font-medium cursor-pointer">
                        {permission.label}
                      </Label>
                      <p className="text-xs text-gray-500">{permission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Active User</Label>
                <p className="text-xs text-gray-600">User can access the system</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1" onClick={handleUpdateUser} disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? "Updating..." : "Update User"}
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
