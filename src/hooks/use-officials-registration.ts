import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface OfficialRegistration {
  id?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  phone_number: string;
  landline_number?: string;
  email: string;
  position: string;
  barangay: string;
  municipality: string;
  province: string;
  region: string;
  status?: 'pending' | 'approved' | 'rejected';
  is_approved?: boolean;
  rejection_reason?: string;
  approved_by?: string;
  approved_at?: string;
  submitted_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Hook for submitting official registration (public)
export const useSubmitOfficialRegistration = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: OfficialRegistration) => {
      console.log('Submitting official registration:', data);
      
      const { data: result, error } = await supabase
        .from('officials')
        .insert([{
          first_name: data.first_name,
          middle_name: data.middle_name && typeof data.middle_name === 'string' ? data.middle_name : null,
          last_name: data.last_name,
          suffix: data.suffix && typeof data.suffix === 'string' ? data.suffix : null,
          phone_number: data.phone_number,
          landline_number: data.landline_number && typeof data.landline_number === 'string' ? data.landline_number : null,
          email: data.email,
          position: data.position,
          barangay: data.barangay,
          municipality: data.municipality,
          province: data.province,
          region: data.region,
          status: 'pending',
          is_approved: false
        }])
        .select()
        .single();

      if (error) {
        console.error('Error submitting registration:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      toast({
        title: "Registration Submitted",
        description: "Your official registration has been submitted for review. You will be notified once it's processed.",
      });
    },
    onError: (error: any) => {
      console.error('Registration submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Hook for Super-Admin to fetch all official registrations
export const useOfficialRegistrations = (statusFilter?: string) => {
  return useQuery({
    queryKey: ['official-registrations', statusFilter],
    queryFn: async () => {
      console.log('Fetching official registrations, filter:', statusFilter);
      
      let query = supabase
        .from('officials')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching registrations:', error);
        throw error;
      }

      console.log('Fetched registrations:', data);
      return data as OfficialRegistration[];
    },
  });
};

// Hook for Super-Admin to approve an official
export const useApproveOfficial = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (officialId: string) => {
      console.log('Approving official:', officialId);
      
      const { error } = await supabase.rpc('approve_official', {
        official_id: officialId
      });

      if (error) {
        console.error('Error approving official:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['official-registrations'] });
      toast({
        title: "Official Approved",
        description: "The official registration has been approved. The official will need to complete their account setup by registering with their approved email.",
      });
    },
    onError: (error: any) => {
      console.error('Approval error:', error);
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve registration.",
        variant: "destructive",
      });
    },
  });
};

// Hook for Super-Admin to reject an official
export const useRejectOfficial = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ officialId, reason }: { officialId: string; reason?: string }) => {
      console.log('Rejecting official:', officialId, 'reason:', reason);
      
      const { error } = await supabase
        .from('officials')
        .update({
          status: 'rejected',
          is_approved: false,
          rejection_reason: reason || null,
          approved_by: null,
          approved_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', officialId);

      if (error) {
        console.error('Error rejecting official:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['official-registrations'] });
      toast({
        title: "Official Rejected",
        description: "The official registration has been rejected.",
      });
    },
    onError: (error: any) => {
      console.error('Rejection error:', error);
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject registration.",
        variant: "destructive",
      });
    },
  });
};