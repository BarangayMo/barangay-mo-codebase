
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useRbiForms } from "@/hooks/use-rbi-forms";

export function useBarangayOfficial() {
  const { user, userRole } = useAuth();
  const { rbiForms } = useRbiForms();
  
  // Get barangay from approved RBI form
  const approvedRbi = rbiForms?.find(form => form.status === 'approved');
  const userBarangay = approvedRbi ? 
    (approvedRbi.form_data as any)?.address?.barangay || user?.barangay :
    user?.barangay;

  return useQuery({
    queryKey: ['barangay-official', userBarangay],
    queryFn: async () => {
      console.log('useBarangayOfficial - Query starting:', {
        userBarangay: userBarangay,
        userRole: userRole,
        userId: user?.id,
        approvedRbiBarangay: approvedRbi ? (approvedRbi.form_data as any)?.address?.barangay : null
      });

      if (!userBarangay || userRole !== 'resident') {
        console.log('useBarangayOfficial - Skipping query: no barangay or not resident');
        return null;
      }

      // First, let's check what officials exist for this barangay
      const { data: officialCheck } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url, barangay, role, is_approved')
        .eq('barangay', userBarangay)
        .eq('role', 'official');

      console.log('useBarangayOfficial - Available officials in barangay:', {
        userBarangay: userBarangay,
        officials: officialCheck
      });

      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url, barangay, role, is_approved')
        .eq('barangay', userBarangay)
        .eq('role', 'official')
        .eq('is_approved', true)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      console.log('useBarangayOfficial - Query result:', {
        data,
        error,
        userBarangay: userBarangay
      });

      if (error) {
        console.error('Error fetching barangay official:', error);
        throw error;
      }

      return data;
    },
    enabled: !!userBarangay && userRole === 'resident',
  });
}
