
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
      // First get the membership requests
      const { data: requests, error: requestsError } = await supabase
        .from('barangay_membership_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (requestsError) throw requestsError;

      if (!requests || requests.length === 0) {
        return [];
      }

      // Get user IDs from requests
      const userIds = requests.map(request => request.user_id);

      // Get user profiles for those user IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, role')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Create a map of profiles for easy lookup
      const profilesMap = new Map(profiles?.map(profile => [profile.id, profile]) || []);

      // Combine requests with profile data
      return requests.map(request => {
        const profile = profilesMap.get(request.user_id);
        return {
          ...request,
          user_email: profile?.email,
          user_first_name: profile?.first_name,
          user_last_name: profile?.last_name,
          user_role: profile?.role,
        } as MembershipRequest;
      });
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
