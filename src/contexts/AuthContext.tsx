
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

  useEffect(() => {
    console.log("Setting up auth state change listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        setSession(session);
        setIsAuthenticated(!!session);
        
        if (session?.user) {
          const userData = {
            id: session.user.id, // Added id field
            name: session.user.email || '',
            email: session.user.email,
            firstName: session.user.user_metadata?.first_name,
            lastName: session.user.user_metadata?.last_name,
          };
          
          setUser(userData);
          
          if (session.user.email) {
            // Determine role based on email pattern
            let role: UserRole = "resident";
            
            if (session.user.email.includes('official')) {
              role = 'official';
            } else if (session.user.email.includes('admin')) {
              role = 'superadmin';
            }
            
            setUserRole(role);
            
            // Handle redirect after sign in
            if (event === 'SIGNED_IN') {
              const redirectPath = role === 'official' 
                ? '/official-dashboard' 
                : role === 'superadmin' 
                  ? '/admin' 
                  : '/resident-home';
                
              console.log("Redirecting to:", redirectPath);
              navigate(redirectPath);
            }
          } else {
            setUserRole(null);
          }
        } else {
          setUser(null);
          setUserRole(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      
      setSession(session);
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        const userData = {
          id: session.user.id, // Added id field
          name: session.user.email || '',
          email: session.user.email,
          firstName: session.user.user_metadata?.first_name,
          lastName: session.user.user_metadata?.last_name,
        };
        
        setUser(userData);
        
        if (session.user.email) {
          // Determine role based on email pattern
          if (session.user.email.includes('official')) {
            setUserRole('official');
          } else if (session.user.email.includes('admin')) {
            setUserRole('superadmin');
          } else {
            setUserRole('resident');
          }
          
          // Handle redirect for existing session if on login/register page
          if (currentPath === '/login' || currentPath === '/register') {
            const redirectPath = session.user.email.includes('official') 
              ? '/official-dashboard' 
              : session.user.email.includes('admin') 
                ? '/admin' 
                : '/resident-home';
            
            console.log("Redirecting existing session to:", redirectPath);
            navigate(redirectPath);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, currentPath]);

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
          }
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
      
      navigate(navigateToPath || "/login");
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
