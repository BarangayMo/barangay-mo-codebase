
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUserApproval = () => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['user-approval', user?.id],
    queryFn: async () => {
      if (!user?.id) return { isApproved: false, canAddProducts: false };

      const { data, error } = await supabase
        .from('profiles')
        .select('is_approved, role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking approval status:', error);
        return { isApproved: false, canAddProducts: false };
      }

      const isApproved = data?.is_approved || false;
      const canAddProducts = isApproved && ['official', 'resident'].includes(data?.role || '');

      return { isApproved, canAddProducts };
    },
    enabled: isAuthenticated && !!user?.id,
  });
};
