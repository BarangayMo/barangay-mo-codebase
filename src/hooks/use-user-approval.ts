
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUserApproval = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-approval', user?.id],
    queryFn: async () => {
      if (!user?.id) return { isApproved: false };
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_approved')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      return { isApproved: data?.is_approved || false };
    },
    enabled: !!user?.id,
  });
};
