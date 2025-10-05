"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Checkbox } from "@workspace/ui/components/checkbox"
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
import {
  Users,
  UserPlus,
  UserMinus,
  Search,
  Filter,
  ArrowRightLeft,
  Crown,
  Building,
  CheckCircle,
  History,
  Download,
} from "lucide-react"
import { useUsers } from "@/hooks/use-users"
import { useDepartments } from "@/hooks/use-departments"
import { useAuth } from "@/hooks/use-auth"
import { useMemberOperations } from "@/hooks/use-member-operations"
import { toast } from "sonner"

interface BulkOperationData {
  operation: "add" | "remove" | "transfer"
  selectedUsers: string[]
  targetDepartment: string
  sourceDepartment?: string
  reason: string
}

export function MemberOperations() {
  const { data: usersData } = useUsers()
  const { data: departmentsData } = useDepartments()
  const { user: currentUser } = useAuth()
  const { addMemberMutation, removeMemberMutation, transferMemberMutation, bulkOperationMutation } =
    useMemberOperations()

  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showBulkDialog, setShowBulkDialog] = useState(false)
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)

  const [bulkData, setBulkData] = useState<BulkOperationData>({
    operation: "add",
    selectedUsers: [],
    targetDepartment: "",
    sourceDepartment: "",
    reason: "",
  })

  const [transferData, setTransferData] = useState({
    userId: "",
    fromDepartment: "",
    toDepartment: "",
    reason: "",
    effectiveDate: "",
  })

  const [addMemberData, setAddMemberData] = useState({
    userId: "",
    department: "",
    role: "",
    startDate: "",
  })

  const users = usersData?.data || []
  const departments = departmentsData?.data || []
  const roles = ["Admin", "Manager", "Finance Manager", "Department Head", "Team Lead", "Employee"]

  // Filter users
  const filteredUsers = users.filter((user: any) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesDepartment && matchesRole
  })

  const availableUsers = users.filter((user: any) => !user.department || user.department === "")
  const departmentCounts = departments.map((dept: any) => ({
    ...dept,
    memberCount: users.filter((user: any) => user.department === dept.name).length,
  }))

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((user: any) => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleBulkOperation = async () => {
    try {
      if (selectedUsers.length === 0) {
        toast.error("Please select at least one user")
        return
      }
      if (!bulkData.targetDepartment) {
        toast.error("Please select a target department")
        return
      }
      if (!bulkData.reason.trim()) {
        toast.error("Please provide a reason for this operation")
        return
      }

      await bulkOperationMutation.mutateAsync({
        ...bulkData,
        selectedUsers,
      })

      setShowBulkDialog(false)
      setSelectedUsers([])
      setBulkData({
        operation: "add",
        selectedUsers: [],
        targetDepartment: "",
        sourceDepartment: "",
        reason: "",
      })
    } catch (error) {
      toast.error("Failed to perform bulk operation")
    }
  }

  const handleTransferMember = async () => {
    try {
      if (!transferData.userId || !transferData.fromDepartment || !transferData.toDepartment) {
        toast.error("Please fill in all required fields")
        return
      }
      if (!transferData.reason.trim()) {
        toast.error("Please provide a reason for the transfer")
        return
      }

      await transferMemberMutation.mutateAsync(transferData)
      setShowTransferDialog(false)
      setTransferData({
        userId: "",
        fromDepartment: "",
        toDepartment: "",
        reason: "",
        effectiveDate: "",
      })
    } catch (error) {
      toast.error("Failed to transfer member")
    }
  }

  const handleAddMember = async () => {
    try {
      if (!addMemberData.userId || !addMemberData.department) {
        toast.error("Please select user and department")
        return
      }

      await addMemberMutation.mutateAsync(addMemberData)
      setShowAddMemberDialog(false)
      setAddMemberData({
        userId: "",
        department: "",
        role: "",
        startDate: "",
      })
    } catch (error) {
      toast.error("Failed to add member")
    }
  }

  const handleRemoveMember = async (userId: string, department: string) => {
    try {
      await removeMemberMutation.mutateAsync({ userId, department })
    } catch (error) {
      toast.error("Failed to remove member")
    }
  }

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

  const canManageMembers =
    currentUser?.permissions?.includes("all") ||
    currentUser?.permissions?.includes("manage_users") ||
    currentUser?.permissions?.includes("manage_department")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Member Operations</h1>
          <p className="text-sm text-gray-600">
            Manage team members across departments
          </p>
        </div>
        <div className="flex gap-2">
          {canManageMembers && (
            <>
              <Dialog
                open={showAddMemberDialog}
                onOpenChange={setShowAddMemberDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-9 px-4 bg-transparent">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add Member to Department</DialogTitle>
                    <DialogDescription>
                      Assign a user to a department
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Select User *
                      </Label>
                      <Select
                        value={addMemberData.userId}
                        onValueChange={(value) =>
                          setAddMemberData({ ...addMemberData, userId: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose user" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableUsers.map((user: any) => (
                            <SelectItem key={user.id} value={user.id}>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage
                                    src={user.avatar || "/placeholder.svg"}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {user.name
                                      ?.split(" ")
                                      .map((n: string) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{user.name}</span>
                                <span className="text-gray-500 text-sm">
                                  ({user.email})
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Department *
                      </Label>
                      <Select
                        value={addMemberData.department}
                        onValueChange={(value) =>
                          setAddMemberData({
                            ...addMemberData,
                            department: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept: any) => (
                            <SelectItem key={dept.id} value={dept.name}>
                              {dept.name} ({dept.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Role</Label>
                      <Select
                        value={addMemberData.role}
                        onValueChange={(value) =>
                          setAddMemberData({ ...addMemberData, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
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
                      <Label className="text-sm font-medium">Start Date</Label>
                      <Input
                        type="date"
                        value={addMemberData.startDate}
                        onChange={(e) =>
                          setAddMemberData({
                            ...addMemberData,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        className="flex-1"
                        onClick={handleAddMember}
                        disabled={addMemberMutation.isPending}
                      >
                        {addMemberMutation.isPending
                          ? "Adding..."
                          : "Add Member"}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => setShowAddMemberDialog(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog
                open={showTransferDialog}
                onOpenChange={setShowTransferDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-9 px-4 bg-transparent">
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Transfer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Transfer Member</DialogTitle>
                    <DialogDescription>
                      Move a member between departments
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Select Member *
                      </Label>
                      <Select
                        value={transferData.userId}
                        onValueChange={(value) => {
                          const user = users.find((u: any) => u.id === value);
                          setTransferData({
                            ...transferData,
                            userId: value,
                            fromDepartment: user?.department || "",
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose member" />
                        </SelectTrigger>
                        <SelectContent>
                          {users
                            .filter((u: any) => u.department)
                            .map((user: any) => (
                              <SelectItem key={user.id} value={user.id}>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-5 w-5">
                                    <AvatarImage
                                      src={user.avatar || "/placeholder.svg"}
                                    />
                                    <AvatarFallback className="text-xs">
                                      {user.name
                                        ?.split(" ")
                                        .map((n: string) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{user.name}</span>
                                  <span className="text-gray-500 text-sm">
                                    ({user.department})
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          From Department
                        </Label>
                        <Input value={transferData.fromDepartment} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          To Department *
                        </Label>
                        <Select
                          value={transferData.toDepartment}
                          onValueChange={(value) =>
                            setTransferData({
                              ...transferData,
                              toDepartment: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments
                              .filter(
                                (dept: any) =>
                                  dept.name !== transferData.fromDepartment
                              )
                              .map((dept: any) => (
                                <SelectItem key={dept.id} value={dept.name}>
                                  {dept.name} ({dept.code})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Reason for Transfer *
                      </Label>
                      <Input
                        placeholder="e.g., Promotion, Reorganization, Project needs"
                        value={transferData.reason}
                        onChange={(e) =>
                          setTransferData({
                            ...transferData,
                            reason: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Effective Date
                      </Label>
                      <Input
                        type="date"
                        value={transferData.effectiveDate}
                        onChange={(e) =>
                          setTransferData({
                            ...transferData,
                            effectiveDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        className="flex-1"
                        onClick={handleTransferMember}
                        disabled={transferMemberMutation.isPending}
                      >
                        {transferMemberMutation.isPending
                          ? "Transferring..."
                          : "Transfer Member"}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => setShowTransferDialog(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {selectedUsers.length > 0 && (
                <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
                  <DialogTrigger asChild>
                    <Button className="h-9 px-4">
                      <Users className="w-4 h-4 mr-2" />
                      Bulk Actions ({selectedUsers.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Bulk Member Operations</DialogTitle>
                      <DialogDescription>
                        Perform actions on {selectedUsers.length} selected
                        members
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Operation *
                        </Label>
                        <Select
                          value={bulkData.operation}
                          onValueChange={(
                            value: "add" | "remove" | "transfer"
                          ) => setBulkData({ ...bulkData, operation: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="add">
                              Add to Department
                            </SelectItem>
                            <SelectItem value="remove">
                              Remove from Department
                            </SelectItem>
                            <SelectItem value="transfer">
                              Transfer to Department
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Target Department *
                        </Label>
                        <Select
                          value={bulkData.targetDepartment}
                          onValueChange={(value) =>
                            setBulkData({
                              ...bulkData,
                              targetDepartment: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept: any) => (
                              <SelectItem key={dept.id} value={dept.name}>
                                {dept.name} ({dept.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Reason *</Label>
                        <Input
                          placeholder="Reason for this bulk operation"
                          value={bulkData.reason}
                          onChange={(e) =>
                            setBulkData({ ...bulkData, reason: e.target.value })
                          }
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          className="flex-1"
                          onClick={handleBulkOperation}
                          disabled={bulkOperationMutation.isPending}
                        >
                          {bulkOperationMutation.isPending
                            ? "Processing..."
                            : `${bulkData.operation} Members`}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => setShowBulkDialog(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
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
                <p className="text-sm text-gray-600">Unassigned</p>
                <p className="text-2xl font-bold">{availableUsers.length}</p>
              </div>
              <UserPlus className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-2xl font-bold">{departments.length}</p>
              </div>
              <Building className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected</p>
                <p className="text-2xl font-bold">{selectedUsers.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Department Overview</CardTitle>
          <CardDescription>
            Member distribution across departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentCounts.map((dept: any) => (
              <div key={dept.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-600">
                        {dept.code}
                      </span>
                    </div>
                    <span className="font-medium">{dept.name}</span>
                  </div>
                  <Badge variant="outline">{dept.memberCount} members</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (dept.memberCount /
                          Math.max(
                            ...departmentCounts.map((d: any) => d.memberCount)
                          )) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search members..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectLabel>Unassigned</SelectLabel>
                  {departments.map((dept: any) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Team Members ({filteredUsers.length})</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Manage team member assignments and operations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedUsers.length === filteredUsers.length &&
                      filteredUsers.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) =>
                        handleSelectUser(user.id, checked as boolean)
                      }
                    />
                  </TableCell>
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
                    {user.department ? (
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4 text-gray-400" />
                        {user.department}
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-orange-600 border-orange-200"
                      >
                        Unassigned
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {canManageMembers && user.department && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600"
                          onClick={() =>
                            handleRemoveMember(user.id, user.department)
                          }
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
