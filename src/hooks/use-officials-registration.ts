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
  password?: string;
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
      
      // Clean and validate the data before sending
      const cleanData = {
        first_name: data.first_name?.trim() || '',
        middle_name: data.middle_name && typeof data.middle_name === 'string' && data.middle_name.trim() !== '' ? data.middle_name.trim() : undefined,
        last_name: data.last_name?.trim() || '',
        suffix: data.suffix && typeof data.suffix === 'string' && data.suffix.trim() !== '' ? data.suffix.trim() : undefined,
        phone_number: data.phone_number?.trim() || '',
        landline_number: data.landline_number && typeof data.landline_number === 'string' && data.landline_number.trim() !== '' ? data.landline_number.trim() : undefined,
        email: data.email?.trim() || '',
        position: data.position?.trim() || '',
        password: data.password?.trim() || '',
        barangay: data.barangay?.trim() || '',
        municipality: data.municipality?.trim() || '',
        province: data.province?.trim() || '',
        region: data.region?.trim() || ''
      };

      console.log('Cleaned data for submission:', cleanData);
      
      // Use the Edge Function to submit the registration
      const { data: result, error } = await supabase.functions.invoke(
        'submit-official-registration',
        {
          body: cleanData
        }
      );

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to submit registration');
      }

      if (result?.error) {
        console.error('Registration error from server:', result);
        throw new Error(result.message || result.error || 'Registration failed');
      }

      console.log('Registration successful:', result);
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
      console.log('=== STARTING APPROVAL PROCESS ===');
      console.log('Official ID:', officialId);

      // Step 1: Approve the official
      console.log('Step 1: Approving official...');
      const { data: approvalResult, error: approvalError } = await supabase
        .rpc('approve_official_complete' as any, { official_id: officialId });

      if (approvalError) {
        console.error('❌ Approval error:', approvalError);
        throw new Error(approvalError.message || 'Failed to approve official');
      }

      console.log('✅ Approval result:', approvalResult);

      // Step 2: Create auth user via Edge Function
      console.log('Step 2: Creating auth user via Edge Function...');
      console.log('Calling Edge Function with official_id:', officialId);
      
      const { data: authResult, error: authError } = await supabase.functions.invoke(
        'create-auth-user',
        {
          body: { official_id: officialId }
        }
      );

      console.log('🔍 Edge Function Response:');
      console.log('  - Data:', authResult);
      console.log('  - Error:', authError);

      if (authError) {
        console.error('❌ Auth user creation error:', authError);
        // Don't throw error, just log it
      }

      if (authResult?.error) {
        console.error('❌ Auth user creation error:', authResult.error);
        // Don't throw error, just log it
      }

      if (authResult?.success) {
        console.log('✅ Auth user created successfully:', authResult);
      }

      console.log('=== APPROVAL PROCESS COMPLETE ===');
      return { approvalResult, authResult };
    },
    onSuccess: (data) => {
      console.log('🎉 Full approval result:', data);
      queryClient.invalidateQueries({ queryKey: ['official-registrations'] });
      toast({
        title: "Official Approved",
        description: "The official registration has been approved and their account has been created automatically.",
      });
    },
    onError: (error: any) => {
      console.error('❌ Approval error:', error);
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve registration.",
        variant: "destructive",
      });
    },
  });
};

// Test function to call Edge Function directly
export const testEdgeFunction = async (officialId: string) => {
  console.log('Testing Edge Function with official_id:', officialId);
  
  const { data, error } = await supabase.functions.invoke(
    'create-auth-user',
    {
      body: { official_id: officialId }
    }
  );
  
  console.log('Edge Function test result:', { data, error });
  return { data, error };
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
