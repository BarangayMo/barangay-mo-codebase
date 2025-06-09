import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/ui/loading";

// Lazy-loaded components - using existing pages
const LoginPage = lazy(() => import("@/pages/Login"));
const RegisterPage = lazy(() => import("@/pages/Register"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const ResidentsPage = lazy(() => import("@/pages/users/ResidentsPage"));
const OfficialsPage = lazy(() => import("@/pages/users/OfficialsPage"));
const UserProfilePage = lazy(() => import("@/pages/users/UserProfilePage"));
const SmarketplaceIndex = lazy(() => import("@/pages/smarketplace/SmarketplaceIndex"));
const ActivityLogsPage = lazy(() => import("@/pages/reports/ActivityLogsPage"));
const FinancialReportsPage = lazy(() => import("@/pages/reports/FinancialReportsPage"));
const AllUsersPage = lazy(() => import("@/pages/users/AllUsersPage"));
const UserRolesPage = lazy(() => import("@/pages/users/UserRolesPage"));

export const AppRoutes = () => {
  const { user, session } = useAuth();
  const loading = !session && !user; // Derive loading state

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/admin" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/admin" />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Users Routes - Updated structure */}
        <Route path="/admin/users/all" element={<AllUsersPage />} />
        <Route path="/admin/users/roles" element={<UserRolesPage />} />
        <Route path="/admin/users/settings" element={<ResidentsPage />} />
        
        {/* Keep existing user profile route */}
        <Route path="/admin/users/:id" element={<UserProfilePage />} />

        {/* Legacy User Routes */}
        <Route path="/admin/users/residents" element={<ResidentsPage />} />
        <Route path="/admin/users/officials" element={<OfficialsPage />} />

        {/* Smarketplace Routes */}
        <Route path="/admin/smarketplace" element={<SmarketplaceIndex />} />
        <Route path="/admin/smarketplace/products" element={<SmarketplaceIndex />} />
        <Route path="/admin/smarketplace/orders" element={<SmarketplaceIndex />} />
        <Route path="/admin/smarketplace/vendors" element={<SmarketplaceIndex />} />
        <Route path="/admin/smarketplace/customers" element={<SmarketplaceIndex />} />
        <Route path="/admin/smarketplace/shipping" element={<SmarketplaceIndex />} />
        <Route path="/admin/smarketplace/promotions" element={<SmarketplaceIndex />} />
        <Route path="/admin/smarketplace/financials" element={<SmarketplaceIndex />} />
        <Route path="/admin/smarketplace/reviews" element={<SmarketplaceIndex />} />
        <Route path="/admin/smarketplace/settings" element={<SmarketplaceIndex />} />
        <Route path="/admin/smarketplace/addons" element={<SmarketplaceIndex />} />

        {/* Reports Routes */}
        <Route path="/admin/reports/activity-logs" element={<ActivityLogsPage />} />
        <Route path="/admin/reports/financial-reports" element={<FinancialReportsPage />} />

        {/* System Routes - using placeholders for now */}
        <Route path="/admin/media-library" element={<AdminDashboard />} />
        <Route path="/admin/messages" element={<AdminDashboard />} />
        <Route path="/admin/settings" element={<AdminDashboard />} />

        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/admin" />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </Suspense>
  );
};
