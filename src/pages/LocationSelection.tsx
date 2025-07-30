"use client"
//new-changes
import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronDown, X, Check } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"

// Hardcoded Philippine regions with their full names
const PHILIPPINE_REGIONS = [
  {
    code: "REGION 1",
    name: "Ilocos Region (Region I)",
  },
  {
    code: "REGION 2",
    name: "Cagayan Valley (Region II)",
  },
  {
    code: "REGION 3",
    name: "Central Luzon (Region III)",
  },
  {
    code: "REGION 4A",
    name: "CALABARZON (Region IV-A)",
  },
  {
    code: "REGION 4B",
    name: "MIMAROPA (Region IV-B)",
  },
  {
    code: "REGION 5",
    name: "Bicol Region (Region V)",
  },
  {
    code: "REGION 6",
    name: "Western Visayas (Region VI)",
  },
  {
    code: "REGION 7",
    name: "Central Visayas (Region VII)",
  },
  {
    code: "REGION 8",
    name: "Eastern Visayas (Region VIII)",
  },
  {
    code: "REGION 9",
    name: "Zamboanga Peninsula (Region IX)",
  },
  {
    code: "REGION 10",
    name: "Northern Mindanao (Region X)",
  },
  {
    code: "REGION 11",
    name: "Davao Region (Region XI)",
  },
  {
    code: "REGION 12",
    name: "SOCCSKSARGEN (Region XII)",
  },
  {
    code: "REGION 13",
    name: "Caraga (Region XIII)",
  },
  {
    code: "NCR",
    name: "National Capital Region (NCR)",
  },
  {
    code: "CAR",
    name: "Cordillera Administrative Region (CAR)",
  },
  {
    code: "BARMM",
    name: "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)",
  },
]

// Helper function to convert text to title case
const toTitleCase = (str: string) => {
  return str.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
}

