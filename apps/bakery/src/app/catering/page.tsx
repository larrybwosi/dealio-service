'use client'
import { useState } from "react";
import { Calendar, Users, Clock, MapPin, Phone, Mail, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Page = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    eventTime: "",
    location: "",
    guestCount: "",
    dietaryRestrictions: "",
    budget: "",
    specialRequests: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Submitted!",
      description: "We'll contact you within 24 hours to discuss your catering needs.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      eventType: "",
      eventDate: "",
      eventTime: "",
      location: "",
      guestCount: "",
      dietaryRestrictions: "",
      budget: "",
      specialRequests: "",
    });
  };

  const cateringServices = [
    {
      title: "Corporate Events",
      description: "Professional catering for meetings, conferences, and office celebrations",
      features: ["Breakfast boxes", "Lunch platters", "Coffee service", "Pastry selections"],
      minGuests: "10+",
      icon: "🏢"
    },
    {
      title: "Weddings & Celebrations",
      description: "Elegant catering for your special day with custom cake and dessert tables",
      features: ["Wedding cakes", "Dessert bars", "Brunch menus", "Cocktail pastries"],
      minGuests: "25+",
      icon: "💒"
    },
    {
      title: "Private Parties",
      description: "Intimate gatherings with personalized menus and service",
      features: ["Artisan breads", "Gourmet platters", "Seasonal specialties", "Custom orders"],
      minGuests: "15+",
      icon: "🎉"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "Tech Innovations Corp",
      text: "Outstanding service for our quarterly meeting. The pastries were fresh and the presentation was beautiful.",
      rating: 5
    },
    {
      name: "Michael & Emma",
      company: "Wedding Celebration",
      text: "Our wedding dessert table was absolutely stunning. Guests are still talking about the artisan breads!",
      rating: 5
    },
    {
      name: "David Chen",
      company: "Birthday Party",
      text: "Professional service and incredible quality. Made our celebration truly special.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-secondary/10 to-hero/15" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-6 bg-secondary/20 text-secondary-foreground border-secondary/30">
                Professional Catering Services
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
                Exceptional Catering for
                <span className="block bg-linear-to-r from-primary via-secondary to-hero bg-clip-text text-transparent">
                  Every Occasion
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                From intimate gatherings to grand celebrations, we bring our artisan expertise 
                to your special events with fresh, beautifully crafted baked goods.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
                  Request Quote
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  View Portfolio
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
                Our Catering Services
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Professional catering tailored to your event's unique needs and style
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {cateringServices.map((service, index) => (
                <Card key={index} className="bg-card border-border/50 hover-lift group">
                  <CardHeader className="text-center pb-4">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <CardTitle className="text-xl font-display group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Minimum guests:</span>
                      <Badge variant="secondary">{service.minGuests}</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Includes:</p>
                      <ul className="space-y-1">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="h-3 w-3 text-secondary mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Request Form Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
                  Request Your Catering Quote
                </h2>
                <p className="text-lg text-muted-foreground">
                  Tell us about your event and we'll create a custom proposal for you
                </p>
              </div>

              <Card className="bg-card border-border/50 shadow-warm">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-foreground">
                          Phone Number *
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(555) 123-4567"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="eventType" className="text-sm font-medium text-foreground">
                          Event Type *
                        </label>
                        <Input
                          id="eventType"
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleInputChange}
                          placeholder="Wedding, Corporate, Birthday, etc."
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="eventDate" className="text-sm font-medium text-foreground">
                          Event Date *
                        </label>
                        <Input
                          id="eventDate"
                          name="eventDate"
                          type="date"
                          value={formData.eventDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="eventTime" className="text-sm font-medium text-foreground">
                          Event Time
                        </label>
                        <Input
                          id="eventTime"
                          name="eventTime"
                          type="time"
                          value={formData.eventTime}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="guestCount" className="text-sm font-medium text-foreground">
                          Guest Count *
                        </label>
                        <Input
                          id="guestCount"
                          name="guestCount"
                          type="number"
                          value={formData.guestCount}
                          onChange={handleInputChange}
                          placeholder="50"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium text-foreground">
                        Event Location *
                      </label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Full address of the event venue"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="budget" className="text-sm font-medium text-foreground">
                          Budget Range
                        </label>
                        <Input
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          placeholder="e.g., $500-1000"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="dietaryRestrictions" className="text-sm font-medium text-foreground">
                          Dietary Restrictions
                        </label>
                        <Input
                          id="dietaryRestrictions"
                          name="dietaryRestrictions"
                          value={formData.dietaryRestrictions}
                          onChange={handleInputChange}
                          placeholder="Vegan, Gluten-free, etc."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="specialRequests" className="text-sm font-medium text-foreground">
                        Special Requests & Additional Details
                      </label>
                      <Textarea
                        id="specialRequests"
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        placeholder="Tell us about any special requirements, themes, or specific items you'd like..."
                        rows={4}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90">
                      Submit Catering Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
                What Our Clients Say
              </h2>
              <p className="text-lg text-muted-foreground">
                Trusted by hundreds of satisfied customers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-card border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-secondary fill-secondary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h3 className="text-2xl font-display font-bold mb-4">Need to Discuss Your Event?</h3>
              <p className="mb-6 opacity-90">Our catering specialists are here to help plan your perfect event</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  <span>(555) 123-CAKE</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  <span>catering@bakery.com</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Page;