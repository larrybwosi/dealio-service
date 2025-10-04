'use client'
import { ChefHat, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={'/hero.jpg'}
          alt="Artisanal bakery with fresh pastries and warm lighting"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-background/95 via-background/80 to-background/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-2 mb-6">
            <ChefHat className="h-8 w-8 text-primary" />
            <span className="text-primary font-medium tracking-wide">Artisanal Bakery</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
            Fresh Baked
            <span className="block text-primary">Every Morning</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Experience the finest artisanal breads, pastries, and desserts crafted with love using traditional methods and the freshest ingredients.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6">
              View Our Menu
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Visit Our Store
            </Button>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center space-x-2 bg-card/80 backdrop-blur-xs rounded-full px-4 py-2 shadow-soft">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-card-foreground font-medium">Fresh Daily</span>
            </div>
            <div className="flex items-center space-x-2 bg-card/80 backdrop-blur-xs rounded-full px-4 py-2 shadow-soft">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-card-foreground font-medium">Award Winning</span>
            </div>
            <div className="flex items-center space-x-2 bg-card/80 backdrop-blur-xs rounded-full px-4 py-2 shadow-soft">
              <ChefHat className="h-4 w-4 text-primary" />
              <span className="text-card-foreground font-medium">Artisan Crafted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;