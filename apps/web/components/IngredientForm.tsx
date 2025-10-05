import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { useCreateRawMaterial } from '@/lib/hooks/raw-materials';
import { CreateRawMaterialInput } from '@/lib/validations/raw-materials';
import { CategorySelect } from '../common/category-select';
import { UnitSelect } from '@/components/common/unit-select';

interface CreateIngredientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateIngredientDialog({ open, onOpenChange }: CreateIngredientDialogProps) {
  const createRawMaterial = useCreateRawMaterial();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateRawMaterialInput & { categoryId: string }>();

  const onSubmit = async (data: CreateRawMaterialInput & { categoryId: string }) => {
    try {
      await createRawMaterial.mutateAsync(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create ingredient:', error);
    }
  };

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const nameValue = watch('name');
  const baseUnitIdValue = watch('baseUnitId');
  const categoryIdValue = watch('categoryId');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Ingredient</DialogTitle>
          <DialogDescription>Add a new ingredient to your inventory</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Ingredient Name *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Ingredient name is required' })}
              onChange={e => setValue('name', e.target.value)}
              placeholder="Enter ingredient name"
              disabled={createRawMaterial.isPending}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buyingPrice">Buying Price</Label>
              <Input
                id="buyingPrice"
                type="number"
                step="0.01"
                min="0"
                {...register('buyingPrice', {
                  valueAsNumber: true,
                  min: { value: 0, message: 'Buying price must be positive' },
                })}
                placeholder="0.00"
                disabled={createRawMaterial.isPending}
              />
              {errors.buyingPrice && <p className="text-xs text-red-500 mt-1">{errors.buyingPrice.message}</p>}
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <CategorySelect
                onValueChange={value => setValue('categoryId', value)}
                value={categoryIdValue}
                placeholder="Select category"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <UnitSelect
              value={baseUnitIdValue}
              onValueChange={value => setValue('baseUnitId', value)}
              disabled={createRawMaterial.isPending}
              label="Ingredient Unit"
              required
              placeholder="Select unit"
              error={errors.baseUnitId?.message}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter ingredient description"
              rows={2}
              disabled={createRawMaterial.isPending}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createRawMaterial.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700"
              disabled={createRawMaterial.isPending || !nameValue || !baseUnitIdValue}
            >
              {createRawMaterial.isPending ? 'Adding...' : 'Add Ingredient'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
