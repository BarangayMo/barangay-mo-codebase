import * as React from "react";
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
import { useRoleInitialization } from "@/hooks/use-role-initialization";

// Create React Query client with aggressive refetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      staleTime: 0,
      gcTime: 0,
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Optional: Log query success/error for debugging
queryClient.setQueryDefaults(['*'], {
  meta: {
    onError: (error) => {
      console.error('React Query Error:', error);
    },
    onSuccess: (data, query) => {
      console.log('React Query Success:', {
        queryKey: query.queryKey,
        dataLength: Array.isArray(data) ? data.length : 'not-array'
      });
    },
  }
});

// ✅ FIXED: This component safely uses useRoleInitialization inside AuthProvider
function InitRoleLogic() {
  useRoleInitialization();
  return null;
}

function App() {
  console.log('App component rendering...');

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <LanguageProvider>
          <AuthProvider>
            <InitRoleLogic /> {/* Now safe to use useAuth inside this */}
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
