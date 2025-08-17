import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save, X } from "lucide-react";
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
}

export const BarangayAddressTab = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
          Coordinates
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

  const handleSave = async () => {
    if (!editedData || !user?.barangay) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('Barangays')
        .update(editedData)
        .eq('BARANGAY', user.barangay);

      if (error) throw error;

      setAddressData(editedData);
      setIsEditing(false);
      toast.success('Address details updated successfully');
    } catch (error) {
      console.error('Error updating address data:', error);
      toast.error('Failed to update address details');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(addressData);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof BarangayAddressData, value: string) => {
    if (!editedData) return;
    setEditedData({ ...editedData, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!addressData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No address data found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Barangay Address</CardTitle>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="text-white"
              >
                <Save className="w-4 h-4 mr-1" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit Address
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="barangay">Barangay</Label>
            <Input
              id="barangay"
              value={editedData?.BARANGAY || ""}
              onChange={(e) => handleInputChange("BARANGAY", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="municipality">City/Municipality</Label>
            <Input
              id="municipality"
              value={editedData?.["CITY/MUNICIPALITY"] || ""}
              onChange={(e) => handleInputChange("CITY/MUNICIPALITY", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="province">Province</Label>
            <Input
              id="province"
              value={editedData?.PROVINCE || ""}
              onChange={(e) => handleInputChange("PROVINCE", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              value={editedData?.REGION || ""}
              onChange={(e) => handleInputChange("REGION", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip-code">ZIP Code</Label>
            <Input
              id="zip-code"
              value={editedData?.["ZIP Code"] || ""}
              onChange={(e) => handleInputChange("ZIP Code", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Street</Label>
            <Input
              id="street"
              value={editedData?.Street || ""}
              onChange={(e) => handleInputChange("Street", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="building-no">Building Number</Label>
            <Input
              id="building-no"
              value={editedData?.["BLDG No"] || ""}
              onChange={(e) => handleInputChange("BLDG No", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coordinates">Coordinates</Label>
            <Input
              id="coordinates"
              value={editedData?.Coordinates || ""}
              onChange={(e) => handleInputChange("Coordinates", e.target.value)}
              disabled={!isEditing}
              placeholder="e.g., 14.5995,120.9842"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};