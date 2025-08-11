import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useRoleInitialization() {
  const { user, userRole } = useAuth();

  useEffect(() => {
    const initializeRole = async () => {
      if (!user?.id || !user?.email) return;

      try {
        // Check if user is an approved official who needs role correction
        const { data: official } = await supabase
          .from('officials')
          .select('id, user_id, status, is_approved')
          .eq('email', user.email)
          .eq('status', 'approved')
          .eq('is_approved', true)
          .maybeSingle();

        if (official && userRole !== 'official') {
          console.log('Official detected with incorrect role, updating profile...');
          
          // Update profile to have correct role
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'official' })
            .eq('id', user.id);

          if (updateError) {
            console.error('Error updating official role:', updateError);
          } else {
            console.log('Official role updated successfully');
            // Refresh the page to update auth context
            window.location.reload();
          }
        }
      } catch (error) {
        console.error('Error during role initialization:', error);
      }
    };

    initializeRole();
  }, [user?.id, user?.email, userRole]);
}