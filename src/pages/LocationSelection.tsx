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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Hardcoded province-region mapping
const PROVINCE_REGION_MAPPING = [
  { "region": "NCR", "PROVINCE": "CITY OF MANDALUYONG" },
  { "region": "REGION 7", "PROVINCE": "SIQUIJOR" },
  { "region": "REGION 5", "PROVINCE": "CATANDUANES" },
  { "region": "NCR", "PROVINCE": "CITY OF NAVOTAS" },
  { "region": "NCR", "PROVINCE": "CITY OF MAKATI" },
  { "region": "REGION 1", "PROVINCE": "ILOCOS NORTE" },
  { "region": "BARMM", "PROVINCE": "SPECIAL GOVERNMENT UNIT" },
  { "region": "REGION 2", "PROVINCE": "QUIRINO" },
  { "region": "REGION 4A", "PROVINCE": "CAVITE" },
  { "region": "BARMM", "PROVINCE": "BASILAN" },
  { "region": "REGION 4B", "PROVINCE": "PALAWAN" },
  { "region": "REGION 4B", "PROVINCE": "CITY OF PUERTO PRINCESA (CAPITAL)" },
  { "region": "REGION 3", "PROVINCE": "NUEVA ECIJA" },
  { "region": "REGION 3", "PROVINCE": "ZAMBALES" },
  { "region": "NCR", "PROVINCE": "CITY OF MALABON" },
  { "region": "REGION 6", "PROVINCE": "NEGROS OCCIDENTAL" },
  { "region": "REGION 1", "PROVINCE": "LA UNION" },
  { "region": "REGION 4B", "PROVINCE": "OCCIDENTAL MINDORO" },
  { "region": "NCR", "PROVINCE": "CITY OF SAN JUAN" },
  { "region": "REGION 7", "PROVINCE": "CEBU" },
  { "region": "REGION 6", "PROVINCE": "CITY OF ILOILO (CAPITAL)" },
  { "region": "REGION 4A", "PROVINCE": "BATANGAS" },
  { "region": "NCR", "PROVINCE": "PASAY CITY" },
  { "region": "REGION 4B", "PROVINCE": "ROMBLON" },
  { "region": "REGION 7", "PROVINCE": "BOHOL" },
  { "region": "REGION 7", "PROVINCE": "CITY OF LAPU-LAPU" },
  { "region": "REGION 5", "PROVINCE": "SORSOGON" },
  { "region": "REGION 6", "PROVINCE": "GUIMARAS" },
  { "region": "REGION 5", "PROVINCE": "CAMARINES NORTE" },
  { "region": "BARMM", "PROVINCE": "LANAO DEL SUR" },
  { "region": "REGION 7", "PROVINCE": "CITY OF MANDAUE" },
  { "region": "REGION 2", "PROVINCE": "NUEVA VIZCAYA" },
  { "region": "REGION 2", "PROVINCE": "ISABELA" },
  { "region": "REGION 5", "PROVINCE": "CAMARINES SUR" },
  { "region": "REGION 3", "PROVINCE": "BULACAN" },
  { "region": "NCR", "PROVINCE": "CITY OF MARIKINA" },
  { "region": "CAR", "PROVINCE": "CITY OF BAGUIO" },
  { "region": "CAR", "PROVINCE": "KALINGA" },
  { "region": "REGION 4B", "PROVINCE": "MARINDUQUE" },
  { "region": "REGION 6", "PROVINCE": "ILOILO" },
  { "region": "REGION 3", "PROVINCE": "PAMPANGA" },
  { "region": "CAR", "PROVINCE": "BENGUET" },
  { "region": "REGION 6", "PROVINCE": "CITY OF BACOLOD (CAPITAL)" },
  { "region": "NCR", "PROVINCE": "QUEZON CITY" },
  { "region": "CAR", "PROVINCE": "APAYAO" },
  { "region": "CAR", "PROVINCE": "ABRA" },
  { "region": "REGION 6", "PROVINCE": "AKLAN" },
  { "region": "REGION 2", "PROVINCE": "BATANES" },
  { "region": "CAR", "PROVINCE": "MOUNTAIN PROVINCE" },
  { "region": "NCR", "PROVINCE": "CITY OF PASIG" },
  { "region": "NCR", "PROVINCE": "CITY OF CALOOCAN" },
  { "region": "NCR", "PROVINCE": "PATEROS" },
  { "region": "REGION 3", "PROVINCE": "AURORA" },
  { "region": "REGION 3", "PROVINCE": "TARLAC" },
  { "region": "NCR", "PROVINCE": "CITY OF TAGUIG" },
  { "region": "REGION 6", "PROVINCE": "ANTIQUE" },
  { "region": "REGION 2", "PROVINCE": "CAGAYAN" },
  { "region": "NCR", "PROVINCE": "CITY OF LAS PIñAS" },
  { "region": "BARMM", "PROVINCE": "SULU" },
  { "region": "REGION 7", "PROVINCE": "CITY OF CEBU (CAPITAL)" },
  { "region": "REGION 4A", "PROVINCE": "RIZAL" },
  { "region": "REGION 1", "PROVINCE": "PANGASINAN" },
  { "region": "NCR", "PROVINCE": "CITY OF VALENZUELA" },
  { "region": "NCR", "PROVINCE": "CITY OF MANILA" },
  { "region": "REGION 6", "PROVINCE": "CAPIZ" },
  { "region": "REGION 3", "PROVINCE": "BATAAN" },
  { "region": "BARMM", "PROVINCE": "TAWI-TAWI" },
  { "region": "BARMM", "PROVINCE": "Maguindanao del Norte" },
  { "region": "REGION 4A", "PROVINCE": "QUEZON" },
  { "region": "REGION 1", "PROVINCE": "ILOCOS SUR" },
  { "region": "NCR", "PROVINCE": "CITY OF PARAñAQUE" },
  { "region": "NCR", "PROVINCE": "CITY OF MUNTINLUPA" },
  { "region": "REGION 7", "PROVINCE": "NEGROS ORIENTAL" },
  { "region": "CAR", "PROVINCE": "IFUGAO" },
  { "region": "BARMM", "PROVINCE": "Maguindanao del Sur" },
  { "region": "REGION 4B", "PROVINCE": "ORIENTAL MINDORO" },
  { "region": "REGION 5", "PROVINCE": "MASBATE" },
  { "region": "REGION 5", "PROVINCE": "ALBAY" },
  { "region": "REGION 4A", "PROVINCE": "LAGUNA" },
  { "region": "REGION 13", "PROVINCE": "AGUSAN DEL NORTE" },
  { "region": "REGION 11", "PROVINCE": "DAVAO DEL NORTE" },
  { "region": "REGION 13", "PROVINCE": "SURIGAO DEL NORTE" },
  { "region": "REGION 12", "PROVINCE": "COTABATO (NORTH COTABATO)" },
  { "region": "REGION 8", "PROVINCE": "SAMAR (WESTERN SAMAR)" },
  { "region": "REGION 11", "PROVINCE": "DAVAO DE ORO" },
  { "region": "REGION 8", "PROVINCE": "CITY OF TACLOBAN (CAPITAL)" },
  { "region": "REGION 10", "PROVINCE": "CITY OF CAGAYAN DE ORO (CAPITAL)" },
  { "region": "REGION 8", "PROVINCE": "EASTERN SAMAR" },
  { "region": "REGION 9", "PROVINCE": "CITY OF ISABELA (Not a Province)" },
  { "region": "REGION 8", "PROVINCE": "NORTHERN SAMAR" },
  { "region": "REGION 12", "PROVINCE": "CITY OF GENERAL SANTOS" },
  { "region": "REGION 11", "PROVINCE": "DAVAO ORIENTAL" },
  { "region": "REGION 12", "PROVINCE": "SULTAN KUDARAT" },
  { "region": "REGION 13", "PROVINCE": "AGUSAN DEL SUR" },
  { "region": "REGION 13", "PROVINCE": "CITY OF BUTUAN (CAPITAL)" },
  { "region": "REGION 10", "PROVINCE": "LANAO DEL NORTE" },
  { "region": "REGION 9", "PROVINCE": "ZAMBOANGA SIBUGAY" },
  { "region": "REGION 10", "PROVINCE": "MISAMIS OCCIDENTAL" },
  { "region": "REGION 10", "PROVINCE": "MISAMIS ORIENTAL" },
  { "region": "REGION 9", "PROVINCE": "CITY OF ZAMBOANGA" },
  { "region": "REGION 13", "PROVINCE": "DINAGAT ISLANDS" },
  { "region": "REGION 12", "PROVINCE": "SOUTH COTABATO" },
  { "region": "REGION 10", "PROVINCE": "CAMIGUIN" },
  { "region": "REGION 8", "PROVINCE": "SOUTHERN LEYTE" },
  { "region": "REGION 11", "PROVINCE": "DAVAO OCCIDENTAL" },
  { "region": "REGION 9", "PROVINCE": "ZAMBOANGA DEL NORTE" },
  { "region": "REGION 10", "PROVINCE": "BUKIDNON" },
  { "region": "REGION 9", "PROVINCE": "ZAMBOANGA DEL SUR" },
  { "region": "REGION 12", "PROVINCE": "SARANGANI" },
  { "region": "REGION 8", "PROVINCE": "LEYTE" },
  { "region": "REGION 11", "PROVINCE": "DAVAO DEL SUR" },
  { "region": "REGION 10", "PROVINCE": "CITY OF ILIGAN" },
  { "region": "REGION 13", "PROVINCE": "SURIGAO DEL SUR" },
  { "region": "REGION 8", "PROVINCE": "BILIRAN" },
  { "region": "REGION 11", "PROVINCE": "CITY OF DAVAO" }
]

