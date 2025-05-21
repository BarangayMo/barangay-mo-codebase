import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Briefcase } from "lucide-react";

export function DesktopNavItems() {
  const { pathname } = useLocation();
  const { isAuthenticated, userRole } = useAuth();

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
        asChild
        className={pathname === "/marketplace" ? "text-[#1a237e]" : ""}
      >
        <Link to="/marketplace">Marketplace</Link>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        asChild
        className={pathname === "/services" ? "text-[#1a237e]" : ""}
      >
        <Link to="/services">Services</Link>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        asChild
        className={pathname.startsWith("/jobs") ? "text-[#1a237e]" : ""}
      >
        <Link to={getJobsRoute()}>Jobs</Link>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        asChild
        className={pathname === "/messages" ? "text-[#1a237e]" : ""}
      >
        <Link to={getMessagesRoute()}>Messages</Link>
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
