"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Settings, Users, Shield, DollarSign, FileText, Bell, Plus } from "lucide-react"

export function ExpenseSettings() {
  const [activeTab, setActiveTab] = useState("general")

  const approvers = [
    {
      id: "1",
      name: "Sarah Wilson",
      role: "Finance Manager",
      email: "sarah.wilson@company.com",
      avatar: "/placeholder.svg?height=32&width=32",
      permissions: ["approve_all", "manage_budgets", "view_reports"],
      maxApprovalAmount: 10000,
      status: "active",
    },
    {
      id: "2",
      name: "Mike Johnson",
      role: "Department Head",
      email: "mike.johnson@company.com",
      avatar: "/placeholder.svg?height=32&width=32",
      permissions: ["approve_department", "view_reports"],
      maxApprovalAmount: 5000,
      status: "active",
    },
    {
      id: "3",
      name: "Emily Davis",
      role: "Team Lead",
      email: "emily.davis@company.com",
      avatar: "/placeholder.svg?height=32&width=32",
      permissions: ["approve_team"],
      maxApprovalAmount: 1000,
      status: "active",
    },
  ]

  const categories = [
    { id: "1", name: "Office Supplies", code: "OFF", budget: 5000, isActive: true },
    { id: "2", name: "Travel & Transportation", code: "TRV", budget: 12000, isActive: true },
    { id: "3", name: "Software & Subscriptions", code: "SFT", budget: 4000, isActive: true },
    { id: "4", name: "Marketing & Advertising", code: "MKT", budget: 8000, isActive: true },
    { id: "5", name: "Training & Development", code: "TRN", budget: 3000, isActive: true },
  ]

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "approvers", label: "Approvers", icon: Users },
    { id: "categories", label: "Categories", icon: FileText },
    { id: "policies", label: "Policies", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ]

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Basic Settings</CardTitle>
          <CardDescription className="text-xs">Configure general expense management settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Default Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD - US Dollar</SelectItem>
                  <SelectItem value="eur">EUR - Euro</SelectItem>
                  <SelectItem value="gbp">GBP - British Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Fiscal Year Start</Label>
              <Select defaultValue="january">
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january">January</SelectItem>
                  <SelectItem value="april">April</SelectItem>
                  <SelectItem value="july">July</SelectItem>
                  <SelectItem value="october">October</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-medium">Require Receipt Attachments</Label>
                <p className="text-xs text-gray-600">Mandate receipt uploads for all expenses</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-medium">Auto-approve Small Expenses</Label>
                <p className="text-xs text-gray-600">Automatically approve expenses under threshold</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-medium">Enable Expense Analytics</Label>
                <p className="text-xs text-gray-600">Generate detailed spending insights</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Approval Thresholds</CardTitle>
          <CardDescription className="text-xs">Set automatic approval limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Auto-approve under</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1.5 h-3 w-3 text-gray-400" />
                <Input defaultValue="100" className="h-7 text-xs pl-7" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Require manager approval over</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1.5 h-3 w-3 text-gray-400" />
                <Input defaultValue="500" className="h-7 text-xs pl-7" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Require director approval over</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1.5 h-3 w-3 text-gray-400" />
                <Input defaultValue="2000" className="h-7 text-xs pl-7" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Require CFO approval over</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1.5 h-3 w-3 text-gray-400" />
                <Input defaultValue="5000" className="h-7 text-xs pl-7" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderApprovers = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium">Expense Approvers</h3>
          <p className="text-xs text-gray-600">Manage users who can approve expenses</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="h-7 px-3 text-xs">
              <Plus className="w-3 h-3 mr-1" />
              Add Approver
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm">Add New Approver</DialogTitle>
              <DialogDescription className="text-xs">Grant expense approval permissions to a user</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs">User</Label>
                <Select>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">John Doe</SelectItem>
                    <SelectItem value="user2">Jane Smith</SelectItem>
                    <SelectItem value="user3">Bob Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Maximum Approval Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1.5 h-3 w-3 text-gray-400" />
                  <Input placeholder="0.00" className="h-7 text-xs pl-7" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="approve_all" className="h-3 w-3" />
                    <Label htmlFor="approve_all" className="text-xs">
                      Approve all expenses
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="approve_department" className="h-3 w-3" />
                    <Label htmlFor="approve_department" className="text-xs">
                      Approve department expenses
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="manage_budgets" className="h-3 w-3" />
                    <Label htmlFor="manage_budgets" className="text-xs">
                      Manage budgets
                    </Label>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1 h-7 text-xs">Add Approver</Button>
                <Button variant="outline" className="flex-1 h-7 text-xs">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="space-y-2 p-3">
            {approvers.map((approver) => (
              <div key={approver.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs">
                      {approver.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium">{approver.name}</p>
                    <p className="text-xs text-gray-500">{approver.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">${approver.maxApprovalAmount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{approver.permissions.length} permissions</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCategories = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium">Expense Categories</h3>
          <p className="text-xs text-gray-600">Manage expense categories and budgets</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="h-7 px-3 text-xs">
              <Plus className="w-3 h-3 mr-1" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm">Add New Category</DialogTitle>
              <DialogDescription className="text-xs">Create a new expense category</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs">Category Name</Label>
                <Input placeholder="e.g., Office Supplies" className="h-7 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Category Code</Label>
                <Input placeholder="e.g., OFF" className="h-7 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Annual Budget</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1.5 h-3 w-3 text-gray-400" />
                  <Input placeholder="0.00" className="h-7 text-xs pl-7" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="active" defaultChecked />
                <Label htmlFor="active" className="text-xs">
                  Active category
                </Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1 h-7 text-xs">Create Category</Button>
                <Button variant="outline" className="flex-1 h-7 text-xs">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="space-y-2 p-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-xs text-blue-600">{category.code}</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium">{category.name}</p>
                    <p className="text-xs text-gray-500">Budget: ${category.budget.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={category.isActive} />
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPolicies = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Approval Policies</CardTitle>
          <CardDescription className="text-xs">Configure automatic approval rules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-medium">Require manager approval</Label>
                <p className="text-xs text-gray-600">All expenses need manager sign-off</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-medium">Require receipts for all expenses</Label>
                <p className="text-xs text-gray-600">Mandatory receipt uploads</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-medium">Allow retroactive submissions</Label>
                <p className="text-xs text-gray-600">Submit expenses from previous periods</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Receipt Requirements</CardTitle>
          <CardDescription className="text-xs">Set receipt upload policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Receipt required for amounts over</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-1.5 h-3 w-3 text-gray-400" />
              <Input defaultValue="25" className="h-7 text-xs pl-7" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Maximum days to submit receipt</Label>
            <Input defaultValue="30" className="h-7 text-xs" />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotifications = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Email Notifications</CardTitle>
          <CardDescription className="text-xs">Configure when to send email alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-medium">New expense submitted</Label>
              <p className="text-xs text-gray-600">Notify approvers of new submissions</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-medium">Expense approved/rejected</Label>
              <p className="text-xs text-gray-600">Notify submitters of decisions</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-medium">Budget threshold alerts</Label>
              <p className="text-xs text-gray-600">Alert when budgets reach limits</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-medium">Pending approval reminders</Label>
              <p className="text-xs text-gray-600">Remind approvers of pending items</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Reminder Settings</CardTitle>
          <CardDescription className="text-xs">Configure reminder frequencies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Remind approvers every</Label>
            <Select defaultValue="daily">
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Budget alert threshold</Label>
            <Select defaultValue="80">
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="70">70%</SelectItem>
                <SelectItem value="80">80%</SelectItem>
                <SelectItem value="90">90%</SelectItem>
                <SelectItem value="95">95%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">Expense Settings</h1>
          <p className="text-xs text-gray-600">Configure expense management system settings</p>
        </div>
        <Button size="sm" className="h-7 px-3 text-xs">
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Sidebar Navigation */}
        <Card className="col-span-1">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "secondary" : "ghost"}
                  className="w-full justify-start h-7 px-2 text-xs"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="w-3 h-3 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Content Area */}
        <div className="col-span-4">
          {activeTab === "general" && renderGeneralSettings()}
          {activeTab === "approvers" && renderApprovers()}
          {activeTab === "categories" && renderCategories()}
          {activeTab === "policies" && renderPolicies()}
          {activeTab === "notifications" && renderNotifications()}
        </div>
      </div>
    </div>
  )
}
