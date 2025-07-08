
import { Route, Routes } from 'react-router-dom';
import Welcome from "@/pages/Welcome";
import Login from "@/pages/Login";
import MPIN from "@/pages/MPIN";
import Register from "@/pages/Register";
import RoleSelection from "@/pages/RoleSelection";
import LocationSelection from "@/pages/LocationSelection";
import OfficialsInfo from "@/pages/OfficialsInfo";
import EmailVerification from "@/pages/EmailVerification";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Officials from "@/pages/Officials";
import Settings from "@/pages/Settings";
import LogoUpload from "@/pages/LogoUpload";
import FinalRegister from "@/pages/FinalRegister";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/mpin" element={<MPIN />} />
      <Route path="/register/role" element={<RoleSelection />} />
      <Route path="/register/location" element={<LocationSelection />} />
      <Route path="/register/officials" element={<OfficialsInfo />} />
      <Route path="/register/logo" element={<LogoUpload />} />
      <Route path="/register/final" element={<FinalRegister />} />
      <Route path="/register/details" element={<Register />} />
      <Route path="/email-verification" element={<EmailVerification />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path="/officials" element={<Officials />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default AppRoutes;
