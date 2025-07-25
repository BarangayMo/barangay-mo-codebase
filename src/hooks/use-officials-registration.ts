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
  const [isSubmitting, setIsSubmitting] = useState(false);

  return useMutation({
    mutationFn: async (data: OfficialRegistration) => {
      // Prevent multiple simultaneous submissions
      if (isSubmitting) {
        throw new Error('Registration is already being submitted. Please wait.');
      }
      
      setIsSubmitting(true);
      
      try {
        console.log('Submitting official registration:', data);
        
        // Clean and validate the data before sending - ensure optional fields are null, not undefined
        const cleanData = {
          // Required fields
          first_name: data.first_name?.trim() || '',
          last_name: data.last_name?.trim() || '',
          phone_number: data.phone_number?.trim() || '',
          email: data.email?.trim() || '',
          position: data.position?.trim() || '',
          
          // Optional fields - send as null if empty, handle undefined properly
          middle_name: (data.middle_name && typeof data.middle_name === 'string' && data.middle_name.trim() !== '') ? data.middle_name.trim() : null,
          suffix: (data.suffix && typeof data.suffix === 'string' && data.suffix.trim() !== '') ? data.suffix.trim() : null,
          
          // These may be filled by location/form data later
          password: (data.password && typeof data.password === 'string' && data.password.trim() !== '') ? data.password.trim() : null,
          barangay: (data.barangay && typeof data.barangay === 'string' && data.barangay.trim() !== '') ? data.barangay.trim() : null,
          municipality: (data.municipality && typeof data.municipality === 'string' && data.municipality.trim() !== '') ? data.municipality.trim() : null,
          province: (data.province && typeof data.province === 'string' && data.province.trim() !== '') ? data.province.trim() : null,
          region: (data.region && typeof data.region === 'string' && data.region.trim() !== '') ? data.region.trim() : null,
          landline_number: (data.landline_number && typeof data.landline_number === 'string' && data.landline_number.trim() !== '') ? data.landline_number.trim() : null
        };

      
        console.log('Cleaned data for submission:', cleanData);
        
        // Debug: Check what we're actually sending
        const bodyString = JSON.stringify(cleanData);
        console.log('JSON body string:', bodyString);
        console.log('Body string length:', bodyString.length);
      
        // Use the Edge Function to submit the registration
        const { data: result, error } = await supabase.functions.invoke(
          'submit-official-registration',
          {
            body: cleanData,  // Don't stringify here - let Supabase handle it
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        console.log('Supabase invoke result:', result);
        console.log('Supabase invoke error:', error);

        if (error) {
          console.error('Edge function error:', error);
          
          // Try to get detailed error information from the response
          let errorDetails = null;
          let detailedErrorMessage = 'Failed to submit registration';
          
          try {
            // For FunctionsHttpError, we need to access the response differently
            if (error.name === 'FunctionsHttpError' && result) {
              // The result might contain the error response even when there's an error
              errorDetails = result;
            } else if (error.context) {
              errorDetails = error.context.body || error.context;
            }
            
            if (errorDetails) {
              console.error('Full Edge Function response details:', errorDetails);
              
              // Extract the error message from the response
              if (typeof errorDetails === 'object') {
                detailedErrorMessage = errorDetails.message || errorDetails.error || detailedErrorMessage;
                
                // Check for specific duplicate errors
                if (errorDetails.error === 'Official already exists' || 
                    errorDetails.message?.includes('already exists') ||
                    errorDetails.message?.includes('duplicate')) {
                  detailedErrorMessage = errorDetails.message || 'An official with this email already exists in this barangay.';
                }
              } else if (typeof errorDetails === 'string') {
                detailedErrorMessage = errorDetails;
              }
            }
          } catch (parseError) {
            console.error('Failed to parse error response:', parseError);
          }
          
          // Handle rate limiting (429 errors)
          if (error.message?.includes('429') || error.message?.includes('rate limit')) {
            console.error('Rate limit reached - registration submission throttled');
            throw new Error('Too many registration attempts. Please wait a moment before trying again.');
          }
          
          console.error('Detailed error message:', detailedErrorMessage);
          throw new Error(detailedErrorMessage);
        }

        if (result?.error || result?.success === false) {
          console.error('Registration error from server:', result);
          const errorMessage = result.message || result.error || 'Registration failed';
          throw new Error(errorMessage);
        }

        console.log('Registration successful:', result);
        return result;
      } finally {
        setIsSubmitting(false);
      }
    },
    retry: (failureCount, error: any) => {
      // Don't retry on validation errors (400) or rate limiting (429)
      if (error.message?.includes('rate limit') || 
          error.message?.includes('Missing required fields') ||
          error.message?.includes('Invalid email format') ||
          error.message?.includes('Password too weak') ||
          error.message?.includes('already registered') ||
          error.message?.includes('already exists')) {
        return false;
      }
      // Only retry network/server errors up to 2 times
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    onSuccess: () => {
      setIsSubmitting(false);
      toast({
        title: "Registration Submitted",
        description: "Your official registration has been submitted for review. You will be notified once it's processed.",
      });
    },
    onError: (error: any) => {
      setIsSubmitting(false);
      console.error('Registration submission error:', error);
      
      let errorMessage = error.message || "Failed to submit registration. Please try again.";
      
      // Provide specific guidance for rate limiting
      if (error.message?.includes('rate limit')) {
        errorMessage = "Too many attempts. Please wait a few minutes before trying again.";
      }
      
      toast({
        title: "Submission Failed",
        description: errorMessage,
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
      
      // Use the Edge Function to approve the official
      const { data: result, error } = await supabase.functions.invoke(
        'approve-official',
        {
          body: { official_id: officialId }
        }
      );

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to approve official');
      }

      if (result?.error) {
        console.error('Approval error from server:', result);
        throw new Error(result.message || result.error || 'Approval failed');
      }

      console.log('Official approved successfully:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['official-registrations'] });
      toast({
        title: "Official Approved",
        description: "The official registration has been approved. An email verification has been sent to the official.",
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
      
      // Use the Edge Function to reject the official
      const { data: result, error } = await supabase.functions.invoke(
        'reject-official',
        {
          body: { 
            official_id: officialId,
            reason: reason || undefined
          }
        }
      );

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to reject official');
      }

      if (result?.error) {
        console.error('Rejection error from server:', result);
        throw new Error(result.message || result.error || 'Rejection failed');
      }

      console.log('Official rejected successfully:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['official-registrations'] });
      toast({
        title: "Official Rejected",
        description: "The official registration has been rejected and the authentication account has been disabled.",
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