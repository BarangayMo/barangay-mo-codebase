
import { School } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";
import { SelectItem } from "@/components/ui/select";

const EducationDetailsForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <School className="text-blue-600 w-6 h-6" />
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
        />
        
        <FloatingInput 
          id="skills" 
          label="Skills" 
          placeholder="Enter your skills (separated by commas)" 
          className="focus-visible:ring-blue-500"
        />
        
        <FloatingSelect 
          id="jobStatus" 
          label="Job Status"
          className="focus-visible:ring-blue-500"
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
