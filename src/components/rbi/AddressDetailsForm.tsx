
import { Home } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";
import { SelectItem } from "@/components/ui/select";
import { MapLocationModal } from "@/components/layout/header/MapLocationModal";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useState } from "react";

const AddressDetailsForm = () => {
  const [barangay, setBarangay] = useState("");

  const handleLocationSelected = (location: { barangay: string; coordinates: { lat: number; lng: number } }) => {
    setBarangay(location.barangay);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <Home className="text-blue-600 w-6 h-6" />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Address Details</h2>
          <p className="text-sm text-gray-500 mt-1">
            Provide your current residence details and location within the barangay
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FloatingInput 
            id="houseNumber" 
            label="House/Bldg Number" 
            placeholder=" " 
            className="focus-visible:ring-blue-500"
          />
          
          <FloatingInput 
            id="street" 
            label="Street / Kalye" 
            placeholder=" " 
            className="focus-visible:ring-blue-500"
          />
        </div>
        
        <FloatingSelect 
          id="division" 
          label="Division"
          className="focus-visible:ring-blue-500"
        >
          <SelectItem value="division1">Division 1</SelectItem>
          <SelectItem value="division2">Division 2</SelectItem>
          <SelectItem value="division3">Division 3</SelectItem>
        </FloatingSelect>
        
        <FloatingInput 
          id="zone" 
          label="Division/Zone/Sitio/Purok" 
          placeholder=" " 
          className="focus-visible:ring-blue-500"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <MapLocationModal onLocationSelected={handleLocationSelected}>
              <Button 
                type="button" 
                variant="outline"
                className="w-full flex items-center justify-between gap-2 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  {barangay || "Select Your Barangay"}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Choose on Map
                </span>
              </Button>
            </MapLocationModal>
            <p className="text-xs text-gray-500 ml-1">Click to select your barangay using the map</p>
          </div>
          
          <FloatingInput 
            id="residenceSince" 
            label="Residence Since" 
            type="date" 
            placeholder=" " 
            className="focus-visible:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressDetailsForm;
