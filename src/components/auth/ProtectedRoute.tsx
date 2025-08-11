import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isEmailVerified, session } = useAuth();
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
  }, [isAuthenticated, isEmailVerified, navigate, session]);

  // Show loading state or nothing while redirecting
  if (!isAuthenticated || !isEmailVerified) {
    return null;
  }

  return <>{children}</>;
};