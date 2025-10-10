import {
  BookOpen,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <BookOpen className="h-8 w-8 text-amber-400 mr-2" />
              <span className="text-2xl font-bold">BookHub</span>
            </div>
            <p className="text-slate-400 mb-4 text-sm">
              Your trusted partner for books, office supplies, and technology
              across Nairobi. Building knowledge and empowering success since
              2020.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-slate-400 hover:text-amber-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-slate-400 hover:text-amber-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-slate-400 hover:text-amber-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-amber-400 transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-amber-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#branches"
                  className="hover:text-amber-400 transition-colors"
                >
                  Our Branches
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-amber-400 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <Link
                  href="/products?category=books"
                  className="hover:text-amber-400 transition-colors"
                >
                  Books
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=office"
                  className="hover:text-amber-400 transition-colors"
                >
                  Office Supplies
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=technology"
                  className="hover:text-amber-400 transition-colors"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=stationery"
                  className="hover:text-amber-400 transition-colors"
                >
                  Stationery
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=student"
                  className="hover:text-amber-400 transition-colors"
                >
                  Student Essentials
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-slate-400 text-sm">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-amber-400" />
                <span>info@bookhub.co.ke</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-amber-400" />
                <span>+254 700 123 456</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-amber-400" />
                <span>Nairobi, Kenya</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-amber-400" />
                <div>
                  <div>Mon-Sat: 8AM-8PM</div>
                  <div>Sun: 10AM-6PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
          <p>&copy; 2024 BookHub. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-amber-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-amber-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-amber-400 transition-colors">
              Shipping Info
            </a>
            <a href="#" className="hover:text-amber-400 transition-colors">
              Returns
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
