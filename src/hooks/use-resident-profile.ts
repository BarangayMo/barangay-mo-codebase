
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
      setError(null);
      
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, barangay, role, created_at, updated_at')
        .eq('id', session.user.id)
        .maybeSingle();
        
      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw new Error(`Failed to fetch profile: ${profileError.message}`);
      }
      
      // Fetch settings data (optional)
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();
        
      if (settingsError) {
        console.warn("Settings fetch error (non-critical):", settingsError);
      }
      
      // Fetch user activities (optional)
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (activitiesError) {
        console.warn("Activities fetch error (non-critical):", activitiesError);
      }
      
      // Create profile object even if some data is missing
      setProfile({
        id: profileData?.id || session.user.id,
        first_name: profileData?.first_name || user?.firstName || '',
        last_name: profileData?.last_name || user?.lastName || '',
        email: user?.email || '',
        barangay: profileData?.barangay || '',
        settings: settingsData || undefined,
        activities: activitiesData || []
      });
      
    } catch (err) {
      console.error("Error fetching resident profile:", err);
      setError("Failed to load profile data");
      
      // Set basic profile data as fallback
      setProfile({
        id: session.user.id,
        first_name: user?.firstName || '',
        last_name: user?.lastName || '',
        email: user?.email || '',
        barangay: '',
        activities: []
      });
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
