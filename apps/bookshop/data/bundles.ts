import { Product } from './products';

export interface Bundle {
  id: string;
  name: string;
  description: string;
  image: string;
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  productIds: string[];
  category: string;
  popular: boolean;
  validUntil?: string;
}

export const bundles: Bundle[] = [
  {
    id: "bundle_1",
    name: "Complete Student Starter Pack",
    description: "Everything a new student needs: laptop, books, and supplies",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop",
    originalPrice: 319497,
    bundlePrice: 279999,
    savings: 39498,
    productIds: ["1", "2", "5", "4"],
    category: "Student Essentials",
    popular: true,
    validUntil: "2024-02-29"
  },
  {
    id: "bundle_2",
    name: "Professional Office Setup",
    description: "Complete office setup for remote work professionals",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
    originalPrice: 28997,
    bundlePrice: 24999,
    savings: 3998,
    productIds: ["3", "7", "10"],
    category: "Professional",
    popular: true
  },
  {
    id: "bundle_3",
    name: "Creative Artist Bundle",
    description: "Digital and traditional art supplies for creative professionals",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=500&fit=crop",
    originalPrice: 20598,
    bundlePrice: 17999,
    savings: 2599,
    productIds: ["6", "9"],
    category: "Creative",
    popular: false
  },
  {
    id: "bundle_4",
    name: "Engineering Student Pack",
    description: "Essential tools and books for engineering students",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=500&fit=crop",
    originalPrice: 4798,
    bundlePrice: 3999,
    savings: 799,
    productIds: ["4", "5"],
    category: "Engineering",
    popular: false
  }
];

export interface FrequentlyBoughtTogether {
  productId: string;
  recommendations: {
    productId: string;
    frequency: number; // percentage of customers who bought both
  }[];
}

export const frequentlyBoughtTogether: FrequentlyBoughtTogether[] = [
  {
    productId: "1", // MacBook Pro
    recommendations: [
      { productId: "7", frequency: 78 }, // Headphones
      { productId: "8", frequency: 65 }, // Keyboard
      { productId: "3", frequency: 45 }  // Office Chair
    ]
  },
  {
    productId: "2", // Think and Grow Rich
    recommendations: [
      { productId: "5", frequency: 82 }, // Notebooks
      { productId: "6", frequency: 34 }  // Art Supplies
    ]
  },
  {
    productId: "3", // Office Chair
    recommendations: [
      { productId: "1", frequency: 67 }, // MacBook
      { productId: "10", frequency: 89 } // Presentation Remote
    ]
  },
  {
    productId: "4", // Calculator
    recommendations: [
      { productId: "5", frequency: 91 }, // Notebooks
      { productId: "2", frequency: 23 }  // Think and Grow Rich
    ]
  },
  {
    productId: "5", // Notebooks
    recommendations: [
      { productId: "4", frequency: 76 }, // Calculator
      { productId: "6", frequency: 54 }  // Art Supplies
    ]
  },
  {
    productId: "6", // Art Supplies
    recommendations: [
      { productId: "9", frequency: 85 }, // Drawing Tablet
      { productId: "5", frequency: 43 }  // Notebooks
    ]
  },
  {
    productId: "7", // Headphones
    recommendations: [
      { productId: "1", frequency: 72 }, // MacBook
      { productId: "8", frequency: 56 }  // Keyboard
    ]
  },
  {
    productId: "8", // Keyboard
    recommendations: [
      { productId: "1", frequency: 68 }, // MacBook
      { productId: "7", frequency: 52 }  // Headphones
    ]
  },
  {
    productId: "9", // Drawing Tablet
    recommendations: [
      { productId: "6", frequency: 79 }, // Art Supplies
      { productId: "1", frequency: 41 }  // MacBook
    ]
  },
  {
    productId: "10", // Presentation Remote
    recommendations: [
      { productId: "3", frequency: 83 }, // Office Chair
      { productId: "1", frequency: 38 }  // MacBook
    ]
  }
];

export function getBundleById(id: string): Bundle | undefined {
  return bundles.find(bundle => bundle.id === id);
}

export function getBundlesByCategory(category: string): Bundle[] {
  return bundles.filter(bundle => bundle.category === category);
}

export function getPopularBundles(): Bundle[] {
  return bundles.filter(bundle => bundle.popular);
}

export function getFrequentlyBoughtTogether(productId: string, products: Product[]): Product[] {
  const recommendations = frequentlyBoughtTogether.find(fbt => fbt.productId === productId);
  if (!recommendations) return [];

  return recommendations.recommendations
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 3)
    .map(rec => products.find(p => p.id === rec.productId))
    .filter(Boolean) as Product[];
}