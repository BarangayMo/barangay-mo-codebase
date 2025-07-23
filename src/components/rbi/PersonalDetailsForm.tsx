
import { User } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { RbiFormComponentProps } from "@/types/rbi";

const PersonalDetailsForm = ({ formData, setFormData, errors, setErrors }: RbiFormComponentProps) => {
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, personalDetails: { ...prev.personalDetails, [field]: value } }));
    // Clear error when user types
    if (errors?.personalDetails?.[field]) {
      setErrors(prev => ({
        ...prev,
        personalDetails: { ...prev.personalDetails, [field]: null }
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="bg-blue-100 p-2 rounded-lg">
          <User className="text-blue-600 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Personal Details</h2>
          <p className="text-sm text-gray-500 mt-1">
            Provide your basic personal information as it appears on official documents
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FloatingInput 
            id="lastName" 
            label="Last Name" 
            placeholder=" " 
            className="focus-visible:ring-blue-500"
            value={formData?.personalDetails?.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
            error={errors?.personalDetails?.lastName}
          />
          
          <FloatingInput 
            id="firstName" 
            label="First Name" 
            placeholder=" " 
            className="focus-visible:ring-blue-500"
            value={formData?.personalDetails?.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
            error={errors?.personalDetails?.firstName}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FloatingInput 
            id="middleName" 
            label="Middle Name" 
            placeholder=" " 
            className="focus-visible:ring-blue-500"
            value={formData?.personalDetails?.middleName || ""}
            onChange={(e) => handleChange("middleName", e.target.value)}
          />
          
          <FloatingInput 
            id="suffix" 
            label="Suffix (Jr., Sr., III, etc.)" 
            placeholder=" " 
            className="focus-visible:ring-blue-500"
            value={formData?.personalDetails?.suffix || ""}
            onChange={(e) => handleChange("suffix", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
