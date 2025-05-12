
import { Heart } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const HealthDetailsForm = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, health: { ...prev.health, [field]: value } }));
    // Clear error when user types or selects
    if (errors?.health?.[field]) {
      setErrors(prev => ({
        ...prev,
        health: { ...prev.health, [field]: null }
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Heart className="text-blue-600 w-6 h-6" />
        </div>
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
            value={formData?.health?.height || ""}
            onChange={(e) => handleChange("height", e.target.value)}
          />
          
          <FloatingInput 
            id="weight" 
            label="Weight (in kg)" 
            type="number" 
            placeholder=" " 
            className="focus-visible:ring-blue-500"
            value={formData?.health?.weight || ""}
            onChange={(e) => handleChange("weight", e.target.value)}
          />
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <Label className="text-gray-700 font-medium">Do you have health conditions? (Ikaw ba ay may karamdaman?)</Label>
          <RadioGroup 
            value={formData?.health?.hasCondition || "no"} 
            onValueChange={(value) => handleChange("hasCondition", value)}
            className="flex gap-4 pt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="healthConditionYes" className="text-blue-600" />
              <Label htmlFor="healthConditionYes" className="text-gray-700">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="healthConditionNo" className="text-blue-600" />
              <Label htmlFor="healthConditionNo" className="text-gray-700">No</Label>
            </div>
          </RadioGroup>
          {errors?.health?.hasCondition && (
            <p className="text-red-500 text-sm mt-1">{errors.health.hasCondition}</p>
          )}
        </div>
        
        <FloatingTextarea 
          id="healthCondition" 
          label="What is your health condition? (Ano ang iyong karamdaman?)" 
          placeholder=" " 
          className="focus-visible:ring-blue-500"
          value={formData?.health?.condition || ""}
          onChange={(e) => handleChange("condition", e.target.value)}
        />
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <Label className="text-gray-700 font-medium">Do you receive barangay assistance for your condition? (May barangay assistance ba sa iyong karamdaman?)</Label>
          <RadioGroup 
            value={formData?.health?.hasAssistance || "no"} 
            onValueChange={(value) => handleChange("hasAssistance", value)}
            className="flex gap-4 pt-2"
          >
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
