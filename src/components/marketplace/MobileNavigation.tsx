
import { Home, LayoutGrid, HeartIcon, Bell, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function MobileNavigation() {
  const location = useLocation();
  
  // Only show this navigation on specific marketplace pages where we want a different nav
  // For now, let's not show it at all to prevent duplicates with the main MobileNavbar
  // This component can be used later if needed for specific marketplace-only pages
  const shouldShow = false; // Disable for now to prevent duplicates
  
  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 md:hidden z-50">
      <div className="flex justify-around items-center">
        <Link to="/marketplace" className="flex flex-col items-center gap-1">
          <Home className="w-6 h-6 text-resident" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/marketplace/categories" className="flex flex-col items-center gap-1">
          <LayoutGrid className="w-6 h-6" />
          <span className="text-xs">Categories</span>
        </Link>
        <Link to="/marketplace/wishlist" className="flex flex-col items-center gap-1">
          <HeartIcon className="w-6 h-6" />
          <span className="text-xs">Wishlist</span>
        </Link>
        <Link to="/notifications" className="flex flex-col items-center gap-1">
          <Bell className="w-6 h-6" />
          <span className="text-xs">Notifications</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center gap-1">
          <User className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </div>
  );
}
