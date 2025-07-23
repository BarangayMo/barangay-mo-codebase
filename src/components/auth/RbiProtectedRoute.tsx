import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

interface RbiProtectedRouteProps {
  children: React.ReactNode;
}

export const RbiProtectedRoute = ({ children }: RbiProtectedRouteProps) => {
  const { isAuthenticated, isEmailVerified, userRole, rbiCompleted, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', { replace: true });
      return;
    }

    if (isAuthenticated && !isEmailVerified) {
      // Redirect to email verification if authenticated but email not verified
      console.log('User authenticated but email not verified, redirecting to email verification');
      navigate('/email-verification', { 
        state: { email: session?.user?.email },
        replace: true 
      });
      return;
    }

    // Check if non-resident is trying to access RBI registration
    if (location.pathname === '/rbi-registration' && userRole !== 'resident') {
      // Redirect non-residents away from RBI registration
      const redirectMap = {
        'superadmin': '/admin',
        'barangay_official': '/official-dashboard',
        'staff': '/official-dashboard'
      };
      navigate(redirectMap[userRole as keyof typeof redirectMap] || '/login', { replace: true });
      return;
    }

    // For residents: Allow access but show disclaimers in components for marketplace restrictions
    // No longer redirect for RBI - components will handle access control with disclaimers
  }, [isAuthenticated, isEmailVerified, userRole, rbiCompleted, navigate, session, location.pathname]);

  // Show loading state or nothing while redirecting
  // Allow access if authenticated and email verified (RBI disclaimers handled by components)
  if (!isAuthenticated || !isEmailVerified) {
    return null;
  }

  return <>{children}</>;
};