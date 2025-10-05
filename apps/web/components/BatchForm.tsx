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
import { Batch } from '@/types/bakery';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useFormattedCurrency } from '@/lib/utils';
import { useCreateBatch, useRecipes, useTemplates, useUpdateBatch } from '@/lib/hooks/use-bakery';
import { useBakers, useBakeryCategories } from '@/lib/hooks/use-bakery';
import { UnitSelect } from '@/components/common/unit-select';
import { batchSchema } from '@/lib/validations/bakery';
import { toast } from 'sonner';

type BatchFormData = z.infer<typeof batchSchema>;

interface BatchFormProps {
  batch?: Batch;
  onCancel: () => void;
  ingredientStock: { [key: string]: number };
  onSuccess?: () => void;
}

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

export function BatchForm({ batch, onCancel, ingredientStock, onSuccess }: BatchFormProps) {
  const formattedCurrency = useFormattedCurrency();
  const isEditing = !!batch;

  const { data: categories = [], isLoading: loadingCategories } = useBakeryCategories();
  const { data: recipes = [], isLoading: loadingRecipes } = useRecipes();
  const { data: bakers = [], isLoading: loadingBakers } = useBakers();
  const { data: templates = [], isLoading: loadingTemplates } = useTemplates();

  // Use the mutation hooks
  const createBatchMutation = useCreateBatch();
  const updateBatchMutation = useUpdateBatch();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(batchSchema),
    defaultValues: batch
      ? {
          name: batch.name,
          recipeId: batch.recipeId,
          categoryId: batch.categoryId,
          quantity: batch.quantity,
          unitId: batch.unitId || '',
          status: batch.status,
          date: new Date(batch.date).toISOString().split('T')[0],
          time: batch.time,
          bakerId: batch.bakerId || '',
          duration: batch.duration || '',
          procedure: batch.procedure || '',
          notes: batch.notes || '',
          createdFromTemplateId: batch.createdFromTemplateId || undefined,
        }
      : {
          name: '',
          recipeId: '',
          categoryId: '',
          quantity: 1,
          unitId: '',
          status: 'PLANNED',
          date: new Date().toISOString().split('T')[0],
          time: '08:00',
          bakerId: '',
          duration: '',
          procedure: '',
          notes: '',
          createdFromTemplateId: undefined,
        },
  });
