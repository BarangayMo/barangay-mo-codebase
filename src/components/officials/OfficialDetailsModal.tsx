"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Camera, ChevronLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { Official } from "@/hooks/use-officials-data"

interface OfficialDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  official: Official
  onSave: (data: Partial<Official>) => void
}

const SUFFIX_OPTIONS = ["Jr.", "Sr.", "II", "III", "IV", "V"]

const ALL_POSITIONS = [
  "Punong Barangay",
  "Barangay Secretary",
  "Barangay Treasurer",
  "Sangguniang Barangay Member 1",
  "Sangguniang Barangay Member 2",
  "Sangguniang Barangay Member 3",
  "Sangguniang Barangay Member 4",
  "Sangguniang Barangay Member 5",
  "Sangguniang Barangay Member 6",
  "Sangguniang Barangay Member 7",
  "SK Chairperson",
]

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

export function OfficialDetailsModal({ isOpen, onClose, official, onSave }: OfficialDetailsModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "none",
    position: "",
    phone_number: "",
    landline_number: "",
    email: "",
    municipality: "",
    province: "",
    region: "",
    achievements: "",
    years_of_service: "",
  })

  const [provinces, setProvinces] = useState<string[]>([])
  const [municipalities, setMunicipalities] = useState<string[]>([])
  const [loadingProvinces, setLoadingProvinces] = useState(false)
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  console.log("OfficialDetailsModal render:", { isOpen, official, formData })

  useEffect(() => {
    if (official && isOpen) {
      setFormData({
        first_name: official.first_name || "",
        middle_name: official.middle_name || "",
        last_name: official.last_name || "",
        suffix: official.suffix || "none",
        position: official.position || "",
        phone_number: official.phone_number || "",
        landline_number: official.landline_number || "",
        email: official.email || "",
        municipality: official.municipality || "",
        province: official.province || "",
        region: official.region || "",
        achievements: Array.isArray(official.achievements)
          ? official.achievements.join(", ")
          : official.achievements || "",
        years_of_service: official.years_of_service?.toString() || "",
      })
    }
  }, [official, isOpen])

  useEffect(() => {
    if (formData.region) {
      setLoadingProvinces(true)
      setProvinces([])
      ;(async () => {
        const { data, error } = await (supabase as any)
          .from(formData.region)
          .select("PROVINCE")
          .not("PROVINCE", "is", null)
          .neq("PROVINCE", "")
        if (!error && data) {
          const provinceList = data
            .map((item: any) => item.PROVINCE)
            .filter((province: any) => province && typeof province === "string" && province.trim() !== "") as string[]
          setProvinces([...new Set(provinceList)].sort())
        }
        setLoadingProvinces(false)
      })()
    } else {
      setProvinces([])
    }
    setFormData((prev) => ({ ...prev, province: "", municipality: "" }))
  }, [formData.region])

  useEffect(() => {
    if (formData.region && formData.province) {
      setLoadingMunicipalities(true)
      setMunicipalities([])
      ;(async () => {
        const { data, error } = await (supabase as any)
          .from(formData.region)
          .select('"CITY/MUNICIPALITY"')
          .eq("PROVINCE", formData.province)
          .not('"CITY/MUNICIPALITY"', "is", null)
          .neq('"CITY/MUNICIPALITY"', "")
        if (!error && data) {
          const municipalityList = data
            .map((item: any) => item["CITY/MUNICIPALITY"])
            .filter(
              (municipality: any) => municipality && typeof municipality === "string" && municipality.trim() !== "",
            ) as string[]
          setMunicipalities([...new Set(municipalityList)].sort())
        }
        setLoadingMunicipalities(false)
      })()
    } else {
      setMunicipalities([])
    }
    setFormData((prev) => ({ ...prev, municipality: "" }))
  }, [formData.region, formData.province])

  const handleSave = async () => {
    if (
      !formData.first_name.trim() ||
      !formData.last_name.trim() ||
      !formData.position ||
      !formData.phone_number.trim() ||
      !formData.email.trim() ||
      !formData.municipality.trim() ||
      !formData.province.trim() ||
      !formData.region.trim()
    ) {
      toast({
        title: "Error",
        description: "All required fields must be filled.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Get the authenticated user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        console.error("Auth error:", authError)
        toast({
          title: "Authentication Error",
          description: "Failed to get user information. Please try logging in again.",
          variant: "destructive",
        })
        return
      }

      if (!user) {
        toast({
          title: "Not Authenticated",
          description: "You must be logged in to create an official.",
          variant: "destructive",
        })
        return
      }

      console.log("Authenticated user:", user.id)

      // Check current session
      const { data: session } = await supabase.auth.getSession()
      console.log("Current session:", session)

      // Prepare the data for insertion - removed barangay, term_start, term_end
      const officialData = {
        user_id: user.id,
        first_name: formData.first_name.trim(),
        middle_name: formData.middle_name?.trim() || null,
        last_name: formData.last_name.trim(),
        suffix: formData.suffix === "none" ? null : formData.suffix,
        position: formData.position,
        phone_number: formData.phone_number.trim(),
        landline_number: formData.landline_number?.trim() || null,
        email: formData.email.trim(),
        municipality: formData.municipality,
        province: formData.province,
        region: formData.region,
        achievements: formData.achievements
          ? formData.achievements
              .split(",")
              .map((a) => a.trim())
              .filter(Boolean)
          : null,
        years_of_service: formData.years_of_service ? Number.parseInt(formData.years_of_service) : null,
        status: "pending" as const,
      }

      console.log("Inserting official data:", officialData)

      // Try to insert with explicit RLS context
      const { data, error } = await supabase.from("officials").insert(officialData).select().single()

      if (error) {
        console.error("Error creating official:", error)
        console.error("Error code:", error.code)
        console.error("Error message:", error.message)
        console.error("Error details:", error.details)
        console.error("Error hint:", error.hint)

        // Handle specific RLS error
        if (error.code === "42501") {
          // Try to get more information about the user and RLS
          const { data: userData } = await supabase.auth.getUser()
          console.log("User data for RLS debug:", userData)

          toast({
            title: "Permission Error",
            description: `RLS Policy Error: ${error.message}. Please check your permissions or contact an administrator.`,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Database Error",
            description: error.message || "Failed to create official. Please try again.",
            variant: "destructive",
          })
        }
        return
      }

      console.log("Official created successfully:", data)

      toast({
        title: "Success",
        description: "Official created successfully!",
      })

      // Call the onSave callback if provided (for any additional handling)
      if (onSave) {
        await onSave(data)
      }

      // Close the modal on success
      onClose()
    } catch (error) {
      console.error("Unexpected error:", error)
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    console.log("Input change:", field, value)
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (!isOpen) {
    return null
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Full Screen Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-end transition-transform duration-500 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="w-full h-full bg-white flex flex-col animate-in slide-in-from-bottom duration-500">
          {/* Red Header */}
          <div className="bg-red-600 text-white px-4 sm:px-6 py-4 flex items-center justify-between shrink-0 safe-area-inset-top">
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="text-center text-lg font-semibold">
              {official?.id ? "Edit Barangay Official" : "Add Barangay Official"}
            </h1>
            <div className="w-6" />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6 max-w-md mx-auto pb-24">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-600" />
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Official Details Form */}
              <div className="space-y-6">
                <h3 className="font-semibold text-gray-900 text-lg mb-4">Official Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                    Position *
                  </Label>
                  <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 h-12">
                      <SelectValue placeholder="Select position..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_POSITIONS.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                    First Name *
                  </Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                    placeholder="Enter first name"
                    className="bg-gray-50 border-gray-200 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middle_name" className="text-sm font-medium text-gray-700">
                    Middle Name (Optional)
                  </Label>
                  <Input
                    id="middle_name"
                    value={formData.middle_name}
                    onChange={(e) => handleInputChange("middle_name", e.target.value)}
                    placeholder="Enter middle name"
                    className="bg-gray-50 border-gray-200 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                    Last Name *
                  </Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                    placeholder="Enter last name"
                    className="bg-gray-50 border-gray-200 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="suffix" className="text-sm font-medium text-gray-700">
                    Suffix (Optional)
                  </Label>
                  <Select value={formData.suffix} onValueChange={(value) => handleInputChange("suffix", value)}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 h-12">
                      <SelectValue placeholder="Select suffix..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {SUFFIX_OPTIONS.map((suffix) => (
                        <SelectItem key={suffix} value={suffix}>
                          {suffix}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange("phone_number", e.target.value)}
                    placeholder="Enter phone number"
                    className="bg-gray-50 border-gray-200 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landline_number" className="text-sm font-medium text-gray-700">
                    Landline Number (Optional)
                  </Label>
                  <Input
                    id="landline_number"
                    value={formData.landline_number}
                    onChange={(e) => handleInputChange("landline_number", e.target.value)}
                    placeholder="Enter landline number"
                    className="bg-gray-50 border-gray-200 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                    className="bg-gray-50 border-gray-200 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region" className="text-sm font-medium text-gray-700">
                    Region *
                  </Label>
                  <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 h-12">
                      <SelectValue placeholder="Select region..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PHILIPPINE_REGIONS.map((region) => (
                        <SelectItem key={region.code} value={region.code}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province" className="text-sm font-medium text-gray-700">
                    Province *
                  </Label>
                  <Select
                    value={formData.province}
                    onValueChange={(value) => handleInputChange("province", value)}
                    disabled={!formData.region || loadingProvinces}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200 h-12">
                      <SelectValue placeholder={loadingProvinces ? "Loading..." : "Select province..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="municipality" className="text-sm font-medium text-gray-700">
                    Municipality *
                  </Label>
                  <Select
                    value={formData.municipality}
                    onValueChange={(value) => handleInputChange("municipality", value)}
                    disabled={!formData.region || !formData.province || loadingMunicipalities}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200 h-12">
                      <SelectValue placeholder={loadingMunicipalities ? "Loading..." : "Select municipality..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {municipalities.map((municipality) => (
                        <SelectItem key={municipality} value={municipality}>
                          {municipality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="achievements" className="text-sm font-medium text-gray-700">
                    Achievements (comma separated, optional)
                  </Label>
                  <Input
                    id="achievements"
                    value={formData.achievements}
                    onChange={(e) => handleInputChange("achievements", e.target.value)}
                    placeholder="e.g. Outstanding Leadership, Community Development"
                    className="bg-gray-50 border-gray-200 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="years_of_service" className="text-sm font-medium text-gray-700">
                    Years of Service (Optional)
                  </Label>
                  <Input
                    id="years_of_service"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.years_of_service}
                    onChange={(e) => handleInputChange("years_of_service", e.target.value)}
                    placeholder="Enter years of service"
                    className="bg-gray-50 border-gray-200 h-12"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Bottom Action Buttons - Fixed mobile visibility */}
          <div className="p-4 sm:p-6 border-t bg-white shrink-0 safe-area-inset-bottom">
            <div className="flex space-x-3 max-w-md mx-auto">
              <Button variant="outline" onClick={onClose} className="flex-1 border-gray-300 h-12 bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12"
                disabled={
                  isLoading ||
                  !formData.first_name.trim() ||
                  !formData.last_name.trim() ||
                  !formData.position ||
                  !formData.phone_number.trim() ||
                  !formData.email.trim() ||
                  !formData.municipality.trim() ||
                  !formData.province.trim() ||
                  !formData.region.trim()
                }
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : official?.id ? (
                  "Update Official"
                ) : (
                  "Add Official"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
