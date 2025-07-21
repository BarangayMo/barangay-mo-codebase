
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface MembershipRequest {
  id: string;
  user_id: string;
  barangay_name: string;
  status: 'pending' | 'approved' | 'rejected';
  request_message: string | null;
  admin_notes: string | null;
  requested_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  // User profile data
  user_email?: string;
  user_first_name?: string;
  user_last_name?: string;
  user_role?: string;
}

export const useMembershipRequests = () => {
  return useQuery({
    queryKey: ['membership-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('barangay_membership_requests')
        .select(`
          *,
          profiles!inner(
            email,
            first_name,
            last_name,
            role
          )
        `)
        .order('requested_at', { ascending: false });

      if (error) throw error;

      return data?.map(request => ({
        ...request,
        user_email: request.profiles?.email,
        user_first_name: request.profiles?.first_name,
        user_last_name: request.profiles?.last_name,
        user_role: request.profiles?.role,
      })) as MembershipRequest[] || [];
    },
  });
};

export const useApproveMembershipRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ requestId, approve, adminNotes }: { 
      requestId: string; 
      approve: boolean; 
      adminNotes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Update the membership request
      const { data: requestData, error: requestError } = await supabase
        .from('barangay_membership_requests')
        .update({
          status: approve ? 'approved' : 'rejected',
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
        })
        .eq('id', requestId)
        .select('user_id')
        .single();

      if (requestError) throw requestError;

      // If approved, also approve the user's profile
      if (approve && requestData?.user_id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ is_approved: true })
          .eq('id', requestData.user_id);

        if (profileError) throw profileError;
      }

      return requestData;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['membership-requests'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: variables.approve ? "Request approved" : "Request rejected",
        description: `Membership request has been ${variables.approve ? 'approved' : 'rejected'} successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to process membership request. Please try again.",
        variant: "destructive",
      });
      console.error('Membership request error:', error);
    },
  });
};
