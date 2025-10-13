import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bundle } from '@/data/bundles';
import { useCart } from '@/contexts/CartContext';
import { getProductById } from '@/data/products';
import { ShoppingCart, Clock, Package, Percent } from 'lucide-react';

interface BundleCardProps {
  bundle: Bundle;
}

export default function BundleCard({ bundle }: BundleCardProps) {
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Add all products in the bundle to cart
    bundle.productIds.forEach(productId => {
      const product = getProductById(productId);
      if (product) {
        addToCart({
          id: `${bundle.id}_${product.id}`,
          name: `${product.name} (Bundle)`,
          price: Math.floor(bundle.bundlePrice / bundle.productIds.length),
          image: product.image,
          category: bundle.category,
        });
      }
    });
  };

  const discountPercentage = Math.round((bundle.savings / bundle.originalPrice) * 100);
  const bundleProducts = bundle.productIds.map(id => getProductById(id)).filter(Boolean);

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg overflow-hidden bg-white">
      <Link to={`/bundle/${bundle.id}`}>
        <CardHeader className="p-0 relative">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={bundle.image}
              alt={bundle.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge className="bg-red-600 text-white">
              <Percent className="h-3 w-3 mr-1" />
              {discountPercentage}% OFF
            </Badge>
            {bundle.popular && (
              <Badge className="bg-amber-600 text-white">Popular</Badge>
            )}
            {bundle.validUntil && (
              <Badge className="bg-blue-600 text-white">
                <Clock className="h-3 w-3 mr-1" />
                Limited Time
              </Badge>
            )}
          </div>

          {/* Items Count */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/90 backdrop-blur-sm text-slate-700">
              <Package className="h-3 w-3 mr-1" />
              {bundle.productIds.length} Items
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="space-y-3">
            <Badge variant="secondary" className="text-xs">
              {bundle.category}
            </Badge>

            <h3 className="font-semibold text-slate-800 line-clamp-2 group-hover:text-amber-600 transition-colors">
              {bundle.name}
            </h3>

            <p className="text-sm text-slate-600 line-clamp-2">
              {bundle.description}
            </p>

            {/* Bundle Items Preview */}
            <div className="flex -space-x-2 overflow-hidden">
              {bundleProducts.slice(0, 4).map((product, index) => (
                <img
                  key={product?.id}
                  src={product?.image}
                  alt={product?.name}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  title={product?.name}
                />
              ))}
              {bundleProducts.length > 4 && (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-medium">
                  +{bundleProducts.length - 4}
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 line-through">
                  {formatPrice(bundle.originalPrice)}
                </span>
                <span className="text-sm font-medium text-green-600">
                  Save {formatPrice(bundle.savings)}
                </span>
              </div>
              <div className="text-2xl font-bold text-amber-600">
                {formatPrice(bundle.bundlePrice)}
              </div>
            </div>

            {/* Valid Until */}
            {bundle.validUntil && (
              <div className="text-xs text-red-600 font-medium">
                Offer valid until {new Date(bundle.validUntil).toLocaleDateString()}
              </div>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0">
        <div className="w-full space-y-2">
          <Button
            className="w-full bg-amber-600 hover:bg-amber-700"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add Bundle to Cart
          </Button>

          <Button variant="outline" className="w-full" asChild>
            <Link to={`/bundle/${bundle.id}`}>
              View Bundle Details
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}