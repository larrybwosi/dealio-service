import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { ShoppingCart } from 'lucide-react';
import { useFormattedCurrency } from '@/lib/utils';
import { useRestockInventory } from '@/lib/api/inventory';
import { useOrgStore } from '@/lib/tanstack-axios';

interface RestockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIngredient: any;
}

export function RestockDialog({ open, onOpenChange, selectedIngredient }: RestockDialogProps) {
  const [restockForm, setRestockForm] = useState({
    quantity: 0,
    unitPrice: 0,
    supplier: '',
    notes: '',
  });
  
  const locationId = useOrgStore(state => state.locationId)
  const formatCurrency = useFormattedCurrency();
    const { mutateAsync: restockInventory, isPending: isSubmitting } = useRestockInventory();

  const handleRestock = async() => {
    await restockInventory({ productId: selectedIngredient.id, unitQuantity: restockForm.quantity, variantId: selectedIngredient.ingredientId, locationId });
    setRestockForm({ quantity: 0, unitPrice: 0, supplier: '', notes: '' });
    onOpenChange(false);
  };

  const totalCost = restockForm.quantity * restockForm.unitPrice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Restock {selectedIngredient?.name}</DialogTitle>
          <DialogDescription>Add new stock for this ingredient</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={restockForm.quantity}
                onChange={e => setRestockForm({ ...restockForm, quantity: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="unitPrice">Unit Price</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                value={restockForm.unitPrice}
                onChange={e => setRestockForm({ ...restockForm, unitPrice: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="supplier">Supplier</Label>
            <Input
              id="supplier"
              value={restockForm.supplier}
              onChange={e => setRestockForm({ ...restockForm, supplier: e.target.value })}
              placeholder="Enter supplier name"
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={restockForm.notes}
              onChange={e => setRestockForm({ ...restockForm, notes: e.target.value })}
              placeholder="Optional notes"
              rows={2}
            />
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="flex justify-between">
              <span>Total Cost:</span>
              <span className="font-bold">{formatCurrency(totalCost)}</span>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleRestock} className="bg-orange-600 hover:bg-orange-700">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add Stock
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
