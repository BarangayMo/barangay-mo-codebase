
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Heart } from "lucide-react";

const HealthDetailsForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Health Details</h2>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">Height (in cm)</Label>
            <Input id="height" type="number" placeholder="Enter height in cm" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (in kg)</Label>
            <Input id="weight" type="number" placeholder="Enter weight in kg" />
          </div>
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
        
        <div className="space-y-2">
          <Label htmlFor="healthCondition">What is your health condition? (Ano ang iyong karamdaman?)</Label>
          <Textarea id="healthCondition" placeholder="Please describe your health condition" />
        </div>
        
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
