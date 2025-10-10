'use client'
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import {
  BookOpen,
  Laptop,
  PenTool,
  Calculator,
  GraduationCap,
  Briefcase,
  MapPin,
  Phone,
  Star,
  Users,
  Award,
  Truck,
  Mail,
  Clock,
  Quote,
  ArrowRight,
  Target,
  Heart,
  Shield,
  ExternalLink,
  Navigation,
  Zap,
  TrendingUp,
  Globe,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function BookHubHomepage() {
  const categories = [
    {
      icon: BookOpen,
      title: "Books & Reading Materials",
      description:
        "From bestsellers to academic texts - fuel your mind with knowledge",
      count: "2,500+ titles",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Briefcase,
      title: "Office Supplies",
      description: "Professional-grade supplies to power your productivity",
      count: "1,200+ items",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Laptop,
      title: "Laptops & Technology",
      description: "Cutting-edge tech to accelerate your success",
      count: "300+ devices",
      color: "from-purple-500 to-violet-600",
    },
    {
      icon: PenTool,
      title: "Stationery & Art Supplies",
      description: "Creative tools to bring your ideas to life",
      count: "800+ supplies",
      color: "from-pink-500 to-rose-600",
    },
    {
      icon: GraduationCap,
      title: "Student Essentials",
      description: "Everything students need to excel academically",
      count: "600+ essentials",
      color: "from-orange-500 to-amber-600",
    },
    {
      icon: Calculator,
      title: "Business Equipment",
      description: "Professional tools for serious business operations",
      count: "200+ tools",
      color: "from-teal-500 to-cyan-600",
    },
  ];

  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 3);

  const mainBranch = {
    name: "Westlands Branch",
    address: "Westlands Shopping Center, Nairobi",
    phone: "+254 700 123 456",
    hours: "Mon-Sat: 8AM-8PM, Sun: 10AM-6PM",
    manager: "Sarah Kimani",
    description: "Our flagship store with the largest selection",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8199!2d36.8062!3d-1.2634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTUnNDguMiJTIDM2wrA0OCcyMi4zIkU!5e0!3m2!1sen!2ske!4v1234567890",
    googleMapsUrl:
      "https://maps.google.com/?q=Westlands+Shopping+Center+Nairobi",
  };

  const otherBranches = [
    {
      name: "CBD Branch",
      address: "Kimathi Street, Nairobi CBD",
      phone: "+254 700 123 457",
      hours: "Mon-Sat: 8AM-8PM, Sun: 10AM-6PM",
      manager: "John Mwangi",
      description: "Convenient city center location",
    },
    {
      name: "Parklands Branch",
      address: "Parklands Plaza, Nairobi",
      phone: "+254 700 123 458",
      hours: "Mon-Sat: 8AM-8PM, Sun: 10AM-6PM",
      manager: "Grace Wanjiku",
      description: "Family-friendly neighborhood store",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Mary Njeri",
      role: "University Professor",
      content:
        "BookHub transformed how I source academic materials. Their extensive collection and knowledgeable staff make research so much easier. A true partner in education!",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      achievement: "Published 15+ research papers",
    },
    {
      name: "James Ochieng",
      role: "Tech Entrepreneur",
      content:
        "From startup to scale-up, BookHub has been our go-to for office equipment and tech. Their business solutions saved us thousands while maintaining quality. Exceptional service!",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      achievement: "Built 3 successful startups",
    },
    {
      name: "Linda Akinyi",
      role: "Medical Student",
      content:
        "As a medical student, I need reliable resources. BookHub's textbook selection and student discounts have been a lifesaver throughout my studies. Highly recommended!",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      achievement: "Dean's List 4 semesters",
    },
  ];

  const achievements = [
    {
      icon: Users,
      number: "15,000+",
      label: "Happy Customers",
      description: "Trusted by professionals, students, and businesses",
    },
    {
      icon: BookOpen,
      number: "5,000+",
      label: "Products",
      description: "Carefully curated selection across all categories",
    },
    {
      icon: Award,
      number: "4.9/5",
      label: "Customer Rating",
      description: "Consistently excellent service and quality",
    },
    {
      icon: TrendingUp,
      number: "98%",
      label: "Satisfaction Rate",
      description: "Customers who return and recommend us",
    },
  ];

  const benefits = [
    {
      icon: Target,
      title: "Curated Excellence",
      description:
        "Every product is hand-selected for quality, relevance, and value",
      highlight: "Quality First",
    },
    {
      icon: Zap,
      title: "Lightning Fast Service",
      description: "Same-day delivery in Nairobi, expert advice in minutes",
      highlight: "Speed & Expertise",
    },
    {
      icon: Globe,
      title: "Complete Ecosystem",
      description:
        "From books to tech - everything you need in one trusted place",
      highlight: "One-Stop Solution",
    },
    {
      icon: Heart,
      title: "Community Impact",
      description: "Supporting local education and businesses since 2020",
      highlight: "Local Impact",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Enhanced for Marketing */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="absolute inset-0 bg-black/40"></div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=1080&fit=crop')",
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Social Proof Badge */}
            <div className="flex justify-center mb-8">
              <Badge className="bg-amber-600/20 text-amber-200 border-amber-600/30 px-6 py-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 mr-2" />
                Trusted by 15,000+ Customers Across Kenya
              </Badge>
            </div>

            {/* Main Headline - Marketing Focused */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              Where Knowledge
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                Meets Success
              </span>
            </h1>

            {/* Compelling Subheadline */}
            <p className="text-xl md:text-3xl mb-8 text-slate-200 max-w-5xl mx-auto leading-relaxed font-light">
              From bestselling books to cutting-edge laptops, we're Kenya's
              premier destination for{" "}
              <span className="text-amber-300 font-semibold">
                students, professionals, and visionaries
              </span>
              who refuse to settle for ordinary.
            </p>

            {/* Value Proposition */}
            <div className="flex flex-wrap justify-center gap-6 mb-12 text-slate-300">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span>Same-Day Delivery</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span>Expert Consultation</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span>Best Price Guarantee</span>
              </div>
            </div>

            {/* Enhanced CTAs */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-10 py-4 text-lg font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Link href="/products" className="flex items-center">
                  Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-10 py-4 text-lg font-semibold backdrop-blur-sm"
              >
                <a href="#locations" className="flex items-center">
                  Visit Our Stores <MapPin className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>

            {/* Achievement Stats - Marketing Focused */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="mb-3">
                      <IconComponent className="h-8 w-8 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-3xl md:text-4xl font-bold text-amber-400">
                        {achievement.number}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-white">
                      {achievement.label}
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      {achievement.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section - Enhanced for Branding */}
      <section
        id="about"
        className="py-24 bg-gradient-to-br from-slate-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-amber-100 text-amber-800 px-4 py-2">
                Our Story
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8 leading-tight">
                Empowering Dreams,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                  One Book at a Time
                </span>
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Born in 2020 from a simple belief:{" "}
                <strong>
                  access to knowledge should never be a barrier to success.
                </strong>
                We started as a small bookstore with big dreams and have grown
                into Kenya's most trusted educational and professional resource
                hub.
              </p>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Today, we serve over 15,000 customers - from ambitious students
                to Fortune 500 companies - providing not just products, but
                partnerships in their journey to excellence.
              </p>

              {/* Mission Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 mb-1">
                      Customer Obsessed
                    </div>
                    <div className="text-sm text-slate-600">
                      Your success is our only metric that matters
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 mb-1">
                      Quality Guaranteed
                    </div>
                    <div className="text-sm text-slate-600">
                      Only authentic products, rigorously verified
                    </div>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3"
              >
                Discover Our Impact
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop"
                  alt="BookHub Store Interior"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Achievement Cards */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border">
                <div className="text-3xl font-bold text-amber-600">4.9★</div>
                <div className="text-sm text-slate-600 font-medium">
                  Customer Rating
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  From 2,500+ reviews
                </div>
              </div>

              <div className="absolute -top-8 -right-8 bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-xl">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm font-medium">Return Rate</div>
                <div className="text-xs opacity-90 mt-1">Customer loyalty</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories - Enhanced Visual Appeal */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-amber-100 text-amber-800 px-4 py-2">
              Shop by Category
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Everything You Need to
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Achieve Greatness
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Explore our carefully curated categories, each designed to fuel
              your ambitions and accelerate your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white to-slate-50"
                >
                  <CardHeader className="text-center pb-4 relative">
                    <div
                      className={`mx-auto w-24 h-24 bg-gradient-to-br ${category.color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}
                    >
                      <IconComponent className="h-12 w-12 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors mb-2">
                      {category.title}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs font-medium">
                      {category.count}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-slate-600 leading-relaxed text-base">
                      {category.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products - Marketing Focused */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-amber-100 text-amber-800 px-4 py-2">
              Customer Favorites
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Products That
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Change Lives
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover why thousands of customers choose these game-changing
              products to fuel their success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group">
                <ProductCard product={product} />
                <div className="mt-4 text-center">
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    ⭐ Customer Favorite
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white px-10 py-4 shadow-xl"
            >
              <Link href="/products" className="flex items-center">
                Explore All Products <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials - Enhanced for Social Proof */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-amber-100 text-amber-800 px-4 py-2">
              Success Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Real People,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Real Results
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              See how BookHub has transformed the journeys of students,
              professionals, and entrepreneurs across Kenya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden group"
              >
                <CardHeader className="relative">
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full mr-4 ring-4 ring-amber-100"
                    />
                    <div>
                      <div className="font-bold text-slate-800 text-lg">
                        {testimonial.name}
                      </div>
                      <div className="text-amber-600 font-medium">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {testimonial.achievement}
                      </div>
                    </div>
                  </div>
                  <div className="flex text-amber-400 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <Quote className="h-8 w-8 text-amber-600 mb-4 opacity-50" />
                  <p className="text-slate-600 leading-relaxed text-lg italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Locations Section - Enhanced with Google Map */}
      <section
        id="locations"
        className="py-24 bg-gradient-to-br from-slate-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-amber-100 text-amber-800 px-4 py-2">
              Visit Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Find Us Across
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Nairobi
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Three convenient locations designed to serve you better, each with
              expert staff ready to help
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Branch with Google Map */}
            <div className="lg:col-span-2">
              <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                  <CardTitle className="flex items-center text-2xl">
                    <MapPin className="h-6 w-6 mr-3" />
                    {mainBranch.name}
                    <Badge className="ml-3 bg-white/20 text-white">
                      Flagship Store
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-amber-100 text-lg">
                    {mainBranch.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Google Map Embed */}
                  <div className="aspect-video w-full">
                    <iframe
                      src={mainBranch.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="BookHub Westlands Location"
                    ></iframe>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-slate-600">
                        <MapPin className="h-5 w-5 mr-3 text-amber-600" />
                        <span>{mainBranch.address}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Phone className="h-5 w-5 mr-3 text-amber-600" />
                        <span>{mainBranch.phone}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Clock className="h-5 w-5 mr-3 text-amber-600" />
                        <span>{mainBranch.hours}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Users className="h-5 w-5 mr-3 text-amber-600" />
                        <span>Manager: {mainBranch.manager}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button className="flex-1 bg-amber-600 hover:bg-amber-700">
                        <Navigation className="h-4 w-4 mr-2" />
                        Get Directions
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() =>
                          window.open(mainBranch.googleMapsUrl, "_blank")
                        }
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View in Google Maps
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Other Branches */}
            <div className="space-y-6">
              {otherBranches.map((branch, index) => (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-300 border-0 shadow-md"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl text-slate-800">
                      <MapPin className="h-5 w-5 text-amber-600 mr-3" />
                      {branch.name}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {branch.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-slate-600">
                        <MapPin className="h-4 w-4 mr-2 text-amber-600" />
                        {branch.address}
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Phone className="h-4 w-4 mr-2 text-amber-600" />
                        {branch.phone}
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Clock className="h-4 w-4 mr-2 text-amber-600" />
                        {branch.hours}
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Users className="h-4 w-4 mr-2 text-amber-600" />
                        {branch.manager}
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-slate-800 hover:bg-slate-700">
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Enhanced for Marketing */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-amber-100 text-amber-800 px-4 py-2">
              Why BookHub
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              The BookHub
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Advantage
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Discover what sets us apart and why thousands of customers choose
              BookHub for their success journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={index}
                  className="text-center group hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-200 rounded-3xl flex items-center justify-center mb-6 group-hover:shadow-xl transition-all duration-300">
                    <IconComponent className="h-12 w-12 text-amber-600" />
                  </div>
                  <Badge className="mb-3 bg-amber-50 text-amber-700 text-xs font-medium">
                    {benefit.highlight}
                  </Badge>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter - Enhanced CTA */}
      <section className="py-24 bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <Mail className="h-20 w-20 text-amber-400 mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Join the Success
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                Community
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-12 leading-relaxed">
              Get exclusive access to new arrivals, expert insights, special
              discounts, and success stories from our community of achievers.
              Plus, receive a{" "}
              <strong className="text-amber-300">10% welcome discount</strong>{" "}
              on your first order!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8">
              <Input
                type="email"
                placeholder="Enter your email for exclusive access"
                className="flex-1 bg-white/10 backdrop-blur-sm text-white placeholder:text-slate-300 border-white/20 h-14 text-lg"
              />
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-8 h-14 font-semibold text-lg shadow-xl">
                Get 10% Off
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                <span>15,000+ subscribers</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                <span>No spam, ever</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                <span>Unsubscribe anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
