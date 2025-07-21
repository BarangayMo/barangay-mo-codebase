import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResidentHome from "./pages/ResidentHome";
import OfficialDashboard from "./pages/OfficialDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/Products";
import MediaLibrary from "./pages/MediaLibrary";
import { AuthProvider } from "@/contexts/AuthContext";
import EmailVerification from "./pages/EmailVerification";
import EmailConfirmation from "./pages/EmailConfirmation";
import MPin from "./pages/MPin";
import RbiForm from "./pages/RBI/RbiForm";
import RbiSuccess from "./pages/RBI/RbiSuccess";
import RbiFormDrafts from "./pages/RBI/RbiFormDrafts";
import RbiFormView from "./pages/RBI/RbiFormView";
import Messages from "./pages/Messages";
import Marketplace from "./pages/Marketplace";
import { ProductDetail, Cart, Checkout, OrderConfirmation, MyOrders } from "./pages/marketplace";
import AddProduct from "./pages/marketplace/AddProduct";

export default function AppRoutes() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/email-confirmation" element={<EmailConfirmation />} />
          <Route path="/mpin" element={<MPin />} />
          <Route path="/resident-home" element={<ResidentHome />} />
          <Route path="/official-dashboard" element={<OfficialDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/media-library" element={<MediaLibrary />} />

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
