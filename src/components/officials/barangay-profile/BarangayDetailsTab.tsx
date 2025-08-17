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

export const BarangayDetailsTab = () => {
  const { user } = useAuth();
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingContacts, setIsEditingContacts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [isSavingContacts, setIsSavingContacts] = useState(false);
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
          "Land Area",
          Logo,
          Division,
          "No of Divisions",
          "Fire Department Phone",
          "Local Police Contact",
          "VAWC Hotline No",
          "BPAT Phone"
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

  const handleSaveDetails = async () => {
    if (!editedData || !user?.barangay) return;

    try {
      setIsSavingDetails(true);
      const detailsUpdate = {
        "Mobile Number": editedData["Mobile Number"],
        Logo: editedData.Logo,
        "Telephone No": editedData["Telephone No"],
        "Foundation Date": editedData["Foundation Date"],
        Division: editedData.Division,
        "No of Divisions": editedData["No of Divisions"]
      };
      
      const { error } = await supabase
        .from('Barangays')
        .update(detailsUpdate)
        .eq('BARANGAY', user.barangay);

      if (error) throw error;

      setBarangayData({ ...barangayData!, ...detailsUpdate });
      setIsEditingDetails(false);
      toast.success('Barangay details updated successfully');
    } catch (error) {
      console.error('Error updating barangay details:', error);
      toast.error('Failed to update barangay details');
    } finally {
      setIsSavingDetails(false);
    }
  };

  const handleSaveContacts = async () => {
    if (!editedData || !user?.barangay) return;

    try {
      setIsSavingContacts(true);
      const contactsUpdate = {
        "Fire Department Phone": editedData["Fire Department Phone"],
        "BPAT Phone": editedData["BPAT Phone"],
        "Local Police Contact": editedData["Local Police Contact"],
        "VAWC Hotline No": editedData["VAWC Hotline No"]
      };
      
      const { error } = await supabase
        .from('Barangays')
        .update(contactsUpdate)
        .eq('BARANGAY', user.barangay);

      if (error) throw error;

      setBarangayData({ ...barangayData!, ...contactsUpdate });
      setIsEditingContacts(false);
      toast.success('Emergency contacts updated successfully');
    } catch (error) {
      console.error('Error updating emergency contacts:', error);
      toast.error('Failed to update emergency contacts');
    } finally {
      setIsSavingContacts(false);
    }
  };

  const handleCancelDetails = () => {
    setEditedData(barangayData);
    setIsEditingDetails(false);
  };

  const handleCancelContacts = () => {
    setEditedData(barangayData);
    setIsEditingContacts(false);
  };

  const handleInputChange = (field: keyof BarangayData, value: string) => {
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

  // Initialize empty data if none exists
  if (!barangayData && !isLoading) {
    const emptyData: BarangayData = {
      BARANGAY: "",
      "Mobile Number": "",
      "Telephone No": "",
      "Email Address": "",
      Website: "",
      Facebook: "",
      Population: "",
      "Foundation Date": "",
      "Land Area": "",
      Logo: "",
      Division: "",
      "No of Divisions": "",
      "Fire Department Phone": "",
      "Local Police Contact": "",
      "VAWC Hotline No": "",
      "BPAT Phone": ""
    };
    setBarangayData(emptyData);
    setEditedData(emptyData);
    return null;
  }

  return (
    <div className="space-y-6 p-4 max-w-2xl mx-auto">
      {/* Barangay Details Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Barangay Details</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mobile-number" className="text-sm font-medium text-gray-700">Mobile Number</Label>
            <Input
              id="mobile-number"
              value={editedData?.["Mobile Number"] || ""}
              onChange={(e) => handleInputChange("Mobile Number", e.target.value)}
              disabled={!isEditingDetails}
              className="w-full"
              placeholder="Enter mobile number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo" className="text-sm font-medium text-gray-700">Logo</Label>
            <Input
              id="logo"
              value={editedData?.Logo || ""}
              onChange={(e) => handleInputChange("Logo", e.target.value)}
              disabled={!isEditingDetails}
              className="w-full"
              placeholder="Enter logo URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone" className="text-sm font-medium text-gray-700">Telephone No</Label>
            <Input
              id="telephone"
              value={editedData?.["Telephone No"] || ""}
              onChange={(e) => handleInputChange("Telephone No", e.target.value)}
              disabled={!isEditingDetails}
              className="w-full"
              placeholder="Enter telephone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="foundation-date" className="text-sm font-medium text-gray-700">Foundation date</Label>
            <Input
              id="foundation-date"
              value={editedData?.["Foundation Date"] || ""}
              onChange={(e) => handleInputChange("Foundation Date", e.target.value)}
              disabled={!isEditingDetails}
              className="w-full"
              placeholder="Enter foundation date"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="division" className="text-sm font-medium text-gray-700">Divisions</Label>
            <Input
              id="division"
              value={editedData?.Division || ""}
              onChange={(e) => handleInputChange("Division", e.target.value)}
              disabled={!isEditingDetails}
              className="w-full"
              placeholder="Enter divisions"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="no-divisions" className="text-sm font-medium text-gray-700">No of Divisions</Label>
            <Input
              id="no-divisions"
              value={editedData?.["No of Divisions"] || ""}
              onChange={(e) => handleInputChange("No of Divisions", e.target.value)}
              disabled={!isEditingDetails}
              className="w-full"
              placeholder="Enter number of divisions"
            />
          </div>

          <div className="pt-4">
            {isEditingDetails ? (
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveDetails}
                  disabled={isSavingDetails}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isSavingDetails ? 'Saving...' : 'UPDATE DETAILS'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelDetails}
                  disabled={isSavingDetails}
                  className="px-4"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsEditingDetails(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                UPDATE DETAILS
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Contacts Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Emergency Contacts</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fire-dept" className="text-sm font-medium text-gray-700">Fire Department Phone</Label>
            <Input
              id="fire-dept"
              value={editedData?.["Fire Department Phone"] || ""}
              onChange={(e) => handleInputChange("Fire Department Phone", e.target.value)}
              disabled={!isEditingContacts}
              className="w-full"
              placeholder="Enter fire department contact"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doh-phone" className="text-sm font-medium text-gray-700">DOH Phone</Label>
            <Input
              id="doh-phone"
              value={editedData?.["BPAT Phone"] || ""}
              onChange={(e) => handleInputChange("BPAT Phone", e.target.value)}
              disabled={!isEditingContacts}
              className="w-full"
              placeholder="Enter DOH contact"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="police-contact" className="text-sm font-medium text-gray-700">Local Police Contact</Label>
            <Input
              id="police-contact"
              value={editedData?.["Local Police Contact"] || ""}
              onChange={(e) => handleInputChange("Local Police Contact", e.target.value)}
              disabled={!isEditingContacts}
              className="w-full"
              placeholder="Enter local police contact"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vawc-hotline" className="text-sm font-medium text-gray-700">VAWC Hotline No</Label>
            <Input
              id="vawc-hotline"
              value={editedData?.["VAWC Hotline No"] || ""}
              onChange={(e) => handleInputChange("VAWC Hotline No", e.target.value)}
              disabled={!isEditingContacts}
              className="w-full"
              placeholder="Enter VAWC hotline number"
            />
          </div>

          <div className="pt-4">
            {isEditingContacts ? (
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveContacts}
                  disabled={isSavingContacts}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isSavingContacts ? 'Saving...' : 'UPDATE CONTACTS'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelContacts}
                  disabled={isSavingContacts}
                  className="px-4"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsEditingContacts(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                UPDATE CONTACTS
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
