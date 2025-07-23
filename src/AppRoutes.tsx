import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import RoleSelection from "@/pages/RoleSelection";
import LocationSelection from "@/pages/LocationSelection";
import OfficialsInfo from "@/pages/OfficialsInfo";
import OfficialDocuments from "@/pages/OfficialDocuments";
import LogoUpload from "@/pages/LogoUpload";
import EmailVerification from "@/pages/EmailVerification";
import Verify from "@/pages/Verify";
import MPIN from "@/pages/MPIN";
import ForgotMPIN from "@/pages/ForgotMPIN";
import Phone from "@/pages/Phone";
import ResidentHome from "@/pages/ResidentHome";
import OfficialsDashboard from "@/pages/OfficialsDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Notifications from "@/pages/Notifications";
import Settings from "@/pages/Settings";
import Menu from "@/pages/Menu";
import Messages from "@/pages/Messages";
import ResidentProfile from "@/pages/ResidentProfile";
import OfficialProfile from "@/pages/OfficialProfile";
import MobileWelcome from "@/pages/MobileWelcome";
import RbiRegistration from "@/pages/RbiRegistration";
import NotFound from "@/pages/NotFound";
import Services from "@/pages/Services";
import Marketplace from "@/pages/Marketplace";
import Jobs from "@/pages/Jobs";
import JobDetail from "@/pages/JobDetail";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Features from "@/pages/Features";
import Careers from "@/pages/Careers";
import Products from "@/pages/Products";
import Pricing from "@/pages/Pricing";
import RequestAccess from "@/pages/RequestAccess";
import Partnerships from "@/pages/Partnerships";
import MediaLibraryPage from "@/pages/admin/MediaLibraryPage";
import Community from "@/pages/Community";
import CommunityPostDetail from "@/pages/CommunityPostDetail";

// Import marketplace components
import SmarketplaceIndex from "@/pages/smarketplace/SmarketplaceIndex";
import SmarketplaceOverview from "@/pages/smarketplace/SmarketplaceOverview";
import ProductsAllPage from "@/pages/smarketplace/products/ProductsAllPage";
import ProductEditPage from "@/pages/smarketplace/products/ProductEditPage";
import CategoriesPage from "@/pages/smarketplace/products/CategoriesPage";
import OrdersAllPage from "@/pages/smarketplace/orders/OrdersAllPage";
import VendorsAllPage from "@/pages/smarketplace/vendors/VendorsAllPage";
import CustomersAllPage from "@/pages/smarketplace/customers/CustomersAllPage";

// Import report/user pages
import MessagesPage from "@/pages/admin/MessagesPage";
import FinancialReportsPage from "@/pages/reports/FinancialReportsPage";
import ActivityLogsPage from "@/pages/reports/ActivityLogsPage";
import ResidentsPage from "@/pages/users/ResidentsPage";
import OfficialsPage from "@/pages/users/OfficialsPage";
import UserProfilePage from "@/pages/users/UserProfilePage";
import SettingsPage from "@/pages/admin/SettingsPage";

// Import marketplace customer-facing pages
import ProductDetail from "@/pages/marketplace/ProductDetail";
import Cart from "@/pages/marketplace/Cart";
import Checkout from "@/pages/marketplace/Checkout";
import OrderConfirmation from "@/pages/marketplace/OrderConfirmation";
import MyOrders from "@/pages/marketplace/MyOrders";

// Import the EditProfile component
import EditProfile from "./pages/EditProfile";

import UserManagementPage from "@/pages/users/UserManagementPage";

// Import admin jobs pages
import JobsAllPage from "@/pages/admin/JobsAllPage";
import JobEditPage from "@/pages/admin/JobEditPage";
import JobApplicationsPage from "@/pages/admin/JobApplicationsPage";

// Import the new profile pages
import PublicProfile from "@/pages/PublicProfile";
import PrivateProfile from "@/pages/PrivateProfile";

// Import official pages
import OfficialResidents from "@/pages/officials/OfficialResidents";
import OfficialServices from "@/pages/officials/OfficialServices";
import OfficialRequests from "@/pages/officials/OfficialRequests";
import PunongBarangayDashboard from "@/pages/officials/PunongBarangayDashboard";
import EmergencyResponse from "@/pages/officials/EmergencyResponse";

