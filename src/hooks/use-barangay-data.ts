
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useBarangayData = () => {
  const [barangays, setBarangays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBarangays = async () => {
      try {
        const { data, error } = await supabase
          .from('Barangays')
          .select('BARANGAY')
          .order('BARANGAY');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const uniqueBarangays = [...new Set(data.map(item => item.BARANGAY))];
          setBarangays(uniqueBarangays);
        }
      } catch (err) {
        console.error('Error fetching barangay data:', err);
        setError('Failed to load barangay data');
        setBarangays([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarangays();
  }, []);

  return { barangays, isLoading, error };
};
