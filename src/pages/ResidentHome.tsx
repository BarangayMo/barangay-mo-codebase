import { useIsMobile } from "@/hooks/use-mobile";
import { Layout } from "@/components/layout/Layout";
import { ShoppingCart, Briefcase, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResidentHome() {
  const isMobile = useIsMobile();

  return (
    <Layout>
      <div
        className="fixed inset-0 min-h-screen"
        style={{
          backgroundImage: 'url("/lovable-uploads/c18ab531-de58-47d3-a486-6d9882bc2559.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 h-screen overflow-y-auto px-4 pt-6 pb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src="/placeholder.svg" alt="Profile" className="rounded-full w-14 h-14 border-2 border-green-400" />
              <div>
                <div className="text-lg text-white font-semibold">Hi! John</div>
                <div className="text-xs text-white/90">RBI-3-334-2,297-13</div>
              </div>
            </div>
            <div className="rounded-full border-2 border-white p-1">
              <svg width="32" height="32" fill="none" className="text-white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><circle cx="8" cy="8" r="1" fill="currentColor"/><circle cx="16" cy="8" r="1" fill="currentColor"/><circle cx="8" cy="16" r="1" fill="currentColor"/><path stroke="currentColor" strokeWidth="2" d="M15.5 15.5h.01"/></svg>
            </div>
          </div>

          <div className="rounded-2xl bg-white/20 backdrop-blur-xl shadow-lg px-5 py-4 mb-6 flex flex-row items-center justify-between text-white">
            <div>
              <div className="font-semibold text-lg">Barangay New Cabalan</div>
              <div className="text-xs uppercase opacity-90 mt-1">
                City of Olongapo, Zambales
              </div>
              <div className="flex gap-6 mt-4">
                <div>
                  <div className="text-xl font-bold">35,000</div>
                  <div className="text-xs">Population</div>
                </div>
                <div>
                  <div className="text-xl font-bold">14</div>
                  <div className="text-xs">Puroks</div>
                </div>
                <div>
                  <div className="text-xl font-bold">45</div>
                  <div className="text-xs">Years</div>
                </div>
              </div>
            </div>
            <img src="/lovable-uploads/2cc58007-fc42-44a8-80a5-ef6765602013.png" alt="Brgy icon" className="rounded-full w-12 h-12 border ml-4 hidden sm:block" />
          </div>

          <div>
            <div className="text-white font-semibold mb-2 text-lg">Quick Actions</div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Link to="/marketplace" className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/20 backdrop-blur-lg py-5 hover:bg-white/40 transition-all">
                <ShoppingCart className="text-white h-7 w-7" />
                <span className="text-white text-sm font-medium">Market</span>
              </Link>
              <Link to="/jobs" className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/20 backdrop-blur-lg py-5 hover:bg-white/40 transition-all">
                <Briefcase className="text-white h-7 w-7" />
                <span className="text-white text-sm font-medium">Jobs</span>
              </Link>
              <Link to="/community" className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/20 backdrop-blur-lg py-5 hover:bg-white/40 transition-all">
                <Users className="text-white h-7 w-7" />
                <span className="text-white text-sm font-medium">Community</span>
              </Link>
            </div>
          </div>

          <div>
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
