
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Verify from '@/pages/Verify';
import ResidentHome from '@/pages/ResidentHome';
import Marketplace from '@/pages/Marketplace';
import AdminDashboard from '@/pages/AdminDashboard';
import PrivateRoute from '@/components/PrivateRoute';
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from '@/components/ui/toaster';
import PrivateProfile from '@/pages/PrivateProfile';
import PublicProfile from '@/pages/PublicProfile';
import EditProfile from '@/pages/EditProfile';
import Settings from '@/pages/Settings';
import OfficialsDashboard from '@/pages/OfficialsDashboard';
import NotFound from '@/pages/NotFound';
import BudgetPage from "@/pages/officials/BudgetPage";
import DocumentsPage from "@/pages/officials/DocumentsPage";
import ResidentsPage from "@/pages/officials/ResidentsPage";
import ReportsPage from "@/pages/officials/ReportsPage";
import CampaignsPage from "@/pages/officials/CampaignsPage";
import EventsPage from "@/pages/officials/EventsPage";
import NewCampaignPage from "@/pages/officials/NewCampaignPage";
import NewEventPage from "@/pages/officials/NewEventPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const FaviconManager = () => {
  useEffect(() => {
    // Function to update favicon
    const updateFavicon = (newFaviconUrl: string) => {
      // Remove the old favicon link
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (link) {
        document.head.removeChild(link);
      }

      // Create a new favicon link
      link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = newFaviconUrl;
      document.head.appendChild(link);
    };

    // Call the function with the new favicon URL
    updateFavicon('/favicon.ico');
  }, []);

  return null;
};

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <TooltipProvider>
          <ScrollToTop />
          <FaviconManager />
          
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<Verify />} />

            <Route path="/" element={<PrivateRoute><ResidentHome /></PrivateRoute>} />
            <Route path="/resident-home" element={<PrivateRoute><ResidentHome /></PrivateRoute>} />
            
            <Route path="/marketplace" element={<PrivateRoute><Marketplace /></PrivateRoute>} />

            <Route path="/admin" element={<PrivateRoute requiredRole="superadmin"><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/settings" element={<PrivateRoute requiredRole="superadmin"><Settings /></PrivateRoute>} />

            <Route path="/official-dashboard" element={<PrivateRoute requiredRole="official"><OfficialsDashboard /></PrivateRoute>} />

            <Route path="/resident-profile" element={<PrivateRoute><PrivateProfile /></PrivateRoute>} />
            <Route path="/user/:userId" element={<PrivateRoute><PublicProfile /></PrivateRoute>} />
            <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            
            {/* Officials Pages */}
            <Route path="/officials/budget" element={<PrivateRoute requiredRole="official"><BudgetPage /></PrivateRoute>} />
            <Route path="/officials/documents" element={<PrivateRoute requiredRole="official"><DocumentsPage /></PrivateRoute>} />
            <Route path="/officials/residents" element={<PrivateRoute requiredRole="official"><ResidentsPage /></PrivateRoute>} />
            <Route path="/officials/reports" element={<PrivateRoute requiredRole="official"><ReportsPage /></PrivateRoute>} />
            <Route path="/officials/campaigns" element={<PrivateRoute requiredRole="official"><CampaignsPage /></PrivateRoute>} />
            <Route path="/officials/campaigns/new" element={<PrivateRoute requiredRole="official"><NewCampaignPage /></PrivateRoute>} />
            <Route path="/officials/events" element={<PrivateRoute requiredRole="official"><EventsPage /></PrivateRoute>} />
            <Route path="/officials/events/new" element={<PrivateRoute requiredRole="official"><NewEventPage /></PrivateRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