// Get unique provinces from the mapping, sorted alphabetically
const AVAILABLE_PROVINCES = [...new Set(PROVINCE_REGION_MAPPING.map(item => item.PROVINCE))].sort()

// Helper function to get region from province
const getRegionFromProvince = (province: string): string => {
  const mapping = PROVINCE_REGION_MAPPING.find(item => item.PROVINCE === province)
  return mapping ? mapping.region : ""
}

// Hardcoded Philippine regions with their full names (for display purposes)
const PHILIPPINE_REGIONS = [
  { code: "REGION 1", name: "Ilocos Region (Region I)" },
  { code: "REGION 2", name: "Cagayan Valley (Region II)" },
  { code: "REGION 3", name: "Central Luzon (Region III)" },
  { code: "REGION 4A", name: "CALABARZON (Region IV-A)" },
  { code: "REGION 4B", name: "MIMAROPA (Region IV-B)" },
  { code: "REGION 5", name: "Bicol Region (Region V)" },
  { code: "REGION 6", name: "Western Visayas (Region VI)" },
  { code: "REGION 7", name: "Central Visayas (Region VII)" },
  { code: "REGION 8", name: "Eastern Visayas (Region VIII)" },
  { code: "REGION 9", name: "Zamboanga Peninsula (Region IX)" },
  { code: "REGION 10", name: "Northern Mindanao (Region X)" },
  { code: "REGION 11", name: "Davao Region (Region XI)" },
  { code: "REGION 12", name: "SOCCSKSARGEN (Region XII)" },
  { code: "REGION 13", name: "Caraga (Region XIII)" },
  { code: "NCR", name: "National Capital Region (NCR)" },
  { code: "CAR", name: "Cordillera Administrative Region (CAR)" },
  { code: "BARMM", name: "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)" },
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

  const [municipalities, setMunicipalities] = useState<string[]>([])
  const [barangays, setBarangays] = useState<string[]>([])

  const [municipalitySearch, setMunicipalitySearch] = useState(() => {
    const savedMunicipality = localStorage.getItem("registration_municipality") || location.state?.municipality
    return savedMunicipality ? toTitleCase(savedMunicipality) : ""
  })
  const [barangaySearch, setBarangaySearch] = useState(() => {
    const savedBarangay = localStorage.getItem("registration_barangay") || location.state?.barangay
    return savedBarangay ? toTitleCase(savedBarangay) : ""
  })

  const [showMunicipalityDropdown, setShowMunicipalityDropdown] = useState(false)
  const [showBarangayDropdown, setShowBarangayDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

  // Auto-detect region when province changes
  useEffect(() => {
    if (selectedProvince) {
      const detectedRegion = getRegionFromProvince(selectedProvince)
      if (detectedRegion) {
        setSelectedRegion(detectedRegion)
      }
    }
  }, [selectedProvince])

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
    if (!selectedRegion || !selectedProvince) return

    console.log("Loading municipalities for region:", selectedRegion, "province:", selectedProvince)
    setIsLoading(true)
    setMunicipalities([])

    try {
      const regionTable = selectedRegion

      let allRows: any[] = []
      let pageSize = 1000
      let from = 0
      let hasMore = true

      while (hasMore) {
        const { data, error } = await supabase
          .from(regionTable)
          .select('"CITY/MUNICIPALITY"')
          .eq("PROVINCE", selectedProvince)
          .not('"CITY/MUNICIPALITY"', "is", null)
          .neq('"CITY/MUNICIPALITY"', "")
          .range(from, from + pageSize - 1)
          .throwOnError()

        if (error) {
          console.error("Error in municipality range query:", error)
          break
        }

        allRows.push(...(data ?? []))
        console.log(`Fetched ${data.length} municipalities (Total so far: ${allRows.length})`)

        hasMore = data.length === pageSize
        from += pageSize
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
        )

      const uniqueMunicipalities = [...new Set(validMunicipalities)].sort()
      console.log("Processed municipalities:", uniqueMunicipalities)

      setMunicipalities(uniqueMunicipalities)
    } catch (error) {
      console.error("Error loading municipalities:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadBarangays = async () => {
    if (!selectedRegion || !selectedProvince || !selectedMunicipality) return

    console.log(
      "Loading barangays for region:",
      selectedRegion,
      "province:",
      selectedProvince,
      "municipality:",
      selectedMunicipality
    )

    setIsLoading(true)
    setBarangays([])

    try {
      const regionTable = selectedRegion

      let allRows: any[] = []
      let pageSize = 1000
      let from = 0
      let hasMore = true

      while (hasMore) {
        const { data, error } = await supabase
          .from(regionTable)
          .select("BARANGAY")
          .eq("PROVINCE", selectedProvince)
          .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
          .not("BARANGAY", "is", null)
          .neq("BARANGAY", "")
          .range(from, from + pageSize - 1)
          .throwOnError()

        if (error) {
          console.error("Error in barangay range query:", error)
          break
        }

        allRows.push(...(data ?? []))
        console.log(`Fetched ${data.length} barangays (Total so far: ${allRows.length})`)

        hasMore = data.length === pageSize
        from += pageSize
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
        )

      const uniqueBarangays = [...new Set(validBarangays)].sort()
      console.log("Processed barangays:", uniqueBarangays)

      setBarangays(uniqueBarangays)
    } catch (error) {
      console.error("Error loading barangays:", error)
      setBarangays([])
    } finally {
      setIsLoading(false)
    }
  }

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
    // Auto-detect and set region
    const detectedRegion = getRegionFromProvince(province)
    if (detectedRegion) {
      setSelectedRegion(detectedRegion)
    }
    // Reset dependent selections
    setSelectedMunicipality("")
    setSelectedBarangay("")
    setMunicipalitySearch("")
    setBarangaySearch("")
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

  const filteredMunicipalities = municipalities.filter((municipality) =>
    municipality.toLowerCase().includes(municipalitySearch.toLowerCase()),
  )
  const filteredBarangays = barangays.filter((barangay) =>
    barangay.toLowerCase().includes(barangaySearch.toLowerCase()),
  )
  const isFormValid = selectedRegion && selectedProvince && selectedMunicipality && selectedBarangay

  // Get region display name for showing the auto-detected region
  const getRegionDisplayName = (regionCode: string): string => {
    const region = PHILIPPINE_REGIONS.find(r => r.code === regionCode)
    return region ? region.name : regionCode
  }

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
          {/* Province Select Dropdown */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Select Province</Label>
            <Select value={selectedProvince} onValueChange={handleProvinceSelect}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choose your province..." />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {AVAILABLE_PROVINCES.map((province) => (
                  <SelectItem key={province} value={province}>
                    {toTitleCase(province)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Auto-detected Region Display */}
          {selectedRegion && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">Auto-detected Region:</div>
              <div className="text-sm text-blue-800">{getRegionDisplayName(selectedRegion)}</div>
            </div>
          )}

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
            {/* Province Select Dropdown */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Select Province</Label>
              <Select value={selectedProvince} onValueChange={handleProvinceSelect}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose your province..." />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {AVAILABLE_PROVINCES.map((province) => (
                    <SelectItem key={province} value={province}>
                      {toTitleCase(province)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Auto-detected Region Display */}
            {selectedRegion && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 font-medium">Auto-detected Region:</div>
                <div className="text-sm text-blue-800">{getRegionDisplayName(selectedRegion)}</div>
              </div>
            )}

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

            {/* Next Button */}
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