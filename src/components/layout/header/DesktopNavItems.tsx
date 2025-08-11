import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRbiAccess } from "@/hooks/use-rbi-access";
import { Briefcase } from "lucide-react";
import { toast } from "sonner";

export function DesktopNavItems() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();
  const { hasRbiAccess } = useRbiAccess();

  const handleRestrictedAccess = (path: string) => {
    if (userRole === 'resident' && !hasRbiAccess) {
      toast.dismiss(); // Dismiss any existing toasts first
      toast.error("Restricted Access", {
        description: "Submit your RBI form to access these options",
        duration: 4000,
      });
      return;
    }
    navigate(path);
  };

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
      {userRole !== "resident" && (
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className={pathname === "/" ? "text-[#ea384c]" : ""}
        >
          <Link to={getHomeRoute()}>Home</Link>
        </Button>
      )}
      
      <Button 
        variant="ghost" 
        size="sm" 
        className={pathname === "/marketplace" ? "text-[#1a237e]" : ""}
        onClick={(e) => {
          e.preventDefault();
          handleRestrictedAccess('/marketplace');
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
          handleRestrictedAccess('/services');
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
          handleRestrictedAccess('/jobs');
        }}
      >
        Jobs
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
