"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export interface Official {
  id: string
  user_id?: string | null
  first_name: string
  middle_name?: string | null
  last_name: string
  suffix?: string | null
  phone_number: string
  landline_number?: string | null
  email: string
  position: string
  barangay: string
  municipality: string
  province: string
  region: string
  status: "pending" | "approved" | "rejected" | "active" | "inactive"
  is_approved?: boolean
  rejection_reason?: string | null
  approved_by?: string | null
  approved_at?: string | null
  submitted_at?: string | null
 
  years_of_service?: number
  achievements?: string[] | null
  password_hash?: string | null
  created_at?: string
  updated_at?: string
}

export const useOfficials = (barangay?: string) => {
  return useQuery({
    queryKey: ["officials", barangay],
    queryFn: async (): Promise<Official[]> => {
      try {
        let query = supabase.from("officials").select("*").order("created_at", { ascending: false })

        if (barangay) {
          query = query.eq("barangay", barangay)
        }

        const { data, error } = await query
        if (error) throw error
        return (data as Official[]) || []
      } catch (error) {
        console.error("Error fetching officials:", error)
        return []
      }
    },
  })
}

export const useCreateOfficial = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (official: Omit<Official, "id" | "created_at" | "updated_at">) => {
      try {
        // Ensure phone_number is always a string and not null/undefined
        const officialData = {
          ...official,
          phone_number: official.phone_number ? String(official.phone_number) : '',
        };
        console.log('Creating official with data:', officialData);
        const { data, error } = await supabase.from("officials").insert(officialData).select().single()

        if (error) throw error
        return data as Official
      } catch (error) {
        console.error("Error creating official:", error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["officials"] })
      toast({
        title: "Success",
        description: "Official added successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add official. Please try again.",
        variant: "destructive",
      })
      console.error("Create official error:", error)
    },
  })
}

export const useUpdateOfficial = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Official> & { id: string }) => {
      try {
        const { data, error } = await supabase.from("officials").update(updates).eq("id", id).select().single()

        if (error) throw error
        return data as Official
      } catch (error) {
        console.error("Error updating official:", error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["officials"] })
      toast({
        title: "Success",
        description: "Official updated successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update official. Please try again.",
        variant: "destructive",
      })
      console.error("Update official error:", error)
    },
  })
}

export const useDeleteOfficial = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase.from("officials").delete().eq("id", id)
        if (error) throw error
        return id
      } catch (error) {
        console.error("Error deleting official:", error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["officials"] })
      toast({
        title: "Success",
        description: "Official removed successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove official. Please try again.",
        variant: "destructive",
      })
      console.error("Delete official error:", error)
    },
  })
}
