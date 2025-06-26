import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import { About } from "@/pages/About";
import { Features } from "@/pages/Features";
import { Pricing } from "@/pages/Pricing";
import { Careers } from "@/pages/Careers";
import { Partnerships } from "@/pages/Partnerships";
import { Contact } from "@/pages/Contact";
import { Products } from "@/pages/Products";
import { Jobs } from "@/pages/Jobs";
import { JobDetail } from "@/pages/JobDetail";
import { MobileWelcome } from "@/pages/auth/MobileWelcome";
import { Register } from "@/pages/Register";
import { Login } from "@/pages/Login";
import { MPIN } from "@/pages/auth/MPIN";
import { Phone } from "@/pages/auth/Phone";
import { ForgotMPIN } from "@/pages/auth/ForgotMPIN";
import { Verify } from "@/pages/auth/Verify";
import { EmailVerification } from "@/pages/auth/EmailVerification";
import { RequestAccess } from "@/pages/auth/RequestAccess";
import { ResidentHome } from "@/pages/resident/ResidentHome";
import { ResidentProfile } from "@/pages/resident/ResidentProfile";
import { PrivateProfile } from "@/pages/resident/PrivateProfile";
import { PublicProfile } from "@/pages/resident/PublicProfile";
import { EditProfile } from "@/pages/resident/EditProfile";
import { RbiRegistration } from "@/pages/resident/RbiRegistration";
import { Messages } from "@/pages/Messages";
import { Notifications } from "@/pages/Notifications";
import { Settings } from "@/pages/Settings";
import { Services } from "@/pages/Services";
import { Menu } from "@/pages/Menu";
import { Marketplace } from "@/pages/marketplace/Marketplace";
import { ProductDetail } from "@/pages/marketplace/ProductDetail";
import { Cart } from "@/pages/marketplace/Cart";
import { Checkout } from "@/pages/marketplace/Checkout";
import { MyOrders } from "@/pages/marketplace/MyOrders";
import { OrderConfirmation } from "@/pages/marketplace/OrderConfirmation";
import { OfficialsDashboard } from "@/pages/officials/OfficialsDashboard";
import { OfficialRequests } from "@/pages/officials/OfficialRequests";
import { OfficialResidents } from "@/pages/officials/OfficialResidents";
import { OfficialServices } from "@/pages/officials/OfficialServices";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { SettingsPage } from "@/pages/admin/SettingsPage";
import { MessagesPage } from "@/pages/admin/MessagesPage";
import { MediaLibraryPage } from "@/pages/admin/MediaLibraryPage";
import { JobsAllPage } from "@/pages/admin/jobs/JobsAllPage";
import { JobEditPage } from "@/pages/admin/jobs/JobEditPage";
import { JobApplicationsPage } from "@/pages/admin/jobs/JobApplicationsPage";
import { UserManagementPage } from "@/pages/admin/users/UserManagementPage";
import { ResidentsPage } from "@/pages/admin/users/ResidentsPage";
import { OfficialsPage as AdminOfficialsPage } from "@/pages/admin/users/OfficialsPage";
import { UserProfilePage } from "@/pages/admin/users/UserProfilePage";
import { ActivityLogsPage } from "@/pages/admin/reports/ActivityLogsPage";
import { FinancialReportsPage } from "@/pages/admin/reports/FinancialReportsPage";
import { SmarketplaceIndex } from "@/pages/admin/smarketplace/SmarketplaceIndex";
import { SmarketplaceOverview } from "@/pages/admin/smarketplace/SmarketplaceOverview";
import { ProductsIndex } from "@/pages/admin/smarketplace/products/ProductsIndex";
import { ProductsAllPage } from "@/pages/admin/smarketplace/products/ProductsAllPage";
import { CategoriesPage } from "@/pages/admin/smarketplace/products/CategoriesPage";
import { ProductEditPage } from "@/pages/admin/smarketplace/products/ProductEditPage";
import { OrdersAllPage } from "@/pages/admin/smarketplace/orders/OrdersAllPage";
import { OrderDetail } from "@/pages/admin/smarketplace/orders/OrderDetail";
import { CustomersAllPage } from "@/pages/admin/smarketplace/customers/CustomersAllPage";
import { CustomerDetail } from "@/pages/admin/smarketplace/customers/CustomerDetail";
import { VendorsDirectoryPage } from "@/pages/admin/smarketplace/vendors/VendorsDirectoryPage";
import { VendorsAllPage } from "@/pages/admin/smarketplace/vendors/VendorsAllPage";
import { VendorDetail } from "@/pages/admin/smarketplace/vendors/VendorDetail";
import { NotFound } from "@/pages/NotFound";
import { ScrollToTop } from "@/components/ScrollToTop";
import OfficialsPage from "@/pages/officials/OfficialsPage";

