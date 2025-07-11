
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-media-query";

const REGIONS = [{
  code: "REGION 1",
  name: "Ilocos Region (Region I)"
}, {
  code: "REGION 2", 
  name: "Cagayan Valley (Region II)"
}, {
  code: "REGION 3",
  name: "Central Luzon (Region III)"
}, {
  code: "REGION 4A",
  name: "CALABARZON (Region IV-A)"
}, {
  code: "REGION 4B",
  name: "MIMAROPA (Region IV-B)"
}, {
  code: "REGION 5",
  name: "Bicol Region (Region V)"
}, {
  code: "REGION 6",
  name: "Western Visayas (Region VI)"
}, {
  code: "REGION 7",
  name: "Central Visayas (Region VII)"
}, {
  code: "REGION 8",
  name: "Eastern Visayas (Region VIII)"
}, {
  code: "REGION 9",
  name: "Zamboanga Peninsula (Region IX)"
}, {
  code: "REGION 10",
  name: "Northern Mindanao (Region X)"
}, {
  code: "REGION 11",
  name: "Davao Region (Region XI)"
}, {
  code: "REGION 12",
  name: "SOCCSKSARGEN (Region XII)"
}, {
  code: "REGION 13",
  name: "Caraga (Region XIII)"
}, {
  code: "NCR",
  name: "National Capital Region (NCR)"
}, {
  code: "CAR",
  name: "Cordillera Administrative Region (CAR)"
}, {
  code: "BARMM",
  name: "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)"
}];

const SAMPLE_DATA = {
  "REGION 3": {
    provinces: ["Bataan", "Bulacan", "Nueva Ecija", "Pampanga", "Tarlac", "Zambales", "Aurora"],
    municipalities: {
      "Pampanga": ["Angeles City", "San Fernando", "Mabalacat", "Meycauayan", "Balanga"],
      "Bulacan": ["Malolos", "Meycauayan", "San Jose del Monte", "Marilao", "Bocaue"],
      "Nueva Ecija": ["Cabanatuan", "Gapan", "San Jose", "Palayan", "Talavera"]
    },
    barangays: {
      "Angeles City": ["Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5"],
      "San Fernando": ["San Jose", "San Nicolas", "San Vicente", "Santa Lucia", "Santo Tomas"],
      "Malolos": ["Barasoain", "Bulihan", "Canalate", "Dakila", "Guinhawa"]
    }
  }
};

export default function LocationSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [availableProvinces, setAvailableProvinces] = useState<string[]>([]);
  const [availableMunicipalities, setAvailableMunicipalities] = useState<string[]>([]);
  const [availableBarangays, setAvailableBarangays] = useState<string[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const locationState = location.state;

  // If no role selected, redirect to role selection
  if (!locationState?.role) {
    navigate('/register/role');
    return null;
  }

  useEffect(() => {
    if (selectedRegion && SAMPLE_DATA[selectedRegion as keyof typeof SAMPLE_DATA]) {
      setAvailableProvinces(SAMPLE_DATA[selectedRegion as keyof typeof SAMPLE_DATA].provinces);
      setSelectedProvince("");
      setSelectedMunicipality("");
      setSelectedBarangay("");
      setAvailableMunicipalities([]);
      setAvailableBarangays([]);
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedProvince && selectedRegion) {
      const regionData = SAMPLE_DATA[selectedRegion as keyof typeof SAMPLE_DATA];
      if (regionData?.municipalities[selectedProvince as keyof typeof regionData.municipalities]) {
        setAvailableMunicipalities(regionData.municipalities[selectedProvince as keyof typeof regionData.municipalities]);
        setSelectedMunicipality("");
        setSelectedBarangay("");
        setAvailableBarangays([]);
      }
    }
  }, [selectedProvince, selectedRegion]);

  useEffect(() => {
    if (selectedMunicipality && selectedRegion) {
      const regionData = SAMPLE_DATA[selectedRegion as keyof typeof SAMPLE_DATA];
      if (regionData?.barangays[selectedMunicipality as keyof typeof regionData.barangays]) {
        setAvailableBarangays(regionData.barangays[selectedMunicipality as keyof typeof regionData.barangays]);
        setSelectedBarangay("");
      }
    }
  }, [selectedMunicipality, selectedRegion]);

  const handleBack = () => {
    navigate('/register/role');
  };

  const canProceed = selectedRegion && selectedProvince && selectedMunicipality && selectedBarangay;

  const handleNext = () => {
    if (canProceed) {
      const nextState = {
        ...locationState,
        region: selectedRegion,
        province: selectedProvince,
        municipality: selectedMunicipality,
        barangay: selectedBarangay
      };
      
      if (locationState.role === "official") {
        navigate("/register/officials", {
          state: nextState
        });
      } else {
        // Resident goes directly to register
        navigate("/register", {
          state: nextState
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Select Your Location
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Please provide your location details to continue with registration
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Region Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Region *</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((region) => (
                    <SelectItem key={region.code} value={region.code}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Province Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Province *</label>
              <Select 
                value={selectedProvince} 
                onValueChange={setSelectedProvince}
                disabled={!selectedRegion}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your province" />
                </SelectTrigger>
                <SelectContent>
                  {availableProvinces.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Municipality Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">City/Municipality *</label>
              <Select 
                value={selectedMunicipality} 
                onValueChange={setSelectedMunicipality}
                disabled={!selectedProvince}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your city/municipality" />
                </SelectTrigger>
                <SelectContent>
                  {availableMunicipalities.map((municipality) => (
                    <SelectItem key={municipality} value={municipality}>
                      {municipality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Barangay Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Barangay *</label>
              <Select 
                value={selectedBarangay} 
                onValueChange={setSelectedBarangay}
                disabled={!selectedMunicipality}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your barangay" />
                </SelectTrigger>
                <SelectContent>
                  {availableBarangays.map((barangay) => (
                    <SelectItem key={barangay} value={barangay}>
                      {barangay}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 h-12"
                size={isMobile ? "sm" : "default"}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed}
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
                size={isMobile ? "sm" : "default"}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
