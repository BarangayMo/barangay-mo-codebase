import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, ChevronDown, MapPin, User, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { useBarangayData } from "@/hooks/use-barangay-data";

export const Header = () => {
  const { isAuthenticated, userRole } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [location, setLocation] = useState("Select Barangay");
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const { barangays, isLoading, error } = useBarangayData();
  
  const filtered = barangays?.filter(brgy => 
    brgy.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const getHomeRoute = () => {
    switch (userRole) {
      case "resident":
        return "/resident-home";
      case "official":
        return "/official-dashboard";
      case "superadmin":
        return "/admin";
      default:
        return "/";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl bg-white/80 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={userRole === "resident" ? "/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" : "/lovable-uploads/141c2a56-35fc-4123-a51f-358481e0f167.png"} 
              alt="Logo" 
              className="h-8 w-auto" 
            />
          </Link>
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
                  {isLoading ? (
                    <div className="p-2 text-center text-sm text-muted-foreground">Loading...</div>
                  ) : error ? (
                    <div className="p-2 text-center text-sm text-red-500">{error}</div>
                  ) : filtered.length > 0 ? (
                    filtered.map(brgy => (
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
                    ))
                  ) : (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      No barangay found
                    </div>
                  )}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {!isMobile && (
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className={pathname === getHomeRoute() ? (userRole === "resident" ? "text-[#1a237e]" : "text-[#ea384c]") : ""}
            >
              <Link to={getHomeRoute()}>Home</Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className={pathname === "/marketplace" ? "text-[#1a237e]" : ""}
            >
              <Link to="/marketplace">Marketplace</Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className={pathname === "/services" ? "text-[#1a237e]" : ""}
            >
              <Link to="/services">Services</Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className={pathname === "/messages" ? "text-[#1a237e]" : ""}
            >
              <Link to="/messages">Messages</Link>
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                asChild
              >
                <Link to="/messages">
                  <MessageCircle className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center bg-[#ea384c]">
                    5
                  </span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="rounded-full">
                <Link to="/menu">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
