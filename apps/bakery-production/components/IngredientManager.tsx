'use client';
import { useMemo, useState } from 'react';
import { useQueryState } from 'nuqs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { AlertCircle, Package, TrendingDown, AlertTriangle, RefreshCw, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { useListIngredients } from '@/hooks/bakery';
import { useFormattedCurrency } from '@/lib/utils';
import { RestockDialog } from '@/components/RestockDialog';
import { CreateIngredientDialog } from './IngredientForm';

type UnitType = 'WEIGHT' | 'VOLUME' | 'COUNT';
type UnitCategory = 'METRIC' | 'IMPERIAL' | 'OTHER';

type Ingredient = {
  id: string;
  ingredientId: string;
  currentStock: number;
  reorderLevel: number;
  maxStock: number;
  unitId: string;
  unit: {
    symbol: string;
    type: UnitType;
    name: string;
    id: string;
    description: string | null;
    createdAt: Date;
    isActive: boolean;
    updatedAt: Date;
    category: UnitCategory;
  };
  lastRestocked: Date;
  totalUsed: number;
  averageUsagePerWeek: number;
  name: string;
  sku: string;
  description?: string; // Optional description
  category: {
    name: string;
    id: string;
  };
  unitPrice: number;
};

const StatCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-4 rounded" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-32" />
    </CardContent>
  </Card>
);

const IngredientCardSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </CardContent>
  </Card>
);

const getStockStatus = (current: number, reorder: number, max: number) => {
  const percentage = (current / max) * 100;
  if (current <= reorder)
    return {
      label: 'Low Stock',
      className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    };
  if (percentage < 30)
    return {
      label: 'Critical',
      className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    };
  if (percentage < 50)
    return {
      label: 'Low',
      className:
        'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
    };
  return {
    label: 'Good',
    className:
      'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  };
};

const IngredientCard = ({
  ingredient,
  onRestock,
  formatCurrency,
}: {
  ingredient: Ingredient;
  onRestock: (ingredient: Ingredient) => void;
  formatCurrency: (value: number) => string;
}) => {
  const status = getStockStatus(ingredient.currentStock, ingredient.reorderLevel, ingredient.maxStock);
  const stockPercentage = (ingredient.currentStock / ingredient.maxStock) * 100;
  const lastRestockedDays = Math.floor(
    (new Date().getTime() - new Date(ingredient.lastRestocked).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{ingredient.name}</CardTitle>
            <CardDescription className="text-sm">{ingredient.sku}</CardDescription>
          </div>
          <Badge className={status.className}>{status.label}</Badge>
        </div>
        {/* Display description if available */}
        {ingredient.description && <p className="text-sm text-muted-foreground mt-2">{ingredient.description}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Stock Level</span>
            <span className="font-medium">
              {ingredient.currentStock} / {ingredient.maxStock} {ingredient.unit.symbol}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                stockPercentage < 30 ? 'bg-red-500' : stockPercentage < 50 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Reorder Level</p>
            <p className="font-medium">
              {ingredient.reorderLevel} {ingredient.unit.symbol}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Unit Price</p>
            <p className="font-medium">{formatCurrency(Number(ingredient.unitPrice))}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Weekly Usage</p>
            <p className="font-medium">
              {ingredient.averageUsagePerWeek.toFixed(1)} {ingredient.unit.symbol}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Restocked</p>
            <p className="font-medium">{lastRestockedDays}d ago</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
              {ingredient.category.name}
            </Badge>
            <Badge className="text-xs bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
              {ingredient.unit.name}
            </Badge>
          </div>
          <Button size="sm" variant="outline" onClick={() => onRestock(ingredient)} className="gap-2">
            <RefreshCw className="h-3 w-3" />
            Restock
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function IngredientManager() {
  const { ingredients, isLoading, error, refetch } = useListIngredients();
  const formatCurrency = useFormattedCurrency();

  // Nuqs state management for modals
  const [restockDialog, setRestockDialog] = useQueryState('restock', {
    defaultValue: '',
    parse: value => value,
    serialize: value => value,
  });

  const [createDialog, setCreateDialog] = useQueryState('create', {
    defaultValue: '',
    parse: value => value,
    serialize: value => value,
  });

  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | undefined>();

  const handleRestock = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setRestockDialog('open');
  };

  const handleCreateIngredient = () => {
    setCreateDialog('open');
  };

  const handleRestockDialogChange = (open: boolean) => {
    if (!open) {
      setRestockDialog('');
    }
  };

  const handleCreateDialogChange = (open: boolean) => {
    if (!open) {
      setCreateDialog('');
    }
  };

  const stats = useMemo(() => {
    if (!ingredients) return { total: 0, lowStock: 0, totalValue: 0, avgUsage: 0 };

    const lowStock = ingredients.filter(i => i.currentStock <= i.reorderLevel).length;
    const totalValue = ingredients.reduce((sum, i) => sum + i.currentStock * Number(i.unitPrice), 0);
    const avgUsage = ingredients.reduce((sum, i) => sum + i.averageUsagePerWeek, 0) / ingredients.length;

    return {
      total: ingredients.length,
      lowStock,
      totalValue,
      avgUsage,
    };
  }, [ingredients]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load inventory: {error.message}
          {refetch && (
            <button onClick={() => refetch()} className="ml-2 underline">
              Try again
            </button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ingredient Inventory</h1>
          <p className="text-muted-foreground">Manage your bakery ingredients and stock levels</p>
        </div>
        <Button onClick={handleCreateIngredient} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Ingredient
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Active ingredients</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.lowStock}</div>
                <p className="text-xs text-muted-foreground">Need reordering</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
                <p className="text-xs text-muted-foreground">Current inventory value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Weekly Usage</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgUsage.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">Units per week</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Ingredient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <IngredientCardSkeleton key={i} />
            ))}
          </>
        ) : ingredients && ingredients.length > 0 ? (
          ingredients.map(ingredient => (
            <IngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              onRestock={handleRestock}
              formatCurrency={formatCurrency}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No ingredients found</h3>
            <p className="text-sm text-muted-foreground mb-6">Get started by creating your first ingredient</p>
            <Button onClick={handleCreateIngredient} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Ingredient
            </Button>
          </div>
        )}
      </div>

      {/* Dialogs with nuqs state management */}
      <CreateIngredientDialog open={createDialog === 'open'} onOpenChange={handleCreateDialogChange} />
      <RestockDialog
        open={restockDialog === 'open'}
        onOpenChange={handleRestockDialogChange}
        selectedIngredient={selectedIngredient}
      />
    </div>
  );
}
