'use client'
import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { useAuth } from '@/contexts/auth';
import { useCart } from '@/contexts/cart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Building2,
  Users,
  AlertTriangle,
  Clock,
  ShoppingBag,
  Heart,
  Settings,
  Edit3,
  CheckCircle,
  Package,
  Star
} from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const { items, total } = useCart();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Please Sign In</h1>
          <p className="text-slate-600 mb-8">You need to be signed in to view your profile.</p>
          <Button className="bg-amber-600 hover:bg-amber-700">Sign In</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(price);
  };

  // Mock order history
  const orderHistory = [
    {
      id: 'BH001234',
      date: '2024-01-15',
      status: 'Delivered',
      total: 15999,
      items: 3,
    },
    {
      id: 'BH001235',
      date: '2024-01-10',
      status: 'In Transit',
      total: 8999,
      items: 2,
    },
    {
      id: 'BH001236',
      date: '2024-01-05',
      status: 'Processing',
      total: 3499,
      items: 1,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">My Account</h1>
          <p className="text-slate-600">Manage your profile, orders, and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center mx-auto mb-4">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-white" />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-sm text-slate-600">{user.email}</p>
                  {user.isRegistered && (
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified Customer
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Member since</span>
                    <span className="font-medium">Jan 2024</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Total Orders</span>
                    <span className="font-medium">{orderHistory.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Current Cart</span>
                    <span className="font-medium">{items.length} items</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <Button
                  variant="outline"
                  className="w-full mb-2"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>

                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700"
                  onClick={logout}
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{orderHistory.length}</div>
                      <div className="text-sm text-slate-600">Total Orders</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <ShoppingBag className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{items.length}</div>
                      <div className="text-sm text-slate-600">Items in Cart</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-sm text-slate-600">Wishlist Items</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest orders and interactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orderHistory.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <div className="font-medium">Order #{order.id}</div>
                              <div className="text-sm text-slate-600">{order.items} items • {order.date}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                            <div className="text-sm font-medium mt-1">{formatPrice(order.total)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Current Cart */}
                {items.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Cart</CardTitle>
                      <CardDescription>Items waiting for checkout</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                              <div>
                                <div className="font-medium text-sm">{item.name}</div>
                                <div className="text-xs text-slate-600">Qty: {item.quantity}</div>
                              </div>
                            </div>
                            <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
                          </div>
                        ))}
                        {items.length > 3 && (
                          <div className="text-center text-sm text-slate-600">
                            +{items.length - 3} more items
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span className="text-amber-600">{formatPrice(total)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View all your past and current orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orderHistory.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-semibold">Order #{order.id}</div>
                              <div className="text-sm text-slate-600">Placed on {order.date}</div>
                            </div>
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-600">
                              {order.items} item{order.items !== 1 ? 's' : ''}
                            </div>
                            <div className="font-semibold">{formatPrice(order.total)}</div>
                          </div>
                          <div className="mt-3 flex space-x-2">
                            <Button variant="outline" size="sm">View Details</Button>
                            {order.status === 'Delivered' && (
                              <Button variant="outline" size="sm">
                                <Star className="h-3 w-3 mr-1" />
                                Review
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                {!user.isRegistered ? (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-700">
                      Complete your profile registration to unlock all features and improve your shopping experience.
                      <Button variant="link" className="p-0 h-auto text-amber-700 underline ml-1">
                        Complete Registration
                      </Button>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <User className="h-5 w-5 mr-2" />
                          Personal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Full Name</Label>
                          <div className="mt-1">{user.profile?.fullName || user.name}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Email</Label>
                          <div className="mt-1">{user.email}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Phone</Label>
                          <div className="mt-1">{user.profile?.phone || 'Not provided'}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Date of Birth</Label>
                          <div className="mt-1">{user.profile?.dateOfBirth || 'Not provided'}</div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Address Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <MapPin className="h-5 w-5 mr-2" />
                          Address & Delivery
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Address</Label>
                          <div className="mt-1 text-sm">{user.profile?.address || 'Not provided'}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Delivery Notes</Label>
                          <div className="mt-1 text-sm">{user.profile?.deliveryNotes || 'None'}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Preferred Delivery Time</Label>
                          <div className="mt-1 text-sm">{user.profile?.preferredDeliveryTime || 'Anytime'}</div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Emergency Contact */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Users className="h-5 w-5 mr-2" />
                          Emergency Contact
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Contact Name</Label>
                          <div className="mt-1">{user.profile?.emergencyContact?.name || 'Not provided'}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Phone</Label>
                          <div className="mt-1">{user.profile?.emergencyContact?.phone || 'Not provided'}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Relationship</Label>
                          <div className="mt-1">{user.profile?.emergencyContact?.relationship || 'Not provided'}</div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Health Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          Health & Preferences
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Allergies & Medical Conditions</Label>
                          <div className="mt-1 text-sm">{user.profile?.allergies || 'None reported'}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Account Preferences
                    </CardTitle>
                    <CardDescription>Customize your BookHub experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Email Notifications</div>
                          <div className="text-sm text-slate-600">Receive updates about orders and promotions</div>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">SMS Notifications</div>
                          <div className="text-sm text-slate-600">Get delivery updates via SMS</div>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Marketing Communications</div>
                          <div className="text-sm text-slate-600">Receive promotional offers and new product updates</div>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="font-medium">Default Currency</Label>
                      <select className="mt-2 w-full p-2 border rounded-md">
                        <option value="KES">Kenyan Shilling (KES)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                      </select>
                    </div>

                    <div>
                      <Label className="font-medium">Language</Label>
                      <select className="mt-2 w-full p-2 border rounded-md">
                        <option value="en">English</option>
                        <option value="sw">Swahili</option>
                      </select>
                    </div>

                    <Button className="bg-amber-600 hover:bg-amber-700">
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}