import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isEmailVerified, session, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("🛡️ ProtectedRoute check:", {
      isAuthenticated,
      isEmailVerified,
      currentPath: location.pathname,
      userEmail: session?.user?.email,
      userRole
    });

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      console.log("🚫 Not authenticated, redirecting to login");
      navigate('/login', { replace: true });
      return;
    }

    if (isAuthenticated && !isEmailVerified) {
      // Redirect to email verification if authenticated but email not verified
      console.log("🚫 Authenticated but email not verified, redirecting to email verification");
      navigate('/email-verification', { 
        state: { email: session?.user?.email, role: userRole },
        replace: true 
      });
      return;
    }

    console.log("✅ Access granted to protected route");
  }, [isAuthenticated, isEmailVerified, navigate, session, userRole, location.pathname]);

  // Show loading state or nothing while redirecting
  if (!isAuthenticated || !isEmailVerified) {
    console.log("⏳ ProtectedRoute: Waiting for authentication or email verification");
    return null;
  }

  return <>{children}</>;
};