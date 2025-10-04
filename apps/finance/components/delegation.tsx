"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Textarea } from "@repo/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Calendar } from "@repo/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/popover";
import { Switch } from "@repo/ui/switch";
import { Badge } from "@repo/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import { format } from "date-fns";
import {
  CalendarIcon,
  Users,
  UserCheck,
  Clock,
  DollarSign,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

export function DelegationManagement() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const delegations = [
    {
      id: "DEL-001",
      delegatedTo: {
        name: "Emily Davis",
        role: "Senior Manager",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      delegatedBy: "Sarah Wilson",
      startDate: "2024-01-15",
      endDate: "2024-01-25",
      maxAmount: 2000,
      categories: ["Travel", "Meals"],
      status: "active",
      reason: "Vacation coverage",
      expensesApproved: 8,
      totalApproved: 1450,
    },
    {
      id: "DEL-002",
      delegatedTo: {
        name: "Mike Johnson",
        role: "Department Head",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      delegatedBy: "Sarah Wilson",
      startDate: "2024-01-10",
      endDate: "2024-01-20",
      maxAmount: 1000,
      categories: ["Office Supplies", "Software"],
      status: "expired",
      reason: "Business trip",
      expensesApproved: 12,
      totalApproved: 890,
    },
    {
      id: "DEL-003",
      delegatedTo: {
        name: "Alex Chen",
        role: "Team Lead",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      delegatedBy: "Mike Johnson",
      startDate: "2024-01-20",
      endDate: "2024-02-05",
      maxAmount: 500,
      categories: ["Marketing"],
      status: "active",
      reason: "Project coverage",
      expensesApproved: 3,
      totalApproved: 275,
    },
  ];

  const availableUsers = [
    {
      id: "1",
      name: "Emily Davis",
      role: "Senior Manager",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      name: "Mike Johnson",
      role: "Department Head",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      name: "Alex Chen",
      role: "Team Lead",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "4",
      name: "John Doe",
      role: "Manager",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "5",
      name: "Lisa Park",
      role: "Senior Analyst",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ];

  const categories = [
    "Office Supplies",
    "Travel & Transportation",
    "Software & Subscriptions",
    "Marketing & Advertising",
    "Training & Development",
    "Meals & Entertainment",
    "Equipment & Hardware",
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 h-5 text-xs">
            <UserCheck className="w-2 h-2 mr-1" />
            Active
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 h-5 text-xs">
            <Clock className="w-2 h-2 mr-1" />
            Expired
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 h-5 text-xs">
            <Clock className="w-2 h-2 mr-1" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="h-5 text-xs">
            {status}
          </Badge>
        );
    }
  };

  const activeDelegations = delegations.filter((d) => d.status === "active");
  const totalDelegatedAmount = activeDelegations.reduce(
    (sum, d) => sum + d.maxAmount,
    0
  );

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">Delegation Management</h1>
          <p className="text-xs text-gray-600">
            Delegate approval authority to other team members
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-7 px-3 text-xs">
              <Plus className="w-3 h-3 mr-1" />
              New Delegation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm">Create Delegation</DialogTitle>
              <DialogDescription className="text-xs">
                Delegate your approval authority to another team member
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs">Delegate to</Label>
                <Select>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-4 w-4">
                            <AvatarImage
                              src={user.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback className="text-xs">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                          <span className="text-gray-500">({user.role})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-7 text-xs justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {startDate ? (
                          format(startDate, "MMM dd")
                        ) : (
                          <span>Start</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-7 text-xs justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {endDate ? format(endDate, "MMM dd") : <span>End</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Maximum Approval Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1.5 h-3 w-3 text-gray-400" />
                  <Input placeholder="0.00" className="h-7 text-xs pl-7" />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Categories (optional)</Label>
                <Select>
                  <SelectTrigger className="h-7 text-xs">
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

              <div className="space-y-1">
                <Label className="text-xs">Reason for delegation</Label>
                <Textarea
                  placeholder="e.g., Vacation, Business trip, Project coverage..."
                  className="text-xs resize-none"
                  rows={2}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-medium">
                      Send notification
                    </Label>
                    <p className="text-xs text-gray-600">
                      Notify delegate about new authority
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-medium">Auto-activate</Label>
                    <p className="text-xs text-gray-600">
                      Start delegation immediately
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1 h-7 text-xs">
                  Create Delegation
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-7 text-xs"
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
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Active Delegations</p>
              <p className="text-sm font-semibold">
                {activeDelegations.length}
              </p>
            </div>
            <UserCheck className="w-4 h-4 text-green-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Delegated</p>
              <p className="text-sm font-semibold">
                ${totalDelegatedAmount.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Delegates</p>
              <p className="text-sm font-semibold">
                {new Set(activeDelegations.map((d) => d.delegatedTo.name)).size}
              </p>
            </div>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Expiring Soon</p>
              <p className="text-sm font-semibold">
                {
                  delegations.filter((d) => {
                    const endDate = new Date(d.endDate);
                    const today = new Date();
                    const diffDays = Math.ceil(
                      (endDate.getTime() - today.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    return diffDays <= 3 && diffDays >= 0;
                  }).length
                }
              </p>
            </div>
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Delegations Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">All Delegations</CardTitle>
          <CardDescription className="text-xs">
            Manage approval authority delegations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs p-2">Delegate</TableHead>
                <TableHead className="text-xs p-2">Period</TableHead>
                <TableHead className="text-xs p-2">Max Amount</TableHead>
                <TableHead className="text-xs p-2">Categories</TableHead>
                <TableHead className="text-xs p-2">Status</TableHead>
                <TableHead className="text-xs p-2">Activity</TableHead>
                <TableHead className="text-xs p-2 w-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {delegations.map((delegation) => (
                <TableRow key={delegation.id} className="hover:bg-gray-50">
                  <TableCell className="p-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={
                            delegation.delegatedTo.avatar || "/placeholder.svg"
                          }
                        />
                        <AvatarFallback className="text-xs">
                          {delegation.delegatedTo.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium">
                          {delegation.delegatedTo.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {delegation.delegatedTo.role}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-2">
                    <div>
                      <p className="text-xs">
                        {delegation.startDate} - {delegation.endDate}
                      </p>
                      <p className="text-xs text-gray-500">
                        {delegation.reason}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="p-2">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-gray-400" />
                      <span className="text-xs font-medium">
                        ${delegation.maxAmount.toLocaleString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="p-2">
                    <div className="flex flex-wrap gap-1">
                      {delegation.categories.map((category, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs h-4"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="p-2">
                    {getStatusBadge(delegation.status)}
                  </TableCell>
                  <TableCell className="p-2">
                    <div>
                      <p className="text-xs font-medium">
                        {delegation.expensesApproved} approved
                      </p>
                      <p className="text-xs text-gray-500">
                        ${delegation.totalApproved.toLocaleString()} total
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="p-2">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                        <Edit className="h-2 w-2" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 text-red-600"
                      >
                        <Trash2 className="h-2 w-2" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Users className="w-3 h-3 mr-1" />
              Delegate All Pending
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Extend Active
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <UserCheck className="w-3 h-3 mr-1" />
              View Delegate Activity
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
