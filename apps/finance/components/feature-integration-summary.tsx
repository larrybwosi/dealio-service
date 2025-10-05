"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { CheckCircle, MessageSquare, Users, Bell, Tag, DollarSign, TrendingUp, Calendar, FileText } from "lucide-react"

export function FeatureIntegrationSummary() {
  const newFeatures = [
    {
      title: "Enhanced Comment System",
      description: "Mandatory comments for rejections, optional for approvals",
      icon: MessageSquare,
      status: "active",
      benefits: [
        "Clear feedback for rejected expenses",
        "Optional approval comments for context",
        "Complete audit trail of decisions",
        "Improved communication between approvers and submitters",
      ],
    },
    {
      title: "Bulk Approval Functionality",
      description: "Approve/reject multiple expenses efficiently",
      icon: CheckCircle,
      status: "active",
      benefits: [
        "Approve by amount threshold",
        "Filter by category or submitter",
        "Batch processing capabilities",
        "Significant time savings for approvers",
      ],
    },
    {
      title: "Delegation Management",
      description: "Delegate approval authority with controls",
      icon: Users,
      status: "active",
      benefits: [
        "Time-bound delegation periods",
        "Amount and category restrictions",
        "Automatic notifications",
        "Complete delegation audit trail",
      ],
    },
    {
      title: "Smart Reminder System",
      description: "Automated reminders for various scenarios",
      icon: Bell,
      status: "active",
      benefits: [
        "Pending approval reminders",
        "Budget threshold alerts",
        "Missing receipt notifications",
        "Customizable frequency settings",
      ],
    },
    {
      title: "Category Management",
      description: "Create and manage expense categories",
      icon: Tag,
      status: "active",
      benefits: [
        "Custom category creation",
        "Budget allocation per category",
        "Approval requirements configuration",
        "Usage analytics and insights",
      ],
    },
    {
      title: "Budget Creation System",
      description: "Comprehensive budget planning and allocation",
      icon: DollarSign,
      status: "active",
      benefits: [
        "Multi-category budget allocation",
        "Alert threshold configuration",
        "Department-wise budgeting",
        "Real-time utilization tracking",
      ],
    },
  ]

  const integrationStats = {
    totalFeatures: 6,
    activeFeatures: 6,
    userImpact: "95%",
    timeReduction: "60%",
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">Feature Integration Summary</h1>
          <p className="text-xs text-gray-600">Overview of newly integrated expense management features</p>
        </div>
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 h-6 text-xs">
          <CheckCircle className="w-3 h-3 mr-1" />
          All Features Active
        </Badge>
      </div>

      {/* Integration Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">New Features</p>
              <p className="text-sm font-semibold">{integrationStats.totalFeatures}</p>
            </div>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Active Features</p>
              <p className="text-sm font-semibold">{integrationStats.activeFeatures}</p>
            </div>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">User Impact</p>
              <p className="text-sm font-semibold">{integrationStats.userImpact}</p>
            </div>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Time Reduction</p>
              <p className="text-sm font-semibold">{integrationStats.timeReduction}</p>
            </div>
            <Calendar className="w-4 h-4 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 gap-4">
        {newFeatures.map((feature, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <feature.icon className="w-4 h-4 text-blue-600" />
                  <CardTitle className="text-sm">{feature.title}</CardTitle>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 h-4 text-xs">{feature.status}</Badge>
              </div>
              <CardDescription className="text-xs">{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="text-xs font-medium">Key Benefits:</h4>
                <ul className="space-y-1">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start gap-2 text-xs">
                      <CheckCircle className="w-2 h-2 text-green-600 mt-1 shrink-0" />
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Implementation Highlights */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Implementation Highlights</CardTitle>
          <CardDescription className="text-xs">Key technical and user experience improvements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs font-medium flex items-center gap-2">
                <MessageSquare className="w-3 h-3 text-blue-600" />
                Comment System
              </h4>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Mandatory rejection comments</li>
                <li>• Optional approval comments</li>
                <li>• Real-time comment viewing</li>
                <li>• Comment history tracking</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-medium flex items-center gap-2">
                <Users className="w-3 h-3 text-purple-600" />
                Delegation & Bulk Actions
              </h4>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Time-bound delegations</li>
                <li>• Amount-based bulk approval</li>
                <li>• Category filtering</li>
                <li>• Automated notifications</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-medium flex items-center gap-2">
                <Tag className="w-3 h-3 text-green-600" />
                Category & Budget Management
              </h4>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Dynamic category creation</li>
                <li>• Budget allocation tools</li>
                <li>• Usage analytics</li>
                <li>• Alert configurations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Workflow Improvements */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">User Workflow Improvements</CardTitle>
          <CardDescription className="text-xs">How the new features enhance user experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded">
              <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-xs font-medium">For Expense Submitters</h4>
                <p className="text-xs text-gray-600">
                  Clear feedback on rejections, real-time status updates, and comprehensive comment viewing
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <h4 className="text-xs font-medium">For Approvers</h4>
                <p className="text-xs text-gray-600">
                  Bulk processing capabilities, delegation options, and automated reminder systems
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded">
              <Users className="w-4 h-4 text-purple-600 mt-0.5" />
              <div>
                <h4 className="text-xs font-medium">For Administrators</h4>
                <p className="text-xs text-gray-600">
                  Complete category management, budget creation tools, and comprehensive system configuration
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">System Status & Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium">All features successfully integrated and active</span>
            </div>
            <Button size="sm" className="h-7 px-3 text-xs">
              View System Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
