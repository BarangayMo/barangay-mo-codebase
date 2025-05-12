
import { Heart } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const HealthDetailsForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <Heart className="text-blue-600 w-6 h-6" />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Health Details</h2>
          <p className="text-sm text-gray-500 mt-1">
            Information about your health status and medical conditions
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FloatingInput 
            id="height" 
            label="Height (in cm)" 
            type="number" 
            placeholder=" " 
            className="focus-visible:ring-blue-500"
          />
          
          <FloatingInput 
            id="weight" 
            label="Weight (in kg)" 
            type="number" 
            placeholder=" " 
            className="focus-visible:ring-blue-500"
          />
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <Label className="text-gray-700 font-medium">Do you have health conditions? (Ikaw ba ay may karamdaman?)</Label>
          <RadioGroup defaultValue="no" className="flex gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="healthConditionYes" className="text-blue-600" />
              <Label htmlFor="healthConditionYes" className="text-gray-700">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="healthConditionNo" className="text-blue-600" />
              <Label htmlFor="healthConditionNo" className="text-gray-700">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        <FloatingTextarea 
          id="healthCondition" 
          label="What is your health condition? (Ano ang iyong karamdaman?)" 
          placeholder=" " 
          className="focus-visible:ring-blue-500"
        />
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <Label className="text-gray-700 font-medium">Do you receive barangay assistance for your condition? (May barangay assistance ba sa iyong karamdaman?)</Label>
          <RadioGroup defaultValue="no" className="flex gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="assistanceYes" className="text-blue-600" />
              <Label htmlFor="assistanceYes" className="text-gray-700">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="assistanceNo" className="text-blue-600" />
              <Label htmlFor="assistanceNo" className="text-gray-700">No</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default HealthDetailsForm;
