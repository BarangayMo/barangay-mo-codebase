
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export function useSupabaseStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Supabase URL or key is missing');
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Try a simple query to check connection
        const { error } = await supabase.from('Barangays').select('count', { count: 'exact' }).limit(1);
        
        if (error) {
          throw error;
        }
        
        setIsConnected(true);
      } catch (err) {
        console.error('Error checking Supabase connection:', err);
        setError('Failed to connect to Supabase');
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSupabaseConnection();
  }, []);

  return { isConnected, isLoading, error };
}
