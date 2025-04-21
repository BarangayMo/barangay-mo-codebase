
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home } from "lucide-react";

const AddressDetailsForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Home className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Address Details</h2>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="houseNumber">House/Bldg Number</Label>
            <Input id="houseNumber" placeholder="Enter house or building number" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="street">Street / Kalye</Label>
            <Input id="street" placeholder="Enter street name" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="division">Select Division</Label>
          <Select>
            <SelectTrigger id="division">
              <SelectValue placeholder="Select division" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="division1">Division 1</SelectItem>
              <SelectItem value="division2">Division 2</SelectItem>
              <SelectItem value="division3">Division 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="zone">Division/Zone/Sitio/Purok</Label>
          <Input id="zone" placeholder="Enter zone details" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="barangay">Barangay</Label>
            <Input id="barangay" placeholder="Enter barangay name" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="residenceSince">Residence Since</Label>
            <Input id="residenceSince" type="date" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressDetailsForm;
