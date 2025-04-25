import { ReactNode, useEffect, useState } from "react";
import { EnhancedSidebar } from "./EnhancedSidebar";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  LogOut, 
  Settings as SettingsIcon 
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const { logout, user } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="flex min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <div className={cn(
        "hidden md:block transition-all duration-300 ease-in-out shrink-0",
        isSidebarCollapsed ? "w-16" : "w-64"
      )}>
        <div className={cn(
          "fixed h-full bg-white border-r",
          isSidebarCollapsed ? "w-16" : "w-64"
        )}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <Link to="/" className={cn(
                "flex items-center",
                isSidebarCollapsed ? "justify-center w-full" : "justify-start"
              )}>
                <img 
                  src="/lovable-uploads/d6bf0909-f59b-42dc-8d79-b45a400a1081.png" 
                  alt="Logo" 
                  className="h-8 w-8" 
                />
                {!isSidebarCollapsed && (
                  <span className="ml-2 text-lg font-semibold">Smarketplace</span>
                )}
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarCollapsed(prev => !prev)}
                className={cn(
                  "h-7 w-7 transition-opacity",
                  isSidebarCollapsed ? "opacity-0" : "opacity-100"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <EnhancedSidebar isCollapsed={isSidebarCollapsed} />
            </div>

            <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSidebarCollapsed(prev => !prev)}
                className="rounded-full h-6 w-6 border bg-white shadow-md"
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="h-3 w-3" />
                ) : (
                  <ChevronLeft className="h-3 w-3" />
                )}
              </Button>
            </div>

            <div className={cn(
              "border-t p-4",
              isSidebarCollapsed ? "flex justify-center" : ""
            )}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "w-full h-auto p-2 flex items-center gap-3 hover:bg-gray-100",
                      isSidebarCollapsed ? "justify-center" : "justify-start"
                    )}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    {!isSidebarCollapsed && (
                      <div className="text-left">
                        <div className="font-medium text-sm">Admin User</div>
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
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-20 border-b px-4 py-3 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/" className="mx-auto">
          <img 
            src="/lovable-uploads/d6bf0909-f59b-42dc-8d79-b45a400a1081.png" 
            alt="Logo" 
            className="h-8 w-8" 
          />
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
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0">
          <EnhancedSidebar />
        </SheetContent>
      </Sheet>
      
      <div className={cn(
        "flex flex-col min-h-screen w-full transition-all", 
        isSidebarCollapsed ? "md:pl-16" : "md:pl-64"
      )}>
        <Helmet>
          <title>{title} - Smarketplace Admin</title>
        </Helmet>
        <main className="flex-1">
          <div className="container mx-auto py-6 pt-16 md:pt-6 px-4 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
