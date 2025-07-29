"use client"

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

  const regionRef = useRef<HTMLDivElement>(null)
  const provinceRef = useRef<HTMLDivElement>(null)
  const municipalityRef = useRef<HTMLDivElement>(null)
  const barangayRef = useRef<HTMLDivElement>(null)

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
    if (!selectedRegion) return
    console.log("Loading provinces for region:", selectedRegion)
    setIsLoading(true)
    setProvinces([])
    try {
      const getRegionTableName = (regionCode: string) => {
        switch (regionCode) {
          case "REGION 1":
          case "Region 1":
          case "Ilocos Region (Region I)":
            return "REGION 1"
          case "REGION 2":
          case "Region 2":
          case "Cagayan Valley (Region II)":
            return "REGION 2"
          case "REGION 3":
          case "Region 3":
          case "Central Luzon (Region III)":
            return "REGION 3"
          case "REGION 4A":
          case "Region 4A":
          case "CALABARZON (Region IV-A)":
            return "REGION 4A"
          case "REGION 4B":
          case "Region 4B":
          case "MIMAROPA (Region IV-B)":
            return "REGION 4B"
          case "REGION 5":
          case "Region 5":
          case "Bicol Region (Region V)":
            return "REGION 5"
          case "REGION 6":
          case "Region 6":
          case "Western Visayas (Region VI)":
            return "REGION 6"
          case "REGION 7":
          case "Region 7":
          case "Central Visayas (Region VII)":
            return "REGION 7"
          case "REGION 8":
          case "Region 8":
          case "Eastern Visayas (Region VIII)":
            return "REGION 8"
          case "REGION 9":
          case "Region 9":
          case "Zamboanga Peninsula (Region IX)":
            return "REGION 9"
          case "REGION 10":
          case "Region 10":
          case "Northern Mindanao (Region X)":
            return "REGION 10"
          case "REGION 11":
          case "Region 11":
          case "Davao Region (Region XI)":
            return "REGION 11"
          case "REGION 12":
          case "Region 12":
          case "SOCCSKSARGEN (Region XII)":
            return "REGION 12"
          case "REGION 13":
          case "Region 13":
          case "Caraga (Region XIII)":
            return "REGION 13"
          case "NCR":
          case "National Capital Region (NCR)":
            return "NCR"
          case "CAR":
          case "Cordillera Administrative Region (CAR)":
            return "CAR"
          case "BARMM":
          case "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)":
            return "BARMM"
          default:
            return regionCode
        }
      }

      const regionTable = getRegionTableName(selectedRegion)

      const { data, error } = await (supabase as any)
        .from(regionTable)
        .select("PROVINCE")
        .not("PROVINCE", "is", null)
        .neq("PROVINCE", "")
        .order("PROVINCE", { ascending: true })

      console.log("Query result:", { data, error, regionTable, totalRecords: data?.length })

      if (error) {
        console.error("Error loading provinces:", error)
        return
      }

      if (data && data.length > 0) {
        const provinceList = data
          .map((item: any) => item.PROVINCE)
          .filter((province: any) => province && typeof province === "string" && province.trim() !== "")

        const uniqueProvinces = [...new Set(provinceList)] as string[]
        const sortedProvinces = uniqueProvinces.sort()

        console.log("Total unique provinces found:", uniqueProvinces.length)
        console.log("All provinces for", regionTable, ":", sortedProvinces)

        setProvinces(sortedProvinces)
      } else {
        console.log("No province data found for region:", selectedRegion)
        setProvinces([])
      }
    } catch (error) {
      console.error("Exception while loading provinces:", error)
      setProvinces([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadMunicipalities = async () => {
    if (!selectedRegion || !selectedProvince) return
    console.log("Loading municipalities for region:", selectedRegion, "province:", selectedProvince)
    setIsLoading(true)
    setMunicipalities([])
    try {
      const getRegionTableName = (regionCode: string) => {
        switch (regionCode) {
          case "REGION 1":
          case "Region 1":
          case "Ilocos Region (Region I)":
            return "REGION 1"
          case "REGION 2":
          case "Region 2":
          case "Cagayan Valley (Region II)":
            return "REGION 2"
          case "REGION 3":
          case "Region 3":
          case "Central Luzon (Region III)":
            return "REGION 3"
          case "REGION 4A":
          case "Region 4A":
          case "CALABARZON (Region IV-A)":
            return "REGION 4A"
          case "REGION 4B":
          case "Region 4B":
          case "MIMAROPA (Region IV-B)":
            return "REGION 4B"
          case "REGION 5":
          case "Region 5":
          case "Bicol Region (Region V)":
            return "REGION 5"
          case "REGION 6":
          case "Region 6":
          case "Western Visayas (Region VI)":
            return "REGION 6"
          case "REGION 7":
          case "Region 7":
          case "Central Visayas (Region VII)":
            return "REGION 7"
          case "REGION 8":
          case "Region 8":
          case "Eastern Visayas (Region VIII)":
            return "REGION 8"
          case "REGION 9":
          case "Region 9":
          case "Zamboanga Peninsula (Region IX)":
            return "REGION 9"
          case "REGION 10":
          case "Region 10":
          case "Northern Mindanao (Region X)":
            return "REGION 10"
          case "REGION 11":
          case "Region 11":
          case "Davao Region (Region XI)":
            return "REGION 11"
          case "REGION 12":
          case "Region 12":
          case "SOCCSKSARGEN (Region XII)":
            return "REGION 12"
          case "REGION 13":
          case "Region 13":
          case "Caraga (Region XIII)":
            return "REGION 13"
          case "NCR":
          case "National Capital Region (NCR)":
            return "NCR"
          case "CAR":
          case "Cordillera Administrative Region (CAR)":
            return "CAR"
          case "BARMM":
          case "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)":
            return "BARMM"
          default:
            return regionCode
        }
      }

      const regionTable = getRegionTableName(selectedRegion)

      const { data, error } = await (supabase as any)
        .from(regionTable)
        .select('"CITY/MUNICIPALITY"')
        .eq("PROVINCE", selectedProvince)
        .not('"CITY/MUNICIPALITY"', "is", null)
        .neq('"CITY/MUNICIPALITY"', "")
        .order('"CITY/MUNICIPALITY"', { ascending: true })

      console.log("Municipalities query result:", { data, error, regionTable, totalRecords: data?.length })

      if (error) {
        console.error("Error loading municipalities:", error)
        return
      }

      if (data && data.length > 0) {
        const municipalityList = data
          .map((item: any) => item["CITY/MUNICIPALITY"])
          .filter((municipality: any) => municipality && typeof municipality === "string" && municipality.trim() !== "")

        const uniqueMunicipalities = [...new Set(municipalityList)] as string[]
        const sortedMunicipalities = uniqueMunicipalities.sort()

        console.log("Total unique municipalities found:", uniqueMunicipalities.length)
        console.log("All municipalities for", selectedProvince, ":", sortedMunicipalities)

        setMunicipalities(sortedMunicipalities)
      } else {
        console.log("No municipality data found for region:", selectedRegion, "province:", selectedProvince)
        setMunicipalities([])
      }
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
      selectedMunicipality,
    )
    setIsLoading(true)
    setBarangays([])
    try {
      const getRegionTableName = (regionCode: string) => {
        switch (regionCode) {
          case "REGION 1":
          case "Region 1":
          case "Ilocos Region (Region I)":
            return "REGION 1"
          case "REGION 2":
          case "Region 2":
          case "Cagayan Valley (Region II)":
            return "REGION 2"
          case "REGION 3":
          case "Region 3":
          case "Central Luzon (Region III)":
            return "REGION 3"
          case "REGION 4A":
          case "Region 4A":
          case "CALABARZON (Region IV-A)":
            return "REGION 4A"
          case "REGION 4B":
          case "Region 4B":
          case "MIMAROPA (Region IV-B)":
            return "REGION 4B"
          case "REGION 5":
          case "Region 5":
          case "Bicol Region (Region V)":
            return "REGION 5"
          case "REGION 6":
          case "Region 6":
          case "Western Visayas (Region VI)":
            return "REGION 6"
          case "REGION 7":
          case "Region 7":
          case "Central Visayas (Region VII)":
            return "REGION 7"
          case "REGION 8":
          case "Region 8":
          case "Eastern Visayas (Region VIII)":
            return "REGION 8"
          case "REGION 9":
          case "Region 9":
          case "Zamboanga Peninsula (Region IX)":
            return "REGION 9"
          case "REGION 10":
          case "Region 10":
          case "Northern Mindanao (Region X)":
            return "REGION 10"
          case "REGION 11":
          case "Region 11":
          case "Davao Region (Region XI)":
            return "REGION 11"
          case "REGION 12":
          case "Region 12":
          case "SOCCSKSARGEN (Region XII)":
            return "REGION 12"
          case "REGION 13":
          case "Region 13":
          case "Caraga (Region XIII)":
            return "REGION 13"
          case "NCR":
          case "National Capital Region (NCR)":
            return "NCR"
          case "CAR":
          case "Cordillera Administrative Region (CAR)":
            return "CAR"
          case "BARMM":
          case "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)":
            return "BARMM"
          default:
            return regionCode
        }
      }

      const regionTable = getRegionTableName(selectedRegion)

      const { data, error } = await (supabase as any)
        .from(regionTable)
        .select("BARANGAY")
        .eq("PROVINCE", selectedProvince)
        .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
        .not("BARANGAY", "is", null)
        .neq("BARANGAY", "")
        .order("BARANGAY", { ascending: true })

      console.log("Barangays query result:", { data, error, regionTable, totalRecords: data?.length })

      if (error) {
        console.error("Error loading barangays:", error)
        return
      }

      if (data && data.length > 0) {
        const barangayList = data
          .map((item: any) => item.BARANGAY)
          .filter((barangay: any) => barangay && typeof barangay === "string" && barangay.trim() !== "")

        const uniqueBarangays = [...new Set(barangayList)] as string[]
        const sortedBarangays = uniqueBarangays.sort()

        console.log("Total unique barangays found:", uniqueBarangays.length)
        console.log("All barangays for", selectedMunicipality, ":", sortedBarangays)

        setBarangays(sortedBarangays)
      } else {
        console.log("No barangay data found")
        setBarangays([])
      }
    } catch (error) {
      console.error("Error loading barangays:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (selectedRegion && selectedProvince && selectedMunicipality && selectedBarangay) {
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
    console.log("=== LOCATION SELECTION DEBUG INFO ===")
    console.log("Selected Region:", selectedRegion)
    console.log("Total provinces loaded:", provinces.length)
    console.log("All provinces:", provinces)
    console.log("Province search term:", provinceSearch)
    console.log("Filtered provinces count:", filteredProvinces.length)
    console.log("Filtered provinces:", filteredProvinces)
    console.log("Total municipalities loaded:", municipalities.length)
    console.log("Total barangays loaded:", barangays.length)
  }, [provinces, provinceSearch, filteredProvinces, selectedRegion, municipalities, barangays])

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="w-full bg-gray-200 h-1">
          <div className={`h-1 w-2/5 ${userRole === "official" ? "bg-red-600" : "bg-blue-600"}`}></div>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
          <button onClick={handleBack} className="text-red-600 hover:text-red-700">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-red-600">Location</h1>
          <div className="w-6" />
        </div>

        <div className="flex-1 p-6 space-y-6 bg-gray-50">
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
                style={{ maxHeight: "300px", overflowY: "auto" }}
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
                    {filteredProvinces
                      .filter((p) => p !== selectedProvince)
                      .map((province, index) => (
                        <button
                          key={`${province}-${index}`}
                          onClick={() => handleProvinceSelect(province)}
                          className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          {toTitleCase(province)}
                        </button>
                      ))}
                  </>
                )}
              </div>
            )}
          </div>

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
              <div
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
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
                            key={`${municipality}-${index}`}
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
              <div
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
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
                            key={`${barangay}-${index}`}
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

          {selectedBarangay && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-center">
                <div className="font-semibold text-green-900 text-lg">{toTitleCase(selectedBarangay)}</div>
                <div className="text-sm text-green-600">Barangay Selected</div>
              </div>
            </div>
          )}
        </div>

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-visible">
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
                  style={{ maxHeight: "300px", overflowY: "auto" }}
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
                      {filteredProvinces
                        .filter((p) => p !== selectedProvince)
                        .map((province, index) => (
                          <button
                            key={`${province}-${index}`}
                            onClick={() => handleProvinceSelect(province)}
                            className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            {toTitleCase(province)}
                          </button>
                        ))}
                    </>
                  )}
                </div>
              )}
            </div>

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
                <div
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
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
                              key={`${municipality}-${index}`}
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
                <div
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
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
                              key={`${barangay}-${index}`}
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

            {selectedBarangay && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-center">
                  <div className="font-semibold text-green-900 text-lg">{toTitleCase(selectedBarangay)}</div>
                  <div className="text-sm text-green-600">Barangay Selected</div>
                </div>
              </div>
            )}
          </div>

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
