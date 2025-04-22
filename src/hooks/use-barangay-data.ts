
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create client only if URL and key are available
const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const useBarangayData = () => {
  const [barangays, setBarangays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBarangays = async () => {
      try {
        // Check if supabase client is initialized
        if (!supabase) {
          throw new Error('Supabase client not initialized. Missing environment variables.');
        }
        
        const { data, error } = await supabase
          .from('Barangays')
          .select('Barangay')
          .order('Barangay');
        
        if (error) {
          throw error;
        }
        
        // Extract unique barangay names
        if (data) {
          const uniqueBarangays = [...new Set(data.map(item => item.Barangay))];
          setBarangays(uniqueBarangays);
        }
      } catch (err) {
        console.error('Error fetching barangay data:', err);
        setError('Failed to load barangay data');
        // Provide fallback data in case of error
        setBarangays([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarangays();
  }, []);

  return { barangays, isLoading, error };
};
