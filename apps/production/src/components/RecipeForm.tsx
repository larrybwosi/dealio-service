// components/recipes/CreateEditRecipeDialog.tsx
import { memo, useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query'; // Import useMutation
import axios from 'axios'; // Import Axios
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Recipe } from '@/types/bakery';
import { Save, X, Plus, Trash2, Loader2, Sparkles, Wand2, AlertCircle } from 'lucide-react';
import { AdvancedUnitSelector } from '@/components/common/units/advance-select';
import { useFormattedCurrency } from '@/lib/utils';
import { useCreateRecipe, useUpdateRecipe, useBakeryCategories, useListIngredients, useGenerateRecipeAi } from '@/hooks/bakery';
import { RecipeFormData, recipeSchema } from '@/lib/bakery-validation';
import { ProductVariantsSelect } from '@/components/common/product-variant-select';
import { RecipeDifficulty } from '@/prisma/enums';
import { useUnits } from '@/lib/units/hooks';
import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert';
import { toast } from 'sonner';


interface CreateEditRecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe?: Recipe | null;
  mode: 'create' | 'edit';
}

function SelectSkeleton() {
  return <div className="h-10 bg-muted rounded animate-pulse"></div>;
}

function IngredientFormSkeleton() {
  return (
    <div className="grid grid-cols-[1fr_100px_120px_50px] gap-2">
      <div className="h-10 bg-muted rounded animate-pulse"></div>
      <div className="h-10 bg-muted rounded animate-pulse"></div>
      <div className="h-10 bg-muted rounded animate-pulse"></div>
      <div className="h-10 bg-muted rounded animate-pulse"></div>
    </div>
  );
}

