import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, ChevronDown, MapPin, User, Map } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";

const BARANGAYS = [
  "Batasan Hills", "Commonwealth", "Holy Spirit", "Bagong Silangan",
  "Payatas", "Tandang Sora", "Matandang Balara", "Sauyo", "Bagbag",
  "Greater Lagro", "Kaligayahan", "Pasong Putik"
];

export const Header = () => {
  const { isAuthenticated, userRole, logout } = useAuth();
  const isMobile = useIsMobile();
  const [location, setLocation] = useState("Select Barangay");
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered = BARANGAYS.filter(brgy => brgy.toLowerCase().includes(search.toLowerCase()));

  const notificationColor = userRole === 'official'
    ? 'bg-official'
    : userRole === 'resident'
      ? 'bg-resident'
      : 'bg-primary';

  const borderColor = userRole === 'official'
    ? 'border-official'
    : userRole === 'resident'
      ? 'border-resident'
      : userRole === 'superadmin'
        ? 'border-primary'
        : 'border-gray-300';

  return (
    <header className={`
      w-full px-4 md:px-6 py-4 sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b flex items-center justify-between
      ${userRole === 'official' ? 'border-official/10' : ''}
      ${userRole === 'resident' ? 'border-resident/10' : ''}
      ${userRole === 'superadmin' ? 'border-primary/10' : ''}
    `}>
      {!isMobile && (
        <Link to="/" className="text-xl font-bold whitespace-nowrap">
          Smart Barangay
        </Link>
      )}

      <div className="flex-1 flex justify-start max-w-md mx-4">
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="max-w-[240px] flex items-center gap-2 justify-start px-4"
            >
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{location}</span>
              <ChevronDown className="h-3 w-3 opacity-50 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[240px]">
            <div className="p-2">
              <Input
                placeholder="Search barangay..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mb-2"
              />
              <div className="max-h-40 overflow-y-auto">
                {filtered.map(brgy => (
                  <DropdownMenuItem
                    key={brgy}
                    onClick={() => {
                      setLocation(brgy);
                      setDropdownOpen(false);
                      setSearch("");
                    }}
                  >
                    {brgy}
                  </DropdownMenuItem>
                ))}
                {filtered.length === 0 && (
                  <div className="text-xs text-muted-foreground px-2 py-1">
                    No barangay found
                  </div>
                )}
              </div>
            </div>
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
              absolute -top-1 -right-1 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center
              ${notificationColor}
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
              className="rounded-full"
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
    </header>
  );
};
