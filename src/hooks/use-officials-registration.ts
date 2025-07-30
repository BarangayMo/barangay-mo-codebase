/ Fixed useSubmitOfficialRegistration hook
export const useSubmitOfficialRegistration = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: OfficialRegistration) => {
      console.log('Submitting registration:', data);
      
      // Clean the data
      const cleanData = {
        first_name: data.first_name?.trim() || '',
        middle_name: data.middle_name?.trim() || undefined,
        last_name: data.last_name?.trim() || '',
        suffix: data.suffix?.trim() || undefined,
        phone_number: data.phone_number?.trim() || '',
        landline_number: data.landline_number?.trim() || undefined,
        email: data.email?.trim() || '',
        position: data.position?.trim() || '',
        password: data.password?.trim() || '',
        barangay: data.barangay?.trim() || '',
        municipality: data.municipality?.trim() || '',
        province: data.province?.trim() || '',
        region: data.region?.trim() || ''
      };

      // Call the edge function with proper error handling
      const { data: result, error } = await supabase.functions.invoke(
        'submit-official-registration',
        {
          body: cleanData,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (error) {
        console.error('Edge function error:', error);
        
        // Handle different types of errors
        if (error.message?.includes('Failed to fetch')) {
          throw new Error('Network error. Please check your connection and try again.');
        }
        
        if (error.context?.status === 409) {
          throw new Error('An account with this email already exists.');
        }
        
        if (error.context?.status === 400) {
          throw new Error(error.message || 'Please check your input and try again.');
        }
        
        throw new Error(error.message || 'Failed to submit registration');
      }

      // Check if the result indicates an error
      if (result?.error) {
        throw new Error(result.message || result.error);
      }

      return result;
    },
    onSuccess: () => {
      toast({
        title: "Registration Submitted",
        description: "Your registration has been submitted for review.",
      });
    },
    onError: (error: Error) => {
      console.error('Registration error:', error);
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
