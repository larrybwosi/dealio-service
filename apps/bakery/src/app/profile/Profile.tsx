import { useState, useEffect } from "react";
import { User, MapPin, Phone, Calendar, Save, Plus, Trash2, LogOut, Heart, Settings, Bell, Eye, EyeOff, Star, ShoppingBag, Gift, Share2, Copy, MessageCircle, Facebook, Instagram, Twitter, Mail, Truck, RotateCcw, CheckCircle, Clock, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import pastriesImage from "@/assets/pastries-display.jpg";
import breadImage from "@/assets/bread-shelves.jpg";
import { useRouter } from 'next/navigation';

interface CustomerProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  shipping_addresses: ShippingAddress[];
  default_shipping_address_id?: string;
}

interface ShippingAddress {
  id: string;
  label: string;
  full_name?: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
  delivery_notes?: string;
  // Simulated location
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  delivery_address: any;
  delivery_notes?: string;
  items: any;
  loyalty_points_earned: number;
  created_at: string;
}

interface LoyaltyPoints {
  total_points: number;
  points_earned: number;
  points_redeemed: number;
}

interface ReferralData {
  referral_code: string;
  referred_users: number;
  total_rewards: number;
}

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints>({ total_points: 0, points_earned: 0, points_redeemed: 0 });
  const [referralData, setReferralData] = useState<ReferralData>({ referral_code: '', referred_users: 0, total_rewards: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: ""
  });

  const [addressForm, setAddressForm] = useState({
    label: "",
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    phone: "",
    isDefault: false,
    deliveryNotes: ""
  });


  // Fetch profile data
  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrders();
      fetchLoyaltyPoints();
      fetchReferralData();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const profileData: CustomerProfile = {
          ...data,
          shipping_addresses: Array.isArray(data.shipping_addresses) 
            ? data.shipping_addresses as unknown as ShippingAddress[]
            : []
        };
        setProfile(profileData);
        setProfileForm({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          phoneNumber: data.phone_number || "",
          dateOfBirth: data.date_of_birth || ""
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data || []) as Order[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchLoyaltyPoints = async () => {
    try {
      const { data, error } = await supabase
        .from('user_loyalty_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setLoyaltyPoints(data);
      }
    } catch (error) {
      console.error('Error fetching loyalty points:', error);
    }
  };

  const fetchReferralData = async () => {
    try {
      const { data, error } = await supabase
        .from('user_referrals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // Create referral record if it doesn't exist
        const referralCode = `REF-${user.id.substring(0, 8).toUpperCase()}`;
        const { error: createError } = await supabase
          .from('user_referrals')
          .insert({
            user_id: user.id,
            referral_code: referralCode,
            referred_users: 0,
            total_rewards: 0
          });

        if (!createError) {
          setReferralData({ referral_code: referralCode, referred_users: 0, total_rewards: 0 });
        }
      } else if (data) {
        setReferralData(data);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const profileData = {
        user_id: user.id,
        first_name: profileForm.firstName,
        last_name: profileForm.lastName,
        phone_number: profileForm.phoneNumber,
        date_of_birth: profileForm.dateOfBirth || null
      };

      const { error } = await supabase
        .from('customer_profiles')
        .upsert(profileData);

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved."
      });

      fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      // Simulate geocoding for demo purposes
      const simulatedCoordinates = {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1
      };

      const newAddress: ShippingAddress = {
        id: Date.now().toString(),
        label: addressForm.label,
        full_name: addressForm.fullName,
        street_address: addressForm.streetAddress,
        city: addressForm.city,
        state: addressForm.state,
        postal_code: addressForm.postalCode,
        country: addressForm.country,
        phone: addressForm.phone,
        is_default: addressForm.isDefault,
        delivery_notes: addressForm.deliveryNotes,
        coordinates: simulatedCoordinates
      };

      const updatedAddresses = [...(profile.shipping_addresses || []), newAddress];

      const { error } = await supabase
        .from('customer_profiles')
        .update({
          shipping_addresses: updatedAddresses as any,
          default_shipping_address_id: addressForm.isDefault ? newAddress.id : profile.default_shipping_address_id
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Address added!",
        description: `Shipping address "${addressForm.label}" has been added.`
      });

      setShowAddressDialog(false);
      setAddressForm({
        label: "",
        fullName: "",
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        country: "United States",
        phone: "",
        isDefault: false,
        deliveryNotes: ""
      });

      fetchProfile();
    } catch (error) {
      console.error('Error adding address:', error);
      toast({
        title: "Error",
        description: "Failed to add address. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handlePinLocation = (address: ShippingAddress) => {
    setSelectedAddress(address);
    setShowLocationPicker(true);
  };

  const handleLocationUpdate = async (lat: number, lng: number) => {
    if (!selectedAddress || !profile) return;

    try {
      const updatedAddresses = profile.shipping_addresses.map(addr =>
        addr.id === selectedAddress.id
          ? { ...addr, coordinates: { lat, lng } }
          : addr
      );

      const { error } = await supabase
        .from('customer_profiles')
        .update({ shipping_addresses: updatedAddresses as any })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Location updated!",
        description: "Your delivery location has been pinned successfully."
      });

      setShowLocationPicker(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: "Error",
        description: "Failed to update location. Please try again.",
        variant: "destructive"
      });
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}?ref=${referralData.referral_code}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link copied!",
      description: "Referral link has been copied to your clipboard."
    });
  };

  const shareToSocial = (platform: string) => {
    const referralLink = `${window.location.origin}?ref=${referralData.referral_code}`;
    const message = "Join me at Sweet Dreams Bakery and get amazing freshly baked goods! Use my referral link:";
    
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${message} ${referralLink}`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`,
      instagram: referralLink, // Instagram doesn't support direct sharing URLs
      email: `mailto:?subject=${encodeURIComponent("Try Sweet Dreams Bakery!")}&body=${encodeURIComponent(`${message} ${referralLink}`)}`
    };

    if (platform === 'instagram') {
      copyReferralLink();
      toast({
        title: "Link copied for Instagram!",
        description: "Share the link in your Instagram story or post.",
      });
    } else {
      window.open(urls[platform], '_blank');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-transit': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'in-transit': return Truck;
      case 'pending': return Clock;
      default: return Package;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded-lg animate-pulse" />
              <div className="h-64 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                  Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''}!
                </h1>
                <p className="text-muted-foreground">
                  Manage your profile, preferences, and view your order history
                </p>
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

            <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="preferences">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={profileForm.phoneNumber}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        placeholder="Enter your phone number"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth (Optional)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dob"
                        type="date"
                        value={profileForm.dateOfBirth}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const StatusIcon = getStatusIcon(order.status);
                        return (
                          <Card key={order.id} className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold text-lg">#{order.order_number}</h4>
                                  <Badge variant="outline" className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                    <StatusIcon className="h-3 w-3" />
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <p>Ordered on {new Date(order.created_at).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}</p>
                                  <p>Items: {Array.isArray(order.items) ? order.items.map(item => `${item.quantity}x ${item.name}`).join(', ') : 'N/A'}</p>
                                  {order.delivery_notes && (
                                    <p className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      Note: {order.delivery_notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-primary">${order.total_amount}</p>
                                <p className="text-sm text-muted-foreground">
                                  +{order.loyalty_points_earned} points earned
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View Details
                                  </Button>
                                  {order.status === 'delivered' && (
                                    <Button size="sm">
                                      <RotateCcw className="h-4 w-4 mr-1" />
                                      Reorder
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No Orders Yet
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Start shopping to see your order history here
                      </p>
                      <Button onClick={() => router.push('/products')}>
                        Browse Products
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="loyalty">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-linear-to-br from-primary/10 to-secondary/10 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-primary" />
                      Loyalty Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {loyaltyPoints.total_points}
                      </div>
                      <p className="text-muted-foreground mb-4">Available Points</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">
                            +{loyaltyPoints.points_earned}
                          </div>
                          <p className="text-muted-foreground">Earned</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-red-600">
                            -{loyaltyPoints.points_redeemed}
                          </div>
                          <p className="text-muted-foreground">Redeemed</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>How to Earn Points</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Every Purchase</p>
                        <p className="text-sm text-muted-foreground">Earn 1 point per $1 spent</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Star className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="font-semibold">Product Reviews</p>
                        <p className="text-sm text-muted-foreground">Get 10 bonus points per review</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Share2 className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">Refer Friends</p>
                        <p className="text-sm text-muted-foreground">Earn 50 points per referral</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="referrals">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-linear-to-br from-blue-50 to-purple-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Share2 className="h-5 w-5 text-blue-600" />
                      Your Referral Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                          {referralData.referred_users}
                        </div>
                        <p className="text-sm text-muted-foreground">Friends Referred</p>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          ${referralData.total_rewards}
                        </div>
                        <p className="text-sm text-muted-foreground">Rewards Earned</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Share Your Referral Link</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-mono break-all">
                        {window.location.origin}?ref={referralData.referral_code}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={copyReferralLink} className="flex items-center gap-2">
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </Button>
                      <Button variant="outline" onClick={() => shareToSocial('email')} className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Button>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm text-muted-foreground mb-3">Share on social media:</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => shareToSocial('whatsapp')}
                          className="flex items-center gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        >
                          <MessageCircle className="h-4 w-4" />
                          WhatsApp
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => shareToSocial('facebook')}
                          className="flex items-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                        >
                          <Facebook className="h-4 w-4" />
                          Facebook
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => shareToSocial('instagram')}
                          className="flex items-center gap-2 bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100"
                        >
                          <Instagram className="h-4 w-4" />
                          Instagram
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => shareToSocial('twitter')}
                          className="flex items-center gap-2 bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100"
                        >
                          <Twitter className="h-4 w-4" />
                          Twitter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>How Referrals Work</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Share2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold mb-2">1. Share Your Link</h4>
                      <p className="text-sm text-muted-foreground">
                        Send your unique referral link to friends and family
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <ShoppingBag className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-semibold mb-2">2. They Shop</h4>
                      <p className="text-sm text-muted-foreground">
                        Your friends make their first purchase using your link
                      </p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Gift className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-semibold mb-2">3. Both Get Rewards</h4>
                      <p className="text-sm text-muted-foreground">
                        You both receive $5 off your next order!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <div className="space-y-6">
                {/* Notification Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about orders, promotions, and new products
                        </p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Get text updates for order status and delivery
                        </p>
                      </div>
                      <Switch id="sms-notifications" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="marketing-emails">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Special offers, discounts, and bakery news
                        </p>
                      </div>
                      <Switch id="marketing-emails" defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                {/* Dietary Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Dietary Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dietary-restrictions">Dietary Restrictions</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select restrictions" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="vegetarian">Vegetarian</SelectItem>
                            <SelectItem value="vegan">Vegan</SelectItem>
                            <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                            <SelectItem value="dairy-free">Dairy-Free</SelectItem>
                            <SelectItem value="nut-free">Nut-Free</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="favorite-categories">Favorite Categories</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bread">Bread</SelectItem>
                            <SelectItem value="pastries">Pastries</SelectItem>
                            <SelectItem value="desserts">Desserts</SelectItem>
                            <SelectItem value="seasonal">Seasonal Items</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special dietary needs or preferences..."
                        rows={3}
                      />
                    </div>

                    <Button className="w-full md:w-auto">
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>

                {/* Privacy Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Privacy Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="profile-visibility">Profile Visibility</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow others to see your reviews and ratings
                        </p>
                      </div>
                      <Switch id="profile-visibility" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="order-history">Order History Visibility</Label>
                        <p className="text-sm text-muted-foreground">
                          Show your recent orders for personalized recommendations
                        </p>
                      </div>
                      <Switch id="order-history" defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Sample orders */}
                    {[
                      {
                        id: "ORD-001",
                        date: "2024-01-15",
                        status: "Delivered",
                        total: "$24.75",
                        items: ["2x Artisan Croissants", "1x Sourdough Bread", "1x Danish Pastries"],
                      },
                      {
                        id: "ORD-002",
                        date: "2024-01-10",
                        status: "Delivered",
                        total: "$18.50",
                        items: ["1x Fruit Tarts", "2x Cinnamon Rolls"],
                      },
                      {
                        id: "ORD-003",
                        date: "2024-01-05",
                        status: "Delivered",
                        total: "$32.25",
                        items: ["1x Chocolate Éclairs", "2x Artisan Baguettes", "1x Multigrain Loaf"],
                      },
                    ].map((order) => (
                      <Card key={order.id} className="border border-border">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div>
                                <h4 className="font-semibold text-foreground">Order #{order.id}</h4>
                                <p className="text-sm text-muted-foreground">{order.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mt-2 md:mt-0">
                              <Badge 
                                variant={order.status === "Delivered" ? "default" : "secondary"}
                                className="shrink-0"
                              >
                                {order.status}
                              </Badge>
                              <span className="font-bold text-primary">{order.total}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground">Items:</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {order.items.map((item, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-2 mt-4">
                            <Button variant="outline" size="sm" className="flex-1">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              Reorder
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              Leave Review
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {/* Empty state */}
                  <div className="text-center py-8 mt-8 border-t border-border">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No orders yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start exploring our delicious products and place your first order
                    </p>
                    <Button onClick={() => router.push('/products')}>
                      Start Shopping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Shipping Addresses
                    </CardTitle>
                    <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Add Address
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add New Shipping Address</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="address-label">Address Label</Label>
                            <Input
                              id="address-label"
                              placeholder="e.g., Home, Work, Mom's House"
                              value={addressForm.label}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, label: e.target.value }))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="full-name">Full Name</Label>
                            <Input
                              id="full-name"
                              placeholder="Recipient's full name"
                              value={addressForm.fullName}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, fullName: e.target.value }))}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="street-address">Street Address</Label>
                            <Textarea
                              id="street-address"
                              placeholder="123 Main St, Apt 4B"
                              value={addressForm.streetAddress}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, streetAddress: e.target.value }))}
                              rows={2}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                placeholder="City"
                                value={addressForm.city}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="state">State</Label>
                              <Input
                                id="state"
                                placeholder="State"
                                value={addressForm.state}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="postal-code">Postal Code</Label>
                            <Input
                              id="postal-code"
                              placeholder="ZIP Code"
                              value={addressForm.postalCode}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, postalCode: e.target.value }))}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address-phone">Phone (Optional)</Label>
                            <Input
                              id="address-phone"
                              type="tel"
                              placeholder="Phone number for delivery"
                              value={addressForm.phone}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="delivery-notes">Delivery Notes (Optional)</Label>
                            <Textarea
                              id="delivery-notes"
                              placeholder="e.g., Leave at door, Ring doorbell, Call when arrived..."
                              value={addressForm.deliveryNotes}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, deliveryNotes: e.target.value }))}
                              rows={2}
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="is-default"
                              checked={addressForm.isDefault}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor="is-default" className="text-sm">
                              Set as default shipping address
                            </Label>
                          </div>

                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              📍 Location will be automatically pinned for delivery optimization (simulated for demo)
                            </p>
                          </div>

                          <div className="flex justify-end space-x-2 pt-4">
                            <Button 
                              variant="outline" 
                              onClick={() => setShowAddressDialog(false)}
                              disabled={saving}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleAddAddress}
                              disabled={saving || !addressForm.label || !addressForm.streetAddress || !addressForm.city}
                            >
                              {saving ? "Adding..." : "Add Address"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {profile?.shipping_addresses && profile.shipping_addresses.length > 0 ? (
                    <div className="space-y-4">
                      {profile.shipping_addresses.map((address) => (
                        <Card key={address.id} className="relative">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-foreground">
                                    {address.label}
                                  </h4>
                                  {address.is_default && (
                                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                                      Default
                                    </span>
                                  )}
                                </div>
                                {address.full_name && (
                                  <p className="text-sm font-medium text-foreground">
                                    {address.full_name}
                                  </p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                  {address.street_address}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {address.city}, {address.state} {address.postal_code}
                                </p>
                                {address.phone && (
                                  <p className="text-sm text-muted-foreground">
                                    📞 {address.phone}
                                  </p>
                                )}
                                {address.delivery_notes && (
                                  <p className="text-sm text-muted-foreground italic">
                                    📝 "{address.delivery_notes}"
                                  </p>
                                )}
                                {address.coordinates && (
                                  <p className="text-xs text-muted-foreground">
                                    📍 Location pinned: {address.coordinates.lat.toFixed(4)}, {address.coordinates.lng.toFixed(4)}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handlePinLocation(address)}
                                  className="flex items-center gap-1"
                                >
                                  <MapPin className="h-3 w-3" />
                                  Pin Location
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No addresses yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Add your first shipping address to get started
                      </p>
                      <Button 
                        onClick={() => setShowAddressDialog(true)}
                        variant="outline"
                      >
                        Add Your First Address
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Location Picker Dialog */}
          <Dialog open={showLocationPicker} onOpenChange={setShowLocationPicker}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Pin Your Location</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-linear-to-br from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Location Picker</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      In a real app, this would show an interactive map where you can:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                      <li>• Drag a pin to your exact location</li>
                      <li>• Use GPS to auto-detect current location</li>
                      <li>• Search for addresses and landmarks</li>
                      <li>• See delivery zones and estimated times</li>
                    </ul>
                    <div className="bg-white rounded p-3 border border-dashed border-gray-300 mb-4">
                      <p className="text-xs text-muted-foreground">
                        Demo: Simulating location update
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowLocationPicker(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // Simulate location update with random coordinates
                      const lat = 40.7128 + (Math.random() - 0.5) * 0.01;
                      const lng = -74.0060 + (Math.random() - 0.5) * 0.01;
                      handleLocationUpdate(lat, lng);
                    }}
                    className="flex-1"
                  >
                    Confirm Location
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default Profile;