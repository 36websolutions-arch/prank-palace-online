import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, X, Scroll, ChevronDown, Shield, Package, Zap, Crown, Heart, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useState, useRef, useEffect } from "react";
import logo from "@/assets/logo.png";

export function Navbar() {
  const { user, nickname, isAdmin, signOut } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [armoryDropdownOpen, setArmoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setArmoryDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const armoryItems = [
    {
      to: "/armory",
      icon: Shield,
      label: "The Full Armory",
      description: "Browse all offerings",
    },
    {
      to: "/physical-products",
      icon: Package,
      label: "Tools of Mischief",
      description: "Physical goods",
    },
    {
      to: "/digital-products",
      icon: Zap,
      label: "Senate Archives",
      description: "Digital products",
    },
    {
      to: "/subscription-products",
      icon: Crown,
      label: "Imperial Tribute",
      description: "Subscriptions",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-stone-950/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img
              src={logo}
              alt="Corporate Chronicle Logo"
              className="h-10 w-10 object-contain"
            />
            <div className="hidden sm:flex flex-col">
              <span className="font-display text-xl text-stone-900 dark:text-stone-100">The Corporate</span>
              <span className="font-display text-sm text-amber-600 -mt-1">Chronicle</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/chronicles"
              className="flex items-center gap-1.5 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
            >
              <Scroll className="h-4 w-4" />
              Chronicles
            </Link>

            {/* The Armory Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setArmoryDropdownOpen(!armoryDropdownOpen)}
                className="flex items-center gap-1.5 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
              >
                <Shield className="h-4 w-4" />
                The Armory
                <ChevronDown className={`h-3 w-3 transition-transform ${armoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {armoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="py-2">
                    {armoryItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setArmoryDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <item.icon className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{item.label}</p>
                          <p className="text-xs text-stone-500">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/support"
              className="flex items-center gap-1.5 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
            >
              <Heart className="h-4 w-4" />
              Fund the Resistance
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/chronicles">
              <Button
                variant="ghost"
                size="icon"
                className="text-stone-600 dark:text-stone-400 hover:text-amber-600"
              >
                <Scroll className="h-5 w-5" />
              </Button>
            </Link>
            <a
              href="https://www.instagram.com/corporatepranks"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-stone-600 dark:text-stone-400 hover:text-pink-600"
              >
                <Instagram className="h-5 w-5" />
              </Button>
            </a>
            {user ? (
              <>
                <Link to="/cart" className="relative">
                  <Button variant="ghost" size="icon" className="text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                </Link>

                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-stone-400" />
                  <span className="font-medium text-stone-700 dark:text-stone-300">{nickname || "Citizen"}</span>
                </div>

                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="gap-2 border-stone-300 dark:border-stone-700 hover:border-amber-600 hover:text-amber-600">
                      <LayoutDashboard className="h-4 w-4" />
                      Admin
                    </Button>
                  </Link>
                )}

                <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-stone-600 dark:text-stone-400 hover:text-amber-600">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">Join the Senate</Button>
              </Link>
            )}
          </div>

          {/* Mobile: Chronicles + Instagram + Menu Toggle - Centered */}
          <div className="flex flex-1 items-center justify-center gap-2 md:hidden">
            <Link to="/chronicles">
              <Button
                variant="ghost"
                size="icon"
                className="text-stone-600 dark:text-stone-400 hover:text-amber-600"
              >
                <Scroll className="h-5 w-5" />
              </Button>
            </Link>
            <a
              href="https://www.instagram.com/corporatepranks"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-stone-600 dark:text-stone-400 hover:text-pink-600"
              >
                <Instagram className="h-5 w-5" />
              </Button>
            </a>
            <Button
              variant="ghost"
              size="icon"
              className="text-stone-600 dark:text-stone-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200 dark:border-stone-800">
            <div className="flex flex-col gap-4">
              <Link
                to="/chronicles"
                className="flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-amber-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Scroll className="h-4 w-4" />
                Chronicles
              </Link>

              {/* Mobile Armory Section */}
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-400">
                  <Shield className="h-4 w-4" />
                  The Armory
                </p>
                <div className="pl-6 space-y-2">
                  {armoryItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-500 hover:text-amber-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-3 w-3" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/support"
                className="flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-amber-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="h-4 w-4" />
                Fund the Resistance
              </Link>

              {user ? (
                <>
                  <Link
                    to="/cart"
                    className="flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Cart ({totalItems})
                  </Link>

                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-stone-400" />
                    <span className="font-medium text-stone-700 dark:text-stone-300">{nickname || "Citizen"}</span>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="outline" size="sm" className="gap-2 w-full border-stone-300 dark:border-stone-700">
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}

                  <Button variant="ghost" className="justify-start gap-2 text-stone-600 dark:text-stone-400" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">Join the Senate</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
