import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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

export const BarangayAddressTab = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const emptyData: BarangayAddressData = {
    ID: "",
    BARANGAY: "",
    "CITY/MUNICIPALITY": "",
    PROVINCE: "",
    REGION: "",
    "ZIP Code": "",
    Street: "",
    "BLDG No": "",
    Coordinates: "",
    "Land Area": "",
    Population: "",
    "Location Pin": ""
  };

  const [addressData, setAddressData] = useState<BarangayAddressData>(emptyData);
  const [editedData, setEditedData] = useState<BarangayAddressData>(emptyData);
  
  const formData = editedData ?? emptyData;

  useEffect(() => {
    fetchAddressData();
  }, [user]);

  const fetchAddressData = async () => {
    if (!user?.barangay) {
      console.log("No barangay in user profile", user);
      return;
    }
    
    try {
      console.log("Fetching data for barangay:", user.barangay);
      
      // Using RPC call instead of direct query
      const { data, error } = await supabase.rpc('get_barangay_by_name', {
        barangay_name: user.barangay
      });

      if (error) {
        console.error("RPC error:", error);
        // Fallback to direct query if RPC fails
        const { data: queryData, error: queryError } = await supabase
          .from("Barangays")
          .select()
          .textSearch('BARANGAY', user.barangay)
          .limit(1)
          .single();
          
        if (queryError) {
          console.error("Query error:", queryError);
          throw queryError;
        }
        
        data = queryData;
      }
      
      console.log("Found barangay data:", data);

      if (error) throw error;

      if (data) {
        console.log("Setting data:", data);
        setAddressData(data);
        setEditedData(data);
      } else {
        console.log("No data found for barangay:", user.barangay);
        // Initialize with empty data but set the barangay
        const initialData = {
          ...emptyData,
          BARANGAY: user.barangay
        };
        setAddressData(initialData);
        setEditedData(initialData);
      }
    } catch (error) {
      console.error("Error fetching address data:", error);
      toast.error("Failed to load address data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof BarangayAddressData, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.barangay) return;

    setIsSaving(true);
    try {
      console.log("Saving data:", editedData);
      
      const dataToUpdate = {
        ...editedData,
        BARANGAY: user.barangay,
        Updated: new Date().toISOString()
      };

      const { error } = await supabase
        .from("Barangays")
        .upsert(dataToUpdate);

      if (error) throw error;

      console.log("Save successful");
      setAddressData(dataToUpdate);
      setIsEditing(false);
      toast.success("Address updated successfully");
      
      // Refresh the data
      fetchAddressData();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to update address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(addressData);
    setIsEditing(false);
  };

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <div className="space-y-6 p-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Location Details</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bldg-no">Building Number</Label>
              <Input 
                id="bldg-no" 
                value={formData["BLDG No"]} 
                onChange={e => handleInputChange("BLDG No", e.target.value)} 
                disabled={!isEditing} 
                placeholder="Enter building number" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Input 
                id="street" 
                value={formData.Street} 
                onChange={e => handleInputChange("Street", e.target.value)} 
                disabled={!isEditing} 
                placeholder="Enter street" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip-code">ZIP Code</Label>
              <Input 
                id="zip-code" 
                value={formData["ZIP Code"]} 
                onChange={e => handleInputChange("ZIP Code", e.target.value)} 
                disabled={!isEditing} 
                placeholder="Enter ZIP code" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City/Municipality</Label>
              <Input 
                id="city" 
                value={formData["CITY/MUNICIPALITY"]} 
                onChange={e => handleInputChange("CITY/MUNICIPALITY", e.target.value)} 
                disabled={!isEditing} 
                placeholder="Enter city/municipality" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Input 
                id="province" 
                value={formData.PROVINCE} 
                onChange={e => handleInputChange("PROVINCE", e.target.value)} 
                disabled={!isEditing} 
                placeholder="Enter province" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input 
                id="region" 
                value={formData.REGION} 
                onChange={e => handleInputChange("REGION", e.target.value)} 
                disabled={!isEditing} 
                placeholder="Enter region" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="coordinates">Coordinates</Label>
            <Input 
              id="coordinates" 
              value={formData.Coordinates} 
              onChange={e => handleInputChange("Coordinates", e.target.value)} 
              disabled={!isEditing} 
              placeholder="Enter coordinates" 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="land-area">Land Area</Label>
              <Input 
                id="land-area" 
                value={formData["Land Area"]} 
                onChange={e => handleInputChange("Land Area", e.target.value)} 
                disabled={!isEditing} 
                placeholder="Enter land area" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="population">Population</Label>
              <Input 
                id="population" 
                value={formData.Population} 
                onChange={e => handleInputChange("Population", e.target.value)} 
                disabled={!isEditing} 
                placeholder="Enter population" 
              />
            </div>
          </div>
          <div className="pt-4">
            {isEditing ? (
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving} 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isSaving ? 'Saving...' : 'UPDATE ADDRESS'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel} 
                  disabled={isSaving} 
                  className="px-4"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)} 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                UPDATE ADDRESS
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
