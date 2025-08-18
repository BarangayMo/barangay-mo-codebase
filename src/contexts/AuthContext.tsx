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
  municipality?: string;
  province?: string;
  region?: string;
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
  const currentPath = location.pathname;
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [rbiCompleted, setRbiCompleted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  
  const redirectInProgress = useRef(false);

  console.log('AuthProvider state:', { isAuthenticated, userRole, isInitialized, currentPath });

  // Function to fetch user profile data with better error handling
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('barangay, created_at, role, first_name, last_name, municipality, province, officials_data, logo_url')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.warn('Profile fetch warning (continuing anyway):', error);
        return {};
      }
      
      console.log('Profile fetched successfully:', profile);
      console.log('Officials data structure:', profile?.officials_data);
      
      return {
        barangay: profile?.barangay,
        municipality: profile?.municipality,
        province: profile?.province,
        officials_data: profile?.officials_data,
        logo_url: profile?.logo_url,
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

  // Function to check RBI submission status for residents (not completion, just submission)
  const checkRbiSubmission = async (userId: string, userRole: UserRole) => {
    if (userRole !== 'resident') {
      return true; // Non-residents don't need RBI
    }
    
    try {
      const { data: rbiForms, error } = await supabase
        .from('rbi_forms')
        .select('id, status')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.warn('RBI check warning:', error);
        return false;
      }
      
      const hasSubmittedRbiForm = rbiForms && rbiForms.length > 0;
      console.log('RBI submission check:', { userId, hasSubmittedRbiForm, rbiForms });
      return hasSubmittedRbiForm;
    } catch (error) {
      console.warn('Error checking RBI submission:', error);
      return false;
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
    } else if (role === "superadmin") {
      userRole = 'superadmin';
      redirectPath = '/admin';
    }
    
    console.log('User role determined:', { email, role, userRole, redirectPath });
    return { role: userRole, redirectPath };
  };

  // Handle auth state changes
  useEffect(() => {
    console.log("🔧 Setting up auth state change listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔑 Auth State Changed:", event, {
          user: session?.user ? {
            id: session.user.id,
            email: session.user.email,
            email_confirmed_at: session.user.email_confirmed_at,
            emailVerified: !!session.user.email_confirmed_at
          } : null,
          session: !!session
        });
        
        setSession(session);
        setIsAuthenticated(!!session);
        setIsEmailVerified(!!session?.user?.email_confirmed_at);
        
        // Enhanced logging for email verification status
        if (session?.user) {
          console.log("📧 Email verification status:", {
            email: session.user.email,
            confirmed_at: session.user.email_confirmed_at,
            isVerified: !!session.user.email_confirmed_at
          });
        }
        
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
                municipality: profileData.municipality,
                province: profileData.province,
                officials_data: profileData.officials_data,
                logo_url: profileData.logo_url,
                createdAt: profileData.createdAt
              };
              
              console.log('Setting user data:', userData);
              console.log('Officials data in userData:', userData.officials_data);
              
              setUser(userData);
              setUserRole(role);
              
              // Check RBI submission for residents
              const rbiSubmitted = await checkRbiSubmission(session.user.id, role);
              setRbiCompleted(rbiSubmitted);
              
              // Handle redirects after successful login or signup
              if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && !redirectInProgress.current && isInitialized) {
                // Check if email is verified - ENFORCE EMAIL VERIFICATION
                const emailVerified = !!session?.user?.email_confirmed_at;
                
                console.log("🔄 Checking redirect logic:", {
                  event,
                  currentPath,
                  emailVerified,
                  userRole: role
                });
                
                if (currentPath === '/login' || currentPath === '/register' || currentPath === '/email-confirmation' || currentPath === '/mpin') {
                  if (emailVerified) {
                    console.log("✅ Email verified, redirecting to:", redirectPath, "after", event);
                    redirectInProgress.current = true;
                    navigate(redirectPath, { replace: true });
                    setTimeout(() => { redirectInProgress.current = false; }, 1000);
                  } else {
                    // FORCE email verification if not verified
                    console.log("🚫 Email NOT verified, redirecting to email verification");
                    redirectInProgress.current = true;
                    navigate('/email-verification', { 
                      state: { email: session?.user?.email, role },
                      replace: true 
                    });
                    setTimeout(() => { redirectInProgress.current = false; }, 1000);
                  }
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
          setIsEmailVerified(false);
          
          if (event === 'SIGNED_OUT' && !redirectInProgress.current && isInitialized) {
            console.log("👋 User signed out, redirecting to login");
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
        console.warn("⚠️ Session check error (continuing anyway):", error);
      }
      
      console.log("🚀 Initial session check:", {
        userEmail: session?.user?.email,
        emailVerified: !!session?.user?.email_confirmed_at,
        hasSession: !!session
      });
      
      setSession(session);
      setIsAuthenticated(!!session);
      setIsEmailVerified(!!session?.user?.email_confirmed_at);
      
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
              municipality: profileData.municipality,
              province: profileData.province,
              officials_data: profileData.officials_data,
              logo_url: profileData.logo_url,
              createdAt: profileData.createdAt
            };
            
            console.log('Initial user data set:', userData);
            
            setUser(userData);
            setUserRole(role);
            
            // Check RBI submission for residents
            const rbiSubmitted = await checkRbiSubmission(session.user.id, role);
            setRbiCompleted(rbiSubmitted);
            
            // Redirect if user is on login/register page with existing session
            if ((currentPath === '/login' || currentPath === '/register' || currentPath === '/email-confirmation' || currentPath === '/email-verification') && !redirectInProgress.current) {
              const emailVerified = !!session?.user?.email_confirmed_at;
              
              console.log("🔄 Initial redirect check:", {
                currentPath,
                emailVerified,
                userRole: role
              });
              
              if (emailVerified) {
                console.log("✅ Email verified on initial load, redirecting to:", redirectPath);
                redirectInProgress.current = true;
                navigate(redirectPath, { replace: true });
                setTimeout(() => { redirectInProgress.current = false; }, 1000);
              } else if (currentPath !== '/email-verification') {
                // FORCE email verification if not verified
                console.log("🚫 Email NOT verified on initial load, redirecting to verification");
                redirectInProgress.current = true;
                navigate('/email-verification', { 
                  state: { email: session?.user?.email, role },
                  replace: true 
                });
                setTimeout(() => { redirectInProgress.current = false; }, 1000);
              }
            }
          } catch (error) {
            console.error('Error in initial session handler:', error);
          }
        }, 0);
      }
      
      setIsInitialized(true);
      console.log('🎯 Auth initialization completed');
    });

    return () => subscription.unsubscribe();
  }, [navigate, currentPath, isInitialized]);

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
        console.log("📧 Email verified status:", !!data.user?.email_confirmed_at);
        
        // Store device data for MPIN functionality after successful login
        if (data.user) {
          setTimeout(async () => {
            try {
              const userProfile = await fetchUserProfile(data.user.id);
              if (userProfile) {
                // Generate device fingerprint
                const getDeviceFingerprint = () => {
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  ctx!.textBaseline = 'top';
                  ctx!.font = '14px Arial';
                  ctx!.fillText('Device fingerprint', 2, 2);
                  
                  return btoa(
                    navigator.userAgent +
                    navigator.language +
                    screen.width + 'x' + screen.height +
                    new Date().getTimezoneOffset() +
                    canvas.toDataURL()
                  ).substring(0, 32);
                };

                const fingerprint = getDeviceFingerprint();
                const storageKey = `quicklogin_${fingerprint}`;
                
                // Check if device data already exists for this user
                const existingData = localStorage.getItem(storageKey);
                let deviceData = null;
                
                if (existingData) {
                  try {
                    deviceData = JSON.parse(existingData);
                  } catch (error) {
                    console.error('Error parsing existing device data:', error);
                  }
                }
                
                // Update or create device data with latest login info
                const newDeviceData = {
                  mpin: deviceData?.mpin || '', // Keep existing MPIN if any
                  biometricEnabled: deviceData?.biometricEnabled || false,
                  failedAttempts: 0, // Reset failed attempts on successful login
                  email: data.user.email,
                  userRole: userProfile.role,
                  sessionTokens: {
                    accessToken: data.session.access_token,
                    refreshToken: data.session.refresh_token,
                    expiresAt: data.session.expires_at
                  }
                };
                
                localStorage.setItem(storageKey, JSON.stringify(newDeviceData));
              }
            } catch (error) {
              console.error('Error storing device data:', error);
            }
          }, 0);
        }
        
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
      
      // Create clean metadata object - this will be used by the database trigger
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

      console.log("Clean metadata being sent:", metaData);

        // Sign up the user with email confirmation redirect
        const emailRedirectUrl = `${window.location.origin}/auth/callback`;
        console.log("📧 Using email redirect URL:", emailRedirectUrl);
        
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

      console.log("✅ User registration successful - Check your inbox to verify your email!");
      console.log("📧 Verification email sent to:", email);
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
  console.log("✅ useAuth context accessed:", {
    isAuthenticated: context.isAuthenticated,
    isEmailVerified: context.isEmailVerified,
    userRole: context.userRole
  });
  return context;
};
