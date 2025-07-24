
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, MessageSquare, Store, Menu, LifeBuoy, User, Briefcase, Bell, ShoppingCart, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRbiAccess } from "@/hooks/use-rbi-access";
import { useCartSummary } from "@/hooks/useCartSummary";
import { UnreadBadge } from "@/components/messages/UnreadBadge";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const MobileNavbar = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { hasRbiAccess } = useRbiAccess();
  const cartSummary = useCartSummary();
  const [isOpen, setIsOpen] = useState(false);

  const pathname = location.pathname;

  // Get cart count safely
  const cartCount = cartSummary?.cartItemCount || 0;

  // Define different navigation based on user role
  const getHomeRoute = () => {
    if (!isAuthenticated) return "/";
    
    switch (user?.role) {
      case "superadmin":
        return "/admin-dashboard";
      case "official":
        return "/officials-dashboard";
      case "resident":
        return "/resident-home";
      default:
        return "/";
    }
  };

  const getNavItems = () => {
    if (!isAuthenticated) {
      return [
        { icon: Home, path: "/", label: "Home", key: "home" },
        { icon: Store, path: "/marketplace", label: "Marketplace", key: "marketplace" },
        { icon: User, path: "/login", label: "Login", key: "login" },
      ];
    }

    const baseItems = [
      { icon: Home, path: getHomeRoute(), label: "Home", key: "home" },
    ];

    // Add role-specific items
    if (user?.role === "resident") {
      baseItems.push(
        { icon: MessageSquare, path: "/messages", label: "Messages", key: "messages" },
        { icon: Store, path: "/marketplace", label: "Marketplace", key: "marketplace" },
        { icon: Briefcase, path: "/jobs", label: "Jobs", key: "jobs" },
        { icon: Bell, path: "/notifications", label: "Notifications", key: "notifications" }
      );
    } else if (user?.role === "official") {
      baseItems.push(
        { icon: MessageSquare, path: "/messages", label: "Messages", key: "messages" },
        { icon: User, path: "/officials/residents", label: "Residents", key: "residents" },
        { icon: LifeBuoy, path: "/officials/requests", label: "Requests", key: "requests" },
        { icon: Bell, path: "/notifications", label: "Notifications", key: "notifications" }
      );
    } else if (user?.role === "superadmin") {
      baseItems.push(
        { icon: MessageSquare, path: "/messages", label: "Messages", key: "messages" },
        { icon: User, path: "/users", label: "Users", key: "users" },
        { icon: Settings, path: "/settings", label: "Settings", key: "settings" }
      );
    }

    return baseItems;
  };

  const handleNavigation = (path: string, requiresRbi = false) => {
    if (requiresRbi && !hasRbiAccess) {
      navigate("/request-access");
      return;
    }
    navigate(path);
  };

  const handleMenuNavigation = (path: string, requiresRbi = false) => {
    setIsOpen(false);
    handleNavigation(path, requiresRbi);
  };

  const handleCartClick = () => {
    navigate("/marketplace/cart");
  };

  if (!isAuthenticated) {
    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {getNavItems().map(({ icon: Icon, path, label, key }) => (
            <Link
              key={key}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center p-2 min-w-0 flex-1",
                pathname === path ? "text-resident" : "text-gray-600"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs truncate">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const navItems = getNavItems();

  // Menu items for the sliding panel - Jobs link is prominently placed
  const menuItems = [
    {
      icon: Home,
      path: getHomeRoute(),
      label: "Home",
      key: "home"
    },
    {
      icon: Briefcase,
      path: "/jobs",
      label: "Jobs",
      key: "jobs",
      requiresRbi: true
    },
    {
      icon: MessageSquare,
      path: "/messages",
      label: "Messages",
      key: "messages"
    },
    {
      icon: Store,
      path: "/marketplace",
      label: "Marketplace",
      key: "marketplace",
      requiresRbi: true
    },
    {
      icon: Bell,
      path: "/notifications",
      label: "Notifications",
      key: "notifications"
    },
    {
      icon: User,
      path: "/profile",
      label: "Profile",
      key: "profile"
    },
    {
      icon: Settings,
      path: "/settings",
      label: "Settings",
      key: "settings"
    }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {/* Dynamic nav items */}
        {navItems.slice(0, 3).map(({ icon: Icon, path, label, key }) => (
          <button
            key={key}
            onClick={() => handleNavigation(path)}
            className={cn(
              "flex flex-col items-center justify-center p-2 min-w-0 flex-1 relative",
              pathname === path ? "text-resident" : "text-gray-600"
            )}
          >
            <Icon className="h-5 w-5 mb-1" />
            {key === "messages" && <UnreadBadge />}
            <span className="text-xs truncate">{label}</span>
          </button>
        ))}

        {/* Cart icon with count */}
        <button
          onClick={handleCartClick}
          className="flex flex-col items-center justify-center p-2 min-w-0 flex-1 relative text-gray-600"
        >
          <ShoppingCart className="h-5 w-5 mb-1" />
          {cartCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {cartCount > 9 ? '9+' : cartCount}
            </Badge>
          )}
          <span className="text-xs truncate">Cart</span>
        </button>

        {/* Menu trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center p-2 min-w-0 flex-1 text-gray-600">
              <Menu className="h-5 w-5 mb-1" />
              <span className="text-xs truncate">Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[60vh] rounded-t-lg">
            <div className="py-4">
              <div className="flex items-center gap-3 mb-6">
                <Avatar>
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback>
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                {menuItems.map(({ icon: Icon, path, label, key, requiresRbi }) => (
                  <button
                    key={key}
                    onClick={() => handleMenuNavigation(path, requiresRbi)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors",
                      pathname === path
                        ? "bg-resident/10 text-resident font-medium"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5",
                      pathname === path
                        ? "text-resident"
                        : "text-gray-600 dark:text-gray-400"
                    )} />
                    <span className={cn(
                      pathname === path
                        ? "text-resident"
                        : "text-gray-900 dark:text-gray-100"
                    )}>{label}</span>
                  </button>
                ))}
                <div className="border-t pt-2 mt-4">
                  <button
                    onClick={() => handleMenuNavigation("/settings")}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-100">Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
