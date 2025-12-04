'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Batch, BatchStatus } from '@/types/bakery';
import {
  AlertTriangle,
  Loader2,
  Calendar as CalendarIcon,
  Clock,
  User,
  FileText,
  BookOpen,
  Layers,
  Package,
  Clock4,
} from 'lucide-react';
import { useFormattedCurrency } from '@/lib/utils';
import {
  useCreateBatch,
  useRecipes,
  useTemplates,
  useUpdateBatch,
  useListIngredients,
} from '@/hooks/bakery';
import { useBakers, useBakeryCategories } from '@/hooks/bakery';
import { AdvancedUnitSelector } from '@/components/common/units/advance-select';
import { BatchInput, batchSchema } from '@/lib/bakery-validation';
import { toast } from 'sonner';
import { ProductVariantsSelect } from '@/components/common/product-variant-select';
import { Badge } from '@workspace/ui/components/badge';
import { LocationSelect } from '../common/location-select';
import { Calendar } from '@workspace/ui/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUnits } from '@/lib/units/hooks';

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

  const { data: recipes = [], isLoading: loadingRecipes } = useRecipes();
  const { data: bakers = [], isLoading: loadingBakers } = useBakers();
  const { data: templates = [], isLoading: loadingTemplates } = useTemplates();
  const { ingredients = [], isLoading: loadingIngredients } = useListIngredients();
  const { systemUnits, orgUnits:organizationUnits } = useUnits();

  // Use the conversion hooks
  const createBatchMutation = useCreateBatch();
  const updateBatchMutation = useUpdateBatch();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BatchInput>({
    resolver: zodResolver(batchSchema),
    defaultValues: batch
      ? {
          recipeId: batch.recipeId,
          plannedQuantity: batch.plannedQuantity,
          systemUnitId: batch.systemUnitId || undefined,
          orgUnitId: batch.orgUnitId || batch.unitId || undefined,
          status: batch.status,
          bakerId: batch.bakerId || '',
          duration: batch.duration ? Number(batch.duration) : undefined,
          procedure: batch.procedure || '',
          notes: batch.notes || '',
          createdFromTemplateId: batch.createdFromTemplateId || undefined,
          outputLocationId: batch.outputLocationId || '',
          date: batch.scheduledStartAt
            ? new Date(batch.scheduledStartAt)
            : batch.productionDate
              ? new Date(batch.productionDate)
              : new Date(),
          time:  '09:00',
          shelfLifeDays: batch.shelfLifeDays || undefined,
        }
      : {
          recipeId: '',
          plannedQuantity: 1,
          systemUnitId: undefined,
          orgUnitId: undefined,
          status: BatchStatus.PLANNED,
          bakerId: '',
          duration: undefined,
          procedure: '',
          notes: '',
          createdFromTemplateId: undefined,
          outputLocationId: '',
          date: new Date(),
          time: '09:00',
          shelfLifeDays: undefined,
        },
  });

  const watchedRecipeId = watch('recipeId');
  const watchedTemplateId = watch('createdFromTemplateId');
  const watchedDate = watch('date');
  const watchedSystemUnitId = watch('systemUnitId');
  const watchedOrgUnitId = watch('orgUnitId');
  const unitValue = watchedSystemUnitId || watchedOrgUnitId;
  const unitErrorMessage =
    !watchedSystemUnitId && !watchedOrgUnitId && errors.root?.message
      ? errors.root.message
      : errors.systemUnitId?.message || errors.orgUnitId?.message || undefined;

  // Memoize currentRecipeId to prevent unnecessary recalculations
  const currentRecipeId = useMemo(() => {
    return watchedRecipeId || templates?.find(t => t.id === watchedTemplateId)?.recipeId;
  }, [watchedRecipeId, watchedTemplateId, templates]);

  const handleBatchUnitChange = useCallback(
    (value: string, type: 'system' | 'org') => {
      const options = { shouldDirty: true, shouldValidate: true };
      setValue('systemUnitId', type === 'system' ? value : undefined, options);
      setValue('orgUnitId', type === 'org' ? value : undefined, options);
    },
    [setValue]
  );

  // Handle template selection
  const handleTemplateSelect = useCallback(
    (templateId: string) => {
      const template = templates?.find(t => t.id === templateId);
      if (template) {
        // Batch updates to minimize re-renders
        const options = { shouldDirty: true };
        setValue('createdFromTemplateId', templateId, options);
        setValue('recipeId', template.recipeId, options);
        setValue('plannedQuantity', template.quantity, options);

        // Handle unit from template
        if (template.unitId) {
          const unitOptions = { ...options, shouldValidate: true };
          const isSystem = systemUnits.some((u: any) => u.id === template.unitId);
          const isOrg = organizationUnits.some((u: any) => u.id === template.unitId);
          if (isSystem) {
            setValue('systemUnitId', template.unitId, unitOptions);
            setValue('orgUnitId', undefined, unitOptions);
          } else if (isOrg) {
            setValue('systemUnitId', undefined, unitOptions);
            setValue('orgUnitId', template.unitId, unitOptions);
          }
        }

        setValue('duration', template.duration ? Number(template.duration) : undefined, options);
        setValue('procedure', template.procedure || '', options);
        if (template.shelfLifeDays) {
          setValue('shelfLifeDays', template.shelfLifeDays, options);
        }
      }
    },
    [templates, setValue, systemUnits, organizationUnits]
  );

  const handleRecipeSelect = useCallback(
    (recipeId: string) => {
      // Batch updates to minimize re-renders
      setValue('recipeId', recipeId, { shouldDirty: true });
      setValue('createdFromTemplateId', undefined, { shouldDirty: true });
    },
    [setValue]
  );

  const handleFormSubmit = async (data: BatchInput) => {
    try {
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

  const isMutationPending = createBatchMutation.isPending || updateBatchMutation.isPending;
  const isLoading =
    isMutationPending ||
    loadingRecipes ||
    loadingBakers ||
    loadingTemplates ||
    loadingIngredients;

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plannedQuantity" className="text-sm font-medium">
                Planned Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="plannedQuantity"
                type="number"
                step="0.01"
                {...register('plannedQuantity', { valueAsNumber: true })}
                min="0.01"
                disabled={isLoading}
                className={errors.plannedQuantity ? 'border-red-500' : ''}
              />
              {errors.plannedQuantity && <p className="text-sm text-red-500 mt-1">{errors.plannedQuantity.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Unit <span className="text-red-500">*</span>
              </Label>
              <AdvancedUnitSelector
                systemUnits={systemUnits}
                organizationUnits={organizationUnits}
                value={unitValue || undefined}
                onValueChange={handleBatchUnitChange}
                disabled={isLoading}
                placeholder="Select unit"
                className={unitErrorMessage ? 'border-red-500' : ''}
              />
              {unitErrorMessage && <p className="text-sm text-red-500 mt-1">{unitErrorMessage}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="outputLocationId" className="text-sm font-medium">
              Output Location
            </Label>
            <LocationSelect
              value={watch('outputLocationId') || ''}
              onValueChange={value => setValue('outputLocationId', value)}
              placeholder="Select output location"
              disabled={isLoading}
              required={false}
            />
            {errors.outputLocationId && <p className="text-sm text-red-500 mt-1">{errors.outputLocationId.message}</p>}
          </div>
        </div>

        {/* Schedule & Production Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <h3 className="font-semibold text-sm text-gray-700">Schedule & Production</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Production Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !watchedDate && 'text-muted-foreground',
                      errors.date && 'border-red-500'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watchedDate ? format(watchedDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={watchedDate}
                    onSelect={date => setValue('date', date || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium">
                Planned Start Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="time"
                type="time"
                step="300"
                {...register('time')}
                disabled={isLoading}
                className={errors.time ? 'border-red-500' : ''}
              />
              {errors.time && <p className="text-sm text-red-500 mt-1">{errors.time.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
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
                Expected Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                {...register('duration', { valueAsNumber: true })}
                placeholder="e.g., 240"
                disabled={isLoading}
                className={errors.duration ? 'border-red-500' : ''}
              />
              {errors.duration && <p className="text-sm text-red-500 mt-1">{errors.duration.message}</p>}
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
