
import { School } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";
import { SelectItem } from "@/components/ui/select";

const EducationDetailsForm = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, education: { ...prev.education, [field]: value } }));
    // Clear error when user selects or types
    if (errors?.education?.[field]) {
      setErrors(prev => ({
        ...prev,
        education: { ...prev.education, [field]: null }
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="bg-blue-100 p-2 rounded-lg">
          <School className="text-blue-600 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Education & Skills</h2>
          <p className="text-sm text-gray-500 mt-1">
            Your educational background and professional capabilities
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        <FloatingSelect 
          id="education" 
          label="Educational Attainment"
          className="focus-visible:ring-blue-500"
          value={formData?.education?.attainment || ""}
          onValueChange={(value) => handleChange("attainment", value)}
          error={errors?.education?.attainment}
        >
          <SelectItem value="elementary">Elementary</SelectItem>
          <SelectItem value="highSchool">High School</SelectItem>
          <SelectItem value="vocational">Vocational</SelectItem>
          <SelectItem value="college">College</SelectItem>
          <SelectItem value="masters">Masters</SelectItem>
          <SelectItem value="doctorate">Doctorate</SelectItem>
        </FloatingSelect>
        
        <FloatingInput 
          id="profession" 
          label="Profession" 
          placeholder=" " 
          className="focus-visible:ring-blue-500"
          value={formData?.education?.profession || ""}
          onChange={(e) => handleChange("profession", e.target.value)}
          error={errors?.education?.profession}
        />
        
        <FloatingInput 
          id="skills" 
          label="Skills" 
          placeholder="Enter your skills (separated by commas)" 
          className="focus-visible:ring-blue-500"
          value={formData?.education?.skills || ""}
          onChange={(e) => handleChange("skills", e.target.value)}
        />
        
        <FloatingSelect 
          id="jobStatus" 
          label="Job Status"
          className="focus-visible:ring-blue-500"
          value={formData?.education?.jobStatus || ""}
          onValueChange={(value) => handleChange("jobStatus", value)}
          error={errors?.education?.jobStatus}
        >
          <SelectItem value="employed">Employed</SelectItem>
          <SelectItem value="unemployed">Unemployed</SelectItem>
          <SelectItem value="freelance">Freelance</SelectItem>
          <SelectItem value="selfEmployed">Self-Employed</SelectItem>
          <SelectItem value="retired">Retired</SelectItem>
        </FloatingSelect>
      </div>
    </div>
  );
};

export default EducationDetailsForm;
