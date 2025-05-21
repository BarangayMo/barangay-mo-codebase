
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
  
  // Track if this is the initial session check
  const isInitialMount = useRef(true);
  // Track if a redirect is already in progress to prevent multiple redirects
  const redirectInProgress = useRef(false);
  // Track the last auth event type to differentiate between real auth changes and refreshes
  const lastAuthEvent = useRef<string | null>(null);
  // Track visibility change to handle tab focus events
  const wasTabHidden = useRef(false);

  // Handle visibility change to detect when tab is refocused
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && wasTabHidden.current) {
        console.log("Tab became visible - performing silent session refresh");
        wasTabHidden.current = false;
        
        // Silently refresh the session without triggering redirects
        supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
          if (currentSession !== session) {
            console.log("Session changed during visibility change");
            setSession(currentSession);
            setIsAuthenticated(!!currentSession);
            
            if (currentSession?.user) {
              const userData = {
                id: currentSession.user.id,
                name: currentSession.user.email || '',
                email: currentSession.user.email,
                firstName: currentSession.user.user_metadata?.first_name,
                lastName: currentSession.user.user_metadata?.last_name,
              };
              setUser(userData);
              
              // Update role without redirecting
              if (currentSession.user.email) {
                let role: UserRole = "resident";
                if (currentSession.user.email.includes('official')) {
                  role = 'official';
                } else if (currentSession.user.email.includes('admin')) {
                  role = 'superadmin';
                }
                setUserRole(role);
              }
            } else {
              setUser(null);
              setUserRole(null);
              
              // Only redirect to login if we were authenticated before and now we're not
              if (isAuthenticated && !currentSession && 
                  !currentPath.includes('/login') && 
                  !currentPath.includes('/register') && 
                  !redirectInProgress.current) {
                console.log("Session expired during visibility change - redirecting to login");
                redirectInProgress.current = true;
                navigate('/login');
                setTimeout(() => { redirectInProgress.current = false; }, 500);
              }
            }
          }
        });
      } else if (document.visibilityState === 'hidden') {
        wasTabHidden.current = true;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [navigate, session, isAuthenticated, currentPath]);

  useEffect(() => {
    console.log("Setting up auth state change listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        lastAuthEvent.current = event;
        
        // Don't respond to INITIAL_SESSION event unless it's the first mount
        if (event === 'INITIAL_SESSION' && !isInitialMount.current) {
          console.log("Ignoring duplicate INITIAL_SESSION event");
          return;
        }
        
        // For genuine sign-in/sign-out events, update state and redirect
        const isSignInEvent = event === 'SIGNED_IN';
        const isSignOutEvent = event === 'SIGNED_OUT';
        const isPasswordRecoveryEvent = event === 'PASSWORD_RECOVERY';
        const isUserUpdatedEvent = event === 'USER_UPDATED';
        
        // Set current session state
        setSession(session);
        setIsAuthenticated(!!session);
        
        if (session?.user) {
          const userData = {
            id: session.user.id,
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
            
            // Handle redirect after sign in - only on actual SIGNED_IN event
            if (isSignInEvent && !redirectInProgress.current) {
              const redirectPath = role === 'official' 
                ? '/official-dashboard' 
                : role === 'superadmin' 
                  ? '/admin' 
                  : '/resident-home';
                
              console.log("Redirecting to:", redirectPath);
              redirectInProgress.current = true;
              navigate(redirectPath);
              setTimeout(() => { redirectInProgress.current = false; }, 500);
            }
          } else {
            setUserRole(null);
          }
        } else {
          setUser(null);
          setUserRole(null);
          
          // Only redirect on actual sign out
          if (isSignOutEvent && !redirectInProgress.current) {
            console.log("Redirecting to login after sign out");
            redirectInProgress.current = true;
            navigate('/login');
            setTimeout(() => { redirectInProgress.current = false; }, 500);
          }
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
          id: session.user.id,
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
          if ((currentPath === '/login' || currentPath === '/register') && !redirectInProgress.current) {
            const redirectPath = session.user.email.includes('official') 
              ? '/official-dashboard' 
              : session.user.email.includes('admin') 
                ? '/admin' 
                : '/resident-home';
            
            console.log("Redirecting existing session to:", redirectPath);
            redirectInProgress.current = true;
            navigate(redirectPath);
            setTimeout(() => { redirectInProgress.current = false; }, 500);
          }
        }
      }
      
      // Mark initial mount as complete after first session check
      isInitialMount.current = false;
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
      
      if (!redirectInProgress.current) {
        redirectInProgress.current = true;
        navigate(navigateToPath || "/login");
        setTimeout(() => { redirectInProgress.current = false; }, 500);
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
