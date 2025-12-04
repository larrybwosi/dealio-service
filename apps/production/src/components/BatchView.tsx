import { Badge } from '@workspace/ui/components/badge';
import { Label } from '@workspace/ui/components/label';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import { useFormattedCurrency } from '@/lib/utils';
import {
  AlertTriangle,
  User,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  Package,
  Percent,
  ShoppingCart,
  Store,
} from 'lucide-react';
import { FormattedBatch } from '@/types/bakery';
import { getStatusColor } from './BatchManager';

interface BatchViewProps {
  batch: FormattedBatch;
  ingredientStock?: { [key: string]: number };
}

export function BatchView({ batch }: BatchViewProps) {
  const formattedCurrency = useFormattedCurrency();

  // Unified margin color system
  const getMarginColor = (margin?: number) => {
    if (!margin) return 'text-muted-foreground';
    if (margin >= 50) return 'text-emerald-600';
    if (margin >= 30) return 'text-blue-600';
    if (margin >= 10) return 'text-amber-600';
    return 'text-red-600';
  };

  const getMarginStatus = (margin?: number) => {
    if (!margin) return 'Unknown';
    if (margin >= 50) return 'Excellent';
    if (margin >= 30) return 'Good';
    if (margin >= 10) return 'Acceptable';
    return 'Low';
  };

  // Safe accessors for nested properties
  const categoryName = batch.category?.name || 'Uncategorized';
  const recipeName = batch.recipe?.name || 'Unknown Recipe';
  const recipeYield = batch.recipe?.yieldQuantity || 0;
  const yieldUnitSymbol = batch.recipe?.yieldUnit?.symbol || batch.unit?.symbol || 'units';
  const unitSymbol = batch.unit?.symbol || 'units';

  // Format date safely
  const formatDate = (date?: Date) => {
    if (!date) return 'Not scheduled';
    return new Date(date).toLocaleDateString();
  };

  // Format time from scheduledStartAt
  const formatTime = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Calculation Error Alert */}
      {batch.calculationError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Cost calculations may be incomplete due to missing ingredient or pricing data.
          </AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Batch Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <div className="mt-1">
                <Badge variant="outline" className={getStatusColor(batch.status)}>
                  {batch.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Category</Label>
              <p className="text-sm font-medium mt-1">{categoryName}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Recipe</Label>
              <p className="text-sm font-medium mt-1">{recipeName}</p>
              <p className="text-xs text-muted-foreground">
                Yield: {recipeYield} {yieldUnitSymbol}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Batch Quantity</Label>
              <p className="text-sm font-medium mt-1">
                {batch.plannedQuantity} {unitSymbol}
                {batch.actualQuantity && batch.actualQuantity !== batch.plannedQuantity && (
                  <span className="text-xs text-muted-foreground ml-1">(planned: {batch.plannedQuantity})</span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Overview */}
      {(batch.productionCost !== undefined ||
        batch.retailPrice !== undefined ||
        batch.wholesalePrice !== undefined) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Production Cost */}
            {batch.productionCost !== undefined && (
              <div className="bg-muted p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    <Label>Production Cost</Label>
                  </div>
                  <span className="text-2xl font-bold">{formattedCurrency(batch.productionCost)}</span>
                </div>
                {batch.costPerUnit !== undefined && (
                  <p className="text-sm text-muted-foreground">
                    {formattedCurrency(batch.costPerUnit)} per {unitSymbol}
                  </p>
                )}
              </div>
            )}

            <Separator />

            {/* Pricing Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Retail Pricing */}
              {(batch.retailPrice !== undefined || batch.totalRetailValue !== undefined) && (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    <Label>Retail Pricing</Label>
                  </div>
                  <div className="bg-muted p-3 rounded-lg border space-y-1">
                    {batch.retailPrice !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Price per unit:</span>
                        <span className="font-semibold">{formattedCurrency(batch.retailPrice)}</span>
                      </div>
                    )}
                    {batch.totalRetailValue !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total value:</span>
                        <span className="font-bold text-lg">{formattedCurrency(batch.totalRetailValue)}</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    {batch.retailProfit !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Profit:</span>
                        <span className="font-semibold">{formattedCurrency(batch.retailProfit)}</span>
                      </div>
                    )}
                    {batch.retailMargin !== undefined && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Percent className="h-3 w-3 mr-1" />
                          <span className="text-sm text-muted-foreground">Margin:</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold ${getMarginColor(batch.retailMargin)}`}>
                            {batch.retailMargin.toFixed(1)}%
                          </span>
                          <p className="text-xs text-muted-foreground">{getMarginStatus(batch.retailMargin)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Wholesale Pricing */}
              {(batch.wholesalePrice !== undefined || batch.totalWholesaleValue !== undefined) && (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Store className="h-4 w-4 mr-2" />
                    <Label>Wholesale Pricing</Label>
                  </div>
                  <div className="bg-muted p-3 rounded-lg border space-y-1">
                    {batch.wholesalePrice !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Price per unit:</span>
                        <span className="font-semibold">{formattedCurrency(batch.wholesalePrice)}</span>
                      </div>
                    )}
                    {batch.totalWholesaleValue !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total value:</span>
                        <span className="font-bold text-lg">{formattedCurrency(batch.totalWholesaleValue)}</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    {batch.wholesaleProfit !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Profit:</span>
                        <span className="font-semibold">{formattedCurrency(batch.wholesaleProfit)}</span>
                      </div>
                    )}
                    {batch.wholesaleMargin !== undefined && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Percent className="h-3 w-3 mr-1" />
                          <span className="text-sm text-muted-foreground">Margin:</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold ${getMarginColor(batch.wholesaleMargin)}`}>
                            {batch.wholesaleMargin.toFixed(1)}%
                          </span>
                          <p className="text-xs text-muted-foreground">{getMarginStatus(batch.wholesaleMargin)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profitability Summary */}
            {(batch.retailMargin !== undefined || batch.wholesaleMargin !== undefined) && (
              <div className="bg-muted p-4 rounded-lg border">
                <div className="flex items-center mb-3">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <Label>Profitability Summary</Label>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {batch.retailMargin !== undefined && (
                    <div>
                      <p className="text-muted-foreground">Best margin (Retail):</p>
                      <p className={`font-bold text-lg ${getMarginColor(batch.retailMargin)}`}>
                        {batch.retailMargin.toFixed(1)}%
                      </p>
                    </div>
                  )}
                  {batch.retailProfit !== undefined && batch.wholesaleProfit !== undefined && (
                    <div>
                      <p className="text-muted-foreground">Total potential profit:</p>
                      <p className="font-bold text-lg text-emerald-600">
                        {formattedCurrency(Math.max(batch.retailProfit, batch.wholesaleProfit))}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Schedule & Assignment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Schedule & Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Scheduled Date & Time</Label>
              <div className="flex items-center text-sm mt-1">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">
                  {formatDate(batch.scheduledStartAt)} at {formatTime(batch.scheduledStartAt)}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Assigned Baker</Label>
              <div className="flex items-center text-sm mt-1">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">{batch.baker || 'Unassigned'}</span>
              </div>
            </div>
          </div>

          {batch.duration && (
            <div className="mt-4">
              <Label className="text-muted-foreground">Expected Duration</Label>
              <div className="flex items-center text-sm mt-1">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">{batch.duration} minutes</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information */}
      {(batch.procedure || batch.notes || batch.createdFromTemplate) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {batch.procedure && (
              <div>
                <Label className="text-muted-foreground">Procedure</Label>
                <p className="text-sm whitespace-pre-line mt-1 bg-muted p-3 rounded border">{batch.procedure}</p>
              </div>
            )}

            {batch.notes && (
              <div>
                <Label className="text-muted-foreground">Notes</Label>
                <p className="text-sm mt-1 bg-muted p-3 rounded border">{batch.notes}</p>
              </div>
            )}

            {batch.createdFromTemplate && (
              <div>
                <Label className="text-muted-foreground">Created from Template</Label>
                <p className="text-sm font-medium mt-1">{batch.createdFromTemplate.name}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">{new Date(batch.createdAt).toLocaleString()}</span>
            </div>
            {batch.completedAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed:</span>
                <span className="font-medium text-emerald-600">{new Date(batch.completedAt).toLocaleString()}</span>
              </div>
            )}
            {batch.cancelledAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cancelled:</span>
                <span className="font-medium text-red-600">{new Date(batch.cancelledAt).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="font-medium">{new Date(batch.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
