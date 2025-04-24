
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

// Marketplace routes
import ProductDetail from "@/pages/marketplace/ProductDetail";
import Cart from "@/pages/marketplace/Cart";
import Checkout from "@/pages/marketplace/Checkout";
import OrderConfirmation from "@/pages/marketplace/OrderConfirmation";
import MyOrders from "@/pages/marketplace/MyOrders";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout><Index /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/register" element={<Layout><Register /></Layout>} />
      <Route path="/verify" element={<Layout><Verify /></Layout>} />
      <Route path="/mpin" element={<Layout><MPIN /></Layout>} />
      <Route path="/phone" element={<Layout><Phone /></Layout>} />
      <Route path="/welcome" element={<Layout><MobileWelcome /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/features" element={<Layout><Features /></Layout>} />
      <Route path="/careers" element={<Layout><Careers /></Layout>} />
      
      {/* Protected resident routes */}
      <Route path="/resident-home" element={<Layout><ResidentHome /></Layout>} />
      <Route path="/rbi-registration" element={<Layout><RbiRegistration /></Layout>} />
      <Route path="/resident-profile" element={<Layout><ResidentProfile /></Layout>} />
      
      {/* Protected official routes */}
      <Route path="/official-dashboard" element={<Layout><OfficialsDashboard /></Layout>} />
      
      {/* Protected admin routes */}
      <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
      
      {/* Common protected routes */}
      <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
      <Route path="/settings" element={<Layout><Settings /></Layout>} />
      <Route path="/menu" element={<Layout><Menu /></Layout>} />
      <Route path="/messages" element={<Layout><Messages /></Layout>} />
      <Route path="/services" element={<Layout><Services /></Layout>} />
      <Route path="/jobs" element={<Layout><Jobs /></Layout>} />
      
      {/* Marketplace routes */}
      <Route path="/marketplace" element={<Layout><Marketplace /></Layout>} />
      <Route path="/marketplace/product/:id" element={<Layout><ProductDetail /></Layout>} />
      <Route path="/marketplace/cart" element={<Layout><Cart /></Layout>} />
      <Route path="/marketplace/checkout" element={<Layout><Checkout /></Layout>} />
      <Route path="/marketplace/order-confirmation" element={<Layout><OrderConfirmation /></Layout>} />
      <Route path="/marketplace/my-orders" element={<Layout><MyOrders /></Layout>} />
      
      {/* 404 route */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
}
