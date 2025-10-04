"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Phone,
  MapPin,
  ShoppingCart,
  User,
  LogOut,
  Wheat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const router = useRouter();

  // Check auth status
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle scroll behavior
  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;

      // Show header when at top of page
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Hide header when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        // Close mobile menu when hiding header
        setIsMenuOpen(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Add a scroll event listener
    window.addEventListener("scroll", controlHeader, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", controlHeader);
    };
  }, [lastScrollY]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header
      className={`bg-background/95 backdrop-blur-xs sticky top-0 z-50 border-b border-border shadow-soft transition-transform duration-300 ease-in-out ${
        isVisible ? "transform translate-y-0" : "transform -translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Wheat className="h-8 w-8 text-primary" />
            <Link href="/">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground whitespace-nowrap">
                Cake Panier
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Products
            </Link>
            <Link
              href="/catering"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Catering{" "}
            </Link>
            <Link
              href="/special-orders"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Special Orders
            </Link>
            <a
              href="#about"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Contact
            </a>
          </nav>

          {/* Cart & Contact Info */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push("/");
                  }}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth">Sign In</Link>
              </Button>
            )}

            <Button variant="ghost" size="sm" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5 mr-1" />
                Cart
                {itemCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 flex items-center justify-center text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Link>
            </Button>

            <div className="flex items-center space-x-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span className="text-sm">+254 114020977</span>
            </div>
          </div>

          {/* Mobile Cart & Menu */}
          <div className="md:hidden flex items-center space-x-2">
            {user ? (
              <Button variant="ghost" size="sm" asChild className="p-2">
                <Link href="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" asChild className="text-sm">
                <Link href="/auth">Sign In</Link>
              </Button>
            )}

            <Button variant="ghost" size="sm" asChild className="relative p-2">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Link>
            </Button>
            <button
              onClick={toggleMenu}
              className="p-2 text-foreground hover:bg-accent rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={toggleMenu}
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={toggleMenu}
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
              >
                Products
              </Link>
              <Link
                href="/catering"
                onClick={toggleMenu}
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
              >
                Catering
              </Link>
              <Link
                href="/special-orders"
                onClick={toggleMenu}
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
              >
                Special Orders
              </Link>
              <a
                href="#about"
                onClick={toggleMenu}
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
              >
                About
              </a>
              <a
                href="#contact"
                onClick={toggleMenu}
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
              >
                Contact
              </a>
              <div className="flex items-center space-x-2 text-muted-foreground pt-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">(+254 11402097</span>
              </div>

              {user ? (
                <div className="flex flex-col space-y-2 pt-2">
                  <Button variant="ghost" asChild className="justify-start p-2">
                    <Link
                      href="/profile"
                      onClick={toggleMenu}
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      router.push("/");
                      toggleMenu();
                    }}
                    className="justify-start p-2 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" asChild className="w-fit">
                  <Link href="/auth" onClick={toggleMenu}>
                    Sign In
                  </Link>
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
