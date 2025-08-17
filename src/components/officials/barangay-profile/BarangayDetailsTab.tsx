import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import { Edit, Save, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
}

export const BarangayDetailsTab = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [barangayData, setBarangayData] = useState<BarangayData | null>(null);
  const [editedData, setEditedData] = useState<BarangayData | null>(null);

  useEffect(() => {
    fetchBarangayData();
  }, [user?.barangay]);

  const fetchBarangayData = async () => {
    if (!user?.barangay) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('Barangays')
        .select(`
          BARANGAY,
          "Mobile Number",
          "Telephone No", 
          "Email Address",
          Website,
          Facebook,
          Population,
          "Foundation Date",
          "Land Area"
        `)
        .eq('BARANGAY', user.barangay)
        .single();

      if (error) throw error;
      
      setBarangayData(data);
      setEditedData(data);
    } catch (error) {
      console.error('Error fetching barangay data:', error);
      toast.error('Failed to load barangay details');
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

      setBarangayData(editedData);
      setIsEditing(false);
      toast.success('Barangay details updated successfully');
    } catch (error) {
      console.error('Error updating barangay data:', error);
      toast.error('Failed to update barangay details');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(barangayData);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof BarangayData, value: string) => {
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

  if (!barangayData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No barangay data found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Barangay Details</CardTitle>
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
              Edit Details
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="barangay-name">Barangay Name</Label>
            <Input
              id="barangay-name"
              value={editedData?.BARANGAY || ""}
              onChange={(e) => handleInputChange("BARANGAY", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mobile-number">Mobile Number</Label>
            <Input
              id="mobile-number"
              value={editedData?.["Mobile Number"] || ""}
              onChange={(e) => handleInputChange("Mobile Number", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone">Telephone Number</Label>
            <Input
              id="telephone"
              value={editedData?.["Telephone No"] || ""}
              onChange={(e) => handleInputChange("Telephone No", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={editedData?.["Email Address"] || ""}
              onChange={(e) => handleInputChange("Email Address", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={editedData?.Website || ""}
              onChange={(e) => handleInputChange("Website", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook Page</Label>
            <Input
              id="facebook"
              value={editedData?.Facebook || ""}
              onChange={(e) => handleInputChange("Facebook", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="population">Population</Label>
            <Input
              id="population"
              value={editedData?.Population || ""}
              onChange={(e) => handleInputChange("Population", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="foundation-date">Foundation Date</Label>
            <Input
              id="foundation-date"
              value={editedData?.["Foundation Date"] || ""}
              onChange={(e) => handleInputChange("Foundation Date", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="land-area">Land Area</Label>
            <Input
              id="land-area"
              value={editedData?.["Land Area"] || ""}
              onChange={(e) => handleInputChange("Land Area", e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};