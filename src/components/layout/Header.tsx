
import { Link, useNavigate } from "react-router-dom";
import { Menu, MessageSquare, Bell, ShoppingCart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { HeaderLogo } from "./header/HeaderLogo";
import { LocationDropdown } from "./header/LocationDropdown";
import { DesktopNavItems } from "./header/DesktopNavItems";
import { ProfileMenu } from "./ProfileMenu";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { UnreadBadge } from "@/components/messages/UnreadBadge";
import { useCartSummary } from "@/hooks/useCartSummary";

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

export const Header = ({ onMenuClick, className }: HeaderProps) => {
  const { isAuthenticated, user } = useAuth();
  const { totalItems } = useCartSummary();
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate("/marketplace/cart");
  };

  const handleMessagesClick = () => {
    navigate("/messages");
  };

  return (
    <header className={`bg-white border-b border-gray-200 ${className || ""}`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <HeaderLogo />
          </div>

          {/* Center section - Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <DesktopNavItems />
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <LocationDropdown />
            
            {isAuthenticated && (
              <>
                {/* Messages Icon with Badge */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleMessagesClick}
                    className="relative"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <UnreadBadge />
                  </Button>
                </div>

                {/* Notifications */}
                <NotificationDropdown />

                {/* Shopping Cart */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCartClick}
                    className="relative"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {totalItems > 9 ? '9+' : totalItems}
                      </span>
                    )}
                  </Button>
                </div>
              </>
            )}

            {isAuthenticated ? (
              <ProfileMenu user={user} />
            ) : (
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
