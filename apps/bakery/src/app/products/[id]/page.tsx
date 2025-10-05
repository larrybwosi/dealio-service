"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Clock,
  Heart,
  Gift,
  Check,
  Info,
  ChefHat,
  Leaf,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/componentscard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/componentstabs";
import { Separator } from "@workspace/ui/componentsseparator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AddOnsSelector } from "@/components/AddOnsSelector";
import { ProductReviews } from "@/components/ProductReviews";
import { useCart, CartAddOn } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Markdown from "markdown-to-jsx";

interface ProductVariant {
  name: string;
  price: string;
  description: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  price: string;
  image: string;
  rating: number;
  popular: boolean;
  prepTime: string;
  ingredients: string[];
  nutritional: {
    calories: string;
    fat: string;
    carbs: string;
    protein: string;
  };
  allergens: string[];
  variants: ProductVariant[];
}

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [selectedAddOns, setSelectedAddOns] = useState<CartAddOn[]>([]);
  const [loyaltyConfig, setLoyaltyConfig] = useState<{
    pointsPerItem: number;
    bonusThreshold?: number;
    bonusPoints?: number;
  } | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mobile header visibility state
  const [showMobileHeader, setShowMobileHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const products: Product[] = [
    {
      id: "1",
      name: "Artisan Croissants",
      description:
        "Buttery, flaky croissants baked fresh every morning. Our signature croissants are made with French butter and folded to perfection, creating 81 delicate layers.",
      fullDescription: `## The Art of Perfection

Our **artisan croissants** are crafted using traditional French techniques passed down through generations. We start early each morning, carefully laminating the dough with premium European butter to create those iconic flaky layers.

### What Makes Ours Special

- **81 Delicate Layers** - Hand-folded to perfection
- **Premium French Butter** - Rich, creamy taste in every bite
- **Fresh Daily** - Baked every morning before sunrise
- **Traditional Methods** - Time-honored techniques for authentic flavor

### Available Varieties

Choose from our carefully curated selection:

**Classic Butter** - The timeless original with pure butter flavor

**Almond Delight** - Topped with sliced almonds and filled with silky pastry cream

**Belgian Chocolate** - Featuring rich dark chocolate from Belgium's finest chocolatiers

> "Each croissant is a testament to the baker's craft, where patience and precision create morning magic."`,
      price: "From Ksh 350",
      image: "/bread-shelves.jpg",
      rating: 5,
      popular: true,
      prepTime: "15 minutes",
      ingredients: [
        "French butter",
        "Premium flour",
        "Fresh eggs",
        "Sea salt",
        "Belgian chocolate (chocolate variant)",
        "Almonds (almond variant)",
      ],
      nutritional: {
        calories: "280",
        fat: "18g",
        carbs: "24g",
        protein: "6g",
      },
      allergens: ["Gluten", "Dairy", "Eggs", "Tree Nuts (almond variant)"],
      variants: [
        {
          name: "Classic Butter",
          price: "Ksh 350",
          description: "Traditional French recipe",
        },
        {
          name: "Almond",
          price: "Ksh 425",
          description: "With pastry cream & almonds",
        },
        {
          name: "Chocolate",
          price: "Ksh 400",
          description: "Belgian dark chocolate",
        },
      ],
    },
    {
      id: "2",
      name: "Sourdough Bread",
      description:
        "Traditional sourdough with a perfect crust and tangy flavor. Made from our 100-year-old starter.",
      fullDescription: `## A Century of Flavor

Our **sourdough bread** is made using our treasured **100-year-old starter**, carefully maintained and fed daily by our master bakers.

### The Slow Food Philosophy

The secret to exceptional sourdough lies in patience:

- **72-Hour Fermentation** - Slow rise develops complex flavors
- **Wild Yeast Culture** - Natural fermentation for authentic taste
- **Stone-Baked** - Traditional ovens for the perfect crust
- **Hand-Shaped** - Each loaf is individually crafted

### Health Benefits

Sourdough offers unique nutritional advantages:

1. **Easier to Digest** - Fermentation breaks down gluten
2. **Lower Glycemic Index** - Better blood sugar control
3. **Rich in Probiotics** - Supports gut health
4. **Enhanced Mineral Absorption** - Naturally occurring acids help nutrient uptake

> "Our starter has witnessed a century of baking, and every loaf carries that legacy."`,
      price: "Ksh 800",
      image: "/pastries-display.jpg",
      rating: 5,
      popular: true,
      prepTime: "72 hours",
      ingredients: [
        "100-year-old sourdough starter",
        "Organic bread flour",
        "Sea salt",
        "Filtered water",
      ],
      nutritional: {
        calories: "120 per slice",
        fat: "1g",
        carbs: "24g",
        protein: "4g",
      },
      allergens: ["Gluten"],
      variants: [
        {
          name: "Regular Loaf",
          price: "Ksh 800",
          description: "Classic sourdough",
        },
        {
          name: "Whole Grain",
          price: "Ksh 950",
          description: "With ancient grains",
        },
      ],
    },
    {
      id: "3",
      name: "Danish Pastries",
      description:
        "Delicate pastries filled with seasonal fruits, cream cheese, or premium chocolate.",
      fullDescription: `## Scandinavian Excellence

Our **Danish pastries** showcase the art of laminated dough, combining flaky layers with luxurious fillings.

### Seasonal Selections

We rotate our fillings based on what's fresh and in season:

#### Spring & Summer
- Fresh berry medley with vanilla cream
- Stone fruit compote with almond frangipane
- Lemon curd with meringue

#### Fall & Winter
- Spiced apple with cinnamon
- Rich chocolate ganache
- Caramel pecan with sea salt

### Craftsmanship

Each pastry requires:

- **Multiple Folds** - Creating delicate, flaky layers
- **Precise Temperature Control** - Keeping butter at optimal consistency  
- **Artistic Shaping** - Traditional Danish forms
- **Fresh Fillings** - Made in-house daily

> "Where French technique meets Scandinavian tradition, magic happens."`,
      price: "From Ksh 425",
      image: "/bread-shelves.jpg",
      rating: 4.8,
      popular: false,
      prepTime: "20 minutes",
      ingredients: [
        "Laminated pastry dough",
        "Seasonal fruits",
        "Cream cheese",
        "Belgian chocolate",
        "Vanilla bean",
        "Fresh berries",
      ],
      nutritional: {
        calories: "320",
        fat: "16g",
        carbs: "38g",
        protein: "7g",
      },
      allergens: ["Gluten", "Dairy", "Eggs"],
      variants: [
        {
          name: "Berry Danish",
          price: "Ksh 425",
          description: "Seasonal berry filling",
        },
        {
          name: "Cream Cheese",
          price: "Ksh 450",
          description: "Classic cream cheese",
        },
        {
          name: "Chocolate",
          price: "Ksh 475",
          description: "Belgian chocolate ganache",
        },
      ],
    },
    {
      id: "4",
      name: "Artisan Baguettes",
      description:
        "Crusty French baguettes with an airy interior, perfect for sandwiches or alongside dinner.",
      fullDescription: `## Simplicity Perfected

Our traditional **French baguettes** prove that great bread needs only four ingredients: flour, water, salt, and yeast.

### The French Way

Authentic baguette-making is both art and science:

- **Long Fermentation** - 18-24 hours for flavor development
- **High Hydration Dough** - Creates the characteristic open crumb
- **Steam Injection** - Essential for that crackling crust
- **Precise Scoring** - Traditional patterns for optimal rise

### Perfect Pairings

Baguettes are incredibly versatile:

**Breakfast** - With butter and jam, or sliced for tartines

**Lunch** - The foundation of authentic French sandwiches

**Dinner** - Companion to soups, salads, and cheese plates

**Appetizers** - Sliced for crostini and bruschetta

### Storage Tips

For best results:
1. Keep in paper bag at room temperature
2. Consume within 24 hours for optimal freshness
3. Refresh in oven at 180°C for 5 minutes
4. Never refrigerate - it accelerates staling

> "Four ingredients, infinite possibilities."`,
      price: "Ksh 450",
      image:
        "https://media.istockphoto.com/id/2170880572/photo/baker-holding-fresh-artisan-bread-in-paper-bag.webp?a=1&b=1&s=612x612&w=0&k=20&c=YDXLV_y4VpHNWu9Az5o9fHZsm57GGXjY_zbqLf-vw7U=",
      rating: 4.9,
      popular: true,
      prepTime: "24 hours",
      ingredients: [
        "French bread flour",
        "Sea salt",
        "Active dry yeast",
        "Filtered water",
      ],
      nutritional: {
        calories: "180 per serving",
        fat: "1g",
        carbs: "36g",
        protein: "6g",
      },
      allergens: ["Gluten"],
      variants: [
        {
          name: "Traditional",
          price: "Ksh 450",
          description: "Classic French style",
        },
        { name: "Seeded", price: "Ksh 500", description: "With mixed seeds" },
      ],
    },
  ];

  const product = products.find((p) => p.id === id);

  // Scroll detection for mobile header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 100;

      if (window.innerWidth >= 768) return;

      if (currentScrollY < 50) {
        setShowMobileHeader(true);
      } else if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
        if (currentScrollY > lastScrollY) {
          setShowMobileHeader(false);
        } else {
          setShowMobileHeader(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    const throttledHandleScroll = throttle(handleScroll, 100);
    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [lastScrollY]);

  function throttle(func: Function, limit: number) {
    let inThrottle: boolean;
    return function (this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  useEffect(() => {
    if (!id) return;

    const fetchLoyaltyConfig = async () => {
      try {
        const { data } = await supabase
          .from("loyalty_points_config")
          .select("*")
          .eq("product_id", id)
          .maybeSingle();

        if (data) {
          setLoyaltyConfig({
            pointsPerItem: data.points_per_item!,
            bonusThreshold: data.bonus_threshold!,
            bonusPoints: data.bonus_points!,
          });
        }
      } catch (error) {
        console.error("Error fetching loyalty config:", error);
      }
    };

    fetchLoyaltyConfig();
  }, [id]);

  useEffect(() => {
    if (product && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;

    setIsAdding(true);

    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    const success = await addToCart({
      productId: product.id,
      productName: product.name,
      quantity: 1,
      variantName: selectedVariant.name,
      variantPrice: parseFloat(
        selectedVariant.price.replace("Ksh ", "").replace("$", "")
      ),
      addOns: selectedAddOns,
      productImage: product.image,
    });

    if (success) {
      setSelectedAddOns([]);
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    }
    setIsAdding(false);
  };

  const getTotalPrice = () => {
    if (!selectedVariant) return 0;
    const variantPrice = parseFloat(
      selectedVariant.price.replace("Ksh ", "").replace("$", "")
    );
    const addOnsPrice = selectedAddOns.reduce(
      (sum, addon) => sum + addon.price,
      0
    );
    return variantPrice + addOnsPrice;
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (navigator.vibrate) {
      navigator.vibrate(isFavorite ? 30 : [50, 30]);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">
            Product Not Found
          </h1>
          <Button onClick={() => router.push("/")} variant="hero">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 md:pt-20">
        {/* Mobile header */}
        <div
          className={`fixed top-16 left-0 right-0 z-40 bg-background/98 backdrop-blur-xl border-b border-border/50 md:hidden transition-transform duration-300 ease-in-out shadow-sm ${
            showMobileHeader ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate(30);
                router.push("/");
              }}
              className="p-2 -ml-2 min-h-11 min-w-11 rounded-full active:scale-95 transition-transform"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-display font-semibold text-base text-foreground truncate px-4 max-w-[60%]">
              {product.name}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              className={`p-2 -mr-2 min-h-11 min-w-11 rounded-full active:scale-95 transition-all ${
                isFavorite ? "text-red-500" : ""
              }`}
              onClick={toggleFavorite}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
              />
            </Button>
          </div>
        </div>

        <div className="h-16 md:hidden" />

        {/* Desktop back button */}
        <div className="hidden md:block bg-muted/30 border-b border-border/50">
          <div className="container mx-auto px-4 py-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="hover:bg-background/80"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Menu
            </Button>
          </div>
        </div>

        {/* Product Hero Section */}
        <section className="container mx-auto px-4 py-6 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">
            {/* Product Image - Takes 3 columns on large screens */}
            <div className="lg:col-span-3">
              <div className="sticky top-24">
                <div className="relative aspect-4/3 lg:aspect-square overflow-hidden rounded-2xl shadow-2xl bg-muted border border-border/50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={800}
                    height={800}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {product.popular && (
                      <Badge className="bg-secondary text-secondary-foreground shadow-lg backdrop-blur-sm">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Popular
                      </Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className="bg-background/90 backdrop-blur-sm shadow-lg"
                    >
                      <ChefHat className="h-3 w-3 mr-1" />
                      Artisan Made
                    </Badge>
                  </div>
                  <button
                    onClick={toggleFavorite}
                    className={`absolute top-4 right-4 p-3 rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:scale-110 active:scale-95 transition-all ${
                      isFavorite
                        ? "text-red-500"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Info - Takes 2 columns on large screens */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground leading-tight mb-3">
                    {product.name}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? "text-amber-500 fill-amber-500"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {product.rating} / 5.0
                      </span>
                    </div>
                    <Separator orientation="vertical" className="h-5" />
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {product.prepTime}
                      </span>
                    </div>
                  </div>

                  <div className="text-3xl font-bold text-primary mb-4">
                    {product.price}
                  </div>
                </div>

                <p className="text-base text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              <Separator />

              {/* Variants */}
              <div className="space-y-4">
                <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
                  <span>Select Your Option</span>
                  <Badge variant="outline" className="ml-auto">
                    Required
                  </Badge>
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(30);
                        setSelectedVariant(variant);
                      }}
                      className={`group relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left active:scale-[0.98] ${
                        selectedVariant?.name === variant.name
                          ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
                          : "border-border bg-card hover:bg-muted/50 hover:border-muted-foreground/30 active:bg-muted/70"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedVariant?.name === variant.name
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30 group-hover:border-muted-foreground/50"
                        }`}
                      >
                        {selectedVariant?.name === variant.name && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="font-semibold text-foreground mb-1">
                              {variant.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {variant.description}
                            </div>
                          </div>
                          <div className="text-lg font-bold text-primary whitespace-nowrap">
                            {variant.price}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Add-ons */}
              <AddOnsSelector
                productId={product.id}
                selectedAddOns={selectedAddOns}
                onAddOnsChange={setSelectedAddOns}
              />

              {/* Loyalty Points */}
              {loyaltyConfig && (
                <>
                  <Separator />
                  <Card className="border-2 border-secondary/30 bg-gradient-to-br from-secondary/5 to-secondary/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Gift className="h-5 w-5 text-secondary" />
                        Loyalty Rewards
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-background/60 rounded-lg">
                        <span className="text-sm text-muted-foreground">
                          Earn per item:
                        </span>
                        <span className="font-bold text-secondary text-lg">
                          {loyaltyConfig.pointsPerItem} points
                        </span>
                      </div>
                      {loyaltyConfig.bonusThreshold &&
                        loyaltyConfig.bonusPoints && (
                          <div className="flex items-center justify-between p-3 bg-background/60 rounded-lg">
                            <span className="text-sm text-muted-foreground">
                              Buy {loyaltyConfig.bonusThreshold}+ items:
                            </span>
                            <span className="font-bold text-secondary text-lg">
                              +{loyaltyConfig.bonusPoints} bonus!
                            </span>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                </>
              )}

              <Separator />

              {/* Price Summary */}
              <Card className="border-2 shadow-lg">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {selectedVariant && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          {selectedVariant.name}
                        </span>
                        <span className="font-semibold">
                          {selectedVariant.price}
                        </span>
                      </div>
                    )}
                    {selectedAddOns.map((addon, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-muted-foreground">
                          + {addon.name}
                        </span>
                        <span className="font-medium">
                          Ksh {addon.price.toFixed(0)}
                        </span>
                      </div>
                    ))}
                    {(selectedAddOns.length > 0 || selectedVariant) && (
                      <Separator className="my-3" />
                    )}
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        Ksh {getTotalPrice().toFixed(0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 sticky bottom-4 z-10">
                <Button
                  size="lg"
                  variant="hero"
                  className="flex-1 min-h-14 text-base font-semibold active:scale-[0.98] transition-transform shadow-xl hover:shadow-2xl"
                  onClick={handleAddToCart}
                  disabled={isAdding || !selectedVariant}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isAdding ? "Adding to Cart..." : "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details Tabs */}
        <section className="bg-muted/30 py-12 border-t border-border/50">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start mb-8 bg-background/50 p-1 h-auto flex-wrap">
                <TabsTrigger
                  value="description"
                  className="px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="nutrition"
                  className="px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Nutrition
                </TabsTrigger>
                <TabsTrigger
                  value="ingredients"
                  className="px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Ingredients
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6 md:p-8">
                        <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-strong:font-semibold prose-ul:my-4 prose-li:text-muted-foreground prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground">
                          <Markdown>{product.fullDescription}</Markdown>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    {/* Quick Facts */}
                    <Card className="border-0 shadow-lg overflow-hidden">
                      <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5 pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Info className="h-5 w-5 text-primary" />
                          Quick Facts
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <ChefHat className="h-4 w-4" />
                            Style
                          </span>
                          <span className="font-semibold text-foreground">
                            Artisan
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center py-2">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Prep Time
                          </span>
                          <span className="font-semibold text-foreground">
                            {product.prepTime}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center py-2">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            Rating
                          </span>
                          <span className="font-semibold text-foreground">
                            {product.rating} / 5.0
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Allergen Information */}
                    <Card className="border-0 shadow-lg overflow-hidden border-l-4 border-l-amber-500">
                      <CardHeader className="bg-amber-500/5 pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Info className="h-5 w-5 text-amber-600" />
                          Allergen Info
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground mb-3">
                          This product contains:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {product.allergens?.map((allergen, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                            >
                              {allergen}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="nutrition" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-br from-green-500/10 to-green-500/5">
                      <CardTitle className="flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-green-600" />
                        Nutritional Information
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Per serving
                      </p>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {Object.entries(product.nutritional).map(
                          ([key, value]) => (
                            <div key={key} className="group">
                              <div className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors">
                                <span className="text-foreground capitalize font-medium">
                                  {key}
                                </span>
                                <span className="font-bold text-foreground text-lg">
                                  {value}
                                </span>
                              </div>
                              <Separator className="last:hidden" />
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-6">
                    <Card className="border-0 shadow-lg overflow-hidden">
                      <CardHeader className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                        <CardTitle className="text-lg">
                          Health Benefits
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <ul className="space-y-3">
                          <li className="flex gap-3">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">
                              Made with natural ingredients
                            </span>
                          </li>
                          <li className="flex gap-3">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">
                              No artificial preservatives
                            </span>
                          </li>
                          <li className="flex gap-3">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">
                              Freshly baked daily
                            </span>
                          </li>
                          <li className="flex gap-3">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">
                              Traditional preparation methods
                            </span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg overflow-hidden border-l-4 border-l-amber-500">
                      <CardHeader className="bg-amber-500/5">
                        <CardTitle className="text-lg">
                          Dietary Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-2 text-sm">
                          <p className="text-muted-foreground">
                            <strong className="text-foreground">
                              Allergens:
                            </strong>{" "}
                            {product.allergens?.join(", ")}
                          </p>
                          <p className="text-muted-foreground mt-3">
                            Please inform our staff of any dietary restrictions
                            or allergies before ordering.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ingredients" className="mt-0">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5">
                    <CardTitle className="flex items-center gap-2">
                      <ChefHat className="h-5 w-5 text-primary" />
                      Premium Ingredients
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      We source only the finest ingredients for our products
                    </p>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {product.ingredients.map((ingredient, index) => (
                        <div
                          key={index}
                          className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all duration-200"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                            <Leaf className="h-5 w-5 text-primary" />
                          </div>
                          <span className="text-foreground font-medium">
                            {ingredient}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-8" />

                    <div className="bg-muted/50 rounded-xl p-6">
                      <h4 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        Our Commitment to Quality
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Every ingredient is carefully selected and sourced from
                        trusted suppliers. We prioritize organic and
                        locally-sourced ingredients whenever possible, ensuring
                        both exceptional taste and sustainability. Our
                        commitment to quality means no artificial colors,
                        flavors, or preservatives in any of our products.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <ProductReviews
                  productId={product.id}
                  productName={product.name}
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Related Products Suggestion */}
        <section className="container mx-auto px-4 py-12">
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12 text-center border border-border/50">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              Love this product?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Explore our full collection of artisan baked goods, each crafted
              with the same dedication to quality and traditional techniques.
            </p>
            <Button
              size="lg"
              variant="hero"
              onClick={() => router.push("/")}
              className="shadow-xl hover:shadow-2xl active:scale-95 transition-all"
            >
              Browse All Products
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Page;
