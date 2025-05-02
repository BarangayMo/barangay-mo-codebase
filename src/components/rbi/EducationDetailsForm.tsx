
import { School } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";
import { SelectItem } from "@/components/ui/select";

const EducationDetailsForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <School className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Education & Skills</h2>
      </div>
      
      <div className="space-y-4">
        <FloatingSelect 
          id="education" 
          label="Educational Attainment"
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
        />
        
        <FloatingInput 
          id="skills" 
          label="Skills" 
          placeholder="Enter your skills (separated by commas)" 
        />
        
        <FloatingSelect 
          id="jobStatus" 
          label="Job Status"
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
