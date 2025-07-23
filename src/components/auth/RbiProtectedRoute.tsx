import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useRbiStatus } from "@/hooks/use-rbi-status";
import { RbiAccessNotification } from "./RbiAccessNotification";
import { toast } from "sonner";

interface RbiProtectedRouteProps {
  children: React.ReactNode;
}

export const RbiProtectedRoute = ({ children }: RbiProtectedRouteProps) => {
  const { isAuthenticated, isEmailVerified, userRole, session } = useAuth();
  const { status, hasAccess, isLoading } = useRbiStatus();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (isAuthenticated && !isEmailVerified) {
      navigate('/email-verification', { 
        state: { email: session?.user?.email },
        replace: true 
      });
      return;
    }

    // Check if non-resident is trying to access RBI registration
    if (location.pathname === '/rbi-registration' && userRole !== 'resident') {
      const redirectMap = {
        'superadmin': '/admin',
        'barangay_official': '/official-dashboard',
        'staff': '/official-dashboard'
      };
      navigate(redirectMap[userRole as keyof typeof redirectMap] || '/login', { replace: true });
      return;
    }

    // For residents accessing restricted routes without RBI approval
    const restrictedRoutes = [
      '/marketplace',
      '/jobs',
      '/services',
      '/community'
    ];
    
    const isRestrictedRoute = restrictedRoutes.some(route => 
      location.pathname.startsWith(route)
    );

    if (userRole === 'resident' && isRestrictedRoute && !hasAccess) {
      // Show toast notification for restricted access
      const message = status === 'not-submitted' 
        ? "Submit your RBI form to access these options"
        : "Your RBI form is pending approval";
      
      toast.error("Restricted Access", {
        description: message,
        duration: 4000,
      });
      
      // Navigate back to resident home
      navigate('/resident-home', { replace: true });
      return;
    }
  }, [isAuthenticated, isEmailVerified, userRole, hasAccess, navigate, session, location.pathname]);

  if (!isAuthenticated || !isEmailVerified || isLoading) {
    return null;
  }

  // For residents on restricted routes without access, show notification
  const restrictedRoutes = [
    '/marketplace',
    '/jobs',
    '/services', 
    '/community'
  ];
  
  const isRestrictedRoute = restrictedRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  if (userRole === 'resident' && isRestrictedRoute && !hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RbiAccessNotification status={status} />
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-4">Complete your RBI registration to access this feature.</p>
            <button 
              onClick={() => navigate('/rbi-registration')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to RBI Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};