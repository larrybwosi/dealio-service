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
import { FormattedBatch } from '@/types';
import { getStatusColor } from './BatchManager';


interface BatchViewProps {
  batch: FormattedBatch;
  ingredientStock?: { [key: string]: number }; // Made optional since we're now using API data
}

export function BatchView({ batch }: BatchViewProps) {
  const formattedCurrency = useFormattedCurrency();

  // Helper function to get margin color
  const getMarginColor = (margin: number) => {
    if (margin >= 50) return 'text-green-600';
    if (margin >= 30) return 'text-blue-600';
    if (margin >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Helper function to get margin status
  const getMarginStatus = (margin: number) => {
    if (margin >= 50) return 'Excellent';
    if (margin >= 30) return 'Good';
    if (margin >= 10) return 'Acceptable';
    return 'Low';
  };

  return (
    <div className="space-y-6">
      {/* Calculation Error Alert */}
      {batch.calculationError && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
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
              <Label className="text-gray-500">Status</Label>
              <div className="mt-1">
                <Badge className={getStatusColor(batch.status)}>{batch.status.replace('_', ' ')}</Badge>
              </div>
            </div>
            <div>
              <Label className="text-gray-500">Category</Label>
              <p className="text-sm font-medium mt-1">{batch.category.name}</p>
            </div>
            <div>
              <Label className="text-gray-500">Recipe</Label>
              <p className="text-sm font-medium mt-1">{batch.recipe.name}</p>
              <p className="text-xs text-gray-500">Yield: {batch.recipe.yield}</p>
            </div>
            <div>
              <Label className="text-gray-500">Batch Quantity</Label>
              <p className="text-sm font-medium mt-1">
                {batch.quantity} {batch.unit.name} ({batch.unit.symbol})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Production Cost */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-2 text-orange-600" />
                <Label className="text-orange-900">Production Cost</Label>
              </div>
              <span className="text-2xl font-bold text-orange-600">{formattedCurrency(batch.productionCost)}</span>
            </div>
            <p className="text-sm text-orange-700">
              {formattedCurrency(batch.costPerUnit)} per {batch.unit.symbol}
            </p>
          </div>

          <Separator />

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Retail Pricing */}
            <div className="space-y-2">
              <div className="flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2 text-green-600" />
                <Label className="text-green-900">Retail Pricing</Label>
              </div>
              <div className="bg-green-50 p-3 rounded-lg space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700">Price per unit:</span>
                  <span className="font-semibold text-green-900">{formattedCurrency(batch.retailPrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700">Total value:</span>
                  <span className="font-bold text-lg text-green-600">{formattedCurrency(batch.totalRetailValue)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700">Profit:</span>
                  <span className="font-semibold text-green-900">{formattedCurrency(batch.retailProfit)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Percent className="h-3 w-3 mr-1 text-green-700" />
                    <span className="text-sm text-green-700">Margin:</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${getMarginColor(batch.retailMargin)}`}>
                      {batch.retailMargin.toFixed(1)}%
                    </span>
                    <p className="text-xs text-gray-500">{getMarginStatus(batch.retailMargin)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wholesale Pricing */}
            <div className="space-y-2">
              <div className="flex items-center">
                <Store className="h-4 w-4 mr-2 text-blue-600" />
                <Label className="text-blue-900">Wholesale Pricing</Label>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Price per unit:</span>
                  <span className="font-semibold text-blue-900">{formattedCurrency(batch.wholesalePrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Total value:</span>
                  <span className="font-bold text-lg text-blue-600">
                    {formattedCurrency(batch.totalWholesaleValue)}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Profit:</span>
                  <span className="font-semibold text-blue-900">{formattedCurrency(batch.wholesaleProfit)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Percent className="h-3 w-3 mr-1 text-blue-700" />
                    <span className="text-sm text-blue-700">Margin:</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${getMarginColor(batch.wholesaleMargin)}`}>
                      {batch.wholesaleMargin.toFixed(1)}%
                    </span>
                    <p className="text-xs text-gray-500">{getMarginStatus(batch.wholesaleMargin)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profitability Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <TrendingUp className="h-4 w-4 mr-2 text-gray-700" />
              <Label className="text-gray-900">Profitability Summary</Label>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Best margin (Retail):</p>
                <p className={`font-bold text-lg ${getMarginColor(batch.retailMargin)}`}>
                  {batch.retailMargin.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-gray-600">Total potential profit:</p>
                <p className="font-bold text-lg text-green-600">
                  {formattedCurrency(Math.max(batch.retailProfit, batch.wholesaleProfit))}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule & Assignment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Schedule & Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-500">Scheduled Date & Time</Label>
              <div className="flex items-center text-sm mt-1">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium">
                  {new Date(batch.date).toLocaleDateString()} at {batch.time}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-gray-500">Assigned Baker</Label>
              <div className="flex items-center text-sm mt-1">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium">{batch.baker}</span>
              </div>
            </div>
          </div>

          {batch.duration && (
            <div className="mt-4">
              <Label className="text-gray-500">Expected Duration</Label>
              <div className="flex items-center text-sm mt-1">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium">{batch.duration}</span>
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
                <Label className="text-gray-500">Procedure</Label>
                <p className="text-sm text-gray-700 whitespace-pre-line mt-1 bg-gray-50 p-3 rounded">
                  {batch.procedure}
                </p>
              </div>
            )}

            {batch.notes && (
              <div>
                <Label className="text-gray-500">Notes</Label>
                <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-3 rounded">{batch.notes}</p>
              </div>
            )}

            {batch.createdFromTemplate && (
              <div>
                <Label className="text-gray-500">Created from Template</Label>
                <p className="text-sm text-blue-600 font-medium mt-1">{batch.createdFromTemplate.name}</p>
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
              <span className="text-gray-600">Created:</span>
              <span className="font-medium">{new Date(batch.createdAt).toLocaleString()}</span>
            </div>
            {batch.completedAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Completed:</span>
                <span className="font-medium text-green-600">{new Date(batch.completedAt).toLocaleString()}</span>
              </div>
            )}
            {batch.cancelledAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Cancelled:</span>
                <span className="font-medium text-red-600">{new Date(batch.cancelledAt).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-medium">{new Date(batch.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
