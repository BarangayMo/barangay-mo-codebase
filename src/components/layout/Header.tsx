
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Bell, 
  ChevronDown, 
  MapPin, 
  User 
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export const Header = () => {
  const { isAuthenticated, userRole, logout } = useAuth();
  const isMobile = useIsMobile();
  const [location, setLocation] = useState("Select Location");

  return (
    <header className={`
      w-full p-4 sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b
      ${userRole === 'official' ? 'border-official/20' : ''}
      ${userRole === 'resident' ? 'border-resident/20' : ''}
      ${userRole === 'superadmin' ? 'border-primary/20' : ''}
    `}>
      <div className="container mx-auto flex items-center justify-between">
        {!isMobile && (
          <Link to="/" className="text-2xl font-bold">
            Smart Barangay
          </Link>
        )}

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className={isMobile ? "max-w-[100px] truncate" : ""}>
                  {location}
                </span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLocation("Use Current Location")}>
                Use Current Location
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("Quezon City")}>
                Quezon City
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("Manila")}>
                Manila
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("Makati")}>
                Makati
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("Cebu City")}>
                Cebu City
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            asChild
          >
            <Link to="/notifications">
              <Bell className="h-5 w-5" />
              <span className={`
                absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center
                ${userRole === 'official' ? 'bg-official' : ''}
                ${userRole === 'resident' ? 'bg-resident' : ''}
              `}>
                3
              </span>
            </Link>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className={`rounded-full border-2 
                  ${userRole === 'official' ? 'border-official' : ''}
                  ${userRole === 'resident' ? 'border-resident' : ''}
                  ${userRole === 'superadmin' ? 'border-primary' : ''}
                  ${!userRole ? 'border-gray-300' : ''}
                `}
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/register">Register</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