// console.log(errors, watch('createdFromTemplateId'))

  const watchedRecipeId = watch('recipeId');
  const watchedTemplateId = watch('createdFromTemplateId');
  const watchedQuantity = watch('quantity') as number;

  const calculateIngredientUsage = (recipeId: string, batchQuantity: number): IngredientUsage[] => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return [];

    const recipeYieldNumber = parseInt(recipe.yield.split(' ')[0]) || 1;
    const scalingFactor = batchQuantity / recipeYieldNumber;

    return recipe.ingredients.map(ingredient => {
      const requiredQuantity = ingredient.quantity * scalingFactor;
      const availableStock = ingredientStock[ingredient.ingredientVariantId] || 0;
      const unitCost = ingredient.ingredientVariant.buyingPrice;
      const totalCost = requiredQuantity * unitCost;

      return {
        ingredientId: ingredient.ingredientVariantId,
        ingredientName: ingredient.ingredientVariant.name,
        quantityUsed: requiredQuantity,
        unit: ingredient.unit.symbol,
        unitCost: unitCost,
        totalCost: totalCost,
        availableStock: availableStock,
        sufficient: availableStock >= requiredQuantity,
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
    }
  };

  const handleRecipeSelect = (recipeId: string) => {
    setValue('recipeId', recipeId);
    setValue('createdFromTemplateId', undefined); 
  };

  const handleFormSubmit = async (data: BatchFormData) => {
    try {
      // Validate ingredient stock
      const recipeId = data.recipeId || templates?.find(t => t.id === data.createdFromTemplateId)?.recipeId;
      if (recipeId) {
        const ingredientUsage = calculateIngredientUsage(recipeId, data.quantity);
        const insufficientStock = ingredientUsage.filter(usage => !usage.sufficient);

        if (insufficientStock.length > 0) {
          toast.info(`Insufficient stock for: ${insufficientStock.map(item => item.ingredientName).join(', ')}`);
          // return;
        }
      }

      // Prepare form data for submission
      const submitData = {
        ...data,
        createdFromTemplateId: data.createdFromTemplateId || undefined,
      };

      // Use the appropriate mutation based on whether we're editing or creating
      if (isEditing && batch) {
        await updateBatchMutation.mutateAsync({ ...submitData, id: batch.id });
      } else {
        await createBatchMutation.mutateAsync(submitData);
      }

      onSuccess?.();
    } catch (error) {
      console.error('Failed to submit batch:', error);
      // Error handling is managed by the mutation hooks
    }
  };

  const currentRecipeId = watchedRecipeId || templates?.find(t => t.id === watchedTemplateId)?.recipeId;
  const isMutationPending = createBatchMutation.isPending || updateBatchMutation.isPending;
  const isLoading = isMutationPending || loadingRecipes || loadingBakers || loadingTemplates || loadingCategories;

  return (
    <div className="space-y-4">
      <Tabs defaultValue="recipe" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recipe">From Recipe</TabsTrigger>
          <TabsTrigger value="template">From Template</TabsTrigger>
        </TabsList>

        <TabsContent value="recipe" className="space-y-4">
          <div>
            <Label htmlFor="recipe">Select Recipe</Label>
            <Select value={watchedRecipeId} onValueChange={handleRecipeSelect} disabled={isLoading || loadingRecipes}>
              <SelectTrigger className={errors.recipeId ? 'border-red-500' : ''}>
                <SelectValue placeholder={loadingRecipes ? 'Loading recipes...' : 'Select recipe'} />
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

        <TabsContent value="template" className="space-y-4">
          <div>
            <Label htmlFor="template">Select Template</Label>
            <Select
              value={watchedTemplateId || ''}
              onValueChange={handleTemplateSelect}
              disabled={isLoading || loadingTemplates}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingTemplates ? 'Loading templates...' : 'Select template'} />
              </SelectTrigger>
              <SelectContent>
                {templates?.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Batch Name</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Enter batch name"
            disabled={isLoading}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity">Quantity</Label>
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
          <div>
            <Label htmlFor="unitId">Unit</Label>
            <UnitSelect
              value={watch('unitId')}
              onValueChange={value => setValue('unitId', value)}
              disabled={isLoading}
              showLabel={false}
              placeholder="Select unit"
              businessType='bakery'
            />
            {errors.unitId && <p className="text-sm text-red-500 mt-1">{errors.unitId.message}</p>}
          </div>
        </div>

        {/* Ingredient Usage Preview */}
        {currentRecipeId && watchedQuantity > 0 && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <Label className="text-sm font-medium">Ingredient Requirements</Label>
            <div className="space-y-2 mt-2">
              {calculateIngredientUsage(currentRecipeId, watchedQuantity).map((usage, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-2 rounded ${usage.sufficient ? 'bg-green-50' : 'bg-red-50'}`}
                >
                  <div className="flex items-center space-x-2">
                    {!usage.sufficient && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm">{usage.ingredientName}</span>
                  </div>
                  <div className="text-right text-sm">
                    <div>
                      {usage.quantityUsed.toFixed(2)} {usage.unit}
                    </div>
                    <div className="text-gray-500">
                      Available: {usage.availableStock.toFixed(2)} {usage.unit}
                    </div>
                    <div className="text-green-600">{formattedCurrency(usage.totalCost)}</div>
                  </div>
                </div>
              ))}
            </div>
            {calculateIngredientUsage(currentRecipeId, watchedQuantity).some(usage => !usage.sufficient) && (
              <Alert className="mt-3">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Some ingredients have insufficient stock. Please restock before creating this batch.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Production Date</Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
              disabled={isLoading}
              className={errors.date ? 'border-red-500' : ''}
            />
            {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>}
          </div>
          <div>
            <Label htmlFor="time">Start Time</Label>
            <Input
              id="time"
              type="time"
              {...register('time')}
              disabled={isLoading}
              className={errors.time ? 'border-red-500' : ''}
            />
            {errors.time && <p className="text-sm text-red-500 mt-1">{errors.time.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bakerId">Assigned Baker</Label>
            <Select
              value={watch('bakerId') || ''}
              onValueChange={value => setValue('bakerId', value)}
              disabled={isLoading || loadingBakers}
            >
              <SelectTrigger className={errors.bakerId ? 'border-red-500' : ''}>
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
            {errors.bakerId && <p className="text-sm text-red-500 mt-1">{errors.bakerId.message}</p>}
          </div>
          <div>
            <Label htmlFor="duration">Expected Duration</Label>
            <Input id="duration" {...register('duration')} placeholder="e.g., 4 hours" disabled={isLoading} />
          </div>
        </div>

        <div>
          <Label htmlFor="procedure">Procedure</Label>
          <Textarea
            id="procedure"
            {...register('procedure')}
            placeholder="Production procedure and special instructions"
            rows={3}
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...register('notes')} placeholder="Additional notes" disabled={isLoading} />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isLoading || isSubmitting}>
            {(isLoading || isSubmitting) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEditing ? 'Update Batch' : 'Create Batch'}
          </Button>
        </div>
      </form>
    </div>
  );
}
