
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./components/theme-provider";
import { AppRoutes } from "./AppRoutes"; 
import { Layout } from "./components/layout/Layout";
import FaviconManager from "./components/FaviconManager"; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { SupabaseWarning } from "./components/ui/supabase-warning";
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
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <LanguageProvider>
          <AuthProvider>
            <Layout>
              <FaviconManager />
              <ScrollToTop />
              <AppRoutes />
              <ShadcnToaster />
              <SonnerToaster />
              <SupabaseWarning />
            </Layout>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

