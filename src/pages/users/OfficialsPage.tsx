"use client"
//my-changes
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, PenLine, Trash2, Phone } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { OfficialDetailsModal } from "@/components/officials/OfficialDetailsModal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// Mock Supabase client (replace with your actual Supabase client)
const supabase = {
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          // Mock implementation, replace with actual Supabase query
          return { data: null, error: null }
        },
      }),
      order: (column: string, options: any) => ({
        limit: (count: number) => ({
          // Mock implementation, replace with actual Supabase query
          data: [],
          error: null,
        }),
      }),
      data: [],
      error: null,
    }),
    insert: (records: any[]) => ({
      select: () => ({
        single: async () => {
          return { data: null, error: null }
        },
      }),
    }),
    update: (updates: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: async () => {
            return { data: null, error: null }
          },
        }),
      }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        then: async () => {
          return { data: null, error: null }
        },
      }),
    }),
  }),
}

// Mock function to fetch barangay officials (replace with your actual API call)
const fetchBarangayOfficials = async (barangayName: string, regionName: string) => {
  // Mock data for demonstration purposes
  const mockOfficials = [
    {
      id: `${regionName}-1`,
      position: "Barangay Captain",
      firstName: "John",
      middleName: "M",
      lastName: "Doe",
      suffix: "",
      contact_phone: "123-456-7890",
      contact_email: "john.doe@example.com",
      term_start: "2022-01-01",
      term_end: "2025-01-01",
      status: "active",
      years_of_service: 3,
      barangay: barangayName,
    },
    {
      id: `${regionName}-2`,
      position: "Barangay Kagawad",
      firstName: "Jane",
      middleName: "A",
      lastName: "Smith",
      suffix: "",
      contact_phone: "987-654-3210",
      contact_email: "jane.smith@example.com",
      term_start: "2023-01-01",
      term_end: "2026-01-01",
      status: "inactive",
      years_of_service: 2,
      barangay: barangayName,
    },
  ]

  return mockOfficials
}

