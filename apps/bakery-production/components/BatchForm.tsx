'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Batch } from '@/types';
import {
  AlertTriangle,
  Loader2,
  Calendar,
  Clock,
  User,
  FileText,
  BookOpen,
  Layers,
  Package,
  Clock4,
} from 'lucide-react';
import { useFormattedCurrency } from '@/lib/utils';
import { useCreateBatch, useRecipes, useTemplates, useUpdateBatch, useListIngredients } from '@/hooks/use-bakery';
import { useBakers, useBakeryCategories } from '@/hooks/use-bakery';
import { UnitSelect } from '@/components/common/unit-select';
import { batchSchema } from '@/lib/validation';
import { toast } from 'sonner';
import { ProductVariantsSelect } from '@/components/common/product-variant-select';
import { Badge } from '@workspace/ui/components/badge';
import { useConversionData } from '@/hooks/use-units-conversions';

type BatchFormData = z.infer<typeof batchSchema>;

interface IngredientUsage {
  ingredientId: string;
  ingredientName: string;
  quantityUsed: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  availableStock: number;
  sufficient: boolean;
}

interface BatchFormProps {
  batch?: Batch;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function BatchForm({ batch, onCancel, onSuccess }: BatchFormProps) {
  const formattedCurrency = useFormattedCurrency();
  const isEditing = !!batch;

  const { data: categories = [], isLoading: loadingCategories } = useBakeryCategories();
  const { data: recipes = [], isLoading: loadingRecipes } = useRecipes();
  const { data: bakers = [], isLoading: loadingBakers } = useBakers();
  const { data: templates = [], isLoading: loadingTemplates } = useTemplates();
  const { ingredients = [], isLoading: loadingIngredients } = useListIngredients();

  // Use the conversion hooks
  const { data: conversionData = [], isLoading: loadingConversionData } = useConversionData();
  const createBatchMutation = useCreateBatch();
  const updateBatchMutation = useUpdateBatch();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: batch
      ? {
          name: batch.name,
          recipeId: batch.recipeId,
          categoryId: batch.categoryId,
          quantity: batch.quantity,
          unitId: batch.unitId || '',
          producedVariantId: batch.producedVariantId,
          status: batch.status,
          date: new Date(batch.date).toISOString().split('T')[0],
          time: batch.time,
          bakerId: batch.bakerId || '',
          duration: batch.duration || '',
          procedure: batch.procedure || '',
          notes: batch.notes || '',
          createdFromTemplateId: batch.createdFromTemplateId || undefined,
          productionDate: batch.productionDate ? new Date(batch.productionDate).toISOString().split('T')[0] : undefined,
          expiresAt: batch.expiresAt ? new Date(batch.expiresAt).toISOString().split('T')[0] : undefined,
          shelfLifeDays: batch.shelfLifeDays || undefined,
          expirationStatus: batch.expirationStatus || 'FRESH',
        }
      : {
          name: '',
          recipeId: '',
          categoryId: '',
          quantity: 1,
          unitId: '',
          producedVariantId: '',
          status: 'PLANNED',
          date: new Date().toISOString().split('T')[0],
          time: '08:00',
          bakerId: '',
          duration: '',
          procedure: '',
          notes: '',
          createdFromTemplateId: undefined,
          productionDate: new Date().toISOString().split('T')[0],
          expiresAt: undefined,
          shelfLifeDays: undefined,
          expirationStatus: 'FRESH',
        },
  });

  const watchedRecipeId = watch('recipeId');
  const watchedTemplateId = watch('createdFromTemplateId');
  const watchedQuantity = watch('quantity') as number;
  const watchedProducedVariantId = watch('producedVariantId');
  const watchedProductionDate = watch('productionDate');
  const watchedShelfLifeDays = watch('shelfLifeDays');
  const watchedExpiresAt = watch('expiresAt');

  // Calculate expiration date when production date or shelf life changes
  useEffect(() => {
    if (watchedProductionDate && watchedShelfLifeDays) {
      const productionDate = new Date(watchedProductionDate);
      const expiresAt = new Date(productionDate);
      expiresAt.setDate(expiresAt.getDate() + watchedShelfLifeDays);
      setValue('expiresAt', expiresAt.toISOString().split('T')[0]);
    }
  }, [watchedProductionDate, watchedShelfLifeDays, setValue]);

  // Calculate shelf life days when production date and expiration date change
  useEffect(() => {
    if (watchedProductionDate && watchedExpiresAt) {
      const productionDate = new Date(watchedProductionDate);
      const expiresAt = new Date(watchedExpiresAt);
      const diffTime = expiresAt.getTime() - productionDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        setValue('shelfLifeDays', diffDays);
      }
    }
  }, [watchedProductionDate, watchedExpiresAt, setValue]);

  // Helper function to convert units using the hook
  const convertWithHook = (value: number, fromUnit: string, toUnit: string): number => {
    if (fromUnit === toUnit || fromUnit === 'unknown' || toUnit === 'unknown') {
      return value;
    }

    // Use the useUnitConversion hook via a custom hook pattern
    // Since we can't call hooks inside loops, we'll use the conversion data directly
    const conversion = conversionData.find(c => c.fromUnit.symbol === fromUnit && c.toUnit.symbol === toUnit);

    if (conversion) {
      return value * conversion.factor;
    }

    // Try the reverse conversion
    const reverseConversion = conversionData.find(c => c.fromUnit.symbol === toUnit && c.toUnit.symbol === fromUnit);

    if (reverseConversion) {
      return value / reverseConversion.factor;
    }

    console.warn(`No conversion found from ${fromUnit} to ${toUnit}`);
    return 0;
  };

  const calculateIngredientUsage = async (recipeId: string, batchQuantity: number): Promise<IngredientUsage[]> => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return [];

    const recipeYieldNumber = parseInt(recipe.yield.split(' ')[0]) || 1;
    const scalingFactor = batchQuantity / recipeYieldNumber;

    return recipe.ingredients.map(ingredient => {
      const requiredQuantity = ingredient.quantity * scalingFactor;
      const recipeUnit = ingredient.unit?.symbol || 'unknown';

      // Find the ingredient data from useListIngredients
      const ingredientData = ingredients.find(i => i.ingredientId === ingredient.ingredientVariantId);
      const stockUnit = ingredientData?.unit?.symbol || 'unknown';
      const availableStockInStockUnit = ingredientData?.currentStock || 0;
      const unitPriceInStockUnit = Number(ingredientData?.unitPrice) || 0; // e.g., 400 cents/g = $0.004/g

      // Convert stock to recipe unit using the hook-based conversion
      let availableStockInRecipeUnit = availableStockInStockUnit;
      try {
        if (stockUnit !== recipeUnit && stockUnit !== 'unknown' && recipeUnit !== 'unknown') {
          availableStockInRecipeUnit = convertWithHook(availableStockInStockUnit, stockUnit, recipeUnit);
        }
      } catch (error) {
        console.warn(
          `Could not convert stock for ingredient "${ingredient.ingredientVariant.name}" from "${stockUnit}" to "${recipeUnit}":`,
          error
        );
        availableStockInRecipeUnit = 0;
      }

      // Convert unit price to recipe unit using the hook-based conversion
      let unitCostInRecipeUnit = unitPriceInStockUnit;
      try {
        if (stockUnit !== recipeUnit && stockUnit !== 'unknown' && recipeUnit !== 'unknown') {
          const conversionFactor = convertWithHook(1, stockUnit, recipeUnit);
          unitCostInRecipeUnit = unitPriceInStockUnit / conversionFactor; // e.g., $0.004/g / 1000 = $4/kg
        }
      } catch (error) {
        console.warn(
          `Could not convert unit price for ingredient "${ingredient.ingredientVariant.name}" from "${stockUnit}" to "${recipeUnit}":`,
          error
        );
        unitCostInRecipeUnit = 0;
      }

      const totalCost = requiredQuantity * unitCostInRecipeUnit;

      return {
        ingredientId: ingredient.ingredientVariantId,
        ingredientName: ingredient.ingredientVariant.name,
        quantityUsed: requiredQuantity,
        unit: recipeUnit,
        unitCost: unitCostInRecipeUnit,
        totalCost: totalCost,
        availableStock: availableStockInRecipeUnit,
        sufficient: availableStockInRecipeUnit >= requiredQuantity,
      };
    });
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates?.find(t => t.id === templateId);
    if (template) {
      setValue('createdFromTemplateId', templateId);
      setValue('recipeId', template.recipeId);
      setValue('categoryId', template.categoryId);
      setValue('quantity', template.quantity);
      setValue('unitId', template.unitId);
      setValue('duration', template.duration || '');
      setValue('procedure', template.procedure || '');
      if (template.producedVariantId) {
        setValue('producedVariantId', template.producedVariantId);
      }
    }
  };

  const handleRecipeSelect = (recipeId: string) => {
    setValue('recipeId', recipeId);
    setValue('createdFromTemplateId', undefined);
  };

  const handleFormSubmit = async (data: BatchFormData) => {
    try {
      const recipeId = data.recipeId || templates?.find(t => t.id === data.createdFromTemplateId)?.recipeId;
      if (recipeId) {
        const ingredientUsage = await calculateIngredientUsage(recipeId, data.quantity);
        const insufficientStock = ingredientUsage.filter(usage => !usage.sufficient);

        if (insufficientStock.length > 0) {
          toast.info(`Insufficient stock for: ${insufficientStock.map(item => item.ingredientName).join(', ')}`);
        }
      }

      const submitData = {
        ...data,
        createdFromTemplateId: data.createdFromTemplateId || undefined,
      };

      if (isEditing && batch) {
        await updateBatchMutation.mutateAsync({ ...submitData, id: batch.id });
      } else {
        await createBatchMutation.mutateAsync(submitData);
      }

      onSuccess?.();
    } catch (error) {
      console.error('Failed to submit batch:', error);
      toast.error('Failed to submit batch. Please try again.');
    }
  };

  const currentRecipeId = watchedRecipeId || templates?.find(t => t.id === watchedTemplateId)?.recipeId;
  const isMutationPending = createBatchMutation.isPending || updateBatchMutation.isPending;
  const isLoading =
    isMutationPending ||
    loadingRecipes ||
    loadingBakers ||
    loadingTemplates ||
    loadingCategories ||
    loadingIngredients ||
    loadingConversionData;

  const [ingredientUsage, setIngredientUsage] = useState<IngredientUsage[]>([]);
  useEffect(() => {
    if (currentRecipeId && watchedQuantity > 0) {
      calculateIngredientUsage(currentRecipeId, watchedQuantity).then(setIngredientUsage);
    } else {
      setIngredientUsage([]);
    }
  }, [currentRecipeId, watchedQuantity, conversionData]); // Add conversionData as dependency

  const totalCost = ingredientUsage.reduce((sum, usage) => sum + usage.totalCost, 0);
  const hasInsufficientStock = ingredientUsage.some(usage => !usage.sufficient);

  return (
    <div className="space-y-6">
      {/* Source Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Layers className="h-4 w-4 text-gray-500" />
          <h3 className="font-semibold text-sm text-gray-700">Batch Source</h3>
        </div>

        <Tabs defaultValue="recipe" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recipe" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              From Recipe
            </TabsTrigger>
            <TabsTrigger value="template" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              From Template
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipe" className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="recipe" className="text-sm font-medium">
                Select Recipe <span className="text-red-500">*</span>
              </Label>
              <Select value={watchedRecipeId} onValueChange={handleRecipeSelect} disabled={isLoading || loadingRecipes}>
                <SelectTrigger className={errors.recipeId ? 'border-red-500' : ''}>
                  <SelectValue placeholder={loadingRecipes ? 'Loading recipes...' : 'Choose a recipe'} />
                </SelectTrigger>
                <SelectContent>
                  {recipes.map(recipe => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.recipeId && <p className="text-sm text-red-500 mt-1">{errors.recipeId.message}</p>}
            </div>
          </TabsContent>

          <TabsContent value="template" className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="template" className="text-sm font-medium">
                Select Template
              </Label>
              <Select
                value={watchedTemplateId || ''}
                onValueChange={handleTemplateSelect}
                disabled={isLoading || loadingTemplates}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingTemplates ? 'Loading templates...' : 'Choose a template'} />
                </SelectTrigger>
                <SelectContent>
                  {templates?.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Templates pre-fill common batch settings</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Batch Details Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Package className="h-4 w-4 text-gray-500" />
            <h3 className="font-semibold text-sm text-gray-700">Batch Details</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Batch Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., Morning Bread Batch, Weekend Pastry Run"
              disabled={isLoading}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="producedVariantId" className="text-sm font-medium">
              Produced Product <span className="text-red-500">*</span>
            </Label>
            <ProductVariantsSelect
              value={watchedProducedVariantId}
              onValueChange={value => setValue('producedVariantId', value)}
              productType="FINISHED_GOOD"
              placeholder="Select the product being produced"
              disabled={isLoading}
              required={true}
              showLocationInfo={false}
            />
            {errors.producedVariantId && (
              <p className="text-sm text-red-500 mt-1">{errors.producedVariantId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId" className="text-sm font-medium">
                Category
              </Label>
              <Select
                value={watch('categoryId')}
                onValueChange={value => setValue('categoryId', value)}
                disabled={isLoading || loadingCategories}
              >
                <SelectTrigger className={errors.categoryId ? 'border-red-500' : ''}>
                  <SelectValue placeholder={loadingCategories ? 'Loading categories...' : 'Select category'} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-sm text-red-500 mt-1">{errors.categoryId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">
                Batch Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                {...register('quantity', { valueAsNumber: true })}
                min="1"
                disabled={isLoading}
                className={errors.quantity ? 'border-red-500' : ''}
              />
              {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitId" className="text-sm font-medium">
              Unit
            </Label>
            <UnitSelect
              value={watch('unitId')}
              onValueChange={value => setValue('unitId', value)}
              disabled={isLoading}
              showLabel={false}
              placeholder="Select unit"
              unitType="COUNT"
            />
            {errors.unitId && <p className="text-sm text-red-500 mt-1">{errors.unitId.message}</p>}
          </div>
        </div>

        {/* Expiration Tracking Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Clock4 className="h-4 w-4 text-gray-500" />
            <h3 className="font-semibold text-sm text-gray-700">Expiration Tracking</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productionDate" className="text-sm font-medium">
                Production Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="productionDate"
                  type="date"
                  {...register('productionDate')}
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
              {errors.productionDate && <p className="text-sm text-red-500 mt-1">{errors.productionDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shelfLifeDays" className="text-sm font-medium">
                Shelf Life (Days)
              </Label>
              <Input
                id="shelfLifeDays"
                type="number"
                {...register('shelfLifeDays', { valueAsNumber: true })}
                min="1"
                placeholder="e.g., 7"
                disabled={isLoading}
                className={errors.shelfLifeDays ? 'border-red-500' : ''}
              />
              {errors.shelfLifeDays && <p className="text-sm text-red-500 mt-1">{errors.shelfLifeDays.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt" className="text-sm font-medium">
                Expiration Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="expiresAt" type="date" {...register('expiresAt')} disabled={isLoading} className="pl-10" />
              </div>
              {errors.expiresAt && <p className="text-sm text-red-500 mt-1">{errors.expiresAt.message}</p>}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> Enter either Shelf Life or Expiration Date - the other will be calculated
              automatically. Production date defaults to today.
            </p>
          </div>
        </div>

        {/* Ingredient Requirements Section */}
        {currentRecipeId && watchedQuantity > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <AlertTriangle className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold text-sm text-gray-700">Ingredient Requirements</h3>
              {hasInsufficientStock && (
                <Badge variant="destructive" className="ml-2">
                  Insufficient Stock
                </Badge>
              )}
            </div>

            <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
              <div className="grid grid-cols-1 gap-2">
                {ingredientUsage.map((usage, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-3 rounded-lg border ${
                      usage.sufficient ? 'bg-white border-gray-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      {!usage.sufficient && <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{usage.ingredientName}</p>
                        <p className="text-xs text-gray-500">
                          Available: {usage.availableStock.toFixed(2)} {usage.unit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium">
                        {usage.quantityUsed.toFixed(2)} {usage.unit}
                      </p>
                      <p className="text-xs text-green-600">{formattedCurrency(usage.totalCost)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Cost */}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Total Ingredient Cost</span>
                  <span className="text-lg font-bold text-green-600">{formattedCurrency(totalCost)}</span>
                </div>
              </div>

              {hasInsufficientStock && (
                <Alert className="mt-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Some ingredients have insufficient stock. Please restock before creating this batch.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}

        {/* Schedule & Production Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Calendar className="h-4 w-4 text-gray-500" />
            <h3 className="font-semibold text-sm text-gray-700">Schedule & Production</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Production Date <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                  disabled={isLoading}
                  className={errors.date ? 'border-red-500 pl-10' : 'pl-10'}
                />
              </div>
              {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium">
                Start Time <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="time"
                  type="time"
                  {...register('time')}
                  disabled={isLoading}
                  className={errors.time ? 'border-red-500 pl-10' : 'pl-10'}
                />
              </div>
              {errors.time && <p className="text-sm text-red-500 mt-1">{errors.time.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bakerId" className="text-sm font-medium">
                Assigned Baker
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Select
                  value={watch('bakerId') || ''}
                  onValueChange={value => setValue('bakerId', value)}
                  disabled={isLoading || loadingBakers}
                >
                  <SelectTrigger className={errors.bakerId ? 'border-red-500 pl-10' : 'pl-10'}>
                    <SelectValue placeholder={loadingBakers ? 'Loading bakers...' : 'Select baker'} />
                  </SelectTrigger>
                  <SelectContent>
                    {bakers
                      .filter(b => b.isActive)
                      .map(baker => (
                        <SelectItem key={baker.id} value={baker.id}>
                          {baker.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.bakerId && <p className="text-sm text-red-500 mt-1">{errors.bakerId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Expected Duration
              </Label>
              <Input
                id="duration"
                {...register('duration')}
                placeholder="e.g., 4 hours, 2 hours 30 minutes"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b">
            <FileText className="h-4 w-4 text-gray-500" />
            <h3 className="font-semibold text-sm text-gray-700">Instructions</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="procedure" className="text-sm font-medium">
              Production Procedure
            </Label>
            <Textarea
              id="procedure"
              {...register('procedure')}
              placeholder="Step-by-step production procedure and special instructions..."
              rows={4}
              disabled={isLoading}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Quality checks, special handling instructions, or other important notes..."
              rows={3}
              disabled={isLoading}
              className="resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="min-w-24">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || isSubmitting} className="min-w-24 bg-gray-900 hover:bg-gray-800">
            {(isLoading || isSubmitting) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEditing ? 'Update Batch' : 'Create Batch'}
          </Button>
        </div>
      </form>
    </div>
  );
}
