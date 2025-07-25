
import { useIsMobile } from "@/hooks/use-mobile";
import { Layout } from "@/components/layout/Layout";
import { ShoppingCart, Briefcase, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { useResidentProfile } from "@/hooks/use-resident-profile";
import { useRbiForms } from "@/hooks/use-rbi-forms";
import { useRbiAccess } from "@/hooks/use-rbi-access";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ResidentHome() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { profile, isLoading } = useResidentProfile();
  const { rbiForms, isLoading: rbiLoading } = useRbiForms();
  const { hasRbiAccess } = useRbiAccess();
  
  const firstName = profile?.first_name || user?.firstName || "Resident";
  
  // Check RBI completion status
  const hasCompletedRbi = rbiForms && rbiForms.length > 0;
  const approvedRbi = rbiForms?.find(form => form.status === 'approved');
  
  // Display RBI number if approved, otherwise show completion message
  const rbiNumber = approvedRbi?.rbi_number || "Complete RBI to get number";
  
  const avatarUrl = profile?.settings?.avatar_url && typeof profile.settings.address === 'object'
    ? (profile.settings.address as any)?.avatar_url
    : `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.first_name || ''} ${profile?.last_name || ''}` ||
      "/placeholder.svg";
  
  // Use actual barangay data from profile when approved
  const barangayName = approvedRbi && profile?.barangay 
    ? profile.barangay 
    : "Complete RBI Registration";
  const barangayLocation = approvedRbi 
    ? "City of Olongapo, Zambales" 
    : "Select your address to see barangay details";
  const barangayPopulation = approvedRbi ? "35,000" : "—";
  const barangayPuroks = approvedRbi ? "14" : "—";
  const barangayAge = approvedRbi ? "45" : "—";

  // Updated Quick Actions - removed Documents, renamed Market to Marketplace
  const quickActions = [
    { icon: ShoppingCart, label: "Marketplace", path: "/marketplace" },
    { icon: Briefcase, label: "Jobs", path: "/jobs" },
  ];

  // Management Actions for Residents
  const managementActions = [
    { icon: Briefcase, label: "My Jobs", path: "/resident/jobs" },
    { icon: ShoppingCart, label: "My Products", path: "/resident/products" },
  ];

  const handleQuickActionClick = (path: string, e: React.MouseEvent) => {
    if (!hasRbiAccess && (path.includes('/marketplace') || path.includes('/jobs') || path.includes('/services'))) {
      e.preventDefault();
      toast.dismiss(); // Dismiss any existing toasts first
      toast.error("Restricted Access", {
        description: "Submit your RBI form to access these options",
        duration: 4000,
      });
      return false;
    }
    return true;
  };

  return (
    <Layout>
      <Helmet>
        <title>Resident Dashboard - Barangay Management System</title>
      </Helmet>
      <div className="min-h-screen pt-12 bg-[url('https://static.wixstatic.com/media/b17ef9_2fba412130514c60a718736b8cc42bf6~mv2.jpg')] bg-cover bg-fixed overflow-hidden relative">
        <div className="absolute inset-0 bg-black/70" />
        
        <div className="relative z-10 h-full px-4 pt-1 max-w-6xl mx-auto">
          {/* Header with larger icons */}
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
                    <div className={`text-xs text-white/90 ${approvedRbi?.rbi_number ? 'font-bold' : ''}`}>
                      {rbiNumber}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="rounded-full border-2 border-white p-2">
              <svg width="40" height="40" fill="none" className="text-white" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                <circle cx="8" cy="8" r="1" fill="currentColor"/>
                <circle cx="16" cy="8" r="1" fill="currentColor"/>
                <circle cx="8" cy="16" r="1" fill="currentColor"/>
                <path stroke="currentColor" strokeWidth="2" d="M15.5 15.5h.01"/>
              </svg>
            </div>
          </div>

          {/* RBI Progress Section */}
          {!rbiLoading && (
            <div className="rounded-2xl bg-white/20 backdrop-blur-xl shadow-lg px-5 py-3 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasCompletedRbi ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-white font-medium">RBI Registration Complete</span>
                      {approvedRbi && (
                        <Badge className="bg-green-500 text-white">Approved</Badge>
                      )}
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                      <span className="text-white font-medium">Complete RBI Registration</span>
                    </>
                  )}
                </div>
                {!hasCompletedRbi && (
                  <Button 
                    asChild 
                    size="sm"
                    className="bg-resident hover:bg-resident-dark text-white"
                  >
                    <Link to="/rbi-registration">Start RBI</Link>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Barangay Info Section */}
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
                {!hasCompletedRbi && (
                  <div className="text-sm text-yellow-300 mt-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Complete your RBI registration to see your barangay details
                  </div>
                )}
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

          {/* Quick Actions */}
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
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 max-w-4xl">
              {quickActions.map((action, index) => (
                <Link 
                  key={index}
                  to={action.path} 
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/20 backdrop-blur-lg py-5 hover:bg-white/40 transition-all aspect-square"
                  onClick={(e) => handleQuickActionClick(action.path, e)}
                >
                  <action.icon className="text-white h-7 w-7" />
                  <span className="text-white text-sm font-medium text-center px-2">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Management Actions */}
          {hasRbiAccess && (
            <div className="mb-4">
              <div className="text-white font-semibold text-lg mb-3">Management</div>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                {managementActions.map((action, index) => (
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
          )}

          {/* Announcements */}
          <div className="max-w-4xl pb-24">
            <div className="text-white font-semibold mb-2 text-lg">Announcements</div>
            <div className="rounded-2xl bg-white/20 backdrop-blur-xl p-4 mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-white">Barangay Clean-up Drive</span>
                <span className="ml-2 text-xs bg-green-400 text-white px-2 py-0.5 rounded-full font-semibold">New</span>
              </div>
              <div className="text-white/90 text-sm mb-1">
                Join us for the monthly clean-up drive on June 15th at the community center. This is a great opportunity for everyone to come together and help maintain the cleanliness and beauty of our barangay. We will provide all necessary cleaning equipment and refreshments will be served after the activity.
              </div>
              <div className="text-xs text-white/70">
                <span>June 10, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
