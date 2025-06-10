import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Verify from "@/pages/Verify";
import MPIN from "@/pages/MPIN";
import Phone from "@/pages/Phone";
import ResidentHome from "@/pages/ResidentHome";
import OfficialsDashboard from "@/pages/OfficialsDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Notifications from "@/pages/Notifications";
import Settings from "@/pages/Settings";
import Menu from "@/pages/Menu";
import Messages from "@/pages/Messages";
import ResidentProfile from "@/pages/ResidentProfile";
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

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/mpin" element={<MPIN />} />
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
      
      <Route path="/resident-home" element={<ResidentHome />} />
      <Route path="/rbi-registration" element={<RbiRegistration />} />
      <Route path="/resident-profile" element={<ResidentProfile />} />
      
      <Route path="/official-dashboard" element={<OfficialsDashboard />} />
      
      <Route path="/admin" element={<AdminDashboard />} />
      
      <Route path="/admin/smarketplace" element={<SmarketplaceIndex />} />
      <Route path="/admin/smarketplace/overview" element={<SmarketplaceOverview />} />
      <Route path="/admin/smarketplace/products/all" element={<ProductsAllPage />} />
      <Route path="/admin/smarketplace/products/edit/:id" element={<ProductEditPage />} />
      <Route path="/admin/smarketplace/products/categories" element={<CategoriesPage />} />
      <Route path="/admin/smarketplace/products/inventory" element={<ProductsAllPage />} />
      <Route path="/admin/smarketplace/orders/all" element={<OrdersAllPage />} />
      <Route path="/admin/smarketplace/orders/processing" element={<OrdersAllPage />} />
      <Route path="/admin/smarketplace/orders/completed" element={<OrdersAllPage />} />
      <Route path="/admin/smarketplace/vendors/all" element={<VendorsAllPage />} />
      <Route path="/admin/smarketplace/customers/all" element={<CustomersAllPage />} />
      <Route path="/admin/smarketplace/customers/vip" element={<CustomersAllPage />} />
      
      <Route path="/admin/messages" element={<MessagesPage />} />
      <Route path="/admin/messages/:id" element={<MessagesPage />} />
      
      <Route path="/admin/reports/financial" element={<FinancialReportsPage />} />
      <Route path="/admin/reports/activity" element={<ActivityLogsPage />} />
      
      <Route path="/admin/users" element={<UserManagementPage />} />
      <Route path="/admin/users/all" element={<UserManagementPage />} />
      <Route path="/admin/users/roles" element={<UserManagementPage />} />
      <Route path="/admin/users/settings" element={<UserManagementPage />} />
      <Route path="/admin/users/:id" element={<UserProfilePage />} />
      
      <Route path="/admin/settings" element={<SettingsPage />} />
      
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/messages/:id" element={<Messages />} />
      
      <Route path="/services" element={<Services />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/marketplace/product/:id" element={<ProductDetail />} />
      <Route path="/marketplace/cart" element={<Cart />} />
      <Route path="/marketplace/checkout" element={<Checkout />} />
      <Route path="/marketplace/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/marketplace/my-orders" element={<MyOrders />} />
      
      <Route path="/admin/media-library" element={<MediaLibraryPage />} />
      
      <Route path="/edit-profile" element={<EditProfile />} />
      
      <Route path="/admin/jobs" element={<AdminDashboard />} />
      <Route path="/admin/jobs/all" element={<JobsAllPage />} />
      <Route path="/admin/jobs/edit/:id" element={<JobEditPage />} />
      <Route path="/admin/jobs/applications" element={<JobApplicationsPage />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
