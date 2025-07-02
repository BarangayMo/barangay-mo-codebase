
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSupabaseStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        // Try a simple query to check connection - use collections table which has public read access
        const { error } = await supabase.from('collections').select('count', { count: 'exact' }).limit(1);
        
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
