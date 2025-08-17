import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface BarangayAddressData {
  BARANGAY: string;
  "CITY/MUNICIPALITY": string;
  PROVINCE: string;
  REGION: string;
  "ZIP Code": string;
  Street: string;
  "BLDG No": string;
  Coordinates: string;
  Website: string;
  "Land Area": string;
  Population: string;
}

export const BarangayAddressTab = () => {
  const { user } = useAuth();
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingOtherInfo, setIsEditingOtherInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isSavingOtherInfo, setIsSavingOtherInfo] = useState(false);
  const [addressData, setAddressData] = useState<BarangayAddressData | null>(null);
  const [editedData, setEditedData] = useState<BarangayAddressData | null>(null);

  useEffect(() => {
    fetchAddressData();
  }, [user?.barangay]);

  const fetchAddressData = async () => {
    if (!user?.barangay) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('Barangays')
        .select(`
          BARANGAY,
          "CITY/MUNICIPALITY",
          PROVINCE,
          REGION,
          "ZIP Code",
          Street,
          "BLDG No",
          Coordinates,
          Website,
          "Land Area",
          Population
        `)
        .eq('BARANGAY', user.barangay)
        .single();

      if (error) throw error;
      
      setAddressData(data);
      setEditedData(data);
    } catch (error) {
      console.error('Error fetching address data:', error);
      toast.error('Failed to load address details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!editedData || !user?.barangay) return;

    try {
      setIsSavingAddress(true);
      const addressUpdate = {
        "BLDG No": editedData["BLDG No"],
        Street: editedData.Street,
        "ZIP Code": editedData["ZIP Code"]
      };
      
      const { error } = await supabase
        .from('Barangays')
        .update(addressUpdate)
        .eq('BARANGAY', user.barangay);

      if (error) throw error;

      setAddressData({ ...addressData!, ...addressUpdate });
      setIsEditingAddress(false);
      toast.success('Address details updated successfully');
    } catch (error) {
      console.error('Error updating address data:', error);
      toast.error('Failed to update address details');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleSaveOtherInfo = async () => {
    if (!editedData || !user?.barangay) return;

    try {
      setIsSavingOtherInfo(true);
      const otherInfoUpdate = {
        Website: editedData.Website,
        BARANGAY: editedData.BARANGAY,
        Coordinates: editedData.Coordinates,
        "Land Area": editedData["Land Area"],
        Population: editedData.Population
      };
      
      const { error } = await supabase
        .from('Barangays')
        .update(otherInfoUpdate)
        .eq('BARANGAY', user.barangay);

      if (error) throw error;

      setAddressData({ ...addressData!, ...otherInfoUpdate });
      setIsEditingOtherInfo(false);
      toast.success('Other information updated successfully');
    } catch (error) {
      console.error('Error updating other information:', error);
      toast.error('Failed to update other information');
    } finally {
      setIsSavingOtherInfo(false);
    }
  };

  const handleCancelAddress = () => {
    setEditedData(addressData);
    setIsEditingAddress(false);
  };

  const handleCancelOtherInfo = () => {
    setEditedData(addressData);
    setIsEditingOtherInfo(false);
  };

  const handleInputChange = (field: keyof BarangayAddressData, value: string) => {
    if (!editedData) return;
    setEditedData({ ...editedData, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!addressData) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground text-center">No address data found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 max-w-2xl mx-auto">
      {/* Barangay Address Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Barangay Address</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bldg-no" className="text-sm font-medium text-gray-700">BLDG No</Label>
            <Input
              id="bldg-no"
              value={editedData?.["BLDG No"] || ""}
              onChange={(e) => handleInputChange("BLDG No", e.target.value)}
              disabled={!isEditingAddress}
              className="w-full"
              placeholder="Enter building number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street" className="text-sm font-medium text-gray-700">Street</Label>
            <Input
              id="street"
              value={editedData?.Street || ""}
              onChange={(e) => handleInputChange("Street", e.target.value)}
              disabled={!isEditingAddress}
              className="w-full"
              placeholder="Enter street address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip-code" className="text-sm font-medium text-gray-700">Zip Code</Label>
            <Input
              id="zip-code"
              value={editedData?.["ZIP Code"] || ""}
              onChange={(e) => handleInputChange("ZIP Code", e.target.value)}
              disabled={!isEditingAddress}
              className="w-full"
              placeholder="Enter zip code"
            />
          </div>

          <div className="pt-4">
            {isEditingAddress ? (
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveAddress}
                  disabled={isSavingAddress}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isSavingAddress ? 'Saving...' : 'UPDATE DETAILS'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelAddress}
                  disabled={isSavingAddress}
                  className="px-4"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsEditingAddress(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                UPDATE DETAILS
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Other Info Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first-address" className="text-sm font-medium text-gray-700">First Address</Label>
            <Input
              id="first-address"
              value={editedData?.Website || ""}
              onChange={(e) => handleInputChange("Website", e.target.value)}
              disabled={!isEditingOtherInfo}
              className="w-full"
              placeholder="Enter website"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="barangay-new" className="text-sm font-medium text-gray-700">Barangay New Calabar</Label>
            <Input
              id="barangay-new"
              value={editedData?.BARANGAY || ""}
              onChange={(e) => handleInputChange("BARANGAY", e.target.value)}
              disabled={!isEditingOtherInfo}
              className="w-full"
              placeholder="Enter barangay name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coordinates" className="text-sm font-medium text-gray-700">Coordinates</Label>
            <Input
              id="coordinates"
              value={editedData?.Coordinates || ""}
              onChange={(e) => handleInputChange("Coordinates", e.target.value)}
              disabled={!isEditingOtherInfo}
              className="w-full"
              placeholder="Enter coordinates"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="land-area" className="text-sm font-medium text-gray-700">Land Area</Label>
            <Input
              id="land-area"
              value={editedData?.["Land Area"] || ""}
              onChange={(e) => handleInputChange("Land Area", e.target.value)}
              disabled={!isEditingOtherInfo}
              className="w-full"
              placeholder="Enter land area"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="population" className="text-sm font-medium text-gray-700">Population</Label>
            <Input
              id="population"
              value={editedData?.Population || ""}
              onChange={(e) => handleInputChange("Population", e.target.value)}
              disabled={!isEditingOtherInfo}
              className="w-full"
              placeholder="Enter population"
            />
          </div>

          <div className="pt-4">
            {isEditingOtherInfo ? (
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveOtherInfo}
                  disabled={isSavingOtherInfo}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isSavingOtherInfo ? 'Saving...' : 'UPDATE OTHER INFO'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelOtherInfo}
                  disabled={isSavingOtherInfo}
                  className="px-4"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsEditingOtherInfo(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                UPDATE OTHER INFO
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};