
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResidentHome from "./pages/ResidentHome";
import OfficialsDashboard from "./pages/OfficialsDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/Products";
import MediaLibraryPage from "./pages/admin/MediaLibraryPage";
import { AuthProvider } from "@/contexts/AuthContext";
import EmailVerification from "./pages/EmailVerification";
import EmailConfirmation from "./pages/EmailConfirmation";
import MPin from "./pages/MPIN";
import RbiForm from "./pages/RbiRegistration";
import RbiSuccess from "./pages/RbiRegistration";
import RbiFormDrafts from "./pages/RbiRegistration";
import RbiFormView from "./pages/RbiRegistration";
import Messages from "./pages/Messages";
import Marketplace from "./pages/Marketplace";
import { ProductDetail, Cart, Checkout, OrderConfirmation, MyOrders } from "./pages/marketplace";
import AddProduct from "./pages/marketplace/AddProduct";

export default function AppRoutes() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/email-confirmation" element={<EmailConfirmation />} />
          <Route path="/mpin" element={<MPin />} />
          <Route path="/resident-home" element={<ResidentHome />} />
          <Route path="/official-dashboard" element={<OfficialsDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/media-library" element={<MediaLibraryPage />} />

          {/* RBI Routes */}
          <Route path="/rbi-form" element={<RbiForm />} />
          <Route path="/rbi-success" element={<RbiSuccess />} />
          <Route path="/rbi-drafts" element={<RbiFormDrafts />} />
          <Route path="/rbi-view/:id" element={<RbiFormView />} />

          {/* Messages Routes */}
          <Route path="/messages" element={<Messages />} />

          {/* Marketplace Routes */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/add-product" element={<AddProduct />} />
          <Route path="/marketplace/product/:id" element={<ProductDetail />} />
          <Route path="/marketplace/cart" element={<Cart />} />
          <Route path="/marketplace/checkout" element={<Checkout />} />
          <Route path="/marketplace/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/marketplace/my-orders" element={<MyOrders />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
