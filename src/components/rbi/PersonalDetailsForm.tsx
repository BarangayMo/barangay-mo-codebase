
import { User } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";

const PersonalDetailsForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Personal Details</h2>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingInput 
            id="lastName" 
            label="Last Name" 
            placeholder=" " 
          />
          
          <FloatingInput 
            id="firstName" 
            label="First Name" 
            placeholder=" " 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingInput 
            id="middleName" 
            label="Middle Name" 
            placeholder=" " 
          />
          
          <FloatingInput 
            id="suffix" 
            label="Suffix (Jr., Sr., III, etc.)" 
            placeholder=" " 
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
