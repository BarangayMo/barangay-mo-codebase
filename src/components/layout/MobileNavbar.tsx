
import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, ShoppingCart, Menu, LifeBuoy } from "lucide-react";
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

  const isMarketplaceRoute = pathname.startsWith('/marketplace');

  const baseNavItems = [
    // Conditionally add the main "Home" button
    // It will not be shown if on a marketplace route, as marketplace has its own navigation
    // or to reduce redundancy.
    ...(!isMarketplaceRoute ? [{ icon: Home, path: getHomeRoute(), label: "Home" }] : []),
    { icon: MessageSquare, path: getMessagesRoute(), label: "Messages" },
    { icon: ShoppingCart, path: "/marketplace", label: "Market" },
    { icon: LifeBuoy, path: "/services", label: "Services" },
    { icon: Menu, path: "/menu", label: "Menu" }
  ];

  // Filter out the "Market" item if we are already on a marketplace route AND the main "Home" button was also hidden
  // This is to avoid having only "Market" if the marketplace page has its own full navigation.
  // However, the user asked to remove "one home button". Removing the main "Home" when in marketplace might be enough.
  // For now, let's stick to only removing the explicit "Home" on marketplace routes.
  const navItems = baseNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-t border-white/20 shadow-lg rounded-t-xl pb-8">
      <div className="flex items-center justify-around px-2.5 py-2"> {/* Changed justify-between to justify-around for better spacing if items reduce */}
        {navItems.map(({ icon: Icon, path, label }) => (
          <Link 
            key={path} 
            to={path}
            className="flex flex-col items-center p-2 flex-1 min-w-0" // Added flex-1 and min-w-0 for better distribution
          >
            <Icon 
              className={cn(
                "h-6 w-6 transition-colors",
                pathname === path 
                  ? userRole === "resident" 
                    ? "text-[#1a237e]" 
                    : "text-[#ea384c]"
                  : "text-black"
              )} 
            />
            <span className={cn(
              "text-xs mt-1 text-center truncate w-full", // Added text-center, truncate, w-full
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
