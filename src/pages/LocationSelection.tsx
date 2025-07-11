
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { supabase } from "@/integrations/supabase/client";

interface LocationState {
  role: string;
}

interface LocationData {
  region: string;
  provinces: string[];
  municipalities: { [key: string]: string[] };
  barangays: { [key: string]: string[] };
}

export default function LocationSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const locationState = location.state as LocationState;

  // If no role is selected, redirect to role selection
  if (!locationState?.role) {
    navigate('/register/role');
    return null;
  }

  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");

  useEffect(() => {
    const fetchLocationData = async () => {
      setIsLoading(true);
      try {
        // Get unique regions from Barangays table
        const { data: regionData, error: regionError } = await supabase
          .from('Barangays')
          .select('REGION')
          .not('REGION', 'is', null)
          .limit(1);

        if (regionError) {
          console.error("Error fetching region data:", regionError);
          return;
        }

        const region = regionData?.[0]?.REGION || "REGION 3";

        // Get provinces for the region
        const { data: provinceData, error: provinceError } = await supabase
          .from('Barangays')
          .select('PROVINCE')
          .eq('REGION', region)
          .not('PROVINCE', 'is', null)
          .order('PROVINCE');

        if (provinceError) {
          console.error("Error fetching province data:", provinceError);
          return;
        }

        const provinces = [...new Set(provinceData.map(p => p.PROVINCE).filter(Boolean))];

        // Initialize data structure
        const data: LocationData = {
          region,
          provinces,
          municipalities: {},
          barangays: {}
        };

        // Fetch municipalities for each province
        for (const province of provinces) {
          const { data: municipalityData, error: municipalityError } = await supabase
            .from('Barangays')
            .select('CITY/MUNICIPALITY')
            .eq('REGION', region)
            .eq('PROVINCE', province)
            .not('CITY/MUNICIPALITY', 'is', null)
            .order('CITY/MUNICIPALITY');

          if (!municipalityError && municipalityData) {
            data.municipalities[province] = [...new Set(municipalityData.map(m => m['CITY/MUNICIPALITY']).filter(Boolean))];
          }
        }

        // Fetch barangays for each municipality
        for (const province of provinces) {
          const municipalities = data.municipalities[province] || [];
          for (const municipality of municipalities) {
            const { data: barangayData, error: barangayError } = await supabase
              .from('Barangays')
              .select('BARANGAY')
              .eq('REGION', region)
              .eq('PROVINCE', province)
              .eq('CITY/MUNICIPALITY', municipality)
              .not('BARANGAY', 'is', null)
              .order('BARANGAY');

            if (!barangayError && barangayData) {
              data.barangays[municipality] = [...new Set(barangayData.map(b => b.BARANGAY).filter(Boolean))];
            }
          }
        }

        setLocationData(data);
      } catch (error) {
        console.error("Error fetching location data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationData();
  }, []);

  const handleNext = () => {
    const nextState = {
      ...locationState,
      region: locationData?.region,
      province: selectedProvince,
      municipality: selectedMunicipality,
      barangay: selectedBarangay
    };

    if (locationState.role === "official") {
      navigate("/register/officials", { state: nextState });
    } else {
      navigate("/register", { state: nextState });
    }
  };

  const handleBack = () => {
    navigate("/register/role");
  };

  const isFormValid = selectedProvince && selectedMunicipality && selectedBarangay;

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className={`h-1 w-1/2 ${
            locationState.role === 'official' ? 'bg-red-600' : 'bg-blue-600'
          }`}></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
          <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Select Location</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-4 bg-white">
          <div className="space-y-6">
            {/* Logo and Title */}
            <div className="text-center">
              <img 
                src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
                alt="eGov.PH Logo" 
                className="h-12 w-auto mx-auto mb-4" 
              />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Select Your Location</h2>
              <p className="text-gray-600 text-sm">
                Please select your location to continue with your{" "}
                <span className={`font-semibold capitalize ${
                  locationState.role === 'official' ? 'text-red-600' : 'text-blue-600'
                }`}>{locationState.role}</span> registration
              </p>
            </div>

            {/* Location Selection */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading locations...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="region" className="text-gray-700 text-sm">Region</Label>
                  <Input
                    id="region"
                    value={locationData?.region || ""}
                    disabled
                    className="mt-1 h-9 text-sm bg-gray-100 border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="province" className="text-gray-700 text-sm">Province *</Label>
                  <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                    <SelectTrigger className="mt-1 h-9 text-sm border-gray-300">
                      <SelectValue placeholder="Select Province" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationData?.provinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="municipality" className="text-gray-700 text-sm">City/Municipality *</Label>
                  <Select 
                    value={selectedMunicipality} 
                    onValueChange={setSelectedMunicipality}
                    disabled={!selectedProvince}
                  >
                    <SelectTrigger className="mt-1 h-9 text-sm border-gray-300">
                      <SelectValue placeholder="Select City/Municipality" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProvince && locationData?.municipalities[selectedProvince]?.map((municipality) => (
                        <SelectItem key={municipality} value={municipality}>
                          {municipality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="barangay" className="text-gray-700 text-sm">Barangay *</Label>
                  <Select 
                    value={selectedBarangay} 
                    onValueChange={setSelectedBarangay}
                    disabled={!selectedMunicipality}
                  >
                    <SelectTrigger className="mt-1 h-9 text-sm border-gray-300">
                      <SelectValue placeholder="Select Barangay" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedMunicipality && locationData?.barangays[selectedMunicipality]?.map((barangay) => (
                        <SelectItem key={barangay} value={barangay}>
                          {barangay}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!isFormValid || isLoading}
            className={`w-full text-white py-3 h-12 text-base font-medium ${
              locationState.role === 'official' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            NEXT
          </Button>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className={`h-1 w-1/2 ${
            locationState.role === 'official' ? 'bg-red-600' : 'bg-blue-600'
          }`}></div>
        </div>

        <div className="p-8 bg-white">
          <button onClick={handleBack} className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          
          {/* Header */}
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
              alt="eGov.PH Logo" 
              className="h-16 w-auto mx-auto mb-4" 
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Select Your Location</h1>
            <p className="text-gray-600">
              Please select your location to continue with your{" "}
              <span className={`font-semibold capitalize ${
                locationState.role === 'official' ? 'text-red-600' : 'text-blue-600'
              }`}>{locationState.role}</span> registration
            </p>
          </div>
          
          {/* Location Selection */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading locations...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <Label htmlFor="region-desktop" className="text-gray-700">Region</Label>
                <Input
                  id="region-desktop"
                  value={locationData?.region || ""}
                  disabled
                  className="mt-1 bg-gray-100 border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="province-desktop" className="text-gray-700">Province *</Label>
                <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                  <SelectTrigger className="mt-1 border-gray-300">
                    <SelectValue placeholder="Select Province" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationData?.provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="municipality-desktop" className="text-gray-700">City/Municipality *</Label>
                <Select 
                  value={selectedMunicipality} 
                  onValueChange={setSelectedMunicipality}
                  disabled={!selectedProvince}
                >
                  <SelectTrigger className="mt-1 border-gray-300">
                    <SelectValue placeholder="Select City/Municipality" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProvince && locationData?.municipalities[selectedProvince]?.map((municipality) => (
                      <SelectItem key={municipality} value={municipality}>
                        {municipality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="barangay-desktop" className="text-gray-700">Barangay *</Label>
                <Select 
                  value={selectedBarangay} 
                  onValueChange={setSelectedBarangay}
                  disabled={!selectedMunicipality}
                >
                  <SelectTrigger className="mt-1 border-gray-300">
                    <SelectValue placeholder="Select Barangay" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedMunicipality && locationData?.barangays[selectedMunicipality]?.map((barangay) => (
                      <SelectItem key={barangay} value={barangay}>
                        {barangay}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!isFormValid || isLoading}
            className={`w-full text-white py-3 text-base font-medium mt-8 ${
              locationState.role === 'official' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
