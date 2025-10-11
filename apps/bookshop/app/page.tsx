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

export default function DenvisHomepage() {
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
        "Denvis transformed how I source academic materials. Their extensive collection and knowledgeable staff make research so much easier. A true partner in education!",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      achievement: "Published 15+ research papers",
    },
    {
      name: "James Ochieng",
      role: "Tech Entrepreneur",
      content:
        "From startup to scale-up, Denvis has been our go-to for office equipment and tech. Their business solutions saved us thousands while maintaining quality. Exceptional service!",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      achievement: "Built 3 successful startups",
    },
    {
      name: "Linda Akinyi",
      role: "Medical Student",
      content:
        "As a medical student, I need reliable resources. Denvis's textbook selection and student discounts have been a lifesaver throughout my studies. Highly recommended!",
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
            backgroundImage: "url('https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80')",
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 xl:py-32">
          <div className="text-center">
            {/* Social Proof Badge */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <Badge className="bg-amber-600/20 text-amber-200 border-amber-600/30 px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm font-medium">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Trusted by 15,000+ Customers Across Kenya
              </Badge>
            </div>

            {/* Main Headline - Marketing Focused */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 leading-tight">
              Where Knowledge
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                Meets Success
              </span>
            </h1>

            {/* Compelling Subheadline */}
            <p className="text-base sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 text-slate-200 max-w-4xl mx-auto leading-relaxed font-light px-4">
              From bestselling books to cutting-edge laptops, we're Kenya's
              premier destination for{" "}
              <span className="text-amber-300 font-semibold">
                students, professionals, and visionaries
              </span>
              who refuse to settle for ordinary.
            </p>

            {/* Value Proposition */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 sm:mb-12 text-slate-300 text-sm sm:text-base">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-2" />
                <span>Same-Day Delivery</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-2" />
                <span>Expert Consultation</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-2" />
                <span>Best Price Guarantee</span>
              </div>
            </div>

            {/* Enhanced CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              >
                <Link href="/products" className="flex items-center justify-center">
                  Start Shopping <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold backdrop-blur-sm w-full sm:w-auto"
              >
                <a href="#locations" className="flex items-center justify-center">
                  Visit Our Stores <MapPin className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              </Button>
            </div>

            {/* Achievement Stats - Marketing Focused */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto px-4">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="mb-2 sm:mb-3">
                      <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400 mx-auto mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-amber-400">
                        {achievement.number}
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-white">
                      {achievement.label}
                    </div>
                    <div className="text-xs text-slate-300 mt-1 hidden xs:block">
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
        className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <Badge className="mb-4 sm:mb-6 bg-amber-100 text-amber-800 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">
                Our Story
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6 sm:mb-8 leading-tight">
                Empowering Dreams,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                  One Book at a Time
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 leading-relaxed">
                Born in 2020 from a simple belief:{" "}
                <strong>
                  access to knowledge should never be a barrier to success.
                </strong>
                We started as a small bookstore with big dreams and have grown
                into Kenya's most trusted educational and professional resource
                hub.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-8 sm:mb-10 leading-relaxed">
                Today, we serve over 15,000 customers - from ambitious students
                to Fortune 500 companies - providing not just products, but
                partnerships in their journey to excellence.
              </p>

              {/* Mission Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
                <div className="flex items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 mb-1 text-sm sm:text-base">
                      Customer Obsessed
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600">
                      Your success is our only metric that matters
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 mb-1 text-sm sm:text-base">
                      Quality Guaranteed
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600">
                      Only authentic products, rigorously verified
                    </div>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
              >
                Discover Our Impact
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://media.istockphoto.com/id/1092141430/photo/young-girl-student.webp?a=1&b=1&s=612x612&w=0&k=20&c=045CqQp2MbWI8c8nl90Uu-UBDterams_bVVO0JNlTpg="
                  alt="Denvis Store Interior"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Achievement Cards */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-8 sm:-left-8 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl border">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-600">4.9★</div>
                <div className="text-xs sm:text-sm text-slate-600 font-medium">
                  Customer Rating
                </div>
                <div className="text-xs text-slate-500 mt-1 hidden sm:block">
                  From 2,500+ reviews
                </div>
              </div>

              <div className="absolute -top-4 -right-4 sm:-top-8 sm:-right-8 bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl">
                <div className="text-lg sm:text-xl md:text-2xl font-bold">98%</div>
                <div className="text-xs sm:text-sm font-medium">Return Rate</div>
                <div className="text-xs opacity-90 mt-1 hidden sm:block">Customer loyalty</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories - Enhanced Visual Appeal */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <Badge className="mb-4 sm:mb-6 bg-amber-100 text-amber-800 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">
              Shop by Category
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 sm:mb-6">
              Everything You Need to
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Achieve Greatness
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
              Explore our carefully curated categories, each designed to fuel
              your ambitions and accelerate your success
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white to-slate-50"
                >
                  <CardHeader className="text-center pb-3 sm:pb-4 relative">
                    <div
                      className={`mx-auto w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br ${category.color} rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}
                    >
                      <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors mb-2">
                      {category.title}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs font-medium">
                      {category.count}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-slate-600 leading-relaxed text-sm sm:text-base">
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
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <Badge className="mb-4 sm:mb-6 bg-amber-100 text-amber-800 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">
              Customer Favorites
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 sm:mb-6">
              Products That
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Change Lives
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
              Discover why thousands of customers choose these game-changing
              products to fuel their success
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-16">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group">
                <ProductCard product={product} />
                <div className="mt-3 sm:mt-4 text-center">
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
              className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white px-6 sm:px-8 lg:px-10 py-2.5 sm:py-3 lg:py-4 shadow-xl text-sm sm:text-base"
            >
              <Link href="/products" className="flex items-center justify-center">
                Explore All Products <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials - Enhanced for Social Proof */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <Badge className="mb-4 sm:mb-6 bg-amber-100 text-amber-800 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">
              Success Stories
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 sm:mb-6">
              Real People,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Real Results
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
              See how Denvis has transformed the journeys of students,
              professionals, and entrepreneurs across Kenya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden group"
              >
                <CardHeader className="relative">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full mr-3 sm:mr-4 ring-2 sm:ring-4 ring-amber-100"
                    />
                    <div>
                      <div className="font-bold text-slate-800 text-base sm:text-lg">
                        {testimonial.name}
                      </div>
                      <div className="text-amber-600 font-medium text-sm sm:text-base">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 hidden sm:block">
                        {testimonial.achievement}
                      </div>
                    </div>
                  </div>
                  <div className="flex text-amber-400 mb-3 sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600 mb-3 sm:mb-4 opacity-50" />
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base lg:text-lg italic">
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
        className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <Badge className="mb-4 sm:mb-6 bg-amber-100 text-amber-800 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">
              Visit Us
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 sm:mb-6">
              Find Us Across
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Nairobi
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
              Three convenient locations designed to serve you better, each with
              expert staff ready to help
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Branch with Google Map */}
            <div className="lg:col-span-2">
              <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 sm:p-6">
                  <CardTitle className="flex items-center text-xl sm:text-2xl">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                    {mainBranch.name}
                    <Badge className="ml-2 sm:ml-3 bg-white/20 text-white text-xs">
                      Flagship Store
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-amber-100 text-sm sm:text-base lg:text-lg">
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
                      title="Denvis Westlands Location"
                    ></iframe>
                  </div>

                  <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="flex items-center text-slate-600 text-sm sm:text-base">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-amber-600 flex-shrink-0" />
                        <span>{mainBranch.address}</span>
                      </div>
                      <div className="flex items-center text-slate-600 text-sm sm:text-base">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-amber-600 flex-shrink-0" />
                        <span>{mainBranch.phone}</span>
                      </div>
                      <div className="flex items-center text-slate-600 text-sm sm:text-base">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-amber-600 flex-shrink-0" />
                        <span>{mainBranch.hours}</span>
                      </div>
                      <div className="flex items-center text-slate-600 text-sm sm:text-base">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-amber-600 flex-shrink-0" />
                        <span>Manager: {mainBranch.manager}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                      <Button className="flex-1 bg-amber-600 hover:bg-amber-700 text-sm sm:text-base h-10 sm:h-11">
                        <Navigation className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Get Directions
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-sm sm:text-base h-10 sm:h-11"
                        onClick={() =>
                          window.open(mainBranch.googleMapsUrl, "_blank")
                        }
                      >
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        View in Google Maps
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Other Branches */}
            <div className="space-y-4 sm:space-y-6">
              {otherBranches.map((branch, index) => (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-300 border-0 shadow-md"
                >
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center text-lg sm:text-xl text-slate-800">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mr-2 sm:mr-3" />
                      {branch.name}
                    </CardTitle>
                    <CardDescription className="text-slate-600 text-sm sm:text-base">
                      {branch.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-2 sm:space-y-3">
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center text-slate-600">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-amber-600 flex-shrink-0" />
                        {branch.address}
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-amber-600 flex-shrink-0" />
                        {branch.phone}
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-amber-600 flex-shrink-0" />
                        {branch.hours}
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-amber-600 flex-shrink-0" />
                        {branch.manager}
                      </div>
                    </div>
                    <Button className="w-full mt-3 sm:mt-4 bg-slate-800 hover:bg-slate-700 text-sm sm:text-base h-9 sm:h-10">
                      <Navigation className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
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
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <Badge className="mb-4 sm:mb-6 bg-amber-100 text-amber-800 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">
              Why Denvis
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 sm:mb-6">
              The Denvis
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Advantage
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
              Discover what sets us apart and why thousands of customers choose
              Denvis for their success journey
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={index}
                  className="text-center group hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 group-hover:shadow-xl transition-all duration-300">
                    <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-amber-600" />
                  </div>
                  <Badge className="mb-2 sm:mb-3 bg-amber-50 text-amber-700 text-xs font-medium">
                    {benefit.highlight}
                  </Badge>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter - Enhanced CTA */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <Mail className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-amber-400 mx-auto mb-6 sm:mb-8" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">
              Join the Success
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                Community
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 sm:mb-12 leading-relaxed px-4">
              Get exclusive access to new arrivals, expert insights, special
              discounts, and success stories from our community of achievers.
              Plus, receive a{" "}
              <strong className="text-amber-300">10% welcome discount</strong>{" "}
              on your first order!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-lg mx-auto mb-6 sm:mb-8 px-4">
              <Input
                type="email"
                placeholder="Enter your email for exclusive access"
                className="flex-1 bg-white/10 backdrop-blur-sm text-white placeholder:text-slate-300 border-white/20 h-12 sm:h-14 text-sm sm:text-base lg:text-lg"
              />
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-6 sm:px-8 h-12 sm:h-14 font-semibold text-sm sm:text-base lg:text-lg shadow-xl">
                Get 10% Off
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400 px-4">
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 mr-1 sm:mr-2" />
                <span>15,000+ subscribers</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 mr-1 sm:mr-2" />
                <span>No spam, ever</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 mr-1 sm:mr-2" />
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