
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { HeaderLogo } from "./header/HeaderLogo";
import { LocationDropdown } from "./header/LocationDropdown";
import { DesktopNavItems } from "./header/DesktopNavItems";
import { ProfileMenu } from "./ProfileMenu";

export const Header = () => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <HeaderLogo />
          <LocationDropdown />
        </div>

        <DesktopNavItems />

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
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
              {!isMobile && <ProfileMenu />}
              {isMobile && (
                <Button asChild variant="ghost" size="icon" className="rounded-full">
                  <Link to="/menu">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
