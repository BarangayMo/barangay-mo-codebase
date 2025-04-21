
import { Link, useLocation } from "react-router-dom";
import { Home, Briefcase, ShoppingCart, MessageSquare, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";

export const MobileNavbar = () => {
  const { pathname } = useLocation();
  const { userRole } = useAuth();
  
  const getActiveClass = (path: string) => {
    return pathname === path ? 
      userRole === 'official' ? 'text-official' : 
      userRole === 'resident' ? 'text-resident' : 
      'text-primary' : 'text-muted-foreground';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t p-2">
      <div className="flex items-center justify-around">
        <Link to="/" className="flex flex-col items-center p-1">
          <Home className={`h-6 w-6 ${getActiveClass('/')}`} />
          <span className={`text-xs ${getActiveClass('/')}`}>Home</span>
        </Link>
        
        <Link to="/jobs" className="flex flex-col items-center p-1">
          <Briefcase className={`h-6 w-6 ${getActiveClass('/jobs')}`} />
          <span className={`text-xs ${getActiveClass('/jobs')}`}>Jobs</span>
        </Link>
        
        <Link to="/marketplace" className="flex flex-col items-center p-1">
          <ShoppingCart className={`h-6 w-6 ${getActiveClass('/marketplace')}`} />
          <span className={`text-xs ${getActiveClass('/marketplace')}`}>Shop</span>
        </Link>
        
        <Link to="/messages" className="flex flex-col items-center p-1">
          <MessageSquare className={`h-6 w-6 ${getActiveClass('/messages')}`} />
          <span className={`text-xs ${getActiveClass('/messages')}`}>Messages</span>
        </Link>
        
        <Sheet>
          <SheetTrigger className="flex flex-col items-center p-1">
            <Menu className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Menu</span>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 py-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              
              <div className="flex flex-col space-y-3">
                <Link to="/about" className="py-2">About Us</Link>
                <Link to="/contact" className="py-2">Contact Us</Link>
                <Link to="/privacy" className="py-2">Privacy Policy</Link>
                <Link to="/terms" className="py-2">Terms & Conditions</Link>
                <Link to="/settings" className="py-2">Settings</Link>
                
                {/* Role-specific menu items */}
                {(userRole === 'official' || userRole === 'superadmin') && (
                  <>
                    <hr />
                    <Link to="/manage-residents" className="py-2">Manage Residents</Link>
                    <Link to="/manage-listings" className="py-2">Manage Listings</Link>
                    <Link to="/manage-jobs" className="py-2">Manage Jobs</Link>
                  </>
                )}
                
                {userRole === 'superadmin' && (
                  <>
                    <hr />
                    <Link to="/admin" className="py-2">Admin Dashboard</Link>
                    <Link to="/manage-officials" className="py-2">Manage Officials</Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
