
import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, Briefcase, ShoppingCart, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const MobileNavbar = () => {
  const { pathname } = useLocation();
  const { userRole } = useAuth();

  const navItems = [
    { icon: Home, path: "/", label: "Home" },
    { icon: MessageSquare, path: "/messages", label: "Messages" },
    { icon: Briefcase, path: "/jobs", label: "Jobs" },
    { icon: ShoppingCart, path: "/marketplace", label: "Market" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-t border-white/20 px-2 py-2">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {navItems.map(({ icon: Icon, path, label }) => (
          <Link 
            key={path} 
            to={path}
            className="flex flex-col items-center p-2"
          >
            <Icon 
              className={cn(
                "h-6 w-6 transition-colors",
                pathname === path ? "text-[#ea384c]" : "text-black"
              )} 
            />
            <span className={cn(
              "text-xs mt-1",
              pathname === path ? "text-[#ea384c] font-medium" : "text-black"
            )}>
              {label}
            </span>
          </Link>
        ))}

        <Sheet>
          <SheetTrigger className="flex flex-col items-center p-2">
            <Menu className="h-6 w-6 text-gray-500" />
            <span className="text-xs mt-1 text-gray-500">Menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            {/* Menu content */}
            <div className="py-4">
              <h2 className="text-lg font-medium mb-4">Menu</h2>
              <div className="space-y-3">
                <Link to="/" className="block p-2 hover:bg-gray-100 rounded-lg">Home</Link>
                <Link to="/jobs" className="block p-2 hover:bg-gray-100 rounded-lg">Jobs</Link>
                <Link to="/marketplace" className="block p-2 hover:bg-gray-100 rounded-lg">Marketplace</Link>
                {userRole === 'official' && (
                  <>
                    <hr className="my-2" />
                    <Link to="/official-dashboard" className="block p-2 hover:bg-gray-100 rounded-lg">Official Dashboard</Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
