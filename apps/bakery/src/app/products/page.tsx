'use client'

import { useState, useMemo } from "react";
import { Star, Search, Filter, Heart, ShoppingCart, Grid, List } from "lucide-react";
import { Button } from "@workspace/ui/components/button.tsx";
import { Input } from "@workspace/ui/components/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/componentsselect.tsx";
import { Badge } from "@workspace/ui/components/badge.tsx";
import { Card, CardContent } from "@workspace/ui/components/card.tsx";
import Header from "@/components/Header.tsx";
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Expanded product data
  const products = [
    {
      id: "1",
      name: "Artisan Croissants",
      description:
        "Buttery, flaky croissants baked fresh every morning. Available in classic, almond, and chocolate varieties.",
      price: 3.5,
      category: "pastries",
      image:
        "https://images.unsplash.com/photo-1737700089482-e6ce492f712f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEFydGlzYW4lMjBDcm9pc3NhbnRzfGVufDB8fDB8fHww",
      rating: 5,
      popular: true,
      inStock: true,
    },
    {
      id: "2",
      name: "Sourdough Bread",
      description:
        "Traditional sourdough with a perfect crust and tangy flavor. Made from our 100-year-old starter.",
      price: 8.0,
      category: "bread",
      image:
        "https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnJlYWQlMjBsb2FmfGVufDB8fDB8fHww",
      rating: 5,
      popular: true,
      inStock: true,
    },
    {
      id: "3",
      name: "Danish Pastries",
      description:
        "Delicate pastries filled with seasonal fruits, cream cheese, or premium chocolate.",
      price: 4.25,
      category: "pastries",
      image:
        "https://images.unsplash.com/photo-1618766249828-3bcc5a3ec158?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YnJlYWQlMjBsb2FmfGVufDB8fDB8fHww",
      rating: 4.8,
      popular: false,
      inStock: true,
    },
    {
      id: "4",
      name: "Artisan Baguettes",
      description:
        "Crusty French baguettes with an airy interior, perfect for sandwiches or alongside dinner.",
      price: 4.5,
      category: "bread",
      image:
        "https://media.istockphoto.com/id/2170880572/photo/baker-holding-fresh-artisan-bread-in-paper-bag.webp?a=1&b=1&s=612x612&w=0&k=20&c=YDXLV_y4VpHNWu9Az5o9fHZsm57GGXjY_zbqLf-vw7U=",
      rating: 4.9,
      popular: true,
      inStock: true,
    },
    {
      id: "5",
      name: "Chocolate Éclairs",
      description:
        "Classic French éclairs filled with vanilla cream and topped with rich chocolate glaze.",
      price: 5.75,
      category: "pastries",
      image:
        "https://media.istockphoto.com/id/1161028061/photo/chocolate-%C3%A9clairs-with-colored-powder-on-a-light-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=Fw-qyZOHqv7g8zyvqQwgDoDGWJ0al43-GD1PExQj4CU=",
      rating: 4.7,
      popular: false,
      inStock: true,
    },
    {
      id: "6",
      name: "Multigrain Loaf",
      description:
        "Hearty bread packed with seeds and grains, perfect for a healthy breakfast or lunch.",
      price: 6.5,
      category: "bread",
      image: "/pastries-display.jpg",
      rating: 4.6,
      popular: false,
      inStock: false,
    },
    {
      id: "7",
      name: "Fruit Tarts",
      description:
        "Individual tarts topped with seasonal fresh fruits and pastry cream.",
      price: 6.25,
      category: "desserts",
      image:
        "https://media.istockphoto.com/id/2184085012/photo/cheese-tart.webp?a=1&b=1&s=612x612&w=0&k=20&c=96gNppOCxVRYVt707NmndlQAmbXgccUrkRNP_S33KKI=",
      rating: 4.9,
      popular: true,
      inStock: true,
    },
    {
      id: "8",
      name: "Cinnamon Rolls",
      description:
        "Warm, gooey cinnamon rolls with cream cheese frosting, baked fresh daily.",
      price: 4.0,
      category: "pastries",
      image:
        "https://images.unsplash.com/photo-1645995575875-ea6511c9d127?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2lubmFtb24lMjBSb2xsc3xlbnwwfHwwfHx8MA%3D%3D",
      rating: 4.8,
      popular: true,
      inStock: true,
    },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "bread", label: "Bread" },
    { value: "pastries", label: "Pastries" },
    { value: "desserts", label: "Desserts" },
  ];

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "under-5", label: "Under $5" },
    { value: "5-7", label: "$5 - $7" },
    { value: "over-7", label: "Over $7" },
  ];

  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "price-low", label: "Price (Low to High)" },
    { value: "price-high", label: "Price (High to Low)" },
    { value: "rating", label: "Rating" },
    { value: "popular", label: "Popularity" },
  ];

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      
      const matchesPrice = priceFilter === "all" || 
        (priceFilter === "under-5" && product.price < 5) ||
        (priceFilter === "5-7" && product.price >= 5 && product.price <= 7) ||
        (priceFilter === "over-7" && product.price > 7);

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "popular":
          return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, categoryFilter, priceFilter, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Our <span className="text-primary">Products</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our complete collection of artisan breads, pastries, and desserts, 
              all made fresh daily with the finest ingredients.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline-solid"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline-solid"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filter Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Filters:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              Showing {filteredAndSortedProducts.length} of {products.length} products
            </div>
          </div>

          {/* Page Grid/List */}
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredAndSortedProducts.map((product) => (
              <Card 
                key={product.id} 
                className={`group cursor-pointer hover:shadow-lg transition-all duration-300 ${
                  !product.inStock ? "opacity-60" : ""
                } ${
                  viewMode === "list" ? "flex flex-row" : ""
                }`}
                onClick={() => router.push(`/products/${product.id}`)}
              >
                <CardContent className={`p-0 ${viewMode === "list" ? "flex w-full" : ""}`}>
                  {/* Product Image */}
                  <div className={`relative overflow-hidden ${
                    viewMode === "list" 
                      ? "w-48 h-32 shrink-0" 
                      : "w-full h-48 rounded-t-lg"
                  } ${viewMode === "grid" ? "rounded-t-lg" : "rounded-l-lg"}`}>
                    {product.popular && (
                      <div className="absolute top-2 left-2 z-10 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-medium">
                        Popular
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute top-2 right-2 z-10 bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-medium">
                        Out of Stock
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 z-10 p-1 h-8 w-8 bg-background/80 hover:bg-background"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          favorites.includes(product.id) 
                            ? "fill-red-500 text-red-500" 
                            : "text-muted-foreground"
                        }`} 
                      />
                    </Button>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Product Info */}
                  <div className={`p-4 space-y-3 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-display font-semibold text-foreground line-clamp-1">
                        {product.name}
                      </h3>
                      <span className="text-lg font-bold text-primary">
                        Ksh {product.price.toFixed(2)}
                      </span>
                    </div>

                    <p className={`text-muted-foreground leading-relaxed ${
                      viewMode === "list" ? "line-clamp-2" : "line-clamp-3"
                    }`}>
                      {product.description}
                    </p>

                    {/* Rating and Category */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(product.rating)
                                  ? "text-secondary fill-secondary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.rating})
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        disabled={!product.inStock}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/products/${product.id}`);
                        }}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm"
                        disabled={!product.inStock}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add to cart logic would go here
                        }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🥖</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setPriceFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Page;