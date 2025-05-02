
import { Heart } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const HealthDetailsForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Health Details</h2>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingInput 
            id="height" 
            label="Height (in cm)" 
            type="number" 
            placeholder=" " 
          />
          
          <FloatingInput 
            id="weight" 
            label="Weight (in kg)" 
            type="number" 
            placeholder=" " 
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-base">Do you have health conditions? (Ikaw ba ay may karamdaman?)</Label>
          <RadioGroup defaultValue="no" className="flex gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="healthConditionYes" />
              <Label htmlFor="healthConditionYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="healthConditionNo" />
              <Label htmlFor="healthConditionNo">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        <FloatingTextarea 
          id="healthCondition" 
          label="What is your health condition? (Ano ang iyong karamdaman?)" 
          placeholder=" " 
        />
        
        <div className="space-y-2">
          <Label className="text-base">Do you receive barangay assistance for your condition? (May barangay assistance ba sa iyong karamdaman?)</Label>
          <RadioGroup defaultValue="no" className="flex gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="assistanceYes" />
              <Label htmlFor="assistanceYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="assistanceNo" />
              <Label htmlFor="assistanceNo">No</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default HealthDetailsForm;
