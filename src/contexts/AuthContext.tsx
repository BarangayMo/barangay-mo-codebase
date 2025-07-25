
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthProfile } from "@/hooks/use-auth-profile";
import { getRedirectPath, shouldRedirectFromAuthPages } from "@/utils/auth-redirect";

export type UserRole = "resident" | "official" | "superadmin" | null;

interface UserData {
  id?: string;
  name: string;
  email?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  barangay?: string;
  municipality?: string;
  province?: string;
  officials_data?: any;
  logo_url?: string;
  createdAt?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  user: UserData | null;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  register: (email: string, password: string, userData: any) => Promise<{ error: Error | null }>;
  logout: (navigateToPath?: string) => void;
  rbiCompleted: boolean;
  setRbiCompleted: (completed: boolean) => void;
  session: Session | null;
  isEmailVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { profile, rbiCompleted, setRbiCompleted } = useAuthProfile(session?.user?.id || null);

  console.log('AuthProvider state:', { isAuthenticated, userRole, isInitialized });

  // Clear authentication state
  const clearAuthState = () => {
    console.log('🧹 Clearing authentication state');
    setIsAuthenticated(false);
    setUserRole(null);
    setUser(null);
    setSession(null);
    setIsEmailVerified(false);
  };

  // Safe logout function that always clears state
  const logout = async (navigateToPath?: string) => {
    console.log('🚪 Logout initiated');
    
    try {
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn('Supabase signOut error (continuing anyway):', error);
      }
    } catch (error) {
      console.warn('Logout error (continuing anyway):', error);
    }
    
    // Always clear local state regardless of signOut success/failure
    clearAuthState();
    
    // Always navigate to login
    navigate(navigateToPath || "/login", { replace: true });
  };

  // Update user data when profile changes
  useEffect(() => {
    if (session?.user && profile) {
      const userData: UserData = {
        id: session.user.id,
        name: session.user.email || '',
        email: session.user.email,
        firstName: profile.firstName || session.user.user_metadata?.first_name,
        lastName: profile.lastName || session.user.user_metadata?.last_name,
        role: profile.role || session.user.user_metadata?.role || 'resident',
        barangay: profile.barangay,
        municipality: profile.municipality,
        province: profile.province,
        officials_data: profile.officials_data,
        logo_url: profile.logo_url,
        createdAt: profile.createdAt
      };

      console.log('📝 Updating user data:', userData);
      setUser(userData);
      setUserRole(userData.role);
    }
  }, [session, profile]);

  // Handle authentication state changes
  useEffect(() => {
    console.log("🔧 Setting up auth state change listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🔑 Auth State Changed:", event, {
          hasUser: !!session?.user,
          hasSession: !!session,
          emailVerified: !!session?.user?.email_confirmed_at
        });
        
        // Update core auth state synchronously
        setSession(session);
        setIsAuthenticated(!!session);
        setIsEmailVerified(!!session?.user?.email_confirmed_at);
        
        // Handle redirects based on auth state
        if (event === 'SIGNED_IN' && session?.user) {
          const emailVerified = !!session.user.email_confirmed_at;
          const currentPath = location.pathname;
          
          if (shouldRedirectFromAuthPages(currentPath)) {
            if (emailVerified) {
              const userRole = session.user.user_metadata?.role || 'resident';
              const redirectPath = getRedirectPath(userRole, session.user.email);
              console.log("✅ Redirecting authenticated user to:", redirectPath);
              navigate(redirectPath, { replace: true });
            } else {
              console.log("🚫 Email not verified, redirecting to verification");
              navigate('/email-verification', { 
                state: { email: session.user.email, role: session.user.user_metadata?.role },
                replace: true 
              });
            }
          }
        } else if (event === 'SIGNED_OUT') {
          clearAuthState();
          if (isInitialized && location.pathname !== '/login') {
            console.log("👋 User signed out, redirecting to login");
            navigate('/login', { replace: true });
          }
        }
      }
    );

    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn("⚠️ Session check error:", error);
      }
      
      console.log("🚀 Initial session check:", {
        hasSession: !!session,
        emailVerified: !!session?.user?.email_confirmed_at
      });
      
      setSession(session);
      setIsAuthenticated(!!session);
      setIsEmailVerified(!!session?.user?.email_confirmed_at);
      
      // Handle initial redirect if needed
      if (session?.user && shouldRedirectFromAuthPages(location.pathname)) {
        const emailVerified = !!session.user.email_confirmed_at;
        
        if (emailVerified) {
          const userRole = session.user.user_metadata?.role || 'resident';
          const redirectPath = getRedirectPath(userRole, session.user.email);
          console.log("✅ Initial redirect to:", redirectPath);
          navigate(redirectPath, { replace: true });
        } else {
          console.log("🚫 Initial redirect to email verification");
          navigate('/email-verification', { 
            state: { email: session.user.email, role: session.user.user_metadata?.role },
            replace: true 
          });
        }
      }
      
      setIsInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname, isInitialized]);

  const login = async (email: string, password: string) => {
    console.log("🔐 Login attempt for:", email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("❌ Login error:", error.message);
        return { error };
      } else {
        console.log("✅ Login successful for:", email);
        return { error: null };
      }
    } catch (error) {
      console.error("💥 Unexpected login error:", error);
      return { error: error as Error };
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    try {
      console.log("Registration attempt with userData:", userData);
      
      const metaData = {
        first_name: userData.firstName || '',
        last_name: userData.lastName || '',
        middle_name: userData.middleName || '',
        suffix: userData.suffix || '',
        role: userData.role || 'resident',
        region: userData.region || '',
        province: userData.province || '',
        municipality: userData.municipality || '',
        barangay: userData.barangay || '',
        phone_number: userData.phoneNumber || '',
        landline_number: userData.landlineNumber || '',
        logo_url: userData.logoUrl || '',
        officials: userData.officials ? JSON.stringify(userData.officials) : ''
      };

      const emailRedirectUrl = `${window.location.origin}/auth/callback`;
      
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metaData,
          emailRedirectTo: emailRedirectUrl
        }
      });

      if (signUpError) {
        console.error("❌ Signup error:", signUpError);
        return { error: signUpError };
      }

      console.log("✅ User registration successful");
      return { error: null };
    } catch (error) {
      console.error("Unexpected registration error:", error);
      return { error: error as Error };
    }
  };

  const value = {
    isAuthenticated,
    userRole,
    user,
    login,
    register,
    logout,
    rbiCompleted,
    setRbiCompleted,
    session,
    isEmailVerified
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error("❌ useAuth called outside AuthProvider!");
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
