
import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, Briefcase, ShoppingCart, Menu, Settings, LogOut, User, HelpCircle, Bell, Download, Users, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const MobileNavbar = () => {
  const { pathname } = useLocation();
  const { userRole, isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { icon: Home, path: "/", label: "Home" },
    { icon: MessageSquare, path: "/messages", label: "Messages" },
    { icon: Briefcase, path: "/jobs", label: "Jobs" },
    { icon: Package, path: "/marketplace", label: "Market" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-white/60 border-t border-white/20">
      <div className="flex items-center justify-between px-2.5 py-2">
        {navItems.map(({ icon: Icon, path, label }) => (
          <Link 
            key={path} 
            to={path}
            className="flex flex-col items-center p-2"
          >
            <Icon 
              className={cn(
                "h-6 w-6 transition-colors",
                pathname === path 
                  ? userRole === "resident" 
                    ? "text-resident" 
                    : "text-official"
                  : "text-black"
              )} 
            />
            <span className={cn(
              "text-xs mt-1",
              pathname === path 
                ? userRole === "resident"
                  ? "text-resident font-medium"
                  : "text-official font-medium"
                : "text-black"
            )}>
              {label}
            </span>
          </Link>
        ))}

        <Dialog>
          <DialogTrigger className="flex flex-col items-center p-2">
            <div className="relative w-6 h-6 flex flex-col justify-center gap-1">
              <span className="w-6 h-0.5 bg-black block" />
              <span className="w-4 h-0.5 bg-black block ml-auto" />
              <span className="w-6 h-0.5 bg-black block" />
            </div>
            <span className="text-xs mt-1 text-black">Menu</span>
          </DialogTrigger>
          <DialogContent className="p-0 sm:max-w-[350px]">
            <div className="bg-white rounded-lg overflow-hidden">
              {isAuthenticated && (
                <div className="p-4 flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{user?.name || "User"}</p>
                    <p className="text-sm text-muted-foreground">Active</p>
                  </div>
                </div>
              )}
              
              <div className={cn("p-2", isAuthenticated && "border-t")}>
                <Link to="/" className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md">
                  <Home size={18} /> Home
                </Link>
                <Link to="/jobs" className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md">
                  <Briefcase size={18} /> Jobs
                </Link>
                <Link to="/marketplace" className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md">
                  <Package size={18} /> Marketplace
                </Link>
              </div>
              
              <Separator />
              
              {isAuthenticated ? (
                <div className="p-2">
                  <Link to="/profile" className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md">
                    <User size={18} /> Edit account
                  </Link>
                  <Link to="/settings" className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md">
                    <Settings size={18} /> Workspace settings
                  </Link>
                  <Link to="/invite" className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md">
                    <Users size={18} /> Invite your team
                  </Link>
                  
                  <Separator className="my-2" />
                  
                  <Link to="/downloads" className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <Download size={18} /> Downloads
                    </div>
                    <span>→</span>
                  </Link>
                  <Link to="/help" className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <HelpCircle size={18} /> Help and support
                    </div>
                    <span>→</span>
                  </Link>
                  <Link to="/whats-new" className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <Bell size={18} /> What's new
                    </div>
                    <span>→</span>
                  </Link>
                  
                  <Separator className="my-2" />
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start p-3 font-normal hover:bg-gray-50"
                    onClick={logout}
                  >
                    <LogOut size={18} className="mr-3" /> Log out
                  </Button>
                </div>
              ) : (
                <div className="p-2">
                  <Link to="/login" className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md">
                    <User size={18} /> Login
                  </Link>
                  <Link to="/register" className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md">
                    <User size={18} /> Register
                  </Link>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
};
