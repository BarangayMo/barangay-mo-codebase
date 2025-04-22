
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBarangayData = () => {
  const [barangays, setBarangays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBarangays = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching barangay data from Supabase...");
      
      const { data, error } = await supabase
        .from('Barangays')
        .select('BARANGAY')
        .order('BARANGAY');
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Barangay data received:", data);
      
      if (data && data.length > 0) {
        const uniqueBarangays = [...new Set(data.map(item => item.BARANGAY).filter(Boolean))];
        console.log("Unique barangays:", uniqueBarangays);
        setBarangays(uniqueBarangays);
      } else {
        setBarangays([]);
      }
    } catch (err) {
      console.error('Error fetching barangay data:', err);
      setError('Failed to load barangay data');
      setBarangays([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBarangays();
  }, []);

  return { barangays, isLoading, error, refetch: fetchBarangays };
};
