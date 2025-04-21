
import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "resident" | "official" | "superadmin" | null;

interface User {
  name: string;
  email?: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  user: User | null;
  login: (role: UserRole) => void;
  logout: (navigateToPath?: string) => void;
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
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    setIsAuthenticated(true);
    setUserRole(role);
    // Set a mock user for demonstration
    setUser({
      name: role === "resident" ? "John Resident" : 
            role === "official" ? "Maria Official" : "Admin User"
    });
  };

  const logout = (navigateToPath?: string) => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUser(null);
    
    // Only navigate if the navigate function is provided
    if (navigate) {
      // Smart redirection
      // if on a public page, go to home, else always go to login
      const publicPaths = ["/", "/about", "/contact", "/privacy", "/terms"];
      if (navigateToPath) {
        navigate(navigateToPath);
      } else if (publicPaths.includes(currentPath)) {
        navigate("/");
      } else {
        navigate("/login");
      }
    }
  };

  const value = { isAuthenticated, userRole, user, login, logout };
  
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
