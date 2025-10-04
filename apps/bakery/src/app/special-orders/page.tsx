"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Calendar,
  ChefHat,
  Gift,
  Heart,
  Star,
  CheckCircle,
  Upload,
  X,
  Coffee,
  Cake,
  Utensils,
  Users,
  Clock,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Simulated auth state - replace with your actual auth solution
const useAuth = () => {
  const [isAuthenticated] = useState(true); // Change to false to test signed-out state
  const [user] = useState({ name: "Jane Doe", email: "jane@example.com" });
  return { isAuthenticated, user };
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  orderType: string;
  serviceType: string;
  deliveryDate: string;
  eventTime: string;
  description: string;
  servingSize: string;
  flavors: string;
  decorations: string;
  budget: string;
  allergies: string;
  deliveryMethod: string;
  deliveryAddress: string;
  specialInstructions: string;
};

const Page = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("custom-cakes");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: isAuthenticated ? user.name : "",
      email: isAuthenticated ? user.email : "",
      phone: "",
      orderType: "",
      serviceType: "",
      deliveryDate: "",
      eventTime: "",
      description: "",
      servingSize: "",
      flavors: "",
      decorations: "",
      budget: "",
      allergies: "",
      deliveryMethod: "pickup",
      deliveryAddress: "",
      specialInstructions: "",
    },
  });

  const deliveryMethod = watch("deliveryMethod");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to upload images");
      return;
    }

    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length !== files.length) {
      toast.error("Only image files are allowed");
    }

    const totalFiles = uploadedFiles.length + validFiles.length;
    if (totalFiles > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setUploadedFiles((prev) => [...prev, ...validFiles].slice(0, 5));

    // Create preview URLs
    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

    toast.success(`${validFiles.length} image(s) uploaded successfully`);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
    console.log("Uploaded Files:", uploadedFiles);

    toast.success("Order Request Submitted!", {
      description:
        "Our team will review your request and contact you within 24-48 hours with a detailed quote and timeline.",
    });

    reset();
    setUploadedFiles([]);
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };

  const specialtyCategories = [
    {
      id: "custom-cakes",
      title: "Custom Cakes",
      description: "Bespoke celebration cakes for any occasion",
      icon: <Cake className="h-6 w-6" />,
      features: [
        "Multi-tier designs",
        "Custom flavors & fillings",
        "Intricate decorations",
        "Theme matching",
        "Edible images",
      ],
      leadTime: "7-14 days",
      priceRange: "$75-$500+",
      minOrder: "$75",
    },
    {
      id: "wedding-cakes",
      title: "Wedding Cakes",
      description: "Elegant wedding cakes for your special day",
      icon: <Heart className="h-6 w-6" />,
      features: [
        "Tiered designs",
        "Fresh or sugar flowers",
        "Cutting ceremony support",
        "Complimentary tasting",
        "Delivery & setup",
      ],
      leadTime: "14-30 days",
      priceRange: "$200-$1,000+",
      minOrder: "$200",
    },
    {
      id: "corporate-catering",
      title: "Corporate Catering",
      description: "Professional catering for business events",
      icon: <Users className="h-6 w-6" />,
      features: [
        "Breakfast pastries",
        "Sandwich platters",
        "Coffee service",
        "Dietary accommodations",
        "On-time delivery",
      ],
      leadTime: "3-7 days",
      priceRange: "$10-$25/person",
      minOrder: "10 people",
    },
    {
      id: "specialty-breads",
      title: "Specialty Breads",
      description: "Artisan breads and custom baked goods",
      icon: <ChefHat className="h-6 w-6" />,
      features: [
        "Sourdough varieties",
        "Ancient grains",
        "Custom shapes",
        "Seasonal ingredients",
        "Bulk orders",
      ],
      leadTime: "3-7 days",
      priceRange: "$8-$75+",
      minOrder: "$25",
    },
    {
      id: "dessert-tables",
      title: "Dessert Tables",
      description: "Complete dessert displays for events",
      icon: <Gift className="h-6 w-6" />,
      features: [
        "Curated selection",
        "Theme coordination",
        "Display setup",
        "Mix of treats",
        "Packaging included",
      ],
      leadTime: "7-14 days",
      priceRange: "$150-$800+",
      minOrder: "$150",
    },
    {
      id: "cafe-experiences",
      title: "Café Experiences",
      description: "Private café events and workshops",
      icon: <Coffee className="h-6 w-6" />,
      features: [
        "Private space rental",
        "Baking workshops",
        "Coffee tastings",
        "Brunch events",
        "Customized menus",
      ],
      leadTime: "14-30 days",
      priceRange: "$300-$2,000+",
      minOrder: "8 people",
    },
  ];

  const portfolioItems = [
    {
      title: "Three-Tier Wedding Cake",
      description: "Elegant vanilla and raspberry with cascading sugar flowers",
      category: "Wedding",
      serves: "120 guests",
      price: "$850",
    },
    {
      title: "Corporate Breakfast Event",
      description: "Assorted pastries, fresh fruit, and coffee service",
      category: "Corporate",
      serves: "50 guests",
      price: "$625",
    },
    {
      title: "Children's Character Cake",
      description: "3D sculpted design with detailed fondant work",
      category: "Birthday",
      serves: "25 guests",
      price: "$275",
    },
    {
      title: "Artisan Bread Collection",
      description: "Sourdough, focaccia, and seasonal varieties",
      category: "Specialty",
      serves: "30 guests",
      price: "$120",
    },
    {
      title: "Luxury Dessert Table",
      description: "Curated selection of macarons, tarts, and petit fours",
      category: "Dessert Table",
      serves: "60 guests",
      price: "$480",
    },
    {
      title: "Private Baking Workshop",
      description: "Hands-on sourdough bread making class",
      category: "Experience",
      serves: "12 guests",
      price: "$600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-rose-50/80 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-rose-950/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-100/20 via-transparent to-transparent dark:from-amber-900/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:border-amber-800 text-sm px-4 py-1.5">
              Professional Custom Orders
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              Exceptional Baked Goods
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400">
                Crafted for Your Occasion
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              From elegant wedding cakes to corporate catering, we deliver
              artisan quality and personalized service for every celebration and
              business need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg px-8 text-base"
              >
                Request a Quote
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 px-8 text-base"
              >
                View Portfolio
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Our Specialty Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your category to explore options and begin your custom
              order
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="max-w-7xl mx-auto"
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-12 h-auto p-1 bg-muted/50">
              {specialtyCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex flex-col items-center gap-2 py-3 px-2 data-[state=active]:bg-background data-[state=active]:shadow-sm min-h-[80px]"
                >
                  <div className="p-2 rounded-lg bg-primary/10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    {category.icon}
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">
                    {category.title}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {specialtyCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <Card className="bg-card border shadow-lg">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl w-fit">
                      <div className="scale-150">{category.icon}</div>
                    </div>
                    <CardTitle className="text-3xl font-bold">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center space-y-3 p-4 rounded-lg bg-muted/50">
                        <Calendar className="h-10 w-10 mx-auto text-amber-600 dark:text-amber-400" />
                        <h4 className="font-semibold text-sm">Lead Time</h4>
                        <p className="text-muted-foreground text-sm">
                          {category.leadTime}
                        </p>
                      </div>
                      <div className="text-center space-y-3 p-4 rounded-lg bg-muted/50">
                        <DollarSign className="h-10 w-10 mx-auto text-green-600 dark:text-green-400" />
                        <h4 className="font-semibold text-sm">Price Range</h4>
                        <p className="text-muted-foreground text-sm">
                          {category.priceRange}
                        </p>
                      </div>
                      <div className="text-center space-y-3 p-4 rounded-lg bg-muted/50">
                        <Users className="h-10 w-10 mx-auto text-blue-600 dark:text-blue-400" />
                        <h4 className="font-semibold text-sm">Minimum Order</h4>
                        <p className="text-muted-foreground text-sm">
                          {category.minOrder}
                        </p>
                      </div>
                      <div className="text-center space-y-3 p-4 rounded-lg bg-muted/50">
                        <CheckCircle className="h-10 w-10 mx-auto text-rose-600 dark:text-rose-400" />
                        <h4 className="font-semibold text-sm">Fully Custom</h4>
                        <p className="text-muted-foreground text-sm">
                          Made to order
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-6 border">
                      <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        What's Included
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {category.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Order Form Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Submit Your Custom Order Request
              </h2>
              <p className="text-lg text-muted-foreground">
                Provide details about your vision and we'll create a
                personalized quote
              </p>
            </div>

            <Card className="bg-card border shadow-xl">
              <CardContent className="p-8 md:p-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Contact Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2 pb-2 border-b">
                      <Users className="h-5 w-5" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="name"
                          {...register("name", {
                            required: "Name is required",
                          })}
                          placeholder="John Doe"
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          placeholder="john@example.com"
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value:
                              /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                            message: "Invalid phone number",
                          },
                        })}
                        placeholder="(555) 123-4567"
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2 pb-2 border-b">
                      <Cake className="h-5 w-5" />
                      Order Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="orderType"
                          className="text-sm font-medium"
                        >
                          Order Type <span className="text-red-500">*</span>
                        </label>
                        <Select
                          onValueChange={(value) =>
                            setValue("orderType", value)
                          }
                        >
                          <SelectTrigger
                            className={errors.orderType ? "border-red-500" : ""}
                          >
                            <SelectValue placeholder="Select order type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="custom-cake">
                              Custom Cake
                            </SelectItem>
                            <SelectItem value="wedding-cake">
                              Wedding Cake
                            </SelectItem>
                            <SelectItem value="corporate-catering">
                              Corporate Catering
                            </SelectItem>
                            <SelectItem value="specialty-bread">
                              Specialty Bread
                            </SelectItem>
                            <SelectItem value="dessert-table">
                              Dessert Table
                            </SelectItem>
                            <SelectItem value="cafe-experience">
                              Café Experience
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.orderType && (
                          <p className="text-sm text-red-500">
                            {errors.orderType.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="serviceType"
                          className="text-sm font-medium"
                        >
                          Service Type <span className="text-red-500">*</span>
                        </label>
                        <Select
                          onValueChange={(value) =>
                            setValue("serviceType", value)
                          }
                        >
                          <SelectTrigger
                            className={
                              errors.serviceType ? "border-red-500" : ""
                            }
                          >
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="birthday">
                              Birthday Party
                            </SelectItem>
                            <SelectItem value="wedding">Wedding</SelectItem>
                            <SelectItem value="corporate">
                              Corporate Event
                            </SelectItem>
                            <SelectItem value="anniversary">
                              Anniversary
                            </SelectItem>
                            <SelectItem value="baby-shower">
                              Baby Shower
                            </SelectItem>
                            <SelectItem value="graduation">
                              Graduation
                            </SelectItem>
                            <SelectItem value="holiday">Holiday</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.serviceType && (
                          <p className="text-sm text-red-500">
                            {errors.serviceType.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="deliveryDate"
                          className="text-sm font-medium"
                        >
                          Event Date <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="deliveryDate"
                          type="date"
                          {...register("deliveryDate", {
                            required: "Event date is required",
                          })}
                          className={
                            errors.deliveryDate ? "border-red-500" : ""
                          }
                          min={new Date().toISOString().split("T")[0]}
                        />
                        {errors.deliveryDate && (
                          <p className="text-sm text-red-500">
                            {errors.deliveryDate.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="eventTime"
                          className="text-sm font-medium"
                        >
                          Event Time
                        </label>
                        <Input
                          id="eventTime"
                          type="time"
                          {...register("eventTime")}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="servingSize"
                        className="text-sm font-medium"
                      >
                        Number of Servings/Guests{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="servingSize"
                        type="number"
                        {...register("servingSize", {
                          required: "Serving size is required",
                          min: { value: 1, message: "Must be at least 1" },
                        })}
                        placeholder="e.g., 50"
                        className={errors.servingSize ? "border-red-500" : ""}
                      />
                      {errors.servingSize && (
                        <p className="text-sm text-red-500">
                          {errors.servingSize.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Detailed Description{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        id="description"
                        {...register("description", {
                          required: "Description is required",
                          minLength: {
                            value: 20,
                            message: "Please provide at least 20 characters",
                          },
                        })}
                        placeholder="Describe your vision in detail - size, shape, theme, colors, occasion, style preferences, etc."
                        rows={5}
                        className={errors.description ? "border-red-500" : ""}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2 pb-2 border-b">
                      <Star className="h-5 w-5" />
                      Preferences & Requirements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="flavors"
                          className="text-sm font-medium"
                        >
                          Preferred Flavors
                        </label>
                        <Input
                          id="flavors"
                          {...register("flavors")}
                          placeholder="e.g., Vanilla, chocolate, lemon, red velvet"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="decorations"
                          className="text-sm font-medium"
                        >
                          Decoration Style
                        </label>
                        <Input
                          id="decorations"
                          {...register("decorations")}
                          placeholder="e.g., Buttercream, fondant, fresh flowers"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="budget" className="text-sm font-medium">
                          Budget Range
                        </label>
                        <Select
                          onValueChange={(value) => setValue("budget", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-100">
                              Under $100
                            </SelectItem>
                            <SelectItem value="100-250">$100 - $250</SelectItem>
                            <SelectItem value="250-500">$250 - $500</SelectItem>
                            <SelectItem value="500-1000">
                              $500 - $1,000
                            </SelectItem>
                            <SelectItem value="1000-plus">$1,000+</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="allergies"
                          className="text-sm font-medium"
                        >
                          Allergies / Dietary Restrictions
                        </label>
                        <Input
                          id="allergies"
                          {...register("allergies")}
                          placeholder="e.g., Gluten-free, dairy-free, nut allergies"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2 pb-2 border-b">
                      <Utensils className="h-5 w-5" />
                      Delivery Information
                    </h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Delivery Method <span className="text-red-500">*</span>
                      </label>
                      <Select
                        onValueChange={(value) =>
                          setValue("deliveryMethod", value)
                        }
                        defaultValue="pickup"
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pickup">Store Pickup</SelectItem>
                          <SelectItem value="delivery">
                            Local Delivery
                          </SelectItem>
                          <SelectItem value="setup">
                            Delivery with Setup
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(deliveryMethod === "delivery" ||
                      deliveryMethod === "setup") && (
                      <div className="space-y-2">
                        <label
                          htmlFor="deliveryAddress"
                          className="text-sm font-medium"
                        >
                          Delivery Address{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          id="deliveryAddress"
                          {...register("deliveryAddress", {
                            required:
                              deliveryMethod !== "pickup"
                                ? "Delivery address is required"
                                : false,
                          })}
                          placeholder="Street address, city, state, zip code"
                          rows={3}
                          className={
                            errors.deliveryAddress ? "border-red-500" : ""
                          }
                        />
                        {errors.deliveryAddress && (
                          <p className="text-sm text-red-500">
                            {errors.deliveryAddress.message}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <label
                        htmlFor="specialInstructions"
                        className="text-sm font-medium"
                      >
                        Special Instructions
                      </label>
                      <Textarea
                        id="specialInstructions"
                        {...register("specialInstructions")}
                        placeholder="Any additional notes, parking instructions, setup requirements, etc."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2 pb-2 border-b">
                      <ImageIcon className="h-5 w-5" />
                      Reference Images
                      {!isAuthenticated && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Sign in required
                        </Badge>
                      )}
                    </h3>

                    {!isAuthenticated ? (
                      <div className="border-2 border-dashed rounded-xl p-8 text-center bg-muted/30">
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                        <p className="text-muted-foreground mb-2">
                          Please sign in to upload reference images
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload inspiration photos to help us understand your
                          vision
                        </p>
                        <Button type="button" variant="outline">
                          Sign In to Upload
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="border-2 border-dashed rounded-xl p-8 text-center bg-gradient-to-br from-muted/30 to-muted/10 hover:border-primary/50 transition-colors">
                          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                          <p className="text-sm font-medium mb-2">
                            Upload Reference Images
                          </p>
                          <p className="text-xs text-muted-foreground mb-4">
                            Drag and drop images here, or click to browse (Max 5
                            images, 10MB each)
                          </p>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              document.getElementById("file-upload")?.click()
                            }
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Images
                          </Button>
                        </div>

                        {uploadedFiles.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-sm font-medium">
                              Uploaded Images ({uploadedFiles.length}/5)
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                              {uploadedFiles.map((file, index) => (
                                <div key={index} className="relative group">
                                  <div className="aspect-square rounded-lg overflow-hidden bg-muted border-2 border-border">
                                    <img
                                      src={previewUrls[index]}
                                      alt={`Preview ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    onClick={() => removeFile(index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                  <p className="text-xs text-muted-foreground mt-1 truncate">
                                    {file.name}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg text-base font-semibold"
                    >
                      Submit Order Request
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-4">
                      By submitting this form, you agree to our terms of service
                      and privacy policy. We'll contact you within 24-48 hours
                      with a detailed quote.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Recent Creations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore examples of our custom work to inspire your order
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {portfolioItems.map((item, index) => (
              <Card
                key={index}
                className="bg-card border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center overflow-hidden">
                    <ChefHat className="h-16 w-16 text-muted-foreground/40 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {item.price}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-3 w-3 mr-1" />
                      Serves: {item.serves}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Our streamlined process from concept to creation
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Connection line for desktop */}
              <div
                className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-200 via-orange-200 to-rose-200 dark:from-amber-800 dark:via-orange-800 dark:to-rose-800"
                style={{ top: "32px", left: "10%", right: "10%" }}
              />

              {[
                {
                  step: "1",
                  title: "Submit Request",
                  desc: "Complete our detailed order form with your vision and requirements",
                  icon: <Upload className="h-6 w-6" />,
                },
                {
                  step: "2",
                  title: "Consultation",
                  desc: "We'll discuss details, provide a quote, and refine your order",
                  icon: <Users className="h-6 w-6" />,
                },
                {
                  step: "3",
                  title: "Creation",
                  desc: "Our artisans handcraft your custom order with premium ingredients",
                  icon: <ChefHat className="h-6 w-6" />,
                },
                {
                  step: "4",
                  title: "Delivery",
                  desc: "Fresh delivery or pickup on your scheduled date",
                  icon: <Clock className="h-6 w-6" />,
                },
              ].map((item, index) => (
                <div key={index} className="text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg">
                    {item.icon}
                  </div>
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3 -mt-2">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-rose-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Create Something Special?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's bring your vision to life with our premium baked goods and
              personalized service. Our team is ready to help you create an
              unforgettable experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg px-8"
              >
                Get Started Today
              </Button>
              <Button size="lg" variant="outline" className="border-2 px-8">
                Call Us: (555) 123-4567
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Questions? Email us at{" "}
              <a
                href="mailto:orders@bakery.com"
                className="text-amber-600 hover:underline"
              >
                orders@bakery.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
