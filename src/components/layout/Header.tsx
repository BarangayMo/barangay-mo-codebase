
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Menu, 
  Settings,
  User,
  LogOut,
  ChevronDown,
  MapPin,
  Bell
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { HeaderLogo } from "./header/HeaderLogo";
import { DesktopNavItems } from "./header/DesktopNavItems";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, userRole, logout } = useAuth();

  const getDashboardRoute = () => {
    switch (userRole) {
      case "official":
        return "/official-dashboard";
      case "superadmin":
        return "/admin/dashboard";
      case "resident":
        return "/resident-home";
      default:
        return "/";
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <HeaderLogo />
            
            {/* Location Selector */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <Button variant="ghost" size="sm" className="h-auto p-0 font-normal">
                Select Barangay...
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Center section - Navigation */}
          <div className="hidden md:flex items-center">
            <DesktopNavItems />
          </div>

          {/* Right section - Dashboard, Notifications, Profile */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <>
                <Button asChild className="bg-red-500 hover:bg-red-600 text-white">
                  <Link to={getDashboardRoute()}>Dashboard</Link>
                </Button>
                
                <div className="w-px h-6 bg-gray-300" />
                
                <NotificationDropdown />
              </>
            )}

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="bg-red-500 text-white">
                      {userRole === "superadmin" ? "WO" : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/resident-profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
