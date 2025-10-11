"use client";

import { useState, useEffect } from "react";
import { useQueryState } from "nuqs";
import { Sidebar } from "@/components/expense-sidebar";
import { ExpenseDashboard } from "@/components/expense-dashboard";
import ExpenseFormWithQuery from "@/components/expense-form-with-query";
import { ExpenseListWithQuery } from "@/components/expense-list-with-query";
import { BudgetOverview } from "@/components/budget-overview";
import { ApprovalWorkflow } from "@/components/approval-workflow";
import { ExpenseAnalytics } from "@/components/expense-analytics";
import { RecurringExpenses } from "@/components/recurring-expenses";
import { ExpenseSettings } from "@/components/expense-settings";
import { BudgetCreation } from "@/components/budget-creation";
import { BulkApproval } from "@/components/bulk-approval";
import { DelegationManagement } from "@/components/delegation-management";
import { ReminderSystem } from "@/components/reminder-system";
import { TaxManagement } from "@/components/tax-management";
import { MyExpensesWithComments } from "@/components/my-expenses-with-comments";
import { EnhancedApprovalWorkflow } from "@/components/enhanced-approval-workflow";
import { CategoryManagement } from "@/components/category-management";
import { VisualWorkflowBuilder } from "@/components/visual-workflow-builder";
import { ReportsDashboard } from "@/components/reports-dashboard";
import DocumentationPage from "@/components/documentation-page";
import { UserManagement } from "@/components/user-management";
import { DepartmentManagement } from "@/components/department-management";
import { RoleManagement } from "@/components/role-management";
import { MemberOperations } from "@/components/member-operations";

export default function ExpenseManagementSystem() {
  const [view, setView] = useQueryState("view", {
    defaultValue: "dashboard",
    clearOnDefault: true,
  });
  const [activeView, setActiveView] = useState(view);

  // Sync URL state with component state
  useEffect(() => {
    setActiveView(view);
  }, [view]);

  // Handle view changes and update URL
  const handleViewChange = (newView: string) => {
    setActiveView(newView);
    setView(newView);
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <ExpenseDashboard />;
      case "create":
        return <ExpenseFormWithQuery />;
      case "expenses":
        return <ExpenseListWithQuery />;
      case "my-expenses":
        return <MyExpensesWithComments />;
      case "budgets":
        return <BudgetOverview />;
      case "create-budget":
        return <BudgetCreation />;
      case "approvals":
        return <ApprovalWorkflow />;
      case "enhanced-approvals":
        return <EnhancedApprovalWorkflow />;
      case "bulk-approval":
        return <BulkApproval />;
      case "delegation":
        return <DelegationManagement />;
      case "reminders":
        return <ReminderSystem />;
      case "tax":
        return <TaxManagement />;
      case "categories":
        return <CategoryManagement />;
      case "analytics":
        return <ExpenseAnalytics />;
      case "recurring":
        return <RecurringExpenses />;
      case "settings":
        return <ExpenseSettings />;
      case "visual-workflow":
        return <VisualWorkflowBuilder />;
      case "reports":
      case "ai-reports":
        return <ReportsDashboard />;
      case "documentation":
        return <DocumentationPage onNavigate={handleViewChange} />;
      case "user-management":
        return <UserManagement />;
      case "department-management":
        return <DepartmentManagement />;
      case "role-management":
        return <RoleManagement />;
      case "member-operations":
        return <MemberOperations />;
      default:
        return <ExpenseDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={handleViewChange} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}
