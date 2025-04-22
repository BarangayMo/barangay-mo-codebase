
import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, ShoppingCart, Menu, LifeBuoy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export const MobileNavbar = () => {
  const { pathname } = useLocation();
  const { userRole } = useAuth();

  const getHomeRoute = () => {
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

  const navItems = [
    { icon: Home, path: getHomeRoute(), label: "Home" },
    { icon: MessageSquare, path: "/messages", label: "Messages" },
    { icon: ShoppingCart, path: "/marketplace", label: "Market" },
    { icon: LifeBuoy, path: "/services", label: "Services" },
    { icon: Menu, path: "/menu", label: "Menu" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-t border-white/20 shadow-lg">
      <div className="flex items-center justify-between px-2.5 py-2">
        {navItems.map(({ icon: Icon, path, label }) => (
          <Link 
            key={path} 
            to={path}
            className="flex flex-col items-center p-2"
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
              "text-xs mt-1",
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
