"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card"
import { Badge } from "@repo/ui/badge"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs"
import { Separator } from "@repo/ui/separator"
import {
  DollarSign,
  CheckCircle,
  BarChart3,
  Settings,
  Users,
  Calendar,
  Search,
  BookOpen,
  Bell,
  FileSpreadsheet,
  TrendingUp,
  Filter,
  Target,
  Zap,
  Database,
  Globe,
  Smartphone,
  PlayCircle,
  AlertCircle,
  CheckSquare,
  ArrowRight,
  Info,
} from "lucide-react"

interface Feature {
  id: string
  title: string
  description: string
  category: string
  icon: React.ReactNode
  actions: Array<{
    name: string
    description: string
    onClick: () => void
  }>
  status: "active" | "beta" | "coming-soon"
  detailedInstructions: {
    overview: string
    steps: Array<{
      title: string
      description: string
      tips?: string[]
    }>
    commonIssues?: Array<{
      issue: string
      solution: string
    }>
  }
}

export default function DocumentationPage({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)

  const features: Feature[] = [
    {
      id: "dashboard",
      title: "Dashboard & Overview",
      description:
        "Comprehensive dashboard with key metrics, recent activities, and quick actions for expense management.",
      category: "Core Features",
      icon: <BarChart3 className="h-5 w-5" />,
      actions: [
        {
          name: "View Dashboard",
          description: "Access main dashboard with expense overview",
          onClick: () => onNavigate("dashboard"),
        },
        {
          name: "Quick Stats",
          description: "View real-time expense statistics",
          onClick: () => onNavigate("dashboard"),
        },
      ],
      status: "active",
      detailedInstructions: {
        overview:
          "The dashboard is your central hub for monitoring all expense-related activities. It provides real-time insights into spending patterns, pending approvals, and budget utilization.",
        steps: [
          {
            title: "Understanding Key Metrics",
            description:
              "The top section displays critical KPIs including total expenses, pending approvals, budget utilization, and monthly trends.",
            tips: [
              "Hover over charts for detailed breakdowns",
              "Click on metric cards to drill down into specific data",
            ],
          },
          {
            title: "Recent Activities",
            description:
              "Monitor the latest expense submissions, approvals, and system notifications in the activity feed.",
            tips: ["Use filters to focus on specific activity types", "Click on activities to view full details"],
          },
          {
            title: "Quick Actions",
            description:
              "Access frequently used functions directly from the dashboard without navigating through menus.",
            tips: ["Customize quick actions based on your role", "Use keyboard shortcuts for faster access"],
          },
        ],
        commonIssues: [
          {
            issue: "Dashboard loading slowly",
            solution: "Check your internet connection and refresh the page. Large datasets may take a moment to load.",
          },
          {
            issue: "Metrics not updating",
            solution: "Data refreshes every 5 minutes automatically. Click the refresh button for immediate updates.",
          },
        ],
      },
    },
    {
      id: "expense-management",
      title: "Expense Management",
      description: "Create, edit, and manage expenses with advanced filtering, categorization, and bulk operations.",
      category: "Core Features",
      icon: <DollarSign className="h-5 w-5" />,
      actions: [
        {
          name: "Create Expense",
          description: "Add new expense with receipt upload",
          onClick: () => onNavigate("create-expense"),
        },
        {
          name: "View All Expenses",
          description: "Browse and filter all expenses",
          onClick: () => onNavigate("expenses"),
        },
        {
          name: "My Expenses",
          description: "View personal expense submissions",
          onClick: () => onNavigate("my-expenses"),
        },
      ],
      status: "active",
      detailedInstructions: {
        overview:
          "The expense management system allows you to create, track, and manage all expense submissions with comprehensive categorization and approval workflows.",
        steps: [
          {
            title: "Creating a New Expense",
            description:
              "Click 'Create Expense' and fill in all required fields including amount, date, category, and description.",
            tips: [
              "Upload clear photos of receipts",
              "Select the most specific category available",
              "Add detailed descriptions for faster approvals",
            ],
          },
          {
            title: "Uploading Receipts",
            description:
              "Drag and drop receipt images or click to browse. Supported formats: JPG, PNG, PDF up to 10MB.",
            tips: [
              "Ensure receipts are clearly visible",
              "Multiple receipts can be uploaded per expense",
              "Use mobile app for on-the-go receipt capture",
            ],
          },
          {
            title: "Tracking Expense Status",
            description:
              "Monitor your expenses through various stages: Draft, Submitted, Under Review, Approved, or Rejected.",
            tips: [
              "Set up notifications for status changes",
              "Add comments to provide additional context",
              "Check approval queue for estimated processing time",
            ],
          },
          {
            title: "Editing and Updating",
            description:
              "Modify expenses in draft status or add information to submitted expenses as requested by approvers.",
            tips: [
              "Save drafts frequently",
              "Review all fields before final submission",
              "Respond promptly to approver requests",
            ],
          },
        ],
        commonIssues: [
          {
            issue: "Receipt upload failing",
            solution: "Check file size (max 10MB) and format (JPG, PNG, PDF). Try compressing large images.",
          },
          {
            issue: "Category not available",
            solution:
              "Contact your administrator to add new categories or use the closest available option with a detailed description.",
          },
        ],
      },
    },
    {
      id: "approval-workflow",
      title: "Approval Workflows",
      description: "Advanced approval system with visual workflow builder, bulk operations, and comment system.",
      category: "Workflow Management",
      icon: <CheckCircle className="h-5 w-5" />,
      actions: [
        {
          name: "Approval Queue",
          description: "Review pending expense approvals",
          onClick: () => onNavigate("approvals"),
        },
        {
          name: "Bulk Approval",
          description: "Approve multiple expenses at once",
          onClick: () => onNavigate("bulk-approval"),
        },
        {
          name: "Visual Workflow Builder",
          description: "Design custom approval workflows",
          onClick: () => onNavigate("visual-workflow"),
        },
      ],
      status: "active",
      detailedInstructions: {
        overview:
          "The approval workflow system provides flexible, customizable approval processes with visual workflow design, bulk operations, and comprehensive audit trails.",
        steps: [
          {
            title: "Reviewing Individual Expenses",
            description:
              "Click on expenses in your approval queue to review details, receipts, and supporting documentation.",
            tips: [
              "Check receipt clarity and completeness",
              "Verify amounts match receipts",
              "Review business justification",
              "Use comments for clarification requests",
            ],
          },
          {
            title: "Using Bulk Approval",
            description: "Select multiple expenses using checkboxes and approve them simultaneously for efficiency.",
            tips: [
              "Filter by amount ranges for similar expenses",
              "Group by submitter or category",
              "Review summary before bulk approval",
              "Use bulk rejection with comments for common issues",
            ],
          },
          {
            title: "Creating Custom Workflows",
            description:
              "Use the visual workflow builder to design approval processes with conditions, multiple approvers, and automated actions.",
            tips: [
              "Start with simple workflows and add complexity gradually",
              "Test workflows with sample data",
              "Set up fallback approvers for coverage",
              "Document workflow logic for team reference",
            ],
          },
          {
            title: "Managing Delegations",
            description:
              "Set up temporary approval delegations when you're unavailable, with specific date ranges and amount limits.",
            tips: [
              "Set up delegations before planned absences",
              "Specify clear amount limits",
              "Choose experienced delegates",
              "Monitor delegated approvals upon return",
            ],
          },
        ],
        commonIssues: [
          {
            issue: "Workflow not triggering",
            solution:
              "Check workflow conditions and ensure all required fields are configured. Verify user permissions.",
          },
          {
            issue: "Delegation not working",
            solution:
              "Confirm delegation dates are current and delegate has appropriate permissions for the expense amounts.",
          },
        ],
      },
    },
    {
      id: "analytics-reports",
      title: "Analytics & Reports",
      description:
        "AI-powered reporting with comprehensive analytics, trend analysis, and automated report generation.",
      category: "Analytics",
      icon: <TrendingUp className="h-5 w-5" />,
      actions: [
        {
          name: "View Analytics",
          description: "Access detailed expense analytics",
          onClick: () => onNavigate("analytics"),
        },
        {
          name: "Generate Reports",
          description: "Create AI-powered expense reports",
          onClick: () => onNavigate("reports"),
        },
        {
          name: "Export Data",
          description: "Export expenses to Excel, PDF, CSV",
          onClick: () => onNavigate("expenses"),
        },
      ],
      status: "active",
      detailedInstructions: {
        overview:
          "Advanced analytics and reporting capabilities powered by AI to provide insights into spending patterns, budget performance, and compliance metrics.",
        steps: [
          {
            title: "Viewing Analytics Dashboard",
            description:
              "Access comprehensive charts and graphs showing spending trends, category breakdowns, and comparative analysis.",
            tips: [
              "Use date filters to focus on specific periods",
              "Compare year-over-year or month-over-month trends",
              "Drill down into specific categories or departments",
            ],
          },
          {
            title: "Generating AI Reports",
            description:
              "Use AI-powered report generation to create intelligent summaries and insights from your expense data.",
            tips: [
              "Specify report parameters clearly",
              "Include relevant date ranges",
              "Review AI insights for accuracy",
              "Customize report templates for recurring needs",
            ],
          },
          {
            title: "Exporting Data",
            description:
              "Export expense data in various formats (Excel, PDF, CSV) for external analysis or compliance reporting.",
            tips: [
              "Choose appropriate date ranges",
              "Select relevant columns for export",
              "Use filters to focus on specific data",
              "Schedule regular exports for compliance",
            ],
          },
          {
            title: "Setting Up Automated Reports",
            description: "Configure recurring reports to be generated and delivered automatically via email.",
            tips: [
              "Set up monthly/quarterly reports for management",
              "Include key stakeholders in distribution",
              "Customize report content for different audiences",
            ],
          },
        ],
        commonIssues: [
          {
            issue: "AI report generation slow",
            solution:
              "Large datasets may take longer to process. Try reducing date ranges or filtering data for faster results.",
          },
          {
            issue: "Export file too large",
            solution:
              "Use filters to reduce data size or export in smaller date ranges. Consider CSV format for large datasets.",
          },
        ],
      },
    },
    {
      id: "budget-management",
      title: "Budget Management",
      description: "Create and monitor budgets with real-time tracking, alerts, and utilization analysis.",
      category: "Financial Planning",
      icon: <Target className="h-5 w-5" />,
      actions: [
        {
          name: "Budget Overview",
          description: "View budget status and utilization",
          onClick: () => onNavigate("budget-overview"),
        },
        {
          name: "Create Budget",
          description: "Set up new budget with categories",
          onClick: () => onNavigate("budget-creation"),
        },
      ],
      status: "active",
      detailedInstructions: {
        overview:
          "Budget management helps you set spending limits, track utilization, and receive alerts when approaching budget thresholds.",
        steps: [
          {
            title: "Creating a Budget",
            description: "Set up budgets by department, category, or project with specific amounts and time periods.",
            tips: [
              "Base budgets on historical data",
              "Include buffer for unexpected expenses",
              "Set realistic but controlled limits",
            ],
          },
          {
            title: "Monitoring Budget Performance",
            description: "Track real-time budget utilization with visual indicators and trend analysis.",
            tips: [
              "Check budget status regularly",
              "Set up alerts at 75% and 90% utilization",
              "Review monthly performance reports",
            ],
          },
        ],
      },
    },
    {
      id: "category-management",
      title: "Category Management",
      description: "Organize expenses with custom categories, subcategories, and automated categorization rules.",
      category: "Administration",
      icon: <Filter className="h-5 w-5" />,
      actions: [
        {
          name: "Manage Categories",
          description: "Create and edit expense categories",
          onClick: () => onNavigate("categories"),
        },
      ],
      status: "active",
      detailedInstructions: {
        overview:
          "Category management allows administrators to create, organize, and maintain expense categories for consistent classification.",
        steps: [
          {
            title: "Creating Categories",
            description: "Add new expense categories with clear names and descriptions for consistent usage.",
            tips: [
              "Use descriptive, unambiguous names",
              "Create hierarchical structures with subcategories",
              "Include usage guidelines",
            ],
          },
          {
            title: "Setting Up Auto-categorization",
            description:
              "Configure rules to automatically categorize expenses based on merchant names or expense patterns.",
            tips: [
              "Start with common merchants",
              "Test rules before implementing",
              "Review auto-categorized expenses regularly",
            ],
          },
        ],
      },
    },
    {
      id: "delegation-system",
      title: "Delegation Management",
      description: "Delegate approval authority with time limits, amount restrictions, and complete audit trails.",
      category: "Administration",
      icon: <Users className="h-5 w-5" />,
      actions: [
        {
          name: "Manage Delegations",
          description: "Set up approval delegations",
          onClick: () => onNavigate("delegations"),
        },
      ],
      status: "active",
      detailedInstructions: {
        overview:
          "Delegation management ensures continuous approval processes by allowing temporary transfer of approval authority.",
        steps: [
          {
            title: "Setting Up Delegations",
            description: "Create delegation rules with specific date ranges, amount limits, and delegate assignments.",
            tips: [
              "Plan delegations in advance",
              "Set appropriate amount limits",
              "Choose experienced delegates",
              "Document delegation scope",
            ],
          },
        ],
      },
    },
    {
      id: "recurring-expenses",
      title: "Recurring Expenses",
      description: "Automate recurring expense submissions with templates and scheduling.",
      category: "Automation",
      icon: <Calendar className="h-5 w-5" />,
      actions: [
        {
          name: "Manage Recurring",
          description: "Set up recurring expense templates",
          onClick: () => onNavigate("recurring"),
        },
      ],
      status: "active",
      detailedInstructions: {
        overview:
          "Recurring expenses automate the submission of regular expenses like subscriptions, rent, or utilities.",
        steps: [
          {
            title: "Creating Recurring Templates",
            description: "Set up templates for expenses that occur regularly with predefined amounts and schedules.",
            tips: [
              "Include all necessary details in templates",
              "Set appropriate recurrence patterns",
              "Review and update templates regularly",
            ],
          },
        ],
      },
    },
    {
      id: "reminder-system",
      title: "Smart Reminders",
      description: "Automated notifications for pending approvals, missing receipts, and budget alerts.",
      category: "Automation",
      icon: <Bell className="h-5 w-5" />,
      actions: [
        {
          name: "Configure Reminders",
          description: "Set up notification preferences",
          onClick: () => onNavigate("reminders"),
        },
      ],
      status: "active",
      detailedInstructions: {
        overview:
          "Smart reminders keep users informed about important actions and deadlines through automated notifications.",
        steps: [
          {
            title: "Setting Up Notifications",
            description: "Configure when and how you receive reminders for various system events.",
            tips: [
              "Balance notification frequency with productivity",
              "Use different channels for different priorities",
              "Set quiet hours for non-urgent notifications",
            ],
          },
        ],
      },
    },
    {
      id: "tax-management",
      title: "Tax Management",
      description: "Tax calculation, compliance tracking, and automated tax reporting features.",
      category: "Compliance",
      icon: <FileSpreadsheet className="h-5 w-5" />,
      actions: [
        {
          name: "Tax Settings",
          description: "Configure tax rates and rules",
          onClick: () => onNavigate("tax-management"),
        },
      ],
      status: "active",
      detailedInstructions: {
        overview:
          "Tax management ensures compliance with tax regulations and automates tax-related calculations and reporting.",
        steps: [
          {
            title: "Configuring Tax Rules",
            description: "Set up tax rates, exemptions, and calculation rules based on your jurisdiction requirements.",
            tips: [
              "Consult with tax professionals",
              "Update rates when regulations change",
              "Test calculations with sample data",
            ],
          },
        ],
      },
    },
    {
      id: "system-settings",
      title: "System Settings",
      description: "Configure system preferences, user permissions, and integration settings.",
      category: "Administration",
      icon: <Settings className="h-5 w-5" />,
      actions: [
        {
          name: "General Settings",
          description: "Configure system preferences",
          onClick: () => onNavigate("settings"),
        },
      ],
      status: "active",
      detailedInstructions: {
        overview:
          "System settings allow administrators to configure global preferences, user permissions, and system behavior.",
        steps: [
          {
            title: "User Management",
            description: "Add, remove, and manage user accounts with appropriate roles and permissions.",
            tips: ["Follow principle of least privilege", "Regular review user access", "Document role assignments"],
          },
          {
            title: "System Configuration",
            description: "Configure global settings like currency, date formats, and business rules.",
            tips: [
              "Test changes in non-production environment",
              "Document configuration changes",
              "Backup settings before major changes",
            ],
          },
        ],
      },
    },
  ]

  const categories = ["all", ...Array.from(new Set(features.map((f) => f.category)))]

  const filteredFeatures = features.filter((feature) => {
    const matchesSearch =
      feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || feature.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "beta":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "coming-soon":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
          <p className="text-muted-foreground">Comprehensive guide to all features and functionality in ExpenseFlow</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {features.length} Features Available
        </Badge>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-primary" />
            Getting Started Guide
          </CardTitle>
          <CardDescription>
            New to ExpenseFlow? Follow this step-by-step guide to get up and running quickly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="submitter" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="submitter">Expense Submitter</TabsTrigger>
              <TabsTrigger value="approver">Approver</TabsTrigger>
              <TabsTrigger value="admin">Administrator</TabsTrigger>
            </TabsList>

            <TabsContent value="submitter" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Create Your First Expense</h4>
                    <p className="text-sm text-muted-foreground mb-2">Start by submitting your first expense report</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Click "Create Expense" from the dashboard</li>
                      <li>• Fill in amount, date, and select appropriate category</li>
                      <li>• Upload a clear photo of your receipt</li>
                      <li>• Add a detailed description of the business purpose</li>
                    </ul>
                    <Button size="sm" className="mt-2" onClick={() => onNavigate("create-expense")}>
                      Create Expense <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Track Your Submissions</h4>
                    <p className="text-sm text-muted-foreground mb-2">Monitor the status of your expense reports</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• View all your expenses in "My Expenses"</li>
                      <li>• Check approval status and any comments from approvers</li>
                      <li>• Respond to requests for additional information</li>
                      <li>• Set up notifications for status changes</li>
                    </ul>
                    <Button size="sm" className="mt-2" onClick={() => onNavigate("my-expenses")}>
                      View My Expenses <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Set Up Recurring Expenses</h4>
                    <p className="text-sm text-muted-foreground mb-2">Automate regular expenses like subscriptions</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Create templates for monthly/quarterly expenses</li>
                      <li>• Set up automatic submission schedules</li>
                      <li>• Review and approve recurring submissions</li>
                    </ul>
                    <Button size="sm" className="mt-2" onClick={() => onNavigate("recurring")}>
                      Manage Recurring <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="approver" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Review Pending Approvals</h4>
                    <p className="text-sm text-muted-foreground mb-2">Start processing expense approvals efficiently</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Access your approval queue from the dashboard</li>
                      <li>• Review expense details and attached receipts</li>
                      <li>• Verify amounts match receipts and business purpose</li>
                      <li>• Approve, reject, or request more information</li>
                    </ul>
                    <Button size="sm" className="mt-2" onClick={() => onNavigate("approvals")}>
                      View Approval Queue <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-teal-50 dark:bg-teal-950/20 rounded-lg">
                  <div className="bg-teal-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Use Bulk Operations</h4>
                    <p className="text-sm text-muted-foreground mb-2">Process multiple expenses efficiently</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Select multiple similar expenses for bulk approval</li>
                      <li>• Filter by amount, category, or submitter</li>
                      <li>• Add comments for bulk rejections</li>
                      <li>• Review summary before confirming bulk actions</li>
                    </ul>
                    <Button size="sm" className="mt-2" onClick={() => onNavigate("bulk-approval")}>
                      Bulk Operations <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                  <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Set Up Delegations</h4>
                    <p className="text-sm text-muted-foreground mb-2">Ensure coverage during your absence</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Create delegation rules before planned absences</li>
                      <li>• Set amount limits and date ranges</li>
                      <li>• Choose experienced delegates</li>
                      <li>• Monitor delegated approvals upon return</li>
                    </ul>
                    <Button size="sm" className="mt-2" onClick={() => onNavigate("delegations")}>
                      Manage Delegations <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Configure System Settings</h4>
                    <p className="text-sm text-muted-foreground mb-2">Set up the system for your organization</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Configure currency, date formats, and business rules</li>
                      <li>• Set up user roles and permissions</li>
                      <li>• Configure approval workflows and limits</li>
                      <li>• Set up integrations and notifications</li>
                    </ul>
                    <Button size="sm" className="mt-2" onClick={() => onNavigate("settings")}>
                      System Settings <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
                  <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Manage Categories & Budgets</h4>
                    <p className="text-sm text-muted-foreground mb-2">Organize expenses and control spending</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Create expense categories and subcategories</li>
                      <li>• Set up budget limits by department or category</li>
                      <li>• Configure auto-categorization rules</li>
                      <li>• Monitor budget utilization and alerts</li>
                    </ul>
                    <Button size="sm" className="mt-2" onClick={() => onNavigate("categories")}>
                      Manage Categories <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-pink-50 dark:bg-pink-950/20 rounded-lg">
                  <div className="bg-pink-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Design Custom Workflows</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Create approval processes that match your business
                    </p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Use the visual workflow builder</li>
                      <li>• Set up conditional approvals based on amount or category</li>
                      <li>• Configure multi-level approval chains</li>
                      <li>• Test workflows before deployment</li>
                    </ul>
                    <Button size="sm" className="mt-2" onClick={() => onNavigate("visual-workflow")}>
                      Workflow Builder <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline-solid"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category.replace("-", " ")}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Database className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold">Modern Architecture</h3>
              <p className="text-sm text-muted-foreground">Next.js 14, React 18, TypeScript</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <h3 className="font-semibold">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">Groq integration for smart reports</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Smartphone className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold">Responsive Design</h3>
              <p className="text-sm text-muted-foreground">Works on all devices</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFeatures.map((feature) => (
          <Card key={feature.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">{feature.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {feature.category}
                    </Badge>
                  </div>
                </div>
                <Badge className={`text-xs ${getStatusColor(feature.status)}`}>
                  {feature.status.replace("-", " ")}
                </Badge>
              </div>
              <CardDescription className="mt-2">{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Available Actions:</h4>
                  <div className="space-y-2">
                    {feature.actions.map((action, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{action.name}</p>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={action.onClick} className="ml-2 bg-transparent">
                          Go
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedFeature(expandedFeature === feature.id ? null : feature.id)}
                    className="w-full justify-between p-2"
                  >
                    <span className="flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Detailed Instructions
                    </span>
                    <ArrowRight
                      className={`h-4 w-4 transition-transform ${expandedFeature === feature.id ? "rotate-90" : ""}`}
                    />
                  </Button>

                  {expandedFeature === feature.id && (
                    <div className="mt-3 space-y-4 p-3 bg-muted/30 rounded-lg">
                      <div>
                        <h5 className="font-semibold text-sm mb-2">Overview</h5>
                        <p className="text-sm text-muted-foreground">{feature.detailedInstructions.overview}</p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-sm mb-3">Step-by-Step Guide</h5>
                        <div className="space-y-3">
                          {feature.detailedInstructions.steps.map((step, index) => (
                            <div key={index} className="border-l-2 border-primary/20 pl-3">
                              <h6 className="font-medium text-sm">{step.title}</h6>
                              <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                              {step.tips && (
                                <div className="space-y-1">
                                  <p className="text-xs font-medium text-primary">Tips:</p>
                                  <ul className="text-xs text-muted-foreground space-y-1">
                                    {step.tips.map((tip, tipIndex) => (
                                      <li key={tipIndex} className="flex items-start gap-1">
                                        <CheckSquare className="h-3 w-3 mt-0.5 text-green-600 shrink-0" />
                                        {tip}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {feature.detailedInstructions.commonIssues && (
                        <div>
                          <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            Common Issues & Solutions
                          </h5>
                          <div className="space-y-2">
                            {feature.detailedInstructions.commonIssues.map((issue, index) => (
                              <div
                                key={index}
                                className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded border-l-2 border-amber-400"
                              >
                                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">{issue.issue}</p>
                                <p className="text-sm text-amber-700 dark:text-amber-300">{issue.solution}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Technical Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Technical Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Frontend</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Next.js 14</li>
                <li>React 18</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">UI Components</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Radix UI</li>
                <li>Lucide Icons</li>
                <li>Recharts</li>
                <li>React Hook Form</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Data & State</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>TanStack Query</li>
                <li>Zustand</li>
                <li>React Hook Form</li>
                <li>Zod Validation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Integrations</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Groq AI</li>
                <li>React-PDF</li>
                <li>ExcelJS</li>
                <li>Date-fns</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
