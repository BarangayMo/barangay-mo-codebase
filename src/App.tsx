
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "@/components/ui/sonner";
import { ScrollToTop } from "@/components/ScrollToTop";
import FaviconManager from "@/components/FaviconManager";
import { AppRoutes } from "./AppRoutes";
import { useNavigate, useLocation } from "react-router-dom";

const queryClient = new QueryClient();

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider navigate={navigate} currentPath={location.pathname}>
          <LanguageProvider>
            <ScrollToTop />
            <FaviconManager />
            <AppRoutes />
            <Toaster />
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
