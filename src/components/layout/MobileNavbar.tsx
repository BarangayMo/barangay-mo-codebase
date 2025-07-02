
import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, Store, Menu, LifeBuoy, Shield, User } from "lucide-react";
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
          icon: Shield,
          path: "/official-dashboard",
          label: "Official",
          key: "official"
        },
        {
          icon: MessageSquare,
          path: getMessagesRoute(),
          label: "Message",
          key: "messages"
        },
        {
          icon: LifeBuoy,
          path: "/services",
          label: "Services",
          key: "services"
        },
        {
          icon: User,
          path: "/edit-profile",
          label: "Profile",
          key: "profile"
        }
      ];
    }

    // Default navigation for residents and other roles
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
        icon: Store,
        path: "/marketplace",
        label: "Market",
        key: "marketplace"
      },
      {
        icon: LifeBuoy,
        path: "/services",
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
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-t border-white/20 shadow-lg rounded-t-xl pb-8">
      <div className="flex items-center justify-between px-4 py-2 max-w-sm mx-auto">
        {navItems.map(({ icon: Icon, path, label, key }) => (
          <Link key={key} to={path} className="flex flex-col items-center p-2">
            <Icon className={cn(
              "h-6 w-6 transition-colors",
              pathname === path 
                ? userRole === "resident" 
                  ? "text-[#1a237e]" 
                  : "text-[#ea384c]"
                : "text-black"
            )} />
            <span className={cn(
              "text-xs mt-1 text-center",
              pathname === path 
                ? userRole === "resident" 
                  ? "text-[#1a237e] font-medium" 
                  : "text-[#ea384c] font-medium"
                : "text-black"
            )}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
