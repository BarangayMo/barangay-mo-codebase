
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Camera } from "lucide-react";

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

export function OfficialDetailsModal({ isOpen, onClose, official, onSave }: OfficialDetailsModalProps) {
  const [formData, setFormData] = useState({
    firstName: official.firstName || "",
    middleName: official.middleName || "",
    lastName: official.lastName || "",
    suffix: official.suffix || "",
    position: official.position
  });

  useEffect(() => {
    setFormData({
      firstName: official.firstName || "",
      middleName: official.middleName || "",
      lastName: official.lastName || "",
      suffix: official.suffix || "",
      position: official.position
    });
  }, [official]);

  const handleSave = () => {
    onSave({
      ...formData,
      isCompleted: true
    });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4">
        <DialogHeader className="bg-red-600 text-white -mx-6 -mt-6 px-6 py-4 mb-6">
          <DialogTitle className="text-center">Edit Barangay Official</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-gray-600" />
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                <Camera className="h-3 w-3 text-white" />
              </button>
            </div>
          </div>

          {/* Official Details Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Official Details</h3>
            
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="BILLY JOEL"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="middleName" className="text-sm font-medium text-gray-700">
                Middle Name (Optional)
              </Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                placeholder="TRIMOR"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="CAPISTRANO"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="suffix" className="text-sm font-medium text-gray-700">
                Suffix (Optional)
              </Label>
              <Select value={formData.suffix} onValueChange={(value) => handleInputChange('suffix', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {SUFFIX_OPTIONS.map((suffix) => (
                    <SelectItem key={suffix} value={suffix}>
                      {suffix}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                Position
              </Label>
              <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Punong Barangay">Punong Barangay</SelectItem>
                  <SelectItem value="Barangay Secretary">Barangay Secretary</SelectItem>
                  <SelectItem value="Barangay Treasurer">Barangay Treasurer</SelectItem>
                  <SelectItem value="Sangguniang Barangay Member">Sangguniang Barangay Member</SelectItem>
                  <SelectItem value="SK Chairperson">SK Chairperson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
