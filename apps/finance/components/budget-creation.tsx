"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { format } from "date-fns"
import { CalendarIcon, DollarSign, Plus, X, Target, TrendingUp, AlertTriangle, Loader2, Save, Copy } from "lucide-react"
import { useCreateBudget, useBudgets } from "@/hooks/use-budgets"
import { useCategories } from "@/hooks/use-categories"
import { toast } from "sonner"

interface CategoryAllocation {
  id: string
  category: string
  amount: number
  percentage: number
}

interface BudgetFormData {
  name: string
  description: string
  startDate: Date | undefined
  endDate: Date | undefined
  department: string
  location: string
  categories: CategoryAllocation[]
  alerts: Array<{ threshold: number; enabled: boolean }>
  autoRollover: boolean
  enableAlerts: boolean
  allowOverruns: boolean
}

export function BudgetCreation() {
  const router = useRouter()
  const createBudgetMutation = useCreateBudget()
  const { data: categoriesData } = useCategories()
  const { data: budgetsData } = useBudgets()

  const [formData, setFormData] = useState<BudgetFormData>({
    name: "",
    description: "",
    startDate: undefined,
    endDate: undefined,
    department: "",
    location: "all",
    categories: [],
    alerts: [
      { threshold: 75, enabled: true },
      { threshold: 90, enabled: true },
    ],
    autoRollover: false,
    enableAlerts: true,
    allowOverruns: false,
  })

  const [newAllocation, setNewAllocation] = useState({
    category: "",
    amount: 0,
  })

  const [isDraft, setIsDraft] = useState(false)

  const availableCategories = categoriesData?.data || [
    "Office Supplies",
    "Travel & Transportation",
    "Software & Subscriptions",
    "Marketing & Advertising",
    "Training & Development",
    "Meals & Entertainment",
    "Equipment & Hardware",
    "Professional Services",
    "Utilities",
    "Insurance",
  ]

  const departments = ["Sales", "Marketing", "Engineering", "Operations", "HR", "Finance", "Customer Success"]

  const addAllocation = () => {
    if (newAllocation.category && newAllocation.amount > 0) {
      const totalBudget = formData.categories.reduce((sum, alloc) => sum + alloc.amount, 0) + newAllocation.amount

      const newAllocations = [
        ...formData.categories,
        {
          id: Date.now().toString(),
          category: newAllocation.category,
          amount: newAllocation.amount,
          percentage: (newAllocation.amount / totalBudget) * 100,
        },
      ]

      // Recalculate percentages
      const total = newAllocations.reduce((sum, alloc) => sum + alloc.amount, 0)
      newAllocations.forEach((alloc) => {
        alloc.percentage = (alloc.amount / total) * 100
      })

      setFormData({ ...formData, categories: newAllocations })
      setNewAllocation({ category: "", amount: 0 })
    }
  }

  const removeAllocation = (id: string) => {
    const newAllocations = formData.categories.filter((alloc) => alloc.id !== id)
    const total = newAllocations.reduce((sum, alloc) => sum + alloc.amount, 0)
    newAllocations.forEach((alloc) => {
      alloc.percentage = total > 0 ? (alloc.amount / total) * 100 : 0
    })
    setFormData({ ...formData, categories: newAllocations })
  }

  const totalBudget = formData.categories.reduce((sum, alloc) => sum + alloc.amount, 0)

  const handleSubmit = async (asDraft = false) => {
    try {
      // Validation
      if (!formData.name.trim()) {
        toast.error("Budget name is required")
        return
      }
      if (!formData.startDate || !formData.endDate) {
        toast.error("Start and end dates are required")
        return
      }
      if (!formData.department) {
        toast.error("Department is required")
        return
      }
      if (formData.categories.length === 0) {
        toast.error("At least one category allocation is required")
        return
      }

      const budgetData = {
        name: formData.name,
        description: formData.description,
        totalAmount: totalBudget,
        startDate: formData.startDate.toISOString().split("T")[0],
        endDate: formData.endDate.toISOString().split("T")[0],
        department: formData.department,
        location: formData.location,
        categories: formData.categories.map((cat) => ({
          name: cat.category,
          allocated: cat.amount,
          used: 0,
        })),
        alerts: formData.alerts,
        autoRollover: formData.autoRollover,
        enableAlerts: formData.enableAlerts,
        allowOverruns: formData.allowOverruns,
        status: asDraft ? "draft" : "active",
        period: `Q${Math.ceil((formData.startDate.getMonth() + 1) / 3)} ${formData.startDate.getFullYear()}`,
      }

      await createBudgetMutation.mutateAsync(budgetData)

      if (asDraft) {
        toast.success("Budget saved as draft")
      } else {
        toast.success("Budget created successfully")
        router.push("/budgets")
      }
    } catch (error) {
      console.error("Error creating budget:", error)
    }
  }

  const copyFromPrevious = () => {
    if (budgetsData?.data && budgetsData.data.length > 0) {
      const previousBudget = budgetsData.data[0] // Get the most recent budget
      setFormData({
        ...formData,
        name: `${previousBudget.name} (Copy)`,
        description: previousBudget.description,
        department: previousBudget.department,
        location: previousBudget.location,
        categories:
          previousBudget.categories?.map((cat: any, index: number) => ({
            id: `copy-${index}`,
            category: cat.name,
            amount: cat.allocated,
            percentage: (cat.allocated / previousBudget.totalAmount) * 100,
          })) || [],
        alerts: previousBudget.alerts || formData.alerts,
        autoRollover: previousBudget.settings?.autoRollover || false,
        enableAlerts: previousBudget.settings?.enableAlerts !== false,
        allowOverruns: previousBudget.settings?.allowOverruns || false,
      })
      toast.success("Budget template copied")
    }
  }

  const isLoading = createBudgetMutation.isPending

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4">
        <h1 className="text-lg font-semibold">Create New Budget</h1>
        <p className="text-xs text-gray-600">Set up budget allocations and spending limits</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Main Form */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="w-4 h-4" />
              Budget Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="budget-name" className="text-xs">
                  Budget Name *
                </Label>
                <Input
                  id="budget-name"
                  placeholder="e.g., Q1 2024 Operations Budget"
                  className="h-7 text-xs"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="total-amount" className="text-xs">
                  Total Amount *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1.5 h-3 w-3 text-gray-400" />
                  <Input
                    id="total-amount"
                    type="number"
                    placeholder="0.00"
                    className="h-7 text-xs pl-7"
                    step="0.01"
                    value={totalBudget || ""}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="description" className="text-xs">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Brief description of this budget..."
                className="text-xs resize-none"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-7 text-xs justify-start text-left font-normal bg-transparent"
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick start date</span>}
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
              <div className="space-y-1">
                <Label className="text-xs">End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-7 text-xs justify-start text-left font-normal bg-transparent"
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick end date</span>}
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

            {/* Department and Location */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Department *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger className="h-7 text-xs">
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
              <div className="space-y-1">
                <Label className="text-xs">Location</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="ny">New York Office</SelectItem>
                    <SelectItem value="la">Los Angeles Office</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category Allocations */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-medium">Category Allocations *</Label>
                <Badge variant="outline" className="text-xs">
                  {formData.categories.length} categories
                </Badge>
              </div>

              {/* Add New Allocation */}
              <div className="flex gap-2 p-2 bg-gray-50 rounded">
                <Select
                  value={newAllocation.category}
                  onValueChange={(value) => setNewAllocation({ ...newAllocation, category: value })}
                >
                  <SelectTrigger className="h-6 text-xs flex-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories
                      .filter((cat) => !formData.categories.some((alloc) => alloc.category === cat))
                      .map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="relative">
                  <DollarSign className="absolute left-1 top-1 h-2 w-2 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="Amount"
                    className="h-6 text-xs pl-4 w-24"
                    value={newAllocation.amount || ""}
                    onChange={(e) =>
                      setNewAllocation({
                        ...newAllocation,
                        amount: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <Button
                  onClick={addAllocation}
                  size="sm"
                  className="h-6 px-2 text-xs"
                  disabled={!newAllocation.category || newAllocation.amount <= 0}
                >
                  <Plus className="w-2 h-2" />
                </Button>
              </div>

              {/* Allocation List */}
              <div className="space-y-1">
                {formData.categories.map((allocation) => (
                  <div key={allocation.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{allocation.category}</span>
                      <Badge variant="secondary" className="text-xs h-4">
                        {allocation.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">${allocation.amount.toLocaleString()}</span>
                      <button
                        onClick={() => removeAllocation(allocation.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-medium">Auto-rollover unused budget</Label>
                  <p className="text-xs text-gray-600">Carry over unused amounts to next period</p>
                </div>
                <Switch
                  checked={formData.autoRollover}
                  onCheckedChange={(checked) => setFormData({ ...formData, autoRollover: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-medium">Enable budget alerts</Label>
                  <p className="text-xs text-gray-600">Send notifications when thresholds are reached</p>
                </div>
                <Switch
                  checked={formData.enableAlerts}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableAlerts: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-medium">Allow budget overruns</Label>
                  <p className="text-xs text-gray-600">Permit spending above allocated amounts</p>
                </div>
                <Switch
                  checked={formData.allowOverruns}
                  onCheckedChange={(checked) => setFormData({ ...formData, allowOverruns: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Budget Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Budget Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <p className="text-lg font-semibold">${totalBudget.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Total Budget</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Categories:</span>
                  <span>{formData.categories.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Avg per category:</span>
                  <span>
                    ${formData.categories.length > 0 ? (totalBudget / formData.categories.length).toFixed(0) : "0"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert Thresholds */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Alert Thresholds</CardTitle>
              <CardDescription className="text-xs">Set spending alert levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Warning at</Label>
                <Select
                  value={formData.alerts[0]?.threshold.toString() || "75"}
                  onValueChange={(value) => {
                    const newAlerts = [...formData.alerts]
                    newAlerts[0] = { ...newAlerts[0], threshold: Number.parseInt(value) }
                    setFormData({ ...formData, alerts: newAlerts })
                  }}
                >
                  <SelectTrigger className="h-6 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50%</SelectItem>
                    <SelectItem value="75">75%</SelectItem>
                    <SelectItem value="80">80%</SelectItem>
                    <SelectItem value="90">90%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Critical at</Label>
                <Select
                  value={formData.alerts[1]?.threshold.toString() || "90"}
                  onValueChange={(value) => {
                    const newAlerts = [...formData.alerts]
                    newAlerts[1] = { ...newAlerts[1], threshold: Number.parseInt(value) }
                    setFormData({ ...formData, alerts: newAlerts })
                  }}
                >
                  <SelectTrigger className="h-6 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="85">85%</SelectItem>
                    <SelectItem value="90">90%</SelectItem>
                    <SelectItem value="95">95%</SelectItem>
                    <SelectItem value="100">100%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span>Budget planning on track</span>
              </div>
              {totalBudget > 0 && formData.categories.length === 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <AlertTriangle className="w-3 h-3 text-yellow-600" />
                  <span>Add category allocations</span>
                </div>
              )}
              {totalBudget === 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <AlertTriangle className="w-3 h-3 text-yellow-600" />
                  <span>Set budget amounts</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button className="w-full h-8 text-xs" onClick={() => handleSubmit(false)} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Budget"
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full h-8 text-xs bg-transparent"
              onClick={() => handleSubmit(true)}
              disabled={isLoading}
            >
              <Save className="w-3 h-3 mr-2" />
              Save as Draft
            </Button>
            <Button
              variant="outline"
              className="w-full h-8 text-xs bg-transparent"
              onClick={copyFromPrevious}
              disabled={!budgetsData?.data?.length}
            >
              <Copy className="w-3 h-3 mr-2" />
              Copy from Previous
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
