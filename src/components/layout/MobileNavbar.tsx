
import { Link, useLocation } from "react-router-dom";
import { Crown, Search, MessageSquare, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const MobileNavbar = () => {
  const { pathname } = useLocation();
  const { userRole } = useAuth();

  // Determine color based on user role
  const roleColor = userRole === 'official'
    ? 'text-official'
    : userRole === 'resident'
      ? 'text-resident'
      : 'text-primary';

  // For more subtle purple shade (icon deactive)
  const inactive = "text-[#7E69AB] opacity-60";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black rounded-t-3xl px-4 pb-3 pt-4">
      <div className="flex items-center justify-between">
        {/* Crown/home */}
        <Link to="/" className="flex flex-col items-center pt-1">
          <Crown className={cn(
            "h-7 w-7",
            pathname === "/" ? roleColor : inactive
          )}/>
        </Link>

        {/* Discover - pill button with Search icon */}
        <Link to="/discover"
          className={cn(
            "relative flex items-center px-5 h-12 rounded-full bg-white shadow-md transition",
            pathname === "/discover"
              ? "ring-2 ring-primary"
              : ""
          )}
          style={{
            marginTop: -24
          }}
        >
          <Search className="h-6 w-6 mr-2 text-gray-700" />
          <span className="font-semibold text-lg text-gray-800">Discover</span>
        </Link>

        {/* Messages */}
        <Link to="/messages" className="flex flex-col items-center pt-1">
          <MessageSquare className={cn(
            "h-7 w-7",
            pathname === "/messages" ? roleColor : inactive
          )} />
        </Link>

        {/* Menu */}
        <Sheet>
          <SheetTrigger className="flex flex-col items-center pt-1 pl-2">
            <Menu className="h-7 w-7 text-[#7E69AB]" />
          </SheetTrigger>
          <SheetContent side="right" className="z-50! bg-white">
            <div className="flex flex-col gap-4 py-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <div className="flex flex-col space-y-3">
                <Link to="/about" className="py-2">About Us</Link>
                <Link to="/contact" className="py-2">Contact Us</Link>
                <Link to="/privacy" className="py-2">Privacy Policy</Link>
                <Link to="/terms" className="py-2">Terms & Conditions</Link>
                <Link to="/settings" className="py-2">Settings</Link>
                {/* Role-specific menu items */}
                {(userRole === 'official' || userRole === 'superadmin') && (
                  <>
                    <hr className="my-2" />
                    <Link to="/manage-residents" className="py-2">Manage Residents</Link>
                    <Link to="/manage-listings" className="py-2">Manage Listings</Link>
                    <Link to="/manage-jobs" className="py-2">Manage Jobs</Link>
                  </>
                )}
                {userRole === 'superadmin' && (
                  <>
                    <hr className="my-2" />
                    <Link to="/admin" className="py-2">Admin Dashboard</Link>
                    <Link to="/manage-officials" className="py-2">Manage Officials</Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
