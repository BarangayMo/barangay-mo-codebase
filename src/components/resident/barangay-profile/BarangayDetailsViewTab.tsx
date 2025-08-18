import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface BarangayData {
  BARANGAY: string;
  "Mobile Number": string;
  "Telephone No": string;
  "Email Address": string;
  Website: string;
  Facebook: string;
  Population: string;
  "Foundation Date": string;
  "Land Area": string;
  Logo: string;
  Division: string;
  "No of Divisions": string;
  "Fire Department Phone": string;
  "Local Police Contact": string;
  "VAWC Hotline No": string;
  "BPAT Phone": string;
}

export const BarangayDetailsViewTab = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [barangayData, setBarangayData] = useState<BarangayData | null>(null);

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
      setBarangayData(data);
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
              <h3 className="font-medium mb-2 text-lg">Basic Information</h3>
              <div className="grid gap-4">
                <div>
                  <Label>Barangay Name</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {barangayData?.BARANGAY || 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>Population</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {barangayData?.Population || 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>Land Area</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {barangayData?.["Land Area"] || 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>Foundation Date</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {barangayData?.["Foundation Date"] || 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>Division</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {barangayData?.Division || 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>Number of Divisions</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {barangayData?.["No of Divisions"] || 'N/A'}
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
              <h3 className="font-medium mb-2 text-lg">Contact Information</h3>
              <div className="grid gap-4">
                <div>
                  <Label>Mobile Number</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {barangayData?.["Mobile Number"] || 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>Telephone Number</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {barangayData?.["Telephone No"] || 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>Email Address</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {barangayData?.["Email Address"] || 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>Website</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {barangayData?.Website || 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>Facebook</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {barangayData?.Facebook || 'N/A'}
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
              <h3 className="font-medium mb-2 text-lg">Emergency Contacts</h3>
              <div className="grid gap-4">
                <div>
                  <Label>Fire Department</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {barangayData?.["Fire Department Phone"] || 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>Local Police</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {barangayData?.["Local Police Contact"] || 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>VAWC Hotline</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {barangayData?.["VAWC Hotline No"] || 'N/A'}
                  </div>
                </div>
                <div>
                  <Label>BPAT</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {barangayData?.["BPAT Phone"] || 'N/A'}
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
