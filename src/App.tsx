import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import MPIN from "./pages/MPIN";
import AdminDashboard from "./pages/AdminDashboard";
import OfficialsDashboard from "./pages/OfficialsDashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Jobs from "./pages/Jobs";
import Marketplace from "./pages/Marketplace";
import ResidentHome from "./pages/ResidentHome";
import Notifications from "./pages/Notifications";
import ResidentProfile from "./pages/ResidentProfile";
import Register from "./pages/Register";
import Messages from "./pages/Messages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mpin" element={<MPIN />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/official-dashboard" element={<OfficialsDashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/resident-home" element={<ResidentHome />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/resident/profile/:id" element={<ResidentProfile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:id" element={<Messages />} />
            <Route path="/about" element={<div>About Page</div>} />
            <Route path="/contact" element={<div>Contact Page</div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
