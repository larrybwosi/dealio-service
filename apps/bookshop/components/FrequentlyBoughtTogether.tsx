import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { useCart } from '@/contexts/cart';
import { Product } from '@/data/products';
import { ShoppingCart, Plus } from 'lucide-react';

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
  recommendations: Product[];
}

export default function FrequentlyBoughtTogether({
                                                   currentProduct,
                                                   recommendations
                                                 }: FrequentlyBoughtTogetherProps) {
  const { addToCart } = useCart();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([currentProduct.id]);

  if (recommendations.length === 0) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(price);
  };

  const toggleProduct = (productId: string) => {
    if (productId === currentProduct.id) return; // Can't deselect current product

    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const allProducts = [currentProduct, ...recommendations];
  const selectedItems = allProducts.filter(product => selectedProducts.includes(product.id));
  const totalPrice = selectedItems.reduce((sum, product) => sum + product.price, 0);
  const originalTotal = allProducts.reduce((sum, product) => sum + product.price, 0);
  const savings = originalTotal - totalPrice;

  const handleAddAllToCart = () => {
    selectedItems.forEach(product => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    });
  };

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <ShoppingCart className="h-5 w-5 mr-2 text-amber-600" />
          Frequently Bought Together
        </CardTitle>
        <p className="text-sm text-slate-600">
          Customers who bought this item also bought these products
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Product Selection */}
        <div className="space-y-3">
          {allProducts.map((product, index) => (
            <div key={product.id}>
              <div className="flex items-center space-x-4 p-3 bg-white rounded-lg">
                <Checkbox
                  id={`product-${product.id}`}
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={() => toggleProduct(product.id)}
                  disabled={product.id === currentProduct.id}
                />

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-2">
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-600 mb-1">{product.category}</p>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-amber-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.id === currentProduct.id && (
                      <Badge className="bg-blue-100 text-blue-800 text-xs">This item</Badge>
                    )}
                  </div>
                </div>

                {!product.inStock && (
                  <Badge className="bg-red-100 text-red-800 text-xs">Out of Stock</Badge>
                )}
              </div>

              {index < allProducts.length - 1 && (
                <div className="flex justify-center my-2">
                  <Plus className="h-4 w-4 text-slate-400" />
                </div>
              )}
            </div>
          ))}
        </div>

        <Separator />

        {/* Pricing Summary */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">
              Selected items ({selectedItems.length})
            </span>
            <span className="font-semibold">{formatPrice(totalPrice)}</span>
          </div>

          {savings > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span className="text-sm">You save</span>
              <span className="font-semibold">{formatPrice(savings)}</span>
            </div>
          )}

          <Button
            className="w-full bg-amber-600 hover:bg-amber-700"
            onClick={handleAddAllToCart}
            disabled={selectedItems.length === 0 || selectedItems.some(item => !item.inStock)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} to cart
          </Button>

          {selectedItems.some(item => !item.inStock) && (
            <p className="text-xs text-red-600 text-center">
              Some selected items are out of stock
            </p>
          )}
        </div>

        {/* Customer Insight */}
        <div className="text-xs text-slate-500 text-center bg-white p-2 rounded">
          💡 <strong>78%</strong> of customers who bought "{currentProduct.name}" also purchased these items
        </div>
      </CardContent>
    </Card>
  );
}