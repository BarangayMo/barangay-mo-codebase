
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
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
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [rbiCompleted, setRbiCompleted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Function to fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('barangay, created_at')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return {};
      }
      
      return {
        barangay: profile?.barangay,
        createdAt: profile?.created_at
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {};
    }
  };

  // Function to determine user role and redirect path
  const getUserRoleAndRedirect = (email: string) => {
    let role: UserRole = "resident";
    let redirectPath = "/resident-home";
    
    if (email.includes('official')) {
      role = 'official';
      redirectPath = '/official-dashboard';
    } else if (email.includes('admin')) {
      role = 'superadmin';
      redirectPath = '/admin';
    }
    
    return { role, redirectPath };
  };

  // Simple redirect function
  const handleRedirect = (redirectPath: string, currentPath: string) => {
    console.log(`Attempting redirect from ${currentPath} to ${redirectPath}`);
    if (currentPath === '/login' || currentPath === '/register') {
      navigate(redirectPath, { replace: true });
    }
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
          // Fetch additional profile data
          const profileData = await fetchUserProfile(session.user.id);
          
          const { role, redirectPath } = getUserRoleAndRedirect(session.user.email || '');
          
          const userData = {
            id: session.user.id,
            name: session.user.email || '',
            email: session.user.email,
            firstName: session.user.user_metadata?.first_name,
            lastName: session.user.user_metadata?.last_name,
            role,
            barangay: profileData.barangay,
            createdAt: profileData.createdAt
          };
          
          setUser(userData);
          setUserRole(role);
          
          // Handle redirects after successful login - simplified logic
          if (event === 'SIGNED_IN' && isInitialized) {
            console.log("Signed in - checking for redirect");
            handleRedirect(redirectPath, location.pathname);
          }
        } else {
          // User signed out
          setUser(null);
          setUserRole(null);
          
          if (event === 'SIGNED_OUT' && isInitialized) {
            console.log("Signed out - redirecting to login");
            navigate('/login', { replace: true });
          }
        }
      }
    );

    // Check for existing session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      
      setSession(session);
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        const profileData = await fetchUserProfile(session.user.id);
        const { role, redirectPath } = getUserRoleAndRedirect(session.user.email || '');
        
        const userData = {
          id: session.user.id,
          name: session.user.email || '',
          email: session.user.email,
          firstName: session.user.user_metadata?.first_name,
          lastName: session.user.user_metadata?.last_name,
          role,
          barangay: profileData.barangay,
          createdAt: profileData.createdAt
        };
        
        setUser(userData);
        setUserRole(role);
        
        // Redirect if user is on login/register page with existing session
        handleRedirect(redirectPath, location.pathname);
      }
      
      setIsInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname, isInitialized]);

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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (!error) {
        navigate("/verify");
      }

      return { error };
    } catch (error) {
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
      navigate(navigateToPath || "/login", { replace: true });
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
