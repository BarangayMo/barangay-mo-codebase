
import { useAuth } from "@/contexts/AuthContext";

/**
 * Custom hook to handle media library authentication state
 * @returns Current user role and admin status
 */
export function useAuthState() {
  const { userRole } = useAuth();
  const isAdmin = userRole === 'superadmin';
  
  return {
    userRole,
    isAdmin
  };
}
