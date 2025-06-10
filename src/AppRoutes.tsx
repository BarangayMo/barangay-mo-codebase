
import {
  Routes,
  Route,
} from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Verify from "@/pages/Verify";
import AdminDashboard from "@/pages/AdminDashboard";
import ResidentHome from "@/pages/ResidentHome";
import SettingsPage from "@/pages/admin/SettingsPage";
import MediaLibraryPage from "@/pages/admin/MediaLibraryPage";
import MessagesPage from "@/pages/admin/MessagesPage";
import NotificationsPage from "@/pages/admin/NotificationsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/resident-home" element={<ResidentHome />} />
      
      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/settings" element={<SettingsPage />} />
      <Route path="/admin/media-library" element={<MediaLibraryPage />} />
      <Route path="/admin/messages" element={<MessagesPage />} />
      <Route path="/admin/notifications" element={<NotificationsPage />} />
      
    </Routes>
  );
};

export default AppRoutes;
