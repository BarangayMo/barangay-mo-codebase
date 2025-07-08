import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronDown, X } from "lucide-react";
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
      const { data, error } = await supabase
        .from('Barangays')
        .select('REGION')
        .not('REGION', 'is', null)
        .neq('REGION', '');
      
      if (error) {
        console.error('Error loading regions:', error);
        return;
      }
      
      console.log("Raw region data:", data);
      
      if (data && data.length > 0) {
        const uniqueRegions = [...new Set(data.map(item => item.REGION).filter(region => region && region.trim() !== ''))];
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
      const { data, error } = await supabase
        .from('Barangays')
        .select('PROVINCE')
        .eq('REGION', selectedRegion)
        .not('PROVINCE', 'is', null)
        .neq('PROVINCE', '');
      
      if (error) {
        console.error('Error loading provinces:', error);
        return;
      }
      
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
      const { data, error } = await supabase
        .from('Barangays')
        .select('CITY/MUNICIPALITY')
        .eq('REGION', selectedRegion)
        .eq('PROVINCE', selectedProvince)
        .not('CITY/MUNICIPALITY', 'is', null)
        .neq('CITY/MUNICIPALITY', '');
      
      if (error) {
        console.error('Error loading municipalities:', error);
        return;
      }
      
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
      const { data, error } = await supabase
        .from('Barangays')
        .select('BARANGAY')
        .eq('REGION', selectedRegion)
        .eq('PROVINCE', selectedProvince)
        .eq('CITY/MUNICIPALITY', selectedMunicipality)
        .not('BARANGAY', 'is', null)
        .neq('BARANGAY', '');
      
      if (error) {
        console.error('Error loading barangays:', error);
        return;
      }
      
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
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Address</h1>
          <div className="w-6" />
        </div>

        {/* Simple Progress Bar */}
        <div className="px-6 py-8 bg-gray-50">
          <div className="flex justify-center items-center space-x-8 mb-6">
            <div className="flex items-center">
              <div className="h-1 w-16 bg-red-500 rounded-full"></div>
            </div>
            <div className="flex items-center">
              <div className="h-1 w-16 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex items-center">
              <div className="h-1 w-16 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Address</h2>
            <p className="text-sm text-gray-600">Please Complete Your Address Details</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-8">
          {/* Region Dropdown */}
          <div className="relative">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Region</Label>
            <div className="relative">
              <div 
                onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                className="flex items-center justify-between w-full h-12 px-4 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              >
                <span className={selectedRegion ? "text-gray-900" : "text-gray-400"}>
                  {selectedRegion || "Select Region"}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showRegionDropdown ? 'rotate-180' : ''}`} />
              </div>
              {selectedRegion && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRegion("");
                    setRegionSearch("");
                  }}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {showRegionDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2 border-b">
                  <Input
                    placeholder="Search regions..."
                    value={regionSearch}
                    onChange={(e) => setRegionSearch(e.target.value)}
                    className="h-8"
                  />
                </div>
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading regions...</div>
                ) : filteredRegions.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No regions found</div>
                ) : (
                  filteredRegions.map((region, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedRegion(region);
                        setRegionSearch("");
                        setShowRegionDropdown(false);
                      }}
                      className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {region}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Province Dropdown */}
          <div className="relative">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Province</Label>
            <div className="relative">
              <div 
                onClick={() => selectedRegion && setShowProvinceDropdown(!showProvinceDropdown)}
                className={`flex items-center justify-between w-full h-12 px-4 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 ${!selectedRegion ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className={selectedProvince ? "text-gray-900" : "text-gray-400"}>
                  {selectedProvince || "Select Province"}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showProvinceDropdown ? 'rotate-180' : ''}`} />
              </div>
              {selectedProvince && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProvince("");
                    setProvinceSearch("");
                  }}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {showProvinceDropdown && selectedRegion && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2 border-b">
                  <Input
                    placeholder="Search provinces..."
                    value={provinceSearch}
                    onChange={(e) => setProvinceSearch(e.target.value)}
                    className="h-8"
                  />
                </div>
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading provinces...</div>
                ) : filteredProvinces.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No provinces found</div>
                ) : (
                  filteredProvinces.map((province, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedProvince(province);
                        setProvinceSearch("");
                        setShowProvinceDropdown(false);
                      }}
                      className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {province}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Municipality Dropdown */}
          <div className="relative">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Select City/Municipality</Label>
            <div className="relative">
              <div 
                onClick={() => selectedProvince && setShowMunicipalityDropdown(!showMunicipalityDropdown)}
                className={`flex items-center justify-between w-full h-12 px-4 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 ${!selectedProvince ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className={selectedMunicipality ? "text-gray-900" : "text-gray-400"}>
                  {selectedMunicipality || "Select City/Municipality"}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showMunicipalityDropdown ? 'rotate-180' : ''}`} />
              </div>
              {selectedMunicipality && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMunicipality("");
                    setMunicipalitySearch("");
                  }}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {showMunicipalityDropdown && selectedProvince && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2 border-b">
                  <Input
                    placeholder="Search municipalities..."
                    value={municipalitySearch}
                    onChange={(e) => setMunicipalitySearch(e.target.value)}
                    className="h-8"
                  />
                </div>
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading municipalities...</div>
                ) : filteredMunicipalities.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No municipalities found</div>
                ) : (
                  filteredMunicipalities.map((municipality, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedMunicipality(municipality);
                        setMunicipalitySearch("");
                        setShowMunicipalityDropdown(false);
                      }}
                      className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {municipality}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Barangay Dropdown */}
          <div className="relative">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Barangay</Label>
            <div className="relative">
              <div 
                onClick={() => selectedMunicipality && setShowBarangayDropdown(!showBarangayDropdown)}
                className={`flex items-center justify-between w-full h-12 px-4 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 ${!selectedMunicipality ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className={selectedBarangay ? "text-gray-900" : "text-gray-400"}>
                  {selectedBarangay || "Select Barangay"}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showBarangayDropdown ? 'rotate-180' : ''}`} />
              </div>
              {selectedBarangay && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBarangay("");
                    setBarangaySearch("");
                  }}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {showBarangayDropdown && selectedMunicipality && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2 border-b">
                  <Input
                    placeholder="Search barangays..."
                    value={barangaySearch}
                    onChange={(e) => setBarangaySearch(e.target.value)}
                    className="h-8"
                  />
                </div>
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading barangays...</div>
                ) : filteredBarangays.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No barangays found</div>
                ) : (
                  filteredBarangays.map((barangay, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedBarangay(barangay);
                        setBarangaySearch("");
                        setShowBarangayDropdown(false);
                      }}
                      className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
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
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-center">
                <div className="font-semibold text-green-900 text-lg">{selectedBarangay}</div>
                <div className="text-sm text-green-600">Barangay Selected</div>
              </div>
            </div>
          )}
        </div>

        {/* Next Button */}
        <div className="p-6 bg-white border-t">
          <Button
            onClick={handleNext}
            disabled={!isFormValid}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 h-12 text-base font-medium rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Simple Progress Bar */}
        <div className="px-6 py-8 border-b bg-gray-50">
          <div className="flex justify-center items-center space-x-8 mb-6">
            <div className="flex items-center">
              <div className="h-1 w-16 bg-red-500 rounded-full"></div>
            </div>
            <div className="flex items-center">
              <div className="h-1 w-16 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex items-center">
              <div className="h-1 w-16 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Address</h2>
            <p className="text-sm text-gray-600">Please Complete Your Address Details</p>
          </div>
        </div>

        <div className="p-8">
          <button onClick={handleBack} className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Address Details</h1>
            <p className="text-gray-600">Please select your location information</p>
          </div>

          <div className="space-y-8">
            {/* Region Dropdown */}
            <div className="relative">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Region</Label>
              <div className="relative">
                <div 
                  onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                  className="flex items-center justify-between w-full h-12 px-4 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                >
                  <span className={selectedRegion ? "text-gray-900" : "text-gray-400"}>
                    {selectedRegion || "Select Region"}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showRegionDropdown ? 'rotate-180' : ''}`} />
                </div>
                {selectedRegion && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRegion("");
                      setRegionSearch("");
                    }}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {showRegionDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  <div className="p-2 border-b">
                    <Input
                      placeholder="Search regions..."
                      value={regionSearch}
                      onChange={(e) => setRegionSearch(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading regions...</div>
                  ) : filteredRegions.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No regions found</div>
                  ) : (
                    filteredRegions.map((region, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedRegion(region);
                          setRegionSearch("");
                          setShowRegionDropdown(false);
                        }}
                        className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        {region}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Province Dropdown */}
            <div className="relative">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Province</Label>
              <div className="relative">
                <div 
                  onClick={() => selectedRegion && setShowProvinceDropdown(!showProvinceDropdown)}
                  className={`flex items-center justify-between w-full h-12 px-4 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 ${!selectedRegion ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className={selectedProvince ? "text-gray-900" : "text-gray-400"}>
                    {selectedProvince || "Select Province"}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showProvinceDropdown ? 'rotate-180' : ''}`} />
                </div>
                {selectedProvince && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProvince("");
                      setProvinceSearch("");
                    }}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {showProvinceDropdown && selectedRegion && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  <div className="p-2 border-b">
                    <Input
                      placeholder="Search provinces..."
                      value={provinceSearch}
                      onChange={(e) => setProvinceSearch(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading provinces...</div>
                  ) : filteredProvinces.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No provinces found</div>
                  ) : (
                    filteredProvinces.map((province, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedProvince(province);
                          setProvinceSearch("");
                          setShowProvinceDropdown(false);
                        }}
                        className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        {province}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Municipality Dropdown */}
            <div className="relative">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Select City/Municipality</Label>
              <div className="relative">
                <div 
                  onClick={() => selectedProvince && setShowMunicipalityDropdown(!showMunicipalityDropdown)}
                  className={`flex items-center justify-between w-full h-12 px-4 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 ${!selectedProvince ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className={selectedMunicipality ? "text-gray-900" : "text-gray-400"}>
                    {selectedMunicipality || "Select City/Municipality"}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showMunicipalityDropdown ? 'rotate-180' : ''}`} />
                </div>
                {selectedMunicipality && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMunicipality("");
                      setMunicipalitySearch("");
                    }}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {showMunicipalityDropdown && selectedProvince && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  <div className="p-2 border-b">
                    <Input
                      placeholder="Search municipalities..."
                      value={municipalitySearch}
                      onChange={(e) => setMunicipalitySearch(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading municipalities...</div>
                  ) : filteredMunicipalities.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No municipalities found</div>
                  ) : (
                    filteredMunicipalities.map((municipality, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedMunicipality(municipality);
                          setMunicipalitySearch("");
                          setShowMunicipalityDropdown(false);
                        }}
                        className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        {municipality}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Barangay Dropdown */}
            <div className="relative">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Barangay</Label>
              <div className="relative">
                <div 
                  onClick={() => selectedMunicipality && setShowBarangayDropdown(!showBarangayDropdown)}
                  className={`flex items-center justify-between w-full h-12 px-4 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 ${!selectedMunicipality ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className={selectedBarangay ? "text-gray-900" : "text-gray-400"}>
                    {selectedBarangay || "Select Barangay"}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showBarangayDropdown ? 'rotate-180' : ''}`} />
                </div>
                {selectedBarangay && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBarangay("");
                      setBarangaySearch("");
                    }}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {showBarangayDropdown && selectedMunicipality && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  <div className="p-2 border-b">
                    <Input
                      placeholder="Search barangays..."
                      value={barangaySearch}
                      onChange={(e) => setBarangaySearch(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading barangays...</div>
                  ) : filteredBarangays.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No barangays found</div>
                  ) : (
                    filteredBarangays.map((barangay, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedBarangay(barangay);
                          setBarangaySearch("");
                          setShowBarangayDropdown(false);
                        }}
                        className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
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
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-center">
                  <div className="font-semibold text-green-900 text-lg">{selectedBarangay}</div>
                  <div className="text-sm text-green-600">Barangay Selected</div>
                </div>
              </div>
            )}
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!isFormValid}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 h-12 text-base font-medium rounded-lg mt-8 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
