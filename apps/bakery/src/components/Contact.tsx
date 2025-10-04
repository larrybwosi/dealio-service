'use client'
import { MapPin, Clock, Phone, Mail, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const hours = [
    { day: "Monday - Friday", hours: "6:00 AM - 7:00 PM" },
    { day: "Saturday", hours: "6:00 AM - 8:00 PM" },
    { day: "Sunday", hours: "7:00 AM - 6:00 PM" },
  ];

  const handleGetDirections = () => {
    const address =
      "Cheptulu Market, Cheptulu - Chavakali Road, P.O.Box 388, Serem";
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Visit Our
            <span className="block text-primary">Bakery</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Come experience the warmth and aroma of our bakery. We're located in
            the heart of downtown, ready to serve you fresh baked goods every
            day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Location */}
            <div className="bakery-card">
              <div className="flex items-start space-x-4">
                <div className="shrink-0">
                  <MapPin className="h-6 w-6 text-primary mt-1" />
                </div>
                <div className="grow">
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                    Location
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Cheptulu Market
                    <br />
                    Cheptulu - Chavakali Road
                    <br />
                    P.O.Box 388, Serem
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGetDirections}
                    className="flex items-center gap-2"
                  >
                    <Navigation className="h-4 w-4" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bakery-card">
              <div className="flex items-start space-x-4">
                <div className="shrink-0">
                  <Clock className="h-6 w-6 text-primary mt-1" />
                </div>
                <div className="grow">
                  <h3 className="text-lg font-display font-semibold text-foreground mb-4">
                    Hours of Operation
                  </h3>
                  <div className="space-y-2">
                    {hours.map((schedule, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-muted-foreground">
                          {schedule.day}
                        </span>
                        <span className="text-foreground font-medium">
                          {schedule.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bakery-card">
                <div className="text-center">
                  <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                    Phone
                  </h3>
                  <p className="text-muted-foreground">+254 114020977</p>
                </div>
              </div>

              <div className="bakery-card">
                <div className="text-center">
                  <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                    Email
                  </h3>
                  <p className="text-muted-foreground">cakepanier@dealio.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map/Image Placeholder and CTA */}
          <div className="space-y-6">
            {/* Google Maps Embed */}
            <div className="bakery-card p-0 h-80 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d249.36301989388815!2d34.859714112437565!3d0.1282937426492365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x178013161bfe24d3%3A0x97c8175e8152e6ac!2sDenvis%20printing%20hub!5e0!3m2!1sen!2ske!4v1757427251930!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Perfect Pastry Bakery Location"
                className="rounded-xl"
              />
            </div>

            {/* Call to Action */}
            <div className="bakery-card text-center">
              <h3 className="text-xl font-display font-semibold text-foreground mb-4">
                Ready to Experience Fresh?
              </h3>
              <p className="text-muted-foreground mb-6">
                Visit us today or place an order for pickup. We can't wait to
                share our passion for baking with you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero">Order Online</Button>
                <Button variant="outline">Call Us Now</Button>
                <Button
                  variant="outline"
                  onClick={handleGetDirections}
                  className="flex items-center gap-2"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
