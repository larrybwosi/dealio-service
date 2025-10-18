'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Plus, Edit, Trash2, MoreHorizontal, Tag, DollarSign, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useCategories } from '@/hooks/use-categories';
import { CategoryDialog } from './categories/create-modal';

const categories = [
  {
    id: 'CAT-001',
    name: 'Office Supplies',
    code: 'OFF',
    description: 'General office supplies and stationery',
    color: '#3b82f6',
    isActive: true,
    requiresApproval: false,
    defaultBudget: 5000,
    expenseCount: 45,
    totalSpent: 2400,
    createdBy: 'Admin',
    createdDate: '2024-01-01',
  },
  {
    id: 'CAT-002',
    name: 'Travel & Transportation',
    code: 'TRV',
    description: 'Business travel, flights, hotels, and transportation',
    color: '#ef4444',
    isActive: true,
    requiresApproval: true,
    defaultBudget: 12000,
    expenseCount: 28,
    totalSpent: 8500,
    createdBy: 'Sarah Wilson',
    createdDate: '2024-01-01',
  },
  {
    id: 'CAT-003',
    name: 'Software & Subscriptions',
    code: 'SFT',
    description: 'Software licenses, SaaS subscriptions, and digital tools',
    color: '#10b981',
    isActive: true,
    requiresApproval: true,
    defaultBudget: 4000,
    expenseCount: 15,
    totalSpent: 3200,
    createdBy: 'Mike Johnson',
    createdDate: '2024-01-01',
  },
  {
    id: 'CAT-004',
    name: 'Marketing & Advertising',
    code: 'MKT',
    description: 'Marketing campaigns, advertising, and promotional materials',
    color: '#f59e0b',
    isActive: true,
    requiresApproval: false,
    defaultBudget: 8000,
    expenseCount: 22,
    totalSpent: 4800,
    createdBy: 'Alex Chen',
    createdDate: '2024-01-01',
  },
  {
    id: 'CAT-005',
    name: 'Training & Development',
    code: 'TRN',
    description: 'Employee training, courses, and professional development',
    color: '#8b5cf6',
    isActive: true,
    requiresApproval: false,
    defaultBudget: 3000,
    expenseCount: 12,
    totalSpent: 1800,
    createdBy: 'HR Team',
    createdDate: '2024-01-01',
  },
  {
    id: 'CAT-006',
    name: 'Meals & Entertainment',
    code: 'MEL',
    description: 'Business meals, client entertainment, and team events',
    color: '#06b6d4',
    isActive: false,
    requiresApproval: true,
    defaultBudget: 2000,
    expenseCount: 8,
    totalSpent: 650,
    createdBy: 'Finance',
    createdDate: '2024-01-01',
  },
];

