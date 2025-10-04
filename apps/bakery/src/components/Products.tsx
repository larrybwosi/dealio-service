'use client'

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Image from "next/image";

const Products = () => {
  const router = useRouter();
  
  const products = [
    {
      id: "1",
      name: "Artisan Croissants",
      description: "Buttery, flaky croissants baked fresh every morning. Available in classic, almond, and chocolate varieties.",
      price: "From Ksh 350",
      image: '/pastries-display.jpg',
      rating: 5,
      popular: true,
    },
    {
      id: "2",
      name: "Sourdough Bread",
      description: "Traditional sourdough with a perfect crust and tangy flavor. Made from our 100-year-old starter.",
      price: "Ksh 800",
      image: '/bread-shelves.jpg',
      rating: 5,
      popular: true,
    },
    {
      id: "3",
      name: "Danish Pastries",
      description: "Delicate pastries filled with seasonal fruits, cream cheese, or premium chocolate.",
      price: "From Ksh 425",
      image: '/pastries-display.jpg',
      rating: 4.8,
      popular: false,
    },
    {
      id: "4",
      name: "Artisan Baguettes",
      description: "Crusty French baguettes with an airy interior, perfect for sandwiches or alongside dinner.",
      price: "Ksh 450",
      image: '/bread-shelves.jpg',
      rating: 4.9,
      popular: true,
    },
  ];

  return (
    <section id="products" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Our Signature
            <span className="block text-primary">Products</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully crafted selection of breads, pastries, and desserts, 
            made fresh daily using traditional techniques and premium ingredients.
          </p>
        </div>

        {/* Page Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group cursor-pointer"
              onClick={() => router.push(`/products/${product.id}`)}
            >
              <div className="bg-card rounded-2xl overflow-hidden shadow-soft hover-lift border border-border/50 group-hover:border-primary/30 transition-all duration-300">
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  {product.popular && (
                    <div className="absolute top-3 left-3 z-10 bg-linear-to-r from-secondary to-hero text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                      ⭐ Popular
                    </div>
                  )}
                  <div className="aspect-4/3 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Product Info */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-display font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <span className="text-lg font-bold text-primary whitespace-nowrap">
                      {product.price}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < Math.floor(product.rating)
                                ? "text-secondary fill-secondary"
                                : "text-muted-foreground/40"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-1">
                        {product.rating}
                      </span>
                    </div>
                    
                    <Button 
                      size="sm"
                      variant="outline" 
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 border-primary/20 hover:bg-primary hover:text-primary-foreground text-xs px-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/products/${product.id}`);
                      }}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Page CTA */}
        <div className="text-center">
          <Button variant="hero" size="lg" className="px-8" onClick={() => router.push('/products')}>
            View Full Menu
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;