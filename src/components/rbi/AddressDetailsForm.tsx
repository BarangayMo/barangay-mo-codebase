
import { Home, MapPin } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";
import { SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapLocationModal } from "@/components/layout/header/MapLocationModal";
import { useState } from "react";
import { RbiFormComponentProps } from "@/types/rbi";

const AddressDetailsForm = ({ formData, setFormData, errors, setErrors }: RbiFormComponentProps) => {
  const [selectedBarangay, setSelectedBarangay] = useState(formData?.address?.barangay || "");

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      address: { ...prev.address, [field]: value } 
    }));
    
    // Clear error when user types
    if (errors?.address?.[field]) {
      setErrors(prev => ({
        ...prev,
        address: { ...prev.address, [field]: null }
      }));
    }
  };

  const handleLocationSelected = (location: { barangay: string; coordinates: { lat: number; lng: number } }) => {
    setSelectedBarangay(location.barangay);
    handleChange("barangay", location.barangay);
    handleChange("coordinates", JSON.stringify(location.coordinates));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-start sm:items-center gap-3 pb-3 sm:pb-4 border-b border-gray-100">
        <Home className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6 mt-1 sm:mt-0 flex-shrink-0" />
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Address Details</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Provide your current residence details and location within the barangay
          </p>
        </div>
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
          <FloatingInput 
            id="houseNumber" 
            label="House/Bldg Number" 
            placeholder=" " 
            className="focus-visible:ring-blue-500 text-sm sm:text-base"
            value={formData?.address?.houseNumber || ""}
            onChange={(e) => handleChange("houseNumber", e.target.value)}
            error={errors?.address?.houseNumber}
          />
          
          <FloatingInput 
            id="street" 
            label="Street / Kalye" 
            placeholder=" " 
            className="focus-visible:ring-blue-500 text-sm sm:text-base"
            value={formData?.address?.street || ""}
            onChange={(e) => handleChange("street", e.target.value)}
            error={errors?.address?.street}
          />
        </div>
        
        <FloatingSelect 
          id="division" 
          label="Division"
          className="focus-visible:ring-blue-500"
          value={formData?.address?.division || ""}
          onValueChange={(value) => handleChange("division", value)}
        >
          <SelectItem value="division1">Division 1</SelectItem>
          <SelectItem value="division2">Division 2</SelectItem>
          <SelectItem value="division3">Division 3</SelectItem>
        </FloatingSelect>
        
        <FloatingInput 
          id="zone" 
          label="Division/Zone/Sitio/Purok" 
          placeholder=" " 
          className="focus-visible:ring-blue-500 text-sm sm:text-base"
          value={formData?.address?.zone || ""}
          onChange={(e) => handleChange("zone", e.target.value)}
        />
        
        <div className="space-y-3">
          <FloatingInput 
            id="barangay" 
            label="Barangay" 
            placeholder=" " 
            className="focus-visible:ring-blue-500 text-sm sm:text-base"
            value={formData?.address?.barangay || ""}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedBarangay(value);
              handleChange("barangay", value);
            }}
            error={errors?.address?.barangay}
          />
          
          <div className="flex justify-center">
            <MapLocationModal onLocationSelected={handleLocationSelected}>
              <Button type="button" variant="outline" size="sm" className="w-full max-w-xs">
                <MapPin className="h-4 w-4 mr-2" />
                Select your marker on map (Optional)
              </Button>
            </MapLocationModal>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
          <div></div>
          
          <FloatingInput 
            id="residenceSince" 
            label="Residence Since" 
            type="date" 
            placeholder=" " 
            className="focus-visible:ring-blue-500 text-sm sm:text-base"
            value={formData?.address?.residenceSince || ""}
            onChange={(e) => handleChange("residenceSince", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressDetailsForm;
