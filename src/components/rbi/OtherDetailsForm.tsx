
import { Calendar, Info } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";
import { SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RbiFormComponentProps } from "@/types/rbi";

const OtherDetailsForm = ({ formData, setFormData, errors, setErrors }: RbiFormComponentProps) => {
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, otherDetails: { ...prev.otherDetails, [field]: value } }));
    // Clear error when user types or selects
    if (errors?.otherDetails?.[field]) {
      setErrors(prev => ({
        ...prev,
        otherDetails: { ...prev.otherDetails, [field]: null }
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <Info className="text-blue-600 w-6 h-6" />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Other Details</h2>
          <p className="text-sm text-gray-500 mt-1">
            Additional personal information for identification purposes
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FloatingInput 
            id="dateOfBirth" 
            label="Date of Birth" 
            type="date" 
            placeholder=" " 
            icon={<Calendar className="text-blue-500 w-5 h-5" />}
            className="focus-visible:ring-blue-500"
            value={formData?.otherDetails?.dateOfBirth || ""}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            error={errors?.otherDetails?.dateOfBirth}
          />
          
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Sex</Label>
            <RadioGroup 
              value={formData?.otherDetails?.sex || "male"}
              onValueChange={(value) => handleChange("sex", value)}
              className="flex gap-4 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" className="text-blue-600" />
                <Label htmlFor="male" className="text-gray-700">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" className="text-blue-600" />
                <Label htmlFor="female" className="text-gray-700">Female</Label>
              </div>
            </RadioGroup>
            {errors?.otherDetails?.sex && (
              <p className="text-red-500 text-sm">{errors.otherDetails.sex}</p>
            )}
          </div>
        </div>
        
        <FloatingInput 
          id="placeOfBirth" 
          label="Place of Birth" 
          placeholder="City, Province, Country" 
          className="focus-visible:ring-blue-500"
          value={formData?.otherDetails?.placeOfBirth || ""}
          onChange={(e) => handleChange("placeOfBirth", e.target.value)}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FloatingSelect 
            id="bloodType" 
            label="Blood Type"
            placeholder="Please Select Blood Type"
            className="focus-visible:ring-blue-500"
            value={formData?.otherDetails?.bloodType || ""}
            onValueChange={(value) => handleChange("bloodType", value)}
          >
            <SelectItem value="A+">A+</SelectItem>
            <SelectItem value="A-">A-</SelectItem>
            <SelectItem value="B+">B+</SelectItem>
            <SelectItem value="B-">B-</SelectItem>
            <SelectItem value="AB+">AB+</SelectItem>
            <SelectItem value="AB-">AB-</SelectItem>
            <SelectItem value="O+">O+</SelectItem>
            <SelectItem value="O-">O-</SelectItem>
          </FloatingSelect>
          
          <FloatingInput 
            id="religion" 
            label="Religion" 
            placeholder=" " 
            className="focus-visible:ring-blue-500"
            value={formData?.otherDetails?.religion || ""}
            onChange={(e) => handleChange("religion", e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FloatingSelect 
            id="civilStatus" 
            label="Civil Status"
            placeholder="Please Select Your Civil Status"
            className="focus-visible:ring-blue-500"
            value={formData?.otherDetails?.civilStatus || ""}
            onValueChange={(value) => handleChange("civilStatus", value)}
          >
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="married">Married</SelectItem>
            <SelectItem value="divorced">Divorced</SelectItem>
            <SelectItem value="widowed">Widowed</SelectItem>
            <SelectItem value="separated">Separated</SelectItem>
          </FloatingSelect>
          
          <FloatingInput 
            id="contactNumber" 
            label="Contact Number" 
            placeholder="+63 XXX XXX XXXX" 
            className="focus-visible:ring-blue-500"
            value={formData?.otherDetails?.contactNumber || ""}
            onChange={(e) => handleChange("contactNumber", e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FloatingInput 
            id="email" 
            label="Email Address" 
            type="email" 
            placeholder="your@email.com" 
            className="focus-visible:ring-blue-500"
            value={formData?.otherDetails?.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          
          <FloatingInput 
            id="nationality" 
            label="Nationality" 
            placeholder=" " 
            defaultValue="Filipino" 
            className="focus-visible:ring-blue-500"
            value={formData?.otherDetails?.nationality || "Filipino"}
            onChange={(e) => handleChange("nationality", e.target.value)}
          />
        </div>
        
        <FloatingInput 
          id="eyeColor" 
          label="Eye Color" 
          placeholder=" " 
          className="focus-visible:ring-blue-500"
          value={formData?.otherDetails?.eyeColor || ""}
          onChange={(e) => handleChange("eyeColor", e.target.value)}
        />
      </div>
    </div>
  );
};

export default OtherDetailsForm;
