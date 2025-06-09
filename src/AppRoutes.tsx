import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoadingScreen } from "@/components/ui/loading";

// Lazy-loaded components
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("@/pages/auth/VerifyEmailPage"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const ResidentsPage = lazy(() => import("@/pages/users/ResidentsPage"));
const OfficialsPage = lazy(() => import("@/pages/users/OfficialsPage"));
const UserProfilePage = lazy(() => import("@/pages/users/UserProfilePage"));
const SmarketplaceIndex = lazy(() => import("@/pages/smarketplace/SmarketplaceIndex"));
const ProductsPage = lazy(() => import("@/pages/smarketplace/ProductsPage"));
const OrdersPage = lazy(() => import("@/pages/smarketplace/OrdersPage"));
const VendorsPage = lazy(() => import("@/pages/smarketplace/VendorsPage"));
const CustomersPage = lazy(() => import("@/pages/smarketplace/CustomersPage"));
const ShippingPage = lazy(() => import("@/pages/smarketplace/ShippingPage"));
const PromotionsPage = lazy(() => import("@/pages/smarketplace/PromotionsPage"));
const FinancialsPage = lazy(() => import("@/pages/smarketplace/FinancialsPage"));
const ReviewsPage = lazy(() => import("@/pages/smarketplace/ReviewsPage"));
const SettingsPage = lazy(() => import("@/pages/smarketplace/SettingsPage"));
const AddonsPage = lazy(() => import("@/pages/smarketplace/AddonsPage"));
const ActivityLogsPage = lazy(() => import("@/pages/reports/ActivityLogsPage"));
const FinancialReportsPage = lazy(() => import("@/pages/reports/FinancialReportsPage"));
const MediaLibraryPage = lazy(() => import("@/pages/MediaLibraryPage"));
const MessagesPage = lazy(() => import("@/pages/MessagesPage"));
const SystemSettingsPage = lazy(() => import("@/pages/SystemSettingsPage"));
const AllUsersPage = lazy(() => import("@/pages/users/AllUsersPage"));
const UserRolesPage = lazy(() => import("@/pages/users/UserRolesPage"));

export const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/admin" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/admin" />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

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
        <Route path="/admin/smarketplace/products" element={<ProductsPage />} />
        <Route path="/admin/smarketplace/orders" element={<OrdersPage />} />
        <Route path="/admin/smarketplace/vendors" element={<VendorsPage />} />
        <Route path="/admin/smarketplace/customers" element={<CustomersPage />} />
        <Route path="/admin/smarketplace/shipping" element={<ShippingPage />} />
        <Route path="/admin/smarketplace/promotions" element={<PromotionsPage />} />
        <Route path="/admin/smarketplace/financials" element={<FinancialsPage />} />
        <Route path="/admin/smarketplace/reviews" element={<ReviewsPage />} />
        <Route path="/admin/smarketplace/settings" element={<SettingsPage />} />
        <Route path="/admin/smarketplace/addons" element={<AddonsPage />} />

        {/* Reports Routes */}
        <Route path="/admin/reports/activity-logs" element={<ActivityLogsPage />} />
        <Route path="/admin/reports/financial-reports" element={<FinancialReportsPage />} />

        {/* System Routes */}
        <Route path="/admin/media-library" element={<MediaLibraryPage />} />
        <Route path="/admin/messages" element={<MessagesPage />} />
        <Route path="/admin/settings" element={<SystemSettingsPage />} />

        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/admin" />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </Suspense>
  );
};
