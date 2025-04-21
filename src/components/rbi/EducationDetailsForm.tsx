
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { School } from "lucide-react";

const EducationDetailsForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <School className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Education & Skills</h2>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="education">Educational Attainment</Label>
          <Select>
            <SelectTrigger id="education">
              <SelectValue placeholder="Select highest education" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="elementary">Elementary</SelectItem>
              <SelectItem value="highSchool">High School</SelectItem>
              <SelectItem value="vocational">Vocational</SelectItem>
              <SelectItem value="college">College</SelectItem>
              <SelectItem value="masters">Masters</SelectItem>
              <SelectItem value="doctorate">Doctorate</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="profession">Profession</Label>
          <Input id="profession" placeholder="Enter your profession" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="skills">Skills</Label>
          <Input id="skills" placeholder="Enter your skills (separated by commas)" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="jobStatus">Job Status</Label>
          <Select>
            <SelectTrigger id="jobStatus">
              <SelectValue placeholder="Select job status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employed">Employed</SelectItem>
              <SelectItem value="unemployed">Unemployed</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
              <SelectItem value="selfEmployed">Self-Employed</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default EducationDetailsForm;
