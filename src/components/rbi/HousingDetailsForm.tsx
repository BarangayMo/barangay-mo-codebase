
import { Home } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const HousingDetailsForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <Home className="text-blue-600 w-6 h-6" />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Housing Details</h2>
          <p className="text-sm text-gray-500 mt-1">
            Information about your living situation and residence ownership
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <Label className="text-gray-700 font-medium">Are you the head of the family? (Ikaw ba ang namumuno o head sa tinitirahan?)</Label>
          <RadioGroup defaultValue="yes" className="flex gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="headYes" className="text-blue-600" />
              <Label htmlFor="headYes" className="text-gray-700">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="headNo" className="text-blue-600" />
              <Label htmlFor="headNo" className="text-gray-700">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        <FloatingInput 
          id="headName" 
          label="Name of the head of the household" 
          placeholder="Enter name of household head" 
          className="focus-visible:ring-blue-500"
        />
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <Label className="text-gray-700 font-medium">Are you renting? (Ikaw ba ay umuupa sa tinitirahan?)</Label>
          <RadioGroup defaultValue="no" className="flex gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="rentingYes" className="text-blue-600" />
              <Label htmlFor="rentingYes" className="text-gray-700">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="rentingNo" className="text-blue-600" />
              <Label htmlFor="rentingNo" className="text-gray-700">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <Label className="text-gray-700 font-medium">Is the property privately owned or company-owned?</Label>
          <RadioGroup defaultValue="private" className="flex gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="privateOwned" className="text-blue-600" />
              <Label htmlFor="privateOwned" className="text-gray-700">Private</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="company" id="companyOwned" className="text-blue-600" />
              <Label htmlFor="companyOwned" className="text-gray-700">Company</Label>
            </div>
          </RadioGroup>
        </div>
        
        <FloatingInput 
          id="ownerName" 
          label="Who is the owner of the residence?" 
          placeholder="Enter name of the property owner" 
          className="focus-visible:ring-blue-500"
        />
        
        <FloatingInput 
          id="companyName" 
          label="Name of the company" 
          placeholder="Enter company name if applicable" 
          className="focus-visible:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default HousingDetailsForm;