export function CategoryManagement() {
  const [dialogOpen, setDialogOpen] = useQueryState('dialog', {
    defaultValue: false,
    parse: value => value === 'true',
    serialize: value => value.toString(),
  });

  const [editingCategoryId, setEditingCategoryId] = useQueryState('edit');

  const { data: cat } = useCategories();
  console.log(cat);

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 h-5 text-xs">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 h-5 text-xs">Inactive</Badge>
    );
  };

  const getUtilizationPercentage = (spent: number, budget: number) => {
    return budget > 0 ? (spent / budget) * 100 : 0;
  };

  const activeCategories = categories.filter(c => c.isActive);
  const totalExpenses = categories.reduce((sum, c) => sum + c.expenseCount, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.totalSpent, 0);

  const handleOpenCreateDialog = () => {
    setEditingCategoryId(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (categoryId: string) => {
    setEditingCategoryId(categoryId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategoryId(null);
  };

  const editingCategory = editingCategoryId ? categories.find(c => c.id === editingCategoryId) : null;

  return (
    <div className="p-4 space-y-4 flex-1">
      {/* Category Dialog */}
      <CategoryDialog open={dialogOpen} onOpenChange={setDialogOpen} editingCategory={editingCategory} />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">Category Management</h1>
          <p className="text-xs text-gray-600">Create and manage expense categories</p>
        </div>
        <Button variant="default" className="h-7 px-3 text-xs" onClick={handleOpenCreateDialog}>
          <Plus className="w-3 h-3 mr-1" />
          New Category
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Categories</p>
              <p className="text-sm font-semibold">{categories.length}</p>
            </div>
            <Tag className="w-4 h-4 text-blue-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Active Categories</p>
              <p className="text-sm font-semibold">{activeCategories.length}</p>
            </div>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Expenses</p>
              <p className="text-sm font-semibold">{totalExpenses}</p>
            </div>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Spent</p>
              <p className="text-sm font-semibold">${totalSpent.toLocaleString()}</p>
            </div>
            <DollarSign className="w-4 h-4 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">All Categories</CardTitle>
          <CardDescription className="text-xs">Manage expense categories and their settings</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs p-2">Category</TableHead>
                <TableHead className="text-xs p-2">Code</TableHead>
                <TableHead className="text-xs p-2">Budget Usage</TableHead>
                <TableHead className="text-xs p-2">Expenses</TableHead>
                <TableHead className="text-xs p-2">Status</TableHead>
                <TableHead className="text-xs p-2">Settings</TableHead>
                <TableHead className="text-xs p-2 w-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map(category => {
                const utilizationPercentage = getUtilizationPercentage(category.totalSpent, category.defaultBudget);
                return (
                  <TableRow key={category.id} className="hover:bg-gray-50">
                    <TableCell className="p-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: category.color }} />
                        <div>
                          <p className="text-xs font-medium">{category.name}</p>
                          <p className="text-xs text-gray-500">{category.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <Badge variant="outline" className="text-xs h-4">
                        {category.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>${category.totalSpent.toLocaleString()}</span>
                          <span>{utilizationPercentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className={`h-1 rounded-full ${
                              utilizationPercentage > 90
                                ? 'bg-red-500'
                                : utilizationPercentage > 75
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                            }`}
                            style={{
                              width: `${Math.min(utilizationPercentage, 100)}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">of ${category.defaultBudget.toLocaleString()}</p>
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <div>
                        <p className="text-xs font-medium">{category.expenseCount}</p>
                        <p className="text-xs text-gray-500">submissions</p>
                      </div>
                    </TableCell>
                    <TableCell className="p-2">{getStatusBadge(category.isActive)}</TableCell>
                    <TableCell className="p-2">
                      <div className="space-y-1">
                        {category.requiresApproval && (
                          <Badge variant="outline" className="text-xs h-4">
                            <AlertTriangle className="w-2 h-2 mr-1" />
                            Approval Required
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem className="text-xs" onClick={() => handleOpenEditDialog(category.id)}>
                            <Edit className="mr-2 h-3 w-3" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs">
                            <Users className="mr-2 h-3 w-3" />
                            View Expenses
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs text-red-600">
                            <Trash2 className="mr-2 h-3 w-3" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Category Analytics */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Top Categories by Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories
                .sort((a, b) => b.totalSpent - a.totalSpent)
                .slice(0, 5)
                .map((category, index) => (
                  <div key={category.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">#{index + 1}</span>
                      <div className="w-2 h-2 rounded" style={{ backgroundColor: category.color }} />
                      <span className="text-xs">{category.name}</span>
                    </div>
                    <span className="text-xs font-medium">${category.totalSpent.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Budget Utilization Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories
                .filter(c => getUtilizationPercentage(c.totalSpent, c.defaultBudget) > 75)
                .map(category => {
                  const percentage = getUtilizationPercentage(category.totalSpent, category.defaultBudget);
                  return (
                    <div key={category.id} className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                      <AlertTriangle className="w-3 h-3 text-yellow-600" />
                      <div className="flex-1">
                        <p className="text-xs font-medium">{category.name}</p>
                        <p className="text-xs text-gray-600">{percentage.toFixed(0)}% of budget used</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
