
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

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes without Layout */}
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
      
      {/* Routes with Layout */}
      <Route path="/resident-home" element={<Layout><ResidentHome /></Layout>} />
      <Route path="/rbi-registration" element={<Layout><RbiRegistration /></Layout>} />
      <Route path="/resident-profile" element={<Layout><ResidentProfile /></Layout>} />
      
      <Route path="/official-dashboard" element={<Layout><OfficialsDashboard /></Layout>} />
      
      <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
      
      <Route path="/admin/smarketplace" element={<Layout><SmarketplaceIndex /></Layout>} />
      <Route path="/admin/smarketplace/overview" element={<Layout><SmarketplaceOverview /></Layout>} />
      <Route path="/admin/smarketplace/products/all" element={<Layout><ProductsAllPage /></Layout>} />
      <Route path="/admin/smarketplace/products/edit/:id" element={<Layout><ProductEditPage /></Layout>} />
      <Route path="/admin/smarketplace/products/categories" element={<Layout><CategoriesPage /></Layout>} />
      <Route path="/admin/smarketplace/products/inventory" element={<Layout><ProductsAllPage /></Layout>} />
      <Route path="/admin/smarketplace/orders/all" element={<Layout><OrdersAllPage /></Layout>} />
      <Route path="/admin/smarketplace/orders/processing" element={<Layout><OrdersAllPage /></Layout>} />
      <Route path="/admin/smarketplace/orders/completed" element={<Layout><OrdersAllPage /></Layout>} />
      <Route path="/admin/smarketplace/vendors/all" element={<Layout><VendorsAllPage /></Layout>} />
      <Route path="/admin/smarketplace/customers/all" element={<Layout><CustomersAllPage /></Layout>} />
      <Route path="/admin/smarketplace/customers/vip" element={<Layout><CustomersAllPage /></Layout>} />
      
      <Route path="/admin/messages" element={<Layout><MessagesPage /></Layout>} />
      <Route path="/admin/messages/:id" element={<Layout><MessagesPage /></Layout>} />
      
      <Route path="/admin/reports/financial" element={<Layout><FinancialReportsPage /></Layout>} />
      <Route path="/admin/reports/activity" element={<Layout><ActivityLogsPage /></Layout>} />
      
      <Route path="/admin/users" element={<Layout><UserManagementPage /></Layout>} />
      <Route path="/admin/users/all" element={<Layout><UserManagementPage /></Layout>} />
      <Route path="/admin/users/roles" element={<Layout><UserManagementPage /></Layout>} />
      <Route path="/admin/users/settings" element={<Layout><UserManagementPage /></Layout>} />
      <Route path="/admin/users/:id" element={<Layout><UserProfilePage /></Layout>} />
      
      <Route path="/admin/settings" element={<Layout><SettingsPage /></Layout>} />
      
      <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
      <Route path="/settings" element={<Layout><Settings /></Layout>} />
      <Route path="/menu" element={<Layout><Menu /></Layout>} />
      <Route path="/messages" element={<Layout><Messages /></Layout>} />
      <Route path="/messages/:id" element={<Layout><Messages /></Layout>} />
      
      <Route path="/services" element={<Layout><Services /></Layout>} />
      <Route path="/jobs" element={<Layout><Jobs /></Layout>} />
      <Route path="/jobs/:id" element={<Layout><JobDetail /></Layout>} />
      
      <Route path="/marketplace" element={<Layout><Marketplace /></Layout>} />
      <Route path="/marketplace/product/:id" element={<Layout><ProductDetail /></Layout>} />
      <Route path="/marketplace/cart" element={<Layout><Cart /></Layout>} />
      <Route path="/marketplace/checkout" element={<Layout><Checkout /></Layout>} />
      <Route path="/marketplace/order-confirmation" element={<Layout><OrderConfirmation /></Layout>} />
      <Route path="/marketplace/my-orders" element={<Layout><MyOrders /></Layout>} />
      
      <Route path="/admin/media-library" element={<Layout><MediaLibraryPage /></Layout>} />
      
      <Route path="/edit-profile" element={<Layout><EditProfile /></Layout>} />
      
      <Route path="/admin/jobs" element={<Layout><AdminDashboard /></Layout>} />
      <Route path="/admin/jobs/all" element={<Layout><JobsAllPage /></Layout>} />
      <Route path="/admin/jobs/edit/:id" element={<Layout><JobEditPage /></Layout>} />
      <Route path="/admin/jobs/applications" element={<Layout><AdminDashboard /></Layout>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
