import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Loader2 } from "lucide-react";
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

  // If no role state, redirect to role selection
  if (!locationState?.role) {
    navigate('/register/role');
    return null;
  }

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocationData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('location_data')
          .select('*')
          .single();

        if (error) {
          console.error("Error fetching location data:", error);
        } else {
          setLocationData(data);
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationData();
  }, []);

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const region = event.target.value;
    setSelectedRegion(region);
    setSelectedProvince("");
    setSelectedMunicipality("");
    setSelectedBarangay("");
  };

  const handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const province = event.target.value;
    setSelectedProvince(province);
    setSelectedMunicipality("");
    setSelectedBarangay("");
  };

  const handleMunicipalityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const municipality = event.target.value;
    setSelectedMunicipality(municipality);
    setSelectedBarangay("");
  };

  const handleBarangayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBarangay(event.target.value);
  };

  const handleNext = () => {
    const nextState = {
      role: locationState.role,
      region: selectedRegion,
      province: selectedProvince,
      municipality: selectedMunicipality,
      barangay: selectedBarangay
    };

    if (locationState.role === "official") {
      navigate("/register/officials", { state: nextState });
    } else {
      navigate("/register/details", { state: nextState });
    }
  };

  const canProceed = selectedRegion && selectedProvince && selectedMunicipality && selectedBarangay;

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className={`h-1 w-2/4 ${locationState.role === 'official' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
          <Link to="/register/role" className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </Link>
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
              <p className="text-gray-600 text-sm">Choose your region, province, municipality, and barangay</p>
            </div>

            {/* Location Selection */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Loading locations...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700">Region</label>
                  <select
                    id="region"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedRegion}
                    onChange={handleRegionChange}
                  >
                    <option value="">Select Region</option>
                    {locationData?.region && <option value={locationData?.region}>{locationData?.region}</option>}
                  </select>
                </div>

                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700">Province</label>
                  <select
                    id="province"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    disabled={!selectedRegion}
                  >
                    <option value="">Select Province</option>
                    {locationData?.provinces?.map((province) => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="municipality" className="block text-sm font-medium text-gray-700">Municipality</label>
                  <select
                    id="municipality"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedMunicipality}
                    onChange={handleMunicipalityChange}
                    disabled={!selectedProvince}
                  >
                    <option value="">Select Municipality</option>
                    {locationData?.municipalities && locationData?.municipalities[selectedProvince]?.map((municipality) => (
                      <option key={municipality} value={municipality}>{municipality}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="barangay" className="block text-sm font-medium text-gray-700">Barangay</label>
                  <select
                    id="barangay"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedBarangay}
                    onChange={handleBarangayChange}
                    disabled={!selectedMunicipality}
                  >
                    <option value="">Select Barangay</option>
                    {locationData?.barangays && locationData?.barangays[selectedMunicipality]?.map((barangay) => (
                      <option key={barangay} value={barangay}>{barangay}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className={`w-full text-white py-3 h-12 text-base font-medium ${
              locationState.role === 'official' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Next
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
          <div className={`h-1 w-2/4 ${locationState.role === 'official' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
        </div>

        <div className="p-8 bg-white">
          <Link to="/register/role" className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Link>
          
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
              alt="eGov.PH Logo" 
              className="h-16 w-auto mx-auto mb-4" 
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Select Your Location</h1>
            <p className="text-gray-600">Choose your region, province, municipality, and barangay</p>
          </div>
          
          {/* Location Selection */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading locations...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="region-desktop" className="block text-sm font-medium text-gray-700">Region</label>
                <select
                  id="region-desktop"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedRegion}
                  onChange={handleRegionChange}
                >
                  <option value="">Select Region</option>
                  {locationData?.region && <option value={locationData?.region}>{locationData?.region}</option>}
                </select>
              </div>

              <div>
                <label htmlFor="province-desktop" className="block text-sm font-medium text-gray-700">Province</label>
                <select
                  id="province-desktop"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                  disabled={!selectedRegion}
                >
                  <option value="">Select Province</option>
                  {locationData?.provinces?.map((province) => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="municipality-desktop" className="block text-sm font-medium text-gray-700">Municipality</label>
                <select
                  id="municipality-desktop"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedMunicipality}
                  onChange={handleMunicipalityChange}
                  disabled={!selectedProvince}
                >
                  <option value="">Select Municipality</option>
                  {locationData?.municipalities && locationData?.municipalities[selectedProvince]?.map((municipality) => (
                    <option key={municipality} value={municipality}>{municipality}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="barangay-desktop" className="block text-sm font-medium text-gray-700">Barangay</label>
                <select
                  id="barangay-desktop"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedBarangay}
                  onChange={handleBarangayChange}
                  disabled={!selectedMunicipality}
                >
                  <option value="">Select Barangay</option>
                  {locationData?.barangays && locationData?.barangays[selectedMunicipality]?.map((barangay) => (
                    <option key={barangay} value={barangay}>{barangay}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className={`w-full text-white py-3 text-base font-medium mt-8 ${
              locationState.role === 'official' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
