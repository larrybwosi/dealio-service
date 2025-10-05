'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Progress } from '@workspace/ui/components/progress';
import { Skeleton } from '@workspace/ui/components/skeleton';
import RecipeManager from '@/components/RecipeManager';
import TemplateManager from '@/components/TemplateManager';
import BatchManager from '@/components/BatchManager';
import CategoryManager from '@/components/CategoryManager';
import BakerManager from '@/components/BakerManager';
import IngredientManager from '@/components/IngredientManager';
import {
  ChefHat,
  Clock,
  Users,
  BookOpen,
  File,
  Package,
  AlertTriangle,
  DollarSign,
  Plus,
  BarChart3,
  PieChart,
  ArrowRight,
} from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useFormattedCurrency } from '@/lib/utils';
import { useBakeryData, type Batch, type Recipe, type StockItem, type Ingredient } from '@/lib/hooks/use-bakery';
import { BatchStatus } from '@/prisma/client';

export const getStatusColor = (status: BatchStatus): string => {
  switch (status) {
    case BatchStatus.PLANNED:
      return 'bg-blue-100 text-blue-800';
    case BatchStatus.IN_PROGRESS:
      return 'bg-yellow-100 text-yellow-800';
    case BatchStatus.COMPLETED:
      return 'bg-green-100 text-green-800';
    case BatchStatus.CANCELLED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Skeleton Components
const StatCardSkeleton = () => (
  <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-7 w-12 mb-1" />
      <Skeleton className="h-3 w-16" />
    </CardContent>
  </Card>
);

const QuickActionSkeleton = () => (
  <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
    <div className="flex items-start justify-between mb-3">
      <Skeleton className="h-9 w-9 rounded-lg" />
      <Skeleton className="h-4 w-4" />
    </div>
    <Skeleton className="h-5 w-24 mb-1" />
    <Skeleton className="h-4 w-32" />
  </div>
);

const ProgressBarSkeleton = () => (
  <div className="space-y-1">
    <div className="flex justify-between">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-12" />
    </div>
    <Skeleton className="h-2 w-full" />
  </div>
);

const BatchItemSkeleton = () => (
  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
    <div className="flex items-center space-x-3 min-w-0 flex-1">
      <Skeleton className="h-6 w-16 rounded-full" />
      <div className="min-w-0 flex-1 space-y-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <div className="space-y-1 text-right ml-3">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-12" />
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900">
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Skeleton */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-4 w-80" />
      </div>

      <Tabs value="overview" className="space-y-4 sm:space-y-6">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex w-full min-w-max sm:grid sm:grid-cols-7 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-10 flex-1 mx-1 first:ml-0 last:mr-0" />
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          {/* Quick Actions Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <QuickActionSkeleton key={i} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Recipe Analysis Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <ProgressBarSkeleton key={i} />
                ))}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Status Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ProgressBarSkeleton key={i} />
                ))}
              </CardContent>
            </Card>

            {/* Recent Batches Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <BatchItemSkeleton key={i} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
);

export default function BakeryDashboard() {
  const [activeTab, setActiveTab] = useQueryState('tab', {
    defaultValue: 'overview',
  });
  const formatCurrency = useFormattedCurrency();

  const { data: bakeryData, isLoading, error } = useBakeryData();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Failed to load data</h2>
          <p className="text-gray-600 dark:text-gray-400">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  // Destructure the fetched data with fallbacks
  const { batches = [], recipes = [], templates = [], ingredients = [], stockData = [] } = bakeryData || {};

  // Dashboard statistics from API data
  const totalBatches = batches.length;
  const activeBatches = batches.filter((b: Batch) => b.status === 'IN_PROGRESS').length;
  const completedToday = batches.filter(
    (b: Batch) => b.status === 'COMPLETED' && new Date(b.date).toDateString() === new Date().toDateString()
  ).length;
  const totalRecipes = recipes.length;
  const totalTemplates = templates.length;

  // Calculate statistics from API data
  const lowStockItems = stockData.filter((item: StockItem) => item.current <= item.reorder);
  const totalInventoryValue = stockData.reduce((total: number, item: StockItem) => {
    const ingredient = ingredients.find((i: Ingredient) => i.id === item.id);
    return total + item.current * (ingredient?.buyingPrice || 0);
  }, 0);

  // Recipe cost analysis
  const recipesByCategory = recipes.reduce(
    (acc: Record<string, number>, recipe: Recipe) => {
      const category = recipe.category.name;
      if (!acc[category]) acc[category] = 0;
      acc[category]++;
      return acc;
    },
    {} as Record<string, number>
  );

  const averageRecipeCost =
    recipes.length > 0
      ? recipes.reduce((total: number, recipe: Recipe) => {
          const cost = recipe?.ingredients?.reduce(
            (sum: number, ing) => sum + Number(ing?.quantity || 0) * Number(ing?.ingredientVariant?.buyingPrice || 0),
            0
          );
          return total + cost;
        }, 0) / recipes.length
      : 0;

  // Quick action shortcuts
  const quickActions = [
    {
      title: 'New Recipe',
      description: 'Create a new recipe with ingredients',
      icon: BookOpen,
      action: () => setActiveTab('recipes'),
    },
    {
      title: 'Start Batch',
      description: 'Begin a new production batch',
      icon: Clock,
      action: () => setActiveTab('batches'),
    },
    {
      title: 'Restock Ingredients',
      description: 'Manage ingredient inventory',
      icon: Package,
      action: () => setActiveTab('ingredients'),
    },
    {
      title: 'Create Template',
      description: 'Save batch configuration',
      icon: File,
      action: () => setActiveTab('templates'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <ChefHat className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-50">
              Bakery Management System
            </h1>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400">
            Comprehensive management for recipes, ingredients, batches, and production
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="inline-flex w-full min-w-max sm:grid sm:grid-cols-7 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-2 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="recipes"
                className="flex items-center gap-2 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Recipes</span>
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="flex items-center gap-2 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
              >
                <File className="h-4 w-4" />
                <span className="hidden sm:inline">Templates</span>
              </TabsTrigger>
              <TabsTrigger
                value="batches"
                className="flex items-center gap-2 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
              >
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Batches</span>
              </TabsTrigger>
              <TabsTrigger
                value="ingredients"
                className="flex items-center gap-2 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
              >
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Ingredients</span>
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="flex items-center gap-2 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
              >
                <ChefHat className="h-4 w-4" />
                <span className="hidden sm:inline">Categories</span>
              </TabsTrigger>
              <TabsTrigger
                value="bakers"
                className="flex items-center gap-2 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Bakers</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-50">
                  <Plus className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="dark:text-gray-400">Fast access to common tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6 text-left transition-all hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700 hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                          <action.icon className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400" />
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Batches</CardTitle>
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">{totalBatches}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">All time batches</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Batches</CardTitle>
                  <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                    <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">{activeBatches}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Currently in progress</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Completed Today
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <ChefHat className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">{completedToday}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Batches finished today</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Recipes & Templates
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    {totalRecipes + totalTemplates}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {totalRecipes} recipes, {totalTemplates} templates
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Inventory Value
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    {formatCurrency(totalInventoryValue)}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Current stock value</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Recipe Analysis */}
              <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-50">
                    <PieChart className="h-5 w-5" />
                    Recipe Analysis
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">Recipe distribution and costs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {Object.entries(recipesByCategory).map(([category, count]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${(count / totalRecipes) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-6 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg. Recipe Cost</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(averageRecipeCost)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inventory Status */}
              <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-50">
                    <Package className="h-5 w-5" />
                    Inventory Status
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">Current stock levels and alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lowStockItems.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm font-medium text-red-800 dark:text-red-300">Low Stock Alert</span>
                      </div>
                      <div className="space-y-1">
                        {lowStockItems.map((item: StockItem) => (
                          <div key={item.id} className="text-sm text-red-700 dark:text-red-300">
                            {item.name}: {item.current} {item.unit} (reorder at {item.reorder})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {stockData.slice(0, 4).map((item: StockItem) => {
                      const percentage = (item.current / item.max) * 100;
                      const isLow = item.current <= item.reorder;
                      return (
                        <div key={item.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                            <span
                              className={isLow ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}
                            >
                              {item.current}/{item.max} {item.unit}
                            </span>
                          </div>
                          <Progress
                            value={percentage}
                            className={`h-2 ${isLow ? '[&>div]:bg-red-500 dark:[&>div]:bg-red-400' : '[&>div]:bg-green-500 dark:[&>div]:bg-green-400'}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Batches */}
              <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-50">
                    <Clock className="h-5 w-5" />
                    Recent Batches
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">Latest production activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {batches.slice(0, 4).map((batch: Batch) => (
                      <div
                        key={batch.id}
                        className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <Badge className={getStatusColor(batch.status as BatchStatus)}>
                            {batch.status.replace('_', ' ')}
                          </Badge>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm text-gray-900 dark:text-gray-50 truncate">{batch.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{batch.recipe.name}</p>
                          </div>
                        </div>
                        <div className="text-right text-xs text-gray-500 dark:text-gray-400 ml-3 flex-shrink-0">
                          <p>{new Date(batch.date).toLocaleDateString()}</p>
                          <p className="truncate max-w-[80px]">{batch.baker || 'Unassigned'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other Tabs - Pass the fetched data as props */}
          <TabsContent value="recipes">
            <RecipeManager />
          </TabsContent>

          <TabsContent value="templates">
            <TemplateManager />
          </TabsContent>

          <TabsContent value="batches">
            <BatchManager />
          </TabsContent>

          <TabsContent value="ingredients">
            <IngredientManager />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="bakers">
            <BakerManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
