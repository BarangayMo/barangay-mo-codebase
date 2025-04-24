import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "resident" | "official" | "superadmin" | null;

interface UserData {
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
  navigate?: (path: string) => void;
  currentPath?: string;
}

export const AuthProvider = ({
  children,
  navigate,
  currentPath = "/"
}: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [rbiCompleted, setRbiCompleted] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setIsAuthenticated(!!session);
        setUser(session?.user ? {
          name: session.user.email || '',
          email: session.user.email,
        } : null);

        if (session?.user?.email) {
          if (session.user.email.includes('official')) {
            setUserRole('official');
            if (navigate && event === 'SIGNED_IN') {
              navigate('/official-dashboard');
            }
          } else if (session.user.email.includes('admin')) {
            setUserRole('superadmin');
            if (navigate && event === 'SIGNED_IN') {
              navigate('/admin');
            }
          } else {
            setUserRole('resident');
            if (navigate && event === 'SIGNED_IN') {
              navigate('/resident-home');
            }
          }
        } else {
          setUserRole(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthenticated(!!session);
      setUser(session?.user ? {
        name: session.user.email || '',
        email: session.user.email,
      } : null);
      
      if (session?.user?.email) {
        if (session.user.email.includes('official')) {
          setUserRole('official');
        } else if (session.user.email.includes('admin')) {
          setUserRole('superadmin');
        } else {
          setUserRole('resident');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const register = async (email: string, password: string, userData: any) => {
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

    if (!error && navigate) {
      navigate("/verify");
    }

    return { error };
  };

  const logout = async (navigateToPath?: string) => {
    const { error } = await supabase.auth.signOut();
    
    if (!error) {
      setIsAuthenticated(false);
      setUserRole(null);
      setUser(null);
      
      if (navigate) {
        navigate(navigateToPath || "/login");
      }
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
