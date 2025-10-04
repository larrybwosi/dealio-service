import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CartAddOn {
  name: string;
  price: number;
  description?: string;
}

export interface CartItem {
  id?: string;
  productId: string;
  productName: string;
  quantity: number;
  variantName?: string;
  variantPrice: number;
  addOns: CartAddOn[];
  productImage?: string;
}

export interface LoyaltyConfig {
  productId: string;
  pointsPerItem: number;
  bonusThreshold?: number;
  bonusPoints?: number;
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const { toast } = useToast();

  const fetchCartItems = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*');

      if (error) throw error;

      const cartItems: CartItem[] = data?.map(item => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_id, // We'll map this properly
        quantity: item.quantity,
        variantName: item.variant_name,
        variantPrice: Number(item.variant_price),
        addOns: (item.add_ons as unknown as CartAddOn[]) || []
      })) || [];

      setItems(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLoyaltyPoints = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const { data } = await supabase
        .from('user_loyalty_points')
        .select('total_points')
        .eq('user_id', session.user.id)
        .maybeSingle();

      setLoyaltyPoints(data?.total_points || 0);
    } catch (error) {
      console.error('Error fetching loyalty points:', error);
    }
  }, []);

  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: session.user.id,
          product_id: item.productId,
          quantity: item.quantity,
          variant_name: item.variantName,
          variant_price: item.variantPrice,
          add_ons: item.addOns as unknown as any
        });

      if (error) throw error;

      await fetchCartItems();
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeItem(itemId);
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;
      await fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update item quantity",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      await fetchCartItems();
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', session.user.id);

      if (error) throw error;
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => {
      const itemPrice = item.variantPrice;
      const addOnsPrice = item.addOns.reduce((sum, addon) => sum + addon.price, 0);
      return total + (itemPrice + addOnsPrice) * item.quantity;
    }, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  useEffect(() => {
    fetchCartItems();
    fetchLoyaltyPoints();
  }, [fetchCartItems, fetchLoyaltyPoints]);

  return {
    items,
    loading,
    loyaltyPoints,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getCartTotal,
    getItemCount,
    refreshCart: fetchCartItems,
  };
};