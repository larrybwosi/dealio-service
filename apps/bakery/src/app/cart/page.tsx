'use client'

import { useState, useEffect } from 'react';
import { ArrowLeft, Minus, Plus, Trash2, Star, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import Link from 'next/link';

interface LoyaltyConfig {
  productId: string;
  pointsPerItem: number;
  bonusThreshold?: number;
  bonusPoints?: number;
}

const Page = () => {
  const { items, loading, loyaltyPoints, updateQuantity, removeItem, getCartTotal, getItemCount } = useCart();
  const [loyaltyConfigs, setLoyaltyConfigs] = useState<LoyaltyConfig[]>([]);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll behavior for header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsHeaderVisible(true);
      } 
      // Hide header when scrolling down (with minimum scroll threshold)
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const fetchLoyaltyConfigs = async () => {
      try {
        const { data } = await supabase
          .from('loyalty_points_config')
          .select('*');
        
        if (data) {
          setLoyaltyConfigs(data.map(config => ({
            productId: config.product_id,
            pointsPerItem: config.points_per_item,
            bonusThreshold: config.bonus_threshold,
            bonusPoints: config.bonus_points
          })));
        }
      } catch (error) {
        console.error('Error fetching loyalty configs:', error);
      }
    };

    fetchLoyaltyConfigs();
  }, []);

  const calculateEarnedPoints = () => {
    return items.reduce((total, item) => {
      const config = loyaltyConfigs.find(c => c.productId === item.productId);
      if (!config) return total;

      let points = config.pointsPerItem * item.quantity;
      
      // Check for bonus points
      if (config.bonusThreshold && config.bonusPoints && item.quantity >= config.bonusThreshold) {
        points += config.bonusPoints;
      }
      
      return total + points;
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <Header />
        </div>
        <main className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-muted/30 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <Header />
        </div>
        <main className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center py-12">
              <h1 className="text-3xl font-display font-bold text-foreground mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-muted-foreground mb-8">
                Add some delicious items from our menu to get started.
              </p>
              <Button asChild size="lg" variant="hero">
                <Link href="/">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Browse Menu
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = getCartTotal();
  const earnedPoints = calculateEarnedPoints();

  return (
    <div className="min-h-screen">
      <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <Header />
      </div>
      
      <main className="pt-20 pb-8">
        {/* Mobile header */}
        <div className={`sticky z-40 bg-background/95 backdrop-blur-xs border-b border-border md:hidden transition-all duration-300 ${
          isHeaderVisible ? 'top-16' : 'top-0'
        }`}>
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="p-2 -ml-2 touch-target">
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="font-display font-semibold text-lg text-foreground">
              Cart ({getItemCount()})
            </h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Desktop header */}
            <div className="hidden md:block mb-8">
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Shopping Cart ({getItemCount()} items)
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => {
                  const itemTotal = (item.variantPrice + item.addOns.reduce((sum, addon) => sum + addon.price, 0)) * item.quantity;
                  const config = loyaltyConfigs.find(c => c.productId === item.productId);
                  
                  return (
                    <Card key={`${item.productId}-${item.variantName}`}>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-display font-semibold text-foreground text-lg">
                                  {item.productName}
                                </h3>
                                {item.variantName && (
                                  <p className="text-muted-foreground">
                                    {item.variantName}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => item.id && removeItem(item.id)}
                                className="text-muted-foreground hover:text-destructive shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Add-ons */}
                            {item.addOns.length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm text-muted-foreground mb-1">Add-ons:</p>
                                <div className="flex flex-wrap gap-1">
                                  {item.addOns.map((addon, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {addon.name} (+${addon.price.toFixed(2)})
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Loyalty Points */}
                            {config && (
                              <div className="flex items-center gap-2 mb-3">
                                <Star className="h-4 w-4 text-secondary" />
                                <span className="text-sm text-muted-foreground">
                                  Earn {config.pointsPerItem * item.quantity} points
                                  {config.bonusThreshold && item.quantity >= config.bonusThreshold && (
                                    <span className="text-secondary font-medium">
                                      {" "}+ {config.bonusPoints} bonus!
                                    </span>
                                  )}
                                </span>
                              </div>
                            )}

                            {/* Quantity and Price */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => item.id && updateQuantity(item.id, item.quantity - 1)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="font-medium text-foreground min-w-8 text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => item.id && updateQuantity(item.id, item.quantity + 1)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-foreground">
                                  ${itemTotal.toFixed(2)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  ${(itemTotal / item.quantity).toFixed(2)} each
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className={`sticky transition-all duration-300 ${
                  isHeaderVisible ? 'top-32' : 'top-16'
                }`}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-display">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      
                      <Separator />

                      {/* Loyalty Points Section */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-secondary" />
                          <span className="font-medium text-foreground">Loyalty Points</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Current Balance</span>
                          <span className="font-medium text-secondary">{loyaltyPoints} points</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Will Earn</span>
                          <span className="font-medium text-secondary">+{earnedPoints} points</span>
                        </div>
                        
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-foreground">New Balance</span>
                          <span className="text-secondary">{loyaltyPoints + earnedPoints} points</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>

                      <Button size="lg" variant="hero" className="w-full touch-target">
                        Proceed to Checkout
                      </Button>
                      
                      <Button variant="outline" size="lg" asChild className="w-full touch-target">
                        <Link href="/">Continue Shopping</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;