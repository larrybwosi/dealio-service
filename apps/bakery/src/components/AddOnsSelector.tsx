import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CartAddOn } from '@/hooks/useCart';

interface AddOnsSelectorProps {
  productId: string;
  selectedAddOns: CartAddOn[];
  onAddOnsChange: (addOns: CartAddOn[]) => void;
}

interface ProductAddOn {
  id: string;
  name: string;
  price: number;
  description?: string;
  available: boolean;
}

export const AddOnsSelector = ({ productId, selectedAddOns, onAddOnsChange }: AddOnsSelectorProps) => {
  const [availableAddOns, setAvailableAddOns] = useState<ProductAddOn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddOns = async () => {
      try {
        const { data, error } = await supabase
          .from('product_add_ons')
          .select('*')
          .eq('product_id', productId)
          .eq('available', true);

        if (error) throw error;
        setAvailableAddOns(data || []);
      } catch (error) {
        console.error('Error fetching add-ons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddOns();
  }, [productId]);

  const handleAddOnToggle = (addOn: ProductAddOn, checked: boolean) => {
    if (checked) {
      const newAddOn: CartAddOn = {
        name: addOn.name,
        price: Number(addOn.price),
        description: addOn.description
      };
      onAddOnsChange([...selectedAddOns, newAddOn]);
    } else {
      onAddOnsChange(selectedAddOns.filter(item => item.name !== addOn.name));
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="font-display font-semibold text-foreground">Add-ons</h3>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-muted/30 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (availableAddOns.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="font-display font-semibold text-foreground">
        Add-ons
      </h3>
      <div className="space-y-3">
        {availableAddOns.map((addOn) => {
          const isSelected = selectedAddOns.some(item => item.name === addOn.name);
          return (
            <div 
              key={addOn.id}
              className="flex items-center space-x-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors cursor-pointer touch-target"
              onClick={() => handleAddOnToggle(addOn, !isSelected)}
            >
              <Checkbox
                id={addOn.id}
                checked={isSelected}
                onCheckedChange={(checked) => handleAddOnToggle(addOn, checked as boolean)}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label 
                      htmlFor={addOn.id}
                      className="font-medium text-foreground cursor-pointer"
                    >
                      {addOn.name}
                    </label>
                    {addOn.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {addOn.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary" className="ml-3 shrink-0">
                    +{addOn.price.toFixed(2)}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};