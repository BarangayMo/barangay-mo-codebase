
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, ChevronDown, MapPin, User } from "lucide-react";
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
  const navigate = useNavigate();
  const [location, setLocation] = useState("Select Barangay");
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered = BARANGAYS.filter(brgy => brgy.toLowerCase().includes(search.toLowerCase()));

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl bg-white/80 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{location}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
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
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {!isMobile && (
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">Home</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/marketplace">Marketplace</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/jobs">Jobs</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/messages">Messages</Link>
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              asChild
            >
              <Link to="/notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center bg-[#ea384c]">
                  3
                </span>
              </Link>
            </Button>
          )}

          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link to="/login">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
