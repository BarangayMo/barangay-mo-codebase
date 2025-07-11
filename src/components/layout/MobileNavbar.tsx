
import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, Menu, Bell, User, Briefcase, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export const MobileNavbar = () => {
  const { pathname } = useLocation();
  const { userRole, isAuthenticated } = useAuth();

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

    // Default nav items for residents and others
    return [
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
        key: "messages"
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
        icon: Menu,
        path: "/menu",
        label: "Menu",
        key: "menu"
      }
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-t border-white/20 shadow-lg rounded-t-xl pb-2">
      <div className="flex items-center justify-center px-2 py-2 max-w-md mx-auto">
        <div className="flex items-center justify-between w-full">
          {navItems.map(({ icon: Icon, path, label, key }) => {
            return (
              <Link key={key} to={path} className="flex flex-col items-center justify-center p-2 min-w-0 flex-1">
                <Icon className={cn(
                  "h-6 w-6 transition-colors mb-1",
                  pathname === path 
                    ? userRole === "official" 
                      ? "text-red-600" 
                      : userRole === "resident" 
                        ? "text-resident" 
                        : "text-black"
                    : "text-black"
                )} />
                <span className={cn(
                  "text-xs text-center leading-tight",
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
