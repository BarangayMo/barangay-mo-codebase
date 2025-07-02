
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, isAuthenticated } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
      "Location state:",
      location.state
    );
  }, [location.pathname, location.state]);

  const getRoleColors = () => {
    switch(userRole) {
      case "official":
        return {
          primary: "text-red-600",
          button: "bg-red-600 hover:bg-red-700"
        };
      case "resident":
        return {
          primary: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700"
        };
      case "superadmin":
        return {
          primary: "text-purple-600",
          button: "bg-purple-600 hover:bg-purple-700"
        };
      default:
        return {
          primary: "text-gray-600",
          button: "bg-gray-600 hover:bg-gray-700"
        };
    }
  };

  const getHomeRoute = () => {
    if (!isAuthenticated) return "/";
    
    switch(userRole) {
      case "official":
        return "/official-dashboard";
      case "resident":
        return "/resident-home";
      case "superadmin":
        return "/admin";
      default:
        return "/";
    }
  };

  const colors = getRoleColors();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* Header with back button */}
      <div className="absolute top-6 left-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center text-center max-w-sm mx-auto">
        {/* Space illustration */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/15ca493f-d204-4cb0-b031-5193a5a068e8.png" 
            alt="Lost in space" 
            className="w-48 h-48 object-contain"
          />
        </div>

        {/* Error message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Page not found
          </h1>
          <p className="text-gray-600 text-base leading-relaxed mb-4">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          {/* Show the attempted route */}
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="text-sm text-gray-500 font-mono break-all">
              {location.pathname}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 w-full">
          <Button 
            onClick={() => navigate(getHomeRoute())}
            className={`${colors.button} text-white w-full py-3 rounded-xl font-medium`}
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Home
          </Button>
          
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full py-3 rounded-xl font-medium border-2"
          >
            Go Back
          </Button>
        </div>

        {/* Role-specific quick links */}
        {isAuthenticated && (
          <div className="mt-8 pt-6 border-t border-gray-100 w-full">
            <p className="text-sm text-gray-500 mb-3">
              Quick links:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {userRole === "official" && (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate("/official/residents")}
                    className={`text-xs ${colors.primary}`}
                  >
                    Residents
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate("/official/services")}
                    className={`text-xs ${colors.primary}`}
                  >
                    Services
                  </Button>
                </>
              )}
              {userRole === "resident" && (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate("/services")}
                    className={`text-xs ${colors.primary}`}
                  >
                    Services
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate("/marketplace")}
                    className={`text-xs ${colors.primary}`}
                  >
                    Marketplace
                  </Button>
                </>
              )}
              {userRole === "superadmin" && (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate("/admin/users")}
                    className={`text-xs ${colors.primary}`}
                  >
                    Users
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate("/admin/smarketplace")}
                    className={`text-xs ${colors.primary}`}
                  >
                    Marketplace
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotFound;
