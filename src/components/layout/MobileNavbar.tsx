
import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, Store, Menu, LifeBuoy, User, Briefcase } from "lucide-react";
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

  const getProfileRoute = () => {
    if (!isAuthenticated) {
      return "/login";
    }
    switch (userRole) {
      case "official":
        return "/resident-profile";
      case "superadmin":
        return "/resident-profile";
      case "resident":
      default:
        return "/resident-profile";
    }
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
          icon: LifeBuoy,
          path: "/services",
          label: "Services",
          key: "services"
        },
        {
          icon: User,
          path: getProfileRoute(),
          label: "Profile",
          key: "profile"
        }
      ];
    }

    // Default nav items for other roles
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-t border-white/20 shadow-lg rounded-t-xl pb-6">
      <div className="flex items-center justify-center px-4 py-3 max-w-md mx-auto">
        <div className="flex items-center justify-between w-full max-w-sm">
          {navItems.map(({ icon: Icon, path, label, key }) => (
            <Link key={key} to={path} className="flex flex-col items-center justify-center p-2 min-w-0">
              <Icon className={cn(
                "h-7 w-7 transition-colors mb-1.5 font-bold",
                pathname === path 
                  ? "text-black" 
                  : "text-black"
              )} />
              <span className={cn(
                "text-sm font-bold text-center leading-tight",
                pathname === path 
                  ? "text-black" 
                  : "text-black"
              )}>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
