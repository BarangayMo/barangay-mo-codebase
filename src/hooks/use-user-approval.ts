
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUserApproval = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-approval', user?.id],
    queryFn: async () => {
      if (!user?.id) return { isApproved: false };
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_approved')
          .eq('id', user.id)
          .single();

        if (error) {
          // If column doesn't exist yet, assume not approved
          if (error.message?.includes('column "is_approved" does not exist')) {
            return { isApproved: false };
          }
          throw error;
        }
        
        return { isApproved: data?.is_approved || false };
      } catch (error) {
        console.error('Error checking user approval:', error);
        return { isApproved: false };
      }
    },
    enabled: !!user?.id,
  });
};
