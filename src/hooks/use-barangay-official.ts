import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useBarangayOfficial() {
  const { user, userRole } = useAuth();

  return useQuery({
    queryKey: ['barangay-official', user?.barangay],
    queryFn: async () => {
      if (!user?.barangay || userRole !== 'resident') {
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url')
        .eq('barangay', user.barangay)
        .eq('role', 'official')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching barangay official:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.barangay && userRole === 'resident',
  });
}