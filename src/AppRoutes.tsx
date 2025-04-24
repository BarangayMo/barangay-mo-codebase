
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
import ProductsIndex from "@/pages/smarketplace/products/ProductsIndex";
import CategoriesPage from "@/pages/smarketplace/products/CategoriesPage";
import PageTemplate from "@/pages/smarketplace/PageTemplate";

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
      <Route path="/admin/smarketplace/products/all" element={<ProductsIndex />} />
      <Route path="/admin/smarketplace/products/categories" element={<CategoriesPage />} />
      
      {/* Using PageTemplate for remaining smarketplace routes */}
      <Route path="/admin/smarketplace/products/variants" element={<PageTemplate title="Product Variants" description="Manage product variants and options" />} />
      <Route path="/admin/smarketplace/products/media" element={<PageTemplate title="Product Media" description="Manage product images, videos and slideshows" />} />
      <Route path="/admin/smarketplace/products/reviews" element={<PageTemplate title="Product Reviews" description="Manage and moderate product reviews" />} />
      <Route path="/admin/smarketplace/products/bulk-upload" element={<PageTemplate title="Bulk Upload" description="Import products using CSV files" />} />
      <Route path="/admin/smarketplace/products/settings" element={<PageTemplate title="Product Settings" description="Configure product settings like SEO and tags" />} />
      
      {/* Orders Management */}
      <Route path="/admin/smarketplace/orders/all" element={<PageTemplate title="All Orders" description="View and manage all marketplace orders" />} />
      <Route path="/admin/smarketplace/orders/details" element={<PageTemplate title="Order Details" description="View detailed information about orders" />} />
      <Route path="/admin/smarketplace/orders/statuses" element={<PageTemplate title="Order Statuses" description="Manage order status workflows" />} />
      <Route path="/admin/smarketplace/orders/invoices" element={<PageTemplate title="Invoices & Packing" description="Manage invoices and packing slips" />} />
      <Route path="/admin/smarketplace/orders/abandoned" element={<PageTemplate title="Abandoned Carts" description="View and recover abandoned carts" />} />
      
      {/* Vendor Management */}
      <Route path="/admin/smarketplace/vendors/directory" element={<PageTemplate title="Vendor Directory" description="Browse and manage all vendors" />} />
      <Route path="/admin/smarketplace/vendors/products" element={<PageTemplate title="Vendor Products" description="View products by vendor" />} />
      <Route path="/admin/smarketplace/vendors/payouts" element={<PageTemplate title="Payouts & Settlements" description="Manage vendor payments and settlements" />} />
      <Route path="/admin/smarketplace/vendors/commission" element={<PageTemplate title="Commission Setup" description="Configure vendor commission structures" />} />
      <Route path="/admin/smarketplace/vendors/applications" element={<PageTemplate title="Vendor Applications" description="Review and approve vendor applications" />} />
      
      {/* Customer Management */}
      <Route path="/admin/smarketplace/customers/all" element={<PageTemplate title="All Customers" description="Browse and manage all customers" />} />
      <Route path="/admin/smarketplace/customers/history" element={<PageTemplate title="Purchase History" description="View customer purchase history" />} />
      <Route path="/admin/smarketplace/customers/wishlist" element={<PageTemplate title="Wishlist & Saved Items" description="View customer wishlists and saved items" />} />
      <Route path="/admin/smarketplace/customers/messages" element={<PageTemplate title="Messages & Support" description="Customer support and messaging" />} />
      <Route path="/admin/smarketplace/customers/loyalty" element={<PageTemplate title="Loyalty Points" description="Manage customer loyalty programs" />} />
      
      {/* Shipping & Fulfillment */}
      <Route path="/admin/smarketplace/shipping/zones" element={<PageTemplate title="Shipping Zones" description="Configure shipping zones and rates" />} />
      <Route path="/admin/smarketplace/shipping/vendor-specific" element={<PageTemplate title="Vendor-Specific Shipping" description="Configure vendor-specific shipping options" />} />
      <Route path="/admin/smarketplace/shipping/delivery-windows" element={<PageTemplate title="Delivery Windows" description="Configure delivery time windows" />} />
      <Route path="/admin/smarketplace/shipping/pickup-stations" element={<PageTemplate title="Pickup Stations" description="Manage physical pickup stations" />} />
      
      {/* Promotions & Rewards */}
      <Route path="/admin/smarketplace/promotions/discount-codes" element={<PageTemplate title="Discount Codes" description="Create and manage discount codes" />} />
      <Route path="/admin/smarketplace/promotions/gift-cards" element={<PageTemplate title="Gift Cards" description="Create and manage gift cards" />} />
      <Route path="/admin/smarketplace/promotions/vendor" element={<PageTemplate title="Vendor Promotions" description="Manage vendor-specific promotions" />} />
      <Route path="/admin/smarketplace/promotions/loyalty" element={<PageTemplate title="Loyalty & Rewards" description="Configure loyalty and reward programs" />} />
      
      {/* Financials & Reports */}
      <Route path="/admin/smarketplace/financials/sales" element={<PageTemplate title="Sales Reports" description="View sales and financial reports" />} />
      <Route path="/admin/smarketplace/financials/revenue" element={<PageTemplate title="Platform Revenue" description="View platform revenue and fees" />} />
      <Route path="/admin/smarketplace/financials/refunds" element={<PageTemplate title="Refunds & Adjustments" description="Manage refunds and financial adjustments" />} />
      <Route path="/admin/smarketplace/financials/tax" element={<PageTemplate title="Tax Settings" description="Configure tax settings and rates" />} />
      
      {/* Reviews & Moderation */}
      <Route path="/admin/smarketplace/reviews/products" element={<PageTemplate title="Product Reviews" description="Moderate product reviews" />} />
      <Route path="/admin/smarketplace/reviews/vendors" element={<PageTemplate title="Vendor Reviews" description="Moderate vendor reviews" />} />
      <Route path="/admin/smarketplace/reviews/disputes" element={<PageTemplate title="Dispute Feedback" description="Manage customer disputes and feedback" />} />
      
      {/* System Settings */}
      <Route path="/admin/smarketplace/settings/payment" element={<PageTemplate title="Payment Gateways" description="Configure payment gateway settings" />} />
      <Route path="/admin/smarketplace/settings/roles" element={<PageTemplate title="Roles & Permissions" description="Manage user roles and permissions" />} />
      <Route path="/admin/smarketplace/settings/language" element={<PageTemplate title="Language & Currency" description="Configure language and currency settings" />} />
      <Route path="/admin/smarketplace/settings/legal" element={<PageTemplate title="Legal & Compliance" description="Manage legal and compliance settings" />} />
      
      {/* Optional Add-Ons */}
      <Route path="/admin/smarketplace/addons/returns" element={<PageTemplate title="Returns Center" description="Manage product returns and refunds" />} />
      <Route path="/admin/smarketplace/addons/disputes" element={<PageTemplate title="Dispute Resolution" description="Handle customer disputes and complaints" />} />
      <Route path="/admin/smarketplace/addons/messaging" element={<PageTemplate title="In-app Messaging" description="Configure in-app messaging features" />} />
      <Route path="/admin/smarketplace/addons/approval" element={<PageTemplate title="Product Approval Queue" description="Review and approve product submissions" />} />
      <Route path="/admin/smarketplace/addons/subscriptions" element={<PageTemplate title="Vendor Subscriptions" description="Manage vendor subscription plans" />} />
      <Route path="/admin/smarketplace/addons/blog" element={<PageTemplate title="Blog/CMS Articles" description="Manage blog and CMS content" />} />
      <Route path="/admin/smarketplace/addons/notifications" element={<PageTemplate title="Notifications System" description="Configure system notifications" />} />
      <Route path="/admin/smarketplace/addons/performance" element={<PageTemplate title="Vendor Performance" description="Track vendor performance metrics" />} />
      <Route path="/admin/smarketplace/addons/forms" element={<PageTemplate title="Custom Form Builder" description="Create custom forms for vendors and customers" />} />
      
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
