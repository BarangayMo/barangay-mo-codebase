import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, MessageSquare, Store, Menu, LifeBuoy, User, Briefcase, Bell, ShoppingCart, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRbiAccess } from "@/hooks/use-rbi-access";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
  icon: any;
  path: string;
  label: string;
  key: string;
  requiresRbi?: boolean;
  isMenuTrigger?: boolean;
}

export const MobileNavbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { userRole, isAuthenticated, logout } = useAuth();
  const { checkAccess } = useRbiAccess();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getHomeRoute = () => {
    if (!isAuthenticated) {
      return "/login";
    }
    switch (userRole) {
      case "official":
        return "/official-dashboard";
      case "superadmin":
        return "/admin";
      case "resident":
      default:
        return "/resident-home";
    }
  };

  const getMessagesRoute = () => {
    return isAuthenticated ? "/messages" : "/login";
  };

  // Check if we're in marketplace pages (including all marketplace routes)
  const isMarketplacePage = pathname.startsWith('/marketplace');

  // Different nav items based on user role
  const getNavItems = (): NavItem[] => {
    if (userRole === "official") {
      return [
        {
          icon: Home,
          path: getHomeRoute(),
          label: "Home",
          key: "home"
        },
        {
          icon: Briefcase,
          path: "/official/officials",
          label: "Officials",
          key: "officials"
        },
        {
          icon: MessageSquare,
          path: getMessagesRoute(),
          label: "Messages",
          key: "messages"
        },
        {
          icon: Settings,
          path: "/official/services",
          label: "Services",
          key: "services"
        },
        {
          icon: Menu,
          path: "/menu",
          label: "Menu",
          key: "menu",
          isMenuTrigger: true
        }
      ];
    }

    // Default nav items for residents
    const baseItems: NavItem[] = [
      {
        icon: Home,
        path: getHomeRoute(),
        label: "Home",
        key: "home"
      },
      {
        icon: MessageSquare,
        path: getMessagesRoute(),
        label: "Messages",
        key: "messages",
        requiresRbi: true
      },
      {
        icon: Store,
        path: "/marketplace",
        label: "Market",
        key: "marketplace",
        requiresRbi: true
      }
    ];

    // Add cart only if we're in marketplace pages, otherwise add notifications
    if (isMarketplacePage) {
      baseItems.push({
        icon: ShoppingCart,
        path: "/marketplace/cart",
        label: "Cart",
        key: "cart"
      });
    } else {
      baseItems.push({
        icon: Bell,
        path: "/notifications",
        label: "Notifications",
        key: "notifications"
      });
    }

    // Always add menu as the last item
    baseItems.push({
      icon: Menu,
      path: "/menu",
      label: "Menu",
      key: "menu",
      isMenuTrigger: true
    });

    return baseItems;
  };

  const handleNavigation = (path: string, requiresRbi?: boolean, isMenuTrigger?: boolean) => {
    if (isMenuTrigger) {
      setIsMenuOpen(true);
      return;
    }

    if (requiresRbi && userRole === 'resident') {
      checkAccess(() => {
        navigate(path);
      });
    } else {
      navigate(path);
    }
  };

  const handleMenuNavigation = (path: string, requiresRbi?: boolean) => {
    setIsMenuOpen(false);
    if (requiresRbi && userRole === 'resident') {
      checkAccess(() => {
        navigate(path);
      });
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    navigate("/login");
  };

  const navItems = getNavItems();

  // Menu items for the sliding panel - Now including Jobs
  const menuItems = [
    {
      icon: Home,
      path: getHomeRoute(),
      label: "Home",
      key: "home"
    },
    {
      icon: MessageSquare,
      path: "/messages",
      label: "Messages",
      key: "messages",
      requiresRbi: true
    },
    {
      icon: Settings,
      path: "/services",
      label: "Services",
      key: "services",
      requiresRbi: true
    },
    {
      icon: Store,
      path: "/marketplace",
      label: "Marketplace",
      key: "marketplace",
      requiresRbi: true
    },
    {
      icon: Briefcase,
      path: "/jobs",
      label: "Jobs",
      key: "jobs",
      requiresRbi: true
    },
    {
      icon: Settings,
      path: "/settings",
      label: "Settings",
      key: "settings"
    }
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-[100] backdrop-blur-md bg-white/95 border-t border-white/20 shadow-lg rounded-t-xl pb-safe">
        <div className="flex items-center justify-center px-2 py-1 max-w-md mx-auto">
          <div className="flex items-center justify-between w-full max-w-sm">
            {navItems.map(({ icon: Icon, path, label, key, requiresRbi, isMenuTrigger }) => (
              <button
                key={key}
                onClick={() => handleNavigation(path, requiresRbi, isMenuTrigger)}
                className="flex flex-col items-center justify-center p-1.5 min-w-0 flex-1 relative z-10 bg-transparent border-none cursor-pointer"
              >
                <Icon className={cn(
                  "h-5 w-5 sm:h-6 sm:w-6 transition-colors mb-0.5",
                  pathname === path 
                    ? userRole === "official" 
                      ? "text-red-600" 
                      : userRole === "resident" 
                        ? "text-resident" 
                        : "text-black"
                    : "text-black"
                )} />
                <span className={cn(
                  "text-xs sm:text-sm text-center leading-tight",
                  pathname === path 
                    ? userRole === "official" 
                      ? "text-red-600 font-medium" 
                      : userRole === "resident" 
                        ? "text-resident font-medium" 
                        : "text-black font-medium"
                    : "text-black"
                )}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="right" className="w-80 sm:w-96">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <div className="space-y-2">
              {menuItems.map(({ icon: Icon, path, label, key, requiresRbi }) => (
                <button
                  key={key}
                  onClick={() => handleMenuNavigation(path, requiresRbi)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">{label}</span>
                </button>
              ))}
              <div className="border-t pt-2 mt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-red-600 dark:text-red-400"
                >
                  <LifeBuoy className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
