
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./components/theme-provider";
import { AppRoutes } from "./AppRoutes"; // Changed to named import
import FaviconManager from "./components/FaviconManager"; // Changed to default import
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { SupabaseWarning } from "./components/ui/supabase-warning";
// Removed useSupabaseStatus import here as SupabaseWarning handles it internally
// import { useSupabaseStatus } from "./hooks/use-supabase-status";
import { ScrollToTop } from "./components/ScrollToTop";


// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  // Removed: const { warning } = useSupabaseStatus(); 
  // SupabaseWarning component now fetches its own status.

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <FaviconManager />
              <ScrollToTop />
              <AppRoutes />
              <ShadcnToaster />
              <SonnerToaster />
              {/* Changed: SupabaseWarning now renders conditionally based on its internal state */}
              <SupabaseWarning /> 
            </Router>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
