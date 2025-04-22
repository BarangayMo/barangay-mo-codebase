import { useIsMobile } from "@/hooks/use-mobile";
import { Layout } from "@/components/layout/Layout";
import { ShoppingCart, Briefcase, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";

export default function ResidentHome() {
  const isMobile = useIsMobile();

  const quickActions = [
    { icon: ShoppingCart, label: "Market", path: "/marketplace" },
    { icon: Briefcase, label: "Jobs", path: "/jobs" },
    { icon: FileText, label: "Documents", path: "/services/documents" },
  ];

  return (
    <Layout>
      <Helmet>
        <title>Resident Dashboard - Barangay Management System</title>
      </Helmet>
      <div className="min-h-screen pt-16 bg-[url('/lovable-uploads/3bcad0e5-aa2f-4884-81a8-36d1329e8503.png')] bg-cover bg-fixed overflow-hidden relative">
        <div
          className="absolute inset-0 bg-black/70" />
        
        <div className="relative z-10 h-full px-4 pt-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src="/placeholder.svg" alt="Profile" className="rounded-full w-14 h-14 border-2 border-green-400" />
              <div>
                <div className="text-lg text-white font-semibold">Hi! John</div>
                <div className="text-xs text-white/90">RBI-3-334-2,297-13</div>
              </div>
            </div>
            <div className="rounded-full border-2 border-white p-1">
              <svg width="32" height="32" fill="none" className="text-white" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                <circle cx="8" cy="8" r="1" fill="currentColor"/>
                <circle cx="16" cy="8" r="1" fill="currentColor"/>
                <circle cx="8" cy="16" r="1" fill="currentColor"/>
                <path stroke="currentColor" strokeWidth="2" d="M15.5 15.5h.01"/>
              </svg>
            </div>
          </div>

          <div className="rounded-2xl bg-white/20 backdrop-blur-xl shadow-lg px-5 py-4 mb-6">
            <div className="font-semibold text-lg text-white">Barangay New Cabalan</div>
            <div className="text-xs uppercase opacity-90 mt-1 text-white">
              City of Olongapo, Zambales
            </div>
            <div className="flex justify-between mt-4">
              <div className="text-center">
                <div className="text-xl font-bold text-white">35,000</div>
                <div className="text-xs text-white">Population</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">14</div>
                <div className="text-xs text-white">Puroks</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">45</div>
                <div className="text-xs text-white">Years</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white font-semibold text-lg">Quick Actions</div>
              <Button 
                asChild 
                variant="ghost"
                className="text-white hover:text-white hover:bg-white/10"
              >
                <Link to="/services">More Services →</Link>
              </Button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-4xl">
              {quickActions.map((action, index) => (
                <Link 
                  key={index}
                  to={action.path} 
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/20 backdrop-blur-lg py-5 hover:bg-white/40 transition-all aspect-square"
                >
                  <action.icon className="text-white h-7 w-7" />
                  <span className="text-white text-sm font-medium text-center px-2">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="max-w-4xl">
            <div className="text-white font-semibold mb-2 text-lg">Announcements</div>
            <div className="rounded-2xl bg-white/20 backdrop-blur-xl p-4 mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-white">Barangay Clean-up Drive</span>
                <span className="ml-2 text-xs bg-green-400 text-white px-2 py-0.5 rounded-full font-semibold">New</span>
              </div>
              <div className="text-white/90 text-sm mb-1">
                Join us for the monthly clean-up drive on June 15th at the community center.
              </div>
              <div className="text-xs text-white/70 flex items-center justify-between">
                <span>June 10, 2025</span>
                <span className="underline underline-offset-2">Read more</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
