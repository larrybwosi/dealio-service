import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Badge } from '@workspace/ui/components/badge';
import {
  Plus,
  Edit,
  Eye,
  Clock,
  User,
  Calendar,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Package,
} from 'lucide-react';
import { BatchForm } from './BatchForm';
import { BatchView } from './BatchView';
import { useBatches, useCancelBatch, useCompleteBatch, useStartBatch } from '@/lib/hooks/use-bakery';
import { toast } from 'sonner';
import { useFormattedCurrency } from '@/lib/utils';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { BatchStatus } from '@/prisma/client';
import { useListIngredients } from '@/lib/hooks/use-bakery';

// Updated Batch interface to match new API response
interface FormattedBatch {
  id: string;
  batchNumber: string;
  name: string;
  recipe: {
    id: string;
    name: string;
    yield: string;
  };
  unit: {
    id: string;
    name: string;
    symbol: string;
  };
  category: {
    id: string;
    name: string;
  };
  quantity: number;
  status: BatchStatus;
  date: Date;
  time: string;
  duration: string | null;
  baker: string;
  procedure: string | null;
  notes: string | null;
  createdFromTemplate: { id: string; name: string } | null;
  createdAt: Date;
  completedAt: Date | null;
  cancelledAt: Date | null;
  updatedAt: Date;
  // Financial metrics
  productionCost: number;
  costPerUnit: number;
  retailPrice: number;
  wholesalePrice: number;
  totalRetailValue: number;
  totalWholesaleValue: number;
  retailProfit: number;
  wholesaleProfit: number;
  retailMargin: number;
  wholesaleMargin: number;
  calculationError?: boolean;
}

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

