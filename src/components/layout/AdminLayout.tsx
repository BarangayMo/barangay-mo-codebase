import { ReactNode, useEffect, useState } from "react";
import { EnhancedSidebar } from "./EnhancedSidebar";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Menu, ChevronLeft, ChevronRight, User, LogOut, Settings as SettingsIcon, Bell, MessageSquare, Search, Plus, Command, ChevronDown // Ensure this import is here
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}
export const AdminLayout = ({
  children,
  title
}: AdminLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const {
    logout,
    user
  } = useAuth();
  const navigate = useNavigate();
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  return <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 w-full overflow-x-hidden">
        <div className={cn("hidden md:block fixed h-full z-20 bg-white border-r shadow-sm transition-all duration-300 ease-in-out", isSidebarCollapsed ? "w-16" : "w-64")}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 px-4 border-b">
              <Link to="/" className={cn("flex items-center", isSidebarCollapsed ? "justify-center w-full" : "justify-start")}>
                <img alt="Logo" className="h-8 w-8" src="/lovable-uploads/4dd4bcf0-747b-4dfd-bdfe-159cabf43926.jpg" />
                {!isSidebarCollapsed && <span className="ml-2 text-lg font-semibold"></span>}
              </Link>
              {!isSidebarCollapsed && <Button variant="ghost" size="icon" onClick={() => setIsSidebarCollapsed(true)} className="h-7 w-7 transition-opacity">
                  <ChevronLeft className="h-4 w-4" />
                </Button>}
            </div>

            <div className="flex-1 overflow-hidden">
              <EnhancedSidebar isCollapsed={isSidebarCollapsed} />
            </div>

            {isSidebarCollapsed && <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
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
              </div>}

            {!isSidebarCollapsed && <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
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
              </div>}

            <div className={cn("border-t p-4", isSidebarCollapsed ? "flex justify-center" : "")}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={cn("w-full h-auto p-2 flex items-center gap-3 hover:bg-gray-100", isSidebarCollapsed ? "justify-center" : "justify-start")}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    {!isSidebarCollapsed && <div className="text-left">
                        <div className="font-medium text-sm">Admin User</div>
                        <div className="text-xs text-muted-foreground">Superadmin</div>
                      </div>}
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
            <img src="/lovable-uploads/d6bf0909-f59b-42dc-8d79-b45a400a1081.png" alt="Logo" className="h-8 w-8" />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AD</AvatarFallback>
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
                  <img src="/lovable-uploads/d6bf0909-f59b-42dc-8d79-b45a400a1081.png" alt="Logo" className="h-8 w-8" />
                  <span className="ml-2 text-lg font-semibold">Barangay Mo Admin</span>
                </Link>
              </div>
              <div className="flex-1 overflow-hidden">
                <EnhancedSidebar />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className={cn("flex flex-col min-h-screen w-full transition-all duration-300", isSidebarCollapsed ? "md:pl-16" : "md:pl-64")}>
          <Helmet>
            <title>{title} - Barangay Mo Admin</title>
          </Helmet>

          <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
            <div className="flex items-center justify-between h-16 px-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search..." className="pl-9 h-9 w-full bg-gray-50 border-gray-200 focus-visible:ring-1" />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium opacity-70">
                    <span className="text-xs">{isMac ? '⌘' : 'Ctrl'}</span> <span className="text-xs">F</span>
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
                
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">3</span>
                </Button>
                
                <Button variant="ghost" size="icon" className="relative">
                  <MessageSquare className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">5</span>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>AD</AvatarFallback>
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
          
          <main className="flex-1">
            <div className="container mx-auto py-6 px-4 md:px-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>;
};