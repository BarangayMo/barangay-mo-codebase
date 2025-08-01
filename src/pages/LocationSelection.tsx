"use client"
//new-changes
import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronDown, X, Check, Lock } from "lucide-react"
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

// Province to Region mapping based on your data
const PROVINCE_TO_REGION_MAP = {
  // NCR
  "CITY OF MANDALUYONG": "NCR",
  "CITY OF NAVOTAS": "NCR",
  "CITY OF MAKATI": "NCR",
  "CITY OF MALABON": "NCR",
  "CITY OF SAN JUAN": "NCR",
  "PASAY CITY": "NCR",
  "CITY OF MARIKINA": "NCR",
  "QUEZON CITY": "NCR",
  "CITY OF PASIG": "NCR",
  "CITY OF CALOOCAN": "NCR",
  "PATEROS": "NCR",
  "CITY OF TAGUIG": "NCR",
  "CITY OF LAS PIñAS": "NCR",
  "CITY OF VALENZUELA": "NCR",
  "CITY OF MANILA": "NCR",
  "CITY OF PARAñAQUE": "NCR",
  "CITY OF MUNTINLUPA": "NCR",

  // REGION 1
  "ILOCOS NORTE": "REGION 1",
  "LA UNION": "REGION 1",
  "PANGASINAN": "REGION 1",
  "ILOCOS SUR": "REGION 1",

  // REGION 2
  "QUIRINO": "REGION 2",
  "NUEVA VIZCAYA": "REGION 2",
  "ISABELA": "REGION 2",
  "BATANES": "REGION 2",
  "CAGAYAN": "REGION 2",

  // REGION 3
  "NUEVA ECIJA": "REGION 3",
  "ZAMBALES": "REGION 3",
  "BULACAN": "REGION 3",
  "PAMPANGA": "REGION 3",
  "AURORA": "REGION 3",
  "TARLAC": "REGION 3",
  "BATAAN": "REGION 3",

  // REGION 4A
  "CAVITE": "REGION 4A",
  "BATANGAS": "REGION 4A",
  "RIZAL": "REGION 4A",
  "QUEZON": "REGION 4A",
  "LAGUNA": "REGION 4A",

  // REGION 4B
  "PALAWAN": "REGION 4B",
  "CITY OF PUERTO PRINCESA (CAPITAL)": "REGION 4B",
  "OCCIDENTAL MINDORO": "REGION 4B",
  "ROMBLON": "REGION 4B",
  "MARINDUQUE": "REGION 4B",
  "ORIENTAL MINDORO": "REGION 4B",

  // REGION 5
  "CATANDUANES": "REGION 5",
  "SORSOGON": "REGION 5",
  "CAMARINES NORTE": "REGION 5",
  "CAMARINES SUR": "REGION 5",
  "MASBATE": "REGION 5",
  "ALBAY": "REGION 5",

  // REGION 6
  "NEGROS OCCIDENTAL": "REGION 6",
  "CITY OF ILOILO (CAPITAL)": "REGION 6",
  "GUIMARAS": "REGION 6",
  "ILOILO": "REGION 6",
  "CITY OF BACOLOD (CAPITAL)": "REGION 6",
  "AKLAN": "REGION 6",
  "ANTIQUE": "REGION 6",
  "CAPIZ": "REGION 6",

  // REGION 7
  "SIQUIJOR": "REGION 7",
  "CEBU": "REGION 7",
  "BOHOL": "REGION 7",
  "CITY OF LAPU-LAPU": "REGION 7",
  "CITY OF MANDAUE": "REGION 7",
  "CITY OF CEBU (CAPITAL)": "REGION 7",
  "NEGROS ORIENTAL": "REGION 7",

  // REGION 8
  "SAMAR (WESTERN SAMAR)": "REGION 8",
  "CITY OF TACLOBAN (CAPITAL)": "REGION 8",
  "EASTERN SAMAR": "REGION 8",
  "NORTHERN SAMAR": "REGION 8",
  "SOUTHERN LEYTE": "REGION 8",
  "LEYTE": "REGION 8",
  "BILIRAN": "REGION 8",

  // REGION 9
  "CITY OF ISABELA (Not a Province)": "REGION 9",
  "ZAMBOANGA SIBUGAY": "REGION 9",
  "CITY OF ZAMBOANGA": "REGION 9",
  "ZAMBOANGA DEL NORTE": "REGION 9",
  "ZAMBOANGA DEL SUR": "REGION 9",

  // REGION 10
  "CITY OF CAGAYAN DE ORO (CAPITAL)": "REGION 10",
  "LANAO DEL NORTE": "REGION 10",
  "MISAMIS OCCIDENTAL": "REGION 10",
  "MISAMIS ORIENTAL": "REGION 10",
  "CAMIGUIN": "REGION 10",
  "BUKIDNON": "REGION 10",
  "CITY OF ILIGAN": "REGION 10",

  // REGION 11
  "DAVAO DEL NORTE": "REGION 11",
  "DAVAO DE ORO": "REGION 11",
  "DAVAO ORIENTAL": "REGION 11",
  "DAVAO OCCIDENTAL": "REGION 11",
  "DAVAO DEL SUR": "REGION 11",
  "CITY OF DAVAO": "REGION 11",

  // REGION 12
  "COTABATO (NORTH COTABATO)": "REGION 12",
  "CITY OF GENERAL SANTOS": "REGION 12",
  "SULTAN KUDARAT": "REGION 12",
  "SOUTH COTABATO": "REGION 12",
  "SARANGANI": "REGION 12",

  // REGION 13
  "AGUSAN DEL NORTE": "REGION 13",
  "SURIGAO DEL NORTE": "REGION 13",
  "AGUSAN DEL SUR": "REGION 13",
  "CITY OF BUTUAN (CAPITAL)": "REGION 13",
  "DINAGAT ISLANDS": "REGION 13",
  "SURIGAO DEL SUR": "REGION 13",

  // CAR
  "CITY OF BAGUIO": "CAR",
  "KALINGA": "CAR",
  "BENGUET": "CAR",
  "APAYAO": "CAR",
  "ABRA": "CAR",
  "MOUNTAIN PROVINCE": "CAR",
  "IFUGAO": "CAR",

  // BARMM
  "SPECIAL GOVERNMENT UNIT": "BARMM",
  "BASILAN": "BARMM",
  "LANAO DEL SUR": "BARMM",
  "SULU": "BARMM",
  "TAWI-TAWI": "BARMM",
  "Maguindanao del Norte": "BARMM",
  "Maguindanao del Sur": "BARMM",
}

