'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover';
import { Template } from '@/types/bakery';
import { Trash2, Clock, FileText, BookOpen, Layers, Shield } from 'lucide-react';
import { AdvancedUnitSelector } from '@/components/common/units/advance-select';
import { Switch } from '@workspace/ui/components/switch';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { TemplateFormData, templateSchema, updateTemplateSchema } from '@/lib/bakery-validation';
import { useCreateTemplate, useRecipes, useUpdateTemplate } from '@/hooks/bakery';
import { Badge } from '@workspace/ui/components/badge';
import { useDeleteConfirmation } from '@/lib/providers/delete-modal';
import { useUnits } from '@/lib/units/hooks';

interface CreateEditTemplateProps {
  template?: Template | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (templateId: string) => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
] as const;

export function CreateEditTemplate({ template, isOpen, onOpenChange, onDelete }: CreateEditTemplateProps) {
  const { mutateAsync: createTemplate, isPending: creatingTemplate } = useCreateTemplate();
  const { mutateAsync: updateTemplate, isPending: updatingTemplate } = useUpdateTemplate();
  const { confirmDelete } = useDeleteConfirmation();
  const { data: recipes = [], isLoading, error } = useRecipes();
  const { systemUnits, orgUnits:organizationUnits } = useUnits();
  const isEditing = !!template;

  // Use the appropriate schema based on whether we're editing or creating
  const currentSchema = isEditing ? updateTemplateSchema : templateSchema;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TemplateFormData>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      name: template?.name || '',
      recipeId: template?.recipeId || '',
      quantity: template?.quantity || 1,
      systemUnitId: undefined,
      orgUnitId: undefined,
      recipeMultiplier: template?.recipeMultiplier || 1.0,
      duration: template?.duration || undefined,
      procedure: template?.procedure || '',
      notes: template?.notes || '',
      isActive: template?.isActive ?? true,
      scheduleTime: template?.scheduleTime || '',
      scheduleDays: template?.scheduleDays || [],
      shelfLifeDays: template?.shelfLifeDays || undefined,
    },
  });

  const watchedSystemUnitId = watch('systemUnitId');
  const watchedOrgUnitId = watch('orgUnitId');
  const unitValue = watchedSystemUnitId || watchedOrgUnitId;
  const unitErrorMessage =
    !watchedSystemUnitId && !watchedOrgUnitId && errors.root?.message
      ? errors.root.message
      : errors.systemUnitId?.message || errors.orgUnitId?.message || undefined;

  const handleUnitChange = (value: string, type: 'system' | 'org') => {
    const options = { shouldDirty: true, shouldValidate: true };
    setValue('systemUnitId', type === 'system' ? value : undefined, options);
    setValue('orgUnitId', type === 'org' ? value : undefined, options);
  };

  const handleFormSubmit = async (data: TemplateFormData) => {
    try {
      if (isEditing && template) {
        await updateTemplate({ templateId: template.id, data });
      } else {
        await createTemplate(data);
        if (!isEditing) {
          reset();
        }
      }
      onOpenChange(false);
    } catch (error) {
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
        quantity: template?.quantity || 1,
        systemUnitId: template?.systemUnitId || undefined,
        orgUnitId: template?.orgUnitId || template?.unitId || undefined,
        recipeMultiplier: template?.recipeMultiplier || 1.0,
        duration: template?.duration || undefined,
        procedure: template?.procedure || '',
        notes: template?.notes || '',
        isActive: template?.isActive ?? true,
        scheduleTime: template?.scheduleTime || '',
        scheduleDays: template?.scheduleDays || [],
        shelfLifeDays: template?.shelfLifeDays || undefined,
      });
    }
    onOpenChange(open);
  };

  const toggleScheduleDay = (dayValue: number) => {
    const currentDays = watch('scheduleDays') || [];
    const dayIndex = currentDays.indexOf(dayValue);

    let newDays;
    if (dayIndex > -1) {
      newDays = currentDays.filter(d => d !== dayValue);
    } else {
      newDays = [...currentDays, dayValue];
    }

    setValue('scheduleDays', newDays, { shouldValidate: true });
  };

  const isDaySelected = (dayValue: number) => {
    const currentDays = watch('scheduleDays') || [];
    return currentDays.includes(dayValue);
  };

  const isMutationPending = creatingTemplate || updatingTemplate;
  const isFormSubmitting = isSubmitting || isMutationPending;

  const selectedDaysCount = watch('scheduleDays')?.length || 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] sm:max-w-2xl overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Layers className="h-5 w-5" />
            {isEditing ? 'Edit Template' : 'Create New Template'}
          </DialogTitle>
          <DialogDescription className="text-base">
            {isEditing ? 'Update your template details' : 'Create a reusable template from an existing recipe'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 pt-2">
          {/* Template Basics Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b">
              <BookOpen className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold text-sm text-gray-700">Template Basics</h3>
            </div>

            {/* Template Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Template Name {!isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="name"
                placeholder="e.g., Daily Bread Batch, Weekend Pastries"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
                disabled={isFormSubmitting}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Base Recipe */}
            <div className="space-y-2">
              <Label htmlFor="recipeId" className="text-sm font-medium">
                Base Recipe {!isEditing && <span className="text-red-500">*</span>}
              </Label>
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
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex items-center space-x-2 px-2 py-1.5 text-sm">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))
                  ) : error ? (
                    <div className="px-2 py-1.5 text-sm text-red-500">Failed to load recipes</div>
                  ) : (
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

            {/* Quantity and Unit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Default Quantity {!isEditing && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register('quantity', { valueAsNumber: true })}
                  className={errors.quantity ? 'border-red-500' : ''}
                  disabled={isFormSubmitting}
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Unit {!isEditing && <span className="text-red-500">*</span>}
                </Label>
                <AdvancedUnitSelector
                  systemUnits={systemUnits}
                  organizationUnits={organizationUnits}
                  value={unitValue || undefined}
                  onValueChange={handleUnitChange}
                  disabled={isFormSubmitting}
                  placeholder="Select Unit"
                  className={unitErrorMessage ? 'border-red-500' : ''}
                />
                {unitErrorMessage && <p className="text-red-500 text-sm mt-1">{unitErrorMessage}</p>}
              </div>
            </div>

            {/* Recipe Multiplier */}
            <div className="space-y-2">
              <Label htmlFor="recipeMultiplier" className="text-sm font-medium">
                Recipe Multiplier
              </Label>
              <Input
                id="recipeMultiplier"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="1.0"
                {...register('recipeMultiplier', { valueAsNumber: true })}
                className={errors.recipeMultiplier ? 'border-red-500' : ''}
                disabled={isFormSubmitting}
              />
              {errors.recipeMultiplier && (
                <p className="text-red-500 text-sm mt-1">{errors.recipeMultiplier.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Scale the recipe ingredients (e.g., 2.0 for double batch, 0.5 for half batch)
              </p>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Clock className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold text-sm text-gray-700">Schedule Settings</h3>
              <span className="text-xs text-gray-500 ml-auto">Optional</span>
            </div>

            {/* Schedule Time */}
            <div className="space-y-2">
              <Label htmlFor="scheduleTime" className="text-sm font-medium">
                Scheduled Time
              </Label>
              <div className="relative max-w-xs">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="scheduleTime"
                  type="time"
                  placeholder="HH:MM"
                  {...register('scheduleTime')}
                  className={errors.scheduleTime ? 'border-red-500 pl-10' : 'pl-10'}
                  disabled={isFormSubmitting}
                />
              </div>
              {errors.scheduleTime && <p className="text-red-500 text-sm mt-1">{errors.scheduleTime.message}</p>}
              <p className="text-xs text-gray-500">Time when this template should be scheduled (e.g., 08:00, 14:30)</p>
            </div>

            {/* Schedule Days */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="scheduleDays" className="text-sm font-medium">
                  Recurring Days
                </Label>
                {selectedDaysCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedDaysCount} day{selectedDaysCount !== 1 ? 's' : ''} selected
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {DAYS_OF_WEEK.map(day => (
                  <div key={day.value} className="flex flex-col items-center space-y-1">
                    <Checkbox
                      id={`day-${day.value}`}
                      checked={isDaySelected(day.value)}
                      onCheckedChange={() => toggleScheduleDay(day.value)}
                      disabled={isFormSubmitting}
                      className="h-8 w-8 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                    />
                    <Label htmlFor={`day-${day.value}`} className="text-xs font-normal cursor-pointer text-center">
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.scheduleDays && <p className="text-red-500 text-sm mt-1">{errors.scheduleDays.message}</p>}
              <p className="text-xs text-gray-500">
                Select days for recurring schedules (leave empty for one-time schedules)
              </p>
            </div>
          </div>

          {/* Production Details Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b">
              <FileText className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold text-sm text-gray-700">Production Details</h3>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Expected Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                placeholder="e.g., 240 for 4 hours, 150 for 2.5 hours"
                {...register('duration', { valueAsNumber: true })}
                className={errors.duration ? 'border-red-500' : ''}
                disabled={isFormSubmitting}
              />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
              <p className="text-xs text-gray-500">Estimated time in minutes to complete this production run</p>
            </div>

            {/* Shelf Life */}
            <div className="space-y-2">
              <Label htmlFor="shelfLifeDays" className="text-sm font-medium">
                Shelf Life (Days)
              </Label>
              <div className="relative max-w-xs">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="shelfLifeDays"
                  type="number"
                  min="1"
                  placeholder="e.g., 3, 7, 30"
                  {...register('shelfLifeDays', { valueAsNumber: true })}
                  className={errors.shelfLifeDays ? 'border-red-500 pl-10' : 'pl-10'}
                  disabled={isFormSubmitting}
                />
              </div>
              {errors.shelfLifeDays && <p className="text-red-500 text-sm mt-1">{errors.shelfLifeDays.message}</p>}
              <p className="text-xs text-gray-500">Number of days the finished product remains fresh</p>
            </div>

            {/* Procedure */}
            <div className="space-y-2">
              <Label htmlFor="procedure" className="text-sm font-medium">
                Standard Procedure
              </Label>
              <Textarea
                id="procedure"
                placeholder="Step-by-step production procedure for this template..."
                rows={4}
                {...register('procedure')}
                disabled={isFormSubmitting}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">Standardized steps to follow when using this template</p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Additional Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Special instructions, quality checks, or important reminders..."
                rows={3}
                {...register('notes')}
                disabled={isFormSubmitting}
                className="resize-none"
              />
            </div>
          </div>

          {/* Template Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div className="space-y-1">
              <Label htmlFor="isActive" className="text-sm font-medium">
                Template Status
              </Label>
              <p className="text-xs text-gray-500">
                {watch('isActive') ? 'Active templates can be used in production' : 'Inactive templates are archived'}
              </p>
            </div>
            <Switch
              id="isActive"
              checked={watch('isActive')}
              onCheckedChange={checked => setValue('isActive', checked)}
              disabled={isFormSubmitting}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              {isEditing && onDelete && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isFormSubmitting}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Template
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogOpenChange(false)}
                disabled={isFormSubmitting}
                className="min-w-24"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isFormSubmitting} className="min-w-24 bg-gray-900 hover:bg-gray-800">
                {isFormSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEditing ? 'Saving...' : 'Creating...'}
                  </>
                ) : isEditing ? (
                  'Save Changes'
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
