
import { useIsMobile } from "@/hooks/use-mobile";
import { Layout } from "@/components/layout/Layout";
import { ShoppingCart, Briefcase, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { useResidentProfile } from "@/hooks/use-resident-profile";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResidentHome() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { profile, isLoading } = useResidentProfile();
  
  const firstName = profile?.first_name || user?.firstName || "Resident";
  // Fix: Provide fallback for rbi_number
  const rbiNumber = profile?.settings?.rbi_number || "RBI-3-334-2,297-13";
  // Fix: Type handling for avatar_url in address
  const avatarUrl = profile?.settings?.address && typeof profile.settings.address === 'object'
    ? (profile.settings.address as any)?.avatar_url
    : `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.first_name || ''} ${profile?.last_name || ''}` ||
      "/placeholder.svg";
  
  // Fix: Profile.barangay access - now included in UserProfile interface
  const barangayName = profile?.barangay || "Barangay New Cabalan";
  const barangayLocation = "City of Olongapo, Zambales";
  const barangayPopulation = "35,000";
  const barangayPuroks = "14";
  const barangayAge = "45";

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
      <div className="min-h-screen pt-16 bg-[url('https://static.wixstatic.com/media/b17ef9_2fba412130514c60a718736b8cc42bf6~mv2.jpg')] bg-cover bg-fixed overflow-hidden relative">
        <div className="absolute inset-0 bg-black/70" />
        
        <div className="relative z-10 h-full px-4 pt-2 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {isLoading ? (
                <Skeleton className="rounded-full w-16 h-16" />
              ) : (
                <img src={avatarUrl} alt="Profile" className="rounded-full w-16 h-16 border-2 border-green-400" />
              )}
              <div>
                {isLoading ? (
                  <>
                    <Skeleton className="h-6 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </>
                ) : (
                  <>
                    <div className="text-lg text-white font-semibold">Hi! {firstName}</div>
                    <div className="text-xs text-white/90">{rbiNumber}</div>
                  </>
                )}
              </div>
            </div>
            <div className="rounded-full border-2 border-white p-1">
              <svg width="36" height="36" fill="none" className="text-white" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                <circle cx="8" cy="8" r="1" fill="currentColor"/>
                <circle cx="16" cy="8" r="1" fill="currentColor"/>
                <circle cx="8" cy="16" r="1" fill="currentColor"/>
                <path stroke="currentColor" strokeWidth="2" d="M15.5 15.5h.01"/>
              </svg>
            </div>
          </div>

          <div className="rounded-2xl bg-white/20 backdrop-blur-xl shadow-lg px-5 py-4 mb-4">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-36" />
                <div className="h-6"></div>
                <div className="flex justify-between">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>
            ) : (
              <>
                <div className="font-semibold text-lg text-white">{barangayName}</div>
                <div className="text-xs uppercase opacity-90 mt-1 text-white">
                  {barangayLocation}
                </div>
                <div className="flex justify-between mt-3">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{barangayPopulation}</div>
                    <div className="text-xs text-white">Population</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{barangayPuroks}</div>
                    <div className="text-xs text-white">Puroks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{barangayAge}</div>
                    <div className="text-xs text-white">Years</div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
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

          <div className="max-w-4xl pb-24">
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
