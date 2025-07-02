
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
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
          bg: "from-blue-50 to-indigo-100",
          accent: "bg-blue-600 hover:bg-blue-700",
          text: "text-blue-600"
        };
      case "resident":
        return {
          bg: "from-green-50 to-emerald-100",
          accent: "bg-green-600 hover:bg-green-700",
          text: "text-green-600"
        };
      case "superadmin":
        return {
          bg: "from-purple-50 to-violet-100",
          accent: "bg-purple-600 hover:bg-purple-700",
          text: "text-purple-600"
        };
      default:
        return {
          bg: "from-gray-50 to-slate-100",
          accent: "bg-gray-600 hover:bg-gray-700",
          text: "text-gray-600"
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
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg} flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Background Space Image */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="/lovable-uploads/15ca493f-d204-4cb0-b031-5193a5a068e8.png" 
          alt="Space background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-white rounded-full opacity-40 animate-pulse delay-300"></div>
      <div className="absolute bottom-32 left-16 w-3 h-3 bg-white rounded-full opacity-50 animate-pulse delay-700"></div>
      <div className="absolute bottom-20 right-20 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse delay-1000"></div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className={`text-8xl md:text-9xl font-bold ${colors.text} opacity-90 select-none`}>
            404
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
        </div>

        {/* Main Message */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Lost in Space?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            The page you're looking for has drifted away into the digital cosmos.
          </p>
          
          {/* Path Info */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6 border-l-4 border-gray-400">
            <p className="text-sm text-gray-700 font-mono break-all">
              <span className="font-semibold">Missing route:</span> {location.pathname}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate(getHomeRoute())}
              className={`${colors.accent} text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg`}
            >
              <Home className="w-5 h-5 mr-2" />
              Return Home
            </Button>
            
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg border-2 hover:bg-white/50"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Role-specific suggestions */}
          {isAuthenticated && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                Quick navigation for {userRole}s:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {userRole === "official" && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate("/official/residents")}
                      className="text-xs hover:bg-blue-50"
                    >
                      Residents
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate("/official/services")}
                      className="text-xs hover:bg-blue-50"
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
                      className="text-xs hover:bg-green-50"
                    >
                      Services
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate("/marketplace")}
                      className="text-xs hover:bg-green-50"
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
                      className="text-xs hover:bg-purple-50"
                    >
                      Users
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate("/admin/smarketplace")}
                      className="text-xs hover:bg-purple-50"
                    >
                      Marketplace
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Message */}
        <p className="text-sm text-gray-500 mt-6 opacity-80">
          Don't worry, even astronauts get lost sometimes. 🚀
        </p>
      </div>
    </div>
  );
};

export default NotFound;
