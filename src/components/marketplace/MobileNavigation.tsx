
import { Home, LayoutGrid, HeartIcon, Bell, User } from "lucide-react";
import { Link } from "react-router-dom";

export function MobileNavigation() {
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
