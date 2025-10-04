import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-2xl font-display font-bold">
              The Cake Panier
            </h3>
            <p className="text-accent-foreground/80 leading-relaxed max-w-md">
              Crafting exceptional baked goods since 1999. From our family to yours, 
              we bring you the finest artisanal breads, pastries, and desserts made 
              with love and traditional techniques.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-accent-foreground/10 rounded-full flex items-center justify-center hover:bg-accent-foreground/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-accent-foreground/10 rounded-full flex items-center justify-center hover:bg-accent-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-accent-foreground/10 rounded-full flex items-center justify-center hover:bg-accent-foreground/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-display font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#products" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Our Products
                </a>
              </li>
              <li>
                <a href="#about" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Catering
                </a>
              </li>
              <li>
                <a href="#" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Special Orders
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-display font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent-foreground/80 mt-0.5 shrink-0" />
                <span className="text-accent-foreground/80 text-sm">
                  Cheptulu - Chavakali road<br />
                  P.O.Box 388, Serem
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent-foreground/80 shrink-0" />
                <span className="text-accent-foreground/80 text-sm">+254 114020977</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent-foreground/80 shrink-0" />
                <span className="text-accent-foreground/80 text-sm">cakepanier@dealio.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-accent-foreground/80 mt-0.5 shrink-0" />
                <span className="text-accent-foreground/80 text-sm">
                  Mon-Fri: 6AM-7PM<br />
                  Sat: 6AM-8PM, Sun: 7AM-6PM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-accent-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-accent-foreground/80 text-sm">
              © 2025 The Cake Panier. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;