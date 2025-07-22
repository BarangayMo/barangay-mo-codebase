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

    // For residents only: check RBI completion
    if (userRole === 'resident' && isEmailVerified && !rbiCompleted) {
      // Don't redirect if already on RBI registration page
      if (location.pathname !== '/rbi-registration') {
        console.log('Resident has not completed RBI, redirecting to RBI registration');
        navigate('/rbi-registration', { replace: true });
        return;
      }
    }
  }, [isAuthenticated, isEmailVerified, userRole, rbiCompleted, navigate, session, location.pathname]);

  // Show loading state or nothing while redirecting
  if (!isAuthenticated || !isEmailVerified || (userRole === 'resident' && !rbiCompleted && location.pathname !== '/rbi-registration')) {
    return null;
  }

  return <>{children}</>;
};