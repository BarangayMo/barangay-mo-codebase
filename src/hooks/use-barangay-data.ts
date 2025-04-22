
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Add a fallback list of barangays in case the API fails
const FALLBACK_BARANGAYS = [
  "Abucay", "Aguinaldo", "Alangan", "Bagumbayan", "Balibago", 
  "Camilmil", "Dau", "East Bajac-Bajac", "Gordon Heights", "Kalaklan",
  "Mabayuan", "Malabanias", "New Cabalan", "Old Cabalan", "Pag-asa",
  "Pamatawan", "Pandan", "Poblacion", "Sabang", "San Antonio",
  "Santa Rita", "Santo Tomas", "Tabacuhan", "West Bajac-Bajac", "West Tapinac"
];

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
          console.log("No barangay data found in database, using fallback data");
          setBarangays(FALLBACK_BARANGAYS);
          toast("Using sample barangay data as actual data couldn't be retrieved");
        }
      } catch (err) {
        console.error('Error fetching barangay data:', err);
        setError('Failed to load barangay data, using fallback data instead');
        setBarangays(FALLBACK_BARANGAYS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarangays();
  }, []);

  return { barangays, isLoading, error };
};
