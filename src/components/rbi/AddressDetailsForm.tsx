
import { Home } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";
import { SelectItem } from "@/components/ui/select";

const AddressDetailsForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Home className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Address Details</h2>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingInput 
            id="houseNumber" 
            label="House/Bldg Number" 
            placeholder=" " 
          />
          
          <FloatingInput 
            id="street" 
            label="Street / Kalye" 
            placeholder=" " 
          />
        </div>
        
        <FloatingSelect 
          id="division" 
          label="Division"
        >
          <SelectItem value="division1">Division 1</SelectItem>
          <SelectItem value="division2">Division 2</SelectItem>
          <SelectItem value="division3">Division 3</SelectItem>
        </FloatingSelect>
        
        <FloatingInput 
          id="zone" 
          label="Division/Zone/Sitio/Purok" 
          placeholder=" " 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingInput 
            id="barangay" 
            label="Barangay" 
            placeholder=" " 
          />
          
          <FloatingInput 
            id="residenceSince" 
            label="Residence Since" 
            type="date" 
            placeholder=" " 
          />
        </div>
      </div>
    </div>
  );
};

export default AddressDetailsForm;
