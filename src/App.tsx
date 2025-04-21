
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MPIN from "./pages/MPIN";
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
import { Toaster } from "@/components/ui/toaster"
import { ProductDetail, Cart, Checkout, OrderConfirmation, MyOrders } from "./pages/marketplace";
import Menu from "./pages/Menu";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider navigate={navigate} currentPath={location.pathname}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mpin" element={<MPIN />} />
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
          <Route path="/marketplace/:productId" element={<ProductDetail />} />
          <Route path="/marketplace/cart" element={<Cart />} />
          <Route path="/marketplace/checkout" element={<Checkout />} />
          <Route path="/marketplace/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/marketplace/orders" element={<MyOrders />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
