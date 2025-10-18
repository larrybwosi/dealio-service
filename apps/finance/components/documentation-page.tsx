"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Separator } from "@workspace/ui/components/separator"
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
  HelpCircle,
  Sparkles,
  Keyboard,
  LifeBuoy,
  FileText,
  Mail,
  MessageSquare,
  Video,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Lightbulb,
  Shield,
  Cpu,
  Workflow,
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

export function DocumentationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)
  const [bookmarkedFeatures, setBookmarkedFeatures] = useState<Set<string>>(new Set())

  const onNavigate = (featureId: string) => {
    console.log(`Navigating to feature: ${featureId}`)
  }
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
      icon: <Workflow className="h-5 w-5" />,
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
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
      case "beta":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800"
      case "coming-soon":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const toggleBookmark = (featureId: string) => {
    const newBookmarks = new Set(bookmarkedFeatures)
    if (newBookmarks.has(featureId)) {
      newBookmarks.delete(featureId)
    } else {
      newBookmarks.add(featureId)
    }
    setBookmarkedFeatures(newBookmarks)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-blue-950/20">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col space-y-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ExpenseFlow Documentation
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Complete guide to all features and functionality in ExpenseFlow v2.4
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm px-3 py-1.5 border-2">
                {features.length} Features
              </Badge>
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark className="h-4 w-4" />
                Bookmarks ({bookmarkedFeatures.size})
              </Button>
            </div>
          </div>

          {/* Welcome Banner */}
          <div className="relative p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-blue-200/50 dark:border-blue-800/50 shadow-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-xl"></div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg shrink-0">
                <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 text-lg">
                    Welcome to ExpenseFlow Documentation
                  </h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    v2.4.0
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  ExpenseFlow is a comprehensive expense management solution designed to streamline the entire expense
                  lifecycle. This documentation provides detailed information about all features, step-by-step guides,
                  and best practices.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="justify-start gap-2 bg-white/50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                    onClick={() => onNavigate("dashboard")}
                  >
                    <BarChart3 className="h-4 w-4" />
                    Dashboard Guide
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="justify-start gap-2 bg-white/50 dark:bg-slate-800/50 hover:bg-green-50 dark:hover:bg-green-950/30"
                    onClick={() => onNavigate("create-expense")}
                  >
                    <DollarSign className="h-4 w-4" />
                    Create Expense
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="justify-start gap-2 bg-white/50 dark:bg-slate-800/50 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                    onClick={() => onNavigate("reports")}
                  >
                    <FileText className="h-4 w-4" />
                    Reports & Analytics
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Start */}
            <Card className="shadow-sm border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PlayCircle className="h-5 w-5 text-blue-500" />
                  Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-auto py-3"
                  onClick={() => onNavigate("create-expense")}
                >
                  <div className="text-left">
                    <p className="font-medium text-sm">First Expense</p>
                    <p className="text-xs text-muted-foreground">Submit your first expense</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-auto py-3"
                  onClick={() => onNavigate("approvals")}
                >
                  <div className="text-left">
                    <p className="font-medium text-sm">Approval Process</p>
                    <p className="text-xs text-muted-foreground">Learn approval workflows</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-auto py-3"
                  onClick={() => onNavigate("reports")}
                >
                  <div className="text-left">
                    <p className="font-medium text-sm">Reports</p>
                    <p className="text-xs text-muted-foreground">Generate AI reports</p>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Categories Filter */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="h-5 w-5" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedCategory === category
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium"
                        : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <span className="capitalize">{category.replace("-", " ")}</span>
                    {category !== "all" && (
                      <span className="float-right text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded-full">
                        {features.filter((f) => f.category === category).length}
                      </span>
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Features</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30">
                    {features.filter((f) => f.status === "active").length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Beta Testing</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30">
                    {features.filter((f) => f.status === "beta").length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Coming Soon</span>
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 dark:bg-gray-800">
                    {features.filter((f) => f.status === "coming-soon").length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Getting Started Guide */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-900 dark:to-blue-950/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <PlayCircle className="h-5 w-5 text-blue-500" />
                  Getting Started Guide
                </CardTitle>
                <CardDescription>
                  New to ExpenseFlow? Follow this step-by-step guide to get up and running quickly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="submitter" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1">
                    <TabsTrigger
                      value="submitter"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
                    >
                      Expense Submitter
                    </TabsTrigger>
                    <TabsTrigger
                      value="approver"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
                    >
                      Approver
                    </TabsTrigger>
                    <TabsTrigger
                      value="admin"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
                    >
                      Administrator
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="submitter" className="space-y-4 mt-4">
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

                  <TabsContent value="approver" className="space-y-4 mt-4">
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

                  <TabsContent value="admin" className="space-y-4 mt-4">
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

            {/* Search and Features Grid */}
            <div className="space-y-6">
              {/* Search Header */}
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Search className="h-5 w-5" />
                      Feature Documentation
                    </CardTitle>
                    <div className="flex-1 max-w-md">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search features..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 bg-white/50 dark:bg-slate-800/50"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Features Grid */}
              {filteredFeatures.length === 0 ? (
                <Card className="text-center py-12 border-0 shadow-sm">
                  <CardContent>
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="font-semibold text-lg mb-2">No features found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria to find what you're looking for.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredFeatures.map((feature) => (
                    <Card
                      key={feature.id}
                      className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                              {feature.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <CardTitle className="text-lg truncate">{feature.title}</CardTitle>
                                <button
                                  onClick={() => toggleBookmark(feature.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Bookmark
                                    className={`h-4 w-4 ${
                                      bookmarkedFeatures.has(feature.id)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                </button>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-slate-100 dark:bg-slate-800"
                                >
                                  {feature.category}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-xs border ${getStatusColor(feature.status)}`}
                                >
                                  {feature.status.replace("-", " ")}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="mt-2 line-clamp-2">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300">
                            Quick Actions
                          </h4>
                          <div className="space-y-2">
                            {feature.actions.map((action, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg group/action hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-sm truncate">{action.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {action.description}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={action.onClick}
                                  className="ml-2 shrink-0 opacity-0 group-hover/action:opacity-100 transition-opacity"
                                >
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
                            onClick={() =>
                              setExpandedFeature(expandedFeature === feature.id ? null : feature.id)
                            }
                            className="w-full justify-between p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <span className="flex items-center gap-2 text-sm">
                              <Info className="h-4 w-4" />
                              Detailed Instructions
                            </span>
                            {expandedFeature === feature.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>

                          {expandedFeature === feature.id && (
                            <div className="mt-3 space-y-4 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg border">
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* What's New Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  What's New in ExpenseFlow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-purple-200 dark:border-purple-800">
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">v2.4.0</Badge>
                    <div>
                      <h4 className="font-semibold">AI-Powered Analytics</h4>
                      <p className="text-sm text-muted-foreground mb-2">Released: June 15, 2023</p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Advanced expense pattern detection using Groq AI</li>
                        <li>• Automated spending insights with actionable recommendations</li>
                        <li>• Natural language query support for expense data</li>
                        <li>• Anomaly detection for unusual spending patterns</li>
                      </ul>
                      <Button size="sm" variant="outline" className="mt-2" onClick={() => onNavigate("analytics")}>
                        Explore AI Analytics <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">v2.3.0</Badge>
                    <div>
                      <h4 className="font-semibold">Mobile Receipt Scanning</h4>
                      <p className="text-sm text-muted-foreground mb-2">Released: April 3, 2023</p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Instant receipt scanning with OCR technology</li>
                        <li>• Automatic field extraction (date, amount, vendor)</li>
                        <li>• Offline mode for scanning without connectivity</li>
                        <li>• Batch scanning for multiple receipts</li>
                      </ul>
                      <Button size="sm" variant="outline" className="mt-2" onClick={() => onNavigate("mobile-app")}>
                        Download Mobile App <Download className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-green-200 dark:border-green-800">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">v2.2.0</Badge>
                    <div>
                      <h4 className="font-semibold">Advanced Workflow Builder</h4>
                      <p className="text-sm text-muted-foreground mb-2">Released: February 10, 2023</p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Visual drag-and-drop workflow designer</li>
                        <li>• Conditional approval paths based on multiple criteria</li>
                        <li>• Automated notifications and escalations</li>
                        <li>• Workflow templates for common approval scenarios</li>
                      </ul>
                      <Button size="sm" variant="outline" className="mt-2" onClick={() => onNavigate("visual-workflow")}>
                        Try Workflow Builder <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Keyboard Shortcuts */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Keyboard className="h-5 w-5" />
                  Keyboard Shortcuts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Navigation Shortcuts</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                        <span className="text-sm">Go to Dashboard</span>
                        <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">Alt + D</kbd>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                        <span className="text-sm">Go to Expenses</span>
                        <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">Alt + E</kbd>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                        <span className="text-sm">Go to Approvals</span>
                        <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">Alt + A</kbd>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                        <span className="text-sm">Go to Reports</span>
                        <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">Alt + R</kbd>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                        <span className="text-sm">Go to Settings</span>
                        <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">Alt + S</kbd>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Action Shortcuts</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                        <span className="text-sm">Create New Expense</span>
                        <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">Ctrl + N</kbd>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                        <span className="text-sm">Save Draft</span>
                        <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">Ctrl + S</kbd>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                        <span className="text-sm">Submit Expense</span>
                        <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">Ctrl + Enter</kbd>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                        <span className="text-sm">Approve Selected</span>
                        <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">Ctrl + Y</kbd>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                        <span className="text-sm">Reject Selected</span>
                        <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">Ctrl + R</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <HelpCircle className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white/50 dark:bg-slate-800/30">
                    <h4 className="font-semibold mb-2">How do I upload multiple receipts for a single expense?</h4>
                    <p className="text-sm text-muted-foreground">
                      When creating or editing an expense, you can upload multiple receipts by clicking the "Add Receipt" button multiple times or by selecting multiple files when prompted. Each expense can have up to 10 receipt attachments with a maximum size of 10MB each.
                    </p>
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white/50 dark:bg-slate-800/30">
                    <h4 className="font-semibold mb-2">What happens if my expense is rejected?</h4>
                    <p className="text-sm text-muted-foreground">
                      If your expense is rejected, you'll receive a notification with the reason for rejection. You can then edit the expense to address the issues and resubmit it. The system maintains a complete history of all submissions, rejections, and comments for audit purposes.
                    </p>
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white/50 dark:bg-slate-800/30">
                    <h4 className="font-semibold mb-2">Can I delegate my approval authority while I'm on vacation?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can set up approval delegations for specific date ranges. Navigate to "Delegations" in the system settings, specify the delegate, date range, and optional amount limits. All actions taken by delegates are clearly marked in the audit trail.
                    </p>
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white/50 dark:bg-slate-800/30">
                    <h4 className="font-semibold mb-2">How are multi-currency expenses handled?</h4>
                    <p className="text-sm text-muted-foreground">
                      ExpenseFlow supports multi-currency expenses with automatic conversion to your base currency. When creating an expense, select the currency used for the transaction, and the system will apply the current exchange rate. You can also manually override the exchange rate if needed.
                    </p>
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white/50 dark:bg-slate-800/30">
                    <h4 className="font-semibold mb-2">Can I create expense reports for specific projects or clients?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can tag expenses with project codes or client IDs and then generate filtered reports based on these tags. This allows for accurate cost allocation and client billing. Use the "Advanced Filters" option in the reporting section to create project-specific or client-specific reports.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support & Resources */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <LifeBuoy className="h-5 w-5" />
                  Support & Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg text-center bg-white/50 dark:bg-slate-800/30">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold">Documentation</h3>
                    <p className="text-sm text-muted-foreground mb-3">Comprehensive guides and tutorials</p>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => window.open('#', '_blank')}>
                      View Documentation <ExternalLink className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg text-center bg-white/50 dark:bg-slate-800/30">
                    <Video className="h-8 w-8 mx-auto mb-2 text-red-600" />
                    <h3 className="font-semibold">Video Tutorials</h3>
                    <p className="text-sm text-muted-foreground mb-3">Step-by-step visual guides</p>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => window.open('#', '_blank')}>
                      Watch Tutorials <ExternalLink className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg text-center bg-white/50 dark:bg-slate-800/30">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold">Live Support</h3>
                    <p className="text-sm text-muted-foreground mb-3">Chat with our support team</p>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => window.open('#', '_blank')}>
                      Contact Support <Mail className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Information */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Cpu className="h-5 w-5" />
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
                      <li>TypeScript 5.1</li>
                      <li>Tailwind CSS 3.3</li>
                      <li>ShadcnUI Components</li>
                      <li>Server Components</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">UI Components</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>Radix UI Primitives</li>
                      <li>Lucide Icons</li>
                      <li>Recharts 2.7</li>
                      <li>React Hook Form</li>
                      <li>React DnD</li>
                      <li>React Dropzone</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Data & State</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>TanStack Query v5</li>
                      <li>Zustand 4.4</li>
                      <li>React Hook Form 7.45</li>
                      <li>Zod Validation</li>
                      <li>Server Actions</li>
                      <li>Edge Runtime</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Integrations</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>Groq AI API</li>
                      <li>React-PDF</li>
                      <li>ExcelJS</li>
                      <li>Date-fns</li>
                      <li>Tesseract.js OCR</li>
                      <li>Auth.js Authentication</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}