import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Settings } from "lucide-react";
import { useBarangayData } from "@/hooks/use-barangay-data";
import { useAuth } from "@/contexts/AuthContext";
import { useRegionOfficials } from "@/hooks/useRegionOfficials";
import { Skeleton } from "@/components/ui/skeleton";
import { BarangayDetailsTab } from "@/components/officials/barangay-profile/BarangayDetailsTab";
import { BarangayAddressTab } from "@/components/officials/barangay-profile/BarangayAddressTab";
import { BarangayCouncilTab } from "@/components/officials/barangay-profile/BarangayCouncilTab";

const BarangayProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { barangays, isLoading: barangaysLoading } = useBarangayData();
  const userBarangay = user?.barangay;
  const userRegion = user?.region;

  const { data: councilMembers, isLoading: councilLoading } = useRegionOfficials(
    userBarangay,
    userRegion
  );

  const tabItems = [
    {
      value: "details",
      label: "Details",
      icon: <Settings className="w-4 h-4" />
    },
    {
      value: "address",
      label: "Address", 
      icon: <MapPin className="w-4 h-4" />
    },
    {
      value: "council",
      label: "Council",
      icon: <Users className="w-4 h-4" />
    }
  ];

  if (barangaysLoading || councilLoading) {
    return (
      <Layout>
        <div className="space-y-6 p-6">
          <Skeleton className="h-8 w-48" />
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-red-600 text-white p-4">
          <div className="flex items-center px-4">
            <button 
              onClick={() => navigate("/official-dashboard")} 
              className="mr-4 p-1"
            >
              ←
            </button>
            <h1 className="text-lg font-semibold">Barangay Profile</h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center space-x-4 p-4">
              {tabItems.map((tab) => (
                <a
                  key={tab.value}
                  href={`#${tab.value}`}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto">
          <div id="details" className="scroll-mt-20">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <BarangayDetailsTab />
            </div>
          </div>

          <div id="address" className="scroll-mt-20">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Address</h2>
              <BarangayAddressTab />
            </div>
          </div>

          <div id="council" className="scroll-mt-20">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Council</h2>
              <BarangayCouncilTab />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BarangayProfile;
