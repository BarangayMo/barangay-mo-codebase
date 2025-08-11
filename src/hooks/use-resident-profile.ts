
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/components/users/profile/types";

export function useResidentProfile() {
  const { user, session } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, barangay, role, created_at, updated_at')
        .eq('id', session.user.id)
        .single();
        
      if (profileError) throw profileError;
      
      // Fetch settings data
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();
        
      if (settingsError) throw settingsError;
      
      // Fetch user activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (activitiesError) throw activitiesError;
      
      // Fetch approved RBI form to get barangay information
      const { data: rbiData, error: rbiError } = await supabase
        .from('rbi_forms')
        .select('form_data, rbi_number')
        .eq('user_id', session.user.id)
        .eq('status', 'approved')
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (rbiError) {
        console.error('Error fetching RBI data:', rbiError);
      }
      
      // Extract barangay from RBI form if available
      let barangayFromRbi = null;
      if (rbiData?.form_data) {
        const formData = rbiData.form_data as any;
        barangayFromRbi = formData.address?.barangay || null;
      }
      
      setProfile({
        id: profileData.id,
        first_name: profileData.first_name || user?.firstName || '',
        last_name: profileData.last_name || user?.lastName || '',
        email: user?.email || '',
        barangay: barangayFromRbi || profileData.barangay || '',
        settings: settingsData || undefined,
        activities: activitiesData || []
      });
      
    } catch (err) {
      console.error("Error fetching resident profile:", err);
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, user]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const mutate = () => {
    fetchUserProfile();
  };

  return { profile, isLoading, error, mutate };
}
