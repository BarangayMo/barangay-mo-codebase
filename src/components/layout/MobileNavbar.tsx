
import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, Briefcase, Package, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export const MobileNavbar = () => {
  const { pathname } = useLocation();
  const { userRole } = useAuth();

  const navItems = [
    { icon: Home, path: "/", label: "Home" },
    { icon: MessageSquare, path: "/messages", label: "Messages" },
    { icon: Briefcase, path: "/jobs", label: "Jobs" },
    { icon: Package, path: "/marketplace", label: "Market" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-white/60 border-t border-white/20">
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
                    ? "text-resident" 
                    : "text-official"
                  : "text-black"
              )} 
            />
            <span className={cn(
              "text-xs mt-1",
              pathname === path 
                ? userRole === "resident"
                  ? "text-resident font-medium"
                  : "text-official font-medium"
                : "text-black"
            )}>
              {label}
            </span>
          </Link>
        ))}

        <Link to="/menu" className="flex flex-col items-center p-2">
          <Menu className="h-6 w-6" />
          <span className="text-xs mt-1">Menu</span>
        </Link>
      </div>
    </nav>
  );
};
