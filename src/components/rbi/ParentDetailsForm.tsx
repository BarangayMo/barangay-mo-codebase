
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User } from "lucide-react";

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
              <div className="space-y-2">
                <Label htmlFor="fatherLastName">Last Name</Label>
                <Input id="fatherLastName" placeholder="Enter father's last name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fatherFirstName">First Name</Label>
                <Input id="fatherFirstName" placeholder="Enter father's first name" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fatherMiddleName">Middle Name</Label>
                <Input id="fatherMiddleName" placeholder="Enter father's middle name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fatherSuffix">Suffix</Label>
                <Input id="fatherSuffix" placeholder="Jr., Sr., III, etc. (optional)" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-3">Mother's Details</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="motherLastName">Last Name</Label>
                <Input id="motherLastName" placeholder="Enter mother's last name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="motherFirstName">First Name</Label>
                <Input id="motherFirstName" placeholder="Enter mother's first name" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="motherMiddleName">Middle Name</Label>
                <Input id="motherMiddleName" placeholder="Enter mother's middle name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="motherLastName">Parent Status</Label>
                <Input id="parentStatus" placeholder="Married, Separated, etc." />
              </div>
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
