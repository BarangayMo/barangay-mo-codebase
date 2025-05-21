
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./components/theme-provider";
import AppRoutes from "./AppRoutes";
import { ScrollToTop } from "./components/ScrollToTop";
import { FaviconManager } from "./components/FaviconManager";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster as ShadcnToaster } from "@/components/ui/toaster"; // shadcn/ui toaster
import { Toaster as SonnerToaster } from "@/components/ui/sonner"; // sonner toaster
import { SupabaseWarning } from "./components/ui/supabase-warning";
import { useSupabaseStatus } from "./hooks/use-supabase-status";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable refetch on window focus globally
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  const { warning } = useSupabaseStatus();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <FaviconManager />
              <ScrollToTop />
              <AppRoutes />
              <ShadcnToaster /> {/* For shadcn/ui toasts */}
              <SonnerToaster /> {/* For Sonner toasts, if used */}
              {warning && <SupabaseWarning message={warning} />}
            </Router>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

