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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-8">
          <Link href="/" className="hover:text-amber-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-amber-600">
            Products
          </Link>
          <span>/</span>
          <span className="text-slate-800">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
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
          <div className="space-y-6">
            <div>
              <Badge className="mb-3">{product.category}</Badge>
              <h1 className="text-3xl font-bold text-slate-800 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-amber-400 fill-current"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-slate-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                {product.longDescription}
              </p>
            </div>

            {/* Order Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Building2 className="h-5 w-5 mr-2" />
                  Order Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card
                    className={`cursor-pointer transition-all ${orderType === "individual" ? "ring-2 ring-amber-500 bg-amber-50" : "hover:shadow-md"}`}
                    onClick={() => setOrderType("individual")}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="font-semibold mb-1">Individual</div>
                      <div className="text-sm text-slate-600">
                        Regular pricing
                      </div>
                      <div className="text-lg font-bold text-amber-600 mt-2">
                        {formatPrice(product.price)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer transition-all ${orderType === "bulk" ? "ring-2 ring-amber-500 bg-amber-50" : "hover:shadow-md"}`}
                    onClick={() => setOrderType("bulk")}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="font-semibold mb-1">
                        Bulk/Institutional
                      </div>
                      <div className="text-sm text-slate-600">10% discount</div>
                      <div className="text-lg font-bold text-green-600 mt-2">
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
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-3xl font-bold text-amber-600">
                        {formatPrice(
                          orderType === "bulk" ? bulkPrice : product.price
                        )}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xl text-slate-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      {discountPercentage > 0 && (
                        <Badge className="bg-green-600 text-white">
                          {discountPercentage}% OFF
                        </Badge>
                      )}
                    </div>
                    {orderType === "bulk" && (
                      <div className="text-sm text-green-600 font-medium">
                        You save {formatPrice(product.price * 0.1)} per item
                      </div>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-4">
                    <Label htmlFor="quantity" className="font-medium">
                      Quantity:
                    </Label>
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
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
                        className="w-20 text-center border-0 focus:ring-0"
                        min="1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {quantity > 1 && (
                      <div className="flex items-center text-sm text-slate-600">
                        <Calculator className="h-4 w-4 mr-1" />
                        Total: {formatPrice(totalPrice)}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      size="lg"
                      className="w-full bg-amber-600 hover:bg-amber-700"
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>

                    <div className="flex space-x-3">
                      <Button variant="outline" size="lg" className="flex-1">
                        <Heart className="h-4 w-4 mr-2" />
                        Wishlist
                      </Button>
                      <Button variant="outline" size="lg" className="flex-1">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

                  {/* Guarantees */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Truck className="h-4 w-4 text-green-600" />
                      <span>Free delivery over KES 5,000</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span>1 year warranty</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <RotateCcw className="h-4 w-4 text-amber-600" />
                      <span>30-day returns</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <span
                className={`font-medium ${product.inStock ? "text-green-700" : "text-red-700"}`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="p-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">
                  Product Description
                </h3>
                <p className="text-slate-700 leading-relaxed text-lg">
                  {product.longDescription}
                </p>

                {product.tags && product.tags.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                Technical Specifications
              </h3>
              {product.specifications ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
                      >
                        <span className="font-medium text-slate-700">
                          {key}
                        </span>
                        <span className="text-slate-600">{value}</span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-slate-600">
                  No specifications available for this product.
                </p>
              )}
            </TabsContent>

            <TabsContent value="features" className="p-6">
              <h3 className="text-xl font-semibold mb-4">Key Features</h3>
              {product.features ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600">
                  No features listed for this product.
                </p>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="p-6">
              <ReviewSection productId={product.id} />
            </TabsContent>
          </Tabs>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
