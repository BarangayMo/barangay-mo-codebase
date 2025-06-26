
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface RbiForm {
  id: string;
  rbi_number: string | null;
  status: string;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  form_data: any;
}

export function useRbiForms() {
  const { user } = useAuth();
  const [rbiForms, setRbiForms] = useState<RbiForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRbiForms = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('rbi_forms')
        .select('id, rbi_number, status, submitted_at, reviewed_at, reviewed_by, form_data')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      
      setRbiForms(data || []);
    } catch (err) {
      console.error('Error fetching RBI forms:', err);
      setError('Failed to load RBI forms');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRbiForms();
  }, [user?.id]);

  const mutate = () => {
    fetchRbiForms();
  };

  return {
    rbiForms,
    isLoading,
    error,
    mutate
  };
}
