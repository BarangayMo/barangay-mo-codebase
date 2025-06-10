
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Verify from "@/pages/Verify";
import AdminDashboard from "@/pages/AdminDashboard";
import ResidentHome from "@/pages/ResidentHome";
import OfficialsDashboard from "@/pages/OfficialsDashboard";
import SettingsPage from "@/pages/admin/SettingsPage";
import MediaLibraryPage from "@/pages/admin/MediaLibraryPage";
import MessagesPage from "@/pages/admin/MessagesPage";
import NotificationsPage from "@/pages/admin/NotificationsPage";
import Notifications from "@/pages/Notifications";
import About from "@/pages/About";
import Careers from "@/pages/Careers";
import Contact from "@/pages/Contact";
import EditProfile from "@/pages/EditProfile";
import Features from "@/pages/Features";
import JobDetail from "@/pages/JobDetail";
import Jobs from "@/pages/Jobs";
import MPIN from "@/pages/MPIN";
import Marketplace from "@/pages/Marketplace";
import Menu from "@/pages/Menu";
import Messages from "@/pages/Messages";
import MobileWelcome from "@/pages/MobileWelcome";
import NotFound from "@/pages/NotFound";
import Partnerships from "@/pages/Partnerships";
import Phone from "@/pages/Phone";
import Pricing from "@/pages/Pricing";
import Products from "@/pages/Products";
import RbiRegistration from "@/pages/RbiRegistration";
import RequestAccess from "@/pages/RequestAccess";
import ResidentProfile from "@/pages/ResidentProfile";
import Services from "@/pages/Services";
import Settings from "@/pages/Settings";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/resident-home" element={<ResidentHome />} />
      <Route path="/official-dashboard" element={<OfficialsDashboard />} />
      
      {/* Admin routes */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/settings" element={<SettingsPage />} />
      <Route path="/admin/media-library" element={<MediaLibraryPage />} />
      <Route path="/admin/messages" element={<MessagesPage />} />
      <Route path="/admin/notifications" element={<NotificationsPage />} />
      
      {/* General pages */}
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/about" element={<About />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/features" element={<Features />} />
      <Route path="/job/:id" element={<JobDetail />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/mpin" element={<MPIN />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/mobile-welcome" element={<MobileWelcome />} />
      <Route path="/partnerships" element={<Partnerships />} />
      <Route path="/phone" element={<Phone />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/products" element={<Products />} />
      <Route path="/rbi-registration" element={<RbiRegistration />} />
      <Route path="/request-access" element={<RequestAccess />} />
      <Route path="/resident-profile" element={<ResidentProfile />} />
      <Route path="/services" element={<Services />} />
      <Route path="/settings" element={<Settings />} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