// Loading Skeleton Component
function BatchCardSkeleton() {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Error State Component
function BatchErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <Card className="bg-white shadow-sm border-red-200">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load batches</h3>
        <p className="text-gray-500 text-center mb-4 max-w-md">
          {error.message || 'An error occurred while loading batches. Please try again.'}
        </p>
        <Button onClick={onRetry} variant="outline" className="flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}

// Profit Margin Badge Component
function ProfitMarginBadge({ margin }: { margin: number }) {
  const getMarginColor = (margin: number) => {
    if (margin >= 50) return 'bg-green-100 text-green-800';
    if (margin >= 30) return 'bg-blue-100 text-blue-800';
    if (margin >= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Badge className={getMarginColor(margin)} variant="outline">
      <TrendingUp className="h-3 w-3 mr-1" />
      {margin.toFixed(1)}% margin
    </Badge>
  );
}

export default function BatchManager() {
  const [selectedBatch, setSelectedBatch] = useState<FormattedBatch | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const formattedCurrency = useFormattedCurrency();

  const { data: batchesData, isLoading: loadingBatches, error, refetch } = useBatches();
  const { ingredients, isLoading: loadingIngredients } = useListIngredients();

  // Use the batch mutation hooks
  const startBatchMutation = useStartBatch();
  const completeBatchMutation = useCompleteBatch();
  const cancelBatchMutation = useCancelBatch();

  // Transform ingredients data into the expected format for ingredientStock
  const ingredientStock =
    ingredients?.reduce(
      (acc, ingredient) => {
        acc[ingredient.id] = ingredient.currentStock;
        return acc;
      },
      {} as { [key: string]: number }
    ) || {};

  const filteredBatches =
    batchesData?.data?.filter(batch => {
      const matchesSearch =
        batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.baker.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];

  // Updated batch status handlers using the hooks
  const handleStartBatch = (batchId: string) => {
    startBatchMutation.mutate(batchId, {
      onError: error => {
        console.error('Failed to start batch:', error.message);
        toast.error('Failed to start batch', {
          description: error.message,
        });
      },
    });
  };

  const handleCompleteBatch = (batchId: string) => {
    completeBatchMutation.mutate(batchId, {
      onError: error => {
        console.error('Failed to complete batch:', error.message);
        toast.error('Failed to complete batch', {
          description: error.message,
        });
      },
    });
  };

  const handleCancelBatch = (batchId: string) => {
    cancelBatchMutation.mutate(batchId, {
      onError: error => {
        console.error('Failed to cancel batch:', error.message);
        toast.error('Failed to cancel batch', {
          description: error.message,
        });
      },
    });
  };

  const getStatusIcon = (status: BatchStatus) => {
    switch (status) {
      case BatchStatus.PLANNED:
        return <Calendar className="h-4 w-4" />;
      case BatchStatus.IN_PROGRESS:
        return <Play className="h-4 w-4" />;
      case BatchStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4" />;
      case BatchStatus.CANCELLED:
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewBatch = (batch: FormattedBatch) => {
    setSelectedBatch(batch);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (batch: FormattedBatch) => {
    setSelectedBatch(batch);
    setIsEditDialogOpen(true);
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Batch Management</h2>
          <p className="text-gray-600">Create and track production batches with ingredient usage and costing</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              New Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Batch</DialogTitle>
              <DialogDescription>Generate a new production batch with ingredient tracking</DialogDescription>
            </DialogHeader>
            <BatchForm
              onSuccess={() => setIsCreateDialogOpen(false)}
              onCancel={() => setIsCreateDialogOpen(false)}
              ingredientStock={ingredientStock}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search batches..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value={BatchStatus.PLANNED}>Planned</SelectItem>
            <SelectItem value={BatchStatus.IN_PROGRESS}>In Progress</SelectItem>
            <SelectItem value={BatchStatus.COMPLETED}>Completed</SelectItem>
            <SelectItem value={BatchStatus.CANCELLED}>Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error State */}
      {error && <BatchErrorState error={error} onRetry={handleRetry} />}

      {/* Loading State */}
      {(loadingBatches || loadingIngredients) && !error && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <BatchCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Batches List */}
      {!loadingBatches && !loadingIngredients && !error && (
        <div className="space-y-4">
          {filteredBatches.map(batch => (
            <Card key={batch.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {batch.name}
                      {batch.calculationError && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Cost calculation incomplete - some data may be missing</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {batch.batchNumber} • {batch.recipe.name} • {batch.category.name}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(batch.status)}>
                      {getStatusIcon(batch.status)}
                      <span className="ml-1">{batch.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Primary Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <Label className="text-sm text-gray-500">Quantity</Label>
                    <p className="font-medium">
                      {batch.quantity} {batch.unit.symbol}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Schedule</Label>
                    <p className="font-medium">
                      {new Date(batch.date).toLocaleDateString()} at {batch.time}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Baker</Label>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="font-medium">{batch.baker}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Duration</Label>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="font-medium">{batch.duration || 'Not specified'}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Cost/Unit</Label>
                    <div className="flex items-center">
                      <span className="font-medium text-orange-600">{formattedCurrency(batch.costPerUnit)}</span>
                    </div>
                  </div>
                </div>

                {/* Financial Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-xs text-gray-500 flex items-center">
                      <Package className="h-3 w-3 mr-1" />
                      Production Cost
                    </Label>
                    <p className="font-semibold text-lg text-gray-900">{formattedCurrency(batch.productionCost)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Retail Value
                    </Label>
                    <p className="font-semibold text-lg text-green-600">{formattedCurrency(batch.totalRetailValue)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formattedCurrency(batch.retailPrice)}/{batch.unit.symbol}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Wholesale Value
                    </Label>
                    <p className="font-semibold text-lg text-blue-600">
                      {formattedCurrency(batch.totalWholesaleValue)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formattedCurrency(batch.wholesalePrice)}/{batch.unit.symbol}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Profit Margins</Label>
                    <div className="flex flex-col gap-1 mt-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <ProfitMarginBadge margin={batch.retailMargin} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Retail profit: {formattedCurrency(batch.retailProfit)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className="bg-blue-50 text-blue-700 w-fit" variant="outline">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {batch.wholesaleMargin.toFixed(1)}% wholesale
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Wholesale profit: {formattedCurrency(batch.wholesaleProfit)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="flex space-x-2">
                    {batch.status === BatchStatus.PLANNED && (
                      <Button
                        size="sm"
                        onClick={() => handleStartBatch(batch.id)}
                        disabled={startBatchMutation.isPending}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        {startBatchMutation.isPending ? 'Starting...' : 'Start'}
                      </Button>
                    )}
                    {batch.status === BatchStatus.IN_PROGRESS && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteBatch(batch.id)}
                        disabled={completeBatchMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {completeBatchMutation.isPending ? 'Completing...' : 'Complete'}
                      </Button>
                    )}
                    {(batch.status === BatchStatus.PLANNED || batch.status === BatchStatus.IN_PROGRESS) && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancelBatch(batch.id)}
                        disabled={cancelBatchMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        {cancelBatchMutation.isPending ? 'Cancelling...' : 'Cancel'}
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewBatch(batch)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(batch)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loadingBatches && !loadingIngredients && !error && filteredBatches.length === 0 && (
        <Card className="bg-white shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No batches found</h3>
            <p className="text-gray-500 text-center">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search terms or filters'
                : 'Create your first production batch to get started'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* View Batch Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedBatch && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedBatch.name}</DialogTitle>
                <DialogDescription>Batch #{selectedBatch.batchNumber} - Details & Costing</DialogDescription>
              </DialogHeader>
              <BatchView batch={selectedBatch} ingredientStock={ingredientStock} />
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Batch Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedBatch && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Batch</DialogTitle>
                <DialogDescription>Update batch details for #{selectedBatch.batchNumber}</DialogDescription>
              </DialogHeader>
              <BatchForm
                batch={selectedBatch}
                onSuccess={() => {
                  setIsEditDialogOpen(false);
                  setSelectedBatch(null);
                }}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setSelectedBatch(null);
                }}
                ingredientStock={ingredientStock}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