// Import the new EmailConfirmation component
import EmailConfirmation from "@/pages/EmailConfirmation";

// Import the new QR Scanner component
import QRScanner from "@/pages/officials/QRScanner";

// Import the new RBI Forms component
import RbiForms from "@/pages/officials/RbiForms";

// Import the EmailConfirmationHandler
import { EmailConfirmationHandler } from "@/components/auth/EmailConfirmationHandler";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RbiProtectedRoute } from "@/components/auth/RbiProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      {/* Registration flow routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/register/role" element={<RoleSelection />} />
      <Route path="/register/location" element={<LocationSelection />} />
      <Route path="/register/officials" element={<OfficialsInfo />} />
      <Route path="/register/official-documents" element={<OfficialDocuments />} />
      <Route path="/register/logo" element={<LogoUpload />} />
      <Route path="/email-verification" element={<EmailVerification />} />
      <Route path="/email-confirmation" element={<EmailConfirmationHandler />} />
      <Route path="/auth/confirm" element={<EmailConfirmationHandler />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/mpin" element={<MPIN />} />
      <Route path="/forgot-mpin" element={<ForgotMPIN />} />
      <Route path="/phone" element={<Phone />} />
      <Route path="/welcome" element={<MobileWelcome />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/features" element={<Features />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/products" element={<Products />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/request-access" element={<RequestAccess />} />
      <Route path="/partnerships" element={<Partnerships />} />
      
      {/* Protected routes - require authentication and email verification */}
      <Route path="/resident-home" element={<RbiProtectedRoute><ResidentHome /></RbiProtectedRoute>} />
      <Route path="/rbi-registration" element={<RbiProtectedRoute><RbiRegistration /></RbiProtectedRoute>} />
      <Route path="/resident-profile" element={<RbiProtectedRoute><ResidentProfile /></RbiProtectedRoute>} />
      <Route path="/community" element={<RbiProtectedRoute><Community /></RbiProtectedRoute>} />
      
      <Route path="/community/post/:postId" element={<RbiProtectedRoute><CommunityPostDetail /></RbiProtectedRoute>} />
      
      <Route path="/official-dashboard" element={<ProtectedRoute><OfficialsDashboard /></ProtectedRoute>} />
      <Route path="/official-profile" element={<ProtectedRoute><OfficialProfile /></ProtectedRoute>} />
      <Route path="/official/residents" element={<ProtectedRoute><OfficialResidents /></ProtectedRoute>} />
      <Route path="/official/services" element={<ProtectedRoute><OfficialServices /></ProtectedRoute>} />
      <Route path="/official/requests" element={<ProtectedRoute><OfficialRequests /></ProtectedRoute>} />
      <Route path="/official/officials" element={<ProtectedRoute><OfficialsPage /></ProtectedRoute>} />
      <Route path="/official/punong-barangay" element={<ProtectedRoute><PunongBarangayDashboard /></ProtectedRoute>} />
      <Route path="/official/emergency-response" element={<ProtectedRoute><EmergencyResponse /></ProtectedRoute>} />
      <Route path="/official/rbi-forms" element={<ProtectedRoute><RbiForms /></ProtectedRoute>} />
      
      <Route path="/official/qr-verification" element={<ProtectedRoute><QRScanner /></ProtectedRoute>} />
      
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      
      <Route path="/admin/smarketplace" element={<ProtectedRoute><SmarketplaceIndex /></ProtectedRoute>} />
      <Route path="/admin/smarketplace/overview" element={<ProtectedRoute><SmarketplaceOverview /></ProtectedRoute>} />
      <Route path="/admin/smarketplace/products/all" element={<ProtectedRoute><ProductsAllPage /></ProtectedRoute>} />
      <Route path="/admin/smarketplace/products/edit/:id" element={<ProtectedRoute><ProductEditPage /></ProtectedRoute>} />
      <Route path="/admin/smarketplace/products/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
      <Route path="/admin/smarketplace/products/inventory" element={<ProtectedRoute><ProductsAllPage /></ProtectedRoute>} />
      <Route path="/admin/smarketplace/orders/all" element={<ProtectedRoute><OrdersAllPage /></ProtectedRoute>} />
      <Route path="/admin/smarketplace/orders/processing" element={<ProtectedRoute><OrdersAllPage /></ProtectedRoute>} />
      <Route path="/admin/smarketplace/orders/completed" element={<ProtectedRoute><OrdersAllPage /></ProtectedRoute>} />
      <Route path="/admin/smarketplace/vendors/all" element={<ProtectedRoute><VendorsAllPage /></ProtectedRoute>} />
      <Route path="/admin/smarketplace/customers/all" element={<ProtectedRoute><CustomersAllPage /></ProtectedRoute>} />
      <Route path="/admin/smarketplace/customers/vip" element={<ProtectedRoute><CustomersAllPage /></ProtectedRoute>} />
      
      <Route path="/admin/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
      <Route path="/admin/messages/:id" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
      
      <Route path="/admin/reports/financial" element={<ProtectedRoute><FinancialReportsPage /></ProtectedRoute>} />
      <Route path="/admin/reports/activity" element={<ProtectedRoute><ActivityLogsPage /></ProtectedRoute>} />
      
      <Route path="/admin/users" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
      <Route path="/admin/users/all" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
      <Route path="/admin/users/roles" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
      <Route path="/admin/users/settings" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
      <Route path="/admin/users/officials" element={<ProtectedRoute><OfficialsPage /></ProtectedRoute>} />
      <Route path="/admin/users/:id" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
      
      <Route path="/admin/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      
      <Route path="/notifications" element={<RbiProtectedRoute><Notifications /></RbiProtectedRoute>} />
      <Route path="/settings" element={<RbiProtectedRoute><Settings /></RbiProtectedRoute>} />
      <Route path="/menu" element={<RbiProtectedRoute><Menu /></RbiProtectedRoute>} />
      <Route path="/messages" element={<RbiProtectedRoute><Messages /></RbiProtectedRoute>} />
      <Route path="/messages/:id" element={<RbiProtectedRoute><Messages /></RbiProtectedRoute>} />
      
      <Route path="/services" element={<RbiProtectedRoute><Services /></RbiProtectedRoute>} />
      <Route path="/jobs" element={<RbiProtectedRoute><Jobs /></RbiProtectedRoute>} />
      <Route path="/jobs/:id" element={<RbiProtectedRoute><JobDetail /></RbiProtectedRoute>} />
      
      <Route path="/marketplace" element={<RbiProtectedRoute><Marketplace /></RbiProtectedRoute>} />
      <Route path="/marketplace/product/:id" element={<RbiProtectedRoute><ProductDetail /></RbiProtectedRoute>} />
      <Route path="/marketplace/cart" element={<RbiProtectedRoute><Cart /></RbiProtectedRoute>} />
      <Route path="/marketplace/checkout" element={<RbiProtectedRoute><Checkout /></RbiProtectedRoute>} />
      <Route path="/marketplace/order-confirmation" element={<RbiProtectedRoute><OrderConfirmation /></RbiProtectedRoute>} />
      <Route path="/marketplace/my-orders" element={<RbiProtectedRoute><MyOrders /></RbiProtectedRoute>} />
      
      <Route path="/admin/media-library" element={<ProtectedRoute><MediaLibraryPage /></ProtectedRoute>} />
      
      <Route path="/edit-profile" element={<RbiProtectedRoute><EditProfile /></RbiProtectedRoute>} />
      
      <Route path="/admin/jobs" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/jobs/all" element={<ProtectedRoute><JobsAllPage /></ProtectedRoute>} />
      <Route path="/admin/jobs/edit/:id" element={<ProtectedRoute><JobEditPage /></ProtectedRoute>} />
      <Route path="/admin/jobs/applications" element={<ProtectedRoute><JobApplicationsPage /></ProtectedRoute>} />
      
      <Route path="/profile/public/:userId" element={<RbiProtectedRoute><PublicProfile /></RbiProtectedRoute>} />
      <Route path="/profile/private" element={<RbiProtectedRoute><PrivateProfile /></RbiProtectedRoute>} />
      <Route path="/profile" element={<RbiProtectedRoute><PrivateProfile /></RbiProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
