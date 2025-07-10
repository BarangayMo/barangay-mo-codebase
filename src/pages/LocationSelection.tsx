
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RegistrationProgress } from "@/components/ui/registration-progress";

interface LocationState {
  role: string;
}

export default function LocationSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const locationState = location.state as LocationState;

  const [regions, setRegions] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [municipalities, setMunicipalities] = useState<string[]>([]);
  const [barangays, setBarangays] = useState<string[]>([]);

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");

  useEffect(() => {
    // Mock data loading for regions, provinces, municipalities, and barangays
    setRegions(["Region 1", "Region 2", "Region 3"]);
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      // Mock data loading for provinces based on selected region
      setProvinces([`${selectedRegion} - Province A`, `${selectedRegion} - Province B`]);
    } else {
      setProvinces([]);
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedProvince) {
      // Mock data loading for municipalities based on selected province
      setMunicipalities([`${selectedProvince} - Municipality X`, `${selectedProvince} - Municipality Y`]);
    } else {
      setMunicipalities([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedMunicipality) {
      // Mock data loading for barangays based on selected municipality
      setBarangays([`${selectedMunicipality} - Barangay 1`, `${selectedMunicipality} - Barangay 2`]);
    } else {
      setBarangays([]);
    }
  }, [selectedMunicipality]);

  const handleNext = () => {
    const nextPath = locationState?.role === "official" ? "/register/officials" : "/register/details";
    
    navigate(nextPath, {
      state: {
        ...locationState,
        region: selectedRegion,
        province: selectedProvince,
        municipality: selectedMunicipality,
        barangay: selectedBarangay
      }
    });
  };

  const handleBack = () => {
    navigate("/register/role");
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className={`h-1 w-2/5 ${locationState?.role === 'official' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
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
          <div className="space-y-4">
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">Region</label>
              <select
                id="region"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="">Select Region</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-700">Province</label>
              <select
                id="province"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                disabled={!selectedRegion}
              >
                <option value="">Select Province</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="municipality" className="block text-sm font-medium text-gray-700">Municipality</label>
              <select
                id="municipality"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedMunicipality}
                onChange={(e) => setSelectedMunicipality(e.target.value)}
                disabled={!selectedProvince}
              >
                <option value="">Select Municipality</option>
                {municipalities.map(municipality => (
                  <option key={municipality} value={municipality}>{municipality}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="barangay" className="block text-sm font-medium text-gray-700">Barangay</label>
              <select
                id="barangay"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedBarangay}
                onChange={(e) => setSelectedBarangay(e.target.value)}
                disabled={!selectedMunicipality}
              >
                <option value="">Select Barangay</option>
                {barangays.map(barangay => (
                  <option key={barangay} value={barangay}>{barangay}</option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={handleNext}
            disabled={!selectedRegion || !selectedProvince || !selectedMunicipality || !selectedBarangay}
            className={`w-full text-white py-3 h-12 text-base font-medium ${
              locationState?.role === 'official' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
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
          <div className={`h-1 w-2/5 ${locationState?.role === 'official' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
        </div>

        <div className="p-8 bg-white">
          <button onClick={handleBack} className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          
          <div className="space-y-6">
            <div className="text-center mb-8">
              <img 
                src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
                alt="eGov.PH Logo" 
                className="h-16 w-auto mx-auto mb-4" 
              />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Select Your Location</h1>
              <p className="text-gray-600">Choose your region, province, municipality, and barangay</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="region-desktop" className="block text-sm font-medium text-gray-700">Region</label>
                <select
                  id="region-desktop"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="">Select Region</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="province-desktop" className="block text-sm font-medium text-gray-700">Province</label>
                <select
                  id="province-desktop"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  disabled={!selectedRegion}
                >
                  <option value="">Select Province</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="municipality-desktop" className="block text-sm font-medium text-gray-700">Municipality</label>
                <select
                  id="municipality-desktop"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedMunicipality}
                  onChange={(e) => setSelectedMunicipality(e.target.value)}
                  disabled={!selectedProvince}
                >
                  <option value="">Select Municipality</option>
                  {municipalities.map(municipality => (
                    <option key={municipality} value={municipality}>{municipality}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="barangay-desktop" className="block text-sm font-medium text-gray-700">Barangay</label>
                <select
                  id="barangay-desktop"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedBarangay}
                  onChange={(e) => setSelectedBarangay(e.target.value)}
                  disabled={!selectedMunicipality}
                >
                  <option value="">Select Barangay</option>
                  {barangays.map(barangay => (
                    <option key={barangay} value={barangay}>{barangay}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              onClick={handleNext}
              disabled={!selectedRegion || !selectedProvince || !selectedMunicipality || !selectedBarangay}
              className={`w-full text-white py-3 text-base font-medium ${
                locationState?.role === 'official' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
