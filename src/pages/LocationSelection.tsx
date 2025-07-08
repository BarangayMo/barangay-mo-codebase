import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search, X } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export default function LocationSelection() {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  
  const [regions, setRegions] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [municipalities, setMunicipalities] = useState<string[]>([]);
  const [barangays, setBarangays] = useState<string[]>([]);
  
  const [regionSearch, setRegionSearch] = useState("");
  const [provinceSearch, setProvinceSearch] = useState("");
  const [municipalitySearch, setMunicipalitySearch] = useState("");
  const [barangaySearch, setBarangaySearch] = useState("");
  
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showMunicipalityDropdown, setShowMunicipalityDropdown] = useState(false);
  const [showBarangayDropdown, setShowBarangayDropdown] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Load regions on component mount
  useEffect(() => {
    loadRegions();
  }, []);

  // Load provinces when region is selected
  useEffect(() => {
    if (selectedRegion) {
      loadProvinces();
      setSelectedProvince("");
      setSelectedMunicipality("");
      setSelectedBarangay("");
    }
  }, [selectedRegion]);

  // Load municipalities when province is selected
  useEffect(() => {
    if (selectedProvince) {
      loadMunicipalities();
      setSelectedMunicipality("");
      setSelectedBarangay("");
    }
  }, [selectedProvince]);

  // Load barangays when municipality is selected
  useEffect(() => {
    if (selectedMunicipality) {
      loadBarangays();
      setSelectedBarangay("");
    }
  }, [selectedMunicipality]);

  const loadRegions = async () => {
    setIsLoading(true);
    try {
      console.log("Loading regions from Supabase...");
      const { data, error } = await supabase.from('Barangays').select('REGION');
      
      if (error) {
        console.error('Error loading regions:', error);
        return;
      }
      
      console.log("Raw region data:", data);
      
      if (data && data.length > 0) {
        const uniqueRegions = [...new Set(data.map(item => item.REGION).filter(Boolean))];
        console.log("Unique regions:", uniqueRegions);
        setRegions(uniqueRegions.sort());
      } else {
        console.log("No region data found");
        setRegions([]);
      }
    } catch (error) {
      console.error('Error loading regions:', error);
      setRegions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProvinces = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('Barangays')
        .select('PROVINCE')
        .eq('REGION', selectedRegion);
      const uniqueProvinces = [...new Set(data?.map(item => item.PROVINCE).filter(Boolean))];
      setProvinces(uniqueProvinces.sort());
    } catch (error) {
      console.error('Error loading provinces:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMunicipalities = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('Barangays')
        .select('CITY/MUNICIPALITY')
        .eq('REGION', selectedRegion)
        .eq('PROVINCE', selectedProvince);
      const uniqueMunicipalities = [...new Set(data?.map(item => item['CITY/MUNICIPALITY']).filter(Boolean))];
      setMunicipalities(uniqueMunicipalities.sort());
    } catch (error) {
      console.error('Error loading municipalities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBarangays = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('Barangays')
        .select('BARANGAY')
        .eq('REGION', selectedRegion)
        .eq('PROVINCE', selectedProvince)
        .eq('CITY/MUNICIPALITY', selectedMunicipality);
      const uniqueBarangays = [...new Set(data?.map(item => item.BARANGAY).filter(Boolean))];
      setBarangays(uniqueBarangays.sort());
    } catch (error) {
      console.error('Error loading barangays:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (selectedRegion && selectedProvince && selectedMunicipality && selectedBarangay) {
      navigate("/register/officials", { 
        state: { 
          role: "official",
          region: selectedRegion,
          province: selectedProvince,
          municipality: selectedMunicipality,
          barangay: selectedBarangay
        } 
      });
    }
  };

  const handleBack = () => {
    navigate("/register/role");
  };

  const filteredRegions = regions.filter(region =>
    region.toLowerCase().includes(regionSearch.toLowerCase())
  );

  const filteredProvinces = provinces.filter(province =>
    province.toLowerCase().includes(provinceSearch.toLowerCase())
  );

  const filteredMunicipalities = municipalities.filter(municipality =>
    municipality.toLowerCase().includes(municipalitySearch.toLowerCase())
  );

  const filteredBarangays = barangays.filter(barangay =>
    barangay.toLowerCase().includes(barangaySearch.toLowerCase())
  );

  const isFormValid = selectedRegion && selectedProvince && selectedMunicipality && selectedBarangay;

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Address</h1>
          <div className="w-6" />
        </div>

        {/* Progress Bar */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span className="ml-2 text-sm font-medium text-red-600">Address</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="ml-2 text-sm text-gray-400">Details</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="ml-2 text-sm text-gray-400">Logo</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Please Complete Your Address Details:</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-4">
          {/* Region */}
          <div className="relative">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">1. Select Region</Label>
            <div className="relative">
              <Input
                placeholder="Select Region"
                value={selectedRegion || regionSearch}
                onChange={(e) => {
                  setRegionSearch(e.target.value);
                  if (!selectedRegion) setShowRegionDropdown(true);
                }}
                onFocus={() => setShowRegionDropdown(true)}
                className="pr-10"
              />
              {selectedRegion && (
                <button
                  onClick={() => {
                    setSelectedRegion("");
                    setRegionSearch("");
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {showRegionDropdown && !selectedRegion && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="p-3 text-center text-gray-500">Loading...</div>
                ) : filteredRegions.length === 0 ? (
                  <div className="p-3 text-center text-gray-500">No regions found</div>
                ) : (
                  filteredRegions.map((region, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedRegion(region);
                        setRegionSearch("");
                        setShowRegionDropdown(false);
                      }}
                      className="w-full text-left py-2 px-3 hover:bg-gray-50 transition-colors"
                    >
                      {region}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Province */}
          <div className="relative">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">2. Select Province</Label>
            <div className="relative">
              <Input
                placeholder="Select Province"
                value={selectedProvince || provinceSearch}
                onChange={(e) => {
                  setProvinceSearch(e.target.value);
                  if (!selectedProvince) setShowProvinceDropdown(true);
                }}
                onFocus={() => selectedRegion && setShowProvinceDropdown(true)}
                disabled={!selectedRegion}
                className="pr-10"
              />
              {selectedProvince && (
                <button
                  onClick={() => {
                    setSelectedProvince("");
                    setProvinceSearch("");
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {showProvinceDropdown && !selectedProvince && selectedRegion && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="p-3 text-center text-gray-500">Loading...</div>
                ) : filteredProvinces.length === 0 ? (
                  <div className="p-3 text-center text-gray-500">No provinces found</div>
                ) : (
                  filteredProvinces.map((province, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedProvince(province);
                        setProvinceSearch("");
                        setShowProvinceDropdown(false);
                      }}
                      className="w-full text-left py-2 px-3 hover:bg-gray-50 transition-colors"
                    >
                      {province}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Municipality */}
          <div className="relative">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">3. Select City/Municipality</Label>
            <div className="relative">
              <Input
                placeholder="Select City/Municipality"
                value={selectedMunicipality || municipalitySearch}
                onChange={(e) => {
                  setMunicipalitySearch(e.target.value);
                  if (!selectedMunicipality) setShowMunicipalityDropdown(true);
                }}
                onFocus={() => selectedProvince && setShowMunicipalityDropdown(true)}
                disabled={!selectedProvince}
                className="pr-10"
              />
              {selectedMunicipality && (
                <button
                  onClick={() => {
                    setSelectedMunicipality("");
                    setMunicipalitySearch("");
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {showMunicipalityDropdown && !selectedMunicipality && selectedProvince && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="p-3 text-center text-gray-500">Loading...</div>
                ) : filteredMunicipalities.length === 0 ? (
                  <div className="p-3 text-center text-gray-500">No municipalities found</div>
                ) : (
                  filteredMunicipalities.map((municipality, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedMunicipality(municipality);
                        setMunicipalitySearch("");
                        setShowMunicipalityDropdown(false);
                      }}
                      className="w-full text-left py-2 px-3 hover:bg-gray-50 transition-colors"
                    >
                      {municipality}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Barangay */}
          <div className="relative">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">4. Select Barangay</Label>
            <div className="relative">
              <Input
                placeholder="Type barangay name..."
                value={selectedBarangay || barangaySearch}
                onChange={(e) => {
                  setBarangaySearch(e.target.value);
                  if (!selectedBarangay) setShowBarangayDropdown(true);
                }}
                onFocus={() => selectedMunicipality && setShowBarangayDropdown(true)}
                disabled={!selectedMunicipality}
                className="pr-10"
              />
              {selectedBarangay && (
                <button
                  onClick={() => {
                    setSelectedBarangay("");
                    setBarangaySearch("");
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {showBarangayDropdown && !selectedBarangay && selectedMunicipality && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="p-3 text-center text-gray-500">Loading...</div>
                ) : filteredBarangays.length === 0 ? (
                  <div className="p-3 text-center text-gray-500">No barangays found</div>
                ) : (
                  filteredBarangays.map((barangay, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedBarangay(barangay);
                        setBarangaySearch("");
                        setShowBarangayDropdown(false);
                      }}
                      className="w-full text-left py-2 px-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{barangay}</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Selected Barangay Display */}
          {selectedBarangay && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="text-center">
                <div className="font-semibold text-gray-900 text-lg">{selectedBarangay}</div>
                <div className="text-sm text-gray-500">Unregistered Barangay</div>
              </div>
            </div>
          )}
        </div>

        {/* Next Button */}
        <div className="p-4 border-t">
          <Button
            onClick={handleNext}
            disabled={!isFormValid}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 h-12 text-base font-medium"
          >
            NEXT
          </Button>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span className="ml-2 text-sm font-medium text-red-600">Address</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="ml-2 text-sm text-gray-400">Details</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="ml-2 text-sm text-gray-400">Logo</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <button onClick={handleBack} className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Address Details</h1>
            <p className="text-gray-600">Please Complete Your Address Details:</p>
          </div>

          <div className="space-y-4">
            {/* Region */}
            <div className="relative">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">1. Select Region</Label>
              <div className="relative">
                <Input
                  placeholder="Select Region"
                  value={selectedRegion || regionSearch}
                  onChange={(e) => {
                    setRegionSearch(e.target.value);
                    if (!selectedRegion) setShowRegionDropdown(true);
                  }}
                  onFocus={() => setShowRegionDropdown(true)}
                  className="pr-10"
                />
                {selectedRegion && (
                  <button
                    onClick={() => {
                      setSelectedRegion("");
                      setRegionSearch("");
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {showRegionDropdown && !selectedRegion && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {filteredRegions.map((region, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedRegion(region);
                        setRegionSearch("");
                        setShowRegionDropdown(false);
                      }}
                      className="w-full text-left py-2 px-3 hover:bg-gray-50 transition-colors"
                    >
                      {region}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Province */}
            <div className="relative">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">2. Select Province</Label>
              <div className="relative">
                <Input
                  placeholder="Select Province"
                  value={selectedProvince || provinceSearch}
                  onChange={(e) => {
                    setProvinceSearch(e.target.value);
                    if (!selectedProvince) setShowProvinceDropdown(true);
                  }}
                  onFocus={() => selectedRegion && setShowProvinceDropdown(true)}
                  disabled={!selectedRegion}
                  className="pr-10"
                />
                {selectedProvince && (
                  <button
                    onClick={() => {
                      setSelectedProvince("");
                      setProvinceSearch("");
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {showProvinceDropdown && !selectedProvince && selectedRegion && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {filteredProvinces.map((province, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedProvince(province);
                        setProvinceSearch("");
                        setShowProvinceDropdown(false);
                      }}
                      className="w-full text-left py-2 px-3 hover:bg-gray-50 transition-colors"
                    >
                      {province}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Municipality */}
            <div className="relative">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">3. Select City/Municipality</Label>
              <div className="relative">
                <Input
                  placeholder="Select City/Municipality"
                  value={selectedMunicipality || municipalitySearch}
                  onChange={(e) => {
                    setMunicipalitySearch(e.target.value);
                    if (!selectedMunicipality) setShowMunicipalityDropdown(true);
                  }}
                  onFocus={() => selectedProvince && setShowMunicipalityDropdown(true)}
                  disabled={!selectedProvince}
                  className="pr-10"
                />
                {selectedMunicipality && (
                  <button
                    onClick={() => {
                      setSelectedMunicipality("");
                      setMunicipalitySearch("");
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {showMunicipalityDropdown && !selectedMunicipality && selectedProvince && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {filteredMunicipalities.map((municipality, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedMunicipality(municipality);
                        setMunicipalitySearch("");
                        setShowMunicipalityDropdown(false);
                      }}
                      className="w-full text-left py-2 px-3 hover:bg-gray-50 transition-colors"
                    >
                      {municipality}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Barangay */}
            <div className="relative">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">4. Select Barangay</Label>
              <div className="relative">
                <Input
                  placeholder="Type barangay name..."
                  value={selectedBarangay || barangaySearch}
                  onChange={(e) => {
                    setBarangaySearch(e.target.value);
                    if (!selectedBarangay) setShowBarangayDropdown(true);
                  }}
                  onFocus={() => selectedMunicipality && setShowBarangayDropdown(true)}
                  disabled={!selectedMunicipality}
                  className="pr-10"
                />
                {selectedBarangay && (
                  <button
                    onClick={() => {
                      setSelectedBarangay("");
                      setBarangaySearch("");
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {showBarangayDropdown && !selectedBarangay && selectedMunicipality && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {filteredBarangays.map((barangay, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedBarangay(barangay);
                        setBarangaySearch("");
                        setShowBarangayDropdown(false);
                      }}
                      className="w-full text-left py-2 px-3 hover:bg-gray-50 transition-colors"
                    >
                      {barangay}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Barangay Display */}
            {selectedBarangay && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                <div className="text-center">
                  <div className="font-semibold text-gray-900 text-lg">{selectedBarangay}</div>
                  <div className="text-sm text-gray-500">Unregistered Barangay</div>
                </div>
              </div>
            )}
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!isFormValid}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-base font-medium mt-6"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
