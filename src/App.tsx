
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./components/theme-provider";
import { AppRoutes } from "./AppRoutes"; 
import FaviconManager from "./components/FaviconManager"; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { SupabaseWarning } from "./components/ui/supabase-warning";
import { ScrollToTop } from "./components/ScrollToTop";

// Create a client with aggressive cache settings to force fresh data
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      staleTime: 0, // Data is always stale, force refetch
      gcTime: 0, // Don't cache data (renamed from cacheTime)
      retry: 1, // Reduce retries to speed up error detection
      retryDelay: 1000,
    },
  },
});

// Add global error logging for React Query
queryClient.setQueryDefaults(['*'], {
  meta: {
    onError: (error) => {
      console.error('React Query Error:', error);
    },
    onSuccess: (data, query) => {
      console.log('React Query Success:', { queryKey: query.queryKey, dataLength: Array.isArray(data) ? data.length : 'not-array' });
    },
  }
});

function App() {
  console.log('App component rendering...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <LanguageProvider>
          <AuthProvider>
            <FaviconManager />
            <ScrollToTop />
            <AppRoutes />
            <ShadcnToaster />
            <SonnerToaster />
            <SupabaseWarning />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
