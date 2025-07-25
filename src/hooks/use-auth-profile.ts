
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/contexts/AuthContext';

export interface ProfileData {
  barangay?: string;
  municipality?: string;
  province?: string;
  officials_data?: any;
  logo_url?: string;
  createdAt?: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
}

export const useAuthProfile = (userId: string | null) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [rbiCompleted, setRbiCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setRbiCompleted(false);
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // Fetch user profile
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('barangay, created_at, role, first_name, last_name, municipality, province, officials_data, logo_url')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.warn('Profile fetch warning:', error);
        }

        const profile = {
          barangay: profileData?.barangay,
          municipality: profileData?.municipality,
          province: profileData?.province,
          officials_data: profileData?.officials_data,
          logo_url: profileData?.logo_url,
          createdAt: profileData?.created_at,
          role: profileData?.role,
          firstName: profileData?.first_name,
          lastName: profileData?.last_name
        };

        setProfile(profile);

        // Check RBI completion for residents only
        if (profileData?.role === 'resident') {
          const { data: rbiForms, error: rbiError } = await supabase
            .from('rbi_forms')
            .select('id, status')
            .eq('user_id', userId)
            .order('submitted_at', { ascending: false })
            .limit(1);

          if (rbiError) {
            console.warn('RBI check warning:', rbiError);
          }

          setRbiCompleted(rbiForms && rbiForms.length > 0);
        } else {
          setRbiCompleted(true); // Non-residents don't need RBI
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, rbiCompleted, setRbiCompleted, isLoading };
};