// Create a new official
const createOfficial = async (officialData: any) => {
  const { data, error } = await supabase
    .from("barangay_officials")
    .insert([
      {
        user_id: null,
        position: officialData.position,
        barangay: officialData.barangay,
        first_name: officialData.firstName,
        middle_name: officialData.middleName,
        last_name: officialData.lastName,
        suffix: officialData.suffix,
        contact_phone: officialData.contact_phone,
        contact_email: officialData.contact_email,
        term_start: officialData.term_start,
        term_end: officialData.term_end,
        status: "active",
        years_of_service: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

// Update an existing official
const updateOfficial = async (id: string, officialData: any) => {
  const { data, error } = await supabase
    .from("barangay_officials")
    .update({
      position: officialData.position,
      first_name: officialData.firstName,
      middle_name: officialData.middleName,
      last_name: officialData.lastName,
      suffix: officialData.suffix,
      contact_phone: officialData.contact_phone,
      contact_email: officialData.contact_email,
      term_start: officialData.term_start,
      term_end: officialData.term_end,
      status: officialData.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete an official
const deleteOfficial = async (id: string) => {
  const { error } = await supabase.from("barangay_officials").delete().eq("id", id)

  if (error) throw error
  return true
}

// Fetch custom officials from barangay_officials table
const fetchCustomOfficials = async (barangayName: string) => {
  if (!barangayName) return []

  const { data, error } = await supabase.from("barangay_officials").select("*").eq("barangay", barangayName)

  if (error) {
    console.error("Error fetching custom officials:", error)
    return []
  }

  return data || []
}

const OfficialsPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [positionFilter, setPositionFilter] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedOfficial, setSelectedOfficial] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // For now, we'll use hardcoded values - in a real app, this would come from context/state
  const selectedBarangay = "Barangay 1"
  const selectedRegion = "REGION 3"

  // Fetch regional officials data
  const { data: regionalOfficials = [], isLoading: regionalLoading } = useQuery({
    queryKey: ["regional-officials", selectedBarangay, selectedRegion],
    queryFn: () => fetchBarangayOfficials(selectedBarangay, selectedRegion),
    enabled: !!selectedBarangay && !!selectedRegion,
  })

  // Fetch custom officials data
  const { data: customOfficials = [], isLoading: customLoading } = useQuery({
    queryKey: ["custom-officials", selectedBarangay],
    queryFn: () => fetchCustomOfficials(selectedBarangay),
    enabled: !!selectedBarangay,
  })

  // Combine both data sources
  const officials = useMemo(() => {
    return [...regionalOfficials, ...customOfficials]
  }, [regionalOfficials, customOfficials])

  const isLoading = regionalLoading || customLoading

  // Mutations for CRUD operations
  const createMutation = useMutation({
    mutationFn: createOfficial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-officials"] })
      toast.success("Official added successfully!")
      setShowAddModal(false)
      setSelectedOfficial(null)
    },
    onError: (error: any) => {
      toast.error(`Failed to add official: ${error.message}`)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateOfficial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-officials"] })
      toast.success("Official updated successfully!")
      setShowAddModal(false)
      setSelectedOfficial(null)
      setIsEditing(false)
    },
    onError: (error: any) => {
      toast.error(`Failed to update official: ${error.message}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteOfficial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-officials"] })
      toast.success("Official deleted successfully!")
    },
    onError: (error: any) => {
      toast.error(`Failed to delete official: ${error.message}`)
    },
  })

  const handleSaveOfficial = (data: any) => {
    const officialData = {
      ...data,
      barangay: selectedBarangay,
    }

    if (isEditing && selectedOfficial?.id) {
      updateMutation.mutate({ id: selectedOfficial.id, data: officialData })
    } else {
      createMutation.mutate(officialData)
    }
  }

  const handleEditOfficial = (official: any) => {
    setSelectedOfficial(official)
    setIsEditing(true)
    setShowAddModal(true)
  }

  const handleDeleteOfficial = (official: any) => {
    if (official.id && !official.id.includes("REGION")) {
      // Only allow deletion of custom officials
      if (window.confirm(`Are you sure you want to delete ${official.firstName} ${official.lastName}?`)) {
        deleteMutation.mutate(official.id)
      }
    } else {
      toast.error("Cannot delete regional officials. Only custom officials can be deleted.")
    }
  }

  const handleViewOfficial = (official: any) => {
    // Create a read-only version for viewing
    setSelectedOfficial({ ...official, readOnly: true })
    setIsEditing(false)
    setShowAddModal(true)
  }

  const filteredOfficials = useMemo(() => {
    let filtered = officials

    if (searchTerm) {
      filtered = filtered.filter((official) =>
        `${official.firstName} ${official.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((official) => official.status === statusFilter)
    }

    if (positionFilter !== "all") {
      filtered = filtered.filter((official) => official.position === positionFilter)
    }

    return filtered
  }, [officials, searchTerm, statusFilter, positionFilter])

  if (isLoading) {
    return <div>Loading officials...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Barangay Officials</h1>
        <Button onClick={() => setShowAddModal(true)}>Add Official</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={positionFilter} onValueChange={setPositionFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by Position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            <SelectItem value="Barangay Captain">Barangay Captain</SelectItem>
            <SelectItem value="Barangay Kagawad">Barangay Kagawad</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isMobile ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredOfficials.map((official) => (
            <Card key={official.id}>
              <CardHeader>
                <CardTitle>{`${official.firstName} ${official.lastName}`}</CardTitle>
                <CardDescription>{official.position}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Contact: {official.contact_phone}</p>
                <p>Email: {official.contact_email}</p>
                <Badge variant={official.status === "active" ? "default" : "secondary"}>{official.status}</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="ml-auto">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewOfficial(official)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    {!official.id?.includes("REGION") && (
                      <DropdownMenuItem onClick={() => handleEditOfficial(official)}>
                        <PenLine className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {!official.id?.includes("REGION") && (
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteOfficial(official)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOfficials.map((official) => (
                <TableRow key={official.id}>
                  <TableCell>{`${official.firstName} ${official.lastName}`}</TableCell>
                  <TableCell>{official.position}</TableCell>
                  <TableCell>{official.contact_phone}</TableCell>
                  <TableCell>
                    <Badge variant={official.status === "active" ? "default" : "secondary"}>{official.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="ml-auto">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewOfficial(official)}>
                          <Eye className="mr-2 h-4 w-4" /> View Profile
                        </DropdownMenuItem>
                        {!official.id?.includes("REGION") && (
                          <DropdownMenuItem onClick={() => handleEditOfficial(official)}>
                            <PenLine className="mr-2 h-4 w-4" /> Edit Details
                          </DropdownMenuItem>
                        )}
                        {official.contact_phone && (
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" /> Call
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {!official.id?.includes("REGION") && (
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteOfficial(official)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Remove
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <OfficialDetailsModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setSelectedOfficial(null)
          setIsEditing(false)
        }}
        official={
          selectedOfficial || {
            position: "",
            firstName: "",
            middleName: "",
            lastName: "",
            suffix: "",
            contact_phone: "",
            contact_email: "",
            term_start: "",
            term_end: "",
            isCompleted: false,
          }
        }
        onSave={handleSaveOfficial}
        isEditing={isEditing}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}

export default OfficialsPage
