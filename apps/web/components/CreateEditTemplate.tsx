'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { Template } from '@/types/bakery';
import { Trash2 } from 'lucide-react';
import { useDeleteConfirmation } from '@/lib/providers/delete-modal';
import { useBakeryCategories } from '@/lib/hooks/use-bakery';
import { UnitSelect } from '../common/unit-select';
import { Switch } from '@workspace/ui/components/switch';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { TemplateFormData, templateSchema } from '@/lib/validations/bakery';
import { useCreateTemplate, useRecipes, useUpdateTemplate } from '@/lib/hooks/use-bakery';

interface CreateEditTemplateProps {
  template?: Template | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (templateId: string) => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
] as const;

export function CreateEditTemplate({ template, isOpen, onOpenChange, onDelete }: CreateEditTemplateProps) {
  const { data: categories, isLoading: loadingCategories } = useBakeryCategories();
  const { mutateAsync: createTemplate, isPending: creatingTemplate } = useCreateTemplate();
  const { mutateAsync: updateTemplate, isPending: updatingTemplate } = useUpdateTemplate();
  const { confirmDelete } = useDeleteConfirmation();
  const { data: recipes = [], isLoading, error } = useRecipes();
  const isEditing = !!template;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: template?.name || '',
      recipeId: template?.recipeId || '',
      categoryId: template?.categoryId || '',
      quantity: template?.quantity || 1,
      unitId: template?.unitId || '',
      duration: template?.duration || '',
      procedure: template?.procedure || '',
      notes: template?.notes || '',
      isActive: template?.isActive ?? true,
      scheduleTime: template?.scheduleTime || '',
      scheduleDays: template?.scheduleDays || [],
    },
  });

  const handleFormSubmit = async (data: TemplateFormData) => {
    try {
      if (isEditing && template) {
        // Update existing template
        await updateTemplate({ templateId: template.id, data });
      } else {
        // Create new template
        await createTemplate(data);
        if (!isEditing) {
          reset();
        }
      }
      onOpenChange(false);
    } catch (error) {
      // Error handling is managed by the mutation hooks
      console.error(`Failed to ${isEditing ? 'update' : 'create'} template:`, error);
    }
  };

  const handleDelete = async () => {
    if (!template || !onDelete) return;

    const confirmed = await confirmDelete({
      entityType: 'template',
      entityName: template.name,
      title: 'Delete Template',
      description: `Are you sure you want to delete the template "${template.name}"? This action cannot be undone.`,
    });

    if (confirmed) {
      onDelete(template.id);
      onOpenChange(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && isEditing) {
      reset({
        name: template?.name || '',
        recipeId: template?.recipeId || '',
        categoryId: template?.categoryId || '',
        quantity: template?.quantity || 1,
        unitId: template?.unitId || '', // Fixed: changed from unit to unitId
        duration: template?.duration || '',
        procedure: template?.procedure || '',
        notes: template?.notes || '',
        isActive: template?.isActive ?? true,
        scheduleTime: template?.scheduleTime || '',
        scheduleDays: template?.scheduleDays || [],
      });
    }
    onOpenChange(open);
  };

  const toggleScheduleDay = (dayValue: number) => {
    const currentDays = watch('scheduleDays') || [];
    const dayIndex = currentDays.indexOf(dayValue);

    let newDays;
    if (dayIndex > -1) {
      // Remove day if already selected
      newDays = currentDays.filter(d => d !== dayValue);
    } else {
      // Add day if not selected
      newDays = [...currentDays, dayValue];
    }

    setValue('scheduleDays', newDays, { shouldValidate: true });
  };

  const isDaySelected = (dayValue: number) => {
    const currentDays = watch('scheduleDays') || [];
    return currentDays.includes(dayValue);
  };

  // Use the appropriate pending state based on whether we're creating or updating
  const isMutationPending = creatingTemplate || updatingTemplate;
  const isFormSubmitting = isSubmitting || isMutationPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] sm:max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Template' : 'Create New Template'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update your template details' : 'Create a reusable template from an existing recipe'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Template Name */}
            <div>
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                placeholder="Enter template name"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
                disabled={isFormSubmitting}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Base Recipe and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipeId">Base Recipe</Label>
                <Select
                  value={watch('recipeId')}
                  onValueChange={value => setValue('recipeId', value)}
                  disabled={isLoading || isFormSubmitting}
                >
                  <SelectTrigger className={errors.recipeId ? 'border-red-500' : ''}>
                    <SelectValue placeholder={isLoading ? 'Loading recipes...' : 'Select recipe'} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      // Loading skeleton state
                      Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex items-center space-x-2 px-2 py-1.5 text-sm">
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                        </div>
                      ))
                    ) : error ? (
                      // Error state
                      <div className="px-2 py-1.5 text-sm text-red-500">Failed to load recipes</div>
                    ) : (
                      // Loaded state
                      recipes.map(recipe => (
                        <SelectItem key={recipe.id} value={recipe.id}>
                          {recipe.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.recipeId && <p className="text-red-500 text-sm mt-1">{errors.recipeId.message}</p>}
              </div>

              <div>
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  value={watch('categoryId')}
                  onValueChange={value => setValue('categoryId', value)}
                  disabled={loadingCategories || isFormSubmitting}
                >
                  <SelectTrigger className={errors.categoryId ? 'border-red-500' : ''}>
                    <SelectValue placeholder={loadingCategories ? 'Loading categories...' : 'Select category'} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
              </div>
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Default Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  {...register('quantity', { valueAsNumber: true })}
                  className={errors.quantity ? 'border-red-500' : ''}
                  disabled={isFormSubmitting}
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
              </div>

              <div>
                <Label htmlFor="unitId">Unit</Label>
                <UnitSelect
                  value={watch('unitId')}
                  onValueChange={value => setValue('unitId', value)}
                  showLabel={false}
                  placeholder="Select Unit"
                  businessType='bakery'
                  disabled={isFormSubmitting}
                />
                {errors.unitId && <p className="text-red-500 text-sm mt-1">{errors.unitId.message}</p>}
              </div>
            </div>

            {/* Schedule Settings */}
            <div className="space-y-4 p-4 border rounded-lg">
              <Label className="text-base font-semibold">Schedule Settings (Optional)</Label>

              {/* Schedule Time */}
              <div>
                <Label htmlFor="scheduleTime">Scheduled Time</Label>
                <Input
                  id="scheduleTime"
                  type="time"
                  placeholder="HH:MM"
                  {...register('scheduleTime')}
                  className={errors.scheduleTime ? 'border-red-500' : ''}
                  disabled={isFormSubmitting}
                />
                {errors.scheduleTime && <p className="text-red-500 text-sm mt-1">{errors.scheduleTime.message}</p>}
                <p className="text-sm text-gray-500 mt-1">
                  Time when this template should be scheduled (e.g., 08:00, 14:30)
                </p>
              </div>

              {/* Schedule Days */}
              <div>
                <Label htmlFor="scheduleDays">Scheduled Days</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {DAYS_OF_WEEK.map(day => (
                    <div key={day.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day.value}`}
                        checked={isDaySelected(day.value)}
                        onCheckedChange={() => toggleScheduleDay(day.value)}
                        disabled={isFormSubmitting}
                      />
                      <Label htmlFor={`day-${day.value}`} className="text-sm font-normal">
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.scheduleDays && <p className="text-red-500 text-sm mt-1">{errors.scheduleDays.message}</p>}
              </div>
            </div>

            {/* Duration */}
            <div>
              <Label htmlFor="duration">Expected Duration</Label>
              <Input id="duration" placeholder="e.g., 4 hours" {...register('duration')} disabled={isFormSubmitting} />
            </div>

            {/* Procedure */}
            <div>
              <Label htmlFor="procedure">Standard Procedure</Label>
              <Textarea
                id="procedure"
                placeholder="Standard production procedure for this template"
                rows={3}
                {...register('procedure')}
                disabled={isFormSubmitting}
              />
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes or special instructions"
                rows={2}
                {...register('notes')}
                disabled={isFormSubmitting}
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={watch('isActive')}
                onCheckedChange={checked => setValue('isActive', checked)}
                disabled={isFormSubmitting}
              />
              <Label htmlFor="isActive" className="text-sm font-normal">
                Active Template
              </Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div>
              {isEditing && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isFormSubmitting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Template
                </Button>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogOpenChange(false)}
                disabled={isFormSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isFormSubmitting}>
                {isFormSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : isEditing ? (
                  'Update Template'
                ) : (
                  'Create Template'
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
