//my-changes
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, User, ShoppingBag, Menu, LogOut, Home, MessageSquare, BarChart3, FolderOpen, Settings,Briefcase,ShoppingCart, UsersIcon, Hospital, ClipboardList, Siren, FileText, Store, LifeBuoy, Info, Phone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { HeaderLogo } from "./header/HeaderLogo";
import { LocationDropdown } from "./header/LocationDropdown";
import { DesktopNavItems } from "./header/DesktopNavItems";
import { ProfileMenu } from "./ProfileMenu";
import { LanguageSelector } from "./LanguageSelector";
import { useCartSummary } from "@/hooks/useCartSummary";
import { useNotifications } from "@/hooks/useNotifications";
import { useRbiAccess } from "@/hooks/use-rbi-access";
import { useWishlist } from "@/hooks/useWishlist";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartDrawerContent } from "@/components/cart/CartDrawerContent";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Header = () => {
  const {
    isAuthenticated,
    userRole,
    logout,
    user
  } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const {
    cartItemCount
  } = useCartSummary();
  const {
    unreadCount
  } = useNotifications();
  const { hasRbiAccess } = useRbiAccess();
  const { wishlistItems } = useWishlist();
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get official profile for barangay information
  const {
    data: officialProfile
  } = useQuery({
    queryKey: ['official-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && userRole === "official"
  });
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
  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };
  const showCartIcon = (location.pathname.startsWith('/marketplace') || location.pathname.startsWith('/resident-home')) && (userRole !== 'resident' || hasRbiAccess);

  // Consistent mobile header for all users
  if (isMobile) {
    return <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          {/* Mobile Menu Sheet */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Menu className="h-5 w-5 text-gray-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
               <div className="h-screen flex flex-col">
              <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                {/* Header section - different for authenticated/unauthenticated */}
                {isAuthenticated ? <div className={`${userRole === "official" ? "bg-red-50 border-red-100" : userRole === "superadmin" ? "bg-purple-50 border-purple-100" : "bg-blue-50 border-blue-100"} p-4 rounded-lg border`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 ${userRole === "official" ? "bg-red-500" : userRole === "superadmin" ? "bg-purple-500" : "bg-blue-500"} rounded-lg flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">
                          {userRole === "official" ? "Bo" : userRole === "superadmin" ? "Ad" : "Re"}
                        </span>
                      </div>
                      <div>
                        <h2 className={`text-sm font-semibold ${userRole === "official" ? "text-red-700" : userRole === "superadmin" ? "text-purple-700" : "text-blue-700"}`}>
                          BarangayMo {userRole === "official" ? "Officials" : userRole === "superadmin" ? "Admin" : "Resident"}
                        </h2>
                        <p className={`text-xs ${userRole === "official" ? "text-red-600" : userRole === "superadmin" ? "text-purple-600" : "text-blue-600"}`}>
                          {userRole === "official" ? `${officialProfile?.barangay || 'Barangay'} • City Province` : userRole === "superadmin" ? "System Administrator" : "Community Member"}
                        </p>
                      </div>
                    </div>
                    {user && <div className={`text-xs ${userRole === "official" ? "text-red-600" : userRole === "superadmin" ? "text-purple-600" : "text-blue-600"}`}>
                        <p>{user.email}</p>
                      </div>}
                  </div> : <div className="bg-gray-50 border-gray-200 p-4 rounded-lg border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">BM</span>
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-gray-700">BarangayMo</h2>
                        <p className="text-xs text-gray-600">Community Platform</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>Sign in to access personalized features</p>
                    </div>
                  </div>}

                {/* Location Selector for officials */}
                {isAuthenticated && userRole === "official"}

                {/* Navigation items */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Navigation</h3>
                  <div className="space-y-2">
                    {(() => {
                    if (isAuthenticated) {
                      if (userRole === "official") {
                        return [{
                          name: "Dashboard",
                          icon: Home,
                          href: "/official-dashboard",
                          active: location.pathname === "/official-dashboard"
                        }, {
                          name: "Requests & Complaints",
                          icon: FileText,
                          href: "/official/requests"
                        }, {
                          name: "Messages",
                          icon: MessageSquare,
                          href: "/messages"
                        }, {
                          name: "Reports",
                          icon: BarChart3,
                          href: "/official/reports"
                        }, {
                          name: "Documents",
                          icon: FolderOpen,
                          href: "/official/documents"
                        }, {
                          name: "Settings",
                          icon: Settings,
                          href: "/settings"
                        }];
                      } else if (userRole === "superadmin") {
                        return [{
                          name: "Dashboard",
                          icon: Home,
                          href: "/admin",
                          active: location.pathname === "/admin"
                        }, {
                          name: "Users",
                          icon: UsersIcon,
                          href: "/admin/users"
                        }, {
                          name: "Messages",
                          icon: MessageSquare,
                          href: "/messages"
                        }, {
                          name: "Reports",
                          icon: BarChart3,
                          href: "/admin/reports"
                        }, {
                          name: "Settings",
                          icon: Settings,
                          href: "/settings"
                        }];
                      } else {
                        return [{
                          name: "Home",
                          icon: Home,
                          href: "/resident-home",
                          active: location.pathname === "/resident-home"
                        }, {
                          name: "Messages",
                          icon: MessageSquare,
                          href: "/messages"
                        }, {
                        name: "Services",
                        icon: Hospital,
                        href: "/services",
                        restricted: true
                      }, {
                        name: "Marketplace",
                        icon: ShoppingBag,
                        href: "/marketplace",
                        restricted: true
                      }, {
                          name: "Settings",
                          icon: Settings,
                          href: "/settings"
                        }];
                      }
                    } else {
                      // Non-authenticated navigation
                      return [{
                        name: "Home",
                        icon: Home,
                        href: "/",
                        active: location.pathname === "/"
                      }, {
                        name: "Marketplace",
                        icon: Store,
                        href: "/marketplace"
                      }, {
                        name: "Services",
                        icon: LifeBuoy,
                        href: "/services"
                      }, {
                        name: "About",
                        icon: Info,
                        href: "/about"
                      }, {
                        name: "Contact",
                        icon: Phone,
                        href: "/contact"
                      }];
                    }
                  })().map((item, index) => {
                    const isRestricted = item.restricted && userRole === 'resident' && !hasRbiAccess;
                    
                    return (
                      <Link 
                        key={index} 
                        to={isRestricted ? "#" : item.href} 
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer ${item.active ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'} ${isRestricted ? 'opacity-60' : ''}`} 
                        onClick={(e) => {
                          if (isRestricted) {
                            e.preventDefault();
                            toast.dismiss(); // Dismiss any existing toasts first
                            toast.error("Restricted Access", {
                              description: "Submit your RBI form to access these options",
                              duration: 4000,
                            });
                            return;
                          }
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <item.icon className={`h-5 w-5 ${item.active ? 'text-blue-600' : 'text-blue-500'}`} />
                        <span className="text-sm font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                  </div>
                </div>

                {/* Quick Actions for officials */}
                {isAuthenticated && userRole === "official" && <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      {[{
                    name: "Resident Management",
                    icon: UsersIcon,
                    href: "/official/residents"
                  }, {
                    name: "Community Services",
                    icon: Hospital,
                    href: "/official/services"
                  }, {
                    name: "RBI Forms",
                    icon: ClipboardList,
                    href: "/official/rbi-forms"
                  },{
                    name: "Job Management",
                    icon: Briefcase,
                    href: "/official/jobs"
                  },{
                    name: "Product Management",
                    icon: ShoppingCart,
                    href: "/official/products"
                  }, {
                    name: "Emergency Response",
                    icon: Siren,
                    href: "/official/emergency-response"
                  }].map((item, index) => <Link key={index} to={item.href} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                          <item.icon className="h-5 w-5 text-red-500" />
                          <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        </Link>)}
                    </div>
                  </div>}

                {/* Authentication Section */}
                <div className="border-t pt-4">
                  {isAuthenticated ? <button onClick={handleLogout} className={`flex items-center gap-3 px-3 py-3 rounded-lg hover:${userRole === "official" ? "bg-red-50" : userRole === "superadmin" ? "bg-purple-50" : "bg-blue-50"} cursor-pointer ${userRole === "official" ? "text-red-600" : userRole === "superadmin" ? "text-purple-600" : "text-blue-600"} w-full text-left`}>
                      <LogOut className="h-5 w-5" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button> : <div className="space-y-2">
                      <Link to="/login" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-blue-50 cursor-pointer text-blue-600 w-full" onClick={() => setIsMobileMenuOpen(false)}>
                        <User className="h-5 w-5" />
                        <span className="text-sm font-medium">Sign In</span>
                      </Link>
                      <Link to="/register" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-green-50 cursor-pointer text-green-600 w-full" onClick={() => setIsMobileMenuOpen(false)}>
                        <User className="h-5 w-5" />
                        <span className="text-sm font-medium">Register</span>
                      </Link>
                    </div>}
                </div>
              </div>
            </div>
            </SheetContent>
          </Sheet>
          
          {/* Centered Logo */}
          <div className="flex-1 flex justify-center">
            <HeaderLogo />
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-1">
            {/* Wishlist Icon - show for marketplace or home */}
            {showCartIcon && <Button asChild variant="ghost" size="icon" className="relative w-8 h-8">
                <Link to="/marketplace/wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistItems.length > 0 && <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] rounded-full w-3.5 h-3.5 flex items-center justify-center bg-red-500">
                      {wishlistItems.length}
                    </span>}
                </Link>
              </Button>}
            
            {/* Cart Icon - show for marketplace or home */}
            {showCartIcon && <Button asChild variant="ghost" size="icon" className="relative w-8 h-8">
                <Link to="/marketplace/cart">
                  <ShoppingBag className="h-5 w-5" />
                  {cartItemCount > 0 && <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] rounded-full w-3.5 h-3.5 flex items-center justify-center bg-blue-500">
                      {cartItemCount}
                    </span>}
                </Link>
              </Button>}

            {/* Notification Bell - only for authenticated users */}
            {isAuthenticated && <Button variant="ghost" size="icon" className="relative w-8 h-8" asChild>
                <Link to="/notifications">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && <span className={`absolute -top-0.5 -right-0.5 text-white text-[10px] rounded-full w-3.5 h-3.5 flex items-center justify-center ${userRole === "official" ? "bg-red-500" : userRole === "superadmin" ? "bg-purple-500" : "bg-blue-500"}`}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>}
                </Link>
              </Button>}

            {/* Profile/User Icon */}
            <Button asChild variant="ghost" size="icon" className="rounded-full w-8 h-8">
              <Link to={isAuthenticated ? "/resident-profile" : "/login"}>
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>;
  }

  // Regular header layout for desktop
  return <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-2 md:px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1 md:gap-2">
          <HeaderLogo />
          
        </div>

        {!isMobile && <DesktopNavItems />}

        <div className="flex items-center gap-0 md:gap-2">
          {isAuthenticated ? <>
              {!isMobile && <>
                  <Button size="sm" asChild className={`bg-gradient-to-r ${userRole === "resident" ? "from-[#1a237e] to-[#534bae]" : "from-[#ea384c] to-[#ff6b78]"} text-white hover:opacity-90 transition-opacity`}>
                    <Link to={getDashboardRoute()}>Dashboard</Link>
                  </Button>
                  <LanguageSelector />
                </>}
              <div className="flex items-center gap-0 md:gap-1">
                {/* Wishlist Icon - show for marketplace or home */}
                {showCartIcon && <Button asChild variant="ghost" size="icon" className="relative w-8 h-8 md:w-9 md:h-9">
                    <Link to="/marketplace/wishlist">
                      <Heart className="h-4 w-4 md:h-5 md:w-5" />
                      {wishlistItems.length > 0 && <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] md:text-xs rounded-full w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center bg-red-500">
                          {wishlistItems.length}
                        </span>}
                    </Link>
                  </Button>}
                
                {showCartIcon && (isMobile ? <Button asChild variant="ghost" size="icon" className="relative w-8 h-8">
                      <Link to="/marketplace/cart">
                        <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
                        {cartItemCount > 0 && <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] md:text-xs rounded-full w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center bg-official">
                            {cartItemCount}
                          </span>}
                      </Link>
                    </Button> : <Sheet open={isCartDrawerOpen} onOpenChange={setIsCartDrawerOpen}>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative w-9 h-9">
                          <ShoppingBag className="h-5 w-5" />
                          {cartItemCount > 0 && <span className="absolute -top-0.5 -right-0.5 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center bg-official">
                              {cartItemCount}
                            </span>}
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
                        <CartDrawerContent onClose={() => setIsCartDrawerOpen(false)} />
                      </SheetContent>
                    </Sheet>)}
                
                {/* Notification Bell with Dropdown for non-officials or desktop */}
                {userRole !== "official" || !isMobile ? isMobile ? <Button variant="ghost" size="icon" className="relative w-8 h-8 md:w-9 md:h-9" asChild>
                      <Link to="/notifications">
                        <Bell className="h-4 w-4 md:h-5 md:w-5" />
                        {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] md:text-xs rounded-full w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center bg-official">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>}
                      </Link>
                    </Button> : <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative w-8 h-8 md:w-9 md:h-9">
                          <Bell className="h-4 w-4 md:h-5 md:w-5" />
                          {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] md:text-xs rounded-full w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center bg-official">
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0 mr-4" align="end" side="bottom" sideOffset={8}>
                        <NotificationDropdown onClose={() => setIsNotificationOpen(false)} />
                      </PopoverContent>
                    </Popover> : null}
                
                {!isMobile && <ProfileMenu />}
              </div>
              {isMobile && userRole !== "official" && <Button asChild variant="ghost" size="icon" className="rounded-full w-8 h-8">
                  <Link to="/resident-profile">
                    <User className="h-4 w-4 md:h-5 md:w-5" />
                  </Link>
                </Button>}
              {isMobile && userRole === "official" && <Button asChild variant="ghost" size="icon" className="rounded-full w-8 h-8">
                  <Link to="/official-profile">
                    <User className="h-4 w-4 md:h-5 md:w-5" />
                  </Link>
                </Button>}
            </> : <div className="flex items-center gap-0 md:gap-2">
              {!isMobile && <>
                  <LanguageSelector />
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/register">Register</Link>
                  </Button>
                </>}
              {showCartIcon && (isMobile ? <Button asChild variant="ghost" size="icon" className="relative w-8 h-8">
                    <Link to="/marketplace/cart">
                      <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
                    </Link>
                  </Button> : <Button asChild variant="ghost" size="icon" className="relative w-9 h-9">
                     <Link to="/marketplace/cart">
                       <ShoppingBag className="h-5 w-5" />
                     </Link>
                  </Button>)}
              {isMobile && <Button asChild variant="ghost" size="icon" className="rounded-full w-8 h-8">
                  <Link to="/login">
                    <User className="h-4 w-4 md:h-5 md:w-5" />
                  </Link>
                </Button>}
            </div>}
        </div>
      </div>
    </header>;
};
