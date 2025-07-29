import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useBarangayOfficial() {
  const { user, userRole } = useAuth();

  return useQuery({
    queryKey: ['barangay-official', user?.barangay],
    queryFn: async () => {
      console.log('useBarangayOfficial - Query starting:', {
        userBarangay: user?.barangay,
        userRole: userRole,
        userId: user?.id
      });

      if (!user?.barangay || userRole !== 'resident') {
        console.log('useBarangayOfficial - Skipping query: no barangay or not resident');
        return null;
      }

      // First, let's check what officials exist for this barangay
      const { data: officialCheck } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url, barangay, role, is_approved')
        .eq('barangay', user.barangay)
        .eq('role', 'official');

      console.log('useBarangayOfficial - Available officials in barangay:', {
        userBarangay: user.barangay,
        officials: officialCheck
      });

      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url, barangay, role, is_approved')
        .eq('barangay', user.barangay)
        .eq('role', 'official')
        // Temporarily remove is_approved filter to test
        // .eq('is_approved', true)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      console.log('useBarangayOfficial - Query result:', {
        data,
        error,
        userBarangay: user.barangay
      });

      if (error) {
        console.error('Error fetching barangay official:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.barangay && userRole === 'resident',
  });
}
