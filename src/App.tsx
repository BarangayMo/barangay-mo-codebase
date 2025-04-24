import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./contexts/AuthContext";
import { ScrollToTop } from "./components/ScrollToTop";
import { Toaster } from "sonner";
import { useIsMobile } from "./hooks/use-mobile";
import MobileWelcome from "./pages/MobileWelcome";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import ResidentHome from "./pages/ResidentHome";
import ResidentProfile from "./pages/ResidentProfile";
import RbiRegistration from "./pages/RbiRegistration";
import OfficialsDashboard from "./pages/OfficialsDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Jobs from "./pages/Jobs";
import Marketplace from "./pages/Marketplace";
import Services from "./pages/Services";
import { ProductDetail, Cart, Checkout, OrderConfirmation, MyOrders } from "./pages/marketplace";
import Menu from "./pages/Menu";
import Phone from "./pages/Phone";
import Verify from "./pages/Verify";
import FaviconManager from "./components/FaviconManager";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Features from "./pages/Features";
import Careers from "./pages/Careers";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider navigate={navigate} currentPath={location.pathname}>
        <FaviconManager />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={isMobile ? <MobileWelcome /> : <Index />} />
          <Route path="/phone" element={<Phone />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/resident-home" element={<ResidentHome />} />
          <Route path="/resident-profile" element={<ResidentProfile />} />
          <Route path="/rbi-registration" element={<RbiRegistration />} />
          <Route path="/official-dashboard" element={<OfficialsDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/services" element={<Services />} />
          <Route path="/marketplace/:productId" element={<ProductDetail />} />
          <Route path="/marketplace/cart" element={<Cart />} />
          <Route path="/marketplace/checkout" element={<Checkout />} />
          <Route path="/marketplace/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/marketplace/orders" element={<MyOrders />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
