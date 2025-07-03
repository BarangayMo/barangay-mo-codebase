
import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, Store, Menu, LifeBuoy, User, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRbiForms } from "@/hooks/use-rbi-forms";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";

export const MobileNavbar = () => {
  const { pathname } = useLocation();
  const { userRole, isAuthenticated } = useAuth();
  const { rbiForms, isLoading: rbiLoading } = useRbiForms();

  const getHomeRoute = () => {
    if (!isAuthenticated) {
      return "/login";
    }
    switch (userRole) {
      case "official":
        return "/official-dashboard";
      case "superadmin":
        return "/admin";
      case "resident":
      default:
        return "/resident-home";
    }
  };

  const getMessagesRoute = () => {
    return isAuthenticated ? "/messages" : "/login";
  };

  const getProfileRoute = () => {
    if (!isAuthenticated) {
      return "/login";
    }
    switch (userRole) {
      case "official":
        return "/resident-profile";
      case "superadmin":
        return "/resident-profile";
      case "resident":
      default:
        return "/resident-profile";
    }
  };

  // Calculate RBI progress for residents
  const getRbiProgress = () => {
    if (!rbiForms || rbiLoading) return 0;
    const hasCompletedRbi = rbiForms.length > 0;
    const approvedRbi = rbiForms.find(form => form.status === 'approved');
    
    if (approvedRbi) return 100;
    if (hasCompletedRbi) return 75; // Submitted but not approved
    return 0; // Not started
  };

  // Different nav items based on user role
  const getNavItems = () => {
    if (userRole === "official") {
      return [
        {
          icon: Home,
          path: getHomeRoute(),
          label: "Home",
          key: "home"
        },
        {
          icon: Briefcase,
          path: "/official/officials",
          label: "Officials",
          key: "officials"
        },
        {
          icon: MessageSquare,
          path: getMessagesRoute(),
          label: "Messages",
          key: "messages"
        },
        {
          icon: LifeBuoy,
          path: "/services",
          label: "Services",
          key: "services"
        },
        {
          icon: User,
          path: getProfileRoute(),
          label: "Profile",
          key: "profile"
        }
      ];
    }

    // Default nav items for other roles
    return [
      {
        icon: Home,
        path: getHomeRoute(),
        label: "Home",
        key: "home"
      },
      {
        icon: MessageSquare,
        path: getMessagesRoute(),
        label: "Messages",
        key: "messages"
      },
      {
        icon: Store,
        path: "/marketplace",
        label: "Market",
        key: "marketplace"
      },
      {
        icon: LifeBuoy,
        path: "/services",
        label: "Services",
        key: "services"
      },
      {
        icon: Menu,
        path: "/menu",
        label: "Menu",
        key: "menu",
        isSheet: true
      }
    ];
  };

  const navItems = getNavItems();
  const rbiProgress = getRbiProgress();

  const MenuSheet = () => (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex flex-col items-center justify-center p-2 min-w-0">
          <Menu className={cn(
            "h-6 w-6 transition-colors mb-0.5",
            "text-black"
          )} />
          <span className="text-sm text-center leading-tight text-black">
            Menu
          </span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[50vh]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        
        {userRole === "resident" && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">RBI Registration</span>
              <span className="text-sm text-gray-600">{rbiProgress}%</span>
            </div>
            <Progress value={rbiProgress} className="mb-2" />
            <div className="text-xs text-gray-500">
              {rbiProgress === 0 && "Start your RBI registration"}
              {rbiProgress === 75 && "Waiting for approval"}
              {rbiProgress === 100 && "Registration complete"}
            </div>
            {rbiProgress < 100 && (
              <Link 
                to="/rbi-registration" 
                className="inline-block mt-2 text-xs text-blue-600 hover:underline"
              >
                {rbiProgress === 0 ? "Start RBI" : "Check Status"}
              </Link>
            )}
          </div>
        )}

        <div className="mt-6 space-y-2">
          <Link to="/settings" className="block p-3 hover:bg-gray-100 rounded-lg">
            Settings
          </Link>
          <Link to="/support" className="block p-3 hover:bg-gray-100 rounded-lg">
            Support
          </Link>
          <Link to="/about" className="block p-3 hover:bg-gray-100 rounded-lg">
            About
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-t border-white/20 shadow-lg rounded-t-xl pb-2">
      <div className="flex items-center justify-center px-4 py-2 max-w-md mx-auto">
        <div className="flex items-center justify-between w-full max-w-sm">
          {navItems.map(({ icon: Icon, path, label, key, isSheet }) => {
            if (isSheet) {
              return <MenuSheet key={key} />;
            }
            
            return (
              <Link key={key} to={path} className="flex flex-col items-center justify-center p-2 min-w-0">
                <Icon className={cn(
                  "h-6 w-6 transition-colors mb-0.5",
                  pathname === path 
                    ? userRole === "resident" 
                      ? "text-[#000084]" 
                      : "text-black"
                    : "text-black"
                )} />
                <span className={cn(
                  "text-sm text-center leading-tight",
                  pathname === path 
                    ? userRole === "resident" 
                      ? "text-[#000084] font-bold" 
                      : "text-black font-bold"
                    : "text-black"
                )}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
