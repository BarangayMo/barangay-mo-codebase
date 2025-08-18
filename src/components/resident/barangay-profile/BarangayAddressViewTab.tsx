import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface BarangayAddressData {
  ID: string;
  BARANGAY: string;
  "CITY/MUNICIPALITY": string;
  PROVINCE: string;
  REGION: string;
  "ZIP Code": string;
  Street: string;
  "BLDG No": string;
  Coordinates: string;
  "Land Area": string;
  Population: string;
  "Location Pin": string;
}

export const BarangayAddressViewTab = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [addressData, setAddressData] = useState<BarangayAddressData | null>(null);

  useEffect(() => {
    fetchBarangayData();
  }, [user?.barangay]);

  const fetchBarangayData = async () => {
    if (!user?.barangay) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('Barangays')
        .select('*')
        .eq('BARANGAY', user.barangay)
        .single();

      if (error) throw error;
      setAddressData(data);
    } catch (error) {
      console.error('Error fetching barangay data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2 text-lg">Location Information</h3>
              <div className="grid gap-4">
                <div>
                  <Label>Street</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {addressData?.Street || 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>Building Number</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {addressData?.["BLDG No"] || 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>City/Municipality</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {addressData?.["CITY/MUNICIPALITY"] || 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>Province</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {addressData?.PROVINCE || 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>Region</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {addressData?.REGION || 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>ZIP Code</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {addressData?.["ZIP Code"] || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2 text-lg">Geographic Information</h3>
              <div className="grid gap-4">
                <div>
                  <Label>Coordinates</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {addressData?.Coordinates || 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>Location Pin</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {addressData?.["Location Pin"] || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
