import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModernTabs } from "@/components/dashboard/ModernTabs";
import { MapPin, Users, Settings } from "lucide-react";
import { useBarangayData } from "@/hooks/use-barangay-data";
import { useAuth } from "@/contexts/AuthContext";
import { useRegionOfficials } from "@/hooks/useRegionOfficials";
import { Skeleton } from "@/components/ui/skeleton";
import { BarangayDetailsTab } from "@/components/officials/barangay-profile/BarangayDetailsTab";
import { BarangayAddressTab } from "@/components/officials/barangay-profile/BarangayAddressTab";
import { BarangayCouncilTab } from "@/components/officials/barangay-profile/BarangayCouncilTab";

const BarangayProfile = () => {
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
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Barangay Profile</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-primary">
              {userBarangay || "Your Barangay"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ModernTabs defaultValue="details" items={tabItems}>
              <div className="mt-6">
                <div data-value="details">
                  <BarangayDetailsTab />
                </div>
                
                <div data-value="address">
                  <BarangayAddressTab />
                </div>
                
                <div data-value="council">
                  <BarangayCouncilTab councilMembers={councilMembers || []} />
                </div>
              </div>
            </ModernTabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BarangayProfile;