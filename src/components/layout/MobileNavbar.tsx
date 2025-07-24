
import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, Store, Menu, LifeBuoy, User, Briefcase, Bell, ShoppingCart, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRbiAccess } from "@/hooks/use-rbi-access";
import { cn } from "@/lib/utils";

export const MobileNavbar = () => {
  const { pathname } = useLocation();
  const { userRole, isAuthenticated } = useAuth();
  const { checkAccess } = useRbiAccess();

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
  const getNavItems = () => {
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
          key: "menu"
        }
      ];
    }

    // Default nav items for residents
    const baseItems = [
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
      key: "menu"
    });

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] backdrop-blur-md bg-white/95 border-t border-white/20 shadow-lg rounded-t-xl pb-safe">
      <div className="flex items-center justify-center px-2 py-1 max-w-md mx-auto">
        <div className="flex items-center justify-between w-full max-w-sm">
        {navItems.map(({ icon: Icon, path, label, key, requiresRbi }: any) => {
            const handleClick = (e: React.MouseEvent) => {
              if (requiresRbi && userRole === 'resident') {
                e.preventDefault();
                checkAccess(() => {
                  window.location.href = path;
                });
              }
            };

            return (
              <Link 
                key={key} 
                to={path} 
                className="flex flex-col items-center justify-center p-1.5 min-w-0 flex-1 relative z-10"
                onClick={handleClick}
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
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
