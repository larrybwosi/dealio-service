// components/recipes/CreateEditRecipeDialog.tsx
import { memo, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Recipe } from '@/types/bakery';
import { Save, X, Plus, Trash2, Loader2 } from 'lucide-react';
import { UnitSelect } from '@/components/common/unit-select';
import { useFormattedCurrency } from '@/lib/utils';
import { useCreateRecipe, useUpdateRecipe } from '@/lib/hooks/use-bakery';
import { RecipeFormData, recipeSchema } from '@/lib/validations/bakery';
import { useBakeryCategories, useListIngredients } from '@/lib/hooks/use-bakery';
import { useProductVariants } from '@/lib/api/products';

interface CreateEditRecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe?: Recipe | null;
  mode: 'create' | 'edit';
}

// Skeleton Components
function SelectSkeleton() {
  return <div className="h-10 bg-gray-200 rounded animate-pulse"></div>;
}

function IngredientFormSkeleton() {
  return (
    <div className="grid grid-cols-[1fr_100px_120px_50px] gap-2">
      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}

// Helper function to format variant display name
function getVariantDisplayName(variant: any): string {
  if (!variant) return '';

  const variantName = variant.name || '';
  const productName = variant.product?.name || '';

  if (variantName.toLowerCase() === 'default' || variantName.toLowerCase() === 'default variant') {
    return productName;
  }

  return productName && variantName ? `${productName} - ${variantName}` : productName || variantName;
}

function CreateEditRecipeDialog({ open, onOpenChange, recipe, mode }: CreateEditRecipeDialogProps) {
  const formattedCurrency = useFormattedCurrency();
  const { data: categories, isLoading: loadingCategories } = useBakeryCategories();
  const { ingredients, isLoading: loadingIngredients } = useListIngredients();

  const { data: productVariants, isLoading: loadingProductVariants } = useProductVariants({
    includeLocation: true,
    isActive: true,
    productType: 'FINISHED_GOOD',
  });


  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      yield: '',
      ingredients: [],
      description: '',
      prepTime: '',
      bakeTime: '',
      totalTime: '',
      difficulty: '',
      temperature: '',
      servingSize: '',
      instructions: '',
      notes: '',
      producesVariantId: '',
    },
  });

  const {
    fields: ingredientFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'ingredients',
  });
  
  const watchIngredients = watch('ingredients');

  useEffect(() => {
    if (mode === 'edit' && recipe) {
      reset({
        name: recipe.name,
        categoryId: recipe.categoryId,
        yield: recipe.yield,
        ingredients: recipe.ingredients.map(ing => ({
          id: ing.id,
          ingredientVariantId: ing.ingredientVariantId,
          quantity: ing.quantity,
          unitId: ing.unitId,
        })),
        description: recipe.description || '',
        prepTime: recipe.prepTime || '',
        bakeTime: recipe.bakeTime || '',
        totalTime: recipe.totalTime || '',
        difficulty: recipe.difficulty || '',
        temperature: recipe.temperature || '',
        servingSize: recipe.servingSize || '',
        instructions: recipe.instructions || '',
        notes: recipe.notes || '',
        producesVariantId: recipe.producesVariantId || '',
      });
    } else if (mode === 'create' && open) {
      reset({
        name: '',
        categoryId: '',
        yield: '',
        ingredients: [],
        description: '',
        prepTime: '',
        bakeTime: '',
        totalTime: '',
        difficulty: '',
        temperature: '',
        servingSize: '',
        instructions: '',
        notes: '',
        producesVariantId: '',
      });
    }
  }, [mode, recipe, open, reset]);

  const addIngredientRow = () => {
    append({
      ingredientVariantId: '',
      quantity: 0,
      unitId: '',
    });
  };

  const calculateRecipeCost = (recipeIngredients: RecipeFormData['ingredients']) => {
    return recipeIngredients.reduce((total, ingredient) => {
      const foundIngredient = ingredients?.find(i => i.id === ingredient.ingredientVariantId);
      return total + (ingredient.quantity || 0) * (foundIngredient?.buyingPrice || 0);
    }, 0);
  };

  const onSubmit = async (data: RecipeFormData) => {
    try {
      if (mode === 'create') {
        await createRecipe.mutateAsync(data);
      } else if (mode === 'edit' && recipe) {
        await updateRecipe.mutateAsync({ ...data, id: recipe.id });
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save recipe:', error);
    }
  };

  const isSubmitting = createRecipe.isPending || updateRecipe.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] sm:max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Recipe' : 'Edit Recipe'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add a new recipe with ingredients to your bakery collection'
              : 'Update recipe information and ingredients'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Recipe Name *</Label>
              <Input id="name" {...register('name')} placeholder="Enter recipe name" disabled={isSubmitting} />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="categoryId">Category *</Label>
              {loadingCategories ? (
                <SelectSkeleton />
              ) : (
                <Select
                  value={watch('categoryId')}
                  onValueChange={value => setValue('categoryId', value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.categoryId && <p className="text-sm text-red-500 mt-1">{errors.categoryId.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="yield">Yield *</Label>
              <Input id="yield" {...register('yield')} placeholder="e.g., 2 loaves" disabled={isSubmitting} />
              {errors.yield && <p className="text-sm text-red-500 mt-1">{errors.yield.message}</p>}
            </div>
            <div>
              <Label htmlFor="prepTime">Prep Time</Label>
              <Input id="prepTime" {...register('prepTime')} placeholder="e.g., 30 min" disabled={isSubmitting} />
            </div>
            <div>
              <Label htmlFor="bakeTime">Bake Time</Label>
              <Input id="bakeTime" {...register('bakeTime')} placeholder="e.g., 45 min" disabled={isSubmitting} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="totalTime">Total Time</Label>
              <Input
                id="totalTime"
                {...register('totalTime')}
                placeholder="e.g., 1 hour 15 min"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={watch('difficulty') || 'Medium'}
                onValueChange={value => setValue('difficulty', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="servingSize">Serving Size</Label>
              <Input
                id="servingSize"
                {...register('servingSize')}
                placeholder="e.g., 8 servings"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="temperature">Temperature</Label>
              <Input id="temperature" {...register('temperature')} placeholder="e.g., 350°F" disabled={isSubmitting} />
            </div>
            <div>
              <Label htmlFor="producesVariantId">Produces Variant</Label>
              {loadingProductVariants ? (
                <SelectSkeleton />
              ) : (
                <Select
                  value={watch('producesVariantId') || ''}
                  onValueChange={value => setValue('producesVariantId', value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {productVariants?.map(variant => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {getVariantDisplayName(variant)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Brief description of the recipe"
              disabled={isSubmitting}
            />
          </div>

          {/* Ingredient Management */}
          <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Recipe Ingredients</Label>
              <Button type="button" variant="outline" size="sm" onClick={addIngredientRow} disabled={isSubmitting}>
                <Plus className="h-4 w-4 mr-2" />
                Add Ingredient
              </Button>
            </div>

            {/* Ingredients List */}
            {loadingIngredients ? (
              <IngredientFormSkeleton />
            ) : (
              <div className="space-y-2">
                {ingredientFields.map((field, index) => {
                  const ingredient = ingredients?.find(i => i.id === watchIngredients?.[index]?.ingredientVariantId);
                  const cost = (Number(watchIngredients?.[index]?.quantity) || 0) * (Number(ingredient?.unitPrice )|| 0);

                  return (
                    <div key={field.id} className="grid grid-cols-[1fr_100px_120px_50px] gap-2 items-start">
                      <div>
                        <Select
                          value={watchIngredients?.[index]?.ingredientVariantId || ''}
                          onValueChange={value => setValue(`ingredients.${index}.ingredientVariantId`, value)}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select ingredient" />
                          </SelectTrigger>
                          <SelectContent>
                            {ingredients?.map(ing => (
                              <SelectItem key={ing.id} value={ing.ingredientId}>
                                {ing.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.ingredients?.[index]?.ingredientVariantId && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.ingredients[index]?.ingredientVariantId?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...register(`ingredients.${index}.quantity`, { valueAsNumber: true })}
                          placeholder="Qty"
                          disabled={isSubmitting}
                        />
                        {errors.ingredients?.[index]?.quantity && (
                          <p className="text-xs text-red-500 mt-1">{errors.ingredients[index]?.quantity?.message}</p>
                        )}
                      </div>

                      <div>
                        <UnitSelect
                          value={watchIngredients?.[index]?.unitId || ''}
                          onValueChange={value => setValue(`ingredients.${index}.unitId`, value)}
                          showLabel={false}
                          placeholder="Select Unit"
                          businessType='bakery'
                          disabled={isSubmitting}
                        />
                        {errors.ingredients?.[index]?.unitId && (
                          <p className="text-xs text-red-500 mt-1">{errors.ingredients[index]?.unitId?.message}</p>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      {ingredient && cost > 0 && (
                        <div className="col-span-4 text-xs text-green-600 -mt-1 ml-1">
                          Cost: {formattedCurrency(cost)}
                        </div>
                      )}
                    </div>
                  );
                })}

                {ingredientFields.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No ingredients added yet</p>
                )}

                {ingredientFields.length > 0 && (
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200 mt-4">
                    <span className="font-medium">Total Ingredient Cost:</span>
                    <span className="font-bold text-green-600">
                      {formattedCurrency(calculateRecipeCost((watchIngredients || []).map(ing => ({ ...ing, quantity: Number(ing?.quantity) || 0 }))))}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              {...register('instructions')}
              placeholder="Step-by-step instructions"
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes, tips, or variations"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'create' ? 'Create Recipe' : 'Save Changes'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default memo(CreateEditRecipeDialog)