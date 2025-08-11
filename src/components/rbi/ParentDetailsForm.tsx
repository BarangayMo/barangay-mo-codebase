
import { User } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RbiFormComponentProps } from "@/types/rbi";

const ParentDetailsForm = ({ formData, setFormData, errors, setErrors }: RbiFormComponentProps) => {
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, parentDetails: { ...prev.parentDetails, [field]: value } }));
    // Clear error when user types or selects
    if (errors?.parentDetails?.[field]) {
      setErrors(prev => ({
        ...prev,
        parentDetails: { ...prev.parentDetails, [field]: null }
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <User className="text-blue-600 w-6 h-6" />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Parent Details</h2>
          <p className="text-sm text-gray-500 mt-1">
            Information about your parents and family circumstances
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Father's Details */}
        <div>
          <h3 className="text-lg font-medium text-blue-800 mb-3">Father's Details</h3>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatingInput 
                id="fatherLastName" 
                label="Last Name" 
                placeholder=" " 
                className="focus-visible:ring-blue-500"
                value={formData?.parentDetails?.fatherLastName || ""}
                onChange={(e) => handleChange("fatherLastName", e.target.value)}
              />
              
              <FloatingInput 
                id="fatherFirstName" 
                label="First Name" 
                placeholder=" " 
                className="focus-visible:ring-blue-500"
                value={formData?.parentDetails?.fatherFirstName || ""}
                onChange={(e) => handleChange("fatherFirstName", e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatingInput 
                id="fatherMiddleName" 
                label="Middle Name" 
                placeholder=" " 
                className="focus-visible:ring-blue-500"
                value={formData?.parentDetails?.fatherMiddleName || ""}
                onChange={(e) => handleChange("fatherMiddleName", e.target.value)}
              />
              
              <FloatingInput 
                id="fatherSuffix" 
                label="Suffix (Jr., Sr., III, etc.)" 
                placeholder=" " 
                className="focus-visible:ring-blue-500"
                value={formData?.parentDetails?.fatherSuffix || ""}
                onChange={(e) => handleChange("fatherSuffix", e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-blue-800 mb-3">Mother's Details</h3>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatingInput 
                id="motherLastName" 
                label="Last Name" 
                placeholder=" " 
                className="focus-visible:ring-blue-500"
                value={formData?.parentDetails?.motherLastName || ""}
                onChange={(e) => handleChange("motherLastName", e.target.value)}
              />
              
              <FloatingInput 
                id="motherFirstName" 
                label="First Name" 
                placeholder=" " 
                className="focus-visible:ring-blue-500"
                value={formData?.parentDetails?.motherFirstName || ""}
                onChange={(e) => handleChange("motherFirstName", e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatingInput 
                id="motherMiddleName" 
                label="Middle Name" 
                placeholder=" " 
                className="focus-visible:ring-blue-500"
                value={formData?.parentDetails?.motherMiddleName || ""}
                onChange={(e) => handleChange("motherMiddleName", e.target.value)}
              />
              
              <FloatingInput 
                id="parentStatus" 
                label="Parent Status" 
                placeholder=" " 
                className="focus-visible:ring-blue-500"
                value={formData?.parentDetails?.parentStatus || ""}
                onChange={(e) => handleChange("parentStatus", e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <div className="space-y-5">
            <div className="bg-blue-50 p-4 rounded-lg">
              <Label className="text-gray-700 font-medium">Is your father still alive? (Nabubuhay pa ba ang iyong tatay?)</Label>
              <RadioGroup 
                value={formData?.parentDetails?.fatherAlive || "yes"} 
                onValueChange={(value) => handleChange("fatherAlive", value)}
                className="flex gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="fatherAliveYes" className="text-blue-600" />
                  <Label htmlFor="fatherAliveYes" className="text-gray-700">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="fatherAliveNo" className="text-blue-600" />
                  <Label htmlFor="fatherAliveNo" className="text-gray-700">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <Label className="text-gray-700 font-medium">Is your mother still alive? (Nabubuhay pa ba ang iyong nanay?)</Label>
              <RadioGroup 
                value={formData?.parentDetails?.motherAlive || "yes"} 
                onValueChange={(value) => handleChange("motherAlive", value)}
                className="flex gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="motherAliveYes" className="text-blue-600" />
                  <Label htmlFor="motherAliveYes" className="text-gray-700">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="motherAliveNo" className="text-blue-600" />
                  <Label htmlFor="motherAliveNo" className="text-gray-700">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <Label className="text-gray-700 font-medium">Do you own a vehicle? (Ikaw ba ay may sasakyan?)</Label>
              <RadioGroup 
                value={formData?.parentDetails?.hasVehicle || "no"} 
                onValueChange={(value) => handleChange("hasVehicle", value)}
                className="flex gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="vehicleYes" className="text-blue-600" />
                  <Label htmlFor="vehicleYes" className="text-gray-700">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="vehicleNo" className="text-blue-600" />
                  <Label htmlFor="vehicleNo" className="text-gray-700">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <Label className="text-gray-700 font-medium">Do you have a garage? (Ikaw ba ay may Garahe?)</Label>
              <RadioGroup 
                value={formData?.parentDetails?.hasGarage || "no"} 
                onValueChange={(value) => handleChange("hasGarage", value)}
                className="flex gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="garageYes" className="text-blue-600" />
                  <Label htmlFor="garageYes" className="text-gray-700">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="garageNo" className="text-blue-600" />
                  <Label htmlFor="garageNo" className="text-gray-700">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDetailsForm;
