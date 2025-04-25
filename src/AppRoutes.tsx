
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
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Features from "@/pages/Features";
import Careers from "@/pages/Careers";
import Products from "@/pages/Products";
import Pricing from "@/pages/Pricing";
import RequestAccess from "@/pages/RequestAccess";
import Partnerships from "@/pages/Partnerships";

// Marketplace routes
import ProductDetail from "@/pages/marketplace/ProductDetail";
import Cart from "@/pages/marketplace/Cart";
import Checkout from "@/pages/marketplace/Checkout";
import OrderConfirmation from "@/pages/marketplace/OrderConfirmation";
import MyOrders from "@/pages/marketplace/MyOrders";

// Smarketplace routes
import SmarketplaceIndex from "@/pages/smarketplace/SmarketplaceIndex";
import SmarketplaceOverview from "@/pages/smarketplace/SmarketplaceOverview";
import ProductsAllPage from "@/pages/smarketplace/products/ProductsAllPage";
import CategoriesPage from "@/pages/smarketplace/products/CategoriesPage";
import OrdersAllPage from "@/pages/smarketplace/orders/OrdersAllPage";
import CustomersAllPage from "@/pages/smarketplace/customers/CustomersAllPage";
import VendorsAllPage from "@/pages/smarketplace/vendors/VendorsAllPage";

// Reports routes
import FinancialReportsPage from "@/pages/reports/FinancialReportsPage";
import ActivityLogsPage from "@/pages/reports/ActivityLogsPage";

// User Management routes
import ResidentsPage from "@/pages/users/ResidentsPage";
import OfficialsPage from "@/pages/users/OfficialsPage";

// Settings routes
import SettingsPage from "@/pages/admin/SettingsPage";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
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
      
      {/* Protected resident routes */}
      <Route path="/resident-home" element={<ResidentHome />} />
      <Route path="/rbi-registration" element={<RbiRegistration />} />
      <Route path="/resident-profile" element={<ResidentProfile />} />
      
      {/* Protected official routes */}
      <Route path="/official-dashboard" element={<OfficialsDashboard />} />
      
      {/* Protected admin routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      
      {/* Smarketplace admin routes */}
      <Route path="/admin/smarketplace" element={<SmarketplaceIndex />} />
      <Route path="/admin/smarketplace/overview" element={<SmarketplaceOverview />} />
      <Route path="/admin/smarketplace/products/all" element={<ProductsAllPage />} />
      <Route path="/admin/smarketplace/products/categories" element={<CategoriesPage />} />
      <Route path="/admin/smarketplace/products/inventory" element={<ProductsAllPage />} />
      <Route path="/admin/smarketplace/orders/all" element={<OrdersAllPage />} />
      <Route path="/admin/smarketplace/orders/processing" element={<OrdersAllPage />} />
      <Route path="/admin/smarketplace/orders/completed" element={<OrdersAllPage />} />
      <Route path="/admin/smarketplace/vendors/all" element={<VendorsAllPage />} />
      <Route path="/admin/smarketplace/customers/all" element={<CustomersAllPage />} />
      <Route path="/admin/smarketplace/customers/vip" element={<CustomersAllPage />} />
      
      {/* Reports routes */}
      <Route path="/admin/reports/financial" element={<FinancialReportsPage />} />
      <Route path="/admin/reports/activity" element={<ActivityLogsPage />} />
      
      {/* User Management routes */}
      <Route path="/admin/users/residents" element={<ResidentsPage />} />
      <Route path="/admin/users/officials" element={<OfficialsPage />} />
      
      {/* Settings routes */}
      <Route path="/admin/settings" element={<SettingsPage />} />
      
      {/* Common protected routes */}
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/services" element={<Services />} />
      <Route path="/jobs" element={<Jobs />} />
      
      {/* Marketplace routes */}
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/marketplace/product/:id" element={<ProductDetail />} />
      <Route path="/marketplace/cart" element={<Cart />} />
      <Route path="/marketplace/checkout" element={<Checkout />} />
      <Route path="/marketplace/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/marketplace/my-orders" element={<MyOrders />} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
