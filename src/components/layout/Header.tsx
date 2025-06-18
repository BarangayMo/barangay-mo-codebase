import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, User, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { HeaderLogo } from "./header/HeaderLogo";
import { LocationDropdown } from "./header/LocationDropdown";
import { DesktopNavItems } from "./header/DesktopNavItems";
import { ProfileMenu } from "./ProfileMenu";
import { LanguageSelector } from "./LanguageSelector";
import { useCartSummary } from "@/hooks/useCartSummary";
import { useNotifications } from "@/hooks/useNotifications";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartDrawerContent } from "@/components/cart/CartDrawerContent";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { useState } from "react";

export const Header = () => {
  const { isAuthenticated, userRole } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { cartItemCount } = useCartSummary();
  const { unreadCount } = useNotifications();
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Special mobile layout for officials
  if (isMobile && userRole === "official" && isAuthenticated) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          {/* Mobile Menu Sheet */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Menu className="h-5 w-5 text-gray-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="p-4 space-y-6 overflow-y-auto h-full">
                {/* Location Selector in Sheet */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Location</h3>
                  <LocationDropdown />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Administration</h3>
                  <div className="space-y-2">
                    {[
                      { name: "Dashboard", icon: "🏠", href: "/official-dashboard", active: location.pathname === "/official-dashboard" },
                      { name: "Requests & Complaints", icon: "📝", href: "/official/requests" },
                      { name: "Messages", icon: "💬", href: "/messages" },
                      { name: "Reports", icon: "📊", href: "/official/reports" },
                      { name: "Documents", icon: "📁", href: "/official/documents" },
                      { name: "Settings", icon: "⚙️", href: "/settings" }
                    ].map((item, index) => (
                      <Link 
                        key={index} 
                        to={item.href} 
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer ${
                          item.active ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span className="text-sm font-medium">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    {[
                      { name: "Resident Management", icon: "👥", href: "/official/residents" },
                      { name: "Community Services", icon: "🏥", href: "/official/services" },
                      { name: "RBI Forms", icon: "📋", href: "/official/rbi-forms" },
                      { name: "Emergency Response", icon: "🚨", href: "/official/emergency-responder" }
                    ].map((item, index) => (
                      <Link 
                        key={index} 
                        to={item.href} 
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Centered Logo */}
          <div className="flex-1 flex justify-center">
            <HeaderLogo />
          </div>

          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative w-8 h-8"
            asChild
          >
            <Link to="/notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] rounded-full w-3.5 h-3.5 flex items-center justify-center bg-official">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </header>
    );
  }

  // Regular header layout for other cases
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-2 md:px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1 md:gap-2">
          <HeaderLogo />
          <LocationDropdown />
        </div>

        {!isMobile && <DesktopNavItems />}

        <div className="flex items-center gap-0 md:gap-2">
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
              <div className="flex items-center gap-0 md:gap-1">
                {showCartIcon && (
                  isMobile ? (
                    <Button asChild variant="ghost" size="icon" className="relative w-8 h-8">
                      <Link to="/marketplace/cart">
                        <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
                        {cartItemCount > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] md:text-xs rounded-full w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center bg-official">
                            {cartItemCount}
                          </span>
                        )}
                      </Link>
                    </Button>
                  ) : (
                    <Sheet open={isCartDrawerOpen} onOpenChange={setIsCartDrawerOpen}>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative w-9 h-9">
                          <ShoppingBag className="h-5 w-5" />
                          {cartItemCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center bg-official">
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
                
                {/* Notification Bell with Dropdown for non-officials or desktop */}
                {userRole !== "official" || !isMobile ? (
                  isMobile ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative w-8 h-8 md:w-9 md:h-9"
                      asChild
                    >
                      <Link to="/notifications">
                        <Bell className="h-4 w-4 md:h-5 md:w-5" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] md:text-xs rounded-full w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center bg-official">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                      </Link>
                    </Button>
                  ) : (
                    <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="relative w-8 h-8 md:w-9 md:h-9"
                        >
                          <Bell className="h-4 w-4 md:h-5 md:w-5" />
                          {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] md:text-xs rounded-full w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center bg-official">
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-80 p-0 mr-4" 
                        align="end"
                        side="bottom"
                        sideOffset={8}
                      >
                        <NotificationDropdown onClose={() => setIsNotificationOpen(false)} />
                      </PopoverContent>
                    </Popover>
                  )
                ) : null}
                
                {!isMobile && <ProfileMenu />}
              </div>
              {isMobile && userRole !== "official" && (
                <Button asChild variant="ghost" size="icon" className="rounded-full w-8 h-8">
                  <Link to="/resident-profile">
                    <User className="h-4 w-4 md:h-5 md:w-5" />
                  </Link>
                </Button>
              )}
            </>
          ) : (
            <div className="flex items-center gap-0 md:gap-2">
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
              {showCartIcon && (
                isMobile ? ( 
                  <Button asChild variant="ghost" size="icon" className="relative w-8 h-8">
                    <Link to="/marketplace/cart">
                      <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
                    </Link>
                  </Button>
                ) : ( 
                  <Button asChild variant="ghost" size="icon" className="relative w-9 h-9">
                     <Link to="/marketplace/cart">
                       <ShoppingBag className="h-5 w-5" />
                     </Link>
                  </Button>
                )
              )}
              {isMobile && (
                <Button asChild variant="ghost" size="icon" className="rounded-full w-8 h-8">
                  <Link to="/login">
                    <User className="h-4 w-4 md:h-5 md:w-5" />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
