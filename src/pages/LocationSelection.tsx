
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search, X } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBarangayData } from "@/hooks/use-barangay-data";
import { supabase } from "@/integrations/supabase/client";

export default function LocationSelection() {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const loadLocationData = async (step: number) => {
    setIsLoading(true);
    try {
      let query = supabase.from('Barangays').select('*');
      
      if (step === 1) {
        // Load regions
        const { data } = await query;
        const regions = [...new Set(data?.map(item => item.REGION).filter(Boolean))];
        setLocations(regions.map(region => ({ name: region, value: region })));
      } else if (step === 2) {
        // Load provinces for selected region
        const { data } = await query.eq('REGION', selectedRegion);
        const provinces = [...new Set(data?.map(item => item.PROVINCE).filter(Boolean))];
        setLocations(provinces.map(province => ({ name: province, value: province })));
      } else if (step === 3) {
        // Load municipalities for selected province
        const { data } = await query.eq('REGION', selectedRegion).eq('PROVINCE', selectedProvince);
        const municipalities = [...new Set(data?.map(item => item['CITY/MUNICIPALITY']).filter(Boolean))];
        setLocations(municipalities.map(municipality => ({ name: municipality, value: municipality })));
      } else if (step === 4) {
        // Load barangays for selected municipality
        const { data } = await query
          .eq('REGION', selectedRegion)
          .eq('PROVINCE', selectedProvince)
          .eq('CITY/MUNICIPALITY', selectedMunicipality);
        const barangays = data?.map(item => ({ name: item.BARANGAY, value: item.BARANGAY })).filter(b => b.name) || [];
        setLocations(barangays);
      }
    } catch (error) {
      console.error('Error loading location data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLocationData(currentStep);
  }, [currentStep, selectedRegion, selectedProvince, selectedMunicipality]);

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLocationSelect = (location: string) => {
    if (currentStep === 1) {
      setSelectedRegion(location);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setSelectedProvince(location);
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setSelectedMunicipality(location);
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setSelectedBarangay(location);
      // Navigate to officials info page
      navigate("/register/officials", { 
        state: { 
          role: "official",
          region: selectedRegion,
          province: selectedProvince,
          municipality: selectedMunicipality,
          barangay: location
        } 
      });
    }
    setSearchTerm("");
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate("/register/role");
    } else {
      setCurrentStep(currentStep - 1);
      setSearchTerm("");
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Select Region";
      case 2: return "Select Province";
      case 3: return "Select City/Municipality";
      case 4: return "Select Barangay";
      default: return "Select Location";
    }
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case 1: return "1";
      case 2: return "2";
      case 3: return "3";
      case 4: return "4";
      default: return "1";
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className="bg-blue-600 h-1 w-2/4"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{getStepTitle()}</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full text-sm font-semibold mb-2">
                {getStepNumber()}
              </div>
              <p className="text-sm text-gray-600">Please Complete Your Address Details:</p>
            </div>

            {/* Breadcrumb */}
            <div className="space-y-2 text-sm">
              {selectedRegion && (
                <div className="flex items-center justify-between py-2 px-3 bg-white rounded border">
                  <span className="text-gray-600">Region:</span>
                  <span className="font-medium">{selectedRegion}</span>
                </div>
              )}
              {selectedProvince && (
                <div className="flex items-center justify-between py-2 px-3 bg-white rounded border">
                  <span className="text-gray-600">Province:</span>
                  <span className="font-medium">{selectedProvince}</span>
                </div>
              )}
              {selectedMunicipality && (
                <div className="flex items-center justify-between py-2 px-3 bg-white rounded border">
                  <span className="text-gray-600">City/Municipality:</span>
                  <span className="font-medium">{selectedMunicipality}</span>
                </div>
              )}
            </div>

            {/* Search */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={`Type ${getStepTitle().toLowerCase().replace('select ', '')} name...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Location List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : filteredLocations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No results found</div>
            ) : (
              <div className="divide-y">
                {filteredLocations.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(location.value)}
                    className="w-full text-left py-4 px-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{location.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop version - similar structure but with desktop styling
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className="bg-blue-600 h-1 w-2/4"></div>
        </div>

        <div className="p-8">
          <button onClick={handleBack} className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{getStepTitle()}</h1>
            <p className="text-gray-600">Step {getStepNumber()} of 4</p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={`Search ${getStepTitle().toLowerCase().replace('select ', '')}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Location List */}
          <div className="max-h-64 overflow-y-auto border rounded-lg">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : filteredLocations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No results found</div>
            ) : (
              <div className="divide-y">
                {filteredLocations.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(location.value)}
                    className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{location.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
