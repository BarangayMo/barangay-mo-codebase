
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfileData {
  id: string;
  first_name: string;
  last_name: string;
  barangay: string | null;
  municipality: string | null;
  province: string | null;
  region: string | null;
  phone_number: string | null;
  avatar_url: string | null;
  logo_url: string | null;
  officials_data: any;
  role: string;
  created_at: string;
}

export function useUserProfile() {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        
        setProfile(data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [session?.user?.id]);

  return { profile, isLoading, error };
}