function CreateEditRecipeDialog({ open, onOpenChange, recipe, mode }: CreateEditRecipeDialogProps) {
  const formattedCurrency = useFormattedCurrency();
  const { data: categories, isLoading: loadingCategories } = useBakeryCategories();
  const { ingredients, isLoading: loadingIngredients } = useListIngredients();
  const { systemUnits, orgUnits } = useUnits();

  const [activeTab, setActiveTab] = useState('manual');
  const [aiPrompt, setAiPrompt] = useState('');

  // Hooks
  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();
  const generateRecipeAi = useGenerateRecipeAi(); // Initialize AI hook

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
      yieldQuantity: 1,
      systemUnitId: undefined,
      orgUnitId: undefined,
      ingredients: [],
      description: '',
      instructions: '',
      notes: '',
      producesVariantId: '',
    },
  });

  const {
    fields: ingredientFields,
    append,
    remove,
    replace, // Used to bulk replace ingredients from AI
  } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const watchIngredients = watch('ingredients');
  const watchedYieldSystemUnitId = watch('systemUnitId');
  const watchedYieldOrgUnitId = watch('orgUnitId');
  const yieldUnitValue = watchedYieldSystemUnitId || watchedYieldOrgUnitId;

  const yieldUnitErrorMessage =
    !watchedYieldSystemUnitId && !watchedYieldOrgUnitId && errors.root?.message
      ? errors.root.message
      : errors.systemUnitId?.message || errors.orgUnitId?.message || undefined;

  useEffect(() => {
    if (mode === 'edit' && recipe) {
      reset({
        name: recipe.name,
        categoryId: recipe.categoryId,
        yieldQuantity: Number(recipe.yieldQuantity) || 1,
        systemUnitId: recipe.systemUnitId || undefined,
        orgUnitId: recipe.orgUnitId || recipe.yieldUnitId || undefined,
        costPrice: recipe.costPrice ? Number(recipe.costPrice) : undefined,
        ingredients: recipe.ingredients.map(ing => ({
          // Form expects ingredientVariantId, API/DB gives id or ingredientId
          ingredientVariantId: ing.ingredientVariantId,
          quantity: Number(ing.quantity),
          systemUnitId: ing.systemUnitId || undefined,
          orgUnitId: ing.orgUnitId || ing.unitId || undefined,
          preparationNotes: ing.preparationNotes || '',
        })),
        description: recipe.description || '',
        prepTime: recipe.prepTime || undefined,
        bakeTime: recipe.bakeTime || undefined,
        totalTime: recipe.totalTime || undefined,
        difficulty: recipe.difficulty || undefined,
        temperatureCelsius: recipe.temperatureCelsius || undefined,
        servingSize: recipe.servingSize || '',
        instructions: recipe.instructions || '',
        notes: recipe.notes || '',
        producesVariantId: recipe.producesVariantId || '',
      });
    } else if (mode === 'create' && open) {
      reset({
        name: '',
        categoryId: '',
        yieldQuantity: 1,
        ingredients: [],
        producesVariantId: '',
      });
      setActiveTab('manual');
    }
  }, [mode, recipe, open, reset]);

  const addIngredientRow = () => {
    append({
      ingredientVariantId: '',
      quantity: 0,
      systemUnitId: undefined,
      orgUnitId: undefined,
      preparationNotes: '',
    });
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

  // --- AI Handler ---
  const handleGenerateRecipe = () => {
    if (!aiPrompt.trim()) return;

    generateRecipeAi.mutate(
      { prompt: aiPrompt },
      {
        onSuccess: data => {
          // 1. Map top-level fields
          setValue('name', data.name, { shouldValidate: true });
          setValue('description', data.description, { shouldValidate: true });
          setValue('yieldQuantity', data.yieldQuantity, { shouldValidate: true });

          // Map Yield Units
          setValue('systemUnitId', data.yieldSystemUnitId || undefined);
          setValue('orgUnitId', data.yieldOrgUnitId || undefined);

          setValue('prepTime', data.prepTime);
          setValue('bakeTime', data.bakeTime);
          setValue('totalTime', data.totalTime);
          setValue('difficulty', data.difficulty);
          setValue('temperatureCelsius', data.temperatureCelsius);
          setValue('instructions', data.instructions, { shouldValidate: true });
          setValue('notes', data.notes || '');

          // 2. Map Ingredients
          // The API returns 'ingredientId' which matches our DB 'id' for ProductVariant
          // The form expects 'ingredientVariantId'
          const mappedIngredients = data.ingredients.map((aiIng: any) => ({
            ingredientVariantId: aiIng.ingredientId, // Crucial mapping
            quantity: aiIng.quantity,
            systemUnitId: aiIng.systemUnitId || undefined,
            orgUnitId: aiIng.orgUnitId || undefined,
            preparationNotes: aiIng.notes || '',
          }));

          replace(mappedIngredients);

          // 3. UI Feedback
          setActiveTab('manual');
          setAiPrompt(''); // Optional: clear prompt
        },
        onError: error => {
          console.error('AI Generation failed:', error);
          toast.error('Failed to generate recipe. Please try again.');
        },
      }
    );
  };

  const isSubmitting = createRecipe.isPending || updateRecipe.isPending;
  const isGenerating = generateRecipeAi.isPending;

  const handleYieldUnitChange = (value: string, type: 'system' | 'org') => {
    const options = { shouldDirty: true, shouldValidate: true };
    setValue('systemUnitId', type === 'system' ? value : undefined, options);
    setValue('orgUnitId', type === 'org' ? value : undefined, options);
  };

  const handleIngredientUnitChange = (index: number) => (value: string, type: 'system' | 'org') => {
    const options = { shouldDirty: true, shouldValidate: true };
    setValue(`ingredients.${index}.systemUnitId`, type === 'system' ? value : undefined, options);
    setValue(`ingredients.${index}.orgUnitId`, type === 'org' ? value : undefined, options);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] sm:max-w-2xl overflow-y-auto bg-background text-foreground">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pr-8">
            <div className="space-y-1">
              <DialogTitle>{mode === 'create' ? 'Create New Recipe' : 'Edit Recipe'}</DialogTitle>
              <DialogDescription>
                {mode === 'create' ? 'Add a new recipe to your collection' : 'Update recipe information'}
              </DialogDescription>
            </div>

            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="manual">Manual</TabsTrigger>
              <TabsTrigger value="ai" className="gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Try AI
              </TabsTrigger>
            </TabsList>
          </DialogHeader>

          {/* AI Generation Tab */}
          <TabsContent value="ai" className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center space-y-4 text-center p-6 border rounded-lg border-dashed bg-muted/30">
              <div className="p-3 bg-primary/10 rounded-full">
                <Wand2 className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1 max-w-md">
                <h3 className="font-semibold text-lg">Generate with AI</h3>
                <p className="text-sm text-muted-foreground">
                  Describe the recipe (e.g., "A moist carrot cake with cream cheese frosting, yielding 2kg").
                  <br />
                  <span className="text-xs text-orange-600 font-medium">
                    The AI will automatically select ingredients from your inventory.
                  </span>
                </p>
              </div>

              {/* Error Display */}
              {generateRecipeAi.isError && (
                <Alert variant="destructive" className="max-w-lg text-left">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {(generateRecipeAi.error as any)?.response?.data?.error ||
                      'Failed to generate recipe. Please try again.'}
                  </AlertDescription>
                </Alert>
              )}

              <div className="w-full max-w-lg space-y-4">
                <Textarea
                  placeholder="Enter your recipe prompt here..."
                  className="min-h-[120px] resize-none"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  disabled={isGenerating}
                />
                <Button onClick={handleGenerateRecipe} disabled={isGenerating || !aiPrompt.trim()} className="w-full">
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Crafting Recipe...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Manual Form Tab */}
          <TabsContent value="manual">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Recipe Name *</Label>
                  <Input id="name" {...register('name')} placeholder="Enter recipe name" disabled={isSubmitting} />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
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
                      <SelectTrigger className={errors.categoryId ? 'border-destructive' : ''}>
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
                  {errors.categoryId && <p className="text-sm text-destructive mt-1">{errors.categoryId.message}</p>}
                </div>
              </div>

              {/* Yield Section */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="yieldQuantity">Yield Quantity *</Label>
                  <Input
                    id="yieldQuantity"
                    type="number"
                    step="0.01"
                    min="0.01"
                    {...register('yieldQuantity', { valueAsNumber: true })}
                    placeholder="e.g., 2"
                    disabled={isSubmitting}
                    className={errors.yieldQuantity ? 'border-destructive' : ''}
                  />
                  {errors.yieldQuantity && (
                    <p className="text-sm text-destructive mt-1">{errors.yieldQuantity.message}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">Yield Unit *</Label>
                  <AdvancedUnitSelector
                    systemUnits={systemUnits}
                    orgUnits={orgUnits}
                    value={yieldUnitValue || undefined}
                    onValueChange={handleYieldUnitChange}
                    disabled={isSubmitting}
                    placeholder="Select unit"
                    className={yieldUnitErrorMessage ? 'border-destructive' : ''}
                  />
                  {yieldUnitErrorMessage && <p className="text-sm text-destructive mt-1">{yieldUnitErrorMessage}</p>}
                </div>
                <div>
                  <Label htmlFor="costPrice">Cost Price</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('costPrice', { valueAsNumber: true })}
                    placeholder="Calculated automatically"
                    disabled={true} // Usually calculated from ingredients
                    className="bg-muted"
                  />
                </div>
              </div>

              {/* Time and Difficulty Section */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="prepTime">Prep Time (min)</Label>
                  <Input
                    id="prepTime"
                    type="number"
                    {...register('prepTime', { valueAsNumber: true })}
                    placeholder="e.g., 30"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="bakeTime">Bake Time (min)</Label>
                  <Input
                    id="bakeTime"
                    type="number"
                    {...register('bakeTime', { valueAsNumber: true })}
                    placeholder="e.g., 45"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="totalTime">Total Time (min)</Label>
                  <Input
                    id="totalTime"
                    type="number"
                    {...register('totalTime', { valueAsNumber: true })}
                    placeholder="e.g., 75"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={watch('difficulty') || ''}
                    onValueChange={value => setValue('difficulty', value as RecipeDifficulty)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EASY">Easy</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HARD">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="temperatureCelsius">Temperature (°C)</Label>
                  <Input
                    id="temperatureCelsius"
                    type="number"
                    {...register('temperatureCelsius', { valueAsNumber: true })}
                    placeholder="e.g., 175"
                    disabled={isSubmitting}
                  />
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
                  <Label htmlFor="producesVariantId">Produces Variant</Label>
                  <ProductVariantsSelect
                    value={watch('producesVariantId') || ''}
                    onValueChange={value => setValue('producesVariantId', value)}
                    productType="FINISHED_GOOD"
                    placeholder="Select the product variant"
                    showLocationInfo={false}
                  />
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
              </div>

              {/* Ingredient Management */}
              <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
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
                      const currentIng = watchIngredients?.[index];
                      const ingSystemUnitId = currentIng?.systemUnitId;
                      const ingOrgUnitId = currentIng?.orgUnitId;
                      const ingUnitValue = ingSystemUnitId || ingOrgUnitId;

                      const ingErrorMessage =
                        !ingSystemUnitId && !ingOrgUnitId && errors.ingredients?.[index]?.root?.message
                          ? errors.ingredients[index].root.message
                          : errors.ingredients?.[index]?.systemUnitId?.message ||
                            errors.ingredients?.[index]?.orgUnitId?.message ||
                            undefined;

                      return (
                        <div key={field.id} className="grid grid-cols-[1fr_100px_120px_50px] gap-2 items-start">
                          <div>
                            <Select
                              value={currentIng?.ingredientVariantId || ''}
                              onValueChange={value => setValue(`ingredients.${index}.ingredientVariantId`, value)}
                              disabled={isSubmitting}
                            >
                              <SelectTrigger
                                className={errors.ingredients?.[index]?.ingredientVariantId ? 'border-destructive' : ''}
                              >
                                <SelectValue placeholder="Select ingredient" />
                              </SelectTrigger>
                              <SelectContent>
                                {ingredients.map(ing => (
                                  <SelectItem key={ing.id} value={ing.id}>
                                    {ing.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.ingredients?.[index]?.ingredientVariantId && (
                              <p className="text-xs text-destructive mt-1">
                                {errors.ingredients[index]?.ingredientVariantId?.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <Input
                              type="number"
                              step="0.01"
                              min="0.01"
                              {...register(`ingredients.${index}.quantity`, {
                                valueAsNumber: true,
                              })}
                              placeholder="Qty"
                              disabled={isSubmitting}
                              className={errors.ingredients?.[index]?.quantity ? 'border-destructive' : ''}
                            />
                            {errors.ingredients?.[index]?.quantity && (
                              <p className="text-xs text-destructive mt-1">
                                {errors.ingredients[index]?.quantity?.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <AdvancedUnitSelector
                              systemUnits={systemUnits}
                              orgUnits={orgUnits}
                              value={ingUnitValue || undefined}
                              onValueChange={handleIngredientUnitChange(index)}
                              disabled={isSubmitting}
                              placeholder="Unit"
                              className={ingErrorMessage ? 'border-destructive' : ''}
                            />
                            {ingErrorMessage && <p className="text-xs text-destructive mt-1">{ingErrorMessage}</p>}
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
                        </div>
                      );
                    })}

                    {ingredientFields.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No ingredients added yet</p>
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

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" disabled={isSubmitting}>
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default memo(CreateEditRecipeDialog);
