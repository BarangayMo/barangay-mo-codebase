
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { User, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoadingScreen } from "../ui/loading";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useResidentProfile } from "@/hooks/use-resident-profile";

export function ProfileMenu() {
  const { logout, user } = useAuth();
  const { profile } = useResidentProfile();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const firstName = profile?.first_name || user?.firstName || '';
  const lastName = profile?.last_name || user?.lastName || '';
  const initials = firstName?.[0] || '' + lastName?.[0] || '';
  const avatarUrl = profile?.settings?.address?.avatar_url || 
    `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  return (
    <>
      {isLoggingOut && <LoadingScreen />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials || <User className="h-5 w-5" />}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
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
          <DropdownMenuItem 
            onClick={handleLogout}
            className="text-red-600 focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
