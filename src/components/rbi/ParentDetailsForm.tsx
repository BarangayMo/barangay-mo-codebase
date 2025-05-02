
import { User } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const ParentDetailsForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Parent Details</h2>
      </div>
      
      <div className="space-y-6">
        {/* Father's Details */}
        <div>
          <h3 className="text-lg font-medium mb-3">Father's Details</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatingInput 
                id="fatherLastName" 
                label="Last Name" 
                placeholder=" " 
              />
              
              <FloatingInput 
                id="fatherFirstName" 
                label="First Name" 
                placeholder=" " 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatingInput 
                id="fatherMiddleName" 
                label="Middle Name" 
                placeholder=" " 
              />
              
              <FloatingInput 
                id="fatherSuffix" 
                label="Suffix (Jr., Sr., III, etc.)" 
                placeholder=" " 
              />
            </div>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-3">Mother's Details</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatingInput 
                id="motherLastName" 
                label="Last Name" 
                placeholder=" " 
              />
              
              <FloatingInput 
                id="motherFirstName" 
                label="First Name" 
                placeholder=" " 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatingInput 
                id="motherMiddleName" 
                label="Middle Name" 
                placeholder=" " 
              />
              
              <FloatingInput 
                id="parentStatus" 
                label="Parent Status" 
                placeholder="Married, Separated, etc." 
              />
            </div>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base">Is your father still alive? (Nabubuhay pa ba ang iyong tatay?)</Label>
              <RadioGroup defaultValue="yes" className="flex gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="fatherAliveYes" />
                  <Label htmlFor="fatherAliveYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="fatherAliveNo" />
                  <Label htmlFor="fatherAliveNo">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label className="text-base">Is your mother still alive? (Nabubuhay pa ba ang iyong nanay?)</Label>
              <RadioGroup defaultValue="yes" className="flex gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="motherAliveYes" />
                  <Label htmlFor="motherAliveYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="motherAliveNo" />
                  <Label htmlFor="motherAliveNo">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label className="text-base">Do you own a vehicle? (Ikaw ba ay may sasakyan?)</Label>
              <RadioGroup defaultValue="no" className="flex gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="vehicleYes" />
                  <Label htmlFor="vehicleYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="vehicleNo" />
                  <Label htmlFor="vehicleNo">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label className="text-base">Do you have a garage? (Ikaw ba ay may Garahe?)</Label>
              <RadioGroup defaultValue="no" className="flex gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="garageYes" />
                  <Label htmlFor="garageYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="garageNo" />
                  <Label htmlFor="garageNo">No</Label>
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
