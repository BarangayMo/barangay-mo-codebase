import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, User, ShoppingCart } from "lucide-react"; // Removed X as it's not used here directly now
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { HeaderLogo } from "./header/HeaderLogo";
import { LocationDropdown } from "./header/LocationDropdown";
import { DesktopNavItems } from "./header/DesktopNavItems";
import { ProfileMenu } from "./ProfileMenu";
import { LanguageSelector } from "./LanguageSelector";
import { useCartSummary } from "@/hooks/useCartSummary";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Removed SheetClose, SheetHeader, SheetTitle as they are used in CartDrawerContent
import { CartDrawerContent } from "@/components/cart/CartDrawerContent";
import { useState } from "react"; // Added useState

export const Header = () => {
  const { isAuthenticated, userRole } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { cartItemCount } = useCartSummary();
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false); // State for drawer

  const getDashboardRoute = () => {
    switch (userRole) {
      case "official":
        return "/official-dashboard";
      case "superadmin":
        return "/admin";
      case "resident":
        return "/resident-home";
      default:
        return "/";
    }
  };

  const showCartIcon = location.pathname.startsWith('/marketplace') || location.pathname.startsWith('/resident-home');

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <HeaderLogo />
          <LocationDropdown />
        </div>

        <DesktopNavItems />

        <div className="flex items-center gap-1 md:gap-3">
          {isAuthenticated ? (
            <>
              {!isMobile && (
                <>
                  <Button 
                    size="sm" 
                    asChild
                    className={`bg-gradient-to-r ${
                      userRole === "resident" 
                        ? "from-[#1a237e] to-[#534bae]" 
                        : "from-[#ea384c] to-[#ff6b78]"
                    } text-white hover:opacity-90 transition-opacity`}
                  >
                    <Link to={getDashboardRoute()}>Dashboard</Link>
                  </Button>
                  <LanguageSelector />
                </>
              )}
              <div className="flex items-center gap-0.5 md:gap-2">
                {showCartIcon && (
                  isMobile ? (
                    <Button asChild variant="ghost" size="icon" className="relative">
                      <Link to="/marketplace/cart">
                        <ShoppingCart className="h-5 w-5" />
                        {cartItemCount > 0 && (
                          <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center bg-red-500">
                            {cartItemCount}
                          </span>
                        )}
                      </Link>
                    </Button>
                  ) : (
                    <Sheet open={isCartDrawerOpen} onOpenChange={setIsCartDrawerOpen}>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                          <ShoppingCart className="h-5 w-5" />
                          {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center bg-red-500">
                              {cartItemCount}
                            </span>
                          )}
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
                        <CartDrawerContent onClose={() => setIsCartDrawerOpen(false)} />
                      </SheetContent>
                    </Sheet>
                  )
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  asChild
                >
                  <Link to="/notifications">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center bg-[#ea384c]">
                      3
                    </span>
                  </Link>
                </Button>
                {!isMobile && <ProfileMenu />}
              </div>
              {isMobile && (
                <Button asChild variant="ghost" size="icon" className="rounded-full">
                  <Link to="/resident-profile">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              )}
            </>
          ) : (
            <div className="flex items-center gap-0.5 md:gap-2">
              {!isMobile && (
                <>
                  <LanguageSelector />
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/register">Register</Link>
                  </Button>
                </>
              )}
              {showCartIcon && ( // For non-authenticated users, cart icon always links to cart page
                <Button asChild variant="ghost" size="icon" className="relative">
                  <Link to="/marketplace/cart">
                    <ShoppingCart className="h-5 w-5" />
                    {/* Badge for non-auth users is typically not shown or shows 0 */}
                  </Link>
                </Button>
              )}
              {isMobile && (
                <Button asChild variant="ghost" size="icon" className="rounded-full">
                  <Link to="/login">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
