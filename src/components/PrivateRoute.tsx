
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: 'resident' | 'official' | 'superadmin';
}

const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ea384c]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if required
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    switch (userRole) {
      case "official":
        return <Navigate to="/official-dashboard" replace />;
      case "superadmin":
        return <Navigate to="/admin" replace />;
      case "resident":
      default:
        return <Navigate to="/resident-home" replace />;
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;
