
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useBarangayData = () => {
  const [barangays, setBarangays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBarangays = async () => {
      try {
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
          console.log("No barangay data found, using fallback data");
          // Provide some fallback data
          setBarangays([
            "Barangay New Cabalan",
            "Barangay West Bajac-Bajac", 
            "Barangay East Bajac-Bajac",
            "Barangay Barretto",
            "Barangay Gordon Heights"
          ]);
        }
      } catch (err) {
        console.error('Error fetching barangay data:', err);
        setError('Failed to load barangay data');
        // Provide some fallback data
        setBarangays([
          "Barangay New Cabalan",
          "Barangay West Bajac-Bajac", 
          "Barangay East Bajac-Bajac",
          "Barangay Barretto",
          "Barangay Gordon Heights"
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarangays();
  }, []);

  return { barangays, isLoading, error };
};
