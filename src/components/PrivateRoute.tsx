
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: 'resident' | 'official' | 'superadmin';
}

const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ea384c]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // For now, we'll allow access to all authenticated users
  // Role-based access can be implemented when the profile system is properly set up
  if (requiredRole) {
    // This will need to be updated when profile/role system is implemented
    console.log(`Role-based access for ${requiredRole} not yet implemented`);
  }

  return <>{children}</>;
};

export default PrivateRoute;
