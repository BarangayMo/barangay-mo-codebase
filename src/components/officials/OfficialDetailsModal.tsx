
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Camera, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OfficialData {
  position: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  isCompleted: boolean;
}

interface OfficialDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  official: OfficialData;
  onSave: (data: Partial<OfficialData>) => void;
}

const SUFFIX_OPTIONS = [
  "Jr.",
  "Sr.",
  "II",
  "III",
  "IV",
  "V"
];

const ALL_POSITIONS = [
  "Punong Barangay",
  "Barangay Secretary",
  "Barangay Treasurer",
  "Sangguniang Barangay Member 1",
  "Sangguniang Barangay Member 2",
  "Sangguniang Barangay Member 3",
  "Sangguniang Barangay Member 4",
  "Sangguniang Barangay Member 5",
  "Sangguniang Barangay Member 6",
  "Sangguniang Barangay Member 7",
  "SK Chairperson"
];

export function OfficialDetailsModal({ isOpen, onClose, official, onSave }: OfficialDetailsModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "none",
    position: ""
  });

  console.log('OfficialDetailsModal render:', { isOpen, official, formData });

  useEffect(() => {
    if (official) {
      console.log('OfficialDetailsModal useEffect:', official);
      setFormData({
        firstName: official.firstName || "",
        middleName: official.middleName || "",
        lastName: official.lastName || "",
        suffix: official.suffix || "none",
        position: official.position || ""
      });
    }
  }, [official]);

  const handleSave = async () => {
    console.log('Saving official data:', formData);
    
    // Validate required fields
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast({
        title: "Error",
        description: "First name and last name are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        suffix: formData.suffix === "none" ? "" : formData.suffix,
        isCompleted: true
      };

      // Call the parent's onSave function
      onSave(dataToSave);
      
      toast({
        title: "Success",
        description: "Official details saved successfully",
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving official:', error);
      toast({
        title: "Error",
        description: "Failed to save official details",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    console.log('Input change:', field, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Full Screen Modal */}
      <div 
        className={`fixed inset-0 z-50 flex items-end transition-transform duration-500 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="w-full h-full bg-white flex flex-col animate-in slide-in-from-bottom duration-500">
          {/* Red Header */}
          <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between shrink-0">
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="text-center text-lg font-semibold">Edit Barangay Official</h1>
            <div className="w-6" />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6 max-w-md mx-auto">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-600" />
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Official Details Form */}
              <div className="space-y-6">
                <h3 className="font-semibold text-gray-900 text-lg mb-4">Official Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    className="bg-gray-50 border-gray-200 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middleName" className="text-sm font-medium text-gray-700">
                    Middle Name (Optional)
                  </Label>
                  <Input
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) => handleInputChange('middleName', e.target.value)}
                    placeholder="Enter middle name"
                    className="bg-gray-50 border-gray-200 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    className="bg-gray-50 border-gray-200 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="suffix" className="text-sm font-medium text-gray-700">
                    Suffix (Optional)
                  </Label>
                  <Select value={formData.suffix} onValueChange={(value) => handleInputChange('suffix', value)}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 h-12">
                      <SelectValue placeholder="Select suffix..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {SUFFIX_OPTIONS.map((suffix) => (
                        <SelectItem key={suffix} value={suffix}>
                          {suffix}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                    Position *
                  </Label>
                  <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_POSITIONS.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Bottom Action Buttons */}
          <div className="p-6 border-t bg-white shrink-0">
            <div className="flex space-x-3 max-w-md mx-auto">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1 border-gray-300 h-12"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12"
                disabled={!formData.firstName.trim() || !formData.lastName.trim()}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
