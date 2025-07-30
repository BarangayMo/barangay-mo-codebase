
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useRbiForms } from "@/hooks/use-rbi-forms";

export function useBarangayOfficial() {
  const { user, userRole } = useAuth();
  const { rbiForms } = useRbiForms();
  
  // Get barangay from approved RBI form and the reviewer
  const approvedRbi = rbiForms?.find(form => form.status === 'approved');
  const userBarangay = approvedRbi ? 
    (approvedRbi.form_data as any)?.address?.barangay || user?.barangay :
    user?.barangay;

  return useQuery({
    queryKey: ['barangay-official', userBarangay, approvedRbi?.reviewed_by],
    queryFn: async () => {
      console.log('useBarangayOfficial - Query starting:', {
        userBarangay: userBarangay,
        userRole: userRole,
        userId: user?.id,
        approvedRbiBarangay: approvedRbi ? (approvedRbi.form_data as any)?.address?.barangay : null,
        reviewedBy: approvedRbi?.reviewed_by
      });

      if (!userBarangay || userRole !== 'resident') {
        console.log('useBarangayOfficial - Skipping query: no barangay or not resident');
        return null;
      }

      // If we have an approved RBI form with a reviewer, fetch that specific official
      if (approvedRbi?.reviewed_by) {
        console.log('useBarangayOfficial - Fetching specific reviewer:', approvedRbi.reviewed_by);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, avatar_url, barangay, role, is_approved')
          .eq('id', approvedRbi.reviewed_by)
          .eq('role', 'official')
          .single();

        if (error) {
          console.error('Error fetching specific reviewer:', error);
          // Fall back to any official in the barangay
        } else if (data) {
          console.log('useBarangayOfficial - Found reviewer:', data);
          return data;
        }
      }

      // Fallback: Get any approved official in the barangay
      console.log('useBarangayOfficial - Fetching fallback official in barangay');
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url, barangay, role, is_approved')
        .eq('barangay', userBarangay)
        .eq('role', 'official')
        .eq('is_approved', true)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      console.log('useBarangayOfficial - Fallback query result:', {
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
