"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteOfficialFn, getOfficialsFn, updateOfficialFn } from "./officials-api"
import { useToast } from "@/components/ui/use-toast"
import type { Official } from "@/types"
import { supabase } from "@/lib/supabase"

export const useOfficials = () => {
  return useQuery({
    queryKey: ["officials"],
    queryFn: getOfficialsFn,
  })
}

export const useCreateOfficial = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (official: Omit<Official, "id" | "created_at" | "updated_at">) => {
      try {
        const { data, error } = await supabase.from("officials").insert(official).select().single()

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

  return useMutation({
    mutationFn: updateOfficialFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["officials"] })
    },
  })
}

export const useDeleteOfficial = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteOfficialFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["officials"] })
    },
  })
}
