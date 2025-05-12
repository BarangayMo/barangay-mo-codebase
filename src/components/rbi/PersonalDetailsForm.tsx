
import { User } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";

const PersonalDetailsForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <User className="text-blue-600 w-6 h-6" />
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
          />
          
          <FloatingInput 
            id="firstName" 
            label="First Name" 
            placeholder=" " 
            className="focus-visible:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FloatingInput 
            id="middleName" 
            label="Middle Name" 
            placeholder=" " 
            className="focus-visible:ring-blue-500"
          />
          
          <FloatingInput 
            id="suffix" 
            label="Suffix (Jr., Sr., III, etc.)" 
            placeholder=" " 
            className="focus-visible:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
