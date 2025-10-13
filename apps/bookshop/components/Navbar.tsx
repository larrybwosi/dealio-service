'use client';
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Sheet, SheetContent, SheetTrigger } from "@workspace/ui/components/sheet";
import { Badge } from "@workspace/ui/components/badge";
import { Menu, Search, BookOpen, ShoppingCart, User } from "lucide-react";
import Cart from "./Cart";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/#about" },
    { name: "Locations", path: "/#locations" },
    { name: "Contact", path: "/#contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    if (path.startsWith("/#")) {
      // For hash links, only consider active if we're on the home page
      // You might want to enhance this based on your actual routing needs
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center">
              <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-slate-800">Denvis</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`font-medium transition-colors hover:text-amber-600 whitespace-nowrap text-sm lg:text-base ${
                  isActive(item.path)
                    ? "text-amber-600 border-b-2 border-amber-600 pb-1"
                    : "text-slate-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full text-sm"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {/* Search - Mobile & Tablet */}
            <Button variant="ghost" size="sm" className="lg:hidden p-2 h-9 w-9 sm:h-10 sm:w-10">
              <Search className="h-4 w-4" />
            </Button>

            {/* Cart */}
            <div className="flex-shrink-0">
              <Cart />
            </div>

            {/* User Account - Desktop */}
            <Button variant="ghost" size="sm" className="hidden sm:flex p-2 h-9 w-9 sm:h-10 sm:w-10">
              <User className="h-4 w-4" />
            </Button>

            {/* User Account - Mobile */}
            <Button variant="ghost" size="sm" className="sm:hidden p-2 h-9 w-9">
              <User className="h-4 w-4" />
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden p-2 h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px] p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-6 border-b">
                    <div className="flex items-center space-x-2 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xl font-bold text-slate-800">Denvis</span>
                    </div>

                    {/* Mobile Search */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        type="search"
                        placeholder="Search products..."
                        className="pl-10 pr-4 py-2 w-full text-sm"
                      />
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <nav className="flex flex-col space-y-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`px-3 py-3 rounded-lg font-medium transition-colors text-sm ${
                            isActive(item.path)
                              ? "bg-amber-50 text-amber-600 border-l-4 border-amber-600"
                              : "text-slate-700 hover:bg-slate-50 hover:text-amber-600"
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t bg-slate-50">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-sm h-10">
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search Bar - Tablet (hidden on mobile and desktop) */}
        <div className="hidden md:flex lg:hidden items-center pb-3">
          <div className="relative w-full max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full text-sm"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}