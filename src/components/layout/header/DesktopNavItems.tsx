import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRbiAccess } from "@/hooks/use-rbi-access";
import { Briefcase } from "lucide-react";

export function DesktopNavItems() {
  const { pathname } = useLocation();
  const { isAuthenticated, userRole } = useAuth();
  const { checkAccess } = useRbiAccess();

  const getDashboardRoute = () => {
    switch (userRole) {
      case "official":
        return "/official-dashboard";
      case "superadmin":
        return "/admin";
      case "resident":
        return "/resident-home";
      default:
        return "/";
    }
  };

  const getHomeRoute = () => {
    return isAuthenticated ? "/" : "/";
  };

  const getMessagesRoute = () => {
    return isAuthenticated ? "/messages" : "/login";
  };

  const getJobsRoute = () => {
    return "/jobs";
  };

  return (
    <div className="hidden md:flex items-center space-x-1">
      <Button 
        variant="ghost" 
        size="sm" 
        asChild
        className={pathname === "/" ? (userRole === "resident" ? "text-[#1a237e]" : "text-[#ea384c]") : ""}
      >
        <Link to={getHomeRoute()}>Home</Link>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className={pathname === "/marketplace" ? "text-[#1a237e]" : ""}
        onClick={(e) => {
          e.preventDefault();
          checkAccess(() => {
            window.location.href = '/marketplace';
          });
        }}
      >
        Marketplace
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className={pathname === "/services" ? "text-[#1a237e]" : ""}
        onClick={(e) => {
          e.preventDefault();
          checkAccess(() => {
            window.location.href = '/services';
          });
        }}
      >
        Services
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className={pathname.startsWith("/jobs") ? "text-[#1a237e]" : ""}
        onClick={(e) => {
          e.preventDefault();
          checkAccess(() => {
            window.location.href = '/jobs';
          });
        }}
      >
        Jobs
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className={pathname === "/messages" ? "text-[#1a237e]" : ""}
        onClick={(e) => {
          e.preventDefault();
          checkAccess(() => {
            window.location.href = '/messages';
          });
        }}
      >
        Messages
      </Button>
      
      {userRole === "superadmin" && (
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className={pathname.startsWith("/admin/smarketplace") ? "text-[#1a237e]" : ""}
        >
          <Link to="/admin/smarketplace">Smarketplace</Link>
        </Button>
      )}
    </div>
  );
}
