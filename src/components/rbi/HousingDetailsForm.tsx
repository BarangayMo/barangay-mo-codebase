
import { Home } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const HousingDetailsForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Home className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Housing Details</h2>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-base">Are you the head of the family? (Ikaw ba ang namumuno o head sa tinitirahan?)</Label>
          <RadioGroup defaultValue="yes" className="flex gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="headYes" />
              <Label htmlFor="headYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="headNo" />
              <Label htmlFor="headNo">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        <FloatingInput 
          id="headName" 
          label="Name of the head of the household" 
          placeholder="Enter name of household head" 
        />
        
        <div className="space-y-2">
          <Label className="text-base">Are you renting? (Ikaw ba ay umuupa sa tinitirahan?)</Label>
          <RadioGroup defaultValue="no" className="flex gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="rentingYes" />
              <Label htmlFor="rentingYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="rentingNo" />
              <Label htmlFor="rentingNo">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label className="text-base">Is the property privately owned or company-owned?</Label>
          <RadioGroup defaultValue="private" className="flex gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="privateOwned" />
              <Label htmlFor="privateOwned">Private</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="company" id="companyOwned" />
              <Label htmlFor="companyOwned">Company</Label>
            </div>
          </RadioGroup>
        </div>
        
        <FloatingInput 
          id="ownerName" 
          label="Who is the owner of the residence?" 
          placeholder="Enter name of the property owner" 
        />
        
        <FloatingInput 
          id="companyName" 
          label="Name of the company" 
          placeholder="Enter company name if applicable" 
        />
      </div>
    </div>
  );
};

export default HousingDetailsForm;
