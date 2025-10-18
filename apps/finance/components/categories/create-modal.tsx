'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { Switch } from '@workspace/ui/components/switch';
import { DollarSign, Loader2 } from 'lucide-react';
import { useCreateCategory, useUpdateCategory } from '@/hooks/use-categories';

interface CategoryFormData {
  name: string;
  code: string;
  description: string;
  defaultBudget: string;
  isActive: boolean;
  requiresApproval: boolean;
  color: string;
}

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory?: any | null;
}

const colorOptions = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#84cc16',
  '#f97316',
  '#6366f1',
];

export function CategoryDialog({ open, onOpenChange, editingCategory }: CategoryDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: '',
      code: '',
      description: '',
      defaultBudget: '',
      isActive: true,
      requiresApproval: false,
      color: '#3b82f6',
    },
  });

  const { mutateAsync: createCategory } = useCreateCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();

  const selectedColor = watch('color');

  // Reset form when dialog opens/closes or editing category changes
  useEffect(() => {
    if (open) {
      if (editingCategory) {
        reset({
          name: editingCategory.name || '',
          code: editingCategory.code || '',
          description: editingCategory.description || '',
          defaultBudget: editingCategory.defaultBudget?.toString() || '',
          isActive: editingCategory.isActive ?? true,
          requiresApproval: editingCategory.requiresApproval ?? false,
          color: editingCategory.color || '#3b82f6',
        });
      } else {
        reset({
          name: '',
          code: '',
          description: '',
          defaultBudget: '',
          isActive: true,
          requiresApproval: false,
          color: '#3b82f6',
        });
      }
    }
  }, [open, editingCategory, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    const categoryData = {
      name: data.name,
      code: data.code,
      description: data.description,
      defaultBudget: data.defaultBudget ? parseFloat(data.defaultBudget) : 0,
      isActive: data.isActive,
      requiresApproval: data.requiresApproval,
      color: data.color,
    };

    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory.id, data: categoryData });
      } else {
        await createCategory(categoryData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
          <DialogDescription className="text-xs">
            {editingCategory ? 'Update category details' : 'Add a new expense category to the system'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs">
                  Category Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Office Supplies"
                  className="h-7 text-xs"
                  {...register('name', { required: 'Category name is required' })}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="code" className="text-xs">
                  Category Code *
                </Label>
                <Input
                  id="code"
                  placeholder="e.g., OFF"
                  className="h-7 text-xs"
                  {...register('code', { required: 'Category code is required' })}
                />
                {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="description" className="text-xs">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Brief description of this category..."
                className="text-xs resize-none"
                rows={2}
                {...register('description')}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="defaultBudget" className="text-xs">
                  Default Budget
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1.5 h-3 w-3 text-gray-400" />
                  <Input
                    id="defaultBudget"
                    type="number"
                    placeholder="0.00"
                    className="h-7 text-xs pl-7"
                    step="0.01"
                    min="0"
                    {...register('defaultBudget')}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Color</Label>
                <div className="flex gap-1 flex-wrap">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-6 h-6 rounded border-2 hover:border-gray-400 ${
                        selectedColor === color ? 'border-gray-600' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setValue('color', color)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isActive" className="text-xs font-medium">
                    Active category
                  </Label>
                  <p className="text-xs text-gray-600">Available for new expenses</p>
                </div>
                <Switch
                  id="isActive"
                  checked={watch('isActive')}
                  onCheckedChange={checked => setValue('isActive', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requiresApproval" className="text-xs font-medium">
                    Requires approval
                  </Label>
                  <p className="text-xs text-gray-600">All expenses need manager approval</p>
                </div>
                <Switch
                  id="requiresApproval"
                  checked={watch('requiresApproval')}
                  onCheckedChange={checked => setValue('requiresApproval', checked)}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 h-7 text-xs" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    {editingCategory ? 'Updating...' : 'Creating...'}
                  </>
                ) : editingCategory ? (
                  'Update Category'
                ) : (
                  'Create Category'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-7 text-xs"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