// Helper function to convert text to title case
const toTitleCase = (str: string) => {
  return str.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
}

export default function LocationSelection() {
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const locationState = location.state

  // Get all provinces from the mapping
  const allProvinces = Object.keys(PROVINCE_TO_REGION_MAP).sort()

  const [selectedProvince, setSelectedProvince] = useState(() => {
    return localStorage.getItem("registration_province") || location.state?.province || ""
  })
  const [selectedRegion, setSelectedRegion] = useState(() => {
    const savedProvince = localStorage.getItem("registration_province") || location.state?.province
    return savedProvince ? PROVINCE_TO_REGION_MAP[savedProvince] || "" : localStorage.getItem("registration_region") || location.state?.region || ""
  })
  const [selectedMunicipality, setSelectedMunicipality] = useState(() => {
    return localStorage.getItem("registration_municipality") || location.state?.municipality || ""
  })
  const [selectedBarangay, setSelectedBarangay] = useState(() => {
    return localStorage.getItem("registration_barangay") || location.state?.barangay || ""
  })

  const [municipalities, setMunicipalities] = useState<string[]>([])
  const [barangays, setBarangays] = useState<string[]>([])

  const [provinceSearch, setProvinceSearch] = useState(() => {
    const savedProvince = localStorage.getItem("registration_province") || location.state?.province
    return savedProvince ? toTitleCase(savedProvince) : ""
  })
  const [regionSearch, setRegionSearch] = useState(() => {
    const savedProvince = localStorage.getItem("registration_province") || location.state?.province
    if (savedProvince) {
      const regionCode = PROVINCE_TO_REGION_MAP[savedProvince]
      if (regionCode) {
        const regionObj = PHILIPPINE_REGIONS.find((r) => r.code === regionCode)
        return regionObj?.name || ""
      }
    }
    const savedRegion = localStorage.getItem("registration_region") || location.state?.region
    if (savedRegion) {
      const regionObj = PHILIPPINE_REGIONS.find((r) => r.code === savedRegion)
      return regionObj?.name || ""
    }
    return ""
  })
  const [municipalitySearch, setMunicipalitySearch] = useState(() => {
    const savedMunicipality = localStorage.getItem("registration_municipality") || location.state?.municipality
    return savedMunicipality ? toTitleCase(savedMunicipality) : ""
  })
  const [barangaySearch, setBarangaySearch] = useState(() => {
    const savedBarangay = localStorage.getItem("registration_barangay") || location.state?.barangay
    return savedBarangay ? toTitleCase(savedBarangay) : ""
  })

  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false)
  const [showRegionDropdown, setShowRegionDropdown] = useState(false)
  const [showMunicipalityDropdown, setShowMunicipalityDropdown] = useState(false)
  const [showBarangayDropdown, setShowBarangayDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const provinceRef = useRef<HTMLDivElement>(null)
  const regionRef = useRef<HTMLDivElement>(null)
  const municipalityRef = useRef<HTMLDivElement>(null)
  const barangayRef = useRef<HTMLDivElement>(null)

  const userRole = localStorage.getItem("registration_role") || locationState?.role

  useEffect(() => {
    if (!locationState?.role && !localStorage.getItem("registration_role")) {
      navigate("/register/role")
    }
  }, [locationState, navigate])

  useEffect(() => {
    if (selectedProvince) localStorage.setItem("registration_province", selectedProvince)
  }, [selectedProvince])

  useEffect(() => {
    if (selectedRegion) localStorage.setItem("registration_region", selectedRegion)
  }, [selectedRegion])

  useEffect(() => {
    if (selectedMunicipality) localStorage.setItem("registration_municipality", selectedMunicipality)
  }, [selectedMunicipality])

  useEffect(() => {
    if (selectedBarangay) localStorage.setItem("registration_barangay", selectedBarangay)
  }, [selectedBarangay])

  // Auto-update region when province changes
  useEffect(() => {
    if (selectedProvince && PROVINCE_TO_REGION_MAP[selectedProvince]) {
      const newRegion = PROVINCE_TO_REGION_MAP[selectedProvince]
      setSelectedRegion(newRegion)
      
      const regionObj = PHILIPPINE_REGIONS.find((r) => r.code === newRegion)
      if (regionObj) {
        setRegionSearch(regionObj.name)
      }

      // Clear dependent selections
      setSelectedMunicipality("")
      setSelectedBarangay("")
      setMunicipalitySearch("")
      setBarangaySearch("")
    }
  }, [selectedProvince])

  useEffect(() => {
    if (selectedProvince && selectedRegion) {
      loadMunicipalities()
      setSelectedMunicipality("")
      setSelectedBarangay("")
      setMunicipalitySearch("")
      setBarangaySearch("")
    }
  }, [selectedProvince, selectedRegion])

  useEffect(() => {
    if (selectedMunicipality) {
      loadBarangays()
      setSelectedBarangay("")
      setBarangaySearch("")
    }
  }, [selectedMunicipality])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (provinceRef.current && !provinceRef.current.contains(event.target as Node)) {
        setShowProvinceDropdown(false)
      }
      if (regionRef.current && !regionRef.current.contains(event.target as Node)) {
        setShowRegionDropdown(false)
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

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province)
    setProvinceSearch(toTitleCase(province))
    setShowProvinceDropdown(false)
    
    // Auto-set region based on province
    const region = PROVINCE_TO_REGION_MAP[province]
    if (region) {
      setSelectedRegion(region)
      const regionObj = PHILIPPINE_REGIONS.find(r => r.code === region)
      if (regionObj) {
        setRegionSearch(regionObj.name)
      }
    }
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

  const filteredProvinces = allProvinces.filter((p) => p.toLowerCase().includes(provinceSearch.toLowerCase()))
  const filteredMunicipalities = municipalities.filter((municipality) =>
    municipality.toLowerCase().includes(municipalitySearch.toLowerCase()),
  )
  const filteredBarangays = barangays.filter((barangay) =>
    barangay.toLowerCase().includes(barangaySearch.toLowerCase()),
  )
  const isFormValid = selectedRegion && selectedProvince && selectedMunicipality && selectedBarangay

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className={`h-1 w-2/5 ${userRole === "official" ? "bg-red-600" : "bg-blue-600"}`}></div>
        </div>

       {/* Header */}
<div className="flex items-center justify-between px-4 py-3 border-b bg-white">
<button
  onClick={handleBack}
  className={`${
    userRole === 'resident'
      ? 'text-blue-600 hover:text-blue-700'
      : 'text-red-600 hover:text-red-700'
  }`}
>
  <ChevronLeft className="h-6 w-6" />
</button>

  <h1
    className={`text-lg font-semibold ${
      userRole === 'resident' ? 'text-blue-600' : 'text-red-600'
    }`}
  >
    Location
  </h1>
  <div className="w-6" />
</div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 bg-gray-50">
          {/* Province Searchable Dropdown - Now First */}
          <div className="relative" ref={provinceRef}>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Province</Label>
            <div className="relative">
              <Input
                placeholder="Search and select province..."
                value={provinceSearch}
                onChange={(e) => setProvinceSearch(e.target.value)}
                onFocus={handleProvinceFocus}
                onBlur={handleProvinceBlur}
                className="h-12 pr-20"
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
            {showProvinceDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {selectedProvince && (
                  <button
                    onClick={() => handleProvinceSelect(selectedProvince)}
                    className="w-full text-left py-3 px-4 bg-blue-50 border-b border-gray-100 flex items-center gap-2"
                  >
                    <Check className="h-4 w-4 text-blue-600" />
                    {toTitleCase(selectedProvince)}
                  </button>
                )}
                {filteredProvinces
                  .filter((p) => p !== selectedProvince)
                  .map((province, index) => (
                    <button
                      key={index}
                      onClick={() => handleProvinceSelect(province)}
                      className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {toTitleCase(province)}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Region Display - Now Read-only */}
          <div className="relative" ref={regionRef}>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Region (Auto-selected)
            </Label>
            <div className="relative">
              <Input
                value={regionSearch}
                readOnly
                disabled
                className="h-12 pr-20 bg-gray-50 text-gray-600 cursor-not-allowed"
                placeholder={selectedProvince ? "Region auto-selected..." : "Select a province first"}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {selectedRegion ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Lock className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
            {selectedRegion && (
              <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                <Check className="h-3 w-3" />
                Region automatically selected based on province
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
  className={`inline-flex items-center text-sm mb-6 hover:underline ${
    userRole === 'resident'
      ? 'text-blue-600 hover:text-blue-700'
      : 'text-red-600 hover:text-red-700'
  }`}
>
  <ChevronLeft className="w-4 h-4 mr-1" />
  Back
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