'use client'
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ReviewSection from "@/components/ReviewSection";
import { getProductById, products } from "@/data/products";
import { useCart } from "@/contexts/cart";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Check,
  Building2,
  Calculator,
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import FrequentlyBoughtTogether from '@/components/FrequentlyBoughtTogether';
import { getFrequentlyBoughtTogether } from '@/data/bundles';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductById(slug) : null;
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState<"individual" | "bulk">(
    "individual"
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Product Not Found
          </h1>
          <p className="text-slate-600 mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(price);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: orderType === "bulk" ? product.price * 0.9 : product.price,
        image: product.image,
        category: product.category,
      });
    }
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const frequentlyBoughtTogether = getFrequentlyBoughtTogether(product.id, products);

  const discountPercentage = product.originalPrice
    ? Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    )
    : 0;

  const bulkPrice = product.price * 0.9;
  const totalPrice =
    orderType === "bulk" ? bulkPrice * quantity : product.price * quantity;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-4 sm:mb-6 lg:mb-8 overflow-x-auto whitespace-nowrap py-2">
          <Link href="/" className="hover:text-amber-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-amber-600">
            Products
          </Link>
          <span>/</span>
          <span className="text-slate-800 truncate max-w-[150px] xs:max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          {/* Product Images */}
          <div className="space-y-3 sm:space-y-4">
            <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-lg">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image Thumbnails */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-amber-600 ring-2 ring-amber-600/20"
                      : "border-slate-200 hover:border-amber-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <Badge className="mb-2 sm:mb-3 text-xs sm:text-sm">{product.category}</Badge>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-3 sm:mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6 flex-wrap gap-y-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-amber-400 fill-current"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm sm:text-base text-slate-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-4 sm:mb-6">
                {product.longDescription}
              </p>
            </div>

            {/* Order Type Selection */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Order Type
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Card
                    className={`cursor-pointer transition-all ${
                      orderType === "individual"
                        ? "ring-2 ring-amber-500 bg-amber-50"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setOrderType("individual")}
                  >
                    <CardContent className="p-3 sm:p-4 text-center">
                      <div className="font-semibold text-sm sm:text-base mb-1">Individual</div>
                      <div className="text-xs sm:text-sm text-slate-600">
                        Regular pricing
                      </div>
                      <div className="text-base sm:text-lg font-bold text-amber-600 mt-1 sm:mt-2">
                        {formatPrice(product.price)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer transition-all ${
                      orderType === "bulk"
                        ? "ring-2 ring-amber-500 bg-amber-50"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setOrderType("bulk")}
                  >
                    <CardContent className="p-3 sm:p-4 text-center">
                      <div className="font-semibold text-sm sm:text-base mb-1">
                        Bulk/Institutional
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600">10% discount</div>
                      <div className="text-base sm:text-lg font-bold text-green-600 mt-1 sm:mt-2">
                        {formatPrice(bulkPrice)}
                      </div>
                      <Badge className="mt-1 bg-green-100 text-green-800 text-xs">
                        Save 10%
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Price and Actions */}
            <Card className="shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-1 sm:mb-2 flex-wrap gap-y-2">
                      <span className="text-2xl sm:text-3xl font-bold text-amber-600">
                        {formatPrice(
                          orderType === "bulk" ? bulkPrice : product.price
                        )}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg sm:text-xl text-slate-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      {discountPercentage > 0 && (
                        <Badge className="bg-green-600 text-white text-xs sm:text-sm">
                          {discountPercentage}% OFF
                        </Badge>
                      )}
                    </div>
                    {orderType === "bulk" && (
                      <div className="text-xs sm:text-sm text-green-600 font-medium">
                        You save {formatPrice(product.price * 0.1)} per item
                      </div>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-wrap gap-y-3">
                    <Label htmlFor="quantity" className="font-medium text-sm sm:text-base">
                      Quantity:
                    </Label>
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-16 sm:w-20 text-center border-0 focus:ring-0 text-sm sm:text-base"
                        min="1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                        className="h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>

                    {quantity > 1 && (
                      <div className="flex items-center text-xs sm:text-sm text-slate-600">
                        <Calculator className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Total: {formatPrice(totalPrice)}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 sm:space-y-3">
                    <Button
                      size="lg"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-sm sm:text-base h-11 sm:h-12"
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>

                    <div className="flex space-x-2 sm:space-x-3">
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 text-sm sm:text-base h-10 sm:h-11"
                      >
                        <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Wishlist
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 text-sm sm:text-base h-10 sm:h-11"
                      >
                        <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

                  {/* Guarantees */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t">
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-600">
                      <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                      <span className="break-words">Free delivery over KES 5,000</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-600">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                      <span>1 year warranty</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-600">
                      <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 flex-shrink-0" />
                      <span>30-day returns</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <span
                className={`font-medium text-sm sm:text-base ${product.inStock ? "text-green-700" : "text-red-700"}`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>
        {/* Frequently Bought Together */}
        {frequentlyBoughtTogether.length > 0 && (
          <div className="mb-16">
            <FrequentlyBoughtTogether
              currentProduct={product}
              recommendations={frequentlyBoughtTogether}
            />
          </div>
        )}
        {/* Product Details Tabs */}
        <Card className="mb-12 sm:mb-16 shadow-sm">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="description" className="text-xs sm:text-sm py-2 sm:py-3">
                Description
              </TabsTrigger>
              <TabsTrigger value="specifications" className="text-xs sm:text-sm py-2 sm:py-3">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="features" className="text-xs sm:text-sm py-2 sm:py-3">
                Features
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs sm:text-sm py-2 sm:py-3">
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="p-4 sm:p-6">
              <div className="prose max-w-none prose-sm sm:prose-base">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Product Description
                </h3>
                <p className="text-slate-700 leading-relaxed text-sm sm:text-base lg:text-lg">
                  {product.longDescription}
                </p>

                {product.tags && product.tags.length > 0 && (
                  <div className="mt-4 sm:mt-6">
                    <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Tags</h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {product.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Technical Specifications
              </h3>
              {product.specifications ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center p-2 sm:p-3 bg-slate-50 rounded-lg text-sm"
                      >
                        <span className="font-medium text-slate-700 break-words pr-2">
                          {key}
                        </span>
                        <span className="text-slate-600 text-right break-words">
                          {value}
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-slate-600 text-sm sm:text-base">
                  No specifications available for this product.
                </p>
              )}
            </TabsContent>

            <TabsContent value="features" className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Key Features</h3>
              {product.features ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 text-sm sm:text-base">
                  No features listed for this product.
                </p>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="p-0">
              <div className="overflow-hidden">
                <ReviewSection productId={product.id} />
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 sm:mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}