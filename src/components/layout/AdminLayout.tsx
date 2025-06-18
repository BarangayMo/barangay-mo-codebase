import { ReactNode, useEffect, useState } from "react";
import { EnhancedSidebar } from "./EnhancedSidebar";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Menu, ChevronLeft, ChevronRight, User, LogOut, Settings as SettingsIcon, Bell, MessageSquare, Search, Plus, Command, ChevronDown } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CommandPalette } from "./CommandPalette";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { useNotifications } from "@/hooks/useNotifications";
import { useResidentProfile } from "@/hooks/use-resident-profile";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  hidePageHeader?: boolean;
}

export const AdminLayout = ({
  children,
  title,
  hidePageHeader = false
}: AdminLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const {
    logout,
    user
  } = useAuth();
  const { profile } = useResidentProfile();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  // Get user initials and avatar
  const firstName = profile?.first_name || user?.firstName || '';
  const lastName = profile?.last_name || user?.lastName || '';
  const initials = (firstName?.[0] || '') + (lastName?.[0] || '');
  const fallbackInitials = initials || 'AD';
  
  // Get avatar URL from profile or generate default
  const avatarUrl = profile?.avatar_url || 
    (profile?.settings?.address && typeof profile.settings.address === 'object' 
      ? (profile.settings.address as any)?.avatar_url 
      : null);

  const displayName = firstName && lastName ? `${firstName} ${lastName}` : user?.name || 'Admin User';

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Prevent typing "/" in input fields
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 w-full overflow-x-hidden">
        <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
        
        <div className={cn("hidden md:block fixed h-full z-20 bg-white border-r shadow-sm transition-all duration-300 ease-in-out", isSidebarCollapsed ? "w-16" : "w-64")}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 px-4 border-b">
              <Link to="/" className={cn("flex items-center", isSidebarCollapsed ? "justify-center w-full" : "justify-start")}>
                <img alt="Logo" className="h-8 w-8" src="/lovable-uploads/4dd4bcf0-747b-4dfd-bdfe-159cabf43926.jpg" />
                {!isSidebarCollapsed && <span className="ml-2 text-lg font-semibold"></span>}
              </Link>
            </div>

            <div className="flex-1 overflow-hidden">
              <EnhancedSidebar isCollapsed={isSidebarCollapsed} />
            </div>

            {isSidebarCollapsed && (
              <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setIsSidebarCollapsed(false)} className="rounded-full h-6 w-6 border bg-white shadow-md transition-transform duration-300 ease-in-out">
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Expand Menu
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            {!isSidebarCollapsed && (
              <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setIsSidebarCollapsed(true)} className="rounded-full h-6 w-6 border bg-white shadow-md transition-transform duration-300 ease-in-out">
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Collapse Menu
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            <div className={cn("border-t p-4", isSidebarCollapsed ? "flex justify-center" : "")}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={cn("w-full h-auto p-2 flex items-center gap-3 hover:bg-gray-100", isSidebarCollapsed ? "justify-center" : "justify-start")}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl || ""} alt={displayName} />
                      <AvatarFallback>{fallbackInitials}</AvatarFallback>
                    </Avatar>
                    {!isSidebarCollapsed && (
                      <div className="text-left">
                        <div className="font-medium text-sm">{displayName}</div>
                        <div className="text-xs text-muted-foreground">Superadmin</div>
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/resident-profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/settings" className="flex items-center cursor-pointer">
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-20 border-b px-4 py-3 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="mx-auto">
            <img alt="Logo" className="h-8 w-8" src="/lovable-uploads/13aba568-e026-4cfb-a117-604758fe79f1.jpg" />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl || ""} alt={displayName} />
                  <AvatarFallback>{fallbackInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/resident-profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/settings" className="flex items-center">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-[280px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center h-16 px-4 border-b">
                <Link to="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                  <img alt="Logo" src="/lovable-uploads/02005d02-8f81-4c95-be8e-ba9d8eb3e0d1.jpg" className="h-8 w-8" />
                </Link>
              </div>
              <div className="flex-1 overflow-hidden">
                <EnhancedSidebar />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className={cn("flex flex-col min-h-screen w-full transition-all duration-300", isSidebarCollapsed ? "md:pl-16" : "md:pl-64", hidePageHeader ? "md:pt-0" : "md:pt-0")}>
          <Helmet>
            <title>{title} - Barangay Mo Admin</title>
          </Helmet>

          {!hidePageHeader && (
            <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
              <div className="flex items-center justify-between h-16 px-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search..." 
                    className="pl-9 h-9 w-full bg-gray-50 border-gray-200 focus-visible:ring-1 cursor-pointer" 
                    onClick={() => setIsCommandOpen(true)}
                    readOnly
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium opacity-70">
                      <span className="text-xs">/</span>
                    </kbd>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="gap-2" variant="outline">
                        <Plus className="h-4 w-4" /> Create <ChevronDown className="h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        Create Product
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Create Order
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Create Vendor
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-80 p-0 mr-4" 
                      align="end"
                      side="bottom"
                      sideOffset={8}
                    >
                      <NotificationDropdown onClose={() => setIsNotificationOpen(false)} />
                    </PopoverContent>
                  </Popover>
                  
                  <Button variant="ghost" size="icon" className="relative">
                    <MessageSquare className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">5</span>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={avatarUrl || ""} alt={displayName} />
                          <AvatarFallback>{fallbackInitials}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to="/resident-profile" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/settings" className="flex items-center">
                          <SettingsIcon className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>
          )}
          
          <main className="flex-1">
            <div className={cn("container mx-auto px-4 md:px-6", hidePageHeader ? "py-2" : "py-2")}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
