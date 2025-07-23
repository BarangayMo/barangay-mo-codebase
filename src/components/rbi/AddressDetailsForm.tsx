
import { Home } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingSelect } from "@/components/ui/floating-select";
import { SelectItem } from "@/components/ui/select";
import { MapboxLocationPicker } from "@/components/ui/mapbox-location-picker";
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

  const handleLocationSelected = (location: { address: string; barangay?: string; coordinates: { lat: number; lng: number } }) => {
    const barangayName = location.barangay || location.address;
    setSelectedBarangay(barangayName);
    handleChange('barangay', barangayName);
    handleChange('coordinates', JSON.stringify(location.coordinates));
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
        
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Select Your Location on Map <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-primary/20 rounded-xl overflow-hidden shadow-lg bg-white">
              <MapboxLocationPicker 
                onLocationSelected={handleLocationSelected}
                height="280px"
                className="w-full rounded-xl"
                initialLocation={selectedBarangay || "Manila, Philippines"}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3 flex items-start gap-2">
              <span className="inline-block w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              Click on the map to pinpoint your exact location within your barangay. This helps us verify your residency.
            </p>
            {selectedBarangay && (
              <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="font-medium text-primary text-sm">Selected Location:</span>
                </div>
                <span className="text-primary/80 text-sm block mt-1">{selectedBarangay}</span>
              </div>
            )}
            {errors?.address?.barangay && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center">!</span>
                {errors.address.barangay}
              </p>
            )}
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
