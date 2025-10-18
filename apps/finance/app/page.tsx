'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useQueryState } from 'nuqs';
import { Sidebar } from '@/components/expense-sidebar';
import { OrgProvider } from '@/lib/providers/org';

// Lazy load all view components
const ExpenseDashboard = lazy(() =>
  import('@/components/expense-dashboard').then(m => ({
    default: m.ExpenseDashboard,
  }))
);
const ExpenseForm = lazy(() =>
  import('@/components/expense-form-with-query').then(m => ({
    default: m.ExpenseFormWithQuery,
  }))
);
const ExpenseListWithQuery = lazy(() =>
  import('@/components/expense-list-with-query').then(m => ({
    default: m.ExpenseListWithQuery,
  }))
);
const MyExpensesWithComments = lazy(() =>
  import('@/components/my-expenses-with-comments').then(m => ({
    default: m.MyExpensesWithComments,
  }))
);
const BudgetOverview = lazy(() =>
  import('@/components/budget-overview').then(m => ({
    default: m.BudgetOverview,
  }))
);
const BudgetCreation = lazy(() =>
  import('@/components/budget-creation').then(m => ({
    default: m.BudgetCreation,
  }))
);
const ApprovalWorkflow = lazy(() =>
  import('@/components/approval-workflow').then(m => ({
    default: m.ApprovalWorkflow,
  }))
);
const EnhancedApprovalWorkflow = lazy(() =>
  import('@/components/enhanced-approval-workflow').then(m => ({
    default: m.EnhancedApprovalWorkflow,
  }))
);
const BulkApproval = lazy(() =>
  import('@/components/bulk-approval').then(m => ({
    default: m.BulkApproval,
  }))
);
const DelegationManagement = lazy(() =>
  import('@/components/delegation-management').then(m => ({
    default: m.DelegationManagement,
  }))
);
const ReminderSystem = lazy(() =>
  import('@/components/reminder-system').then(m => ({
    default: m.ReminderSystem,
  }))
);
const TaxManagement = lazy(() =>
  import('@/components/tax-management').then(m => ({
    default: m.TaxManagement,
  }))
);
const CategoryManagement = lazy(() =>
  import('@/components/category-management').then(m => ({
    default: m.CategoryManagement,
  }))
);
const ExpenseAnalytics = lazy(() =>
  import('@/components/expense-analytics').then(m => ({
    default: m.ExpenseAnalytics,
  }))
);
const RecurringExpenses = lazy(() =>
  import('@/components/recurring-expenses').then(m => ({
    default: m.RecurringExpenses,
  }))
);
const ExpenseSettings = lazy(() =>
  import('@/components/expense-settings').then(m => ({
    default: m.ExpenseSettings,
  }))
);
const VisualWorkflowBuilder = lazy(() =>
  import('@/components/visual-workflow-builder').then(m => ({
    default: m.VisualWorkflowBuilder,
  }))
);
const ReportsDashboard = lazy(() =>
  import('@/components/reports-dashboard').then(m => ({
    default: m.ReportsDashboard,
  }))
);
const DocumentationPage = lazy(() =>
  import('@/components/documentation-page').then(m => ({
    default: m.DocumentationPage,
  }))
);
const UserManagement = lazy(() =>
  import('@/components/user-management').then(m => ({
    default: m.UserManagement,
  }))
);
const DepartmentManagement = lazy(() =>
  import('@/components/department-management').then(m => ({
    default: m.DepartmentManagement,
  }))
);
const RoleManagement = lazy(() =>
  import('@/components/role-management').then(m => ({
    default: m.RoleManagement,
  }))
);
const MemberOperations = lazy(() =>
  import('@/components/member-operations').then(m => ({
    default: m.MemberOperations,
  }))
);

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="text-center">
        <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// View map for cleaner rendering logic
const VIEW_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  dashboard: ExpenseDashboard,
  create: ExpenseForm,
  expenses: ExpenseListWithQuery,
  'my-expenses': MyExpensesWithComments,
  budgets: BudgetOverview,
  'create-budget': BudgetCreation,
  approvals: ApprovalWorkflow,
  'enhanced-approvals': EnhancedApprovalWorkflow,
  'bulk-approval': BulkApproval,
  delegation: DelegationManagement,
  reminders: ReminderSystem,
  tax: TaxManagement,
  categories: CategoryManagement,
  analytics: ExpenseAnalytics,
  recurring: RecurringExpenses,
  settings: ExpenseSettings,
  'visual-workflow': VisualWorkflowBuilder,
  reports: ReportsDashboard,
  'ai-reports': ReportsDashboard,
  documentation: DocumentationPage,
  'user-management': UserManagement,
  'department-management': DepartmentManagement,
  'role-management': RoleManagement,
  'member-operations': MemberOperations,
};

export default function ExpenseManagementSystem() {
  const [view, setView] = useQueryState('view', {
    defaultValue: 'dashboard',
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

  // Get the component for current view
  const ViewComponent = VIEW_COMPONENTS[activeView] || ExpenseDashboard;

  return (
    <div className="flex h-screen">
      <Sidebar activeView={activeView} onViewChange={handleViewChange} />
      <main className="flex-1 overflow-auto">
        <OrgProvider>
          <Suspense fallback={<LoadingFallback />}>
            <ViewComponent onNavigate={activeView === 'documentation' ? handleViewChange : undefined} />
          </Suspense>
          {/* Portal for shadcn dialogs */}
          <div id="dialog-portal" />
        </OrgProvider>
      </main>
    </div>
  );
}
