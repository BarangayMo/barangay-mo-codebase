import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CouncilMember {
  id?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  position: string;
  email?: string;
  phone_number?: string;
  landline_number?: string;
  barangay: string;
  municipality: string;
  province: string;
  region: string;
  is_active?: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

// Hook for fetching council members
export const useCouncilMembers = (barangay?: string) => {
  return useQuery({
    queryKey: ['council-members', barangay],
    queryFn: async () => {
      console.log('Fetching council members for barangay:', barangay);
      
      let query = supabase
        .from('council_members')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (barangay) {
        query = query.eq('barangay', barangay);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching council members:', error);
        throw error;
      }

      console.log('Fetched council members:', data);
      return data as CouncilMember[];
    },
    enabled: !!barangay
  });
};

// Hook for creating a council member
export const useCreateCouncilMember = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CouncilMember) => {
      console.log('Creating council member:', data);
      
      const { data: result, error } = await supabase
        .from('council_members')
        .insert([{
          first_name: data.first_name.trim(),
          middle_name: data.middle_name?.trim() || null,
          last_name: data.last_name.trim(),
          suffix: data.suffix?.trim() || null,
          position: data.position.trim(),
          email: data.email?.trim() || null,
          phone_number: data.phone_number?.trim() || null,
          landline_number: data.landline_number?.trim() || null,
          barangay: data.barangay.trim(),
          municipality: data.municipality.trim(),
          province: data.province.trim(),
          region: data.region.trim(),
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating council member:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['council-members'] });
      toast({
        title: "Council Member Added",
        description: "The council member has been added successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Council member creation error:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to add council member. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Hook for updating a council member
export const useUpdateCouncilMember = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CouncilMember> }) => {
      console.log('Updating council member:', id, data);
      
      const updateData = {
        ...(data.first_name && { first_name: data.first_name.trim() }),
        ...(data.middle_name !== undefined && { middle_name: data.middle_name?.trim() || null }),
        ...(data.last_name && { last_name: data.last_name.trim() }),
        ...(data.suffix !== undefined && { suffix: data.suffix?.trim() || null }),
        ...(data.position && { position: data.position.trim() }),
        ...(data.email !== undefined && { email: data.email?.trim() || null }),
        ...(data.phone_number !== undefined && { phone_number: data.phone_number?.trim() || null }),
        ...(data.landline_number !== undefined && { landline_number: data.landline_number?.trim() || null }),
        ...(data.barangay && { barangay: data.barangay.trim() }),
        ...(data.municipality && { municipality: data.municipality.trim() }),
        ...(data.province && { province: data.province.trim() }),
        ...(data.region && { region: data.region.trim() }),
        ...(data.is_active !== undefined && { is_active: data.is_active }),
        updated_at: new Date().toISOString()
      };

      const { data: result, error } = await supabase
        .from('council_members')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating council member:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['council-members'] });
      toast({
        title: "Council Member Updated",
        description: "The council member has been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Council member update error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update council member. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Hook for deleting a council member
export const useDeleteCouncilMember = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting council member:', id);
      
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('council_members')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error deleting council member:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['council-members'] });
      toast({
        title: "Council Member Removed",
        description: "The council member has been removed successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Council member deletion error:', error);
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to remove council member. Please try again.",
        variant: "destructive",
      });
    },
  });
};