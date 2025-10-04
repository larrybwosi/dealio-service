import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card"
import { Badge } from "@repo/ui/badge"
import { Button } from "@repo/ui/button"
import { Progress } from "@repo/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Settings,
  Download,
  Plus,
  Eye,
  BarChart3,
  PieChartIcon,
} from "lucide-react"

export function ExpenseDashboard() {
  const stats = [
    {
      title: "Total Expenses",
      value: "$24,580",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-blue-600",
    },
    {
      title: "Pending Approvals",
      value: "5",
      change: "-2",
      trend: "down",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Budget Remaining",
      value: "$15,420",
      change: "68% used",
      trend: "neutral",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "This Month",
      value: "$8,240",
      change: "+8.2%",
      trend: "up",
      icon: Calendar,
      color: "text-purple-600",
    },
  ]

  const recentExpenses = [
    {
      id: "EXP-001",
      description: "Office Supplies - Stationery",
      amount: "$245.00",
      status: "approved",
      date: "2024-01-15",
      category: "Office",
      submitter: "John Doe",
    },
    {
      id: "EXP-002",
      description: "Client Lunch Meeting",
      amount: "$89.50",
      status: "pending",
      date: "2024-01-14",
      category: "Meals",
      submitter: "Sarah Wilson",
    },
    {
      id: "EXP-003",
      description: "Software License Renewal",
      amount: "$1,200.00",
      status: "rejected",
      date: "2024-01-13",
      category: "Software",
      submitter: "Mike Johnson",
    },
    {
      id: "EXP-004",
      description: "Travel - Conference",
      amount: "$850.00",
      status: "approved",
      date: "2024-01-12",
      category: "Travel",
      submitter: "Emily Davis",
    },
  ]

  const budgetCategories = [
    { name: "Office Supplies", used: 2400, total: 5000, percentage: 48 },
    { name: "Travel", used: 8500, total: 12000, percentage: 71 },
    { name: "Software", used: 3200, total: 4000, percentage: 80 },
    { name: "Meals", used: 1800, total: 3000, percentage: 60 },
    { name: "Equipment", used: 2200, total: 5000, percentage: 44 },
    { name: "Marketing", used: 1500, total: 3000, percentage: 50 },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-2 h-2 mr-1" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-2 h-2 mr-1" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-2 h-2 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const monthlyExpenseData = [
    { month: "Jan", expenses: 18500, budget: 25000, approved: 16200, pending: 2300 },
    { month: "Feb", expenses: 22100, budget: 25000, approved: 19800, pending: 2300 },
    { month: "Mar", expenses: 19800, budget: 25000, approved: 17500, pending: 2300 },
    { month: "Apr", expenses: 24580, budget: 25000, approved: 21200, pending: 3380 },
    { month: "May", expenses: 21200, budget: 25000, approved: 18900, pending: 2300 },
    { month: "Jun", expenses: 23400, budget: 25000, approved: 20100, pending: 3300 },
  ]

  const categoryExpenseData = [
    { name: "Travel", value: 8500, color: "#3B82F6" },
    { name: "Software", value: 3200, color: "#10B981" },
    { name: "Office Supplies", value: 2400, color: "#F59E0B" },
    { name: "Meals", value: 1800, color: "#EF4444" },
    { name: "Equipment", value: 2200, color: "#8B5CF6" },
    { name: "Marketing", value: 1500, color: "#06B6D4" },
  ]

  const weeklyTrendData = [
    { day: "Mon", amount: 1200 },
    { day: "Tue", amount: 1800 },
    { day: "Wed", amount: 2400 },
    { day: "Thu", amount: 1600 },
    { day: "Fri", amount: 2800 },
    { day: "Sat", amount: 800 },
    { day: "Sun", amount: 400 },
  ]

  const approvalStatusData = [
    { status: "Approved", count: 45, color: "#10B981" },
    { status: "Pending", count: 12, color: "#F59E0B" },
    { status: "Rejected", count: 3, color: "#EF4444" },
  ]

  const quickActions = [
    { label: "New Expense", icon: Plus, variant: "default" as const, color: "bg-blue-600 hover:bg-blue-700" },
    {
      label: "Approve Pending",
      icon: CheckCircle,
      variant: "outline-solid" as const,
      color: "text-green-600 border-green-200 hover:bg-green-50",
    },
    {
      label: "View Reports",
      icon: BarChart3,
      variant: "outline-solid" as const,
      color: "text-purple-600 border-purple-200 hover:bg-purple-50",
    },
    {
      label: "Manage Users",
      icon: Users,
      variant: "outline-solid" as const,
      color: "text-indigo-600 border-indigo-200 hover:bg-indigo-50",
    },
    {
      label: "Budget Alerts",
      icon: AlertTriangle,
      variant: "outline-solid" as const,
      color: "text-orange-600 border-orange-200 hover:bg-orange-50",
    },
    {
      label: "Export Data",
      icon: Download,
      variant: "outline-solid" as const,
      color: "text-gray-600 border-gray-200 hover:bg-gray-50",
    },
    {
      label: "Analytics",
      icon: PieChartIcon,
      variant: "outline-solid" as const,
      color: "text-teal-600 border-teal-200 hover:bg-teal-50",
    },
    {
      label: "Settings",
      icon: Settings,
      variant: "outline-solid" as const,
      color: "text-slate-600 border-slate-200 hover:bg-slate-50",
    },
  ]

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
          <p className="text-sm text-gray-600">Comprehensive overview of department expenses and budget</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8 px-3 text-xs bg-transparent">
            <Calendar className="w-3 h-3 mr-1" />
            This Month
          </Button>
          <Button size="sm" className="h-8 px-3 text-xs">
            <Eye className="w-3 h-3 mr-1" />
            Live View
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {stat.trend === "up" && <ArrowUpRight className="w-4 h-4 text-green-600" />}
                  {stat.trend === "down" && <ArrowDownRight className="w-4 h-4 text-red-600" />}
                  <span
                    className={
                      stat.trend === "up"
                        ? "text-green-600 font-medium"
                        : stat.trend === "down"
                          ? "text-red-600 font-medium"
                          : "text-gray-600"
                    }
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Monthly Expense Trend */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Expense Trend</CardTitle>
            <CardDescription>Expenses vs Budget over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyExpenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                <Legend />
                <Area type="monotone" dataKey="budget" stackId="1" stroke="#E5E7EB" fill="#F3F4F6" name="Budget" />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stackId="2"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                  name="Total Expenses"
                />
                <Area
                  type="monotone"
                  dataKey="approved"
                  stackId="3"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.8}
                  name="Approved"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Expense by Category</CardTitle>
            <CardDescription>Distribution of expenses across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryExpenseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Amount"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Trend</CardTitle>
            <CardDescription>Daily expense submissions this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Approval Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Approval Status</CardTitle>
            <CardDescription>Current approval distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={approvalStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6">
                  {approvalStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Budget Status</CardTitle>
            <CardDescription>Category-wise budget utilization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgetCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-sm text-gray-600">{category.percentage}%</span>
                </div>
                <Progress value={category.percentage} className="h-2" />
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>${category.used.toLocaleString()}</span>
                  <span>${category.total.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent Expenses */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Expenses</CardTitle>
            <CardDescription>Latest expense submissions and their status</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium truncate">{expense.description}</p>
                      {getStatusBadge(expense.status)}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500 font-mono">{expense.id}</span>
                      <span className="text-xs text-gray-500">{expense.category}</span>
                      <span className="text-xs text-gray-500">{expense.submitter}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{expense.amount}</p>
                    <p className="text-xs text-gray-500">{expense.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Insights</CardTitle>
            <CardDescription>Important metrics and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Budget Performance</span>
              </div>
              <p className="text-xs text-green-700 mt-1">32% under budget this month</p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Approval Time</span>
              </div>
              <p className="text-xs text-blue-700 mt-1">Average: 2.3 days</p>
            </div>

            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Action Required</span>
              </div>
              <p className="text-xs text-orange-700 mt-1">5 expenses need approval</p>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Top Category</span>
              </div>
              <p className="text-xs text-purple-700 mt-1">Travel: $8,500 (35%)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Frequently used actions and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                size="sm"
                className={`h-12 flex-col gap-1 ${action.variant === "default" ? action.color : action.color}`}
              >
                <action.icon className="w-4 h-4" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
