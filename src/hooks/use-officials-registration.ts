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

      // Debug: Check official record before approval
      console.log('🔍 Debugging official record before approval...');
      const officialRecord = await debugOfficialRecord(officialId);
      if (!officialRecord) {
        throw new Error('Official record not found');
      }

      // Use the existing approve-official Edge Function
      console.log('Calling approve-official Edge Function...');
      
      const { data: result, error } = await supabase.functions.invoke(
        'approve-official',
        {
          body: { official_id: officialId }
        }
      );

      console.log('🔍 Edge Function Response:');
      console.log('  - Data:', result);
      console.log('  - Error:', error);

      if (error) {
        console.error('❌ Approval error:', error);
        // Try to get more details from the error response
        let errorMessage = error.message || 'Failed to approve official';
        
        // If it's a 400 error, try to get the response body
        if (error.status === 400) {
          try {
            const errorResponse = await error.response?.json();
            if (errorResponse) {
              errorMessage = errorResponse.error || errorResponse.reason || errorMessage;
              console.error('❌ Detailed error response:', errorResponse);
            }
          } catch (parseError) {
            console.error('❌ Could not parse error response:', parseError);
          }
        }
        
        throw new Error(errorMessage);
      }

      if (result?.error) {
        console.error('❌ Approval error:', result.error);
        throw new Error(result.error || 'Failed to approve official');
      }

      if (result?.success) {
        console.log('✅ Official approved successfully:', result);
      }

      console.log('=== APPROVAL PROCESS COMPLETE ===');
      return result;
    },
    onSuccess: (data) => {
      console.log('🎉 Full approval result:', data);
      
      // Show success if the approval was successful
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['official-registrations'] });
        toast({
          title: "Official Approved",
          description: data.message || "The official registration has been approved and their account has been created successfully.",
        });
      } else {
        // Show error if approval failed
        toast({
          title: "Approval Failed",
          description: data.error || "Failed to approve the official registration.",
          variant: "destructive",
        });
      }
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
  console.log('Testing approve-official Edge Function with official_id:', officialId);

  const { data, error } = await supabase.functions.invoke(
    'approve-official',
    {
      body: { official_id: officialId }
    }
  );

  console.log('Edge Function test result:', { data, error });
  return { data, error };
};

// Debug function to check official record before approval
export const debugOfficialRecord = async (officialId: string) => {
  console.log('🔍 Debugging official record:', officialId);
  
  const { data: official, error } = await supabase
    .from('officials')
    .select('*')
    .eq('id', officialId)
    .single();
    
  if (error) {
    console.error('❌ Error fetching official:', error);
    return null;
  }
  
  console.log('✅ Official record found:', {
    id: official.id,
    email: official.email,
    status: official.status,
    is_approved: official.is_approved,
    user_id: official.user_id,
    password_hash: official.password_hash ? 'present' : 'missing',
    original_password: official.original_password ? 'present' : 'missing',
    created_at: official.created_at,
    updated_at: official.updated_at
  });
  
  return official;
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
