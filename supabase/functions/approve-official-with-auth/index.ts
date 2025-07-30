export const useApproveOfficial = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (officialId: string) => {
      console.log('Approving official:', officialId);
      
      // Use the updated edge function that creates auth user with proper role
      const { data: result, error } = await supabase.functions.invoke(
        'approve-official-with-auth',
        {
          body: { official_id: officialId }
        }
      );

      if (error) {
        console.error('Error approving official:', error);
        throw new Error(error.message || 'Failed to approve official');
      }

      if (result?.error || result?.success === false) {
        console.error('Approval error from server:', result);
        throw new Error(result.error || result.message || 'Approval failed');
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['official-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['officials'] });
      toast({
        title: "Official Approved",
        description: "The official registration has been approved and an account has been created with proper official role. The official can now login with their original password.",
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
