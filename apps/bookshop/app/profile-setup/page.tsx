'use client'
import { useState, useRef } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { useAuth, CustomerProfile } from '@/contexts/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  User,
  MapPin,
  Phone,
  Calendar,
  Upload,
  Camera,
  AlertTriangle,
  Clock,
  Users,
  Building2,
  CheckCircle,
  Loader2,
  Navigation
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfileSetup() {
  const router = useRouter();
  const { user, completeRegistration } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [isLocating, setIsLocating] = useState(false);

  const [profile, setProfile] = useState<CustomerProfile>({
    fullName: user?.name || '',
    phone: '',
    address: '',
    coordinates: undefined,
    deliveryNotes: '',
    allergies: '',
    preferredDeliveryTime: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    dateOfBirth: '',
    occupation: '',
    institution: '',
  });

  // Redirect if user is not authenticated
  if (!user) {
    router.push('/auth');
    return null;
  }

  // Redirect if user is already registered
  if (user.isRegistered) {
    router.push('/profile');
    return null;
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setProfile(prev => ({
            ...prev,
            coordinates: { lat: latitude, lng: longitude }
          }));
          setIsLocating(false);

          // Reverse geocoding to get address (simplified)
          fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=demo&limit=1`)
            .then(response => response.json())
            .then(data => {
              if (data.results && data.results.length > 0) {
                setProfile(prev => ({
                  ...prev,
                  address: data.results[0].formatted || prev.address
                }));
              }
            })
            .catch(() => {
              // Fallback if geocoding fails
              setProfile(prev => ({
                ...prev,
                address: prev.address || `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
              }));
            });
        },
        (error) => {
          setIsLocating(false);
          setError('Unable to get your location. Please enter your address manually.');
        }
      );
    } else {
      setIsLocating(false);
      setError('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!profile.fullName || !profile.phone || !profile.address) {
      setError('Please fill in all required fields (Name, Phone, Address).');
      setIsLoading(false);
      return;
    }

    try {
      const success = await completeRegistration(profile);
      if (success) {
        setSuccess('Profile completed successfully! Welcome to BookHub!');
        setTimeout(() => router.push('/'), 2000);
      } else {
        setError('Failed to complete registration. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Complete Your Profile</h1>
          <p className="text-slate-600">Help us provide you with the best shopping experience</p>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Basic information about yourself
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="h-8 w-8 text-slate-400" />
                    )}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-3 w-3" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <div>
                  <h3 className="font-medium">Profile Picture</h3>
                  <p className="text-sm text-slate-600 mb-2">Upload a photo to personalize your account</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose Photo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+254 700 000 000"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={profile.occupation}
                    onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                    placeholder="Your profession or job title"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="institution">Institution/Company (Optional)</Label>
                <Input
                  id="institution"
                  value={profile.institution}
                  onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                  placeholder="School, university, or company name"
                />
              </div>
            </CardContent>
          </Card>

          {/* Address & Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Address & Location
              </CardTitle>
              <CardDescription>
                Delivery address and location preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="address">Delivery Address *</Label>
                <div className="flex space-x-2">
                  <Textarea
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    placeholder="Enter your full delivery address"
                    rows={3}
                    className="flex-1"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={isLocating}
                    className="px-3"
                  >
                    {isLocating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Navigation className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {profile.coordinates && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      Location pinned: {profile.coordinates.lat.toFixed(6)}, {profile.coordinates.lng.toFixed(6)}
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="deliveryNotes">Delivery Notes</Label>
                <Textarea
                  id="deliveryNotes"
                  value={profile.deliveryNotes}
                  onChange={(e) => setProfile({ ...profile, deliveryNotes: e.target.value })}
                  placeholder="Special instructions for delivery (e.g., gate code, landmarks, preferred entrance)"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="preferredDeliveryTime">Preferred Delivery Time</Label>
                <Select
                  value={profile.preferredDeliveryTime}
                  onValueChange={(value) => setProfile({ ...profile, preferredDeliveryTime: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preferred time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                    <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                    <SelectItem value="anytime">Anytime</SelectItem>
                    <SelectItem value="weekends">Weekends Only</SelectItem>
                  </SelectContent>
                </Select>
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
              <CardDescription>
                Someone we can contact in case of delivery issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="emergencyName">Contact Name</Label>
                  <Input
                    id="emergencyName"
                    value={profile.emergencyContact?.name}
                    onChange={(e) => setProfile({
                      ...profile,
                      emergencyContact: { ...profile.emergencyContact!, name: e.target.value }
                    })}
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <Label htmlFor="emergencyPhone">Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={profile.emergencyContact?.phone}
                    onChange={(e) => setProfile({
                      ...profile,
                      emergencyContact: { ...profile.emergencyContact!, phone: e.target.value }
                    })}
                    placeholder="+254 700 000 000"
                  />
                </div>

                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Select
                    value={profile.emergencyContact?.relationship}
                    onValueChange={(value) => setProfile({
                      ...profile,
                      emergencyContact: { ...profile.emergencyContact!, relationship: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="colleague">Colleague</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health & Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Health & Preferences
              </CardTitle>
              <CardDescription>
                Important information for safe product recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="allergies">Allergies & Medical Conditions</Label>
                <Textarea
                  id="allergies"
                  value={profile.allergies}
                  onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                  placeholder="List any allergies, medical conditions, or dietary restrictions that might affect product recommendations (e.g., latex allergy, food sensitivities)"
                  rows={3}
                />
                <p className="text-xs text-slate-500 mt-1">
                  This information helps us recommend safe products and avoid items that might cause reactions
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 px-12"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing Profile...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete Registration
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}