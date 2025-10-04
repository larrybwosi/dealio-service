"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@repo/ui/card"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { Textarea } from "@repo/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select"
import { Badge } from "@repo/ui/badge"
import { Switch } from "@repo/ui/switch"
import { Calendar } from "@repo/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs"
import { Alert, AlertDescription } from "@repo/ui/alert"
import {
  Bell,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Trash2,
  Settings,
  FileText,
  DollarSign,
  Repeat,
} from "lucide-react"
import { format, addDays } from "date-fns"
import { toast } from "sonner"

interface Reminder {
  id: string
  title: string
  description: string
  type: "expense_due" | "approval_pending" | "budget_limit" | "tax_deadline" | "custom"
  priority: "low" | "medium" | "high" | "urgent"
  dueDate: string
  reminderDate: string
  isRecurring: boolean
  recurringPattern?: "daily" | "weekly" | "monthly" | "quarterly"
  status: "active" | "completed" | "snoozed" | "cancelled"
  assignedTo: string[]
  notificationMethods: ("email" | "push" | "sms")[]
  relatedExpenseId?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

interface NotificationSettings {
  emailEnabled: boolean
  pushEnabled: boolean
  smsEnabled: boolean
  defaultLeadTime: number
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
  weekendNotifications: boolean
}

export function ReminderSystem() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
    defaultLeadTime: 24,
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "08:00",
    },
    weekendNotifications: false,
  })

  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: "",
    description: "",
    type: "custom",
    priority: "medium",
    dueDate: "",
    reminderDate: "",
    isRecurring: false,
    assignedTo: ["current-user"],
    notificationMethods: ["email", "push"],
    status: "active",
  })

  // Mock data initialization
  useEffect(() => {
    const mockReminders: Reminder[] = [
      {
        id: "REM-001",
        title: "Submit Monthly Expense Report",
        description: "Monthly expense report for November 2024 is due",
        type: "expense_due",
        priority: "high",
        dueDate: "2024-12-01T09:00:00Z",
        reminderDate: "2024-11-29T09:00:00Z",
        isRecurring: true,
        recurringPattern: "monthly",
        status: "active",
        assignedTo: ["current-user"],
        notificationMethods: ["email", "push"],
        createdAt: "2024-11-01T10:00:00Z",
        updatedAt: "2024-11-01T10:00:00Z",
      },
      {
        id: "REM-002",
        title: "Approve Pending Expenses",
        description: "5 expenses are pending your approval",
        type: "approval_pending",
        priority: "medium",
        dueDate: "2024-11-30T17:00:00Z",
        reminderDate: "2024-11-30T09:00:00Z",
        isRecurring: false,
        status: "active",
        assignedTo: ["manager-1"],
        notificationMethods: ["email"],
        relatedExpenseId: "EXP-001",
        createdAt: "2024-11-28T14:00:00Z",
        updatedAt: "2024-11-28T14:00:00Z",
      },
      {
        id: "REM-003",
        title: "Budget Review Meeting",
        description: "Quarterly budget review with finance team",
        type: "custom",
        priority: "medium",
        dueDate: "2024-12-05T14:00:00Z",
        reminderDate: "2024-12-04T09:00:00Z",
        isRecurring: true,
        recurringPattern: "quarterly",
        status: "active",
        assignedTo: ["current-user", "finance-team"],
        notificationMethods: ["email", "push"],
        createdAt: "2024-11-20T10:00:00Z",
        updatedAt: "2024-11-20T10:00:00Z",
      },
      {
        id: "REM-004",
        title: "Travel Budget Limit Alert",
        description: "Travel category has reached 85% of budget allocation",
        type: "budget_limit",
        priority: "urgent",
        dueDate: "2024-11-29T12:00:00Z",
        reminderDate: "2024-11-29T12:00:00Z",
        isRecurring: false,
        status: "completed",
        assignedTo: ["current-user"],
        notificationMethods: ["email", "push", "sms"],
        completedAt: "2024-11-29T13:30:00Z",
        createdAt: "2024-11-29T12:00:00Z",
        updatedAt: "2024-11-29T13:30:00Z",
      },
    ]
    setReminders(mockReminders)
  }, [])

  const createReminder = () => {
    if (!newReminder.title || !newReminder.dueDate) {
      toast.error("Please fill in required fields")
      return
    }

    const reminder: Reminder = {
      id: `REM-${String(reminders.length + 1).padStart(3, "0")}`,
      title: newReminder.title!,
      description: newReminder.description || "",
      type: newReminder.type as any,
      priority: newReminder.priority as any,
      dueDate: newReminder.dueDate!,
      reminderDate: newReminder.reminderDate || newReminder.dueDate!,
      isRecurring: newReminder.isRecurring || false,
      recurringPattern: newReminder.recurringPattern,
      status: "active",
      assignedTo: newReminder.assignedTo || ["current-user"],
      notificationMethods: newReminder.notificationMethods || ["email"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setReminders([reminder, ...reminders])
    setNewReminder({
      title: "",
      description: "",
      type: "custom",
      priority: "medium",
      dueDate: "",
      reminderDate: "",
      isRecurring: false,
      assignedTo: ["current-user"],
      notificationMethods: ["email", "push"],
      status: "active",
    })
    setShowCreateDialog(false)
    toast.success("Reminder created successfully")
  }

  const updateReminderStatus = (id: string, status: Reminder["status"]) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id
          ? {
              ...reminder,
              status,
              updatedAt: new Date().toISOString(),
              completedAt: status === "completed" ? new Date().toISOString() : undefined,
            }
          : reminder,
      ),
    )
    toast.success(`Reminder ${status}`)
  }

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id))
    toast.success("Reminder deleted")
  }

  const snoozeReminder = (id: string, hours: number) => {
    const reminder = reminders.find((r) => r.id === id)
    if (reminder) {
      const newReminderDate = addDays(new Date(reminder.reminderDate), hours / 24).toISOString()
      setReminders(
        reminders.map((r) =>
          r.id === id
            ? { ...r, reminderDate: newReminderDate, status: "snoozed" as const, updatedAt: new Date().toISOString() }
            : r,
        ),
      )
      toast.success(`Reminder snoozed for ${hours} hours`)
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Urgent</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Active</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "snoozed":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Snoozed</Badge>
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "expense_due":
        return <FileText className="w-4 h-4" />
      case "approval_pending":
        return <CheckCircle className="w-4 h-4" />
      case "budget_limit":
        return <DollarSign className="w-4 h-4" />
      case "tax_deadline":
        return <Calendar className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const filteredReminders = reminders.filter((reminder) => {
    if (filterStatus !== "all" && reminder.status !== filterStatus) return false
    if (filterType !== "all" && reminder.type !== filterType) return false
    return true
  })

  const activeReminders = reminders.filter((r) => r.status === "active")
  const overdueReminders = activeReminders.filter((r) => new Date(r.dueDate) < new Date())
  const upcomingReminders = activeReminders.filter((r) => {
    const dueDate = new Date(r.dueDate)
    const now = new Date()
    const tomorrow = addDays(now, 1)
    return dueDate >= now && dueDate <= tomorrow
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Reminders & Notifications</h1>
          <p className="text-gray-600">Manage your reminders and notification preferences</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Notification Settings</DialogTitle>
                <DialogDescription>Configure your notification preferences</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Email Notifications</Label>
                    <Switch
                      checked={notificationSettings.emailEnabled}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailEnabled: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Push Notifications</Label>
                    <Switch
                      checked={notificationSettings.pushEnabled}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, pushEnabled: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>SMS Notifications</Label>
                    <Switch
                      checked={notificationSettings.smsEnabled}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, smsEnabled: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Weekend Notifications</Label>
                    <Switch
                      checked={notificationSettings.weekendNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, weekendNotifications: checked })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Default Lead Time (hours)</Label>
                  <Input
                    type="number"
                    value={notificationSettings.defaultLeadTime}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        defaultLeadTime: Number.parseInt(e.target.value) || 24,
                      })
                    }
                  />
                </div>
                <Button onClick={() => setShowSettingsDialog(false)} className="w-full">
                  Save Settings
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Reminder
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Reminder</DialogTitle>
                <DialogDescription>Set up a new reminder or notification</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                    placeholder="Enter reminder title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newReminder.description}
                    onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                    placeholder="Enter description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={newReminder.type}
                      onValueChange={(value) => setNewReminder({ ...newReminder, type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Custom</SelectItem>
                        <SelectItem value="expense_due">Expense Due</SelectItem>
                        <SelectItem value="approval_pending">Approval Pending</SelectItem>
                        <SelectItem value="budget_limit">Budget Limit</SelectItem>
                        <SelectItem value="tax_deadline">Tax Deadline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={newReminder.priority}
                      onValueChange={(value) => setNewReminder({ ...newReminder, priority: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Due Date *</Label>
                    <Input
                      type="datetime-local"
                      value={newReminder.dueDate}
                      onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Reminder Date</Label>
                    <Input
                      type="datetime-local"
                      value={newReminder.reminderDate}
                      onChange={(e) => setNewReminder({ ...newReminder, reminderDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newReminder.isRecurring}
                    onCheckedChange={(checked) => setNewReminder({ ...newReminder, isRecurring: checked })}
                  />
                  <Label>Recurring reminder</Label>
                </div>
                {newReminder.isRecurring && (
                  <div className="space-y-2">
                    <Label>Recurring Pattern</Label>
                    <Select
                      value={newReminder.recurringPattern}
                      onValueChange={(value) => setNewReminder({ ...newReminder, recurringPattern: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={createReminder} className="flex-1">
                    Create Reminder
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Reminders</p>
                <p className="text-2xl font-bold">{activeReminders.length}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueReminders.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Due Today</p>
                <p className="text-2xl font-bold text-orange-600">{upcomingReminders.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {reminders.filter((r) => r.status === "completed").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Alerts */}
      {overdueReminders.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            You have {overdueReminders.length} overdue reminder{overdueReminders.length > 1 ? "s" : ""}. Please review
            and take action.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Reminders</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="expense_due">Expense Due</SelectItem>
                <SelectItem value="approval_pending">Approval Pending</SelectItem>
                <SelectItem value="budget_limit">Budget Limit</SelectItem>
                <SelectItem value="tax_deadline">Tax Deadline</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reminder</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReminders.map((reminder) => (
                    <TableRow key={reminder.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(reminder.type)}
                            <span className="font-medium">{reminder.title}</span>
                          </div>
                          {reminder.description && <p className="text-sm text-gray-600">{reminder.description}</p>}
                          {reminder.isRecurring && (
                            <Badge variant="outline" className="text-xs">
                              <Repeat className="w-3 h-3 mr-1" />
                              {reminder.recurringPattern}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{reminder.type.replace("_", " ")}</TableCell>
                      <TableCell>{getPriorityBadge(reminder.priority)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>{format(new Date(reminder.dueDate), "MMM dd, yyyy")}</div>
                          <div className="text-xs text-gray-500">{format(new Date(reminder.dueDate), "HH:mm")}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(reminder.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {reminder.status === "active" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateReminderStatus(reminder.id, "completed")}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Clock className="w-4 h-4" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48">
                                  <div className="space-y-2">
                                    <p className="text-sm font-medium">Snooze for:</p>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start"
                                      onClick={() => snoozeReminder(reminder.id, 1)}
                                    >
                                      1 hour
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start"
                                      onClick={() => snoozeReminder(reminder.id, 24)}
                                    >
                                      1 day
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start"
                                      onClick={() => snoozeReminder(reminder.id, 168)}
                                    >
                                      1 week
                                    </Button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => deleteReminder(reminder.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {activeReminders.map((reminder) => (
                  <div key={reminder.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(reminder.type)}
                          <h3 className="font-medium">{reminder.title}</h3>
                          {getPriorityBadge(reminder.priority)}
                        </div>
                        <p className="text-sm text-gray-600">{reminder.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Due: {format(new Date(reminder.dueDate), "MMM dd, yyyy HH:mm")}</span>
                          {reminder.isRecurring && (
                            <Badge variant="outline" className="text-xs">
                              <Repeat className="w-3 h-3 mr-1" />
                              {reminder.recurringPattern}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateReminderStatus(reminder.id, "completed")}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => snoozeReminder(reminder.id, 24)}>
                          <Clock className="w-4 h-4 mr-1" />
                          Snooze
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {overdueReminders.map((reminder) => (
                  <div key={reminder.id} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <h3 className="font-medium text-red-800">{reminder.title}</h3>
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>
                        </div>
                        <p className="text-sm text-red-700">{reminder.description}</p>
                        <div className="text-xs text-red-600">
                          Was due: {format(new Date(reminder.dueDate), "MMM dd, yyyy HH:mm")}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateReminderStatus(reminder.id, "completed")}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateReminderStatus(reminder.id, "cancelled")}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {reminders
                  .filter((r) => r.status === "completed")
                  .map((reminder) => (
                    <div key={reminder.id} className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <h3 className="font-medium text-green-800">{reminder.title}</h3>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
                          </div>
                          <p className="text-sm text-green-700">{reminder.description}</p>
                          <div className="text-xs text-green-600">
                            Completed:{" "}
                            {reminder.completedAt && format(new Date(reminder.completedAt), "MMM dd, yyyy HH:mm")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