export default function LocationSelection() {
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const locationState = location.state

  const [selectedRegion, setSelectedRegion] = useState(() => {
    return localStorage.getItem("registration_region") || location.state?.region || ""
  })
  const [selectedProvince, setSelectedProvince] = useState(() => {
    return localStorage.getItem("registration_province") || location.state?.province || ""
  })
  const [selectedMunicipality, setSelectedMunicipality] = useState(() => {
    return localStorage.getItem("registration_municipality") || location.state?.municipality || ""
  })
  const [selectedBarangay, setSelectedBarangay] = useState(() => {
    return localStorage.getItem("registration_barangay") || location.state?.barangay || ""
  })

  const [provinces, setProvinces] = useState<string[]>([])
  const [municipalities, setMunicipalities] = useState<string[]>([])
  const [barangays, setBarangays] = useState<string[]>([])

  const [regionSearch, setRegionSearch] = useState(() => {
    const savedRegion = localStorage.getItem("registration_region") || location.state?.region
    if (savedRegion) {
      const regionObj = PHILIPPINE_REGIONS.find((r) => r.code === savedRegion)
      return regionObj?.name || ""
    }
    return ""
  })
  const [provinceSearch, setProvinceSearch] = useState(() => {
    const savedProvince = localStorage.getItem("registration_province") || location.state?.province
    return savedProvince ? toTitleCase(savedProvince) : ""
  })
  const [municipalitySearch, setMunicipalitySearch] = useState(() => {
    const savedMunicipality = localStorage.getItem("registration_municipality") || location.state?.municipality
    return savedMunicipality ? toTitleCase(savedMunicipality) : ""
  })
  const [barangaySearch, setBarangaySearch] = useState(() => {
    const savedBarangay = localStorage.getItem("registration_barangay") || location.state?.barangay
    return savedBarangay ? toTitleCase(savedBarangay) : ""
  })

  const [showRegionDropdown, setShowRegionDropdown] = useState(false)
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false)
  const [showMunicipalityDropdown, setShowMunicipalityDropdown] = useState(false)
  const [showBarangayDropdown, setShowBarangayDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const regionRef = useRef<HTMLDivElement>(null)
  const provinceRef = useRef<HTMLDivElement>(null)
  const municipalityRef = useRef<HTMLDivElement>(null)
  const barangayRef = useRef<HTMLDivElement>(null)

  const userRole = localStorage.getItem("registration_role") || locationState?.role

  useEffect(() => {
    if (!locationState?.role && !localStorage.getItem("registration_role")) {
      navigate("/register/role")
    }
  }, [locationState, navigate])

  useEffect(() => {
    if (selectedRegion) localStorage.setItem("registration_region", selectedRegion)
  }, [selectedRegion])

  useEffect(() => {
    if (selectedProvince) localStorage.setItem("registration_province", selectedProvince)
  }, [selectedProvince])

  useEffect(() => {
    if (selectedMunicipality) localStorage.setItem("registration_municipality", selectedMunicipality)
  }, [selectedMunicipality])

  useEffect(() => {
    if (selectedBarangay) localStorage.setItem("registration_barangay", selectedBarangay)
  }, [selectedBarangay])

  useEffect(() => {
    if (selectedRegion) {
      loadProvinces()
      setSelectedProvince("")
      setSelectedMunicipality("")
      setSelectedBarangay("")
      setProvinceSearch("")
      setMunicipalitySearch("")
      setBarangaySearch("")
    }
  }, [selectedRegion])

  useEffect(() => {
    if (selectedProvince) {
      loadMunicipalities()
      setSelectedMunicipality("")
      setSelectedBarangay("")
      setMunicipalitySearch("")
      setBarangaySearch("")
    }
  }, [selectedProvince])

  useEffect(() => {
    if (selectedMunicipality) {
      loadBarangays()
      setSelectedBarangay("")
      setBarangaySearch("")
    }
  }, [selectedMunicipality])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(event.target as Node)) {
        setShowRegionDropdown(false)
      }
      if (provinceRef.current && !provinceRef.current.contains(event.target as Node)) {
        setShowProvinceDropdown(false)
      }
      if (municipalityRef.current && !municipalityRef.current.contains(event.target as Node)) {
        setShowMunicipalityDropdown(false)
      }
      if (barangayRef.current && !barangayRef.current.contains(event.target as Node)) {
        setShowBarangayDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const loadProvinces = async () => {
  if (!selectedRegion) return;

  console.log("Loading provinces for region:", selectedRegion);
  setIsLoading(true);
  setProvinces([]);

  try {
    const regionTable = selectedRegion;

    let allRows: any[] = [];
    let pageSize = 1000;
    let from = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from(regionTable)
        .select("PROVINCE")
        .not("PROVINCE", "is", null)
        .neq("PROVINCE", "")
        .range(from, from + pageSize - 1)
        .throwOnError();

      if (error) {
        console.error("Error in province range query:", error);
        break;
      }

      allRows.push(...(data ?? []));
      console.log(`Fetched ${data.length} rows (Total so far: ${allRows.length})`);

      hasMore = data.length === pageSize;
      from += pageSize;
    }

    const allProvinces = allRows
      .map((row: any) => row.PROVINCE)
      .filter(
        (province: any) =>
          province &&
          typeof province === "string" &&
          province.trim() !== "" &&
          province.toLowerCase() !== "null" &&
          province.toLowerCase() !== "undefined"
      );

    const uniqueProvinces = [...new Set(allProvinces)].sort();
    console.log("Unique provinces:", uniqueProvinces);

    setProvinces(uniqueProvinces);
  } catch (error) {
    console.error("Exception while loading provinces:", error);
    setProvinces([]);
  } finally {
    setIsLoading(false);
  }
};


 const loadMunicipalities = async () => {
  if (!selectedRegion || !selectedProvince) return;

  console.log("Loading municipalities for region:", selectedRegion, "province:", selectedProvince);
  setIsLoading(true);
  setMunicipalities([]);

  try {
    const regionTable = selectedRegion;

    let allRows: any[] = [];
    let pageSize = 1000;
    let from = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from(regionTable)
        .select('"CITY/MUNICIPALITY"')
        .eq("PROVINCE", selectedProvince)
        .not('"CITY/MUNICIPALITY"', "is", null)
        .neq('"CITY/MUNICIPALITY"', "")
        .range(from, from + pageSize - 1)
        .throwOnError();

      if (error) {
        console.error("Error in municipality range query:", error);
        break;
      }

      allRows.push(...(data ?? []));
      console.log(`Fetched ${data.length} municipalities (Total so far: ${allRows.length})`);

      hasMore = data.length === pageSize;
      from += pageSize;
    }

    const validMunicipalities = allRows
      .map((item: any) => item["CITY/MUNICIPALITY"])
      .filter(
        (municipality: any) =>
          municipality &&
          typeof municipality === "string" &&
          municipality.trim() !== "" &&
          municipality.toLowerCase() !== "null" &&
          municipality.toLowerCase() !== "undefined"
      );

    const uniqueMunicipalities = [...new Set(validMunicipalities)].sort();
    console.log("Processed municipalities:", uniqueMunicipalities);

    setMunicipalities(uniqueMunicipalities);
  } catch (error) {
    console.error("Error loading municipalities:", error);
  } finally {
    setIsLoading(false);
  }
};

  const loadBarangays = async () => {
  if (!selectedRegion || !selectedProvince || !selectedMunicipality) return;

  console.log(
    "Loading barangays for region:",
    selectedRegion,
    "province:",
    selectedProvince,
    "municipality:",
    selectedMunicipality
  );

  setIsLoading(true);
  setBarangays([]);

  try {
    const regionTable = selectedRegion;

    let allRows: any[] = [];
    let pageSize = 1000;
    let from = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from(regionTable)
        .select("BARANGAY")
        .eq("PROVINCE", selectedProvince)
        .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
        .not("BARANGAY", "is", null)
        .neq("BARANGAY", "")
        .range(from, from + pageSize - 1)
        .throwOnError();

      if (error) {
        console.error("Error in barangay range query:", error);
        break;
      }

      allRows.push(...(data ?? []));
      console.log(`Fetched ${data.length} barangays (Total so far: ${allRows.length})`);

      hasMore = data.length === pageSize;
      from += pageSize;
    }

    const validBarangays = allRows
      .map((item: any) => item.BARANGAY)
      .filter(
        (barangay: any) =>
          barangay &&
          typeof barangay === "string" &&
          barangay.trim() !== "" &&
          barangay.toLowerCase() !== "null" &&
          barangay.toLowerCase() !== "undefined"
      );

    const uniqueBarangays = [...new Set(validBarangays)].sort();
    console.log("Processed barangays:", uniqueBarangays);

    setBarangays(uniqueBarangays);
  } catch (error) {
    console.error("Error loading barangays:", error);
    setBarangays([]);
  } finally {
    setIsLoading(false);
  }
};


  const handleNext = () => {
    if (selectedRegion && selectedProvince && selectedMunicipality && selectedBarangay) {
      // Save all location data to localStorage before navigation
      localStorage.setItem("registration_region", selectedRegion)
      localStorage.setItem("registration_province", selectedProvince)
      localStorage.setItem("registration_municipality", selectedMunicipality)
      localStorage.setItem("registration_barangay", selectedBarangay)

      const nextState = {
        role: userRole,
        region: selectedRegion,
        province: selectedProvince,
        municipality: selectedMunicipality,
        barangay: selectedBarangay,
      }
      if (userRole === "official") {
        navigate("/register/officials", {
          state: nextState,
        })
      } else {
        // Resident goes directly to register
        navigate("/register", {
          state: nextState,
        })
      }
    }
  }

  const handleBack = () => {
    navigate("/register/role")
  }

  const handleRegionSelect = (region: {
    code: string
    name: string
  }) => {
    setSelectedRegion(region.code)
    setRegionSearch(region.name)
    setShowRegionDropdown(false)
  }

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province)
    setProvinceSearch(toTitleCase(province))
    setShowProvinceDropdown(false)
  }

  const handleMunicipalitySelect = (municipality: string) => {
    setSelectedMunicipality(municipality)
    setMunicipalitySearch(toTitleCase(municipality))
    setShowMunicipalityDropdown(false)
  }

  const handleBarangaySelect = (barangay: string) => {
    setSelectedBarangay(barangay)
    setBarangaySearch(toTitleCase(barangay))
    setShowBarangayDropdown(false)
  }

  const handleRegionFocus = () => {
    if (selectedRegion) {
      setRegionSearch("")
    }
    setShowRegionDropdown(true)
  }

  const handleProvinceFocus = () => {
    if (selectedProvince) {
      setProvinceSearch("")
    }
    setShowProvinceDropdown(true)
  }

  const handleMunicipalityFocus = () => {
    if (selectedMunicipality) {
      setMunicipalitySearch("")
    }
    setShowMunicipalityDropdown(true)
  }

  const handleBarangayFocus = () => {
    if (selectedBarangay) {
      setBarangaySearch("")
    }
    setShowBarangayDropdown(true)
  }

  const handleRegionBlur = () => {
    // If no region was selected and they blur, restore the previous selection
    if (!regionSearch && selectedRegion) {
      const selectedRegionObj = PHILIPPINE_REGIONS.find((r) => r.code === selectedRegion)
      if (selectedRegionObj) {
        setRegionSearch(selectedRegionObj.name)
      }
    }
  }

  const handleProvinceBlur = () => {
    if (!provinceSearch && selectedProvince) {
      setProvinceSearch(toTitleCase(selectedProvince))
    }
  }

  const handleMunicipalityBlur = () => {
    if (!municipalitySearch && selectedMunicipality) {
      setMunicipalitySearch(toTitleCase(selectedMunicipality))
    }
  }

  const handleBarangayBlur = () => {
    if (!barangaySearch && selectedBarangay) {
      setBarangaySearch(toTitleCase(selectedBarangay))
    }
  }

  const filteredRegions = PHILIPPINE_REGIONS.filter(
    (region) =>
      region.name.toLowerCase().includes(regionSearch.toLowerCase()) ||
      region.code.toLowerCase().includes(regionSearch.toLowerCase()),
  )
  const filteredProvinces = provinces.filter((p) => p.toLowerCase().includes(provinceSearch.toLowerCase()))
  const filteredMunicipalities = municipalities.filter((municipality) =>
    municipality.toLowerCase().includes(municipalitySearch.toLowerCase()),
  )
  const filteredBarangays = barangays.filter((barangay) =>
    barangay.toLowerCase().includes(barangaySearch.toLowerCase()),
  )
  const isFormValid = selectedRegion && selectedProvince && selectedMunicipality && selectedBarangay

  useEffect(() => {
    console.log("All provinces from Supabase:", provinces)
    if (!provinces.includes("ZAMBALES")) {
      console.warn("ZAMBALES is missing from provinces array!")
    }
    console.log("Province search term:", provinceSearch)
    console.log("Filtered provinces:", filteredProvinces)
  }, [provinces, provinceSearch, filteredProvinces])

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className={`h-1 w-2/5 ${userRole === "official" ? "bg-red-600" : "bg-blue-600"}`}></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
          <button onClick={handleBack} className="text-red-600 hover:text-red-700">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-red-600">Location</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 bg-gray-50">
          {/* Region Searchable Dropdown */}
          <div className="relative" ref={regionRef}>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Region</Label>
            <div className="relative">
              <Input
                placeholder="Search and select region..."
                value={regionSearch}
                onChange={(e) => setRegionSearch(e.target.value)}
                onFocus={handleRegionFocus}
                onBlur={handleRegionBlur}
                className="h-12 pr-20"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {regionSearch && (
                  <button
                    onClick={() => {
                      setRegionSearch("")
                      setSelectedRegion("")
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${showRegionDropdown ? "rotate-180" : ""}`}
                />
              </div>
            </div>
            {showRegionDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {selectedRegion && (
                  <button
                    onClick={() => handleRegionSelect(PHILIPPINE_REGIONS.find((r) => r.code === selectedRegion)!)}
                    className="w-full text-left py-3 px-4 bg-blue-50 border-b border-gray-100 flex items-center gap-2"
                  >
                    <Check className="h-4 w-4 text-blue-600" />
                    {PHILIPPINE_REGIONS.find((r) => r.code === selectedRegion)?.name}
                  </button>
                )}
                {filteredRegions
                  .filter((r) => r.code !== selectedRegion)
                  .map((region, index) => (
                    <button
                      key={index}
                      onClick={() => handleRegionSelect(region)}
                      className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {region.name}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Province Searchable Dropdown */}
          <div className="relative" ref={provinceRef}>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Province</Label>
            <div className="relative">
              <Input
                placeholder="Search and select province..."
                value={provinceSearch}
                onChange={(e) => setProvinceSearch(e.target.value)}
                onFocus={handleProvinceFocus}
                onBlur={handleProvinceBlur}
                disabled={!selectedRegion}
                className={`h-12 pr-20 ${!selectedRegion ? "opacity-50 cursor-not-allowed" : ""}`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {provinceSearch && (
                  <button
                    onClick={() => {
                      setProvinceSearch("")
                      setSelectedProvince("")
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${showProvinceDropdown ? "rotate-180" : ""}`}
                />
              </div>
            </div>
            {showProvinceDropdown && selectedRegion && (
              <div
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
                style={{ maxHeight: "240px", overflowY: "auto" }}
              >
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading provinces...</div>
                ) : (
                  <>
                    {selectedProvince && (
                      <button
                        onClick={() => handleProvinceSelect(selectedProvince)}
                        className="w-full text-left py-3 px-4 bg-blue-50 border-b border-gray-100 flex items-center gap-2"
                      >
                        <Check className="h-4 w-4 text-blue-600" />
                        {toTitleCase(selectedProvince)}
                      </button>
                    )}
                    {filteredProvinces.filter((p) => p !== selectedProvince).length === 0 && provinces.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No provinces found for this region
                        <br />
                        <small className="text-xs">Check console for debugging info</small>
                      </div>
                    ) : filteredProvinces.filter((p) => p !== selectedProvince).length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No provinces match your search</div>
                    ) : (
                      filteredProvinces
                        .filter((p) => p !== selectedProvince)
                        .map((province, index) => (
                          <button
                            key={province}
                            onClick={() => handleProvinceSelect(province)}
                            className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            {toTitleCase(province)}
                          </button>
                        ))
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Municipality Dropdown */}
          <div className="relative" ref={municipalityRef}>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Select City/Municipality</Label>
            <div className="relative">
              <Input
                placeholder="Search and select city/municipality..."
                value={municipalitySearch}
                onChange={(e) => setMunicipalitySearch(e.target.value)}
                onFocus={handleMunicipalityFocus}
                onBlur={handleMunicipalityBlur}
                disabled={!selectedProvince}
                className={`h-12 pr-20 ${!selectedProvince ? "opacity-50 cursor-not-allowed" : ""}`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {municipalitySearch && (
                  <button
                    onClick={() => {
                      setMunicipalitySearch("")
                      setSelectedMunicipality("")
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${showMunicipalityDropdown ? "rotate-180" : ""}`}
                />
              </div>
            </div>
            {showMunicipalityDropdown && selectedProvince && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading municipalities...</div>
                ) : (
                  <>
                    {selectedMunicipality && (
                      <button
                        onClick={() => handleMunicipalitySelect(selectedMunicipality)}
                        className="w-full text-left py-3 px-4 bg-blue-50 border-b border-gray-100 flex items-center gap-2"
                      >
                        <Check className="h-4 w-4 text-blue-600" />
                        {toTitleCase(selectedMunicipality)}
                      </button>
                    )}
                    {filteredMunicipalities.filter((m) => m !== selectedMunicipality).length === 0 &&
                    municipalities.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No municipalities found for this province</div>
                    ) : filteredMunicipalities.filter((m) => m !== selectedMunicipality).length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No municipalities match your search</div>
                    ) : (
                      filteredMunicipalities
                        .filter((m) => m !== selectedMunicipality)
                        .map((municipality, index) => (
                          <button
                            key={index}
                            onClick={() => handleMunicipalitySelect(municipality)}
                            className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            {toTitleCase(municipality)}
                          </button>
                        ))
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Barangay Dropdown */}
          <div className="relative" ref={barangayRef}>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Barangay</Label>
            <div className="relative">
              <Input
                placeholder="Search and select barangay..."
                value={barangaySearch}
                onChange={(e) => setBarangaySearch(e.target.value)}
                onFocus={handleBarangayFocus}
                onBlur={handleBarangayBlur}
                disabled={!selectedMunicipality}
                className={`h-12 pr-20 ${!selectedMunicipality ? "opacity-50 cursor-not-allowed" : ""}`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {barangaySearch && (
                  <button
                    onClick={() => {
                      setBarangaySearch("")
                      setSelectedBarangay("")
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${showBarangayDropdown ? "rotate-180" : ""}`}
                />
              </div>
            </div>
            {showBarangayDropdown && selectedMunicipality && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading barangays...</div>
                ) : (
                  <>
                    {selectedBarangay && (
                      <button
                        onClick={() => handleBarangaySelect(selectedBarangay)}
                        className="w-full text-left py-3 px-4 bg-blue-50 border-b border-gray-100 flex items-center gap-2"
                      >
                        <Check className="h-4 w-4 text-blue-600" />
                        {toTitleCase(selectedBarangay)}
                      </button>
                    )}
                    {filteredBarangays.filter((b) => b !== selectedBarangay).length === 0 && barangays.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No barangays found for this municipality</div>
                    ) : filteredBarangays.filter((b) => b !== selectedBarangay).length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No barangays match your search</div>
                    ) : (
                      filteredBarangays
                        .filter((b) => b !== selectedBarangay)
                        .map((barangay, index) => (
                          <button
                            key={index}
                            onClick={() => handleBarangaySelect(barangay)}
                            className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">{toTitleCase(barangay)}</div>
                          </button>
                        ))
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Selected Barangay Display */}
          {selectedBarangay && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-center">
                <div className="font-semibold text-green-900 text-lg">{toTitleCase(selectedBarangay)}</div>
                <div className="text-sm text-green-600">Barangay Selected</div>
              </div>
            </div>
          )}
        </div>

        {/* Next Button */}
        <div className="p-6 bg-gray-50 border-t">
          <Button
            onClick={handleNext}
            disabled={!isFormValid}
            className={`w-full text-white py-4 h-12 text-base font-medium rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed ${userRole === "official" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            Next
          </Button>
        </div>
      </div>
    )
  }

  // Desktop version
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-visible">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className={`h-1 w-2/5 ${userRole === "official" ? "bg-red-600" : "bg-blue-600"}`}></div>
        </div>

        <div className="p-8 bg-white">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-sm text-red-600 mb-6 hover:text-red-700"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>

          <div className="space-y-6">
            {/* Region Searchable Dropdown */}
            <div className="relative" ref={regionRef}>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Region</Label>
              <div className="relative">
                <Input
                  placeholder="Search and select region..."
                  value={regionSearch}
                  onChange={(e) => setRegionSearch(e.target.value)}
                  onFocus={handleRegionFocus}
                  onBlur={handleRegionBlur}
                  className="h-12 pr-20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {regionSearch && (
                    <button
                      onClick={() => {
                        setRegionSearch("")
                        setSelectedRegion("")
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${showRegionDropdown ? "rotate-180" : ""}`}
                  />
                </div>
              </div>
              {showRegionDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {selectedRegion && (
                    <button
                      onClick={() => handleRegionSelect(PHILIPPINE_REGIONS.find((r) => r.code === selectedRegion)!)}
                      className="w-full text-left py-3 px-4 bg-blue-50 border-b border-gray-100 flex items-center gap-2"
                    >
                      <Check className="h-4 w-4 text-blue-600" />
                      {PHILIPPINE_REGIONS.find((r) => r.code === selectedRegion)?.name}
                    </button>
                  )}
                  {filteredRegions
                    .filter((r) => r.code !== selectedRegion)
                    .map((region, index) => (
                      <button
                        key={index}
                        onClick={() => handleRegionSelect(region)}
                        className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        {region.name}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Province Searchable Dropdown */}
            <div className="relative" ref={provinceRef}>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Province</Label>
              <div className="relative">
                <Input
                  placeholder="Search and select province..."
                  value={provinceSearch}
                  onChange={(e) => setProvinceSearch(e.target.value)}
                  onFocus={handleProvinceFocus}
                  onBlur={handleProvinceBlur}
                  disabled={!selectedRegion}
                  className={`h-12 pr-20 ${!selectedRegion ? "opacity-50 cursor-not-allowed" : ""}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {provinceSearch && (
                    <button
                      onClick={() => {
                        setProvinceSearch("")
                        setSelectedProvince("")
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${showProvinceDropdown ? "rotate-180" : ""}`}
                  />
                </div>
              </div>
              {showProvinceDropdown && selectedRegion && (
                <div
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
                  style={{ maxHeight: "240px", overflowY: "auto" }}
                >
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading provinces...</div>
                  ) : (
                    <>
                      {selectedProvince && (
                        <button
                          onClick={() => handleProvinceSelect(selectedProvince)}
                          className="w-full text-left py-3 px-4 bg-blue-50 border-b border-gray-100 flex items-center gap-2"
                        >
                          <Check className="h-4 w-4 text-blue-600" />
                          {toTitleCase(selectedProvince)}
                        </button>
                      )}
                      {filteredProvinces.filter((p) => p !== selectedProvince).length === 0 &&
                      provinces.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No provinces found for this region
                          <br />
                          <small className="text-xs">Check console for debugging info</small>
                        </div>
                      ) : filteredProvinces.filter((p) => p !== selectedProvince).length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No provinces match your search</div>
                      ) : (
                        filteredProvinces
                          .filter((p) => p !== selectedProvince)
                          .map((province, index) => (
                            <button
                              key={province}
                              onClick={() => handleProvinceSelect(province)}
                              className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              {toTitleCase(province)}
                            </button>
                          ))
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Municipality Dropdown */}
            <div className="relative" ref={municipalityRef}>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Select City/Municipality</Label>
              <div className="relative">
                <Input
                  placeholder="Search and select city/municipality..."
                  value={municipalitySearch}
                  onChange={(e) => setMunicipalitySearch(e.target.value)}
                  onFocus={handleMunicipalityFocus}
                  onBlur={handleMunicipalityBlur}
                  disabled={!selectedProvince}
                  className={`h-12 pr-20 ${!selectedProvince ? "opacity-50 cursor-not-allowed" : ""}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {municipalitySearch && (
                    <button
                      onClick={() => {
                        setMunicipalitySearch("")
                        setSelectedMunicipality("")
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${showMunicipalityDropdown ? "rotate-180" : ""}`}
                  />
                </div>
              </div>
              {showMunicipalityDropdown && selectedProvince && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading municipalities...</div>
                  ) : (
                    <>
                      {selectedMunicipality && (
                        <button
                          onClick={() => handleMunicipalitySelect(selectedMunicipality)}
                          className="w-full text-left py-3 px-4 bg-blue-50 border-b border-gray-100 flex items-center gap-2"
                        >
                          <Check className="h-4 w-4 text-blue-600" />
                          {toTitleCase(selectedMunicipality)}
                        </button>
                      )}
                      {filteredMunicipalities.filter((m) => m !== selectedMunicipality).length === 0 &&
                      municipalities.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No municipalities found for this province</div>
                      ) : filteredMunicipalities.filter((m) => m !== selectedMunicipality).length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No municipalities match your search</div>
                      ) : (
                        filteredMunicipalities
                          .filter((m) => m !== selectedMunicipality)
                          .map((municipality, index) => (
                            <button
                              key={index}
                              onClick={() => handleMunicipalitySelect(municipality)}
                              className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              {toTitleCase(municipality)}
                            </button>
                          ))
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Barangay Dropdown */}
            <div className="relative" ref={barangayRef}>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Barangay</Label>
              <div className="relative">
                <Input
                  placeholder="Search and select barangay..."
                  value={barangaySearch}
                  onChange={(e) => setBarangaySearch(e.target.value)}
                  onFocus={handleBarangayFocus}
                  onBlur={handleBarangayBlur}
                  disabled={!selectedMunicipality}
                  className={`h-12 pr-20 ${!selectedMunicipality ? "opacity-50 cursor-not-allowed" : ""}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {barangaySearch && (
                    <button
                      onClick={() => {
                        setBarangaySearch("")
                        setSelectedBarangay("")
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${showBarangayDropdown ? "rotate-180" : ""}`}
                  />
                </div>
              </div>
              {showBarangayDropdown && selectedMunicipality && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading barangays...</div>
                  ) : (
                    <>
                      {selectedBarangay && (
                        <button
                          onClick={() => handleBarangaySelect(selectedBarangay)}
                          className="w-full text-left py-3 px-4 bg-blue-50 border-b border-gray-100 flex items-center gap-2"
                        >
                          <Check className="h-4 w-4 text-blue-600" />
                          {toTitleCase(selectedBarangay)}
                        </button>
                      )}
                      {filteredBarangays.filter((b) => b !== selectedBarangay).length === 0 &&
                      barangays.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No barangays found for this municipality</div>
                      ) : filteredBarangays.filter((b) => b !== selectedBarangay).length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No barangays match your search</div>
                      ) : (
                        filteredBarangays
                          .filter((b) => b !== selectedBarangay)
                          .map((barangay, index) => (
                            <button
                              key={index}
                              onClick={() => handleBarangaySelect(barangay)}
                              className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900">{toTitleCase(barangay)}</div>
                            </button>
                          ))
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Selected Barangay Display */}
            {selectedBarangay && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-center">
                  <div className="font-semibold text-green-900 text-lg">{toTitleCase(selectedBarangay)}</div>
                  <div className="text-sm text-green-600">Barangay Selected</div>
                </div>
              </div>
            )}
          </div>

          {/* Next Button */}
          <div className="mt-8">
            <Button
              onClick={handleNext}
              disabled={!isFormValid}
              className={`w-full text-white py-4 h-12 text-base font-medium rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed ${userRole === "official" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
