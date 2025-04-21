
import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useProvideAuth(): AuthContextType {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const login = (role: UserRole) => {
    setIsAuthenticated(true);
    setUserRole(role);
    // Set a mock user for demonstration
    setUser({
      name: role === "resident" ? "John Resident" : 
            role === "official" ? "Maria Official" : "Admin User"
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUser(null);
    // Smart redirection
    // if on a public page, go to home, else always go to login
    const publicPaths = ["/", "/about", "/contact", "/privacy", "/terms"];
    if (publicPaths.includes(location.pathname)) {
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return { isAuthenticated, userRole, user, login, logout };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Provide AuthContext through a custom hook that has navigation access
  const auth = useProvideAuth();
  return (
    <AuthContext.Provider value={auth}>
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
