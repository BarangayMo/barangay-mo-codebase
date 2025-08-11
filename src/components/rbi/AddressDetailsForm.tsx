
import { Home } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";
import { SelectItem } from "@/components/ui/select";
import { MapLocationModal } from "@/components/layout/header/MapLocationModal";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { RbiFormComponentProps } from "@/types/rbi";

const AddressDetailsForm = ({ formData, setFormData, errors, setErrors }: RbiFormComponentProps) => {
  const [selectedBarangay, setSelectedBarangay] = useState(formData?.address?.barangay || "");

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
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
    handleChange('barangay', location.barangay);
    handleChange('coordinates', JSON.stringify(location.coordinates));
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
            value={formData?.address?.houseNumber || ""}
            onChange={(e) => handleChange("houseNumber", e.target.value)}
            error={errors?.address?.houseNumber}
          />
          
          <FloatingInput 
            id="street" 
            label="Street / Kalye" 
            placeholder=" " 
            className="focus-visible:ring-blue-500"
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
          className="focus-visible:ring-blue-500"
          value={formData?.address?.zone || ""}
          onChange={(e) => handleChange("zone", e.target.value)}
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
                  {selectedBarangay || formData?.address?.barangay || "Select Your Barangay"}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Choose on Map
                </span>
              </Button>
            </MapLocationModal>
            <p className="text-xs text-gray-500 ml-1">Click to select your barangay using the map</p>
            {errors?.address?.barangay && (
              <p className="text-red-500 text-xs ml-1">{errors.address.barangay}</p>
            )}
          </div>
          
          <FloatingInput 
            id="residenceSince" 
            label="Residence Since" 
            type="date" 
            placeholder=" " 
            className="focus-visible:ring-blue-500"
            value={formData?.address?.residenceSince || ""}
            onChange={(e) => handleChange("residenceSince", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressDetailsForm;
