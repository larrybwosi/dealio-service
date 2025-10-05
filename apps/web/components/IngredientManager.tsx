import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Badge } from '@workspace/ui/components/badge';
import { Progress } from '@workspace/ui/components/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { useDeleteRawMaterial } from '@/lib/hooks/raw-materials';
import { ProductVariant, SystemUnit } from '@/types/bakery';
import { Package, AlertTriangle, TrendingUp, Eye, Activity, Trash2, Plus, ShoppingCart } from 'lucide-react';
import { CreateIngredientDialog } from './IngredientForm';
import { useInventoryRecords, useListIngredients } from '@/lib/hooks/use-bakery';
import { useFormattedCurrency } from '@/lib/utils';
import { RestockDialog } from './RestockDialog';
import { BatchStatus } from '@/prisma/client';
import { format } from 'date-fns';

interface IngredientStock {
  id: string;
  ingredientId: string;
  currentStock: number;
  reorderLevel: number;
  maxStock: number;
  unitId: string;
  unit: SystemUnit;
  lastRestocked: Date;
  totalUsed: number;
  averageUsagePerWeek: number;
  unitPrice: number;
}

interface ExtendedProductVariant extends ProductVariant {
  unitPrice: number;
  buyingPrice?: number | string;
}

export default function IngredientManager() {
  // API hooks
  const {
    ingredients,
    isLoading: ingredientsLoading,
    error: ingredientsError,
    refetch: refetchIngredients,
  } = useListIngredients();

  // Add the inventory records hook
  const {
    data: inventoryData,
    isLoading: recordsLoading,
    error: recordsError,
  } = useInventoryRecords();

  const deleteRawMaterial = useDeleteRawMaterial();
  const [selectedIngredient, setSelectedIngredient] = useState<ExtendedProductVariant | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');
  const formatCurrency = useFormattedCurrency();

  // Use records from the API instead of local state
  const restockRecords = useMemo(() => inventoryData?.restockRecords || [], [inventoryData]);
  const usageRecords = useMemo(() => inventoryData?.usageRecords || [], [inventoryData]);

  // Transform API data to stock data format - use useMemo to avoid recalculation
  const stockData = useMemo<IngredientStock[]>(() => {
    if (!ingredients?.length) return [];

    return ingredients.map(ingredient => {
      const unitPrice = ingredient.unitPrice ? parseFloat(String(ingredient.unitPrice)) : 0;

      return {
        id: `stock-${ingredient.ingredientId}`,
        ingredientId: ingredient.ingredientId,
        currentStock: ingredient.currentStock,
        reorderLevel: ingredient.reorderLevel,
        maxStock: ingredient.maxStock,
        unitId: ingredient.unitId,
        unit: ingredient.unit,
        lastRestocked: new Date(ingredient.lastRestocked),
        totalUsed: ingredient.totalUsed,
        averageUsagePerWeek: ingredient.averageUsagePerWeek,
        unitPrice: unitPrice,
      };
    });
  }, [ingredients]);

  const filteredIngredients = useMemo(() => {
    if (!ingredients?.length) return [];

    return ingredients.filter(
      ingredient =>
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ingredient.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ingredients, searchTerm]);

  // Combined loading state
  const isLoading = ingredientsLoading || recordsLoading;
  const isError = ingredientsError || recordsError;
  const error = ingredientsError || recordsError;

  const getStockLevel = (ingredientId: string) => {
    return stockData.find(s => s.ingredientId === ingredientId);
  };

  const getStockStatus = (stock: IngredientStock) => {
    const percentage = (stock.currentStock / stock.maxStock) * 100;
    if (stock.currentStock <= stock.reorderLevel) {
      return { status: 'critical', color: 'bg-red-500', textColor: 'text-red-700' };
    } else if (percentage <= 30) {
      return { status: 'low', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    } else {
      return { status: 'good', color: 'bg-green-500', textColor: 'text-green-700' };
    }
  };

  const handleDeleteIngredient = async (id: string) => {
    try {
      await deleteRawMaterial.mutateAsync(id);
      setIsDeleteDialogOpen(false);
      setSelectedIngredient(null);
    } catch (error) {
      console.error('Failed to delete ingredient:', error);
    }
  };

  const lowStockIngredients = useMemo(() => {
    return stockData.filter(stock => stock.currentStock <= stock.reorderLevel).length;
  }, [stockData]);

  const totalInventoryValue = useMemo(() => {
    return stockData.reduce((total, stock) => {
      return total + stock.currentStock * stock.unitPrice;
    }, 0);
  }, [stockData]);

  const monthlyUsageCost = useMemo(() => {
    return usageRecords
      .filter(record => {
        const recordDate = new Date(record.date);
        const now = new Date();
        return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
      })
      .reduce((total, record) => total + record.cost, 0);
  }, [usageRecords]);

  const getBatchStatusColor = (status?: BatchStatus) => {
    switch (status) {
      case BatchStatus.COMPLETED:
        return 'text-green-600';
      case BatchStatus.IN_PROGRESS:
        return 'text-yellow-600';
      case BatchStatus.PLANNED:
        return 'text-blue-600';
      case BatchStatus.CANCELLED:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Helper function to get price for display
  const getIngredientPrice = (ingredientId: string) => {
    const stock = getStockLevel(ingredientId);
    return stock?.unitPrice || 0;
  };

  // Helper function to get total value for display
  const getIngredientTotalValue = (ingredientId: string) => {
    const stock = getStockLevel(ingredientId);
    return stock ? stock.currentStock * stock.unitPrice : 0;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Statistics Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-10 w-full max-w-md" />

          {/* Inventory Tab Content Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="bg-white shadow-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-1">
                          <Skeleton className="h-3 w-12" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading data: {error?.message || 'Unknown error'}</div>
        <Button
          onClick={() => {
            refetchIngredients();
          }}
          className="ml-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Ingredient Management</h2>
          <p className="text-gray-600">Track inventory, usage, and costs with batch integration</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Ingredient
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingredients</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{ingredients?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active ingredients</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockIngredients}</div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalInventoryValue)}</div>
            <p className="text-xs text-muted-foreground">Current stock value</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Usage Cost</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(monthlyUsageCost)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="usage">Usage Tracking</TabsTrigger>
          <TabsTrigger value="restocking">Restocking</TabsTrigger>
        </TabsList>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIngredients.map(ingredient => {
              const stock = getStockLevel(ingredient.ingredientId);
              if (!stock) return null;

              const stockStatus = getStockStatus(stock);
              const stockPercentage = (stock.currentStock / stock.maxStock) * 100;
              const unitPrice = getIngredientPrice(ingredient.ingredientId);
              const totalValue = getIngredientTotalValue(ingredient.ingredientId);

              return (
                <Card key={ingredient.ingredientId} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{ingredient.name}</CardTitle>
                        <CardDescription>SKU: {ingredient.sku}</CardDescription>
                      </div>
                      <Badge className={stockStatus.textColor + ' bg-opacity-20'}>
                        {stockStatus.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Stock Level</span>
                          <span>
                            {stock.currentStock} / {stock.maxStock} {stock.unit.symbol}
                          </span>
                        </div>
                        <Progress value={stockPercentage} className="h-2" />
                        {stock.currentStock <= stock.reorderLevel && (
                          <p className="text-xs text-red-600 mt-1">
                            ⚠️ Below reorder level ({stock.reorderLevel} {stock.unit.symbol})
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-gray-500">Unit Price</Label>
                          <p className="font-medium">{formatCurrency(unitPrice)}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Total Value</Label>
                          <p className="font-medium">{formatCurrency(totalValue)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-gray-500">Weekly Usage</Label>
                          <p className="font-medium">
                            {stock.averageUsagePerWeek} {stock.unit.symbol}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Last Restocked</Label>
                          <p className="font-medium">{stock.lastRestocked.toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedIngredient(ingredient as ExtendedProductVariant)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            {selectedIngredient && (
                              <>
                                <DialogHeader>
                                  <DialogTitle>{selectedIngredient.name}</DialogTitle>
                                  <DialogDescription>Ingredient Details & Batch Usage History</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>SKU</Label>
                                      <p className="text-sm">{selectedIngredient.sku}</p>
                                    </div>
                                    <div>
                                      <Label>Current Price</Label>
                                      <p className="text-sm">
                                        {formatCurrency(unitPrice)} per {stock?.unit.symbol}
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <Label>Recent Batch Usage</Label>
                                    <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                                      {usageRecords
                                        .filter(record => record.ingredientId === selectedIngredient.ingredientId)
                                        .slice(0, 10)
                                        .map(record => (
                                          <div
                                            key={record.id}
                                            className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm"
                                          >
                                            <div>
                                              <p className="font-medium">{record.usedFor}</p>
                                              <p className="text-gray-500">{record.date.toLocaleDateString()}</p>
                                              {record.batchStatus && (
                                                <Badge className={`text-xs ${getBatchStatusColor(record.batchStatus)}`}>
                                                  {record.batchStatus}
                                                </Badge>
                                              )}
                                            </div>
                                            <div className="text-right">
                                              <p>
                                                {record.quantity} {record.unit.symbol}
                                              </p>
                                              <p className="text-gray-500">{formatCurrency(record.cost)}</p>
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => {
                                        setIsViewDialogOpen(false);
                                        setIsDeleteDialogOpen(true);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedIngredient(ingredient as ExtendedProductVariant);
                            setIsRestockDialogOpen(true);
                          }}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Restock
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Usage Tracking Tab */}
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Batch Usage History</CardTitle>
              <CardDescription>
                Track ingredient consumption across recipes and batches with real-time status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageRecords.slice(0, 15).map((record, i) => {
                  const ingredient = ingredients?.find(i => i.ingredientId === record.ingredientId);
                  return (
                    <div key={i} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{ingredient?.name}</h4>
                        <p className="text-sm text-gray-500">{record.usedFor}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-sm text-gray-500 ml-3">{format(new Date(record.date), 'MMM dd, yyyy')}</p>
                          {record.batchStatus && (
                            <Badge className={`text-xs ${getBatchStatusColor(record.batchStatus)}`}>
                              {record.batchStatus.replace('_', ' ')}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {record.quantity} {record.unit.symbol}
                        </p>
                        <p className="text-sm text-gray-500">Cost: {formatCurrency(record.cost)}</p>
                        {record.batchId && <p className="text-xs text-blue-600">Batch #{record.batchId}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Restocking Tab */}
        <TabsContent value="restocking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Restocking History</CardTitle>
              <CardDescription>Track all ingredient purchases and restocking activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {restockRecords.map(record => {
                  const ingredient = ingredients?.find(i => i.ingredientId === record.ingredientId);
                  return (
                    <div key={record.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{ingredient?.name}</h4>
                        <p className="text-sm text-gray-500">Supplier: {record.supplier}</p>
                        <p className="text-sm text-gray-500">{record.date.toLocaleDateString()}</p>
                        {record.notes && <p className="text-sm text-gray-500">Note: {record.notes}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{record.quantity} units</p>
                        <p className="text-sm text-gray-500">{formatCurrency(record.unitPrice)} per unit</p>
                        <p className="font-bold text-green-600">{formatCurrency(record.totalCost)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateIngredientDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />

      {/* Restock Dialog */}
      <RestockDialog
        open={isRestockDialogOpen}
        onOpenChange={setIsRestockDialogOpen}
        selectedIngredient={selectedIngredient}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Ingredient</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &#34;{selectedIngredient?.name}&#34;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedIngredient && handleDeleteIngredient(selectedIngredient.id)}
              disabled={deleteRawMaterial.isPending}
            >
              {deleteRawMaterial.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
