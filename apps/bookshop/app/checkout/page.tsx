'use client'
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Separator } from "@workspace/ui/components/separator";
import { Badge } from "@workspace/ui/components/badge";
import { useCart } from "@/contexts/cart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  Building2,
  ShoppingBag,
  CheckCircle,
  Truck,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [orderType, setOrderType] = useState<"individual" | "bulk">(
    "individual"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(price);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();

      // Redirect to success page after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }, 2000);
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <ShoppingBag className="h-16 w-16 text-slate-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Your cart is empty
          </h1>
          <p className="text-slate-600 mb-8">
            Add some products to your cart before checking out.
          </p>
          <Button
            onClick={() => router.push("/products")}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Continue Shopping
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-lg">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-slate-800 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-slate-600 mb-6">
              Thank you for your order. We'll send you a confirmation email
              shortly.
            </p>
            <Badge className="bg-green-100 text-green-800 px-4 py-2 mb-8">
              Order #BH{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </Badge>
            <div className="flex items-center justify-center text-slate-500 mb-8">
              <Truck className="h-5 w-5 mr-2" />
              <span>Expected delivery: 1-2 business days</span>
            </div>
            <p className="text-sm text-slate-500">Redirecting to homepage...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const deliveryFee = total > 5000 ? 0 : 500;
  const finalTotal = total + deliveryFee;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Checkout</h1>
          <p className="text-slate-600">
            Complete your order and get your products delivered
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
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
                    <CardContent className="p-6 text-center">
                      <User className="h-8 w-8 mx-auto mb-3 text-amber-600" />
                      <h3 className="font-semibold mb-2">Individual Order</h3>
                      <p className="text-sm text-slate-600">
                        Personal purchases and small quantities
                      </p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer transition-all ${orderType === "bulk" ? "ring-2 ring-amber-500 bg-amber-50" : "hover:shadow-md"}`}
                    onClick={() => setOrderType("bulk")}
                  >
                    <CardContent className="p-6 text-center">
                      <Building2 className="h-8 w-8 mx-auto mb-3 text-amber-600" />
                      <h3 className="font-semibold mb-2">Bulk/Institutional</h3>
                      <p className="text-sm text-slate-600">
                        Schools, offices, and large orders
                      </p>
                      <Badge className="mt-2 bg-green-100 text-green-800">
                        Special Pricing
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  {orderType === "bulk"
                    ? "Institution Information"
                    : "Customer Information"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitOrder} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">
                        {orderType === "bulk" ? "Contact Person" : "First Name"}
                      </Label>
                      <Input id="firstName" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">
                        {orderType === "bulk"
                          ? "Institution Name"
                          : "Last Name"}
                      </Label>
                      <Input id="lastName" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" required />
                    </div>
                  </div>

                  {orderType === "bulk" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="institution">Institution Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="university">
                              University
                            </SelectItem>
                            <SelectItem value="school">School</SelectItem>
                            <SelectItem value="college">College</SelectItem>
                            <SelectItem value="corporate">Corporate</SelectItem>
                            <SelectItem value="government">
                              Government
                            </SelectItem>
                            <SelectItem value="ngo">NGO</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="taxId">
                          Tax ID/Registration Number
                        </Label>
                        <Input id="taxId" />
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter full delivery address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="Nairobi" required />
                  </div>
                  <div>
                    <Label htmlFor="deliveryTime">
                      Preferred Delivery Time
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">
                          Morning (8AM - 12PM)
                        </SelectItem>
                        <SelectItem value="afternoon">
                          Afternoon (12PM - 5PM)
                        </SelectItem>
                        <SelectItem value="evening">
                          Evening (5PM - 8PM)
                        </SelectItem>
                        <SelectItem value="anytime">Anytime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Special Instructions (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special delivery instructions..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="cursor-pointer border-2 border-amber-500 bg-amber-50">
                      <CardContent className="p-4 text-center">
                        <div className="font-semibold text-amber-800">
                          M-Pesa
                        </div>
                        <div className="text-sm text-amber-600">
                          Pay with mobile money
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md">
                      <CardContent className="p-4 text-center">
                        <div className="font-semibold">Cash on Delivery</div>
                        <div className="text-sm text-slate-600">
                          Pay when you receive
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {orderType === "bulk" && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                          <Building2 className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="font-semibold text-blue-800">
                            Institutional Payment Options
                          </span>
                        </div>
                        <div className="text-sm text-blue-700">
                          • Purchase Orders accepted
                          <br />
                          • 30-day payment terms available
                          <br />
                          • Bank transfers and cheques accepted
                          <br />• Volume discounts automatically applied
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-slate-500">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      Delivery Fee
                      {total > 5000 && (
                        <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                          FREE
                        </Badge>
                      )}
                    </span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                  {orderType === "bulk" && (
                    <div className="flex justify-between text-green-600">
                      <span>Bulk Discount (10%)</span>
                      <span>-{formatPrice(total * 0.1)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-amber-600">
                    {formatPrice(
                      orderType === "bulk" ? finalTotal * 0.9 : finalTotal
                    )}
                  </span>
                </div>

                <div className="flex items-center text-sm text-slate-600 mb-4">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Delivery: 1-2 business days</span>
                </div>

                <Button
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  size="lg"
                  onClick={handleSubmitOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Complete Order
                    </>
                  )}
                </Button>

                <div className="text-xs text-slate-500 text-center">
                  By placing this order, you agree to our Terms of Service and
                  Privacy Policy
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
