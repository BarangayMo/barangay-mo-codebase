
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
import { Badge } from "@/components/ui/badge";

export function ProfileMenu() {
  const { logout, user, session } = useAuth();
  const { profile } = useResidentProfile();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const firstName = profile?.first_name || user?.firstName || '';
  const lastName = profile?.last_name || user?.lastName || '';
  const initials = firstName?.[0] || '' + lastName?.[0] || '';
  
  // Fix type handling for address.avatar_url
  const avatarUrl = profile?.settings?.address && typeof profile.settings.address === 'object' 
    ? (profile.settings.address as any)?.avatar_url 
    : `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`;

  // Check email confirmation status
  const isEmailConfirmed = session?.user?.email_confirmed_at ? true : false;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  // Determine profile route based on user role
  const getProfileRoute = () => {
    if (user?.role === 'official' || user?.role === 'superadmin') {
      return '/official-profile';
    }
    return '/resident-profile';
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
            {!isEmailConfirmed && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{firstName} {lastName}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-gray-500">{user?.email}</p>
              <Badge variant={isEmailConfirmed ? "default" : "secondary"} className="text-xs">
                {isEmailConfirmed ? "Confirmed" : "Unconfirmed"}
              </Badge>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={getProfileRoute()} className="flex items-center">
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