export const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/partnerships" element={<Partnerships />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Products />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        
        {/* Auth routes */}
        <Route path="/welcome" element={<MobileWelcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mpin" element={<MPIN />} />
        <Route path="/phone" element={<Phone />} />
        <Route path="/forgot-mpin" element={<ForgotMPIN />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/request-access" element={<RequestAccess />} />
        
        {/* Protected routes */}
        <Route path="/resident-home" element={<ResidentHome />} />
        <Route path="/resident-profile" element={<ResidentProfile />} />
        <Route path="/private-profile" element={<PrivateProfile />} />
        <Route path="/public-profile" element={<PublicProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/rbi-registration" element={<RbiRegistration />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/services" element={<Services />} />
        <Route path="/menu" element={<Menu />} />
        
        {/* Marketplace routes */}
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/product/:id" element={<ProductDetail />} />
        <Route path="/marketplace/cart" element={<Cart />} />
        <Route path="/marketplace/checkout" element={<Checkout />} />
        <Route path="/marketplace/orders" element={<MyOrders />} />
        <Route path="/marketplace/order-confirmation" element={<OrderConfirmation />} />
        
        {/* Official routes */}
        <Route path="/official" element={<OfficialsPage />} />
        <Route path="/official-dashboard" element={<OfficialsDashboard />} />
        <Route path="/official/requests" element={<OfficialRequests />} />
        <Route path="/official/residents" element={<OfficialResidents />} />
        <Route path="/official/services" element={<OfficialServices />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="/admin/messages" element={<MessagesPage />} />
        <Route path="/admin/media-library" element={<MediaLibraryPage />} />
        <Route path="/admin/jobs" element={<JobsAllPage />} />
        <Route path="/admin/jobs/:id" element={<JobEditPage />} />
        <Route path="/admin/job-applications" element={<JobApplicationsPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/users/residents" element={<ResidentsPage />} />
        <Route path="/admin/users/officials" element={<AdminOfficialsPage />} />
        <Route path="/admin/users/:id" element={<UserProfilePage />} />
        <Route path="/admin/reports/activity-logs" element={<ActivityLogsPage />} />
        <Route path="/admin/reports/financial" element={<FinancialReportsPage />} />
        
        {/* Marketplace admin routes */}
        <Route path="/admin/smarketplace" element={<SmarketplaceIndex />} />
        <Route path="/admin/smarketplace/overview" element={<SmarketplaceOverview />} />
        <Route path="/admin/smarketplace/products" element={<ProductsIndex />} />
        <Route path="/admin/smarketplace/products/all" element={<ProductsAllPage />} />
        <Route path="/admin/smarketplace/products/categories" element={<CategoriesPage />} />
        <Route path="/admin/smarketplace/products/:id" element={<ProductDetail />} />
        <Route path="/admin/smarketplace/products/:id/edit" element={<ProductEditPage />} />
        <Route path="/admin/smarketplace/orders/all" element={<OrdersAllPage />} />
        <Route path="/admin/smarketplace/orders/:id" element={<OrderDetail />} />
        <Route path="/admin/smarketplace/customers/all" element={<CustomersAllPage />} />
        <Route path="/admin/smarketplace/customers/:id" element={<CustomerDetail />} />
        <Route path="/admin/smarketplace/vendors/directory" element={<VendorsDirectoryPage />} />
        <Route path="/admin/smarketplace/vendors/all" element={<VendorsAllPage />} />
        <Route path="/admin/smarketplace/vendors/:id" element={<VendorDetail />} />
        
        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
