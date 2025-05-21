
import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, Store, Menu, LifeBuoy } from "lucide-react"; // Changed ShoppingCart to Store
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

  // const isMarketplaceRoute = pathname.startsWith('/marketplace'); // No longer needed for hiding home

  const navItems = [
    { icon: Home, path: getHomeRoute(), label: "Home" }, // Always show Home
    { icon: MessageSquare, path: getMessagesRoute(), label: "Messages" },
    { icon: Store, path: "/marketplace", label: "Market" }, // Changed icon to Store
    { icon: LifeBuoy, path: "/services", label: "Services" },
    { icon: Menu, path: "/menu", label: "Menu" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-t border-white/20 shadow-lg rounded-t-xl pb-8">
      <div className="flex items-center justify-around px-2.5 py-2">
        {navItems.map(({ icon: Icon, path, label }) => (
          <Link 
            key={path} 
            to={path}
            className="flex flex-col items-center p-2 flex-1 min-w-0"
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
              "text-xs mt-1 text-center truncate w-full",
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
