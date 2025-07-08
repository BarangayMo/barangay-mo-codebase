
import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [rbiCompleted, setRbiCompleted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const redirectInProgress = useRef(false);

  console.log('AuthProvider state:', { isAuthenticated, userRole, isInitialized, currentPath });

  // Function to fetch user profile data with better error handling
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('barangay, created_at, role, first_name, last_name')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.warn('Profile fetch warning (continuing anyway):', error);
        return {};
      }
      
      console.log('Profile fetched successfully:', profile);
      return {
        barangay: profile?.barangay,
        createdAt: profile?.created_at,
        role: profile?.role,
        firstName: profile?.first_name,
        lastName: profile?.last_name
      };
    } catch (error) {
      console.warn('Error fetching user profile (continuing anyway):', error);
      return {};
    }
  };

  // Function to determine user role and redirect path
  const getUserRoleAndRedirect = (role: string | null, email: string) => {
    let userRole: UserRole = "resident";
    let redirectPath = "/resident-home";
    
    // First check the role from registration data or profile
    if (role === "official") {
      userRole = 'official';
      redirectPath = '/official-dashboard';
    } else if (role === "superadmin" || email.includes('admin')) {
      userRole = 'superadmin';
      redirectPath = '/admin';
    } else if (email.includes('official')) {
      userRole = 'official';
      redirectPath = '/official-dashboard';
    }
    
    console.log('User role determined:', { email, role, userRole, redirectPath });
    return { role: userRole, redirectPath };
  };

  // Handle auth state changes
  useEffect(() => {
    console.log("Setting up auth state change listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        setSession(session);
        setIsAuthenticated(!!session);
        
        if (session?.user) {
          // Use setTimeout to prevent blocking other queries
          setTimeout(async () => {
            try {
              const profileData = await fetchUserProfile(session.user.id);
              const registrationRole = session.user.user_metadata?.role;
              
              const { role, redirectPath } = getUserRoleAndRedirect(
                profileData.role || registrationRole, 
                session.user.email || ''
              );
              
              const userData = {
                id: session.user.id,
                name: session.user.email || '',
                email: session.user.email,
                firstName: profileData.firstName || session.user.user_metadata?.first_name,
                lastName: profileData.lastName || session.user.user_metadata?.last_name,
                role,
                barangay: profileData.barangay,
                createdAt: profileData.createdAt
              };
              
              setUser(userData);
              setUserRole(role);
              
              // Handle redirects after successful login or signup
              if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && !redirectInProgress.current && isInitialized) {
                if (currentPath === '/login' || currentPath === '/register' || currentPath === '/email-confirmation' || currentPath === '/mpin') {
                  console.log("Redirecting to:", redirectPath, "after", event);
                  redirectInProgress.current = true;
                  navigate(redirectPath, { replace: true });
                  setTimeout(() => { redirectInProgress.current = false; }, 1000);
                }
              }
            } catch (error) {
              console.error('Error in auth state change handler:', error);
            }
          }, 0);
        } else {
          // User signed out
          setUser(null);
          setUserRole(null);
          
          if (event === 'SIGNED_OUT' && !redirectInProgress.current && isInitialized) {
            console.log("Redirecting to login after sign out");
            redirectInProgress.current = true;
            navigate('/login', { replace: true });
            setTimeout(() => { redirectInProgress.current = false; }, 1000);
          }
        }
      }
    );

    // Check for existing session on mount
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.warn("Session check error (continuing anyway):", error);
      }
      
      console.log("Initial session check:", session?.user?.email);
      
      setSession(session);
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        setTimeout(async () => {
          try {
            const profileData = await fetchUserProfile(session.user.id);
            const registrationRole = session.user.user_metadata?.role;
            
            const { role, redirectPath } = getUserRoleAndRedirect(
              profileData.role || registrationRole, 
              session.user.email || ''
            );
            
            const userData = {
              id: session.user.id,
              name: session.user.email || '',
              email: session.user.email,
              firstName: profileData.firstName || session.user.user_metadata?.first_name,
              lastName: profileData.lastName || session.user.user_metadata?.last_name,
              role,
              barangay: profileData.barangay,
              createdAt: profileData.createdAt
            };
            
            setUser(userData);
            setUserRole(role);
            
            // Redirect if user is on login/register page with existing session
            if ((currentPath === '/login' || currentPath === '/register') && !redirectInProgress.current) {
              console.log("Redirecting existing session from login/register to:", redirectPath);
              redirectInProgress.current = true;
              navigate(redirectPath, { replace: true });
              setTimeout(() => { redirectInProgress.current = false; }, 1000);
            }
          } catch (error) {
            console.error('Error in initial session handler:', error);
          }
        }, 0);
      }
      
      setIsInitialized(true);
      console.log('Auth initialization completed');
    });

    return () => subscription.unsubscribe();
  }, [navigate, currentPath, isInitialized]);

  const login = async (email: string, password: string) => {
    console.log("Login attempt:", email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error.message);
        return { error };
      } else {
        console.log("Login successful");
        return { error: null };
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
      return { error: error as Error };
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    try {
      console.log("Registration attempt with userData:", userData);
      
      // Ensure all required metadata fields are present with correct keys
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
        phone_number: userData.phoneNumber || null,
        landline_number: userData.landlineNumber || null,
        logo_url: userData.logoUrl || null,
        officials: userData.officials || null
      };

      console.log("Metadata being sent:", metaData);

      // Sign up the user with metadata
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metaData,
          emailRedirectTo: `${window.location.origin}/email-confirmation`
        }
      });

      if (signUpError) {
        console.error("Signup error:", signUpError);
        return { error: signUpError };
      }

      console.log("User created successfully, trigger should handle profile creation");
      return { error: null };
    } catch (error) {
      console.error("Unexpected registration error:", error);
      return { error: error as Error };
    }
  };

  const logout = async (navigateToPath?: string) => {
    const { error } = await supabase.auth.signOut();
    
    if (!error) {
      setIsAuthenticated(false);
      setUserRole(null);
      setUser(null);
      setSession(null);
      
      if (!redirectInProgress.current) {
        redirectInProgress.current = true;
        navigate(navigateToPath || "/login", { replace: true });
        setTimeout(() => { redirectInProgress.current = false; }, 1000);
      }
    } else {
      console.error("Logout error:", error.message);
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
    session
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
