
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { User, Settings, LogOut, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoadingScreen } from "../ui/loading";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useResidentProfile } from "@/hooks/use-resident-profile";

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
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72 sm:w-80">
          <div className="px-3 py-2">
            <p className="text-sm font-medium truncate">{firstName} {lastName}</p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
            {profile?.barangay && (
              <div className="flex items-start gap-2 mt-2">
                <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-gray-500 break-words leading-relaxed">
                  {profile.barangay}
                </span>
              </div>
            )}
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
