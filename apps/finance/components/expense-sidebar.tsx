"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import {
  LayoutDashboard,
  Plus,
  FileText,
  CreditCard,
  PieChart,
  CheckCircle,
  Settings,
  BarChart3,
  Repeat,
  Users,
  Bell,
  Calculator,
  FolderOpen,
  Target,
  Zap,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Clock,
  GitBranch,
  BookOpen,
  Shield,
  Building,
  UserPlus,
} from "lucide-react"

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    {
      section: "Overview",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
        { id: "analytics", label: "Analytics", icon: BarChart3, badge: null },
        { id: "documentation", label: "Documentation", icon: BookOpen, badge: null }, // Added documentation menu item
      ],
    },
    {
      section: "Expenses",
      items: [
        { id: "create", label: "Create Expense", icon: Plus, badge: null },
        { id: "my-expenses", label: "My Expenses", icon: FileText, badge: "3" },
        { id: "expenses", label: "All Expenses", icon: CreditCard, badge: null },
        { id: "recurring", label: "Recurring", icon: Repeat, badge: null },
      ],
    },
    {
      section: "Budgets & Finance",
      items: [
        { id: "budgets", label: "Budget Overview", icon: PieChart, badge: null },
        { id: "create-budget", label: "Create Budget", icon: Target, badge: null },
        { id: "tax", label: "Tax Management", icon: Calculator, badge: "2" },
      ],
    },
    {
      section: "Approvals",
      items: [
        { id: "approvals", label: "Approval Queue", icon: CheckCircle, badge: "5" },
        { id: "enhanced-approvals", label: "Enhanced Approvals", icon: Zap, badge: null },
        { id: "visual-workflow", label: "Workflow Builder", icon: GitBranch, badge: "New" },
        { id: "bulk-approval", label: "Bulk Approval", icon: Users, badge: null },
        { id: "delegation", label: "Delegations", icon: Users, badge: null },
      ],
    },
    {
      section: "Reports",
      items: [
        { id: "reports", label: "Reports Dashboard", icon: FileText, badge: null },
        { id: "ai-reports", label: "AI Report Generator", icon: Zap, badge: "AI" },
      ],
    },
    {
      section: "Administration",
      items: [
        { id: "user-management", label: "User Management", icon: Users, badge: null },
        { id: "department-management", label: "Departments", icon: Building, badge: null },
        { id: "role-management", label: "Role Management", icon: Shield, badge: null },
        { id: "member-operations", label: "Member Operations", icon: UserPlus, badge: null },
      ],
    },
    {
      section: "Management",
      items: [
        { id: "reminders", label: "Reminders", icon: Bell, badge: "7" },
        { id: "categories", label: "Categories", icon: FolderOpen, badge: null },
        { id: "settings", label: "Settings", icon: Settings, badge: null },
      ],
    },
  ]

  const quickStats = [
    { label: "Pending Approvals", value: "5", color: "text-orange-600", icon: Clock },
    { label: "This Month", value: "$12,450", color: "text-blue-600", icon: DollarSign },
    { label: "Budget Used", value: "68%", color: "text-green-600", icon: TrendingUp },
    { label: "Overdue", value: "2", color: "text-red-600", icon: AlertTriangle },
  ]

  return (
    <div
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">ExpenseFlow</h1>
              <p className="text-xs text-gray-500">Expense Management</p>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 h-8 w-8">
            <LayoutDashboard className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Stats</h3>
          <div className="space-y-2">
            {quickStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{stat.label}</span>
                <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {!isCollapsed && (
                <h3 className="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {section.section}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeView === item.id ? "secondary" : "ghost"}
                    className={`w-full justify-start h-9 ${isCollapsed ? "px-2" : "px-3"} ${
                      activeView === item.id
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => onViewChange(item.id)}
                  >
                    <item.icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"} shrink-0`} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left text-sm">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto h-5 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                ))}
              </div>
              {sectionIndex < menuItems.length - 1 && !isCollapsed && <Separator className="my-4" />}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">Finance Manager</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
