import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { HomePage } from "@/pages/Home";
import { SignInPage } from "@/pages/SignIn";
import { SignUpPage } from "@/pages/SignUp";
import { ForgotPasswordPage } from "@/pages/ForgotPassword";
import { ResetPasswordPage } from "@/pages/ResetPassword";
import { AccountVerificationPage } from "@/pages/AccountVerification";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { SettingsPage } from "@/pages/admin/Settings";
import { MediaLibraryPage } from "@/pages/admin/MediaLibrary";
import { MessagesPage } from "@/pages/admin/Messages";
import NotificationsPage from "@/pages/admin/NotificationsPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/account-verification" element={<AccountVerificationPage />} />
        
        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="/admin/media-library" element={<MediaLibraryPage />} />
        <Route path="/admin/messages" element={<MessagesPage />} />
        <Route path="/admin/notifications" element={<NotificationsPage />} />
        
      </Routes>
    </Router>
  );
};

export default AppRoutes;
